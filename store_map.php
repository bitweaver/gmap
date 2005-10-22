<?php
/**
 *
 * @package bitmap
 *
 * created 2005/10/07
 */

/**
 * The post values here come directly from the values in js_formsubmit.tpl 
 * The function here processes them to update an existing Map.
 *
 * This is part of the AJAX updating set
 * Updates are broken into parts Map, Marker, Icon, Polyline etc.  
 * All the parts are not saved at once.
 * 
 * This script returns valid XML
 */

/**
 	 Map Update Requests Contain the following Post Values:
	 ---------------------------------------------- 
	 		$_REQUEST['map_id'] 
	 		$_REQUEST['map_title']
	 		$_REQUEST['map_desc']
	 		$_REQUEST['map_comm']
	 		$_REQUEST['map_w']
	 		$_REQUEST['map_h']
	 		$_REQUEST['map_lat']
	 		$_REQUEST['map_lon']
	 		$_REQUEST['map_z'] //zoom level
	 		$_REQUEST['map_showcont']
	 		$_REQUEST['map_showscale']
	 		$_REQUEST['map_showtype']
 	 		$_REQUEST['map_type']
 */

			
// @todo wj:how to check for user id and permissions?


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

			
	function store_map( &$pParamHash ) {
			$table = BIT_DB_PREFIX."bit_gmaps";
			$this->mDb->StartTrans();
			$locId = array( "name" => 'gmap_id'], "value" => $pParamHash['gmap_id'] );
			$result = $this->mDb->associateUpdate( $table, $pParamHash, $locId );			
			$this->mDb->CompleteTrans();			
						
			//After update, query the database for row and return as valid XML.
			$query = "SELECT bm.*, FROM `".BIT_DB_PREFIX."bit_gmaps` bm WHERE bm.gmap_id=?";
			$result = $this->mDb->query( $query, array( $pParamHash['gmap_id'] ) );
			
			$xml = "<map>"
					 	 ."<title>".$result->fields['title']."</title> 
						 ."<desc>".$result->fields['description']."</desc>"
						 ."<w>".$result->fields['width']."</w>"
						 ."<h>".$result->fields['height']."</h>"
						 ."<lat>".$result->fields['location_lat']."</lat>"
						 ."<lon>".$result->fields['location_lon']."</lon>"
						 ."<z>".$result->fields['zoom_level']."</z>"
						 ."<maptype>".$result->fields['map_type']."</maptype>"
						 ."<cont>".$result->fields['show_controls']."</cont>"
						 ."<scale>".$result->fields['show_scale']."</scale>"
						 ."<typecon>".$result->fields['show_typecontrols']."</typecon>"
						 ."</map>"
			
			echo $xml;
	}		

	
	//The array of data we feed into the database.  
	//We modify the field names from the Request array
  $mapData = new Array();	
  $mapData['gmap_id'] = $_REQUEST['map_id'];
  $mapData['title'] = $_REQUEST['map_title'];
  $mapData['description'] = $_REQUEST['map_desc'];
  $mapData['width'] = $_REQUEST['map_w'];
  $mapData['height'] = $_REQUEST['map_h'];
  $mapData['location_lat'] = $_REQUEST['map_lat'];
  $mapData['location_lon'] = $_REQUEST['map_lon'];
  $mapData['zoom_level'] = $_REQUEST['map_z'];
  $mapData['map_type'] = $_REQUEST['map_type'];
  $mapData['show_controls'] = $_REQUEST['map_showcont'];
  $mapData['show_scale'] = $_REQUEST['map_showscale'];
  $mapData['show_typecontrols'] = $_REQUEST['map_showtype'];
  //@todo need script to generate js to cache in data
  // $mapData['data']  = ; 

	
  store_map($mapData);
		 			
?>
