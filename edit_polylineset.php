<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_polylineset.php,v 1.17 2008/06/19 04:21:17 lsces Exp $
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

// Get the polylineset for specified set_id
require_once(GMAP_PKG_PATH.'lookup_polylineset_inc.php' );

$gBitSystem->setFormatHeader( 'center_only' );

// Now check permissions to access the polylineset
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
			$gBitSystem->fatalError( tra( "You can not add polylinesets to this map!" ));
			die;
		}
	}		
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

$format = 'xml';
$XMLContent = "";
$statusCode = 401;
if (!empty($_REQUEST["save_polylineset"])) {
    if( $gContent->store( $_REQUEST ) ) {
		$statusCode = 200;
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setEditSharing( $_REQUEST );
			$gContent->setAllowChildren( $_REQUEST );
		}    
		$gBitSmarty->assign_by_ref('polylinesetInfo', $gContent->mInfo);
	}
//Check if this to remove from a map, or to delete completely
}elseif (!empty($_REQUEST["remove_polylineset"])) {
	if ( $gContent->hasAdminPermission() ){
	    if( $gContent->removeSetFromMap( $_REQUEST ) ) {
			$statusCode = 200;
			$gBitSmarty->assign('removeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to remove the polylineset." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to remove this polylineset from this map." );
	}
}elseif (!empty($_REQUEST["expunge_polylineset"])) {
	if ( $gContent->hasAdminPermission() ){
		if( $gContent->expunge() ) {
			$statusCode = 200;
			$gBitSmarty->assign('expungeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to delete the polylineset." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to delete this polylineset." );
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$polylineset = $gContent->mInfo;
	require_once(GMAP_PKG_PATH.'BitGmap.php' );
	$gmap = new BitGmap();
	$polylineStyles = $gmap->getPolylineStyles(); 
	$gBitSmarty->assign( 'polylineStyles', $polylineStyles );	
	$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
	$gBitSmarty->assign( 'childrenAllowed', $gContent->childrenAllowed() );
	$gBitSmarty->assign_by_ref('polylinesetInfo', $polylineset);
	$gBitSystem->display('bitpackage:gmap/edit_polylineset.tpl', NULL, 'center_only');
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitSystem->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);
	$gBitSystem->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_polylineset_xml.tpl');
}
?>