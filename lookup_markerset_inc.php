<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/lookup_markerset_inc.php,v 1.3 2008/06/19 04:21:17 lsces Exp $
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
	global $gContent;
	require_once( GMAP_PKG_PATH.'BitGmapMarkerSet.php');
	require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );

	// if we already have a gContent, we assume someone else created it for us, and has properly loaded everything up.
	if( empty( $gContent ) || !is_object( $gContent ) || !$gContent->isValid() ) {
		if (!empty($_REQUEST['set_id']) && is_numeric($_REQUEST['set_id'])) {
			// if sample_id supplied, use that
			$gContent = new BitGmapMarkerSet( $_REQUEST['set_id'] );
		} elseif (!empty($_REQUEST['content_id']) && is_numeric($_REQUEST['content_id'])) {
			// if content_id supplied, use that
			$gContent = new BitGmapMarkerSet( NULL, $_REQUEST['content_id'] );
		} else {
			// otherwise create new object
			$gContent = new BitGmapMarkerSet();
		}
		if (empty($_REQUEST['gmap_id']) || !is_numeric($_REQUEST['gmap_id'])){
			$_REQUEST['gmap_id'] = NULL;
		}
		$gContent->load( $_REQUEST['gmap_id'] );

		$gBitSmarty->assign_by_ref( "gContent", $gContent );
	}
?>