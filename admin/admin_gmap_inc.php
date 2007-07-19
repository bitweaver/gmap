<?php
// Copyright (c) 2005, 2006 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

if (isset($_REQUEST["gmapset"]) && isset($_REQUEST["homeGmap"])) {
    $gBitSystem->storePreference("home_gmap", $_REQUEST["homeGmap"]);
    $gBitSmarty->assign('home_gmap', $_REQUEST["homeGmap"]);
}

if( !empty( $_REQUEST['gmap_api_key'] ) ) {
	$gBitSystem->storeConfig( 'gmap_api_key', $_REQUEST['gmap_api_key'], GMAP_PKG_NAME );
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



// allow selection of what packages can have ratings
$exclude = array( 'bitgmap', 'bitgmapmarker', 'tikisticky', 'pigeonholes' );
foreach( $gLibertySystem->mContentTypes as $cType ) {
	if( !in_array( $cType['content_type_guid'], $exclude ) ) {
		$formMapable['guids']['gmap_map_'.$cType['content_type_guid']]  = $cType['content_description'];
	}
}

if( !empty( $_REQUEST['gmap_preferences'] ) ) {
	foreach( array_keys( $formMapable['guids'] ) as $mapable ) {
		$gBitSystem->storeConfig( $mapable, ( ( !empty( $_REQUEST['mapable_content'] ) && in_array( $mapable, $_REQUEST['mapable_content'] ) ) ? 'y' : NULL ), GMAP_PKG_NAME );
	}
}

// check the correct packages in the package selection
foreach( $gLibertySystem->mContentTypes as $cType ) {
	if( $gBitSystem->getConfig( 'gmap_map_'.$cType['content_type_guid'] ) ) {
		$formMapable['checked'][] = 'gmap_map_'.$cType['content_type_guid'];
	}
}
$gBitSmarty->assign( 'formMapable', $formMapable );


?>