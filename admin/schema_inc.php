<?php

// @todo check all tables, consider the filed "version", verify if it is appropriate for the given table.

$tables = array(

//show_controls in gmaps takes s,l,z,n  small, large, or none
'gmaps' => "
  gmap_id I4 AUTO PRIMARY,
  content_id I4 NOTNULL,
  description C(200),
  width I4 DEFAULT 0,
  height I4 DEFAULT 0,
  lat F DEFAULT '0',
  lon F DEFAULT '0',
  zoom_level I4 DEFAULT 16,
  map_type C(128) DEFAULT 'G_MAP_TYPE',
  show_controls C(1) DEFAULT 's',
  show_scale C(5) DEFAULT 'true',
  show_typecontrols C(5) DEFAULT 'true',
  allow_comments C(5) DEFAULT 'true'
",

/*
 * set_type in gmaps_sets_keychain can be: 
 * init_markers, init_polylines, init_polygons, 
 * set_markers, set_polylines, set_polygons, 
 * map_types
 */
/*
 * markers, polylines, polygons, map_types
 */
'gmaps_sets_keychain' => "
  gmap_id I4 NOTNULL,
	set_type c(32) NOTNULL,
	set_id I4 NOTNULL,
	plot_on_load C(5) DEFAULT 'true',
	side_panel C(5) DEFAULT 'true',
	explode C(5) DEFAULT 'true',
	cluster C (5) DEFAULT 'false'
	CONSTRAINTS ', CONSTRAINT `gmaps_map_ref` FOREIGN KEY (`gmap_id`) REFERENCES `".BIT_DB_PREFIX."gmaps`( `gmap_id` )'
",

//basetype and alttype values: 0 => Streetmap 1 => Satellite, 2 => Hybrid
'gmaps_map_types' => "
  maptype_id I4 AUTO PRIMARY,
  name C(64),
  description C(255),
	copyright C(64),
  basetype I2 DEFAULT 0,
	alttype I2 DEFAULT 0,
	bounds X,
	maxzoom C(4),
	maptiles_url X,
	lowresmaptiles_url X DEFAULT 'google',
	hybridtiles_url X,
	lowreshybridtiles_url X DEFAULT 'google'
",

'gmaps_markers' => "
  marker_id I8 AUTO PRIMARY,
  content_id I4 NOTNULL,
  lat F NOTNULL,
  lon F NOTNULL,
  label_data X,
  zindex I8 DEFAULT 0,
	allow_comments C(5) DEFAULT 'true'
",

//types has two options: 0 => GIcon, 1 => XIcon
'gmaps_icon_styles' => "
  icon_id I4 AUTO PRIMARY,
  name C(64),
  type I2 DEFAULT 0,
  image X 'icons/FlatColorPins/205.png',
  rollover_image X 'icons/FlatColorPins/090.png',
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
	points X DEFAULT 0,
	scale F DEFAULT 1,
	outline_color C(6) DEFAULT 'ffffff',
	outline_weight I4 DEFAULT 2,
	fill_color C(6) DEFAULT 'ff3300',
	fill_opacity F DEFAULT .5
",

//type options: 0 => GMarker, 1 => PdMarker, 2 => XMarker
//lable hover opacity is for all
//label opacity is PdMarker Class only
//label hover styles is CSS for all
//window styles is CSS for PdMarker Class
'gmaps_marker_styles' => "
  style_id I4 AUTO PRIMARY,
  name C(64),
  type I2 DEFAULT 0,
  label_hover_opacity I4 DEFAULT 70,
  label_opacity I4 DEFAULT 100,
  label_hover_styles C(255) DEFAULT 'border:none; color:black; background-color:#ccc',
  window_styles C(255) DEFAULT 'border:none; color:black; background-color:white'
",

'gmaps_marker_sets' => "
  set_id I4 AUTO PRIMARY,
  name C(64),
  description C(255),
  style_id I4 NOTNULL,
  icon_id I4 NOTNULL
",

'gmaps_marker_keychain' => "
  set_id I4 NOTNULL,
	marker_id I8 NOTNULL
",

'gmaps_polylines' => "
  polyline_id I4 AUTO PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(255),
  points_data X,
  border_text X,
  zindex I8 DEFAULT 0
",

//type options: 0 => Google Default, 1 => XPolyline
//opacity and text_bgstyle_opacity take a float from 0-1
//pattern takes an array. Default NULL
'gmaps_polyline_styles' => "
  style_id I4 AUTO PRIMARY,
  name C(64),
  type I4 DEFAULT 0,
  color C(6) DEFAULT 'ff3300',
  weight I4 DEFAULT 2,
  opacity F DEFAULT 1,
  pattern c(255) DEFAULT 0,
  segment_count I8 DEFAULT 0,
  begin_arrow C(5) DEFAULT 'false',
  end_arrow C(5) DEFAULT 'false',
  arrows_every I8 DEFAULT 0,
  font c(255) DEFAULT 'Arial',
  text_every I8 DEFAULT 0,
  text_fgstyle_color C(6) DEFAULT 'ffffff',
  text_fgstyle_weight I4 DEFAULT 1,
  text_fgstyle_opacity F DEFAULT 1,
  text_fgstyle_zindex I8 DEFAULT 0,
  text_bgstyle_color C(6) DEFAULT 'ff3300',
  text_bgstyle_weight I4 DEFAULT 2,
  text_bgstyle_opacity  F DEFAULT 1,
  text_bgstyle_zindex I8 DEFAULT 0
",

'gmaps_polyline_sets' => "
  set_id I4 AUTO PRIMARY,
  name C(64),
  description C(255),
  style_id I4 NOTNULL
",

'gmaps_polyline_keychain' => "
  set_id I4 NOTNULL,
  polyline_id I4 NOTNULL
",

//type options: 0 => Polygon, 1 => Circle
//points_data takes an array for polygon
//circle_center for circle
//radius for circle
//@todo wj:check radius after up and running - might require an XDistance (for circle)
'gmaps_polygons' => "
  polygon_id I4 AUTO PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(64),
  circle C(5) DEFAULT 'true',
  points_data X DEFAULT 0,
  circle_center X DEFAULT 0,
  radius F DEFAULT 0,
  border_text X,
  zindex I8 DEFAULT 0
",

//opacity take a float from 0-1
'gmaps_polygon_styles' => "
  style_id I4 AUTO PRIMARY,
  name C(64),
  type I4 DEFAULT 0,
  color C(6),
  weight I4 DEFAULT 2,
  opacity F DEFAULT 1
",

'gmaps_polygon_sets' => "
  set_id I4 AUTO PRIMARY,
  name C(64),
  description C(255),
  style_id I4 NOTNULL,
	polylinestyle_id I4 NOTNULL
",

'gmaps_polygon_keychain' => "
  set_id I4 NOTNULL,
  polygon_id I4 NOTNULL
",

);



global $gBitInstaller;

$gBitInstaller->makePackageHomeable(GMAP_PKG_NAME);

foreach( array_keys( $tables ) AS $tableName ) {
	$gBitInstaller->registerSchemaTable( GMAP_PKG_NAME, $tableName, $tables[$tableName] );
}

$gBitInstaller->registerPackageInfo( GMAP_PKG_NAME, array(
	'description' => "A wikid Map engine that adds wiki editing power to Google Maps and eliminates the need to understand the Google Map API or Javascript.",
	'license' => '<a href="http://www.gnu.org/licenses/licenses.html#LGPL">LGPL</a>',
	'version' => '0.1',
	'state' => 'experimental',
	'dependencies' => '',
) );



//@todo wj: is the use of UNIQUE here correct?
// ### Indexes
$indices = array (
	'gmaps_gmap_id_idx' => array( 'table' => 'gmaps', 'cols' => 'gmap_id', 'opts' => 'UNIQUE' ),
);
$gBitInstaller->registerSchemaIndexes( GMAP_PKG_NAME, $indices );


// ### Sequences
$sequences = array (
  'gmaps_gmap_id_seq' => array( 'start' => 1 ),
  'gmaps_map_types_maptype_id_seq' => array( 'start' => 1 ),	
  'gmaps_markers_marker_id_seq' => array( 'start' => 1 ),
  'gmaps_icon_styles_icon_id_seq' => array( 'start' => 1 ),
  'gmaps_marker_styles_style_id_seq' => array( 'start' => 1 ),
  'gmaps_marker_sets_set_id_seq' => array( 'start' => 1 ),
  'gmaps_polylines_polyline_id_seq' => array( 'start' => 1 ),
  'gmaps_polyline_styles_style_id_seq' => array( 'start' => 1 ),
  'gmaps_polyline_sets_set_id_seq' => array( 'start' => 1 ),
  'gmaps_polygons_polygon_id_seq' => array( 'start' => 1 ),
  'gmaps_polygon_styles_style_id_seq' => array( 'start' => 1 ),
  'gmaps_polygon_sets_set_id_seq' => array( 'start' => 1 ),
);
$gBitInstaller->registerSchemaSequences( GMAP_PKG_NAME, $sequences );



//@todo wj:Everything below here still needs customizing!

// ### Default UserPermissions
$gBitInstaller->registerUserPermissions( GMAP_PKG_NAME, array(
	array('bit_gm_edit_map', 'Can edit maps', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_map', 'Can view maps', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_map', 'Can remove maps', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_map', 'Can rollback maps', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_maps', 'Can admin the maps', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_map', 'Can rename maps', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_map', 'Can lock maps', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_maptype', 'Can edit maptypes', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_maptype', 'Can view maptypes', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_maptype', 'Can remove maptypes', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_maptype', 'Can rollback maptypes', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_maptype', 'Can admin the maptypes', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_maptype', 'Can rename maptypes', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_maptype', 'Can lock maptypes', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_marker', 'Can edit markers', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_marker', 'Can view markers', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_marker', 'Can remove markers', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_marker', 'Can rollback markers', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_marker', 'Can admin the markers', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_marker', 'Can rename markers', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_marker', 'Can lock markers', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_marker_sets', 'Can edit marker sets', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_marker_sets', 'Can view marker sets', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_marker_sets', 'Can remove marker sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_marker_sets', 'Can rollback marker sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_marker_sets', 'Can admin the marker sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_marker_sets', 'Can rename marker sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_marker_sets', 'Can lock marker sets', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_marker_styles', 'Can edit marker styles', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_marker_styles', 'Can view marker styles', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_marker_styles', 'Can remove marker styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_marker_styles', 'Can rollback marker styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_marker_styles', 'Can admin the marker styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_marker_styles', 'Can rename marker styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_marker_styles', 'Can lock marker styles', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_polyline', 'Can edit polylines', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_polyline', 'Can view polylines', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_polyline', 'Can remove polylines', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_polyline', 'Can rollback polylines', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_polyline', 'Can admin the polylines', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_polyline', 'Can rename polylines', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_polyline', 'Can lock polylines', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_polyline_sets', 'Can edit polyline sets', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_polyline_sets', 'Can view polyline sets', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_polyline_sets', 'Can remove polyline sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_polyline_sets', 'Can rollback polyline sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_polyline_sets', 'Can admin the polyline sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_polyline_sets', 'Can rename polyline sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_polyline_sets', 'Can lock polyline sets', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_polyline_styles', 'Can edit polyline styles', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_polyline_styles', 'Can view polyline styles', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_polyline_styles', 'Can remove polyline styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_polyline_styles', 'Can rollback polyline styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_polyline_styles', 'Can admin the polyline styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_polyline_styles', 'Can rename polyline styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_polyline_styles', 'Can lock polyline styles', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_ploygon', 'Can edit ploygons', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_ploygon', 'Can view ploygons', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_ploygon', 'Can remove ploygons', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_ploygon', 'Can rollback ploygons', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_ploygon', 'Can admin the ploygons', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_ploygon', 'Can rename ploygons', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_ploygon', 'Can lock ploygons', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_ploygon_sets', 'Can edit ploygon sets', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_ploygon_sets', 'Can view ploygon sets', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_ploygon_sets', 'Can remove ploygon sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_ploygon_sets', 'Can rollback ploygon sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_ploygon_sets', 'Can admin the ploygon sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_ploygon_sets', 'Can rename ploygon sets', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_ploygon_sets', 'Can lock ploygon sets', 'editors', GMAP_PKG_NAME),

	array('bit_gm_edit_polygon_styles', 'Can edit polygon styles', 'registered', GMAP_PKG_NAME),
	array('bit_gm_view_polygon_styles', 'Can view polygon styles', 'basic', GMAP_PKG_NAME),
	array('bit_gm_remove_polygon_styles', 'Can remove polygon styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rollback_polygon_styles', 'Can rollback polygon styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_admin_polygon_styles', 'Can admin the polygon styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_rename_polygon_styles', 'Can rename polygon styles', 'editors', GMAP_PKG_NAME),
	array('bit_gm_lock_polygon_styles', 'Can lock polygon styles', 'editors', GMAP_PKG_NAME),

	array('bit_gm_minor', 'Can save as minor edit', 'registered', GMAP_PKG_NAME),
) );

// ### Default Preferences
$gBitInstaller->registerPreferences( GMAP_PKG_NAME, array(
	//array(GMAP_PKG_NAME, 'anonCanEdit','n'),
	//array(GMAP_PKG_NAME, 'feature_autolinks','y'),
	//array(GMAP_PKG_NAME, 'feature_backlinks','y'),
	//array(GMAP_PKG_NAME, 'feature_dump','y'),
	//array(GMAP_PKG_NAME, 'feature_history','y'),
	//array(GMAP_PKG_NAME, 'feature_lastChanges','y'),
	//array(GMAP_PKG_NAME, 'feature_listPages','y'),
	//array(GMAP_PKG_NAME, 'feature_page_title','y'),
	//array(GMAP_PKG_NAME, 'feature_warn_on_edit','n'),
	//array(GMAP_PKG_NAME, 'feature_gmap','y'),
	array(GMAP_PKG_NAME, 'feature_gmap_comments','n'),
	array(GMAP_PKG_NAME, 'feature_gmap_description','y'),
	array(GMAP_PKG_NAME, 'feature_gmap_discuss','n'),
	array(GMAP_PKG_NAME, 'feature_gmap_rankings','y'),
	array(GMAP_PKG_NAME, 'feature_gmap_usrlock','n'),
	//array(GMAP_PKG_NAME, 'keep_versions','1'),
	//array(GMAP_PKG_NAME, 'maxVersions','0'),
	//array(GMAP_PKG_NAME, 'w_use_db','y'),
	//array(GMAP_PKG_NAME, 'w_use_dir',''),
	//array(GMAP_PKG_NAME, 'warn_on_edit_time','2'),
	array(GMAP_PKG_NAME, 'gmap_cache','0'),
	array(GMAP_PKG_NAME, 'gmap_creator_admin','n'),
	array(GMAP_PKG_NAME, 'gmap_left_column','y'),
	array(GMAP_PKG_NAME, 'gmap_list_backlinks','y'),
	array(GMAP_PKG_NAME, 'gmap_list_comment','y'),
	array(GMAP_PKG_NAME, 'gmap_list_creator','y'),
	array(GMAP_PKG_NAME, 'gmap_list_hits','y'),
	array(GMAP_PKG_NAME, 'gmap_list_lastmodif','y'),
	array(GMAP_PKG_NAME, 'gmap_list_lastver','y'),
	array(GMAP_PKG_NAME, 'gmap_list_links','y'),
	array(GMAP_PKG_NAME, 'gmap_list_name','y'),
	array(GMAP_PKG_NAME, 'gmap_list_user','y'),
	array(GMAP_PKG_NAME, 'gmap_list_versions','y'),
	// use underscores for preferences not camelcaps
	array(GMAP_PKG_NAME, 'gmapHomePage','Welcome'),
	array(GMAP_PKG_NAME, 'gmapLicensePage',''),
) );

?>
