<?php
/**
 * @version  $Header: /cvsroot/bitweaver/_bit_gmap/index.php,v 1.29 2008/06/19 04:21:17 lsces Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 */

/**
 * required setup
 */
 
// force js on the user
$_COOKIE['javascript_enabled'] = 'y';

// Initialization
require_once( '../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('p_gmap_view' );

//if there is no API key don't even bother
if ($gBitSystem->isFeatureActive('gmap_api_key')){
	if (!isset($_REQUEST['gmap_id'] ) ) {
		// @todo how to set up this preference?
		// $_REQUEST['gmap_id'] = $gBitSystem->getPreference("home_gmap");
		require_once( GMAP_PKG_PATH.'list_gmaps.php');
		die;
	}else{
	
		require_once(GMAP_PKG_PATH.'lookup_gmap_inc.php' );
		
		$displayHash = array( 'perm_name' => 'p_gmap_view' );
		$gContent->invokeServices( 'content_display_function', $displayHash );
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
		$gBitSmarty->assign('view_map', TRUE);
		$gBitSystem->mOnload[] = 'BitMap.Display();';
	
		//use Mochikit - prototype sucks
		$gBitThemes->loadAjax( 'mochikit', array( 'Iter.js', 'DOM.js', 'Style.js' ) );
	
		if( $gContent->isCommentable() ) {
			$gBitSystem->setConfig( 'comments_ajax', 'y' );
			$gBitThemes->loadAjax( 'mochikit', array( 'Color.js', 'Position.js', 'Visual.js' ) );	
			$gBitSmarty->assign('comments_ajax', TRUE);
			$commentsParentId = $gContent->mContentId;
			$gBitSmarty->assign('commentsParentId', $commentsParentId);
			$comments_vars = Array('gmap');
			$comments_prefix_var='gmap:';
			$comments_object_var='gmap';
			$comments_return_url = $_SERVER['PHP_SELF']."?gmap_id=".$gContent->mGmapId;
			include_once( LIBERTY_PKG_PATH.'comments_inc.php' );
		}
	
		$gBitSystem->display('bitpackage:gmap/show_gmap.tpl', tra('Gmap') );
	}
}else{
	$gBitSystem->display('bitpackage:gmap/error_nokey.tpl', tra('Gmap') );
}
?>
