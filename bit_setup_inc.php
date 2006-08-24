<?php
global $gBitSystem;

$registerHash = array(
	'package_name' => 'gmap',
	'package_path' => dirname( __FILE__ ).'/',
	'service' => LIBERTY_SERVICE_MAPS,	
);
$gBitSystem->registerPackage( $registerHash );

if( $gBitSystem->isPackageActive( 'gmap' ) ) {
	require_once( GMAP_PKG_PATH.'BitGmap.php' );

	$gBitSystem->registerAppMenu( GMAP_PKG_NAME, ucfirst( GMAP_PKG_DIR ), GMAP_PKG_URL.'index.php', 'bitpackage:gmap/menu_gmap.tpl', GMAP_PKG_NAME );

	$gLibertySystem->registerService( LIBERTY_SERVICE_MAPS, GMAP_PKG_NAME, array(
		'content_edit_function'  => 'gmap_content_edit',
		'content_edit_mini_tpl' => 'bitpackage:gmap/edit_gmap_mini_inc.tpl',
	) );
}

?>