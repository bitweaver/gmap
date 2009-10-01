<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/lookup_polygon_inc.php,v 1.4 2009/10/01 13:45:39 wjames5 Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
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
require_once( GMAP_PKG_PATH.'BitGmapPolygon.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );

// if we already have a gContent, we assume someone else created it for us, and has properly loaded everything up.
if( empty( $gContent ) || !is_object( $gContent ) || !$gContent->isValid() ) {
	if (!empty($_REQUEST['polygon_id']) && is_numeric($_REQUEST['polygon_id'])) {
		// if sample_id supplied, use that
		$gContent = new BitGmapPolygon( $_REQUEST['polygon_id'] );
	} elseif (!empty($_REQUEST['content_id']) && is_numeric($_REQUEST['content_id'])) {
		// if content_id supplied, use that
		$gContent = new BitGmapPolygon( NULL, $_REQUEST['content_id'] );
	} else {
		// otherwise create new object
		$gContent = new BitGmapPolygon();
	}
	$gContent->load();

	$gBitSmarty->assign_by_ref( "gContent", $gContent );
}
?>