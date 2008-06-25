<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit.php,v 1.40 2008/06/25 22:21:10 spiderr Exp $
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

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_gmap_inc.php' );

if( $gContent->isValid() ) {
	$gContent->verifyEditPermission();
} else {
	$gBitSystem->verifyPermission( 'p_gmap_edit' );
}

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

	//force ajax attachments inclusion - we'll need it since we dont load up the js with the various forms
	$gBitThemes->loadJavascript( LIBERTY_PKG_PATH.'scripts/LibertyAttachment.js', TRUE );

	// Display the template
	$gBitSystem->display( 'bitpackage:gmap/edit_gmap.tpl', tra('Gmap') , array( 'display_mode' => 'edit' ));    		
}else{
	$gBitSystem->display('bitpackage:gmap/error_nokey.tpl', tra('Gmap') , array( 'display_mode' => 'edit' ));
}
?>
