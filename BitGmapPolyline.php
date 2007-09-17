<?php
/**
 * BitGmapPolyline Class
 *
 * @package gmap
 * @subpackage BitGmapPolyline
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

require_once( LIBERTY_PKG_PATH.'LibertyContent.php' );
require_once( LIBERTY_PKG_PATH.'LibertyComment.php' );

/**
* This is used to uniquely identify the object
*/
define( 'BITGMAPMARKER_CONTENT_TYPE_GUID', 'bitgmappolyline' );


// this is the class that contains all the functions for the package
class BitGmapPolyline extends LibertyContent {
	/**
	* Primary key for our map class
	* @public
	*/
	var $mGpolylineId;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapPolyline( $pGpolylineId=NULL, $pContentId=NULL ) {
		parent::LibertyContent();
		$this->mGpolylineId = $pGpolylineId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPMARKER_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPMARKER_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPMARKER_CONTENT_TYPE_GUID,
			'content_description' => 'Polyline for Google Map',
			'handler_class' => 'BitGmapPolyline',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapPolyline.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		// Permission setup
		$this->mViewContentPerm  = 'p_gmap_polyline_view';
		$this->mEditContentPerm  = 'p_gmap_polyline_edit';
		$this->mAdminContentPerm = 'p_gmap_admin';
	}



	//returns array of polyline data and associated style and icon style ids for given gmap_id and set_type
	function load() {
		if( !empty( $this->mGpolylineId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mGpolylineId )? 'polyline_id' : 'content_id';

			$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
			array_push( $bindVars,  $lookupId = @BitBase::verifyId( $this->mGpolylineId )? $this->mGpolylineId : $this->mContentId );
			$this->getServicesSql( 'content_load_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

			$query = "select bmm.*, lc.*,
					  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
					  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
					  FROM `".BIT_DB_PREFIX."gmaps_polylines` bmm
						INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON (lc.`content_id` = bmm.`content_id`) $joinSql
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
					  WHERE bmm.`$lookupColumn`=? $whereSql";
					  
			$result = $this->mDb->query( $query, $bindVars );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mGpolylineId = $result->fields['polyline_id'];
				$this->mContentId = $result->fields['content_id'];
				parent::load();				
			}
		}
		return( count( $this->mInfo ) );
	}


	function verify( &$pParamHash ) {

		$pParamHash['polyline_store'] = array();
		$pParamHash['keychain_store'] = array();

		if( !empty( $pParamHash['type'] ) ) {
			$pParamHash['polyline_store']['type'] = $pParamHash['type'];
		}
		
		if( !empty( $pParamHash['levels_data'] ) ) {
			$pParamHash['polyline_store']['levels_data'] = $pParamHash['levels_data'];
		}

		if( isset( $pParamHash['zoom_factor'] ) && is_numeric( $pParamHash['zoom_factor'] ) ) {
			$pParamHash['polyline_store']['zoom_factor'] = $pParamHash['zoom_factor'];
		}

		if( isset( $pParamHash['num_levels'] ) && is_numeric( $pParamHash['num_levels'] ) ) {
			$pParamHash['polyline_store']['num_levels'] = $pParamHash['num_levels'];
		}

		// set values for updating the polyline keychain
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}

		return( count( $this->mErrors ) == 0 );
	}

	
	function store( &$pParamHash ) {
		if( $this->verify( $pParamHash ) ) {
			$this->mDb->StartTrans();
			if( parent::store( $pParamHash ) ) {
				if( $this->mGpolylineId ) {
					// store the posted changes
					$this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polylines", $pParamHash['polyline_store'], array( "polyline_id" => $pParamHash['polyline_id'] ) );
				} else {
					$pParamHash['polyline_store']['content_id'] = $this->mContentId;
					$pParamHash['polyline_store']['polyline_id'] = $this->mDb->GenID( 'gmaps_polylines_polyline_id_seq' );
					$this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polylines", $pParamHash['polyline_store'] );
					// if its a new polyline we also get a set_id for the keychain and automaticallly associate it with a polyline set.
					$pParamHash['keychain_store']['polyline_id'] = $pParamHash['polyline_store']['polyline_id'];
					$this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polyline_keychain", $pParamHash['keychain_store'] );													
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
	* This function removes a polyline
	**/
	function expunge() {
		$ret = FALSE;
		if( $this->isValid() ) {
			
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polylines` WHERE `content_id` = ?";
			$result = $this->mDb->query( $query, array( $this->mContentId ) );
			if( LibertyAttachable::expunge() ) {
				$ret = TRUE;
				
				// delete all references to the polyline from the polyline keychain
				$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polyline_keychain` WHERE `polyline_id` =?";
				$result = $this->mDb->query( $query, array( $this->mGpolylineId ) );
				$this->mDb->CompleteTrans();
			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return $ret;
	}

	
	function verifyRemove( &$pParamHash ) {
	
		$pParamHash['polyline_remove'] = array();

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['polyline_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		if( !empty( $pParamHash['polyline_id'] ) && is_numeric( $pParamHash['polyline_id'] ) ) {
			$pParamHash['polyline_remove']['polyline_id'] = $pParamHash['polyline_id'];
		}

		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a polyline from a set
	**/
	function removeFromSet(&$pParamHash) {
		$ret = FALSE;
		if( $this->verifyRemove( $pParamHash ) ) {
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polyline_keychain` 
			WHERE `set_id` = ?
			AND `polyline_id` =?";
			$result = $this->mDb->query( $query, $pParamHash['polyline_remove'] );
			$ret = TRUE;
			$this->mDb->CompleteTrans();
		}
		return $ret;
	}
	

	/**
	* Generates the URL to view a polyline on a standalone page
	* @param pMixed a hash passed in by LibertyContent:getList
	* @return the link to display the polyline data.
	*/
	function getDisplayUrl( $pContentId=NULL, $pMixed=NULL ) {
		$ret = NULL;
		$id = NULL;
		if( empty( $this->mGpolylineId ) && empty( $pMixed['polyline_id'] ) && !empty( $pContentId ) ) {
  			$this->mDb->StartTrans();
  			$query = "SELECT `polyline_id` FROM `".BIT_DB_PREFIX."gmaps_polylines` WHERE `content_id` = ?";
  			$result = $this->mDb->query( $query, $pContentId );
  			$this->mDb->CompleteTrans();
  			$res = $result->fetchrow();
  			$id = $res['polyline_id'];
  		}
	
		if( empty( $this->mGpolylineId ) && !empty( $pMixed['polyline_id'] )) {
			$id = $pMixed['polyline_id'];
		}
		
		if( !empty( $this->mGpolylineId ) ) {
			$id = $this->mGpolylineId;
		}
		
		if ($id != NULL){
			$ret = GMAP_PKG_URL."view_polyline.php?polyline_id=".$id;
		}
		return $ret;
	}	
}

?>
