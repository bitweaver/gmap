<?php
// Copyright (c) 2005, 2006 bitweaver Gmap
// All Rights Reserved. See below for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details.

/* not used
if( isset( $_REQUEST["gmapset"] ) && isset( $_REQUEST["homeGmap"] )) {
	$gBitSystem->storePreference( "home_gmap", $_REQUEST["homeGmap"] );
	$gBitSmarty->assign( 'home_gmap', $_REQUEST["homeGmap"] );
}
 */

if( !empty( $_REQUEST['gmap_preferences'] )) {
	$gBitSystem->storeConfig( 'gmap_api_key', $_REQUEST['gmap_api_key'], GMAP_PKG_NAME );
	$gBitSystem->storeConfig( 'gmap_lat', $_REQUEST['gmap_lat'], GMAP_PKG_NAME );
	$gBitSystem->storeConfig( 'gmap_lng', $_REQUEST['gmap_lng'], GMAP_PKG_NAME );
	$gBitSystem->storeConfig( 'gmap_zoom', $_REQUEST['gmap_zoom'], GMAP_PKG_NAME );
}

require_once( GMAP_PKG_PATH.'BitGmap.php' );

// allow selection of what packages can have gmaps
$exclude = array( 'bitgmap','bitgmapmarker','bitgmarkerset','bitgmappolyline','bitgpolylineset','bitgmappolygon','bitgpolygonset','tikisticky','pigeonholes' );
foreach( $gLibertySystem->mContentTypes as $cType ) {
	if( !in_array( $cType['content_type_guid'], $exclude ) ) {
		$formMappable['guids']['gmap_map_'.$cType['content_type_guid']]  = $gLibertySystem->getContentTypeName( $cType['content_type_guid'] );
	}
}

// where to display content permalinks to mapped-content map
$formGmapServiceDisplayOptions = array(
	"gmap_in_icon" => array(
		'label' => 'Map Icon',
		'note' => 'This will show a link to the map as an icon among the other page icons. Visible both in listings and when the full content page is loaded.',
		'type' => 'toggle',
	),
	"gmap_in_nav" => array(
		'label' => 'Navigation Link',
		'note' => 'Shows a link to the content map at the top of a page. Only visible when the full content page is loaded.',
		'type' => 'toggle',
	),
	"gmap_in_body" => array(
		'label' => 'In Body Area',
		'note' => 'Shows a link to the content map including a small inline map above the body text of content. Visible both in listings and when the full content page is loaded.',
		'type' => 'toggle',
	),
	"gmap_in_view" => array(
		'label' => 'Bottom of Page',
		'note' => 'Shows a link to the content map including a small inline map below the body text. Only visible when the full content page is loaded.',
		'type' => 'toggle',
	),
	"gmap_inline_map_width" => array(
		'label' => 'Inline Map Width',
		'note' => 'Set the width in pixels of the inline map.',
		'type' => 'numeric',
		'default' => 190,
	),
	"gmap_inline_map_height" => array(
		'label' => 'Inline Map Height',
		'note' => 'Set the height in pixels of the inline map.',
		'type' => 'numeric',
		'default' => 190,
	),
);
$gBitSmarty->assign( 'formGmapServiceDisplayOptions', $formGmapServiceDisplayOptions );

// store the prefs
if( !empty( $_REQUEST['gmap_preferences'] ) ) {
	foreach( $formGmapServiceDisplayOptions as $item => $data ) {
		if( $data['type'] == 'numeric' ) {
			simple_set_int( $item, GMAP_PKG_NAME );
		} elseif( $data['type'] == 'toggle' ) {
			simple_set_toggle( $item, GMAP_PKG_NAME );
		} elseif( $data['type'] == 'input' ) {
			simple_set_value( $item, GMAP_PKG_NAME );
		}
	}

	foreach( array_keys( $formMappable['guids'] ) as $mappable ) {
		$gBitSystem->storeConfig( $mappable, ( ( !empty( $_REQUEST['mappable_content'] ) && in_array( $mappable, $_REQUEST['mappable_content'] ) ) ? 'y' : NULL ), GMAP_PKG_NAME );
	}
}

// check the correct packages in the package selection
foreach( $gLibertySystem->mContentTypes as $cType ) {
	if( $gBitSystem->getConfig( 'gmap_map_'.$cType['content_type_guid'] ) ) {
		$formMappable['checked'][] = 'gmap_map_'.$cType['content_type_guid'];
	}
}
$gBitSmarty->assign( 'formMappable', $formMappable );

?>
