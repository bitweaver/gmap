<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/view_overlayset.php,v 1.3 2009/10/01 14:17:00 wjames5 Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See below for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 * @author Will <will@tekimaki.com>
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

/**
 * figure out which type of overlay set we're looking up
 * sets can not be looked up by content_id only by <type>set_id
 */
$type = NULL;
if( !empty( $_REQUEST['markerset_id'] ) ){
	$_REQUEST['set_id'] = $_REQUEST['markerset_id'];
	$type = "marker";
}elseif( !empty( $_REQUEST['polylineset_id'] ) ){
	$_REQUEST['set_id'] = $_REQUEST['polylineset_id'];
	$type = "polyline";
}elseif( !empty( $_REQUEST['polygonset_id'] ) ){
	$_REQUEST['set_id'] = $_REQUEST['polygonset_id'];
	$type = "polygon";
}else{
	// no set id we fatal
    $gBitSystem->fatalError( "A valid overlay set id was not requested." );
}

// Get the overlayset for specified overylay set_id
require_once(GMAP_PKG_PATH.'lookup_'.$type.'set_inc.php' );

// Verify we have permission to view this set
$gContent->verifyViewPermission();

// If after all that we still dont have a valid set we fatal
if( !$gContent->isValid() ) {
    $gBitSystem->setHttpStatus( 404 );
    $gBitSystem->fatalError( "The set you requested could not be found." );
}

// We have a valid set proceed...

// Call display services
$displayHash = array( 'perm_name' => 'p_gmap_overlayset_view' );
$gContent->invokeServices( 'content_display_function', $displayHash );

// Get attached overlays in this set
// get handler class
switch( $type ){
	case "marker":
		require_once( GMAP_PKG_PATH.'BitGmapMarker.php' );
		$overlay = new BitGmapMarker();
		// this is idiotic, classes need to have plural version
		$overlayTypePlural = tra("Markers");
		break;
	case "polyline":
		require_once( GMAP_PKG_PATH.'BitGmapPolyline.php' );
		$overlay = new BitGmapPolyline();
		$overlayTypePlural = tra("Polylines");
		break;
	case "polygon":
		require_once( GMAP_PKG_PATH.'BitGmapPolygon.php' );
		$overlay = new BitGmapPolygon();
		$overlayTypePlural = tra("Polygons");
		break;
}
// get the list of attached overlays
$joinHash = array('set_id' => $gContent->mOverlaySetId, 'max_records' => 9999, 'sort_mode' => 'pos_asc');
$overlayList = $overlay->getList( $joinHash );
$gContent->mOverlays = $overlayList['data'];
$gBitSmarty->assign_by_ref( 'list', $gContent->mOverlays );
$gBitSmarty->assign_by_ref( 'overlayTypePlural', $overlayTypePlural );

// display the list
$browserTitle = $gContent->getTitle();
$displayOptions = array( 'display_mode' => 'list' );
$gBitSystem->display('bitpackage:gmap/view_overlayset.tpl', $browserTitle, $displayOptions );
