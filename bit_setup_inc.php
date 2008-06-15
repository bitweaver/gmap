<?php
global $gBitSystem, $gBitThemes;

$registerHash = array(
	'package_name' => 'gmap',
	'package_path' => dirname( __FILE__ ).'/',
	'service' => LIBERTY_SERVICE_MAPS,	
	'homeable' => TRUE,
);
$gBitSystem->registerPackage( $registerHash );

if( $gBitSystem->isPackageActive( 'gmap' ) ) {
	// load the css file
	$gBitThemes->loadCss( GMAP_PKG_PATH.'gmap.css' );

	require_once( GMAP_PKG_PATH.'BitGmap.php' );
	$menuHash = array(
		'package_name'  => GMAP_PKG_NAME,
		'index_url'     => GMAP_PKG_URL.'index.php',
		'menu_template' => 'bitpackage:gmap/menu_gmap.tpl',
	);
	$gBitSystem->registerAppMenu( $menuHash );

	$gLibertySystem->registerService( LIBERTY_SERVICE_MAPS, GMAP_PKG_NAME, array(
		'content_edit_function'  => 'gmap_content_edit',
		'content_preview_function'  => 'gmap_content_preview',
		'content_edit_mini_tpl'  => 'bitpackage:gmap/edit_gmap_mini_inc.tpl',
		'content_nav_tpl'        => 'bitpackage:gmap/view_gmap_nav.tpl',
		'content_body_tpl'       => 'bitpackage:gmap/view_gmap_body.tpl',
		'content_view_tpl'       => 'bitpackage:gmap/view_gmap_view.tpl',
		'content_icon_tpl'       => 'bitpackage:gmap/view_gmap_icon.tpl',
	) );
}

?>
