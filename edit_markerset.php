<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_markerset.php,v 1.21 2008/07/01 14:26:59 wjames5 Exp $
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

// Get the markerset for specified set_id
require_once(GMAP_PKG_PATH.'lookup_markerset_inc.php' );

$gBitThemes->setFormatHeader( 'center_only' );

// Now check permissions to access the markerset
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
			$gBitSystem->fatalError( tra( "You can not add markersets to this map!" ));
			die;
		}
	}	
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.
$XMLContent = "";
$statusCode = 401;
if (!empty($_REQUEST["save_markerset"])) {
    if( $gContent->store( $_REQUEST ) ) {
		$statusCode = 200;
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setEditSharing( $_REQUEST );
			$gContent->setAllowChildren( $_REQUEST );
		}    
		$gBitSmarty->assign_by_ref('markersetInfo', $gContent->mInfo);
	}
//Check if this to remove from a map, or to delete completely
}elseif (!empty($_REQUEST["remove_markerset"])) {
	if ( $gContent->hasAdminPermission() ){
	    if( $gContent->removeSetFromMap( $_REQUEST ) ) {
			$statusCode = 200;
			$gBitSmarty->assign('removeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to remove the markerset." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to remove this markerset from this map." );
	}
}elseif (!empty($_REQUEST["expunge_markerset"])) {
	if ( $gContent->hasAdminPermission() ){
		if( $gContent->expunge() ) {
			$statusCode = 200;
			$gBitSmarty->assign('expungeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to delete the markerset." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to delete this markerset." );
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$markerset = $gContent->mInfo;
	require_once(GMAP_PKG_PATH.'BitGmap.php' );
	$gmap = new BitGmap();
	$iconStyles = $gmap->getIconStyles(); 
	$markerStyles = $gmap->getMarkerStyles(); 
	$gBitSmarty->assign( 'iconStyles', $iconStyles );
	$gBitSmarty->assign( 'markerStyles', $markerStyles );
	
	$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
	$gBitSmarty->assign( 'childrenAllowed', $gContent->childrenAllowed() );
	$gBitSmarty->assign_by_ref('markersetInfo', $markerset);
	$gBitSystem->display('bitpackage:gmap/edit_markerset.tpl', NULL, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$gBitThemes->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);
	$gBitThemes->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_markerset_xml.tpl', NULL, array( 'display_mode' => 'edit' ));
}
?>	
