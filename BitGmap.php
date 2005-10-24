<?php
/**
 * @todo wj: How to do the credits up here?
 * @package bitmap
 *
 * @author will <will@wjamesphoto.com>
 *
 * @version v.0
 *
 * Copyright (c) 2005 bitweaver.org, Will James
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 *
 */

/**
 *
 * @package bitmap
 *
 * creation started 2005/10/05
 */
 
/**
 * required setup
 */

require_once( LIBERTY_PKG_PATH.'LibertyAttachable.php' );


/**
* This is used to uniquely identify the object
*/
define( 'BITGMAP_CONTENT_TYPE_GUID', 'bitgmap' );

class BitMap extends LibertyAttachable {
	/**
	* Primary key for our map class
	* @public
	*/
	var $mGmapId;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmap( $pBitmapId=NULL, $pContentId=NULL ) {
		LibertyAttachable::LibertyAttachable();
		$this->mGmapId = $pGmapId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAP_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAP_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAP_CONTENT_TYPE_GUID,
			'content_description' => 'A Wikid GMap Engine',
			'handler_class' => 'BitGMap',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmap.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
	}


	/**
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 * @todo wj: Right now no plan to use this function, as content model of bitweaver does not work for Gmap
	 * @todo wj: It is only here because it is in the sample package
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 *
	 * Load the data from the database
	 * @param pParamHash be sure to pass by reference in case we need to make modifcations to the hash
	**/
	function load() {
		if( !empty( $this->mGmapId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mGmapId )? 'map_id' : 'content_id';
			$lookupId = !empty( $this->mGmapId )? $this->mGmapId : $this->mContentId;

			$query = "SELECT bm.*, FROM `".BIT_DB_PREFIX."bit_gmaps` bm WHERE bm.`$lookupColumn`=?";
			$result = $this->mDb->query( $query, array( $lookupId ) );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mGmapId = $result->fields['map_id'];
				$this->mContentId = $result->fields['content_id'];
				$this->mInfo['display_url'] = $this->getDisplayUrl();
				LibertyAttachable::load();
			}
		}
		return( count( $this->mInfo ) );
	}
 

	
	// Instead of using load() we use get_map()
	function get_map(){
		global $gBitSystem;
		if( !empty( $this->mGmapId ) ) {
			$lookupId = !empty( $this->mGmapId )? $this->mGmapId;
			$this->mMapData = get_map_data($lookupId);
			$mapSets = get_sets_data($lookupId);
			$this->mMapSets = $mapSets;
			$this->mMapStyles = get_styles($mapSets);
			$this->mInfo['display_url'] = $this->getDisplayUrl();
		}
	}
	
	
	
	//* Gets the basic map info.  This can be trimmed to only return the field 'data'	
	function get_map_data($gmap_id) {
		global $gBitSystem;
		if ($gmap_id && is_numeric($gmap_id)) {

			//select map and get list of sets to look up
			$query = "SELECT bm.* 
			FROM ".BIT_DB_PREFIX."bit_gmaps` bm 
			WHERE bm.gmap_id = ?";
  		$result = $this->mDb->query( $query, array((int)$gmap_id));
			
		}
		return $result;
	}	


	// Gets all the sets data associated with a given map_id. Returns a hash of sets							
	// @todo wj: need some sort of check for NULL values in various set types
	function get_sets_data($gmap_id) {
		global $gBitSystem;
		$ret=NULL;
		$rslt=NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
			//get all set ids associated with given $map_id		
			$query = "SELECT bmk.* 
			FROM ".BIT_DB_PREFIX."bit_gmaps_sets_keychain bmk 
			WHERE bm.gmap_id = ?";
  		$result = $this->mDb->query( $query, array((int)$gmap_id));			

			$ret = new Array();			
			while ($res = $result->fetchRow()) {
				$ret[] = $res;
			}

			//Sort out the set data			
			/** 
			 * @todo might be better to first sort $result above 
			 * into different arrays for each type and then 
			 * do a query once for all those set_ids
			 */ 

			$rslt = new Array();
			$rslt['map_types'] = new Array();
			$rslt['init_markers'] = new Array();
			$rslt['init_polylines'] = new Array();
			$rslt['init_polygons'] = new Array();
			$rslt['set_markers'] = new Array();
			$rslt['set_polylines'] = new Array();
			$rslt['set_polygons'] = new Array();
						
      $i = 0;

			//get sets data by set type and put them in seperate arrays      
      foreach ($ret) {
					$set_id = $ret[$i]['set_id'];
					
					if ($ret[$i]['set_type'] == "map_types") {
        			$query = "SELECT bmt.* AS `set_id`
        			FROM ".BIT_DB_PREFIX."bit_gmaps_map_types` bmt 
        			WHERE bmt.maptype_id = ?";
  						$rslt['map_types'][] = $this->mDb->query( $query, array((int)$set_id));			
						}
						
    			if ($ret[$i]['set_type'] == "init_markers") {
        			$query = "SELECT bmm.* 
        			FROM ".BIT_DB_PREFIX."bit_gmaps_marker_sets` bmm 
        			WHERE bmm.set_id = ?";
  						$rslt['init_markers'][] = $this->mDb->query( $query, array((int)$set_id));			
						}

					if ($ret[$i]['set_type'] == "init_polylines") {
        			$query = "SELECT bml.* 
        			FROM ".BIT_DB_PREFIX."bit_gmaps_polyline_sets` bml 
        			WHERE bml.set_id = ?";
  						$rslt['init_polylines'][] = $this->mDb->query( $query, array((int)$set_id));			
						}
													
					if ($ret[$i]['set_type'] == "init_polygons") {
        			$query = "SELECT bmp.* 
        			FROM ".BIT_DB_PREFIX."bit_gmaps_polygon_sets` bmp 
        			WHERE bmp.set_id = ?";
  						$rslt['init_polygons'][] = $this->mDb->query( $query, array((int)$set_id));			
						}

    			if ($ret[$i]['set_type'] == "set_markers") {
        			$query = "SELECT bmm.* 
        			FROM ".BIT_DB_PREFIX."bit_gmaps_marker_sets` bmm 
        			WHERE bmm.set_id = ?";
  						$rslt['set_markers'][] = $this->mDb->query( $query, array((int)$set_id));			
						}

					if ($ret[$i]['set_type'] == "set_polylines") {
        			$query = "SELECT bml.* 
        			FROM ".BIT_DB_PREFIX."bit_gmaps_polyline_sets` bml 
        			WHERE bml.set_id = ?";
  						$rslt['set_polylines'][] = $this->mDb->query( $query, array((int)$set_id));			
						}
													
					if ($ret[$i]['set_type'] == "set_polygons") {
        			$query = "SELECT bmp.* 
        			FROM ".BIT_DB_PREFIX."bit_gmaps_polygon_sets` bmp 
        			WHERE bmp.set_id = ?";
  						$rslt['set_polylgons'] = $this->mDb->query( $query, array((int)$set_id));			
						}						
					$i++;
			}			
		}
		return $rslt;
	}


	
	// elminates duplicate style ids from a given array
	// this is used by function get_styles()
	// sets can share styles, so this makes sure we 
	// get each style, that is used, only once
	// when it is used by multiple sets.
	function merge_style_ids (&$pParamHash) {
 			foreach ($pParamHash) {
      	 $input = new Array;
         $input[] = $pParamHash['style_id'];
    	}	
    	$result = array_unique($input);				    		
			return $result;
	}	
	
	
	// Gets the styles used by sets as fetched by function get_sets_data(). Returns an array
	// @todo wj: need some sort of check for NULL values in various set types
	function get_styles(&$pParamHash){
  		global $gBitSystem;
  		$ret=NULL;
						
    	//get arrays of styles
			$markerStyles = merge_style_ids(array_merge($pParamHash['init_markers'], $pParamHash['set_markers']));
    	$polylineStyles = merge_style_ids(array_merge($pParamHash['init_polylines'], $pParamHash['set_polylines']));
    	$polygonStyles = merge_style_ids(array_merge($pParamHash['init_polygons'], $pParamHash['set_polygons']));
						
			$ret = new Array();
			$ret['marker_styles'] = new Array();
			$ret['polyline_styles'] = new Array();
			$ret['polygon_styles'] = new Array();

			$i = 0;			
			forEach($markerStyles){
					$style_id = $markerStyles[$i];
          $query = "SELECT bms.*
          FROM ".BIT_DB_PREFIX."bit_gmaps_marker_styles` bms 
          WHERE bms.style_id = ?";
      		$ret['marker_styles'][] = $this->mDb->query( $query, array((int)$style_id));
					$i++
			}
			
			$j = 0;
			forEach($polylineStyles){
					$style_id = $polylineStyles[$j];
          $query = "SELECT bls.*
          FROM ".BIT_DB_PREFIX."bit_gmaps_polyline_styles` bls 
          WHERE bls.style_id = ?";
      		$ret['polyline_styles'][] = $this->mDb->query( $query, array((int)$style_id));
					$j++
			}
			
			$k = 0;
			forEach($polygonStyles){
					$style_id = $polygonStyles[$k];
          $query = "SELECT bps.*
          FROM ".BIT_DB_PREFIX."bit_gmaps_polygon_styles` bps 
          WHERE bps.style_id = ?";
      		$ret['polygon_styles'][] = $this->mDb->query( $query, array((int)$style_id));
					$k++
			}

			return ret;
	}
	
	
	
	

	/**
	 * @todo wj: functions to build out as seperate php files
	 *
	 * Save Map
	 *	  - get map by id
	 *		   - save map values and data
	 *			 - get and return map data
	 *			 - update map on client side
	 * Save MapType
	 * Save Marker
	 * Save Polyline
	 * Save Polygone
	 *   - get object by id
   *       - save object values and data
   *       - get object data
   *       - update map object
   *       - update sets data via object id
	 * Get list of maps
	 * Get list of maptypes
	 * Get list of markers
	 * Get list of polylines
	 * Get list of polygons
	 * Get list of markersets
	 * Get list of polylinesets
	 * Get list of polygonsets
	 *
	 */

	


	/**
	* Generates the URL to the sample page
	* @param pExistsHash the hash that was returned by LibertyContent::pageExists
	* @return the link to display the page.
	*/
	function getDisplayUrl() {
		$ret = NULL;
		if( !empty( $this->mBitmapId ) ) {
			$ret = BITMAP_PKG_URL."index.php?map_id=".$this->mBitmapId;
		}
		return $ret;
	}

}
	
?>
