<?php
/**
 * @version $Header$
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See below for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 * @subpackage functions
 */

/**
 * required setup
 */
require_once('../kernel/setup_inc.php' );

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
	$XMLContent = "There were errors with your request:";
	foreach( $gContent->mErrors as $key=>$error ){
		$XMLContent .= "\n".$error."\n";
	}
}

$gBitSmarty->assign( 'statusCode', $statusCode);
$gBitSmarty->assign( 'XMLContent', $XMLContent);
$gBitThemes->setFormatHeader( 'xml' );
$gBitSystem->display('bitpackage:gmap/edit_tilelayer_xml.tpl', NULL, array( 'display_mode' => 'edit' ));
?>
