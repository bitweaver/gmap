<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

//@todo consolidate the xml headers, they are all the same

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Check permission to create or edit a marker
$gBitSystem->verifyPermission('p_gmarker_create' );

// Get the marker for specified gmarker_id
require_once(GMAP_PKG_PATH.'lookup_marker_inc.php' );

// If a marker_id or content_id is passed in then check for ownership or admin
if (!empty($_REQUEST['marker_id']) || !empty($_REQUEST['content_id'])) {
	$markerEdit = FALSE;
	if ( $gContent->isOwner() || $gBitUser->hasPermission( 'p_gmarker_edit' ) ){
		$markerEdit = TRUE;
	}
	if ( $markerEdit = FALSE ){
		//@TODO - this prolly needs to check if its an ajax call or not
		$gBitSystem->fatalError( tra( "You do not have permission to edit this marker!" ));
	}
}


//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.
if (!empty($_REQUEST["save_marker"])) {
    if( $gContent->store( $_REQUEST ) ) {		
		$gContent->storePreference( 'allow_comments', !empty( $_REQUEST['allow_comments'] ) ? $_REQUEST['allow_comments'] : NULL );
		$gContent->load();
		$gBitSmarty->assign_by_ref('markerInfo', $gContent->mInfo);
		$gBitSystem->display('bitpackage:gmap/edit_marker_xml.tpl', NULL, 'xml');
	}else{
		$gBitSystem->setFormatHeader( 'center_only' );
		$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
	}
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_marker"])) {
    if( $gContent->removeFromSet( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
		$gBitSystem->display('bitpackage:gmap/edit_marker_xml.tpl', NULL, 'xml');
	}else{
		//@todo - return some sort of remove failure message in the xml
		$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}elseif (!empty($_REQUEST["expunge_marker"])) {
    if( $gContent->expunge() ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
		$gBitSystem->display('bitpackage:gmap/edit_marker_xml.tpl', NULL, 'xml');
	}else{
		$gBitSystem->setFormatHeader( 'center_only' );
		$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$marker = $gContent->mInfo;
	if (isset($_REQUEST["set_id"])){
		$marker['set_id'] = $_REQUEST["set_id"];
	}
	$gBitSmarty->assign_by_ref('markerInfo', $marker);
	$gBitSystem->display( 'bitpackage:gmap/edit_marker.tpl', NULL, 'center_only' );
}
?>
