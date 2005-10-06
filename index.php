<?php
/**
 * @version v .0 ?
 * @package bitMapki
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
 * wj: basically includes the basic parts to render the page
 * checks to see if a page has been asked for based on name or id, 
 * if not gets the defined home page for the whole website - I think this last part is right.
 */
 
require_once( '../bit_setup_inc.php' );
require_once( BITMAPKI_PKG_PATH.'BitMap.php' );


// @todo wj: need some conditions for setting the page request.
/*
	if( !empty( $_REQUEST['structure_id'] ) ) {
		include( LIBERTY_PKG_PATH.'display_structure_inc.php' );
	} else {
	
		global $siteTitle;
		if ( !isset( $_REQUEST['page'] ) and !isset( $_REQUEST['page_id'] ) ) {
			$_REQUEST['page'] = $wikiHomePage;
		}
		$gHome = new BitMap();		
		$wikiHome = $gBitSystem->getPreference("wikiHomePage", 'HomePage');
		if( !($gHome->pageExists( $wikiHome )) ) {
			$homeHash = array( 'title' => (isset( $wikiHome ) ? $wikiHome : 'HomePage'),
							   'creator_user_id' => ROOT_USER_ID,
							   'modifier_user_id' => ROOT_USER_ID,
							   'edit' => 'Welcome to '.(!empty( $siteTitle ) ? $siteTitle : 'our site') );
			$gHome->store( $homeHash );
		}

		include( BITMAPKI_PKG_URL.'lookup_page_inc.php' );
		include( BITMAPKI_PKG_URL.'display_bitpage_inc.php' );
	}
*/		

?>
