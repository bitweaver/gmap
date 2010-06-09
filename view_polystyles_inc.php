<?php
/**
 * @version $Header$
 *
 * Copyright (c) 2008 bitweaver.org
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

require_once( GMAP_PKG_PATH.'lookup_gmap_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage( 'gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission( 'p_gmap_view' );

//if a style id is passed try to look it up
if( @BitBase::verifyId( $_REQUEST['polylinestyle_id'] )) {

	$getStyleFunc = 'getPolylineStyle';
	$styleId = $_REQUEST['polylinestyle_id'];
	$tpl = 'bitpackage:gmap/edit_polylinestyle_xml.tpl';
	$styleHashName = 'polylinestyleInfo';
	
}elseif( @BitBase::verifyId( $_REQUEST['polygonstyle_id'] )) {

	$getStyleFunc = 'getPolygonStyle';
	$styleId = $_REQUEST['polygonstyle_id'];
	$tpl = 'bitpackage:gmap/edit_polygonstyle_xml.tpl';
	$styleHashName = 'polygonstyleInfo';
	
}elseif( !empty( $_REQUEST['polystyle_type'] ) ){
	
	if( $_REQUEST['polystyle_type'] == 'polyline' ){
		$getStyleListFunc = 'getPolylineStyles';
	}else{
		$getStyleListFunc = 'getPolygonStyles';
	}

}

// get one
if( @BitBase::verifyId( $_REQUEST['polylinestyle_id'] ) || @BitBase::verifyId( $_REQUEST['polygonstyle_id'] ) ){
	$XMLContent = "";
	$statusCode = 401;

	if( $result = $gContent->$getStyleFunc( $styleId )) {
		$statusCode = 200;
		$gBitSmarty->assign_by_ref( $styleHashName, $result );
	}else{
		$XMLContent = "Requested Style Not Found";
	}

	$gBitSmarty->assign( 'statusCode', $statusCode);
	$gBitSmarty->assign( 'XMLContent', $XMLContent);

	$gBitSystem->display($tpl, null, array( 'format' => 'xml', 'display_mode' => 'display' ));
	
// get a list
} else {
	$_REQUEST['max_records'] = $gBitSystem->getConfig( 'max_records' );
	$styles = $gContent->$getStyleListFunc( $_REQUEST );
	$gBitSmarty->assign( 'styles', $styles );

	$gBitSmarty->assign( 'listInfo', $_REQUEST['listInfo'] );

	$gBitSmarty->assign( 'polystyle_type', $_REQUEST['polystyle_type'] );

	$gBitSmarty->assign( 'polytype', $_REQUEST['polytype'] );

	$gBitSmarty->display( 'bitpackage:gmap/view_polystyles_inc.tpl', tra( 'Map' ) );
}
?>
