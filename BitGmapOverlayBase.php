<?php
/**
 * BitGmapOverlay Class
 *
 * @package gmap
 * @subpackage BitGmapOverlayBase
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

// this is the class that contains all the functions for the package
class BitGmapOverlayBase extends LibertyAttachable {

	var $mOverlayId;

	var $mOverlayType;

	var $mOverlayTable;
	
	var $mOverlayKeychainTable;

	var $mOverlaySeq;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapOverlayBase() {
		parent::LibertyAttachable();
		
		// Permission setup
		$this->mViewContentPerm  = 'p_gmap_overlay_view';
		$this->mEditContentPerm  = 'p_gmap_overlay_edit';
		$this->mAdminContentPerm = 'p_gmap_admin';
	}



	//returns array of polyline data and associated style and icon style ids for given gmap_id and set_type
	function load() {
		if( !empty( $this->mOverlayId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$overlayKey = $this->mOverlayType.'_id';
			$lookupColumn = !empty( $this->mOverlayId )? $overlayKey : 'content_id';

			$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
			array_push( $bindVars,  $lookupId = @BitBase::verifyId( $this->mOverlayId )? $this->mOverlayId : $this->mContentId );
			$this->getServicesSql( 'content_load_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

			$query = "select ot.*, lc.*,
					  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
					  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
					  FROM `".BIT_DB_PREFIX.$this->mOverlayTable."` ot
						INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON (lc.`content_id` = ot.`content_id`) $joinSql
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
					  WHERE ot.`$lookupColumn`=? $whereSql";
					  
			$result = $this->mDb->query( $query, $bindVars );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mOverlayId = $result->fields[$overlayKey];
				$this->mContentId = $result->fields['content_id'];
				parent::load();				
			}
		}
		return( count( $this->mInfo ) );
	}

	
	function store( &$pParamHash ) {
		if( $this->verify( $pParamHash ) ) {
			$overlayKey = $this->mOverlayType.'_id';
			$this->mDb->StartTrans();
			if( parent::store( $pParamHash ) ) {
				if( $this->mOverlayId ) {
					// store the posted changes
					$this->mDb->associateUpdate( BIT_DB_PREFIX.$this->mOverlayTable, $pParamHash['overlay_store'], array( $overlayKey => $pParamHash[$overlayKey] ) );
				} else {
					$pParamHash['overlay_store']['content_id'] = $this->mContentId;
					$pParamHash['overlay_store'][$overlayKey] = $this->mDb->GenID( $this->mOverlaySeq );
					$this->mDb->associateInsert( BIT_DB_PREFIX.$this->mOverlayTable, $pParamHash['overlay_store'] );
					// if its a new polyline we also get a set_id for the keychain and automaticallly associate it with a polyline set.
					$pParamHash['keychain_store'][$overlayKey] = $pParamHash['overlay_store'][$overlayKey];
					$this->mDb->associateInsert( BIT_DB_PREFIX.$this->mOverlayKeychainTable, $pParamHash['keychain_store'] );													
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
			$overlayKey = $this->mOverlayType.'_id';			
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX.$this->mOverlayTable."` WHERE `content_id` = ?";
			$result = $this->mDb->query( $query, array( $this->mContentId ) );
			if( LibertyAttachable::expunge() ) {
				$ret = TRUE;
				
				// delete all references to the polyline from the polyline keychain
				$query = "DELETE FROM `".BIT_DB_PREFIX.$this->mOverlayKeychainTable."` WHERE `".$overlayKey." =?";
				$result = $this->mDb->query( $query, array( $this->mOverlayId ) );
				$this->mDb->CompleteTrans();
			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return $ret;
	}

	
	function verifyRemove( &$pParamHash ) {
		$overlayKey = $this->mOverlayType.'_id';
	
		$pParamHash['overlay_remove'] = array();

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['overlay_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		if( !empty( $pParamHash[$overlayKey] ) && is_numeric( $pParamHash[$overlayKey] ) ) {
			$pParamHash['overylay_remove'][$overlayKey] = $pParamHash[$overlayKey];
		}

		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a polyline from a set
	**/
	function removeFromSet(&$pParamHash) {
		$ret = FALSE;
		if( $this->verifyRemove( $pParamHash ) ) {
			$overlayKey = $this->mOverlayType.'_id';
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX.$this->mOverlayKeychainTable."` WHERE `set_id` = ? AND `".$overlayKey."` =?";
			$result = $this->mDb->query( $query, $pParamHash['overlay_remove'] );
			$ret = TRUE;
			$this->mDb->CompleteTrans();
		}
		return $ret;
	}


	//returns array of all markers and associated set info
	/* @TODO - doubtful these do anything close to what they should do
	 * Moved over from BitGmap - but was not in use anywhere - some sort of getList is needed
	 * This looks like it attempted to pull set data along with it  -wjames5
	
	function getList() {
		global $gBitSystem;
		$ret = NULL;
		$overlayKey = $this->mOverlayType.'_id';
		$query = "SELECT bms.*, bsk.`set_type`, bsk.`gmap_id`, bmm.*
					FROM `".BIT_DB_PREFIX.$this->mOverlaySetKeychainTable."` bmk
					INNER JOIN `".BIT_DB_PREFIX.$this->mOverlaySetTable."` bms ON ( bmk.`set_id` = bms.`set_id` )
					INNER JOIN `".BIT_DB_PREFIX.$this->mOverlayTable."` bmm ON ( bmm.`".$overlayKey."` = bmk.`".$overlayKey."` )
					LEFT OUTER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk
					ON ( bsk.`set_id` = bms.`set_id`
					AND bsk.`set_type` = ".$this->mOverlaySetType.")
              	ORDER BY bms.`set_id` ASC, bmm.`".$overlayKey."` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}
	
	
	//returns array of all markers
	function getList() {
		global $gBitSystem;
		$ret = NULL;
		$overlayKey = $this->mOverlayType.'_id';
		$query = "SELECT bmk.`set_id`, bmm.*
					FROM `".BIT_DB_PREFIX.$this->mOverlayKeychainTable."` bmk, `".BIT_DB_PREFIX.$this->mOverlayTable."` bmm
          		WHERE bmm.`".$overlayKey."` = bmk.`".$overlayKey."`
          		ORDER BY bmm.`set_id` ASC, bmk.`set_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}
	
	
	*/
	

	/**
	* Generates the URL to view a polyline on a standalone page
	* @param pMixed a hash passed in by LibertyContent:getList
	* @return the link to display the polyline data.
	*/
	function getDisplayUrl( $pContentId=NULL, $pMixed=NULL ) {
		$ret = NULL;
		$id = NULL;
		$overlayKey = $this->mOverlayType.'_id';
		if( empty( $this->mOverlayId ) && empty( $pMixed[$overlayKey] ) && !empty( $pContentId ) ) {
  			$this->mDb->StartTrans();
  			$query = "SELECT `".$overlayKey."` FROM `".BIT_DB_PREFIX.$this->mOverlayTable."` WHERE `content_id` = ?";
  			$result = $this->mDb->query( $query, $pContentId );
  			$this->mDb->CompleteTrans();
  			$res = $result->fetchrow();
  			$id = $res[$overlayKey];
  		}
	
		if( empty( $this->mOverlayId ) && !empty( $pMixed[$overlayKey] )) {
			$id = $pMixed[$overlayKey];
		}
		
		if( !empty( $this->mOverlayId ) ) {
			$id = $this->mOverlayId;
		}
		
		if ($id != NULL){
			$ret = GMAP_PKG_URL."view_".$this->mOverlayType.".php?".$overlayKey."=".$id;
		}
		return $ret;
	}
	
	function setEditSharing(&$pParamHash){
		if ( isset( $pParamHash['share_edit'] ) ){
			$this->storePermission( 3, 'p_gmap_overlay_edit' );
		}else{
			$this->removePermission( 3, 'p_gmap_overlay_edit' ); 
		}
	}
	
	function isEditShared(){
		$ret = FALSE;
		if ( isset( $this->mPerms['p_gmap_overlay_edit'] ) && $this->mPerms['p_gmap_overlay_edit']['group_id'] == 3 && $this->mPerms['p_gmap_overlay_edit']['is_revoked'] != "y"){
			$ret = TRUE;
		}
		return $ret;
	}
}
?>
