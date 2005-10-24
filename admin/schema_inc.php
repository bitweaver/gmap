<?php

$tables = array(

'bit_gmaps' => "
  gmap_id I4 AUTO PRIMARY,
  content_id I4 NOTNULL,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  title C(255),
  description C(255),
  width I4 DEFAULT 500,
  height I4 DEFAULT 300,
  location_lat F DEFAULT '40.77638178482896',
  location_lon F DEFAULT '-73.89266967773438',
  zoom_level I4 DEFAULT 6,
  map_type C(128) DEFAULT 'G_HYBRID_TYPE',
  show_controls C(1) DEFAULT 's',   //takes s,l,n  small, large, or none
  show_scale L DEFAULT 1,
  show_typecontrols L DEFAULT 1,
  data X
",


'bit_gmaps_sets_keychain' => "
  gmap_id I4,
	set_type c(32),    //takes init_markers, init_polylines, init_polygons, set_markers, set_polylines, set_polygons, map_types
	set_id
  CONSTRAINTS ', CONSTRAINT `bit_gmaps_map_ref` FOREIGN KEY (`gmap_id`) REFERENCES `".BIT_DB_PREFIX."bit_gmaps`( `gmap_id` )'	
",


'bit_gmaps_map_types' => "
  maptype_id I4 AUTO PRIMARY,
  name C(64),
  basetype I2 DEFAULT 0,    //0 => Streetmap 1 => Satellite, 2 => Hybrid
	maptiles_url X,           //@todo wj: takes a url path, special escaping required?
	hybridtiles_url X         //@todo wj: takes a url path, special escaping required?
",


'bit_gmaps_markers' => "
  marker_id I8 AUTO PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(256),
  location_lat F,		 //Default must be created in Marker creation engine
  location_lon F,		 //Default must be created in Marker creation engine
  window_data X,
  label_data X,
  zindex I8, 	 			 //NULL check needs to return 'auto' because CSS only accepts auto or an integer so we restrict this to an integer here
  data X
",


'bit_gmaps_icon_styles' => "
  icon_id I4 AUTO PRIMARY,
  name C(64),
  type I2 DEFAULT 0, 		 //Right now only 2 options. 0 => GIcon, 1 => XIcon
  image X,				       //@todo wj:takes a url path - requires some special escaping?
  icon_w I4,
  icon_h I4,
  shadow_image X,				 //@todo wj:takes a url path - requires some special escaping?
  shadow_w I4,
  shadow_h I4,
  rollover_image				 //@todo wj:takes a url path - requires some special escaping?
  icon_anchor_x I4 DEFAULT 0,
  icon_anchor_y I4 DEFAULT 0,
  infowindow_anchor_x I4 DEFAULT 0,
  infowindow_anchor_y I4 DEFAULT 0
",


'bit_gmaps_marker_styles' => "
  style_id I4 AUTO PRIMARY,
  name C(64),
  type I2 DEFAULT 0,		               // 0 => GMarker, 1 => PdMarker, 1 => XMarker])
  label_hover_opacity I4 DEFAULT 70, 	 //(PdMarker Class)
  label_opacity I4 DEFAULT 100, 			 //(PdMarker Class)
  label_hover_styles X DEFAULT 'border:none; color:black; background-color:#cccccc',   //(CSS for PdMarker Class)
  window_styles X DEFAULT 'border:none; color:black; background-color:white',           //(CSS for PdMarker Class)
	data X
",


'bit_gmaps_marker_sets' => "
  set_id I4 AUTO PRIMARY,
  style_id I4,   //@todo wj:This needs to be a Foreign Key relationship to the Markers Styles table	
  icon_id,       //@todo wj:This needs to be a Foreign Key relationship to the Icons table
  data X
",


'bit_gmaps_marker_keychain' => "
  set_id I4,    //@todo wj:make this foreign keyed to markersets set_id
	marker_id     //@todo wj:make this foreign keyed to marker marker_id
",


'bit_gmaps_polylines' => "
  polyline_id I4 AUTO PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(256),
  type I4 DEFAULT 0, //0 => Google Default, 1 => XPolyline
  points_data X,
  border_text X,
  zindex I8,
  data X
",


'bit_gmaps_polyline_styles' => "
  style_id I4 AUTO PRIMARY,
  name C(64),
  color C(6) DEFAULT 'ff3300',
  weight I4 DEFAULT 2,
  opacity F DEFAULT 1,                 //takes a float from 0-1
  pattern c(256),                      //takes an array.  Default NULL
  segment_count I8,                    //takes a value.  Default NULL
  begin_arrow L DEFAULT 0,
  end_arrow L DEFAULT 0,
  arrows_every I8,                     //takes a value.   Default NULL
  font c(256) DEFAULT "Arial",         //(CSS)
  text_every I8,                       //takes a value.   Default NULL
  text_fgstyle_color C(6) DEFAULT 'ffffff',
  text_fgstyle_weight I4 DEFAULT 1,
  text_fgstyle_opacity I4 DEFAULT 1,   //Take a float from 0-1
  text_fgstyle_zindex I8,
  text_bgstyle_color C(6) DEFAULT 'ff3300',
  text_bgstyle_weight I4 DEFAULT 2,
  text_bgstyle_opacity I4 DEFAULT 1,   //Take a float from 0-1
  text_bgstyle_zindex I8
",



'bit_gmaps_polyline_sets' => "
  set_id I4 AUTO PRIMARY,
  style_id I4,         //@todo wj:This needs to be a Foreign Key relationship to the Polyline Styles table	
  data X
",


'bit_gmaps_polyline_keychain' => "
  set_id I4,          //@todo wj:make this foreign keyed to polylinesets set_id
  polyline_id I4      //@todo wj:This needs to be a Foreign Key relationship to the Polyline table	
",


'bit_gmaps_polygons' => "
  polygon_id I4 AUTO PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(64),
  type I4 DEFAULT 0,      //0 => Polygon, 1 => Circle
  points_data X,          //takes an array for polygon
  center_x F,             //lat for circle
	center_y F,             //lon for circle
  radius F,               //@todo wj:check this after up and running - might require an XDistance (for circle)
  border_text X,
  zindex I8,
  data X
",


'bit_gmaps_polygon_styles' => "
  style_id I4 AUTO PRIMARY,
  name C(64),
  color C(6),
  weight I4 DEFAULT 2,
  opacity F DEFAULT 1   //Take a float from 0-1
",


'bit_gmaps_polygon_sets' => "
  set_id I4 AUTO PRIMARY,
  style_id I4,         //@todo wj:This needs to be a Foreign Key relationship to the Polygon Styles table	
	polylinestyle_id,    //@todo wj:This needs to be a Foreign Key relationship to the Polyline Styles table	
  data X
",


'bit_gmaps_polygon_keychain' => "
  set_id I4,          //@todo wj:make this foreign keyed to polygonets set_id
  polygon_id I4       //@todo wj:This needs to be a Foreign Key relationship to the Polygon table	
",


'bit_gmaps_history' => "
  mapparttype C(64) NOTNULL,  //takes: map, marker, polyline, polygon, icon, markerstyle, polylinestyle, polygonstyle 
	part_id I4 NOTNULL,         //this corresponds to the id for the given part type
  version I4 NOTNULL,
  last_modified I8 NOTNULL,
  user_id C(64),
  ip C(15),
  comment C(256),
  data X
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
	'bit_gmaps_gmap_id_idx' => array( 'table' => 'bit_gmaps', 'cols' => 'gmap_id', 'opts' => 'UNIQUE' ),
	'bit_gmaps_marker_sets_set_id_idx' => array( 'table' => 'bit_gmaps_marker_sets', 'cols' => 'set_id', 'opts' => 'UNIQUE' ),
	'bit_gmaps_polyline_sets_set_id_idx' => array( 'table' => 'bit_gmaps_polyline_sets', 'cols' => 'set_id', 'opts' => 'UNIQUE' ),
	'bit_gmaps_polygon_sets_set_id_idx' => array( 'table' => 'bit_gmaps_polygon_sets', 'cols' => 'set_id', 'opts' => 'UNIQUE' )
);
$gBitInstaller->registerSchemaIndexes( GMAP_PKG_NAME, $indices );


//@todo wj: what the devil is this for?
// ### Sequences
$sequences = array (
	'bit_gmaps_gmap_id_seq' => array( 'start' => 1 ),
	'bit_gmaps_marker_sets_set_id_seq' => array( 'start' => 1 ),
	'bit_gmaps_polyline_sets_set_id_seq' => array( 'start' => 1 )
	'bit_gmaps_polygon_sets_set_id_seq' => array( 'start' => 1 )
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
	array(GMAP_PKG_NAME, 'anonCanEdit','n'),
	array(GMAP_PKG_NAME, 'feature_autolinks','y'),
	array(GMAP_PKG_NAME, 'feature_backlinks','y'),
	array(GMAP_PKG_NAME, 'feature_dump','y'),
	array(GMAP_PKG_NAME, 'feature_history','y'),
	array(GMAP_PKG_NAME, 'feature_lastChanges','y'),
	array(GMAP_PKG_NAME, 'feature_listPages','y'),
	array(GMAP_PKG_NAME, 'feature_page_title','y'),
	array(GMAP_PKG_NAME, 'feature_warn_on_edit','n'),
	array(GMAP_PKG_NAME, 'feature_gmap','y'),
	array(GMAP_PKG_NAME, 'feature_gmap_comments','n'),
	array(GMAP_PKG_NAME, 'feature_gmap_description','y'),
	array(GMAP_PKG_NAME, 'feature_gmap_discuss','n'),
	array(GMAP_PKG_NAME, 'feature_gmap_rankings','y'),
	array(GMAP_PKG_NAME, 'feature_gmap_usrlock','n'),
	array(GMAP_PKG_NAME, 'keep_versions','1'),
	array(GMAP_PKG_NAME, 'maxVersions','0'),
	array(GMAP_PKG_NAME, 'w_use_db','y'),
	array(GMAP_PKG_NAME, 'w_use_dir',''),
	array(GMAP_PKG_NAME, 'warn_on_edit_time','2'),
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
	array(GMAP_PKG_NAME, 'gmapHomePage','Welcome'),
	array(GMAP_PKG_NAME, 'gmapLicensePage',''),
) );

?>
