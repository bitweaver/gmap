<?php
/**
 * @version v .0 ?
 * @package gmap
 *
 * @author Will <will@wjamesphoto.com>
 *
 *
 * Copyright (c) 2005 bitweaver.org
 * Copyright (c) 2004 bitweaver.org
 * Copyright (c) 2003 tikwiki.org
 * Copyright (c) 2002-2003, Luis Argerich, Garland Foster, Eduardo Polidor, et. al.
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 *
 */

/**
 * required setup
 */

/**
 * wj: Most of this page is based on the Sample Package
 */

// Initialization
require_once( '../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('p_gmap_view' );

//if there is no API key don't even bother
if ($gBitSystem->isFeatureActive('gmap_api_key')){
	if (!isset($_REQUEST['gmap_id'] ) ) {
	//@toodo how to set up this preference?
	//    $_REQUEST['gmap_id'] = $gBitSystem->getPreference("home_gmap");
	
		require_once( GMAP_PKG_PATH.'BitGmap.php');
		
		$gmap = new BitGmap();
		$listgmaps = $gmap->getList( $_REQUEST );
		
		$gBitSmarty->assign_by_ref('control', $_REQUEST["control"]);
		$gBitSmarty->assign_by_ref('list', $listgmaps["data"]);
		
		// Display the template
		$gBitSystem->display('bitpackage:gmap/list_gmaps.tpl', tra('Gmap') );
	}else{
	
		require_once(GMAP_PKG_PATH.'lookup_gmap_inc.php' );
	
		$gBitSmarty->assign( 'loadGoogleMapsAPI', TRUE );
		
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
