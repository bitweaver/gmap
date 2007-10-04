<?php
/**
 * BitGmapPolygon Class
 *
 * @package gmap
 * @subpackage BitGmapPolygon
 *
 * @author will <will@onnyturf.com>
 *
 * @version v.0
 *
 * Copyright (c) 2005,2006,2007 bitweaver.org, Will James
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 *
 */

/**
 * required setup
 */

require_once( GMAP_PKG_PATH.'BitGmapOverlayBase.php' );

/**
* This is used to uniquely identify the object
*/
define( 'BITGMAPPOLYGON_CONTENT_TYPE_GUID', 'bitgmappolygon' );


// this is the class that contains all the functions for the package
class BitGmapPolygon extends BitGmapOverlayBase {

	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapPolygon( $pOverlayId=NULL, $pContentId=NULL ) {
		parent::BitGmapOverlayBase();
		$this->mOverlayId = $pOverlayId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPPOLYGON_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPPOLYGON_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPPOLYGON_CONTENT_TYPE_GUID,
			'content_description' => 'Polygon for Google Map',
			'handler_class' => 'BitGmapPolygon',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapPolygon.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		$this->mOverlayType = 'polygon';
		$this->mOverlayTable = 'gmaps_polygons';
		$this->mOverlayKeychainTable = 'gmaps_polygon_keychain';
		$this->mOverlaySeq = 'gmaps_polygons_polygon_id_seq';
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
		
		if( !empty( $pParamHash['circle_center'] ) || $pParamHash['circle_center'] == 0 ) {
			$pParamHash['overlay_store']['circle_center'] = $pParamHash['circle_center'];
		}

		if( !empty( $pParamHash['radius'] ) || $pParamHash['radius'] == 0 ) {
			$pParamHash['overlay_store']['radius'] = $pParamHash['radius'];
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

		// set values for updating the polygon keychain
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
	}

	
	//returns array of polygon data and associated style ids for given gmap_id and/or set_id
	function getList( &$pListHash ) {
		global $gBitUser, $gBitSystem;
		
		$this->prepGetList( $pListHash );
		
		$ret = NULL;
		
		$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
		array_push( $bindVars, $this->mContentTypeGuid );
		
		$this->getServicesSql( 'content_list_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

		if( @$this->verifyId( $pListHash['gmap_id'] ) || isset( $pListHash['set_id'] )) {
			$selectSql .= ", gpk.*, gps.`set_id`, gps.`style_id`, gps.`polylinestyle_id` ";
			
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_polygon_keychain` gpk ON (gp.`polygon_id` = gpk.`polygon_id`) "; 
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_polygon_sets` gps ON (gpk.`set_id` = gps.`set_id`) ";
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
			$whereSql .= " AND gsk.`set_type` = 'polygons' AND gsk.`gmap_id` = ? "; 
			array_push( $bindVars, (int)$pListHash['gmap_id'] );
		}
		
		//$pListHash['sort_mode'] = 'date_added_desc';
		$sortModePrefix = 'lc.';
		$sort_mode = $sortModePrefix . $this->mDb->convertSortmode( $pListHash['sort_mode'] );

		$query = "SELECT lc.*, gp.*, 
				  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
				  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
				  FROM `".BIT_DB_PREFIX."gmaps_polygons` gp 
					INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON( gp.`content_id`=lc.`content_id` ) $joinSql
					LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
					LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
				  WHERE lc.`content_type_guid` = ? $whereSql
				  ORDER BY $sort_mode";

		$query_cant = "
			SELECT COUNT( * )
		    FROM `".BIT_DB_PREFIX."gmaps_polygons` gp 
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