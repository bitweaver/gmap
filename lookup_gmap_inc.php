<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/lookup_gmap_inc.php,v 1.11 2009/10/01 14:17:00 wjames5 Exp $
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
global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );

// this is needed when the center module is applied to avoid abusing $_REQUEST
if( empty( $lookupHash )) {
	$lookupHash = &$_REQUEST;
}

// if we already have a gContent, we assume someone else created it for us, and has properly loaded everything up.
if( empty( $gContent ) || !is_object( $gContent ) || !$gContent->isValid() ) {
	// if someone gives us a map_name we try to find it
	if( !empty( $lookupHash['map_name'] ) ){
		global $gBitDb;
		$lookupHash['gmap_id'] = $gBitDb->getOne( "SELECT gmap_id FROM `".BIT_DB_PREFIX."gmaps` g LEFT JOIN `".BIT_DB_PREFIX."liberty_content` lc ON (g.`content_id` = lc.`content_id`) WHERE lc.`title` = ?", array($lookupHash['map_name']) );
		if( empty( $lookupHash['gmap_id'] ) ) {
		  $gBitSystem->fatalError(tra('No map found with the name: ').$lookupHash['map_name']);
		}
	}

	if (!empty($lookupHash['gmap_id']) && is_numeric($lookupHash['gmap_id'])) {		
		// if gmap_id supplied, use that
		$gContent = new BitGmap( $lookupHash['gmap_id'] );
	} elseif (!empty($lookupHash['content_id']) && is_numeric($lookupHash['content_id'])) {
		// if content_id supplied, use that
		$gContent = new BitGmap( NULL, $lookupHash['content_id'] );
	} else {
		// otherwise create new object
		$gContent = new BitGmap();
	}
	$gContent->load();

	$gBitSmarty->assign_by_ref( "gContent", $gContent );
}
?>
