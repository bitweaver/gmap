<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/gmap_history.php,v 1.5 2009/10/01 14:17:00 wjames5 Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See below for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 *
 * @package gmap
 * @subpackage functions
 */

/**
 * required setup
 */
require_once( '../bit_setup_inc.php' );
require_once( GMAP_PKG_PATH.'BitGmap.php' );

$gBitSystem->verifyPackage( 'gmap' );
$gBitSystem->verifyPermission( 'p_gmap_view', tra( "Permission denied you cannot browse this map's history" ) );
$gBitSystem->verifyPermission( 'p_gmap_view_history', tra( "Permission denied you cannot browse this map's history" ) );

if( !isset( $_REQUEST["gmap_id"] ) ) {
	$gBitSmarty->assign( 'msg', tra( "No map indicated" ) );
	$gBitSystem->display( "error.tpl" , NULL, array( 'display_mode' => 'display' ));
	die;
}

include_once( GMAP_PKG_PATH.'lookup_gmap_inc.php' );

if( !$gContent->isValid() || empty( $gContent->mInfo ) ) {
	$gBitSystem->fatalError( tra( "Unknown map" ));
}

$smartyContentRef = 'content';

include_once( LIBERTY_PKG_PATH.'content_history_inc.php' );

// pagination stuff
$gBitSmarty->assign( 'page', $page = !empty( $_REQUEST['list_page'] ) ? $_REQUEST['list_page'] : 1 );
$offset = ( $page - 1 ) * $gBitSystem->getConfig( 'max_records' );
$history = $gContent->getHistory( NULL, NULL, $offset, $gBitSystem->getConfig( 'max_records' ) );
$gBitSmarty->assign_by_ref( 'data', $history['data'] );
$gBitSmarty->assign_by_ref( 'listInfo', $history['listInfo'] );

// calculate page number
$numPages = ceil( $gContent->getHistoryCount() / $gBitSystem->getConfig('max_records', 20) );
$gBitSmarty->assign( 'numPages', $numPages );

// Display the template
$gBitSmarty->assign_by_ref( 'gContent', $gContent );
$gBitSystem->display( 'bitpackage:gmap/gmap_history.tpl', NULL, array( 'display_mode' => 'display' ));
?>
