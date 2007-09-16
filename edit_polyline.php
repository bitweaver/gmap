<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('p_gmap_edit' );

// Access the gmap class
global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );
$gContent = new BitGmap();

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';

if (!empty($_REQUEST["save_polyline"])) {
    if( $result = $gContent->storePolyline( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('polylineInfo', $result->fields );
    }
//Check if this to remove from a map, or to delete completely
}elseif ( !empty($_REQUEST["remove_polyline"]) ) {
    if( $gContent->removePolylineFromSet( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
    }
}elseif (!empty($_REQUEST["expunge_polyline"])) {
    if( $gContent->expungePolyline( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
    }
}else{
	if ( isset( $_REQUEST["polyline_id"] ) ){
		$polyline = $gContent->getPolylineData( $_REQUEST["polyline_id"] );
	}
	if (isset($_REQUEST["set_id"])){
		$polyline->fields['set_id'] = $_REQUEST["set_id"];
	}
	$gBitSmarty->assign_by_ref('polylineInfo', $polyline->fields);
	$gBitSystem->display('bitpackage:gmap/edit_polyline.tpl', NULL, 'center_only');
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->display('bitpackage:gmap/edit_polyline_xml.tpl', null, $format);
}
?>