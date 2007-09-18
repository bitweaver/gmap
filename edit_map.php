<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_gmap_inc.php' );

// Now check permissions to access this page
$gBitSystem->setFormatHeader( 'center_only' );
if( $gContent->isValid() ) {
	vd('isValid - next call verifyEditPermissions - we want to check against our mEditContentPerm which is:');
	vd($gContent->mEditContentPerm);
	$gContent->verifyEditPermission();
} else {
	$gBitSystem->verifyPermission( 'p_gmap_edit' );
}


//if there is no API key don't even bother
if ($gBitSystem->isFeatureActive('gmap_api_key')){
	$gBitSystem->setFormatHeader( NULL );
	//Preview mode is handled by javascript on the client side.
	//There is no callback to the server for previewing changes.
	
	//Check if this is a update or a new map
	if (!empty($_REQUEST["save_map"])) {
		if( $gContent->store( $_REQUEST ) ) {
			if ( $gContent->verifyAdminPermission() ){
				$gContent->setEditSharing( $_REQUEST );
			}    
			$gContent->storePreference( 'allow_comments', !empty( $_REQUEST['allow_comments'] ) ? $_REQUEST['allow_comments'] : NULL );
			$gContent->load();
			$gBitSmarty->assign_by_ref('mapInfo', $gContent->mInfo);
			$gBitSystem->display('bitpackage:gmap/edit_map_xml.tpl', null, 'xml');
		}else{
			$gBitSystem->setFormatHeader( 'center_only' );
			$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
		}
	}else{
		$gContent->invokeServices( 'content_edit_function' );
		
		$map = $gContent->mInfo;
		if ( empty( $map['zoom_control'] ) ){
			if ( $gBitSystem->getConfig('gmap_zoom_control') ){
				$map['zoom_control'] = $gBitSystem->getConfig('gmap_zoom_control');
			}else{
				$map['zoom_control'] = 's';
			}
		}
		
		if ( empty( $map['scale'] ) ){
			if ( $gBitSystem->getConfig('gmap_scale') ){
				$map['scale'] = $gBitSystem->getConfig('gmap_scale');
			}else{
				$map['scale'] = 'false';
			}
		}

		if ( empty( $map['maptype_control'] ) ){
			if ( $gBitSystem->getConfig('gmap_maptype_control') ){
				$map['maptype_control'] = $gBitSystem->getConfig('gmap_maptype_control');
			}else{
				$map['maptype_control'] = 'true';
			}
		}

		if ( empty( $map['maptype'] ) ){
			if ( $gBitSystem->getConfig('gmap_maptype') ){
				$map['maptype'] = $gBitSystem->getConfig('gmap_maptype');
			}else{
				$map['maptype'] = 0;
			}
		}

		$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
		$gBitSmarty->assign_by_ref('mapInfo', $map);
		$gBitSmarty->assign_by_ref('mapTypes', $gContent->mMapTypes);
		$gBitSystem->display('bitpackage:gmap/edit_map.tpl', null, 'center_only');
	}
}else{
	$gBitSystem->display('bitpackage:gmap/error_nokey.tpl', null, 'center_only');
}
?>