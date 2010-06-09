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
require_once( '../kernel/setup_inc.php' );
/*
require_once( LIBERTY_PKG_PATH.'bit_setup_inc.php' );
*/

require_once( LIBERTY_PKG_PATH.'LibertyContent.php' );
global $gLibertySystem;

if ($gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap')){
	//if there is no API key don't even bother
	//we would include this in the first check but we want a particular error page if only the API key is missing
	if ($gBitSystem->isFeatureActive('gmap_api_key')){	
		// if we have a content_id, we load and display it with the search form - otherwise we just display the search form
		if( @BitBase::verifyId( $_REQUEST['content_id'] )) {
			include_once( GMAP_PKG_PATH.'map_content_obj_inc.php' );
		} 

		// get any list request and display a search form
		include_once( GMAP_PKG_PATH.'map_content_list_inc.php' );
	}else{
		$gBitSystem->display('bitpackage:gmap/error_nokey.tpl', tra('Map') , array( 'display_mode' => 'display' ));
	}
}
?>
