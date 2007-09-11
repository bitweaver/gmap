<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('bit_gm_edit_map' );

// Access the gmap class
global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );
$gContent = new BitGmap();

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';

if (!empty($_REQUEST["save_iconstyle"])) {
    if( $result = $gContent->storeIconStyle( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('iconstyleInfo', $result->fields );    
    }
}else{
	if ( isset( $_REQUEST["icon_id"] ) ){
		$iconstyle = $gContent->getIconStyleData( $_REQUEST["icon_id"] );
	}
	$gBitSmarty->assign_by_ref('iconstyleInfo', $iconstyle->fields);
	$gBitSystem->display('bitpackage:gmap/edit_iconstyle.tpl', NULL, 'center_only');
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->display('bitpackage:gmap/edit_iconstyle_xml.tpl', null, $format);
}
?>	
