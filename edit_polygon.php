<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_polygon.php,v 1.8 2007/09/20 19:44:13 wjames5 Exp $
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

// Get the polygon for specified gpolygon_id
require_once(GMAP_PKG_PATH.'lookup_polygon_inc.php' );

$gBitSystem->setFormatHeader( 'center_only' );

// Now check permissions to access the polygon
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
		require_once(GMAP_PKG_PATH.'BitGmapPolygonSet.php' );
		$set = new BitGmapPolygonSet( $_REQUEST['set_id'] );
		$set->load();
		if ( $set->isValid() && !$set->hasUserPermission( 'p_gmap_attach_children' ) ){
			$gBitSystem->fatalError( tra( "You can not add polygons to this polygon set!" ));
			die;
		}
	}	
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

//most of the time we want xml back so we make it the default
$format = 'xml';

if (!empty($_REQUEST["save_polygon"])) {
    if( $gContent->store( $_REQUEST ) ) {		
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setEditSharing( $_REQUEST );
		}    
		$gBitSmarty->assign_by_ref('polygonInfo', $gContent->mInfo);
	}
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_polygon"])) {
    if( $gContent->removeFromSet( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
	}
}elseif (!empty($_REQUEST["expunge_polygon"])) {
    if( $gContent->expunge() ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$polygon = $gContent->mInfo;
	if (isset($_REQUEST["set_id"])){
		$polygon['set_id'] = $_REQUEST["set_id"];
	}
	$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
	$gBitSmarty->assign_by_ref('polygonInfo', $polygon);
	$gBitSystem->display('bitpackage:gmap/edit_polygon.tpl', NULL, 'center_only');
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_polygon_xml.tpl');
}

?>