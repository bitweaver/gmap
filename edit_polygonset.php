<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Get the markerset for specified set_id
require_once(GMAP_PKG_PATH.'lookup_polygonset_inc.php' );

$gBitSystem->setFormatHeader( 'center_only' );

// Now check permissions to access the polygonset
if( $gContent->isValid() ) {
	$gContent->verifyEditPermission();
} else {
	$gBitSystem->verifyPermission( 'p_gmap_overlayset_edit' );

	/* if we are passed a gmap_id the user is trying to add a set to a map.
	   if they dont have the right, then fuck it.
	   in the future it might be nice to send this back as an alert to display 
	   so that the form does not get erased and their work is not lost, but this 
	   should prevent the form from even loading. -wjames5
	*/
	if ( isset($_REQUEST['gmap_id']) ){
		require_once(GMAP_PKG_PATH.'BitGmap.php' );
		$set = new BitGmap( $_REQUEST['gmap_id'] );
		$set->load();
		if ( $set->isValid() && !$set->hasUserPermission( 'p_gmap_attach_children' ) ){
			$gBitSystem->fatalError( tra( "You can not add polygonsets to this map!" ));
			die;
		}
	}		
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';

if (!empty($_REQUEST["save_polygonset"])) {
    if( $gContent->store( $_REQUEST ) ) {
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setEditSharing( $_REQUEST );
			$gContent->setAllowChildren( $_REQUEST );
		}    
		$gBitSmarty->assign_by_ref('polygonsetInfo', $gContent->mInfo);
	}
//Check if this to remove from a map, or to delete completely
}elseif (!empty($_REQUEST["remove_polygonset"])) {
    if( $gContent->removeSetFromMap( $_REQUEST ) ) {
		$gBitSmarty->assign_by_ref('removeSucces', true);
	}
}elseif (!empty($_REQUEST["expunge_polygonset"])) {
    if( $gContent->expunge() ) {
		$gBitSmarty->assign_by_ref('expungeSucces', true);
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$polygonset = $gContent->mInfo;
	$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
	$gBitSmarty->assign( 'childrenAllowed', $gContent->childrenAllowed() );
	$gBitSmarty->assign_by_ref('polygonsetInfo', $polygonset);
	$gBitSystem->display('bitpackage:gmap/edit_polygonset.tpl', NULL, 'center_only');
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSystem->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_polygonset_xml.tpl');
}
?>