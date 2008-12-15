<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/view_overlay.php,v 1.3 2008/12/15 20:31:36 wjames5 Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
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

if( !empty( $_REQUEST['overlay_type'] ) ){
	$type = $_REQUEST['overlay_type'];
}

// Now check permissions to access this page
$gBitSystem->verifyPermission('p_gmap_overlay_view' );

// Get the overlay for specified overylay_id
require_once(GMAP_PKG_PATH.'lookup_'.$type.'_inc.php' );

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
	$comments_return_url = $_SERVER['PHP_SELF']."view_overlay.php?".$type."_id=".$gContent->mOverlayId;
	include_once( LIBERTY_PKG_PATH.'comments_inc.php' );
}	

$gBitSmarty->assign_by_ref('overlay', $gContent->mInfo);

$displayOptions = array( 'display_mode' => 'display' );
$browserTitle = $gContent->getTitle();
if ( $gBitThemes->isAjaxRequest() ){
	$displayOptions['format'] = 'center_only';
}else{
	// assign the overlay to smarty so it gets included in our js data hash
	$overlaysInfo = array( $gContent->mInfo );
	$gBitSmarty->assign_by_ref( $type.'sInfo', $overlaysInfo );

	// @TODO get a list of maps the overlay is attached to.
	$gBitSmarty->assign('view_map', TRUE);
	$gBitSystem->mOnload[] = "BitMap.Display('".$type."');";
	// this hackage is because we are repruposing some much of the basic map display javascript
	$gContent->mInfo['width'] = $gBitSystem->getConfig('gmap_inline_map_width',190);
	$gContent->mInfo['height'] = $gBitSystem->getConfig('gmap_inline_map_height',190);
	$gContent->mInfo['overview_control'] = 'false';
	$gBitSmarty->assign_by_ref( 'mapInfo', $gContent->mInfo);
	$gBitThemes->loadAjax( 'mochikit', array( 'Iter.js', 'DOM.js', 'Style.js' ) );
}

$gBitSystem->display('bitpackage:gmap/view_overlay.tpl', $browserTitle, $displayOptions );
?>
