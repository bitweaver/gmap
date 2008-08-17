<?php
require_once( '../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage( 'gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission( 'p_gmap_view' );

$gContent = new BitGmap();

//if a icon_id is passed try to look it up
if( @BitBase::verifyId( $_REQUEST['icon_id'] )) {
	if( $result = $gContent->getIconStyle( $_REQUEST['icon_id'] )) {
		$gBitSmarty->assign_by_ref( 'iconstyleInfo', $result );
	}

	$gBitSystem->display('bitpackage:gmap/edit_iconstyle_xml.tpl', null, array( 'format' => 'xml', 'display_mode' => 'display' ));
} else {
	// this is how you store and update all icons found in the icons path
	$_REQUEST['max_records'] = $gBitSystem->getConfig( 'max_records' ) * 5;
	$icons = $gContent->getIconList( $_REQUEST );
	if( empty( $icons ) || !empty( $_REQUEST['update_icon_list'] )) {
		$gContent->importIcons( GMAP_PKG_PATH."icons" );
		$icons = $gContent->getIconList( $_REQUEST );
	}
	$gBitSmarty->assign( 'icons', $icons );
	$gBitSmarty->assign( 'themes', $gContent->getIconThemes() );
	$gBitSmarty->assign( 'listInfo', $_REQUEST['listInfo'] );

	$gBitSmarty->display( 'bitpackage:gmap/view_icons_inc.tpl', tra( 'Map' ));
}
?>
