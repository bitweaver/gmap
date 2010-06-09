<?php
/**
 * @version $Header$
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See below for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 */
 
/**
 * required setup
 */

require_once( LIBERTY_PKG_PATH.'LibertyMime.php' );

/**
 * class BitGmapOverlayBase
 * this is the class that contains all the functions for the package
 * 
 * @package gmap
 */
class BitGmapOverlayBase extends LibertyMime {

	var $mOverlayId;

	var $mOverlayType;

	var $mOverlayTable;
	
	var $mOverlayKeychainTable;

	var $mOverlaySeq;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapOverlayBase() {
		parent::LibertyMime();
		
		// Permission setup
		$this->mViewContentPerm  = 'p_gmap_overlay_view';
		$this->mCreateContentPerm  = 'p_gmap_overlay_create';
		$this->mUpdateContentPerm  = 'p_gmap_overlay_update';
		$this->mAdminContentPerm = 'p_gmap_admin';
	}



	//returns array of overlay data and associated style and icon style ids for given gmap_id and set_type
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
				$this->mInfo['creator'] =( isset( $result->fields['creator_real_name'] )? $result->fields['creator_real_name'] : $result->fields['creator_user'] );
				$this->mInfo['editor'] =( isset( $result->fields['modifier_real_name'] )? $result->fields['modifier_real_name'] : $result->fields['modifier_user'] );
				$this->mInfo['display_url'] = $this->getDisplayUrl();
				// $this->mInfo['parsed_data'] = $this->parseData();
				$this->mInfo['raw'] = $this->mInfo['data'];

				$parseHash['data'] = $this->mInfo['data'];
				$this->prepParseFilters( $parseHash );

				// @TODO this has gone through many changes and this looks a bit chaotic - might be able to simplify this
				$this->mInfo['xml_parsed_data'] = $this->parseData( $parseHash, $this->mInfo['format_guid'] );
				$this->mInfo['parsed_data'] = $this->parseData( $parseHash, $this->mInfo['format_guid'] );
				$this->mInfo['clean_data'] = $this->mInfo['parsed_data'];
				$this->mInfo['parsed_data'] = addslashes($this->mInfo['parsed_data']);
				$this->mInfo['xml_data'] = str_replace("\n", "&#13;", $this->mInfo['data']);
				$this->mInfo['data'] = addslashes($this->mInfo['data']);
				$this->mInfo['data'] = str_replace("\n", "\\n", $this->mInfo['data']);				
				
				LibertyMime::load();
			}
			
		}
		return( count( $this->mInfo ) );
	}

	function prepParseFilters( &$pParamHash ){
		global $gBitThemes;

		if( $gBitThemes->isAjaxRequest() ){ 
			// if YouTube is used we want to restrict its size in marker windows since space is limited
			$pParamHash['htmlp_config']['YouTube'] = array( 'width'=>460, 'height'=>228 );
		}
	}
	
	function store( &$pParamHash ) {
		if( $this->verify( $pParamHash ) ) {
			$overlayKey = $this->mOverlayType.'_id';
			$this->mDb->StartTrans();
			if( LibertyMime::store( $pParamHash ) ) {
				if( $this->mOverlayId ) {
					if ( !empty($pParamHash['overlay_store']) ){
						// store the posted changes
						$locId = array( "content_id" => $this->mContentId );
						$this->mDb->associateUpdate( BIT_DB_PREFIX.$this->mOverlayTable, $pParamHash['overlay_store'], $locId );
					}
					// if we have a set id we assume the mapping to the overlay set needs updating too
					if( !empty( $pParamHash['keychain_store']['set_id'] ) ){
						$pParamHash['keychain_store'][$overlayKey] = $this->mOverlayId;
						$this->mapToSet( $pParamHash );
					}
				} else {
					$pParamHash['overlay_store']['content_id'] = $this->mContentId;
					$pParamHash['overlay_store'][$overlayKey] = $this->mDb->GenID( $this->mOverlaySeq );
					$this->mDb->associateInsert( BIT_DB_PREFIX.$this->mOverlayTable, $pParamHash['overlay_store'] );
					// if its a new overlay we also get a set_id for the keychain and automaticallly associate it with a overlay set.
					if( !empty( $pParamHash['keychain_store']['set_id'] ) ){
						$pParamHash['keychain_store'][$overlayKey] = $pParamHash['overlay_store'][$overlayKey];
						$this->mapToSet( $pParamHash );
					}
				}
				$this->mDb->CompleteTrans();

				// re-query to confirm results
				$result = $this->load();

			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return( count( $this->mErrors ) == 0 );
	}


	/**
	* This function removes an overlay
	**/
	function expunge() {
		$ret = FALSE;
		if( $this->isValid() ) {
			$overlayKey = $this->mOverlayType.'_id';			
			$this->mDb->StartTrans();

			// delete all references to the overlay from the overlay keychain
			$query = "DELETE FROM `".BIT_DB_PREFIX.$this->mOverlayKeychainTable."` WHERE `".$overlayKey."` =?";
			$result = $this->mDb->query( $query, array( $this->mOverlayId ) );

			// delete the overlay record
			$query = "DELETE FROM `".BIT_DB_PREFIX.$this->mOverlayTable."` WHERE `content_id` = ?";
			$result = $this->mDb->query( $query, array( $this->mContentId ) );

			// delete the overlay liberty content object
			if( $ret = LibertyMime::expunge() ) {
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
			$pParamHash['overlay_remove'][$overlayKey] = $pParamHash[$overlayKey];
		}
		return( count( $this->mErrors ) == 0 );
	}	

	/**
	* This function removes a overlay from a set
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

	/**
	 * This function adds a overlay to a set or updates it if it already exists
	 **/
	function mapToSet(&$pParamHash) {
		$this->mDb->StartTrans();
		$overlayKey = $this->mOverlayType.'_id';
		$query = "SELECT `".$overlayKey."` FROM `".BIT_DB_PREFIX.$this->mOverlayKeychainTable."` WHERE `set_id` = ? AND `".$overlayKey."` =?";
		$bindVars = array( 'set_id' => $pParamHash['keychain_store']['set_id'], $overlayKey => $this->mOverlayId );
		if( $this->mDb->getOne( $query, $bindVars ) ){
			// if the mapping already exists then update it
			$this->mDb->associateUpdate( BIT_DB_PREFIX.$this->mOverlayKeychainTable, $pParamHash['keychain_store'], array( $overlayKey => $pParamHash[$overlayKey] ) );
		}else{
			// create a new one
			$this->mDb->associateInsert( BIT_DB_PREFIX.$this->mOverlayKeychainTable, $pParamHash['keychain_store'] );													
		}
		$this->mDb->CompleteTrans();
		// @TODO insert errors
		return( count( $this->mErrors ) == 0 );
	}


	/**
	* Generates the URL to view a overlay on a standalone page
	* @param pMixed a hash passed in by LibertyContent:getList
	* @return the link to display the overlay data.
	*/
	function getDisplayUrl( $pContentId=NULL, $pMixed=NULL ) {
		global $gBitSystem;

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
			if( $gBitSystem->isFeatureActive( 'pretty_urls' ) || $gBitSystem->isFeatureActive( 'pretty_urls_extended' ) ) {
				$ret =  GMAP_PKG_URL.$this->mOverlayType."/".$id;
			}else{
				// If we ever have view files for prettier urls like view_polyline view_polygon then reinstate this dynamic assignment
				// $ret = GMAP_PKG_URL."view_".$this->mOverlayType.".php?".$overlayKey."=".$id;
				// send all overlay requests to the generic view file
				$ret = GMAP_PKG_URL."view_overlay.php?overlay_type=".$this->mOverlayType."&".$overlayKey."=".$id;
			}
		} elseif( @BitBase::verifyId( $pMixed['content_id'] ) ) {
			$ret = BIT_ROOT_URL.'index.php?content_id='.$pMixed['content_id'];
		} elseif( $this->isValid() ) {
			$ret = BIT_ROOT_URL.'index.php?content_id='.$this->mContentId;
		}
		return $ret;
	}

	/**
	 * Custom Permission Convenience Functions
	 * These are not as robust as the full custom permissions options of Liberty
	 * However they offer a quick and intuitive way for users to set commonly
	 * desirable custom access control without having to give site wide custom-permission
	 * access to all basic registered users.
	 */	
	function togglePermissionSharing( $pPerm, $pGroupId, $pShare=TRUE ){
		global $gBitUser;
		
		if ( $pShare ){
			// store the permission no matter what since someone could remove global perm later, and this undoes revoke
			$this->storePermission( $pGroupId, $pPerm );
		}else{
			// get default and custom content perms and check the whole mess
			$defaultPerms = $gBitUser->getGroupPermissions( array( 'group_id' => $pGroupId ) );
			
			if( !empty( $defaultPerms[$pPerm] ) ){
				// if global perm is set we need to revoke it
				$this->storePermission( $pGroupId, $pPerm, TRUE );
			}elseif( ( $assignedPerms = $this->getContentPermissionsList() ) && !empty( $assignedPerms[$pGroupId][$pPerm] ) && $assignedPerms[$pGroupId][$pPerm]['is_revoked'] != "y" ){
				// if custom content perm is set but not revoke we need to remove it
				$this->removePermission( $pGroupId, $pPerm ); 
			}
		}
	}
	
	function isPermissionShared( $pPerm, $pGroupId ){
		global $gBitUser;
		$ret = FALSE;
		
		// get default and custom content perms and check the whole mess
		$defaultPerms = $gBitUser->getGroupPermissions( array( 'group_id' => $pGroupId ) );

		if( ( $assignedPerms = $this->getContentPermissionsList() ) && !empty( $assignedPerms[$pGroupId][$pPerm] ) ){
			if( $assignedPerms[$pGroupId][$pPerm]['is_revoked'] != "y" ){
				$ret = TRUE;
			}
		}elseif( !empty( $defaultPerms[$pPerm] ) ){
			$ret = TRUE;
		}

		return $ret;
	}
	
	function setUpdateSharing(&$pParamHash){
		// we're setting registered users permission
		$this->togglePermissionSharing( $this->mUpdateContentPerm, 3, !empty($pParamHash['share_update'])?TRUE:FALSE );
	}
	
	function isUpdateShared(){
		// we're checking registered users perms
		return $this->isPermissionShared( $this->mUpdateContentPerm, 3 );
	}

	/**
	 * Make the overlay hidden (assumes view permission is set to anonymous by default and revokes that permission)
	 */
	function setViewPrivate(&$pParamHash){
		$this->togglePermissionSharing( 'p_gmap_overlay_view', -1, !empty($pParamHash['make_private'])?FALSE:TRUE );
	}

	function isViewPrivate(){
		return !$this->isPermissionShared( 'p_gmap_overlay_view', -1 );
	}

	/**
	 * changePos 
	 * 
	 * @access private
	 * @return TRUE on success, FALSE on failure - mErrors will contain reason for failure
	 *
	 * Don't call this function directly. Use moveUp or moveDown for code legibility and simplicity
	 */
	function changePos( $pDirection ) {
		if( $this->isValid() && !empty( $pDirection ) && !empty( $this->mInfo['set_id'] ) ) {
			//legibility
			$overlay_type = $this->mOverlayType;
			$overlay_id = (int)$this->mOverlayId;
			$keychain_table = $this->mOverlayKeychainTable;
			$set_id = (int)$this->getField('set_id');

			$this->mDb->StartTrans();
			// get pos of overlay we want to move down
			$query1 = "SELECT `pos` FROM `".BIT_DB_PREFIX.$keychain_table."` WHERE `".$overlay_type."_id`=? AND `set_id`=?"; 
			$result1 = $this->mDb->query( $query1, array($overlay_id, $set_id) );
			$res1 = $result1->fetchRow();
			if( $res1 ){
				// Move Up
				if( $pDirection == 'up' ){
					// get sets above
					$query2 = "SELECT `".$overlay_type."_id`, `set_id`, `pos` FROM `".BIT_DB_PREFIX.$keychain_table."` WHERE `pos`<? and `set_id`=? ORDER BY `pos` DESC";
				// Move Down 
				}else{
					// get sets below
					$query2 = "SELECT `".$overlay_type."_id`, `set_id`, `pos` FROM `".BIT_DB_PREFIX.$keychain_table."` WHERE `pos`>? and `set_id`=? ORDER BY `pos` ASC";
				}
				$result2 = $this->mDb->query( $query2, array((int)$res1["pos"], $set_id) );
				$res2 = $result2->fetchRow();
				if ($res2) {
					//Swap position values
					$query3 = "UPDATE `".BIT_DB_PREFIX.$keychain_table."` SET `pos`=? WHERE `set_id` = ? AND `".$overlay_type."_id`=?";
					$this->mDb->query( $query3, array((int)$res2["pos"], $set_id, $overlay_id) );
					$this->mDb->query( $query3, array((int)$res1["pos"], $set_id, $res2[$overlay_type.'_id']) );
				}elseif( $pDirection == 'up' ){
					$this->mErrors['change_pos'] = tra("The object is already at the top of the list" );
				}else{
					$this->mErrors['change_pos'] = tra("The object is already at the bottom of the list" );
				}
			}
			$this->mDb->CompleteTrans();
		}
		return( count( $this->mErrors ) == 0 );
	}

	/**
	 * moveUp
	 *
	 * @access public
	 * convenience function, see changeSetPos
	 **/
	function moveUp(){
		return $this->changePos( 'up' );
	}

	/**
	 * moveDown
	 *
	 * @access public
	 * convenience function, see changeSetPos
	 **/
	function moveDown(){
		return $this->changePos( 'down' );
	}
}
?>
