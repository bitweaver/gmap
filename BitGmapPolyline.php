<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/BitGmapPolyline.php,v 1.11 2008/07/18 04:31:01 wjames5 Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 */
 
/**
 * required setup
 */
require_once( GMAP_PKG_PATH.'BitGmapOverlayBase.php' );

/**
* This is used to uniquely identify the object
*/
define( 'BITGMAPPOLYLINE_CONTENT_TYPE_GUID', 'bitgmappolyline' );


/**
 * class BitGmapPolyline
 * this is the class that contains all the functions for the package
 * 
 * @package gmap
 */
class BitGmapPolyline extends BitGmapOverlayBase {

	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapPolyline( $pOverlayId=NULL, $pContentId=NULL ) {
		parent::BitGmapOverlayBase();
		$this->mOverlayId = $pOverlayId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPPOLYLINE_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPPOLYLINE_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPPOLYLINE_CONTENT_TYPE_GUID,
			'content_description' => 'Map Polyline',
			'handler_class' => 'BitGmapPolyline',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapPolyline.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		$this->mOverlayType = 'polyline';
		$this->mOverlayTable = 'gmaps_polylines';
		$this->mOverlayKeychainTable = 'gmaps_polyline_keychain';
		$this->mOverlaySeq = 'gmaps_polylines_polyline_id_seq';
	}


	function verify( &$pParamHash ) {

		$pParamHash['overlay_store'] = array();
		$pParamHash['keychain_store'] = array();

		if( !empty( $pParamHash['type'] ) ) {
			$pParamHash['overlay_store']['type'] = $pParamHash['type'];
		}

		if( !empty( $pParamHash['poly_data'] ) ) {
			$pParamHash['overlay_store']['poly_data'] = $pParamHash['poly_data'];
		}

		if( !empty( $pParamHash['levels_data'] ) ) {
			$pParamHash['overlay_store']['levels_data'] = $pParamHash['levels_data'];
		}

		if( isset( $pParamHash['zoom_factor'] ) && is_numeric( $pParamHash['zoom_factor'] ) ) {
			$pParamHash['overlay_store']['zoom_factor'] = $pParamHash['zoom_factor'];
		}

		if( isset( $pParamHash['num_levels'] ) && is_numeric( $pParamHash['num_levels'] ) ) {
			$pParamHash['overlay_store']['num_levels'] = $pParamHash['num_levels'];
		}

		// set values for updating the polyline keychain
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}

		return( count( $this->mErrors ) == 0 );
	}
	
	
	//returns array of polyline data and associated style ids for given gmap_id and/or set_id
	function getList( &$pListHash ) {
		global $gBitUser, $gBitSystem;
		
		$this->prepGetList( $pListHash );
		
		$ret = NULL;
		
		$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
		array_push( $bindVars, $this->mContentTypeGuid );
		
		$this->getServicesSql( 'content_list_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

		if( @$this->verifyId( $pListHash['gmap_id'] ) || isset( $pListHash['set_id'] )) {
			$selectSql .= ", gpk.*, gps.`set_id`, gps.`style_id` ";
			
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_keychain` gpk ON (gp.`polyline_id` = gpk.`polyline_id`) "; 
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_sets` gps ON (gpk.`set_id` = gps.`set_id`) ";
		}

		if ( isset( $pListHash['set_id'] ) ){
			if (!is_array( $pListHash['set_id'] ) && is_numeric( $pListHash['set_id'] ) ){
				$sets = array( $pListHash['set_id'] );
			}elseif (is_array( $pListHash['set_id'] ) ){
				$sets = $pListHash['set_id'];
			}
			$hasOne = FALSE;
			foreach( $sets as $value ){
				if ( @$this->verifyId( $value ) ){
					if ( $hasOne != TRUE ){
						$whereSql .= " AND ( gpk.`set_id` = ? "; 
						$hasOne = TRUE;
					}else{
						$whereSql .= " OR gpk.`set_id` = ? "; 
					}
					array_push( $bindVars, (int)$value );
				}
			}
			if ($hasOne == TRUE){
				$whereSql .= " ) "; 
			}
		}
		
		if( @$this->verifyId( $pListHash['gmap_id'] ) ) {
			$selectSql .= ", gsk.* ";
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON( gps.`set_id` = gsk.`set_id`) ";
			$whereSql .= " AND gsk.`set_type` = 'polylines' AND gsk.`gmap_id` = ? "; 
			array_push( $bindVars, (int)$pListHash['gmap_id'] );
		}
		
		//$pListHash['sort_mode'] = 'date_added_desc';
		$sortModePrefix = 'lc.';
		$sort_mode = $sortModePrefix . $this->mDb->convertSortmode( $pListHash['sort_mode'] );

		$query = "SELECT lc.*, gp.*, 
				  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
				  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
				  FROM `".BIT_DB_PREFIX."gmaps_polylines` gp 
					INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON( gp.`content_id`=lc.`content_id` ) $joinSql
					LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
					LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
				  WHERE lc.`content_type_guid` = ? $whereSql
				  ORDER BY $sort_mode";

		$query_cant = "
			SELECT COUNT( * )
		    FROM `".BIT_DB_PREFIX."gmaps_polylines` gp 
				INNER JOIN      `".BIT_DB_PREFIX."liberty_content`       lc ON lc.`content_id` = gp.`content_id`
				INNER JOIN		`".BIT_DB_PREFIX."users_users`			 uu ON uu.`user_id`			   = lc.`user_id`
				$joinSql
			WHERE lc.`content_type_guid` = ? $whereSql ";

		$result = $this->mDb->query($query,$bindVars,$pListHash['max_records'],$pListHash['offset']);
		$cant = $this->mDb->getOne($query_cant,$bindVars);
		
		$ret = array();
		while( $res = $result->fetchRow() ) {
			$ret[] = $res;
		}
		
		$pListHash["data"] = $ret;
		$pListHash["cant"] = $cant;

		LibertyContent::postGetList( $pListHash );

		return $pListHash;
	}		
}
?>
