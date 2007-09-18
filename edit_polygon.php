<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_polygon.php,v 1.5 2007/09/18 16:24:54 wjames5 Exp $
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

// Now check permissions to access the polygon
if( $gContent->isValid() ) {
	$gContent->verifyEditPermission();
} else {
	$gBitSystem->verifyPermission( 'p_gmap_overlay_edit' );
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

//most of the time we want xml back so we make it the default
$format = 'xml';

if (!empty($_REQUEST["save_polygon"])) {
    if( $gContent->store( $_REQUEST ) ) {		
    	if ( $gContent->verifyAdminPermission() ){
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
	$gBitSystem->display('bitpackage:gmap/edit_polygon_xml.tpl', null, $format);
}

?>