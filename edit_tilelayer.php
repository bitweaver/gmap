<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_tilelayer.php,v 1.16 2008/10/20 21:52:04 spiderr Exp $
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

// Now check permissions to access this page
$gBitSystem->verifyPermission( 'p_gmap_update' );

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
	$gBitUser->verifyTicket();
    if( $result = $gContent->storeTilelayer( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign_by_ref('tilelayerInfo', $result );
    }
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_tilelayer"])) {
	$gBitUser->verifyTicket();
    if( $gContent->removeTilelayerFromMaptype( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign('removeSucces', true);
	}else{
		$XMLContent = tra( "Sorry, there was an unknown error trying to remove the tilelayer." );
	}
}elseif (!empty($_REQUEST["expunge_tilelayer"])) {
	$gBitUser->verifyTicket();
    if( $gContent->expungeTilelayer( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign('expungeSucces', true);
	}else{
		$XMLContent = tra( "Sorry, there was an unknown error trying to delete the tilelayer." );
	}
}else{
	if ( isset( $_REQUEST["tilelayer_id"] ) ){
		$tilelayer = $gContent->getTilelayer( $_REQUEST );
	}
	if (isset($_REQUEST["maptype_id"])){
		$tilelayer['maptype_id'] = $_REQUEST["maptype_id"];
	}
	$gBitSmarty->assign_by_ref('tilelayerInfo', $tilelayer);
	$gBitSystem->display('bitpackage:gmap/edit_tilelayer.tpl', NULL, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitThemes->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);
	$gBitThemes->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_tilelayer_xml.tpl', NULL, array( 'display_mode' => 'edit' ));
}
?>
