<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_iconstyle.php,v 1.24 2010/02/08 21:27:23 wjames5 Exp $
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

// Access the gmap class
global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );
$gContent = new BitGmap();

//if a maptype_id is passed try to look it up and see if the user is the owner or has admin perms
if ( isset( $_REQUEST['icon_id'] ) && is_numeric( $_REQUEST['icon_id'] ) ){
	$style = $gContent->getIconStyle( $_REQUEST['icon_id'] );
	if ( $style != NULL && ( $style['user_id'] == $gBitUser->mUserId || $gBitUser->hasPermission( 'p_gmap_admin' ) ) != TRUE ){
		$gBitSystem->fatalError( tra( "You can not edit this icon!" ));
	}
}

//check the user has permission to edit maptypes in general
$gBitSystem->verifyPermission( 'p_gmap_overlay_update' );

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';

if (!empty($_REQUEST["save_iconstyle"])) {
	$gBitUser->verifyTicket();
    if( $result = $gContent->storeIconStyle( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('iconstyleInfo', $result );    
    }
}else{
	if ( isset( $_REQUEST["icon_id"] ) ){
		$iconstyle = $gContent->getIconStyle( $_REQUEST["icon_id"] );
	}
	$gBitSmarty->assign_by_ref('iconstyleInfo', $iconstyle);
	$gBitSystem->display('bitpackage:gmap/edit_iconstyle.tpl', NULL, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$gBitThemes->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->display('bitpackage:gmap/edit_iconstyle_xml.tpl', null, array( 'format' => $format, 'display_mode' => 'edit' ));
}
?>	
