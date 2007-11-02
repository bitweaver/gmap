<?php
// Copyright (c) 2007 bitweaver Gmap
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
$XMLContent = "";
$statusCode = 401;
if (!empty($_REQUEST["save_tilelayer"])) {
    if( $result = $gContent->storeTilelayer( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign_by_ref('tilelayerInfo', $result );
    }
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_tilelayer"])) {
    if( $gContent->removeTilelayerFromMaptype( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign('removeSucces', true);
	}else{
		$XMLContent = tra( "Sorry, there was an unknown error trying to remove the tilelayer." );
	}
}elseif (!empty($_REQUEST["expunge_tilelayer"])) {
    if( $gContent->expungeTilelayer( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign('expungeSucces', true);
	}else{
		$XMLContent = tra( "Sorry, there was an unknown error trying to delete the tilelayer." );
	}
}else{
	if ( isset( $_REQUEST["tilelayer_id"] ) ){
		$tilelayer = $gContent->getTilelayer( $_REQUEST["tilelayer_id"] );
	}
	if (isset($_REQUEST["maptype_id"])){
		$tilelayer['maptype_id'] = $_REQUEST["maptype_id"];
	}
	$gBitSmarty->assign_by_ref('tilelayerInfo', $tilelayer);
	$gBitSystem->display('bitpackage:gmap/edit_tilelayer.tpl', NULL, 'center_only');
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);
	$gBitSystem->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_tilelayer_xml.tpl');
}
?>