<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission( 'p_gmap_edit' );

// Access the gmap class
global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );
$gContent = new BitGmap();

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';

if (!empty($_REQUEST["save_polylineset"])) {
    if( $result = $gContent->storePolylineSet( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('polylinesetInfo', $result->fields );
    }
//Check if this to remove from a map, or to delete completely
}elseif (!empty($_REQUEST["remove_polylineset"])) {
    if( $gContent->removePolylineSetFromMap( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
    }
}elseif (!empty($_REQUEST["expunge_polylineset"])) {
    if( $gContent->expungePolylineSet( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
    }
}else{
	if ( isset( $_REQUEST["set_id"] ) ){
		$set = $gContent->getPolylineSetData( $_REQUEST["set_id"] );
	}
	$gBitSmarty->assign_by_ref('polylineInfo', $set->fields);
	$gBitSystem->display('bitpackage:gmap/edit_polylineset.tpl', NULL, 'center_only');
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->display('bitpackage:gmap/edit_polylineset_xml.tpl', null, $format);
}
?>