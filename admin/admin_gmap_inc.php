<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

if (isset($_REQUEST["gmapset"]) && isset($_REQUEST["homeGmap"])) {
    $gBitSystem->storePreference("home_gmap", $_REQUEST["homeGmap"]);
    $smarty->assign('home_gmap', $_REQUEST["homeGmap"]);
}

require_once(GMAP_PKG_PATH.'BitGmap.php' );

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
$smarty->assign( 'formGmapLists',$formGmapLists );

$processForm = set_tab();

if( $processForm ) {
	
	$gmapToggles = array_merge( $formGmapLists );
	foreach( $gmapToggles as $item => $data ) {
		gmap_set_toggle( $item );
	}

}



$gmap = new BitGmap();
$gmaps = $gmap->getList( $_REQUEST );
$smarty->assign_by_ref('gmaps', $gmaps['data']);
?>
