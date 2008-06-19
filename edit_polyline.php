<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_polyline.php,v 1.22 2008/06/19 04:09:45 lsces Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 * @subpackage functions
 */

/**
 * required setup
 */
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Get the polyline for specified gpolyline_id
require_once(GMAP_PKG_PATH.'lookup_polyline_inc.php' );

$gBitSystem->setFormatHeader( 'center_only' );

// Now check permissions to access the polyline
if( $gContent->isValid() ) {
	if ( !$gContent->hasEditPermission() ){
		$gBitSystem->fatalError( tra( "Sorry, you do not have permission to edit this polyline." ));
	}
} else {
	$gBitSystem->verifyPermission( 'p_gmap_overlay_edit' );

	/* if we are passed a set_id the user is trying to add an overlay to a set.
	   if they dont have the right, then fuck it.
	   in the future it might be nice to send this back as an alert to display 
	   so that the form does not get erased and their work is not lost, but this 
	   should prevent the form from even loading. -wjames5
	*/
	if ( isset($_REQUEST['set_id']) ){
		require_once(GMAP_PKG_PATH.'BitGmapPolylineSet.php' );
		$set = new BitGmapPolylineSet( $_REQUEST['set_id'] );
		$set->load();
		if ( $set->isValid() && !$set->hasUserPermission( 'p_gmap_attach_children' ) ){
			$gBitSystem->fatalError( tra( "You can not add polylines to this polyline set!" ));
			die;
		}
	}	
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

//most of the time we want xml back so we make it the default
$format = 'xml';
$XMLContent = "";
$statusCode = 401;
if (!empty($_REQUEST["save_polyline"])) {
    if( $gContent->store( $_REQUEST ) ) {		
		$statusCode = 200;
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setEditSharing( $_REQUEST );
		}    
		$gBitSmarty->assign_by_ref('polylineInfo', $gContent->mInfo);
	}
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_polyline"])) {
	if ( $gContent->hasAdminPermission() ){
		if( $gContent->removeFromSet( $_REQUEST ) ) {
			$statusCode = 200;
			$gBitSmarty->assign('removeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to remove the marker." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to remove this marker from this set." );
	}
}elseif (!empty($_REQUEST["expunge_polyline"])) {
	if ( $gContent->hasAdminPermission() ){
		if( $gContent->expunge() ) {
			$statusCode = 200;
			$gBitSmarty->assign('expungeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to delete the marker." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to delete this marker." );
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$polyline = $gContent->mInfo;
	if (isset($_REQUEST["set_id"])){
		$polyline['set_id'] = $_REQUEST["set_id"];
	}
	$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
	$gBitSmarty->assign_by_ref('polylineInfo', $polyline);
	$gBitSystem->display('bitpackage:gmap/edit_polyline.tpl', NULL, 'center_only');
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);
	$gBitSystem->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_polyline_xml.tpl');
}
?>