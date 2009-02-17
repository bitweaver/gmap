<?php
$tables = array(
//@todo should allow_comments be here, or will this be covered by Liberty?
//maptype is keyed to custom maptype_id. 0, 1, and 2 are reserved for Google's Street, Satellite, and Hybrid types
//show_controls in gmaps takes s,l,z,n  small, large, zoom + -, or none
'gmaps' => "
  gmap_id I4 PRIMARY,
  content_id I4 NOTNULL,
  width I4 DEFAULT 0,
  height I4 DEFAULT 0,
  zoom I4 DEFAULT 16,
  maptype I4 DEFAULT 0,
  zoom_control C(1) DEFAULT 's',
  maptype_control C(5) DEFAULT 'true',
  overview_control C(5) DEFAULT 'true',
  scale C(5) DEFAULT 'true'
  CONSTRAINT ', CONSTRAINT `gmaps_ref` FOREIGN KEY (`content_id`) REFERENCES `".BIT_DB_PREFIX."liberty_content`( `content_id` )'
",

/*
 * set_type in gmaps_sets_keychain can be: 
 * markers, polylines, polygons, maptype
 */
'gmaps_sets_keychain' => "
  gmap_id I4 NOTNULL,
  set_type c(32) NOTNULL,
  set_id I4 NOTNULL,
  plot_on_load C(5) DEFAULT 'true',
  side_panel C(5) DEFAULT 'true',
  explode C(5) DEFAULT 'true',
  pos F
  CONSTRAINTS ', CONSTRAINT `gmaps_sets_keychain_gmap_ref` FOREIGN KEY (`gmap_id`) REFERENCES `".BIT_DB_PREFIX."gmaps`( `gmap_id` )'
",

/* maptypes and related data
 * values 0, -1, and -2 are reserved and reference google maps and are not stored.
 * as google adds more maptype options additional negative numbers will be added
 * sequence for this table starts at 1
 */
'gmaps_maptypes' => "
  maptype_id I4 PRIMARY,
  name C(64),
  shortname C(4),
  description X,
  minzoom I4,
  maxzoom I4,
  errormsg C(255),
  user_id I4  
  CONSTRAINTS ', CONSTRAINT `gmaps_maptypes_ref` FOREIGN KEY (`user_id`) REFERENCES `".BIT_DB_PREFIX."users_users`( `user_id` )'
",

'gmaps_tilelayers' => "
  tilelayer_id I4 PRIMARY,
  tiles_name C(64),
  tiles_minzoom I4,
  tiles_maxzoom I4,
  ispng C(5) DEFAULT 'false',
  tilesurl X,
  opacity F
",

'gmaps_copyrights' => "
  copyright_id I4 PRIMARY,
  copyright_minzoom I4,
  bounds X,
  notice C(64)
",

'gmaps_tilelayers_keychain' => "
  maptype_id I4 NOTNULL,
  tilelayer_id I4 NOTNULL,
  pos F
  CONSTRAINT ', CONSTRAINT `gmaps_tilelayers_k_maptype_ref` FOREIGN KEY (`maptype_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_maptypes`( `maptype_id` )
              , CONSTRAINT `gmaps_tilelayers_k_tlayers_ref` FOREIGN KEY (`tilelayer_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_tilelayers`( `tilelayer_id` )'
",

'gmaps_copyrights_keychain' => "
  copyright_id I4 NOTNULL,
  tilelayer_id I4 NOTNULL
  CONSTRAINT ', CONSTRAINT `gmaps_copyrts_k_copyright_ref` FOREIGN KEY (`copyright_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_copyrights`( `copyright_id` )
              , CONSTRAINT `gmaps_copyrts__tilelayers_ref` FOREIGN KEY (`tilelayer_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_tilelayers`( `tilelayer_id` )'
",


'gmaps_markers' => "
  marker_id I8 PRIMARY,
  content_id I4 NOTNULL,
  label_data X,
  zindex I8 DEFAULT 0
  CONSTRAINT ', CONSTRAINT `gmaps_markers_ref` FOREIGN KEY (`content_id`) REFERENCES `".BIT_DB_PREFIX."liberty_content`( `content_id` )'
",

'gmaps_icon_themes' => "
  theme_id I4 PRIMARY,
  theme_title C(64)
",

//types has one options: 0 => GIcon
'gmaps_icon_styles' => "
  icon_id I4 PRIMARY,
  theme_id I4 NOTNULL,
  name C(64),
  icon_style_type I2 DEFAULT 0,
  image X '/gmap/icons/FlatColorPins/205.png',
  rollover_image X '/gmap/icons/FlatColorPins/090.png',
  icon_w I4 DEFAULT 20,
  icon_h I4 DEFAULT 34,
  shadow_image X DEFAULT 'http://www.google.com/mapfiles/shadow50.png',
  shadow_w I4 DEFAULT 37,
  shadow_h I4 DEFAULT 34,
  icon_anchor_x I4 DEFAULT 9,
  icon_anchor_y I4 DEFAULT 34,
  shadow_anchor_x I4 DEFAULT 18,
  shadow_anchor_y I4 DEFAULT 25,
  infowindow_anchor_x I4 DEFAULT 9,
  infowindow_anchor_y I4 DEFAULT 2,
  image_map X DEFAULT 0,
  user_id I4
  CONSTRAINTS ', CONSTRAINT `gmaps_icon_styles_ref` FOREIGN KEY (`user_id`) REFERENCES `".BIT_DB_PREFIX."users_users`( `user_id` )
               , CONSTRAINT `gmaps_icon_theme_ref` FOREIGN KEY (`theme_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_icon_themes`( `theme_id` )'
  '
",

//type options: 0 => GXMarker, 1 => PdMarker
//lable hover opacity is for all
//label opacity is PdMarker Class only
//label hover styles is CSS for all
//window styles is CSS for PdMarker Class
'gmaps_marker_styles' => "
  style_id I4 PRIMARY,
  name C(64),
  marker_style_type I2 DEFAULT 0,
  label_hover_opacity I4 DEFAULT 70,
  label_opacity I4 DEFAULT 100,
  label_hover_styles C(255) DEFAULT 'border:none; color:black; background-color:#ccc',
  window_styles C(255) DEFAULT 'border:none; color:black; background-color:white',
  user_id I4  
  CONSTRAINTS ', CONSTRAINT `gmaps_marker_styles_ref` FOREIGN KEY (`user_id`) REFERENCES `".BIT_DB_PREFIX."users_users`( `user_id` )'
",

'gmaps_marker_sets' => "
  set_id I4 PRIMARY,
  content_id I4 NOTNULL,
  style_id I4 NOTNULL,
  icon_id I4 NOTNULL
  CONSTRAINT ', CONSTRAINT `gmaps_marker_sets_ref` FOREIGN KEY (`content_id`) REFERENCES `".BIT_DB_PREFIX."liberty_content`( `content_id` )'
",
/* @TODO devine defaults for these related tables. we dont store defaut values right now and so this breaks postgress  
  			  , CONSTRAINT `gmaps_marker_sets_style_ref` FOREIGN KEY (`style_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_marker_styles`( `style_id` )
              , CONSTRAINT `gmaps_marker_sets_icon_ref` FOREIGN KEY (`icon_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_icon_styles`( `icon_id` )'
*/

'gmaps_marker_keychain' => "
  set_id I4 NOTNULL,
  marker_id I8 NOTNULL,
  pos F
  CONSTRAINT ', CONSTRAINT `gmaps_marker_keychain_set_ref` FOREIGN KEY (`set_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_marker_sets`( `set_id` )
              , CONSTRAINT `gmaps_marker_key_marker_ref` FOREIGN KEY (`marker_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_markers`( `marker_id` )'
",

//type options: 0 => Default  1 => Geodesic  2 => Encoded
'gmaps_polylines' => "
  polyline_id I4 PRIMARY,
  content_id I4 NOTNULL,
  poly_data X,
  type I4 DEFAULT 0,
  levels_data X,
  zoom_factor I4,
  num_levels I4
  CONSTRAINT ', CONSTRAINT `gmaps_polylines_ref` FOREIGN KEY (`content_id`) REFERENCES `".BIT_DB_PREFIX."liberty_content`( `content_id` )'
",

//opacity takes a float from 0-1
//some columns here are not used at this time
'gmaps_polyline_styles' => "
  style_id I4 PRIMARY,
  name C(64),
  color C(6) DEFAULT 'ff3300',
  weight I4 DEFAULT 2,
  opacity F DEFAULT 1,
  user_id I4  
  CONSTRAINTS ', CONSTRAINT `gmaps_polyline_styles_ref` FOREIGN KEY (`user_id`) REFERENCES `".BIT_DB_PREFIX."users_users`( `user_id` )'
",

'gmaps_polyline_sets' => "
  set_id I4 PRIMARY,
  content_id I4 NOTNULL,
  style_id I4 NOTNULL
  CONSTRAINT ', CONSTRAINT `gmaps_polyline_sets_ref` FOREIGN KEY (`content_id`) REFERENCES `".BIT_DB_PREFIX."liberty_content`( `content_id` )'
",
/* @TODO devine defaults for these related tables. we dont store defaut values right now and so this breaks postgress  
			  , CONSTRAINT `gmaps_polyline_sets_style_ref` FOREIGN KEY (`style_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_polyline_styles`( `style_id` )'
 */

'gmaps_polyline_keychain' => "
  set_id I4 NOTNULL,
  polyline_id I4 NOTNULL,
  pos F
  CONSTRAINT ', CONSTRAINT `gmaps_polyline_k_set_ref` FOREIGN KEY (`set_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_polyline_sets`( `set_id` )
              , CONSTRAINT `gmaps_polyline_k_polyline_ref` FOREIGN KEY (`polyline_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_polylines`( `polyline_id` )'
",

//type options: 0 => Polygon, 1 => Circle 2=> Encoded
//points_data takes an array for polygon
//circle_center for circle
//radius for circle
//@todo wj:check radius after up and running - might require an XDistance (for circle)
'gmaps_polygons' => "
  polygon_id I4 PRIMARY,
  content_id I4 NOTNULL,
  poly_data X,
  type I4 DEFAULT 0,
  circle_center X DEFAULT 0,
  radius F DEFAULT 0,
  levels_data X,
  zoom_factor I4,
  num_levels I4
  CONSTRAINT ', CONSTRAINT `gmaps_polygons_ref` FOREIGN KEY (`content_id`) REFERENCES `".BIT_DB_PREFIX."liberty_content`( `content_id` )'
",

//opacity take a float from 0-1
'gmaps_polygon_styles' => "
  style_id I4 PRIMARY,
  name C(64),
  color C(6),
  opacity F DEFAULT 1,
  user_id I4  
  CONSTRAINTS ', CONSTRAINT `gmaps_polygon_styles_ref` FOREIGN KEY (`user_id`) REFERENCES `".BIT_DB_PREFIX."users_users`( `user_id` )'
",

'gmaps_polygon_sets' => "
  set_id I4 PRIMARY,
  content_id I4 NOTNULL,
  style_id I4 NOTNULL,
  polylinestyle_id I4 NOTNULL
  CONSTRAINT ', CONSTRAINT `gmaps_polygon_sets_ref` FOREIGN KEY (`content_id`) REFERENCES `".BIT_DB_PREFIX."liberty_content`( `content_id` )'
",
/* @TODO devine defaults for these related tables. we dont store defaut values right now and so this breaks postgress  
			  , CONSTRAINT `gmaps_polygon_sets_style_ref` FOREIGN KEY (`style_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_polygon_styles`( `style_id` )
              , CONSTRAINT `gmaps_polygon_sets_pstyle_ref` FOREIGN KEY (`style_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_polyline_styles`( `style_id` )'
 */

'gmaps_polygon_keychain' => "
  set_id I4 NOTNULL,
  polygon_id I4 NOTNULL,
  pos F
  CONSTRAINT ', CONSTRAINT `gmaps_polygon_k_set_ref` FOREIGN KEY (`set_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_polygon_sets`( `set_id` )
              , CONSTRAINT `gmaps_polygon_k_polygon_ref` FOREIGN KEY (`polygon_id`) REFERENCES `".BIT_DB_PREFIX."gmaps_polygons`( `polygon_id` )'
",
);


global $gBitInstaller;

foreach( array_keys( $tables ) AS $tableName ) {
	$gBitInstaller->registerSchemaTable( GMAP_PKG_NAME, $tableName, $tables[$tableName] );
}

$gBitInstaller->registerPackageInfo( GMAP_PKG_NAME, array(
	'description' => "For creating wiki-like Google Maps as well as viewing other bitweaver content (with location information) on Google Maps.",
	'license' => '<a href="http://www.gnu.org/licenses/licenses.html#LGPL">LGPL</a>',
));

// Package Requirements
$gBitInstaller->registerRequirements( GMAP_PKG_NAME, array(
	'geo' => array( 'min' => '0.0.0' ),
));

// package version
$gBitInstaller->registerPackageVersion( GMAP_PKG_NAME, '0.2.0-beta' );

$indices = array (
	'gmaps_gmap_id_idx' => array( 'table' => 'gmaps', 'cols' => 'gmap_id', 'opts' => 'UNIQUE' ),
);
$gBitInstaller->registerSchemaIndexes( GMAP_PKG_NAME, $indices );


// ### Sequences
$sequences = array (
	'gmaps_gmap_id_seq'					=> array( 'start' => 1 ),
	'gmaps_icon_themes_seq'				=> array( 'start' => 1 ),
	'gmaps_maptypes_maptype_id_seq'		=> array( 'start' => 1 ),
	'gmaps_tilelayer_id_seq'			=> array( 'start' => 1 ),
	'gmaps_copyright_id_seq'			=> array( 'start' => 1 ),
	'gmaps_markers_marker_id_seq'		=> array( 'start' => 1 ),
	'gmaps_icon_styles_icon_id_seq'		=> array( 'start' => 1 ),
	'gmaps_marker_style_id_seq'			=> array( 'start' => 1 ),
	'gmaps_marker_sets_set_id_seq'		=> array( 'start' => 1 ),
	'gmaps_polylines_polyline_id_seq'	=> array( 'start' => 1 ),
	'gmaps_polyline_style_id_seq'		=> array( 'start' => 1 ),
	'gmaps_polyline_sets_set_id_seq'	=> array( 'start' => 1 ),
	'gmaps_polygons_polygon_id_seq'		=> array( 'start' => 1 ),
	'gmaps_polygon_style_id_seq'		=> array( 'start' => 1 ),
	'gmaps_polygon_sets_set_id_seq'		=> array( 'start' => 1 ),
);
$gBitInstaller->registerSchemaSequences( GMAP_PKG_NAME, $sequences );


//$gBitInstaller->registerSchemaDefault( GMAP_PKG_NAME, array() );



//This does not work as one might expect
/*
$moduleHash = array(
	'mod_package_menu' => array(
		'title' => NULL,
		'layout' => 'gmap',
		'module_id' => 4,
		'ord' => 1,
		'pos' => 'r',
		'module_rsrc' => 'bitpackage:kernel/mod_package_menu.tpl'
	)
);

$gBitInstaller->registerModules( $moduleHash );
*/



//
$gBitInstaller->registerUserPermissions( GMAP_PKG_NAME, array(
	array('p_gmap_view', 'Can view maps', 'basic', GMAP_PKG_NAME),
	array('p_gmap_view_history', 'Can view map history', 'basic', GMAP_PKG_NAME),
	array('p_gmap_create', 'Can create maps', 'registered', GMAP_PKG_NAME),
	array('p_gmap_update', 'Can edit maps', 'editor', GMAP_PKG_NAME),
	array('p_gmap_remove', 'Can remove maps', 'editors', GMAP_PKG_NAME),
	array('p_gmap_rollback', 'Can rollback version of a map', 'editors', GMAP_PKG_NAME),
	array('p_gmap_admin', 'Can administrate maps', 'editors', GMAP_PKG_NAME),
	array('p_gmap_attach_children', 'Can attach sets and such to maps, and overlays to sets', 'register', GMAP_PKG_NAME),
	array('p_gmap_overlay_view', 'Can view map overlays', 'basic', GMAP_PKG_NAME),
	array('p_gmap_overlay_view_history', 'Can view map overlay history', 'basic', GMAP_PKG_NAME),
	array('p_gmap_overlay_create', 'Can create overlays', 'registered', GMAP_PKG_NAME),
	array('p_gmap_overlay_update', 'Can edit overlays', 'editor', GMAP_PKG_NAME),
	array('p_gmap_overlay_remove', 'Can remove map overlays', 'editors', GMAP_PKG_NAME),
	array('p_gmap_overlay_rollback', 'Can rollback version of a overlay', 'editors', GMAP_PKG_NAME),
	array('p_gmap_overlayset_view', 'Can view map overlay sets', 'basic', GMAP_PKG_NAME),
	array('p_gmap_overlayset_view_history', 'Can view map overlay sets history', 'basic', GMAP_PKG_NAME),
	array('p_gmap_overlayset_create', 'Can create overlay sets', 'registered', GMAP_PKG_NAME),
	array('p_gmap_overlayset_update', 'Can edit overlay sets', 'editor', GMAP_PKG_NAME),
	array('p_gmap_overlayset_remove', 'Can remove map overlay sets', 'editors', GMAP_PKG_NAME),
	array('p_gmap_overlayset_rollback', 'Can rollback version of a overlay set', 'editors', GMAP_PKG_NAME),
) );


$gBitInstaller->registerPreferences( GMAP_PKG_NAME, array(
//	array( GMAP_PKG_NAME, 'gmap_api_key', 'you must get a key from google'),
//	array( GMAP_PKG_NAME, 'gmap_width', 0),
//	array( GMAP_PKG_NAME, 'gmap_height', 0),
//	array( GMAP_PKG_NAME, 'gmap_lat', 0),
//	array( GMAP_PKG_NAME, 'gmap_lng', 0),
//	array( GMAP_PKG_NAME, 'gmap_zoom', 3),
	array( GMAP_PKG_NAME, 'gmap_scale', 'false'),
	array( GMAP_PKG_NAME, 'gmap_maptype_control', 'true'),
	array( GMAP_PKG_NAME, 'gmap_zoom_control', 's'),
	array( GMAP_PKG_NAME, 'gmap_overview_control', 'true'),
	array( GMAP_PKG_NAME, 'gmap_map_type', 0),
	)
);

// ### Register content types
$gBitInstaller->registerContentObjects( GMAP_PKG_NAME, array( 
	'BitGmap'            => GMAP_PKG_PATH.'BitGmap.php',
	'BitGmapMarker'      => GMAP_PKG_PATH.'BitGmapMarker.php',
	'BitGmapMarkerSet'   => GMAP_PKG_PATH.'BitGmapMarkerSet.php',
	'BitGmapPolygon'     => GMAP_PKG_PATH.'BitGmapPolygon.php',
	'BitGmapPolygonSet'  => GMAP_PKG_PATH.'BitGmapPolygonSet.php',
	'BitGmapPolyline'    => GMAP_PKG_PATH.'BitGmapPolyline.php',
	'BitGmapPolylineSet' => GMAP_PKG_PATH.'BitGmapPolylineSet.php',
));
?>
