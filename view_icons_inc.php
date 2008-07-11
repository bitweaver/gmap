<?php
require_once( '../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage( 'gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission( 'p_gmap_view' );

$gContent = new BitGmap();
// this is how you store and update all icons found in the icons path
//$gContent->storeIcons( GMAP_PKG_PATH."icons" );
$_REQUEST['max_records'] = $gBitSystem->getConfig( 'max_records' ) * 5;
$gBitSmarty->assign( 'icons', $gContent->getIconList( $_REQUEST ));
$gBitSmarty->assign( 'themes', $gContent->getIconThemes() );
$gBitSmarty->assign( 'listInfo', $_REQUEST['listInfo'] );

$gBitSmarty->display( 'bitpackage:gmap/view_icons_inc.tpl', tra( 'Map' ));
?>
