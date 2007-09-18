<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_marker.php,v 1.22 2007/09/18 16:03:56 wjames5 Exp $
 * @package gmap
 * @subpackage functions
 */
//

// Copyright (c) 2005-2007 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Get the marker for specified gmarker_id
require_once(GMAP_PKG_PATH.'lookup_marker_inc.php' );

// Now check permissions to access the marker
if( $gContent->isValid() ) {
	$gContent->verifyEditPermission();
} else {
	$gBitSystem->verifyPermission( 'p_gmap_overlay_edit' );
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

//most of the time we want xml back so we make it the default
$format = 'xml';

if (!empty($_REQUEST["save_marker"])) {
    if( $gContent->store( $_REQUEST ) ) {
    	if ( $gContent->verifyAdminPermission() ){
			if ( isset( $_REQUEST['share_edit'] ) ){
				$revokeSharing = FALSE;
			}else{
				$revokeSharing = TRUE;
			}
			$gContent->storePermission( 3, 'p_gmap_overlay_edit', $revokeSharing );
		}
		$gContent->storePreference( 'allow_comments', !empty( $_REQUEST['allow_comments'] ) ? $_REQUEST['allow_comments'] : NULL );
		$gBitSmarty->assign_by_ref('markerInfo', $gContent->mInfo);
	}
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_marker"])) {
    if( $gContent->removeFromSet( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
	}
}elseif (!empty($_REQUEST["expunge_marker"])) {
    if( $gContent->expunge() ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$marker = $gContent->mInfo;
	if (isset($_REQUEST["set_id"])){
		$marker['set_id'] = $_REQUEST["set_id"];
	}
	vd($gContent->mPerms['p_gmap_overlay_edit']);
	if ( isset( $gContent->mPerms['p_gmap_overlay_edit'] ) && $gContent->mPerms['p_gmap_overlay_edit']['group_id'] == 3 && $gContent->mPerms['p_gmap_overlay_edit']['is_revoked'] != "y"){
		$gBitSmarty->assign( 'markerEditShared', TRUE );
	}
	$gBitSmarty->assign_by_ref('markerInfo', $marker);
	$gBitSystem->display('bitpackage:gmap/edit_marker.tpl', NULL, 'center_only');
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->setFormatHeader( NULL );
	$gBitSystem->display('bitpackage:gmap/edit_marker_xml.tpl', NULL, $format);
}
?>