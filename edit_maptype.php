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

if (!empty($_REQUEST["save_maptype"])) {
    if( $result = $gContent->storeMapType( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('maptypeInfo', $result->fields );
    }
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_maptype"])) {
    if( $gContent->removeMapTypeFromMap( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
	}
}elseif (!empty($_REQUEST["expunge_maptype"])) {
    if( $gContent->expungeMapType( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
    }
}

if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->display('bitpackage:gmap/edit_maptype_xml.tpl', null, $format);
}
?>	
