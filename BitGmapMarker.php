<?php
/**
 * BitGmapMarker Class
 *
 * @package gmap
 * @subpackage BitGmapMarker
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
require_once( LIBERTY_PKG_PATH.'LibertyComment.php' );

/**
* This is used to uniquely identify the object
*/
define( 'BITGMAPMARKER_CONTENT_TYPE_GUID', 'bitgmapmarker' );


// this is the class that contains all the functions for the package
class BitGmapMarker extends BitGmapOverlayBase {

	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapMarker( $pOverlayId=NULL, $pContentId=NULL ) {
		parent::BitGmapOverlayBase();
		$this->mOverlayId = $pOverlayId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPMARKER_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPMARKER_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPMARKER_CONTENT_TYPE_GUID,
			'content_description' => 'Marker for Google Map',
			'handler_class' => 'BitGmapMarker',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapMarker.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		$this->mOverlayType = 'marker';
		$this->mOverlayTable = 'gmaps_markers';
		$this->mOverlayKeychainTable = 'gmaps_marker_keychain';
		$this->mOverlaySeq = 'gmaps_markers_marker_id_seq';
	}



	//returns array of marker data and associated style and icon style ids for given gmap_id and set_type
	function load() {
		if( !empty( $this->mOverlayId ) || !empty( $this->mContentId ) ) {
			$overlayKey = $this->mOverlayType.'_id';
			$lookupColumn = !empty( $this->mOverlayId )? $overlayKey : 'content_id';

			$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
			array_push( $bindVars,  $lookupId = @BitBase::verifyId( $this->mOverlayId )? $this->mOverlayId : $this->mContentId );
			$this->getServicesSql( 'content_load_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

			$query = "select ot.*, lc.*, ufm.`favorite_content_id`, ufm.`map_position`,
					  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
					  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name,
					  lf.storage_path AS `image_attachment_path` $selectSql
					  FROM `".BIT_DB_PREFIX.$this->mOverlayTable."` ot
						INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON (lc.`content_id` = ot.`content_id`) $joinSql
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
						LEFT JOIN `".BIT_DB_PREFIX."users_favorites_map` ufm ON ( lc.`content_id`=ufm.`favorite_content_id` )
						LEFT OUTER JOIN `".BIT_DB_PREFIX."liberty_attachments` la ON( la.`content_id` = lc.`content_id` AND la.`is_primary` = 'y' )
						LEFT OUTER JOIN `".BIT_DB_PREFIX."liberty_files` lf ON( lf.`file_id` = la.`foreign_id` )
					  WHERE ot.`$lookupColumn`=? $whereSql";

			if( $this->mInfo = $this->mDb->getRow( $query, $bindVars )){
				$this->mInfo['thumbnail_url'] = BitGmapMarker::getImageThumbnails( $this->mInfo );
				$this->mOverlayId = $this->mInfo[$overlayKey]; 
				$this->mContentId = $this->mInfo['content_id'];
				$this->mInfo['raw'] = $this->mInfo['data'];
				$this->mInfo['xml_parsed_data'] = $this->parseData( $this->mInfo['data'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_data'] = $this->parseData( $this->mInfo['data'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_data'] = addslashes($this->mInfo['parsed_data']);
				$this->mInfo['xml_data'] = str_replace("&", "&amp;", $this->mInfo['data']);
				$this->mInfo['xml_data'] = str_replace("\n", "&#13;", $this->mInfo['xml_data']);
				$this->mInfo['data'] = addslashes($this->mInfo['data']);
				$this->mInfo['data'] = str_replace("\n", "\\n", $this->mInfo['data']);

				$comment = new LibertyComment();
				$this->mInfo['num_comments'] = $comment->getNumComments($this->mInfo['content_id']);

/* we can prolly get rid of this since titles don't take linebreaks. and this was messing up the json editing -wjames
				$this->mInfo['xml_parsed_title'] = $this->parseData( $this->mInfo['title'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_title'] = $this->parseData( $this->mInfo['title'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_title'] = addslashes($this->mInfo['parsed_title']);
				$this->mInfo['xml_title'] = str_replace("&", "&amp;", $this->mInfo['title']);
				$this->mInfo['xml_title'] = str_replace("\n", "&#13;", $this->mInfo['xml_title']);
				$this->mInfo['title'] = addslashes($this->mInfo['title']);
				$this->mInfo['title'] = str_replace("\n", "\\n", $this->mInfo['title']);
*/
				LibertyAttachable::load();
			}
		}
		return( count( $this->mInfo ) );
	}

	/**
	* Get the URL for any given article image
	* @param $pParamHash pass in full set of data returned from article query
	* @return url to image
	* @access public
	**/
	function getImageThumbnails( $pParamHash ) {
		global $gBitSystem, $gThumbSizes;
		$ret = NULL;
		if( !empty( $pParamHash['image_attachment_path'] )) {
			$ret = liberty_fetch_thumbnails( $pParamHash['image_attachment_path'], NULL, NULL, FALSE );
			$ret['original'] = STORAGE_HOST_URI.$pParamHash['image_attachment_path'];
		}
		return $ret;
	}


	function verify( &$pParamHash ) {

		$pParamHash['overlay_store'] = array();
		$pParamHash['keychain_store'] = array();

		if( !empty( $pParamHash['marker_labeltext'] ) ) {
			$pParamHash['overlay_store']['label_data'] = $pParamHash['marker_labeltext'];
		}

		if( !empty( $pParamHash['marker_zi'] ) && is_numeric( $pParamHash['marker_zi'] ) ) {
			$pParamHash['overlay_store']['zindex'] = $pParamHash['marker_zi'];
		}
		
		// set values for updating the marker keychain		
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}

		
		return( count( $this->mErrors ) == 0 );
	}
	
	//returns array of marker data and associated style and icon style ids for given gmap_id and/or set_id
	function getList( &$pListHash ) {
		global $gBitUser, $gBitSystem;
		
		$this->prepGetList( $pListHash );
		
		$ret = NULL;
		
		$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
		array_push( $bindVars, $this->mContentTypeGuid );
		
		$this->getServicesSql( 'content_list_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

		if( @$this->verifyId( $pListHash['gmap_id'] ) || isset( $pListHash['set_id'] )) {
			$selectSql .= ", gmk.*, gms.`set_id`, gms.`style_id`, gms.`icon_id` ";
			
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_marker_keychain` gmk ON (gm.`marker_id` = gmk.`marker_id`) "; 
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_marker_sets` gms ON (gmk.`set_id` = gms.`set_id`) ";
		}

		if( @$this->verifyId( $pListHash['user_id'] ) ) {
			array_push( $bindVars, (int)$pListHash['user_id'] );
			$whereSql .= ' AND lc.`user_id` = ? ';
		}
		
		// map user to login in case we used one instead of the other
		if( !empty( $pListHash['user'] ) ) {
			$pListHash['login'] = $pListHash['user'];
		}

		if( !empty( $pListHash['login'] ) ) {
			array_push( $bindVars, $pListHash['login'] );
			$whereSql .= ' AND uu.`login` = ? ';
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
						$whereSql .= " AND ( gmk.`set_id` = ? "; 
						$hasOne = TRUE;
					}else{
						$whereSql .= " OR gmk.`set_id` = ? "; 
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
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON( gms.`set_id` = gsk.`set_id`) ";
			$whereSql .= " AND gsk.`set_type` = 'markers' AND gsk.`gmap_id` = ? "; 
			array_push( $bindVars, (int)$pListHash['gmap_id'] );
		}

		if ( isset( $pListHash['favorites'] ) ){
			$selectSql .= ", ufm.* ";
			$joinSql .= " LEFT JOIN `".BIT_DB_PREFIX."users_favorites_map` ufm ON ( lc.`content_id`=ufm.`favorite_content_id` ) ";
			$whereSql .= " AND ufm.`favorite_content_id` IS NOT NULL ";
		}

		//$pListHash['sort_mode'] = 'date_added_desc';
		$sortModePrefix = 'lc.';
		$sort_mode = $sortModePrefix . $this->mDb->convertSortmode( $pListHash['sort_mode'] );

		$query = "SELECT lc.*, gm.*, 
				  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
				  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
				  FROM `".BIT_DB_PREFIX."gmaps_markers` gm 
					INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON( gm.`content_id`=lc.`content_id` ) $joinSql
					LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
					LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
				  WHERE lc.`content_type_guid` = ? $whereSql
				  ORDER BY $sort_mode";

		$query_cant = "
			SELECT COUNT( * )
		    FROM `".BIT_DB_PREFIX."gmaps_markers` gm 
				INNER JOIN      `".BIT_DB_PREFIX."liberty_content`       lc ON lc.`content_id` = gm.`content_id`
				INNER JOIN		`".BIT_DB_PREFIX."users_users`			 uu ON uu.`user_id`			   = lc.`user_id`
				$joinSql
			WHERE lc.`content_type_guid` = ? $whereSql ";

		$result = $this->mDb->query($query,$bindVars,$pListHash['max_records'],$pListHash['offset']);
		$cant = $this->mDb->getOne($query_cant,$bindVars);
		
		$comment = &new LibertyComment();
		while ($res = $result->fetchrow()) {
		
			//need something like this - but need to get the prefs in the query
			$res['allow_comments'] = "n";
			if( $this->getPreference('allow_comments', null, $res['content_id']) == 'y' ) {
				$res['allow_comments'] = "y";
				$res['num_comments'] = $comment->getNumComments( $res['content_id'] );
			}
			$res['xml_parsed_data'] = $this->parseData( $res['data'], $res['format_guid'] );
			$res['parsed_data'] = $this->parseData( $res['data'], $res['format_guid'] );
			$res['parsed_data'] = addslashes($res['parsed_data']);
			$res['xml_data'] = str_replace("\n", "&#13;", $res['data']);
			$res['data'] = addslashes($res['data']);
			$res['data'] = str_replace("\n", "\\n", $res['data']);
			$ret[] = $res;

		}
		
		$pListHash["data"] = $ret;
		$pListHash["cant"] = $cant;

		LibertyContent::postGetList( $pListHash );

		return $pListHash;
	}
}
?>
