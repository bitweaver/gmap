<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_polygonset.php,v 1.22 2008/10/20 21:40:10 spiderr Exp $
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

// Get the polygonset for specified set_id
require_once(GMAP_PKG_PATH.'lookup_polygonset_inc.php' );

$gBitThemes->setFormatHeader( 'center_only' );

// Now check permissions to access the polygonset
if( $gContent->isValid() ) {
	$gContent->verifyUpdatePermission();
} else {
	$gContent->verifyCreatePermission();
	// $gBitSystem->verifyPermission( 'p_gmap_overlayset_edit' );

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
$XMLContent = "";
$statusCode = 401;
if (!empty($_REQUEST["save_polygonset"])) {
	$gBitUser->verifyTicket();
    if( $gContent->store( $_REQUEST ) ) {
		$statusCode = 200;
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setEditSharing( $_REQUEST );
			$gContent->setAllowChildren( $_REQUEST );
		}    
		$gBitSmarty->assign_by_ref('polygonsetInfo', $gContent->mInfo);
	}
//Check if this to remove from a map, or to delete completely
}elseif (!empty($_REQUEST["remove_polygonset"])) {
	if ( $gContent->hasAdminPermission() ){
		$gBitUser->verifyTicket();
	    if( $gContent->removeSetFromMap( $_REQUEST ) ) {
			$statusCode = 200;
			$gBitSmarty->assign('removeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to remove the polygonset." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to remove this polygonset from this map." );
	}
}elseif (!empty($_REQUEST["expunge_polygonset"])) {
	if ( $gContent->hasAdminPermission() ){
		$gBitUser->verifyTicket();
		if( $gContent->expunge() ) {
			$statusCode = 200;
			$gBitSmarty->assign('expungeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to delete the polygonset." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to delete this polygonset." );
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$polygonset = $gContent->mInfo;
	require_once(GMAP_PKG_PATH.'BitGmap.php' );
	$gmap = new BitGmap();
	$listHash = array();
	$polylineStyles = $gmap->getPolylineStyles( $listHash ); 
	$polygonStyles = $gmap->getPolygonStyles( $listHash ); 
	
	// match the style to get the name - some day we should get this in the load query 
	if( $gContent->isValid() ){
		foreach( $polylineStyles as $style ){
			if( $style['style_id'] == $polygonset['polylinestyle_id'] ){
				$polygonset['polylinestyle_name'] = $style['name'];
				break;
			}
		}

		foreach( $polygonStyles as $style ){
			if( $style['style_id'] == $polygonset['style_id'] ){
				$polygonset['style_name'] = $style['name'];
				break;
			}
		}
	}

	$gBitSmarty->assign( 'polylineStyles', $polylineStyles );
	$gBitSmarty->assign( 'polygonStyles', $polygonStyles );
	$gBitSmarty->assign( 'editShared', $gContent->isEditShared() );
	$gBitSmarty->assign( 'childrenAllowed', $gContent->childrenAllowed() );
	$gBitSmarty->assign_by_ref('polygonsetInfo', $polygonset);
	$gBitSystem->display('bitpackage:gmap/edit_polygonset.tpl', NULL, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
	die;
}


if ( count($gContent->mErrors) > 0 ){
	$gBitThemes->setFormatHeader( 'center_only' );
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}else{
	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);
	$gBitThemes->setFormatHeader( 'xml' );
	$gBitSystem->display('bitpackage:gmap/edit_polygonset_xml.tpl', NULL, array( 'display_mode' => 'edit' ));
}
?>
