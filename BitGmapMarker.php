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

require_once( LIBERTY_PKG_PATH.'LibertyAttachable.php' );
require_once( LIBERTY_PKG_PATH.'LibertyComment.php' );

/**
* This is used to uniquely identify the object
*/
define( 'BITGMAPMARKER_CONTENT_TYPE_GUID', 'bitgmapmarker' );


// this is the class that contains all the functions for the package
class BitGmapMarker extends LibertyAttachable {
	/**
	* Primary key for our map class
	* @public
	*/
	var $mGmarkerId;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapMarker( $pGmarkerId=NULL, $pContentId=NULL ) {
		parent::LibertyAttachable();
		$this->mGmarkerId = $pGmarkerId;
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
		
		// Permission setup
		$this->mViewContentPerm  = 'p_gmap_marker_view';
		$this->mEditContentPerm  = 'p_gmap_marker_edit';
		$this->mAdminContentPerm = 'p_gmap_admin';
	}



	//returns array of marker data and associated style and icon style ids for given gmap_id and set_type
	function load() {
		if( !empty( $this->mGmarkerId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mGmarkerId )? 'marker_id' : 'content_id';

			$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
			array_push( $bindVars,  $lookupId = @BitBase::verifyId( $this->mGmarkerId )? $this->mGmarkerId : $this->mContentId );
			$this->getServicesSql( 'content_load_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

			$query = "select bmm.*, lc.*,
					  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
					  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
					  FROM `".BIT_DB_PREFIX."gmaps_markers` bmm
						INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON (lc.`content_id` = bmm.`content_id`) $joinSql
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
					  WHERE bmm.`$lookupColumn`=? $whereSql";
					  
			$result = $this->mDb->query( $query, $bindVars );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mGmarkerId = $result->fields['marker_id'];
				$this->mContentId = $result->fields['content_id'];

				$this->mInfo['raw'] = $this->mInfo['data'];
				$this->mInfo['xml_parsed_data'] = $this->parseData( $this->mInfo['data'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_data'] = $this->parseData( $this->mInfo['data'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_data'] = addslashes($this->mInfo['parsed_data']);
				$this->mInfo['xml_data'] = str_replace("&", "&amp;", $this->mInfo['data']);
				$this->mInfo['xml_data'] = str_replace("\n", "&#13;", $this->mInfo['xml_data']);
				$this->mInfo['data'] = addslashes($this->mInfo['data']);
				$this->mInfo['data'] = str_replace("\n", "\\n", $this->mInfo['data']);

/* we can prolly get rid of this since titles don't take linebreaks. and this was messing up the json editing -wjames
				$this->mInfo['xml_parsed_title'] = $this->parseData( $this->mInfo['title'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_title'] = $this->parseData( $this->mInfo['title'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_title'] = addslashes($this->mInfo['parsed_title']);
				$this->mInfo['xml_title'] = str_replace("&", "&amp;", $this->mInfo['title']);
				$this->mInfo['xml_title'] = str_replace("\n", "&#13;", $this->mInfo['xml_title']);
				$this->mInfo['title'] = addslashes($this->mInfo['title']);
				$this->mInfo['title'] = str_replace("\n", "\\n", $this->mInfo['title']);
*/
				parent::load();				
			}
		}
		return( count( $this->mInfo ) );
	}

	
	
	
	

//ALL STORE FUNCTIONS

	function verify( &$pParamHash ) {

		$pParamHash['marker_store'] = array();
		$pParamHash['keychain_store'] = array();

		if( !empty( $pParamHash['marker_labeltext'] ) ) {
			$pParamHash['marker_store']['label_data'] = $pParamHash['marker_labeltext'];
		}

		if( !empty( $pParamHash['marker_zi'] ) && is_numeric( $pParamHash['marker_zi'] ) ) {
			$pParamHash['marker_store']['zindex'] = $pParamHash['marker_zi'];
		}
		
		if( !empty( $pParamHash['map_comm'] ) ) {
			$pParamHash['marker_store']['allow_comments'] = 'TRUE';
		}

		// set values for updating the marker keychain		
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}

		
		return( count( $this->mErrors ) == 0 );
	}

	
	function store( &$pParamHash ) {
		if( $this->verify( $pParamHash ) ) {
			$this->mDb->StartTrans();
			if( parent::store( $pParamHash ) ) {
				if( $this->mGmarkerId ) {
					// store the posted changes
					$this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_markers", $pParamHash['marker_store'], array( "marker_id" => $pParamHash['marker_id'] ) );
				} else {
					$pParamHash['marker_store']['content_id'] = $this->mContentId;
					$pParamHash['marker_store']['marker_id'] = $this->mDb->GenID( 'gmaps_markers_marker_id_seq' );
					$this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_markers", $pParamHash['marker_store'] );
					// if its a new marker we also get a set_id for the keychain and automaticallly associate it with a marker set.
					$pParamHash['keychain_store']['marker_id'] = $pParamHash['marker_store']['marker_id'];
					$this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_marker_keychain", $pParamHash['keychain_store'] );													
				}
				$this->mDb->CompleteTrans();

				// re-query to confirm results
				$result = $this->load();

			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return( count( $this->mInfo ) );
	}


	/**
	* This function removes a marker
	**/
	function expunge() {
		$ret = FALSE;
		if( $this->isValid() ) {
			
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_markers` WHERE `content_id` = ?";
			$result = $this->mDb->query( $query, array( $this->mContentId ) );
			if( LibertyAttachable::expunge() ) {
				$ret = TRUE;
				
				// delete all references to the marker from the marker keychain
				$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_marker_keychain` WHERE `marker_id` =?";
				$result = $this->mDb->query( $query, array( $this->mGmarkerId ) );
				$this->mDb->CompleteTrans();
			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return $ret;
	}

	
	
	function verifyRemove( &$pParamHash ) {
	
		$pParamHash['marker_remove'] = array();

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['marker_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		if( !empty( $pParamHash['marker_id'] ) && is_numeric( $pParamHash['marker_id'] ) ) {
			$pParamHash['marker_remove']['marker_id'] = $pParamHash['marker_id'];
		}

		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a marker from a set
	**/
	function removeFromSet(&$pParamHash) {
		$ret = FALSE;
		if( $this->verifyRemove( $pParamHash ) ) {
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_marker_keychain` 
			WHERE `set_id` = ?
			AND `marker_id` =?";
			$result = $this->mDb->query( $query, $pParamHash['marker_remove'] );
			$ret = TRUE;
			$this->mDb->CompleteTrans();
		}
		return $ret;
	}

	/**
	* Generates the URL to view a marker on a standalone page
	* @param pMixed a hash passed in by LibertyContent:getList
	* @return the link to display the marker data.
	*/
	function getDisplayUrl( $pContentId=NULL, $pMixed=NULL ) {
		$ret = NULL;
		$id = NULL;
		if( empty( $this->mGmarkerId ) && empty( $pMixed['marker_id'] ) && !empty( $pContentId ) ) {
  			$this->mDb->StartTrans();
  			$query = "SELECT `marker_id` FROM `".BIT_DB_PREFIX."gmaps_markers` WHERE `content_id` = ?";
  			$result = $this->mDb->query( $query, $pContentId );
  			$this->mDb->CompleteTrans();
  			$res = $result->fetchrow();
  			$id = $res['marker_id'];
  		}
	
		if( empty( $this->mGmarkerId ) && !empty( $pMixed['marker_id'] )) {
			$id = $pMixed['marker_id'];
		}
		
		if( !empty( $this->mGmarkerId ) ) {
			$id = $this->mGmarkerId;
		}
		
		if ($id != NULL){
			$ret = GMAP_PKG_URL."view_marker.php?marker_id=".$id;
		}
		return $ret;
	}	
}

?>
