<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/view_marker.php,v 1.13 2008/07/11 19:39:22 wjames5 Exp $
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

// Now check permissions to access this page
$gBitSystem->verifyPermission('p_gmap_overlay_view' );

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_marker_inc.php' );

$displayHash = array( 'perm_name' => 'p_gmap_overlay_view' );
$gContent->invokeServices( 'content_display_function', $displayHash );

//use Mochikit - prototype sucks
$gBitThemes->loadAjax( 'mochikit', array( 'Iter.js', 'DOM.js' ) );

if ( !empty($_REQUEST['pre_window']) ){
	$gBitSmarty->assign('pre_window', TRUE);
}

if( $gContent->isCommentable() ) {
	$gBitSystem->setConfig( 'comments_ajax', 'y' );
	$gBitThemes->loadAjax( 'mochikit', array( 'Style.js', 'Color.js', 'Position.js', 'Visual.js' ) );	
	$gBitSmarty->assign('comments_ajax', TRUE);
	$commentsParentId = $gContent->mContentId;
	$gBitSmarty->assign('commentsParentId', $commentsParentId);
	$comments_vars = Array('gmap');
	$comments_prefix_var='gmap:';
	$comments_object_var='gmap';
	$comments_return_url = $_SERVER['PHP_SELF']."view_marker.php?marker_id=".$gContent->mOverlayId;
	include_once( LIBERTY_PKG_PATH.'comments_inc.php' );
}	

$gBitSmarty->assign_by_ref('marker', $gContent->mInfo);

$displayOptions = array( 'display_mode' => 'display' );
$browserTitle = $gContent->getTitle();
if ( $gBitThemes->isAjaxRequest() ){
	$displayOptions['format'] = 'center_only';
}else{
	// @TODO get a list of maps the marker is attached to.
	// @TODO clean this up
	// This is some seriously ugly business here but it works for now
	// EditContent gets us a pin on the map - that could be a more generic function name
	$gBitSmarty->assign('view_map', TRUE);
	$gBitSystem->mOnload[] = 'BitMap.EditContent();';
	// this hackage is because we are repruposing some much of the basic map display javascript
	$gContent->mInfo['width'] = $gBitSystem->getConfig('gmap_inline_map_width',190);
	$gContent->mInfo['height'] = $gBitSystem->getConfig('gmap_inline_map_height',190);
	$gContent->mInfo['overview_control'] = 'false';
	$gBitSmarty->assign_by_ref( 'mapInfo', $gContent->mInfo);
	$gBitThemes->loadAjax( 'mochikit', array( 'Iter.js', 'DOM.js', 'Style.js' ) );
}

$gBitSystem->display('bitpackage:gmap/view_marker.tpl', $browserTitle, $displayOptions );
?>
