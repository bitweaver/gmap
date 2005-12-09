<?php
/**
 *
 * @package bitmap
 *
 * created 2005/10/07
 */

/**
 * The post values here come directly from the values in formsubmit.js 
 * The function here processes them to update an existing Map.
 *
 * This is part of the AJAX updating set
 * Updates are broken into parts Map, Marker, Icon, Polyline etc.  
 * All the parts are not saved at once.
 * 
 * This script returns valid XML
 *
 * You can test XML results by pointing at http://pathtobw/gmap/store_gmap.php?map_id=1&map_title=map&map_desc=map&map_w=400&map_h=100&map_lat=40&map_lon=70&map_z=3&map_showcont=s&map_showscale=1&map_showtypecont=1&map_type=G_MAP_TYPE
 */

// Initialization
require_once( '../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');


// Now check permissions to access this page
$gBitSystem->verifyPermission('bit_gm_edit_map' );


	//The array of data we feed into the database.  
	//We modify the field names from the Request array
  $mapData = array();	
  $mapData['gmap_id'] = $_REQUEST['map_id'];
  $mapData['title'] = $_REQUEST['map_title'];
  $mapData['description'] = $_REQUEST['map_desc'];
  $mapData['width'] = $_REQUEST['map_w'];
  $mapData['height'] = $_REQUEST['map_h'];
  $mapData['lat'] = $_REQUEST['map_lat'];
  $mapData['lon'] = $_REQUEST['map_lon'];
  $mapData['zoom_level'] = $_REQUEST['map_z'];
  $mapData['show_controls'] = $_REQUEST['map_showcont'];
	$mapData['show_scale'] = $_REQUEST['map_showscale'];
  $mapData['show_typecontrols'] = $_REQUEST['map_showtypecont'];
  $mapData['map_type'] = $_REQUEST['map_type'];
	

	//since we are returning xml we must report so in the header
	//we also need to tell the browser not to cache the page
	//see: http://mapki.com/index.php?title=Dynamic_XML
  // Date in the past
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
  // always modified
  header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
  // HTTP/1.1
  header("Cache-Control: no-store, no-cache, must-revalidate");
  header("Cache-Control: post-check=0, pre-check=0", false);
  // HTTP/1.0
  header("Pragma: no-cache");
  //XML Header
  header("content-type:text/xml");
		
		
	$xml = new BitGmap();
  $xml->storeMapData($mapData);
	print_r($xml->mRet);
		 			
?>
