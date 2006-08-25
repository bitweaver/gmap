<?php
$tables = array(
	'gmaps' => "",
);


global $gBitInstaller;

$gBitInstaller->makePackageHomeable( GMAP_PKG_NAME );


foreach( array_keys( $tables ) AS $tableName ) {
	$gBitInstaller->registerSchemaTable( GMAP_PKG_NAME, $tableName, $tables[$tableName] );
}


$gBitInstaller->registerPackageInfo( GMAP_PKG_NAME, array(
	'description' => "Gmap package provides gmap tpls.",
	'license' => '<a href="http://www.gnu.org/licenses/licenses.html#LGPL">LGPL</a>',
) );

$gBitInstaller->registerSchemaDefault( GMAP_PKG_NAME, array() );

$gBitInstaller->registerPreferences( GMAP_PKG_NAME, array(
	array( GMAP_PKG_NAME, 'gmap_api_key', 'you must get a key from google'),
	array( GMAP_PKG_NAME, 'gmap_width_users', '100%'),
	array( GMAP_PKG_NAME, 'gmap_height_users', '300px'),
	array( GMAP_PKG_NAME, 'gmap_lat_users', 40.0),
	array( GMAP_PKG_NAME, 'gmap_lng_users', -97.0),
	array( GMAP_PKG_NAME, 'gmap_zoom_users', 3),
	array( GMAP_PKG_NAME, 'gmap_scale_users', 'false'),
	array( GMAP_PKG_NAME, 'gmap_type_control_users', 'true'),
	array( GMAP_PKG_NAME, 'gmap_zoom_control_users', 's'),
	array( GMAP_PKG_NAME, 'gmap_map_type_users', 'Street'),	
	)
);

?>