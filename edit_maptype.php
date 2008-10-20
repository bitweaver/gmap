<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_maptype.php,v 1.20 2008/10/20 21:52:04 spiderr Exp $
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

// Access the gmap class
global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );
$gContent = new BitGmap();

//if a maptype_id is passed try to look it up and see if the user is the owner or has admin perms
if ( isset( $_REQUEST['maptype_id'] ) && is_numeric( $_REQUEST['maptype_id'] ) ){
	$maptype = $gContent->getMapType( $_REQUEST['maptype_id'] );
	if ( $maptype != NULL && ( $maptype['user_id'] == $gBitUser->mUserId || $gBitUser->hasPermission( 'p_gmap_admin' ) ) != TRUE ){
		$gBitSystem->fatalError( tra( "You can not edit this maptype!" ));
	}
}

//check the user has permission to edit maptypes in general
$gBitSystem->verifyPermission('p_gmap_update' );

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';

if (!empty($_REQUEST["save_maptype"])) {
	$gBitUser->verifyTicket();
	if( $result = $gContent->storeMapType( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('maptypeInfo', $result );
	}
	//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_maptype"])) {
	$gBitUser->verifyTicket();
	if( $gContent->removeMapTypeFromMap( $_REQUEST ) ) {
		$gBitSmarty->assign('removeSucces', true);
	}
}elseif (!empty($_REQUEST["expunge_maptype"])) {
	$gBitUser->verifyTicket();
	if( $gContent->expungeMapType( $_REQUEST ) ) {
		$gBitSmarty->assign('expungeSucces', true);
	}
}else{
	if ( isset( $_REQUEST["maptype_id"] ) ){
		$maptype = $gContent->getMapType( $_REQUEST["maptype_id"] );
	}
	$gBitSmarty->assign_by_ref('maptypeInfo', $maptype );
	$gBitSystem->display('bitpackage:gmap/edit_maptype.tpl', NULL, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitThemes->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->display('bitpackage:gmap/edit_maptype_xml.tpl', null, array( 'format' => $format, 'display_mode' => 'edit' ));
}
?>
