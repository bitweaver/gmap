<?php
// Copyright (c) 2005-2007 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permission to edit or create a map
$gBitSystem->verifyPermission('p_gmap_edit' );

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_gmap_inc.php' );

//if there is no API key don't even bother
if ($gBitSystem->isFeatureActive('gmap_api_key')){	
	$gBitSmarty->assign( 'edit_map', TRUE );
	$gBitSmarty->assign_by_ref( 'mapInfo', $gContent->mInfo);
	if ( $gContent->isValid() ){
		$gBitSmarty->assign_by_ref( 'maptypesInfo', $gContent->mMapTypes );
		$gBitSmarty->assign_by_ref( 'tilelayersInfo', $gContent->mTilelayers );
		$gBitSmarty->assign_by_ref( 'copyrightsInfo', $gContent->mCopyrights );
		$gBitSmarty->assign_by_ref( 'markersInfo', $gContent->mMapMarkers );
		$gBitSmarty->assign_by_ref( 'markersetsInfo', $gContent->mMapMarkerSets );
		$gBitSmarty->assign_by_ref( 'markerstylesInfo', $gContent->mMapMarkerStyles );
		$gBitSmarty->assign_by_ref( 'iconstylesInfo', $gContent->mMapIconStyles );
		$gBitSmarty->assign_by_ref( 'polylinesInfo', $gContent->mMapPolylines );
		$gBitSmarty->assign_by_ref( 'polylinesetsInfo', $gContent->mMapPolylineSets );
		$gBitSmarty->assign_by_ref( 'polylinestylesInfo', $gContent->mMapPolylineStyles );
	}
	
	//set onload function in body
	$gBitSystem->mOnload[] = 'BitMap.EditMap();';
	
	//use Mochikit - prototype sucks
	$gBitThemes->loadAjax( 'mochikit', array( 'Base.js', 'Iter.js', 'Async.js', 'DOM.js', 'Style.js' ) );

	// Display the template
	$gBitSystem->display( 'bitpackage:gmap/edit_gmap.tpl', tra('Gmap') );    		
}else{
	$gBitSystem->display('bitpackage:gmap/error_nokey.tpl', tra('Gmap') );
}
?>
