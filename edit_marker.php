<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_marker.php,v 1.27 2007/09/18 20:40:15 wjames5 Exp $
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

$gBitSystem->setFormatHeader( 'center_only' );

// Now check permissions to access the marker
if( $gContent->isValid() ) {
	$gContent->verifyEditPermission();
} else {
	$gBitSystem->verifyPermission( 'p_gmap_overlay_edit' );
	
	/* if we are passed a set_id the user is trying to add an overlay to a set.
	   if they dont have the right, then fuck it.
	   in the future it might be nice to send this back as an alert to display 
	   so that the form does not get erased and their work is not lost, but this 
	   should prevent the form from even loading. -wjames5
	*/
	if ( isset($_REQUEST['set_id']) ){
		require_once(GMAP_PKG_PATH.'BitGmapMarkerSet.php' );
		$set = new BitGmapMarkerSet( $_REQUEST['set_id'] );
		$set->load();
		if ( $set->isValid() && !$set->hasUserPermission( 'p_gmap_attach_children' ) ){
			$gBitSystem->fatalError( tra( "You can not add markers to this marker set!" ));
			die;
		}
	}
}


//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

//most of the time we want xml back so we make it the default
$format = 'xml';

if (!empty($_REQUEST["save_marker"])) {	
    if( $gContent->store( $_REQUEST ) ) {
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setEditSharing( $_REQUEST );
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
	$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
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