<?php

$tables = array(

'tiki_gmaps' => "
  map_id I8 PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  title C(200),
  description C(200),
  width I4 DEFAULT 500,
  height I4 DEFAULT 300,
  location_lat F DEFAULT 40.77638178482896,
  location_lon F DEFAULT -73.89266967773438,
  zoom_level I4 DEFAULT 6,
  map_type C(200) DEFAULT 'G_HYBRID_TYPE',
  show_controls C(1) DEFAULT 'S',  //takes S,L,N  small, large, or none
  show_scale L DEFAULT 1,
  show_map_types L DEFAULT 1,
  init_marker_set I8,
  init_polylines_set I8,
  init_polygon_set I8,
  add_map_types I8,
  marker_sets I8,
  polyline_sets I8,
  polygon_sets I8,
	icon_styles I8,  //@todo wj:This might need to be a Foreign Key relationship to the Icons table
	marker_styles I8,  //@todo wj:This might need to be a Foreign Key relationship to the Markers Styles table
  xml X
",


'tiki_gmaps_markers' => "
  marker_id I8 PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(200),
  location_lat F,		 //@todo wj:Default must be created in Marker creation engine
  location_lon F,		 //@todo wj:Default must be created in Marker creation engine
  icon_id I8 DEFAULT 0,  //@todo wj:This needs to be a Foreign Key relationship to the Icons table
  window_data X,
  style_id I8 DEFAULT 0,  //@todo wj:This needs to be a Foreign Key relationship to the Markers Styles table
  label_data X,
  zindex I8, 	 //@todo wj:NULL check needs to return 'auto'
  xml X
",


'tiki_gmaps_iconstyles' => "
  icon_id I8 PRIMARY,
  name C(40),
  type I2 DEFAULT 0, 		//@todo wj:maybe need a table for this? Right now only 2 options. 0 => GIcon, 1 => XIcon
  image X,				//@todo wj:takes a path - requires some special escaping?
  image_w I4,
  image_h I4,
  shadow_image X,				//@todo wj:takes a path - requires some special escaping?
  shadow_w I4,
  shadow_h I4,
  rollover_image				//@todo wj:takes a path - requires some special escaping?
  icon_anchor_x I4 DEFAULT 0,
  icon_anchor_y I4 DEFAULT 0,
  infowindow_anchor_x I4 DEFAULT 0,
  infowindow_anchor_y I4 DEFAULT 0,
  infoshadow_anchor_x I4 DEFAULT 0,
  infoshadow_anchor_y I4 DEFAULT 0,
	maps X 							//@todo wj:takes an array or links to a table that tracks back which maps its used in. (Maybe foreign key can do this for me.)
",


'tiki_gmaps_markerstyles' => "
  style_id I8 PRIMARY,
  name C(40),
  type I2 DEFAULT 0,		 // 0 => GMarker, 1 => PdMarker, 1 => XMarker])
  label_hover_opacity I4 DEFAULT 70, 	 //(PdMarker Class)
  label_opacity I4 DEFAULT 100, 			 //(PdMarker Class)
  label_hover_styles X, 		 //@todo wj:might want to add default here (CSS for PdMarker Class)
  window_styles X, 				 //@todo wj:might want to add default here (CSS for PdMarker Class)
",


'tiki_gmaps_polylines' => "
  polyline_id I8 PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(200),
  type I4 DEFAULT 0, //0 => Google Default, 1 => XPolyline
  points_data X, //@todo wj:verify that X is the best type for storing an array - for example how can tiki_preferences => value be varchar(250) and take those long arrays?
  style_id I8 DEFAULT 0,
  border_text X,
  zindex I8,
  xml X
",


'tiki_gmaps_polylinestyles' => "
  style_id I8 PRIMARY,
  name C(40),
  color C(6) DEFAULT 'ff3300',
  weight I8 DEFAULT 2,
  opacity F DEFAULT 1,    //takes a value from 0-1
  pattern c(200),         //takes an array.  Default NULL
  segment_count I8,       //takes a value.  Default NULL
  begin_arrow L DEFAULT 0,
  end_arrow L DEFAULT 0,
  arrows_every I8,        //takes a value.   Default NULL
  font c(200),            //(CSS)
  text_every I8,          //takes a value.   Default NULL
  text_fgstyle_color C(6) DEFAULT 'ffffff',
  text_fgstyle_weight I8 DEFAULT 1,
  text_fgstyle_opacity I4 DEFAULT 1,   //Take a value from 0-1
  text_fgstyle_zindex I8,
  text_bgstyle_color C(6) DEFAULT 'ff3300',
  text_bgstyle_weight I8 DEFAULT 2,
  text_bgstyle_opacity I4 DEFAULT 1,   //Take a value from 0-1
  text_bgstyle_zindex I8
",


'tiki_gmaps_polygons' => "
  polygon_id I8 PRIMARY,
  user_id I4 NOTNULL,
  modifier_user_id I4 NOTNULL,
  created I8 NOTNULL,
  last_modified I8 NOTNULL,
  version I4 NOTNULL,
  name C(40),
  type I4 DEFAULT 0,      //0 => Polygon, 1 => Circle
  points_data X,          //takes an array for polygon
  center_x F,             //lat for circle
	center_y F,             //lon for circle
  radius F,               //@todo wj:check this after up and running - might require an XDistance (for circle)
  polylinestyle_id I8 DEFAULT 0,    //outline uses polyline style
  style_id I8 DEFAULT 0,            //fill style
  border_text X,
  zindex I8,
  xml X
",


'tiki_gmaps_polygonstyles' => "
  style_id I8 PRIMARY,
  name C(40),
  color C(6),
  weight I8 DEFAULT 2,
  opacity F DEFAULT 1   //Take a value from 0-1
",


'tiki_gmaps_history' => "
  mapparttype C(40) NOTNULL,  //takes: map, marker, polyline, polygon, icon, markerstyle, polylinestyle, polygonstyle 
	part_id I8 NOTNULL,      //this corresponds to the id for the given type
  version I4 NOTNULL,
  last_modified I8 NOTNULL,
  user_id C(40),
  ip C(15),
  comment C(200),
  xml X
",


);





global $gBitInstaller;


//@todo wj:Everything below here still needs customizing!

$gBitInstaller->makePackageHomeable(WIKI_PKG_NAME);

foreach( array_keys( $tables ) AS $tableName ) {
	$gBitInstaller->registerSchemaTable( WIKI_PKG_NAME, $tableName, $tables[$tableName] );
}

$gBitInstaller->registerPackageInfo( WIKI_PKG_NAME, array(
	'description' => "A wiki is 'the simplest online database that could possibly work.' No HTML or programming knowledge is needed to contribute to a wiki.",
	'license' => '<a href="http://www.gnu.org/licenses/licenses.html#LGPL">LGPL</a>',
	'version' => '0.1',
	'state' => 'experimental',
	'dependencies' => '',
) );

// ### Indexes
$indices = array (
	'tiki_pages_content_idx' => array( 'table' => 'tiki_pages', 'cols' => 'content_id', 'opts' => 'UNIQUE' ),
	'tiki_pages_page_rank_idx' => array( 'table' => 'tiki_pages', 'cols' => 'page_rank', 'opts' => NULL ),
	'tiki_page_footnotes_page_idx' => array( 'table' => 'tiki_page_footnotes', 'cols' => 'page_id', 'opts' => NULL )
);
$gBitInstaller->registerSchemaIndexes( WIKI_PKG_NAME, $indices );

// ### Sequences
$sequences = array (
	'tiki_pages_page_id_seq' => array( 'start' => 1 )
);
$gBitInstaller->registerSchemaSequences( WIKI_PKG_NAME, $sequences );


// ### Default UserPermissions
$gBitInstaller->registerUserPermissions( WIKI_PKG_NAME, array(
	array('bit_p_edit_dynvar', 'Can edit dynamic variables', 'editors', WIKI_PKG_NAME),
	array('bit_p_edit', 'Can edit pages', 'registered', WIKI_PKG_NAME),
	array('bit_p_view', 'Can view page/pages', 'basic', WIKI_PKG_NAME),
	array('bit_p_remove', 'Can remove', 'editors', WIKI_PKG_NAME),
	array('bit_p_rollback', 'Can rollback pages', 'editors', WIKI_PKG_NAME),
	array('bit_p_admin_wiki', 'Can admin the wiki', 'editors', WIKI_PKG_NAME),
	array('bit_p_wiki_admin_attachments', 'Can admin attachments to wiki pages', 'editors', WIKI_PKG_NAME),
	array('bit_p_wiki_view_attachments', 'Can view wiki attachments and download', 'registered', WIKI_PKG_NAME),
	array('bit_p_upload_picture', 'Can upload pictures to wiki pages', 'registered', WIKI_PKG_NAME),
	array('bit_p_minor', 'Can save as minor edit', 'registered', WIKI_PKG_NAME),
	array('bit_p_rename', 'Can rename pages', 'editors', WIKI_PKG_NAME),
	array('bit_p_lock', 'Can lock pages', 'editors', WIKI_PKG_NAME),

	array('bit_p_edit_books', 'Can create and edit books', 'registered', WIKI_PKG_NAME),
	array('bit_p_admin_books', 'Can administer books', 'editors', WIKI_PKG_NAME),
	array('bit_p_edit_copyrights', 'Can edit copyright notices', 'registered', WIKI_PKG_NAME)
) );

// ### Default Preferences
$gBitInstaller->registerPreferences( WIKI_PKG_NAME, array(
	array(WIKI_PKG_NAME, 'anonCanEdit','n'),
	array(WIKI_PKG_NAME, 'feature_autolinks','y'),
	array(WIKI_PKG_NAME, 'feature_backlinks','y'),
	array(WIKI_PKG_NAME, 'feature_dump','y'),
	array(WIKI_PKG_NAME, 'feature_history','y'),
	array(WIKI_PKG_NAME, 'feature_lastChanges','y'),
	array(WIKI_PKG_NAME, 'feature_likePages','y'),
	array(WIKI_PKG_NAME, 'feature_allow_dup_wiki_page_names','y'),
	array(WIKI_PKG_NAME, 'feature_listPages','y'),
	array(WIKI_PKG_NAME, 'feature_page_title','y'),
	array(WIKI_PKG_NAME, 'feature_ranking','n'),
	array(WIKI_PKG_NAME, 'feature_sandbox','y'),
	array(WIKI_PKG_NAME, 'feature_warn_on_edit','n'),
	array(WIKI_PKG_NAME, 'feature_wiki','y'),
	array(WIKI_PKG_NAME, 'feature_wiki_attachments','y'),
	array(WIKI_PKG_NAME, 'feature_wiki_books','y'),
	array(WIKI_PKG_NAME, 'feature_wiki_comments','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_description','y'),
	array(WIKI_PKG_NAME, 'feature_wiki_discuss','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_footnotes','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_icache','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_monosp','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_multiprint','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_notepad','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_generate_pdf',''),
	array(WIKI_PKG_NAME, 'feature_wiki_pictures','y'),
	array(WIKI_PKG_NAME, 'feature_wiki_plurals','y'),
	array(WIKI_PKG_NAME, 'feature_wiki_rankings','y'),
	array(WIKI_PKG_NAME, 'feature_wiki_tables','new'),
	array(WIKI_PKG_NAME, 'feature_wiki_templates','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_undo','n'),
	array(WIKI_PKG_NAME, 'feature_wiki_usrlock','n'),
	array(WIKI_PKG_NAME, 'feature_wikiwords','y'),
	array(WIKI_PKG_NAME, 'keep_versions','1'),
	array(WIKI_PKG_NAME, 'maxVersions','0'),
	array(WIKI_PKG_NAME, 'w_use_db','y'),
	array(WIKI_PKG_NAME, 'w_use_dir',''),
	array(WIKI_PKG_NAME, 'warn_on_edit_time','2'),
	array(WIKI_PKG_NAME, 'wiki_bot_bar','n'),
	array(WIKI_PKG_NAME, 'wiki_cache','0'),
	array(WIKI_PKG_NAME, 'wiki_creator_admin','n'),
	array(WIKI_PKG_NAME, 'wiki_feature_copyrights','n'),
	array(WIKI_PKG_NAME, 'wiki_forum',''),
	array(WIKI_PKG_NAME, 'wiki_forum_id',''),
	array(WIKI_PKG_NAME, 'wiki_left_column','y'),
	array(WIKI_PKG_NAME, 'wiki_list_backlinks','y'),
	array(WIKI_PKG_NAME, 'wiki_list_comment','y'),
	array(WIKI_PKG_NAME, 'wiki_list_creator','y'),
	array(WIKI_PKG_NAME, 'wiki_list_hits','y'),
	array(WIKI_PKG_NAME, 'wiki_list_lastmodif','y'),
	array(WIKI_PKG_NAME, 'wiki_list_lastver','y'),
	array(WIKI_PKG_NAME, 'wiki_list_links','y'),
	array(WIKI_PKG_NAME, 'wiki_list_name','y'),
	array(WIKI_PKG_NAME, 'wiki_list_size','y'),
	array(WIKI_PKG_NAME, 'wiki_list_status','y'),
	array(WIKI_PKG_NAME, 'wiki_list_user','y'),
	array(WIKI_PKG_NAME, 'wiki_list_versions','y'),
	array(WIKI_PKG_NAME, 'wiki_page_regex','strict'),
	array(WIKI_PKG_NAME, 'wiki_right_column','y'),
	array(WIKI_PKG_NAME, 'wiki_spellcheck','n'),
	array(WIKI_PKG_NAME, 'wiki_top_bar','n'),
	array(WIKI_PKG_NAME, 'wiki_uses_slides','n'),
	array(WIKI_PKG_NAME, 'wikibook_show_path','y'),
	array(WIKI_PKG_NAME, 'wikibook_show_navigation','y'),
	array(WIKI_PKG_NAME, 'wikiHomePage','Welcome'),
	array(WIKI_PKG_NAME, 'wikiLicensePage',''),
	array(WIKI_PKG_NAME, 'wikiSubmitNotice',''),
) );

?>
