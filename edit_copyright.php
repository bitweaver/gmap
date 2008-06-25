<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_copyright.php,v 1.11 2008/06/25 22:58:05 spiderr Exp $
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
$gBitSystem->verifyPermission('p_gmap_edit' );

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
if (!empty($_REQUEST["save_copyright"])) {
	if( $result = $gContent->storeCopyright( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign_by_ref('copyrightInfo', $result );
	}
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_copyright"])) {
	if( $gContent->removeCopyrightFromTilelayer( $_REQUEST ) ) {
		$gBitSmarty->assign('removeSucces', true);
	}else{
		$XMLContent = tra( "Sorry, there was an unknown error trying to remove the copyright." );
	}
}elseif (!empty($_REQUEST["expunge_copyright"])) {
	if( $gContent->expungeCopyright( $_REQUEST ) ) {
		$statusCode = 200;
		$gBitSmarty->assign('expungeSucces', true);
	}else{
		$XMLContent = tra( "Sorry, there was an unknown error trying to delete the copyright." );
	}
}else{
	if ( isset( $_REQUEST["copyright_id"] ) ){
		$copyright = $gContent->getCopyright( $_REQUEST["copyright_id"] );
	}
	if (isset($_REQUEST["copyright_id"])){
		$copyright['copyright_id'] = $_REQUEST["copyright_id"];
	}
	$gBitSmarty->assign_by_ref('copyrightInfo', $copyright);
	$gBitSystem->display('bitpackage:gmap/edit_copyright.tpl', NULL, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);
	$gBitSystem->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_copyright_xml.tpl', NULL, array( 'display_mode' => 'edit' ));
}
?>
