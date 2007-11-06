<?php
// Copyright (c) 2005, 2006 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

if (isset($_REQUEST["gmapset"]) && isset($_REQUEST["homeGmap"])) {
    $gBitSystem->storePreference("home_gmap", $_REQUEST["homeGmap"]);
    $gBitSmarty->assign('home_gmap', $_REQUEST["homeGmap"]);
}

if( !empty( $_REQUEST['gmap_preferences'] )) {
	$gBitSystem->storeConfig( 'gmap_api_key', $_REQUEST['gmap_api_key'], GMAP_PKG_NAME );
	$gBitSystem->storeConfig( 'gmap_lat', $_REQUEST['gmap_lat'], GMAP_PKG_NAME );
	$gBitSystem->storeConfig( 'gmap_lng', $_REQUEST['gmap_lng'], GMAP_PKG_NAME );
	$gBitSystem->storeConfig( 'gmap_zoom', $_REQUEST['gmap_zoom'], GMAP_PKG_NAME );
}

require_once( GMAP_PKG_PATH.'BitGmap.php' );

$formGmapLists = array(
	"gmap_list_title" => array(
		'label' => 'Title',
	),
	"gmap_list_description" => array(
		'label' => 'Description',
	),
	"gmap_list_data" => array(
		'label' => 'Text',
	),
);
$gBitSmarty->assign( 'formGmapLists',$formGmapLists );

$processForm = set_tab();

if( $processForm ) {
	$gmapToggles = array_merge( $formGmapLists );
	foreach( $gmapToggles as $item => $data ) {
		simple_set_toggle( $item );
	}
}


// allow selection of what packages can have gmaps
$exclude = array( 'bitgmap', 'bitgmapmarker', 'tikisticky', 'pigeonholes' );
foreach( $gLibertySystem->mContentTypes as $cType ) {
	if( !in_array( $cType['content_type_guid'], $exclude ) ) {
		$formMappable['guids']['gmap_map_'.$cType['content_type_guid']]  = $cType['content_description'];
	}
}

// where to display content permalinks to mapped-content map
$formGmapServiceDisplayOptions = array(
	"gmap_in_nav" => array(
		'label' => 'Gmap Link In Nav',
		'note' => 'Shows a link to the content map at the top of a page. Only visible when the full content page is loaded',
		'type' => 'toggle',
	),
	"gmap_in_body" => array(
		'label' => 'Gmap Link In Body',
		'note' => 'Shows a link to the content map above the body text of content. Visible both in listings and when the full content page is loaded',
		'type' => 'toggle',
	),
	"gmap_in_view" => array(
		'label' => 'Gmap Link In View',
		'note' => 'Shows a link to the content map at the bottom of a page after the body text. Only visible when the full content page is loaded',
		'type' => 'toggle',
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