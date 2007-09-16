<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Get the markerset for specified set_id
require_once(GMAP_PKG_PATH.'lookup_markerset_inc.php' );

// Now check permissions to access the markerset
if( $gContent->isValid() ) {
	$gContent->verifyEditPermission();
} else {
	$gBitSystem->verifyPermission( 'p_gmap_markerset_edit' );
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';

if (!empty($_REQUEST["save_markerset"])) {
    if( $gContent->store( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('markersetInfo', $gContent->mInfo);
	}
//Check if this to remove from a map, or to delete completely
}elseif (!empty($_REQUEST["remove_markerset"])) {
    if( $gContent->removeSetFromMap( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
	}
}elseif (!empty($_REQUEST["expunge_markerset"])) {
    if( $gContent->expunge() ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$markerset = $gContent->mInfo;
	$gBitSmarty->assign_by_ref('markersetInfo', $markerset);
	$gBitSystem->display('bitpackage:gmap/edit_markerset.tpl', NULL, 'center_only');
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->display('bitpackage:gmap/edit_markerset_xml.tpl', null, $format);
}
?>	
