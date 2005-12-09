<?php
/**
 *
 * @package bitmap
 *
 * created 2005/11/30
 */

/**
 * The post values here come directly from the values in formsubmit.js 
 * The function here processes them to update an existing Marker.
 *
 * This is part of the AJAX updating set
 * Updates are broken into parts Map, Marker, Icon, Polyline etc.  
 * All the parts are not saved at once.
 * 
 * This script returns valid XML
 *
 */

// Initialization
require_once( '../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');


// Now check permissions to access this page
$gBitSystem->verifyPermission('bit_gm_edit_marker' );


	//The array of data we feed into the database.  
	//We modify the field names from the Request array
  $markerData = array();	
  $markerData['marker_id'] = $_REQUEST['marker_id'];
  $markerData['name'] = $_REQUEST['marker_name'];
  $markerData['lat'] = $_REQUEST['marker_lat'];
  $markerData['lon'] = $_REQUEST['marker_lon'];
  $markerData['window_data'] = $_REQUEST['marker_wintext'];
  $markerData['label_data'] = $_REQUEST['marker_labeltext'];
  $markerData['zindex'] = $_REQUEST['marker_zi'];
	
	
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
  $xml->storeMarkerData($markerData);
	print_r($xml->mRet);
		 			
?>
