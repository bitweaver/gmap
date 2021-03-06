<?php
/**
 * @version $Header$
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

// Get the polygon for specified gpolygon_id
require_once(GMAP_PKG_PATH.'lookup_polygon_inc.php' );

$gBitThemes->setFormatHeader( 'center_only' );

// Now check permissions to access the polygon
if( $gContent->isValid() ) {
	if ( !$gContent->hasUpdatePermission() ){
		$gBitSystem->fatalError( tra( "Sorry, you do not have permission to edit this polygon." ));
	}
} else {
	$gContent->verifyCreatePermission();
	
	/* if we are passed a set_id the user is trying to add an overlay to a set.
	   if they dont have the right, then fuck it.
	   in the future it might be nice to send this back as an alert to display 
	   so that the form does not get erased and their work is not lost, but this 
	   should prevent the form from even loading. -wjames5
	*/
	if ( isset($_REQUEST['set_id']) ){
		require_once(GMAP_PKG_PATH.'BitGmapPolygonSet.php' );
		$set = new BitGmapPolygonSet( $_REQUEST['set_id'] );
		$set->load();
		if ( $set->isValid() && !$set->hasUserPermission( 'p_gmap_attach_children' ) ){
			$gBitSystem->fatalError( tra( "You can not add polygons to this polygon set!" ));
			die;
		}
	}	
}

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

//most of the time we want xml back so we make it the default
$format = 'xml';
$XMLContent = "";
$statusCode = 401;
if (!empty($_REQUEST["save_polygon"])) {
	$gBitUser->verifyTicket();
	$storeHash = $_REQUEST;
	// the user might be submitting encoded html chars by ajax - decode them before storing
	if( !empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest' ){
		@BitGmap::decodeAjaxRequest( $storeHash );
	}
    if( $gContent->store( $storeHash ) ) {
		$statusCode = 200;
		if ( $gContent->hasAdminPermission() ){
    		$gContent->setUpdateSharing( $_REQUEST );
		}    
		$gBitSmarty->assign_by_ref('polygonInfo', $gContent->mInfo);
	}
}elseif (!empty($_REQUEST['move_pos']) && !empty( $_REQUEST['set_id'] ) ){
	$gBitUser->verifyTicket();

	// this is a little ugly
	$gContent->mInfo['set_id'] = $_REQUEST['set_id'];

	if( ($_REQUEST['move_pos'] == 'up'?$gContent->moveUp():$gContent->moveDown()) ){
		$statusCode = 200;
		$XMLContent = tra( "Success" );
	}else{
		$XMLContent = tra( "Sorry, there was an unknown error: ".$gContent->mErrors['change_pos'] );
	}
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_polygon"])) {
	if ( $gContent->hasAdminPermission() ){
		$gBitUser->verifyTicket();
		if( $gContent->removeFromSet( $_REQUEST ) ) {
			$statusCode = 200;
			$gBitSmarty->assign('removeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to remove the marker." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to remove this marker from this set." );
	}
}elseif (!empty($_REQUEST["expunge_polygon"])) {
	if ( $gContent->hasAdminPermission() ){
		$gBitUser->verifyTicket();
		if( $gContent->expunge() ) {
			$statusCode = 200;
			$gBitSmarty->assign('expungeSucces', true);
		}else{
			$XMLContent = tra( "Sorry, there was an unknown error trying to delete the marker." );
		}
	}else{
		$XMLContent = tra( "You do not have the required permission to delete this marker." );
	}
}else{
	$gContent->invokeServices( 'content_edit_function' );
	$polygon = $gContent->mInfo;
	if (isset($_REQUEST["set_id"])){
		$polygon['set_id'] = $_REQUEST["set_id"];
	}
	$gBitSmarty->assign( 'updateShared', $gContent->isUpdateShared() );
	$gBitSmarty->assign_by_ref('polygonInfo', $polygon);
	$gBitSystem->display('bitpackage:gmap/edit_polygon.tpl', NULL, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
	die;
}

if ( count($gContent->mErrors) > 0 ){
	$XMLContent = "There were errors with your request:";
	foreach( $gContent->mErrors as $key=>$error ){
		$XMLContent .= "\n".$error."\n";
	}
}

$gBitSmarty->assign( 'statusCode', $statusCode);
$gBitSmarty->assign( 'XMLContent', $XMLContent);
$gBitThemes->setFormatHeader( 'xml' );
$gBitSystem->display('bitpackage:gmap/edit_polygon_xml.tpl', NULL, array( 'display_mode' => 'edit' ));
?>
