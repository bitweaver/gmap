<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/BitGmapOverlaySetBase.php,v 1.17 2008/10/08 16:15:52 wjames5 Exp $
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

require_once( LIBERTY_PKG_PATH.'LibertyContent.php' );


/**
 * class BitGmapOverlayBase
 * this is the class that contains all the functions for the package
 * 
 * @package gmap
 */
class BitGmapOverlaySetBase extends LibertyContent {
	/**
	* The set type
	* @public
	*/
	var $mOverlaySetId;
	
	var $mOverlaySetType;

	var $mOverlaySetTable;
	
	var $mOverlaySetKeychainTable;
		
	var $mOverlaySetStyleTable;
	
	var $mOverlaySetSeq;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapOverlaySetBase() {
		parent::LibertyContent();
		
		// Permission setup
		$this->mViewContentPerm  = 'p_gmap_overlayset_view';
		$this->mCreateContentPerm  = 'p_gmap_overlayset_create';
		$this->mEditContentPerm  = 'p_gmap_overlayset_edit';
		$this->mAdminContentPerm = 'p_gmap_admin';
	}

	//* Gets data for a given marker set.
	// @ todo this should probably take an array so that we can get data for a bunch of sets if we want
	function load( $pGmapId = NULL ) {
		global $gBitSystem;
		if( !empty( $this->mOverlaySetId ) || !empty( $this->mContentId ) ) {
			$lookupColumn = !empty( $this->mOverlaySetId )? 'set_id' : 'content_id';
		
			$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
			array_push( $bindVars,  $lookupId = @BitBase::verifyId( $this->mOverlaySetId )? $this->mOverlaySetId : $this->mContentId );
			if ( !empty( $pGmapId ) && is_numeric( $pGmapId) && $this->mOverlaySetType != NULL ){
				$selectSql = ", osk.*";
				$joinSql = "LEFT JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` osk ON ( osk.`set_id` = os.`set_id` )";
				$whereSql = "AND osk.`gmap_id` = ? AND osk.`set_type` = ?";
				$bindVars = array_merge( $bindVars, array( $pGmapId, $this->mOverlaySetType ));
			}
			
			$this->getServicesSql( 'content_load_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

			$query = "select os.*, lc.*,
					  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
					  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
					  FROM `".BIT_DB_PREFIX.$this->mOverlaySetTable."` os
						INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON (lc.`content_id` = os.`content_id`) $joinSql
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
					  WHERE os.`$lookupColumn`=? $whereSql";
					  
			$result = $this->mDb->query( $query, $bindVars );
			
			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mInfo['gmap_id'] = $pGmapId;
				$this->mOverlaySetId = $result->fields['set_id'];
				$this->mContentId = $result->fields['content_id'];
			}
		}
		return( count( $this->mInfo ) );
	}


	/**
	* This function stores a set
	**/
	function store( &$pParamHash ) {
		if( $this->verify( $pParamHash ) ) {
			$this->mDb->StartTrans();
			if( parent::store( $pParamHash ) ) {
				if( $this->mOverlaySetId ) {
					$this->mDb->associateUpdate( BIT_DB_PREFIX.$this->mOverlaySetTable, $pParamHash['set_store'], array( "set_id" => $pParamHash['set_id'] ) );
					// and we update the set keychain on map_id.
					if ( isset($pParamHash['keychain_ids']['gmap_id']) ){
						$pParamHash['keychain_ids']['set_id'] = $pParamHash['set_id'];
						$this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_update'], $pParamHash['keychain_ids'] );
					}
				} else {
					$pParamHash['set_store']['content_id'] = $this->mContentId;
					$pParamHash['set_store']['set_id'] = $this->mDb->GenID( $this->mOverlaySetSeq );
					$this->mDb->associateInsert( BIT_DB_PREFIX.$this->mOverlaySetTable, $pParamHash['set_store'] );
					// and insert an entry in the set keychain and associate it with a map.
					if ( isset($pParamHash['keychain_store']['gmap_id']) ){
						$pParamHash['keychain_store']['set_id'] = $pParamHash['set_store']['set_id'];
						$this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_store'] );
					}
				}
				$this->mDb->CompleteTrans();

				// re-query to confirm results
				$gmapId = isset($pParamHash['keychain_store']['gmap_id'])?$pParamHash['keychain_store']['gmap_id']:NULL;
				$this->load( $gmapId );

			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return( count( $this->mInfo ) );
	}
	
	/**
	* This function deletes a set
	**/
	function expunge() {
		$ret = FALSE;
		if( $this->isValid() ) {
			$this->mDb->StartTrans();
			$this->expungeVersion(); // will nuke all versions
			$query = "DELETE FROM `".BIT_DB_PREFIX.$this->mOverlaySetTable."` WHERE `content_id` = ?";
			$result = $this->mDb->query( $query, array( $this->mContentId ) );
  			// delete all references to the set from the set keychain
    		$query = "DELETE FROM `".BIT_DB_PREFIX.$this->mOverlaySetKeychainTable."` WHERE `set_id` =?";
    		$result = $this->mDb->query( $query, array( $this->mOverlaySetId ) );
  			// delete all references to the marker set from the map sets keychain
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` WHERE `set_id` =? AND `set_type` = ?";
  			$result = $this->mDb->query( $query, array( $this->mOverlaySetId, $this->mOverlaySetType ) );
			if( LibertyMime::expunge() ) {
				$ret = TRUE;
				$this->mDb->CompleteTrans();
			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return $ret;
	}

	function verifySetRemove( &$pParamHash ) {
	
		$pParamHash['set_remove'] = array();

		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['set_remove']['gmap_id'] = $pParamHash['gmap_id'];
		}
		
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['set_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
				
	}

	
	/**
	* This function removes a set from a map
	**/
	function removeSetFromMap( &$pParamHash ) {
		$ret = FALSE;

  		if( $this->verifyMarkerSetRemove( $pParamHash ) ) {
  			$this->mDb->StartTrans();
  			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
  			WHERE `gmap_id` = ?
  			AND `set_id` =?
        	AND `set_type` = ".$this->mOverlaySetType;
  			$result = $this->mDb->query( $query, $pParamHash['set_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}

		return $ret;
	}
		

	function getList( &$pListHash ) {
		global $gBitUser, $gBitSystem;
		
		$this->prepGetList( $pListHash );
		
		$ret = NULL;
		
		$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
		array_push( $bindVars, $this->mContentTypeGuid );
		
		$this->getServicesSql( 'content_list_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );
  		
		if( @$this->verifyId( $pListHash['gmap_id'] ) ) {
			$selectSql .= ", gsk.* ";
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON (gsk.`set_id` = gos.`set_id`)";
			$whereSql .= " AND gsk.`set_type` = '".$this->mOverlaySetType."' AND gsk.`gmap_id` = ? "; 
			array_push( $bindVars, (int)$pListHash['gmap_id'] );
		}

		$sortModePrefix = 'lc.';
		$sort_mode = $sortModePrefix . $this->mDb->convertSortmode( $pListHash['sort_mode'] );
  		
      	$query = "SELECT DISTINCT gos.*, lc.*,
					uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
					uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
				FROM `".BIT_DB_PREFIX.$this->mOverlaySetTable."` gos 
				INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON( gos.`content_id`=lc.`content_id` ) $joinSql
				LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
				LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
				WHERE lc.`content_type_guid` = ? $whereSql
                ORDER BY gos.`set_id` ASC";

		$query_cant = "
			SELECT COUNT( * )
		    FROM `".BIT_DB_PREFIX.$this->mOverlaySetTable."` gos 
				INNER JOIN      `".BIT_DB_PREFIX."liberty_content`       lc ON lc.`content_id` = gos.`content_id`
				INNER JOIN		`".BIT_DB_PREFIX."users_users`			 uu ON uu.`user_id`			   = lc.`user_id`
				$joinSql
			WHERE lc.`content_type_guid` = ? $whereSql ";

		$result = $this->mDb->query($query,$bindVars,$pListHash['max_records'],$pListHash['offset']);
		$cant = $this->mDb->getOne($query_cant,$bindVars);

		while ($res = $result->fetchrow()) {
			$res['parsed_data'] = $this->parseData( $res['data'], $res['format_guid'] );
			$ret[] = $res;
		}
		
		$pListHash["data"] = $ret;
		$pListHash["cant"] = $cant;

		LibertyContent::postGetList( $pListHash );

		return $pListHash;
	}
	
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
	
	function setEditSharing(&$pParamHash){
		// we're setting registered users permission
		$this->togglePermissionSharing( $this->mEditContentPerm, 3, !empty($pParamHash['share_edit'])?TRUE:FALSE );
	}
	
	function isEditShared(){
		// we're checking registered users perms
		return $this->isPermissionShared( $this->mEditContentPerm, 3 );
	}

	function setAllowChildren(&$pParamHash){
		// we're setting registered users permission
		$this->togglePermissionSharing( 'p_gmap_attach_children', 3, !empty($pParamHash['allow_children'])?TRUE:FALSE );
	}

	function childrenAllowed(){
		// we're checking registered users perms
		return $this->isPermissionShared( 'p_gmap_attach_children', 3 );
	}	
}
?>
