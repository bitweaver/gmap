<?php
/**
 * @todo wj: How to do the credits up here?
 * @package gmap
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
 * @package gmap
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


// this is the class that contains all the functions for the package
class BitGmap extends LibertyAttachable {
	/**
	* Primary key for our map class
	* @public
	*/
	var $mGmapId;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmap( $pGmapId=NULL, $pContentId=NULL ) {
		parent::LibertyAttachable();
		$this->mGmapId = $pGmapId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAP_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAP_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAP_CONTENT_TYPE_GUID,
			'content_description' => 'Google Map',
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
	function load( $pFullLoad = TRUE ) {
		if( !empty( $this->mGmapId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mGmapId )? 'gmap_id' : 'content_id';
			$lookupId = !empty( $this->mGmapId )? $this->mGmapId : $this->mContentId;

			$query = "SELECT *
					  FROM `".BIT_DB_PREFIX."gmaps` bm INNER JOIN `".BIT_DB_PREFIX."tiki_content` tc ON( bm.`content_id`=tc.`content_id` )
					  WHERE bm.`$lookupColumn`=?";
			$result = $this->mDb->query( $query, array( $lookupId ) );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mGmapId = $result->fields['gmap_id'];
				$this->mContentId = $result->fields['content_id'];
				$this->mInfo['display_url'] = $this->getDisplayUrl();
				parent::load();

				if( $pFullLoad ) {
					$this->mMapTypes = $this->getMapTypes($lookupId);

					$this->mMapMarkers = $this->getMarkers($lookupId);
					$this->mMapMarkerSets = $this->getMarkerSetsDetails($lookupId);
					$this->mMapMarkerStyles = $this->getMarkerStyles($lookupId);
					$this->mMapIconStyles = $this->getIconStyles($lookupId);

					$this->mMapPolylines = $this->getPolylines($lookupId);
					$this->mMapPolylineSets = $this->getPolylineSetsDetails($lookupId);
					$this->mMapPolylineStyles = $this->getPolylineStyles($lookupId);

					$this->mMapInitPolygons = $this->getPolygons($lookupId, "init_polygons");
					$this->mMapSetPolygons = $this->getPolygons($lookupId, "set_polygons");
					$this->mMapPolygonsSetDetails = $this->getPolygonSetsDetails($lookupId);
					$this->mMapPolygonsStyles = $this->getPolygonStyles($lookupId);
				}
			}
		}
		return( count( $this->mInfo ) );
	}



	//* Gets the basic map info.
	function getMapData($gmap_id) {
		global $gBitSystem;
		if ($gmap_id && is_numeric($gmap_id)) {
			//select map and get list of sets to look up
			$query = "SELECT bm.*
					  FROM `".BIT_DB_PREFIX."gmaps` bm
					  WHERE bm.gmap_id = ?";
	  		$result = $this->mDb->query( $query, array((int)$gmap_id));
		}
		return $result;
	}




	//get all mapTypes data associated with a given $gmap_id
	function getMapTypes($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

			$bindVars = array((int)$gmap_id, "map_types");
			$query = "SELECT bmt.*
          			FROM `".BIT_DB_PREFIX."gmaps_map_types` bmt, `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk
          			WHERE bmt.`maptype_id` = bmk.`set_id` AND bmk.`gmap_id` = ? AND bmk.`set_type` = ?";

  		$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		}
		return $ret;
	}



	//* Gets data for a given polyline.
	// @ todo this should probably take an array so that we can get data for a bunch of markers if we want
	function getMapTypeData($maptype_id) {
		global $gBitSystem;
		if ($maptype_id && is_numeric($maptype_id)) {
			$query = "SELECT bmt.*
			FROM `".BIT_DB_PREFIX."gmaps_map_types` bmt
			WHERE bmt.maptype_id = ?";
  		$result = $this->mDb->query( $query, array((int)$maptype_id));
		}
		return $result;
	}
	
	
	
	
	//returns array of marker data and associated style and icon style ids for given gmap_id and set_type
	function getMarkers($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

		 	$bindVars = array((int)$gmap_id);
			$query = "SELECT bmm.*, tc.*, bms.*, bsk.*
                FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk, `".BIT_DB_PREFIX."gmaps_marker_keychain` bmk, `".BIT_DB_PREFIX."gmaps_markers` bmm, `".BIT_DB_PREFIX."gmaps_marker_sets` bms
					INNER JOIN `".BIT_DB_PREFIX."tiki_content` tc ON( bmm.`content_id`=tc.`content_id` )
                WHERE bsk.`gmap_id` = ?
                AND bsk.`set_type` = 'markers'
                AND bms.`set_id` = bsk.`set_id`
                AND bmk.`set_id` = bms.`set_id`
                AND bmm.`marker_id` = bmk.`marker_id`";
								
			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$res['parsed_data'] = $this->parseData( $res['data'], $this->mInfo['format_guid'] );
				$res['parsed_data'] = addslashes($res['parsed_data']);
				$res['data'] = addslashes($res['data']);
				$res['data'] = str_replace("\n", "\\n", $res['data']);
				$ret[] = $res;
			};
		};
		return $ret;
	}



	//* Gets data for a given marker.
	// @ todo this should probably take an array so that we can get data for a bunch of markers if we want
	function getMarkerData($marker_id) {
		global $gBitSystem;
		if ($marker_id && is_numeric($marker_id)) {

			//select map and get list of sets to look up
			$query = "SELECT bm.*
			FROM `".BIT_DB_PREFIX."gmaps_markers` bm
			WHERE bm.marker_id = ?";
  		$result = $this->mDb->query( $query, array((int)$marker_id));

		}
		return $result;
	}



	//get all marker styles for a given gmap_id
	function getMarkerStyles($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
			$query = "SELECT DISTINCT bs.*
                FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."gmaps_marker_sets` bms, `".BIT_DB_PREFIX."gmaps_marker_styles` bs
                WHERE bmk.`gmap_id` = ?
                AND bmk.`set_type` = 'markers'
                AND bms.`set_id` = bmk.`set_id` AND bs.`style_id` = bms.`style_id`";

			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}


	//* Gets data for a given marker style.
	// @ todo this should probably take an array so that we can get data for a bunch of styles if we want
	function getMarkerStyleData($style_id) {
		global $gBitSystem;
		if ($style_id && is_numeric($style_id)) {
			$query = "SELECT bs.*
			FROM `".BIT_DB_PREFIX."gmaps_marker_styles` bs
			WHERE bs.style_id = ?";
  		$result = $this->mDb->query( $query, array((int)$style_id));

		}
		return $result;
	}
	
		

	//get all icon styles for a given gmap_id
	function getIconStyles($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
			$query = "SELECT DISTINCT bis.*
					FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."gmaps_marker_sets` bms, `".BIT_DB_PREFIX."gmaps_icon_styles` bis
					WHERE bmk.`gmap_id` = ?
					AND bmk.`set_type` = 'markers'
					AND bms.`set_id` = bmk.`set_id` AND bis.`icon_id` = bms.`icon_id`";

			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}




	//* Gets data for a given icon style.
	// @ todo this should probably take an array so that we can get data for a bunch of styles if we want
	function getIconStyleData($style_id) {
		global $gBitSystem;
		if ($style_id && is_numeric($style_id)) {
			$query = "SELECT bs.*
			FROM `".BIT_DB_PREFIX."gmaps_icon_styles` bs
			WHERE bs.icon_id = ?";
  		$result = $this->mDb->query( $query, array((int)$style_id));

		}
		return $result;
	}
	


	//* Gets data for a given marker set.
	// @ todo this should probably take an array so that we can get data for a bunch of sets if we want
	function getMarkerSetData($set_id) {
		global $gBitSystem;
		if ($set_id && is_numeric($set_id)) {
			$query = "SELECT bs.*, bsk.*
			FROM `".BIT_DB_PREFIX."gmaps_marker_sets` bs
			INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk ON ( bsk.`set_id` = bs.`set_id` )
			WHERE bs.`set_id` = ?
			AND bsk.`set_type` = 'markers'";
  		$result = $this->mDb->query( $query, array((int)$set_id));
		}
		return $result;
	}

	
	
	//get all polyline data for given gmap_id and set_type
	function getPolylines($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

		 	$bindVars = array((int)$gmap_id);
			$query = "SELECT bmp.*, bps.*, bsk.*
		 				 	  FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk, `".BIT_DB_PREFIX."gmaps_polyline_keychain` bpk, `".BIT_DB_PREFIX."gmaps_polylines` bmp, `".BIT_DB_PREFIX."gmaps_polyline_sets` bps
								WHERE bsk.`gmap_id` = ?
								AND bsk.`set_type` = 'polylines'
								AND bps.`set_id` = bsk.`set_id`
								AND bpk.`set_id` = bps.`set_id`
								AND bmp.`polyline_id` = bpk.`polyline_id`";

			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



	//* Gets data for a given polyline.
	// @ todo this should probably take an array so that we can get data for a bunch of markers if we want
	function getPolylineData($polyline_id) {
		global $gBitSystem;
		if ($polyline_id && is_numeric($polyline_id)) {
			$query = "SELECT bm.*
			FROM `".BIT_DB_PREFIX."gmaps_polylines` bm
			WHERE bm.polyline_id = ?";
  		$result = $this->mDb->query( $query, array((int)$polyline_id));

		}
		return $result;
	}

	
	

	//get all polylines for given gmap_id and set_types
	function getPolylineStyles($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
		 	$bindVars = array((int)$gmap_id, $gmap_id);
			$query = "SELECT DISTINCT bs.*
                  FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk
                         INNER JOIN `".BIT_DB_PREFIX."gmaps_polygon_sets` bgs on bmk.`set_id`  = bgs.`set_id`
                         INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_styles` bs on bs.`style_id` = bgs.`polylinestyle_id`
                  WHERE bmk.`gmap_id` = ?
                  AND bmk.`set_type` IN ('init_polygons', 'set_polygons' )
                  UNION SELECT DISTINCT bs.*
                  FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk
                         INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_sets` bps on bmk.`set_id`  = bps.`set_id`
                         INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_styles` bs on bs.`style_id` = bps.`style_id`
                  WHERE bmk.`gmap_id` = ?
                  AND bmk.`set_type` = 'polylines'";

			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}


	
	
	//* Gets data for a given polyline style.
	// @ todo this should probably take an array so that we can get data for a bunch of styles if we want
	function getPolylineStyleData($style_id) {
		global $gBitSystem;
		if ($style_id && is_numeric($style_id)) {
			$query = "SELECT bs.*
			FROM `".BIT_DB_PREFIX."gmaps_polyline_styles` bs
			WHERE bs.`style_id` = ?";
  		$result = $this->mDb->query( $query, array((int)$style_id));

		}
		return $result;
	}



	
	//* Gets data for a given polyline set.
	// @ todo this should probably take an array so that we can get data for a bunch of sets if we want
	function getPolylineSetData($set_id) {
		global $gBitSystem;
		if ($set_id && is_numeric($set_id)) {
			$query = "SELECT bs.*, bsk.*
			FROM `".BIT_DB_PREFIX."gmaps_polyline_sets` bs
			INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk ON ( bsk.`set_id` = bs.`set_id` )
			WHERE bs.`set_id` = ?
			AND bsk.`set_type` = 'polylines'";
  		$result = $this->mDb->query( $query, array((int)$set_id));
		}
		return $result;
	}



	

	//get all polygon data for given gmap_id and set_type
	function getPolygons($gmap_id, $settype) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

		 	$bindVars = array((int)$gmap_id, $settype);
			$query = "SELECT bmp.*, bps.set_id, bps.style_id, bps.polylinestyle_id
		 				 	  FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk, `".BIT_DB_PREFIX."gmaps_polygon_keychain` bpk, `".BIT_DB_PREFIX."gmaps_polygons` bmp, `".BIT_DB_PREFIX."gmaps_polygon_sets` bps
								WHERE bsk.`gmap_id` = ?
								AND bsk.`set_type` = ?
								AND bps.`set_id` = bsk.`set_id`
								AND bpk.`set_id` = bps.`set_id`
								AND bmp.`polygon_id` = bpk.`polygon_id`";

			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



	//* Gets data for a given polyline.
	// @ todo this should probably take an array so that we can get data for a bunch of markers if we want
	function getPolygonData($polygon_id) {
		global $gBitSystem;
		if ($polygon_id && is_numeric($polygon_id)) {
			$query = "SELECT bm.*
			FROM `".BIT_DB_PREFIX."gmaps_polygons` bm
			WHERE bm.polygon_id = ?";
  		$result = $this->mDb->query( $query, array((int)$polygon_id));
		}
		return $result;
	}




	//get all polylines for given gmap_id and set_types
	function getPolygonStyles($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
			$query = "SELECT DISTINCT bs.*
						 	  FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."gmaps_polygon_sets` bps, `".BIT_DB_PREFIX."gmaps_polygon_styles` bs
								WHERE bmk.`gmap_id` = ?
								AND bmk.`set_type` = 'init_polygons'
								AND bps.`set_id` = bmk.`set_id` AND bs.`style_id` = bps.`style_id`
								OR bmk.`set_type` = 'set_polygons'
								AND bps.`set_id` = bmk.`set_id` AND bs.`style_id` = bps.`style_id`";

			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



	//* Gets data for a given polygon style.
	// @ todo this should probably take an array so that we can get data for a bunch of styles if we want
	function getPolygonStyleData($style_id) {
		global $gBitSystem;
		if ($style_id && is_numeric($style_id)) {
			$query = "SELECT bs.*
			FROM `".BIT_DB_PREFIX."gmaps_polygon_styles` bs
			WHERE bs.style_id = ?";
  		$result = $this->mDb->query( $query, array((int)$style_id));
		}
		return $result;
	}


	
	//* Gets data for a given polygon set.
	// @ todo this should probably take an array so that we can get data for a bunch of sets if we want
	function getPolygonSetData($set_id) {
		global $gBitSystem;
		if ($set_id && is_numeric($set_id)) {
			$query = "SELECT bs.*
			FROM `".BIT_DB_PREFIX."gmaps_polygon_sets` bs
			WHERE bs.set_id = ?";
  		$result = $this->mDb->query( $query, array((int)$set_id));
		}
		return $result;
	}


	
	function getMarkerSetsDetails($gmap_id) {
  		global $gBitSystem;
  		$ret = NULL;
  		if ($gmap_id && is_numeric($gmap_id)) {
      	$query = "SELECT DISTINCT bms.*, bmk.*
                FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk
					INNER JOIN `".BIT_DB_PREFIX."gmaps_marker_sets` bms ON (bmk.`set_id` = bms.`set_id`)
                WHERE bmk.`gmap_id` = ?
                AND bmk.`set_type` = 'markers'
                ORDER BY bms.`set_id` ASC";
							
			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



	function getPolylineSetsDetails($gmap_id) {
  		global $gBitSystem;
  		$ret = NULL;
  		if ($gmap_id && is_numeric($gmap_id)) {
      	$query = "SELECT DISTINCT bms.*, bmk.*
                FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk
					INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_sets` bms ON (bmk.`set_id` = bms.`set_id`)
                WHERE bmk.`gmap_id` = ?
                AND bmk.`set_type` = 'polylines'
                ORDER BY bms.`set_id` ASC";
							
			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



	function getPolygonSetsDetails($gmap_id) {
  		global $gBitSystem;
  		$ret = NULL;
  		if ($gmap_id && is_numeric($gmap_id)) {
      $query = "SELECT DISTINCT bms.*, bmk.`set_type`
                FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."gmaps_polygon_sets` bms
                WHERE bmk.`gmap_id` = ?
                AND bmk.`set_id` = bms.`set_id` 
                AND ( bmk.`set_type` = 'set_polygons' OR bmk.`set_type` = 'init_polygons')
                ORDER BY bms.`set_id` ASC";
							
			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}

	
	
	
//GENERAL LOOKUP FUNCTIONS

	//get all mapTypes data in database
	function getAllMapTypes() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bmt.* FROM `".BIT_DB_PREFIX."gmaps_map_types` bmt";
		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



	//returns array of all markers and associated set info
	//@todo this needs to be reworked as it does not get associated marker data from the content table
	//@tod0 should also be moved into the marker class
	function getAllMarkerSets() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bms.*, bsk.`set_type`, bsk.`gmap_id`, bmm.*
    			 	 	FROM `".BIT_DB_PREFIX."gmaps_marker_keychain` bmk
							INNER JOIN `".BIT_DB_PREFIX."gmaps_marker_sets` bms ON ( bmk.`set_id` = bms.`set_id` )
              INNER JOIN `".BIT_DB_PREFIX."gmaps_markers` bmm ON ( bmm.`marker_id` = bmk.`marker_id` )
              LEFT OUTER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk
							ON ( bsk.`set_id` = bms.`set_id`
							AND bsk.`set_type` = 'markers')
              ORDER BY bms.`set_id` ASC, bmm.`marker_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



	//returns array of all markers
	//@todo this needs to be reworked as it does not get associated marker data from the content table
	//@tod0 should also be moved into the marker class
	function getAllMarkers() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bmk.`set_id`, bmm.*
					 	  FROM `".BIT_DB_PREFIX."gmaps_marker_keychain` bmk, `".BIT_DB_PREFIX."gmaps_markers` bmm
          		WHERE bmm.`marker_id` = bmk.`marker_id`
          		ORDER BY bmm.`marker_id` ASC, bmk.`set_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



	//returns array of polyline sets
	function getAllPolylineSets() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bms.*, bsk.`set_type`, bsk.`gmap_id`, bmm.*
    			 	 	FROM `".BIT_DB_PREFIX."gmaps_polyline_keychain` bmk
							INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_sets` bms ON ( bmk.`set_id` = bms.`set_id` )
              INNER JOIN `".BIT_DB_PREFIX."gmaps_polylines` bmm ON ( bmm.`polyline_id` = bmk.`polyline_id` )
              LEFT OUTER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk
							ON ( bsk.`set_id` = bms.`set_id`
							AND bsk.`set_type` = 'polylines')
              ORDER BY bms.`set_id` ASC, bmm.`polyline_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}


	//@todo this probably should return results for polygons also
	//returns array of polylines
	function getAllPolylines() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bmk.`set_id`, bmm.*
					 	  FROM `".BIT_DB_PREFIX."gmaps_polyline_keychain` bmk, `".BIT_DB_PREFIX."gmaps_polylines` bmm
          		WHERE bmm.`polyline_id` = bmk.`polyline_id`
          		ORDER BY bmm.`polyline_id` ASC, bmk.`set_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



	//returns array of polygon sets
	function getAllPolygonSets() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bms.*, bsk.`set_type`, bsk.`gmap_id`, bmm.*
    			 	 	FROM `".BIT_DB_PREFIX."gmaps_polygon_keychain` bmk
							INNER JOIN `".BIT_DB_PREFIX."gmaps_polygon_sets` bms ON ( bmk.`set_id` = bms.`set_id` )
              INNER JOIN `".BIT_DB_PREFIX."gmaps_polygons` bmm ON ( bmm.`polygon_id` = bmk.`polygon_id` )
              LEFT OUTER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` bsk
							ON ( bsk.`set_id` = bms.`set_id`
							AND ( bsk.`set_type` = 'set_polygons' OR bsk.`set_type` = 'init_polygons'))
              ORDER BY bms.`set_id` ASC, bmm.`polygon_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}


	//@todo this probably should return results for polygons also
	//returns array of polygons
	function getAllPolygons() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bmk.`set_id`, bmm.*
					 	  FROM `".BIT_DB_PREFIX."gmaps_polygon_keychain` bmk, `".BIT_DB_PREFIX."gmaps_polygons` bmm
          		WHERE bmm.`polygon_id` = bmk.`polygon_id`
          		ORDER BY bmm.`polygon_id` ASC, bmk.`set_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



// ALL LIST FUNCTIONS	
	
	/**
	* This function generates a list of records from the tiki_content database for use in a list page
	**/
	function getList( &$pParamHash ) {
		LibertyContent::prepGetList( $pParamHash );

		$find = $pParamHash['find'];
		$sort_mode = $pParamHash['sort_mode'];
		$max_records = $pParamHash['max_records'];
		$offset = $pParamHash['offset'];

		if( is_array( $find ) ) {
			// you can use an array of pages
			$mid = " WHERE tc.`title` IN( ".implode( ',',array_fill( 0,count( $find ),'?' ) )." )";
			$bindvars = $find;
		} else if( is_string( $find ) ) {
			// or a string
			$mid = " WHERE UPPER( tc.`title` )like ? ";
			$bindvars = array( '%' . strtoupper( $find ). '%' );
		} else if( !empty( $pUserId ) ) {
			// or a string
			$mid = " WHERE tc.`creator_user_id` = ? ";
			$bindvars = array( $pUserId );
		} else {
			$mid = "";
			$bindvars = array();
		}

		$query = "SELECT bm.*, tc.`content_id`, tc.`title`, tc.`data`
			FROM `".BIT_DB_PREFIX."gmaps` bm INNER JOIN `".BIT_DB_PREFIX."tiki_content` tc ON( tc.`content_id` = bm.`content_id` )
			".( !empty( $mid )? $mid.' AND ' : ' WHERE ' )." tc.`content_type_guid` = '".BITGMAP_CONTENT_TYPE_GUID."'
			ORDER BY ".$this->mDb->convert_sortmode( $sort_mode );
		$query_cant = "select count( * )from `".BIT_DB_PREFIX."tiki_content` tc ".( !empty( $mid )? $mid.' AND ' : ' WHERE ' )." tc.`content_type_guid` = '".BITGMAP_CONTENT_TYPE_GUID."'";
		$result = $this->mDb->query( $query,$bindvars,$max_records,$offset );
		$ret = array();
		while( $res = $result->fetchRow() ) {
			$ret[] = $res;
		}
		$pParamHash["data"] = $ret;

		$pParamHash["cant"] = $this->mDb->getOne( $query_cant,$bindvars );

		LibertyContent::postGetList( $pParamHash );
		return $pParamHash;
	}
	

	
	
//ALL STORE FUNCTIONS

	function verify( &$pParamHash ) {

		$pParamHash['gmap_store'] = array();

		if( !empty( $pParamHash['map_desc'] ) ) {
			$pParamHash['gmap_store']['description'] = $pParamHash['map_desc'];
		}
		
		if( ( !empty( $pParamHash['map_w'] ) && is_numeric( $pParamHash['map_w'] ) ) || $pParamHash['map_w'] == 0 ) {
			$pParamHash['gmap_store']['width'] = $pParamHash['map_w'];
		}

		if( !empty( $pParamHash['map_h'] ) && is_numeric( $pParamHash['map_h'] ) ) {
			$pParamHash['gmap_store']['height'] = $pParamHash['map_h'];
		}

		if( !empty( $pParamHash['map_lat'] ) && is_numeric( $pParamHash['map_lat'] ) ) {
			$pParamHash['gmap_store']['lat'] = $pParamHash['map_lat'];
		} else {
			$this->mError['map_lat'] = tra( 'You must enter a latitude.' );
		}

		if( !empty( $pParamHash['map_lon'] ) && is_numeric( $pParamHash['map_lon'] ) ) {
			$pParamHash['gmap_store']['lon'] = $pParamHash['map_lon'];
		} else {
			$this->mError['map_lat'] = tra( 'You must enter a longitude.' );
		}

		if( !empty( $pParamHash['map_z'] ) && is_numeric( $pParamHash['map_z'] ) ) {
			$pParamHash['gmap_store']['zoom_level'] = $pParamHash['map_z'];
		}

		if( !empty( $pParamHash['map_showcont'] ) ) {
			$pParamHash['gmap_store']['show_controls'] = $pParamHash['map_showcont'];
		}
		if( !empty( $pParamHash['map_showscale'] ) ) {
			$pParamHash['gmap_store']['show_scale'] = $pParamHash['map_showscale'] ;
		}
		if( !empty( $pParamHash['map_showtypecont'] ) ) {
			$pParamHash['gmap_store']['show_typecontrols'] = $pParamHash['map_showtypecont'];
		}
		if( !empty( $pParamHash['map_type'] ) ) {
			$pParamHash['gmap_store']['map_type'] = $pParamHash['map_type'];
		}
		if( !empty( $pParamHash['map_comm'] ) ) {
			$pParamHash['gmap_store']['allow_comments'] = 'TRUE';
		}
		return( count( $this->mErrors ) == 0 );
	}

	function store( &$pParamHash ) {
		if( $this->verify( $pParamHash ) ) {
			$this->mDb->StartTrans();
			if( parent::store( $pParamHash ) ) {
				if( $this->mGmapId ) {
					// store the posted changes
					$this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps", $pParamHash['gmap_store'], array( "name" => "gmap_id", "value" => $pParamHash['gmap_id'] ) );
				} else {
					$pParamHash['gmap_store']['content_id'] = $this->mContentId;
					$this->mDb->associateInsert( BIT_DB_PREFIX."gmaps", $pParamHash['gmap_store'] );
				}
				$this->mDb->CompleteTrans();

				// re-query to confirm results
				$result = $this->load( FALSE );

			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return( count( $this->mInfo ) );
	}



	
	
	function verifyMapType( &$pParamHash ) {

		$pParamHash['maptype_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['maptype_store']['name'] = $pParamHash['name'];
		}

		if( !empty( $pParamHash['description'] ) ) {
			$pParamHash['maptype_store']['description'] = $pParamHash['description'];
		}

		if( !empty( $pParamHash['copyright'] ) ) {
			$pParamHash['maptype_store']['copyright'] = $pParamHash['copyright'];
		}

		if( ( !empty( $pParamHash['basetype'] ) && is_numeric( $pParamHash['basetype'] ) ) || $pParamHash['basetype'] == 0 ) {
			$pParamHash['maptype_store']['basetype'] = $pParamHash['basetype'];
		}
		
		if( ( !empty( $pParamHash['alttype'] ) && is_numeric( $pParamHash['alttype'] ) ) || $pParamHash['alttype'] == 0 ) {
			$pParamHash['maptype_store']['alttype'] = $pParamHash['alttype'];
		}

		if( ( !empty( $pParamHash['bounds'] ) && is_numeric( $pParamHash['bounds'] ) ) || $pParamHash['bounds'] == 0 ) {
			$pParamHash['maptype_store']['bounds'] = $pParamHash['bounds'];
		}

		if( ( !empty( $pParamHash['maxzoom'] ) && is_numeric( $pParamHash['maxzoom'] ) ) || $pParamHash['maxzoom'] == 0 ) {
			$pParamHash['maptype_store']['maxzoom'] = $pParamHash['maxzoom'];
		}

		if( !empty( $pParamHash['maptiles_url'] ) ) {
			$pParamHash['maptype_store']['maptiles_url'] = $pParamHash['maptiles_url'];
		}
		
		if( !empty( $pParamHash['lowtiles_url'] ) ) {
			$pParamHash['maptype_store']['lowresmaptiles_url'] = $pParamHash['lowtiles_url'];
		}

		if( !empty( $pParamHash['hybridtiles_url'] ) ) {
			$pParamHash['maptype_store']['hybridtiles_url'] = $pParamHash['hybridtiles_url'];
		}

		if( !empty( $pParamHash['lowhybridtiles_url'] ) ) {
			$pParamHash['maptype_store']['lowreshybridtiles_url'] = $pParamHash['lowhybridtiles_url'];
		}

		// set values for updating the marker keychain
		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['keychain_store']['gmap_id'] = $pParamHash['gmap_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
	}
	
	function storeMapType( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyMapType( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['maptype_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_map_types", $pParamHash['maptype_store'], array( "name" => "maptype_id", "value" => $pParamHash['maptype_id'] ) );
			}else{
				 $pParamHash['maptype_id'] = $this->mDb->GenID( 'gmaps_map_types_maptype_id_seq' );
				 $pParamHash['maptype_store']['maptype_id'] = $pParamHash['maptype_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_map_types", $pParamHash['maptype_store'] );
				 // if its a new markerset we also get a set_id for the keychain and automaticallly associate it with a map.
				 $pParamHash['keychain_store']['set_id'] = $pParamHash['maptype_store']['maptype_id'];
				 $pParamHash['keychain_store']['set_type'] = "map_types";
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_store'] );				 
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getMapTypeData($pParamHash['maptype_id']);
		}
		return $result;
	}
	
	
	
	
	//Storage of Markers is handled by the marker class in BitGmapMarker.php
	

	
	
	
	function verifyPolyline( &$pParamHash ) {

		$pParamHash['polyline_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polyline_store']['name'] = $pParamHash['name'];
		}

		if( !empty( $pParamHash['points_data'] ) ) {
			$pParamHash['polyline_store']['points_data'] = $pParamHash['points_data'];
		}

		if( !empty( $pParamHash['border_text'] ) ) {
			$pParamHash['polyline_store']['border_text'] = $pParamHash['border_text'];
		}

		if( ( !empty( $pParamHash['zindex'] ) && is_numeric( $pParamHash['line_z'] ) ) || $pParamHash['zindex'] == 0 ) {
			$pParamHash['polyline_store']['zindex'] = $pParamHash['zindex'];
		}

		// set values for updating the marker keychain
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
	}
	
	function  storePolyline( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolyline( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['polyline_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polylines", $pParamHash['polyline_store'], array( "name" => "polyline_id", "value" => $pParamHash['polyline_id'] ) );
			}else{
				 $pParamHash['polyline_id'] = $this->mDb->GenID( 'gmaps_polylines_polyline_id_seq' );
				 $pParamHash['polyline_store']['polyline_id'] = $pParamHash['polyline_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polylines", $pParamHash['polyline_store'] );
				 // if its a new polyline we also get a set_id for the keychain and automaticallly associate it with a polyline set.
				 $pParamHash['keychain_store']['polyline_id'] = $pParamHash['polyline_store']['polyline_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polyline_keychain", $pParamHash['keychain_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolylineData($pParamHash['polyline_id']);
		}
		return $result;
	}
	




	function verifyPolygon( &$pParamHash ) {

		$pParamHash['polygon_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polygon_store']['name'] = $pParamHash['name'];
		}

		if( !empty( $pParamHash['circle'] ) ) {
			$pParamHash['polygon_store']['circle'] = $pParamHash['circle'];
		}

		if( !empty( $pParamHash['points_data'] ) || $pParamHash['points_data'] == 0 ) {
			$pParamHash['polygon_store']['points_data'] = $pParamHash['points_data'];
		}

		if( !empty( $pParamHash['circle_center'] ) || $pParamHash['circle_center'] == 0 ) {
			$pParamHash['polygon_store']['circle_center'] = $pParamHash['circle_center'];
		}

		if( !empty( $pParamHash['radius'] ) || $pParamHash['radius'] == 0 ) {
			$pParamHash['polygon_store']['radius'] = $pParamHash['radius'];
		}

		if( !empty( $pParamHash['border_text'] ) ) {
			$pParamHash['polygon_store']['border_text'] = $pParamHash['border_text'];
		}

		if( ( !empty( $pParamHash['zindex'] ) && is_numeric( $pParamHash['line_z'] ) ) || $pParamHash['zindex'] == 0 ) {
			$pParamHash['polygon_store']['zindex'] = $pParamHash['zindex'];
		}

		// set values for updating the polygon keychain
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
	}
	
	function  storePolygon( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolygon( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['polygon_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polygons", $pParamHash['polygon_store'], array( "name" => "polygon_id", "value" => $pParamHash['polygon_id'] ) );
			}else{
				 $pParamHash['polygon_id'] = $this->mDb->GenID( 'gmaps_polygons_polygon_id_seq' );
				 $pParamHash['polygon_store']['polygon_id'] = $pParamHash['polygon_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polygons", $pParamHash['polygon_store'] );
				 // if its a new polygon we also get a set_id for the keychain and automaticallly associate it with a polygon set.
				 $pParamHash['keychain_store']['polygon_id'] = $pParamHash['polygon_store']['polygon_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polygon_keychain", $pParamHash['keychain_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolygonData($pParamHash['polygon_id']);
		}
		return $result;
	}




	function verifyMarkerSet( &$pParamHash ) {

		$pParamHash['markerset_store'] = array();
		$pParamHash['keychain_store'] = array();
		$pParamHash['keychain_update'] = array();
		$pParamHash['keychain_ids'] = array();
		
		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['markerset_store']['name'] = $pParamHash['name'];
		}

		if( !empty( $pParamHash['description'] ) ) {
			$pParamHash['markerset_store']['description'] = $pParamHash['description'];
		}
		
		if( ( !empty( $pParamHash['style_id'] ) && is_numeric( $pParamHash['style_id'] ) ) || $pParamHash['style_id'] == 0 ) {
			$pParamHash['markerset_store']['style_id'] = $pParamHash['style_id'];
		}
		
		if( ( !empty( $pParamHash['icon_id'] ) && is_numeric( $pParamHash['icon_id'] ) ) || $pParamHash['icon_id'] == 0 ) {
			$pParamHash['markerset_store']['icon_id'] = $pParamHash['icon_id'];
		}

		// set values for updating the map set keychain	if its a new set
		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['keychain_store']['gmap_id'] = $pParamHash['gmap_id'];
			$pParamHash['keychain_ids']['gmap_id'] = $pParamHash['gmap_id'];
		}

		if( !empty( $pParamHash['plot_on_load'] ) ) {
			$pParamHash['keychain_store']['plot_on_load'] = $pParamHash['plot_on_load'];
			$pParamHash['keychain_update']['plot_on_load'] = $pParamHash['plot_on_load'];
		}else{
			$pParamHash['keychain_store']['plot_on_load'] = 'false';
			$pParamHash['keychain_update']['plot_on_load'] = 'false';
		}

		if( !empty( $pParamHash['side_panel'] ) ) {
			$pParamHash['keychain_store']['side_panel'] = $pParamHash['side_panel'];
			$pParamHash['keychain_update']['side_panel'] = $pParamHash['side_panel'];
		}else{
			$pParamHash['keychain_store']['side_panel'] = 'false';
			$pParamHash['keychain_update']['side_panel'] = 'false';
		}

		if( !empty( $pParamHash['explode'] ) ) {
			$pParamHash['keychain_store']['explode'] = $pParamHash['explode'];
			$pParamHash['keychain_update']['explode'] = $pParamHash['explode'];
		}else{
			$pParamHash['keychain_store']['explode'] = 'false';
			$pParamHash['keychain_update']['explode'] = 'false';
		}

		if( !empty( $pParamHash['cluster'] ) ) {
			$pParamHash['keychain_store']['cluster'] = $pParamHash['cluster'];
			$pParamHash['keychain_update']['cluster'] = $pParamHash['cluster'];
		}else{
			$pParamHash['keychain_store']['cluster'] = 'false';
			$pParamHash['keychain_update']['cluster'] = 'false';
		}

		$pParamHash['keychain_store']['set_type'] = 'markers';
		$pParamHash['keychain_ids']['set_type'] = 'markers';
				
		return( count( $this->mErrors ) == 0 );
	}
	
	/**
	* This function stores a marker set
	**/
	function storeMarkerSet( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyMarkerSet( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['set_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_marker_sets", $pParamHash['markerset_store'], array( "name" => "set_id", "value" => $pParamHash['set_id'] ) );
				 // and we update the set keychain on map_id.
				 $pParamHash['keychain_ids']['set_id'] = $pParamHash['set_id'];
				 $this->mDb->associateUpdateKeys( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_update'], $pParamHash['keychain_ids'] );
			}else{
				 // if its a new markerset we get a new set_id and store the data
				 $pParamHash['set_id'] = $this->mDb->GenID( 'gmaps_marker_sets_set_id_seq' );
				 $pParamHash['markerset_store']['set_id'] = $pParamHash['set_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_marker_sets", $pParamHash['markerset_store'] );
				 // and insert an entry in the set keychain and associate it with a map.
				 $pParamHash['keychain_store']['set_id'] = $pParamHash['markerset_store']['set_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_store'] );
			}

			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getMarkerSetData($pParamHash['set_id']);
		}
		return $result;
	}
	
	
	//vertually same as verifyMarkerSet
	function verifyPolylineSet( &$pParamHash ) {

		$pParamHash['polylineset_store'] = array();
		$pParamHash['keychain_store'] = array();
		$pParamHash['keychain_update'] = array();
		$pParamHash['keychain_ids'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polylineset_store']['name'] = $pParamHash['name'];
		}

		if( !empty( $pParamHash['description'] ) ) {
			$pParamHash['polylineset_store']['description'] = $pParamHash['description'];
		}

		if( ( !empty( $pParamHash['style_id'] ) && is_numeric( $pParamHash['style_id'] ) ) || $pParamHash['style_id'] == 0 ) {
			$pParamHash['polylineset_store']['style_id'] = $pParamHash['style_id'];
		}

		// set values for updating the map set keychain	if its a new set
		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['keychain_store']['gmap_id'] = $pParamHash['gmap_id'];
			$pParamHash['keychain_ids']['gmap_id'] = $pParamHash['gmap_id'];
		}

		if( !empty( $pParamHash['plot_on_load'] ) ) {
			$pParamHash['keychain_store']['plot_on_load'] = $pParamHash['plot_on_load'];
			$pParamHash['keychain_update']['plot_on_load'] = $pParamHash['plot_on_load'];
		}else{
			$pParamHash['keychain_store']['plot_on_load'] = 'false';
			$pParamHash['keychain_update']['plot_on_load'] = 'false';
		}

		if( !empty( $pParamHash['side_panel'] ) ) {
			$pParamHash['keychain_store']['side_panel'] = $pParamHash['side_panel'];
			$pParamHash['keychain_update']['side_panel'] = $pParamHash['side_panel'];
		}else{
			$pParamHash['keychain_store']['side_panel'] = 'false';
			$pParamHash['keychain_update']['side_panel'] = 'false';
		}

		if( !empty( $pParamHash['explode'] ) ) {
			$pParamHash['keychain_store']['explode'] = $pParamHash['explode'];
			$pParamHash['keychain_update']['explode'] = $pParamHash['explode'];
		}else{
			$pParamHash['keychain_store']['explode'] = 'false';
			$pParamHash['keychain_update']['explode'] = 'false';
		}

		$pParamHash['keychain_store']['cluster'] = 'false';
		$pParamHash['keychain_update']['cluster'] = 'false';
		$pParamHash['keychain_store']['set_type'] = 'polylines';
		$pParamHash['keychain_ids']['set_type'] = 'polylines';

		return( count( $this->mErrors ) == 0 );		
		
	}
	
	/**
	* This function stores a polyline set
	**/
	function storePolylineSet( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolylineSet( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['set_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polyline_sets", $pParamHash['polylineset_store'], array( "name" => "set_id", "value" => $pParamHash['set_id'] ) );
				 // and we update the set keychain on map_id.
				 $pParamHash['keychain_ids']['set_id'] = $pParamHash['set_id'];
				 $this->mDb->associateUpdateKeys( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_update'], $pParamHash['keychain_ids'] );
			}else{
				 $pParamHash['set_id'] = $this->mDb->GenID( 'gmaps_polyline_sets_set_id_seq' );
				 $pParamHash['polylineset_store']['set_id'] = $pParamHash['set_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polyline_sets", $pParamHash['polylineset_store'] );
				 // if its a new polylineset we also get a set_id for the keychain and automaticallly associate it with a map.
				 $pParamHash['keychain_store']['set_id'] = $pParamHash['polylineset_store']['set_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolylineSetData($pParamHash['set_id']);
		}
		return $result;
	}



	//@todo -  vertually same as verifyMarkerSet - consolidate
	function verifyPolygonSet( &$pParamHash ) {

		$pParamHash['polygonset_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polygonset_store']['name'] = $pParamHash['name'];
		}

		if( !empty( $pParamHash['description'] ) ) {
			$pParamHash['polygonset_store']['description'] = $pParamHash['description'];
		}

		if( ( !empty( $pParamHash['style_id'] ) && is_numeric( $pParamHash['style_id'] ) ) || $pParamHash['style_id'] == 0 ) {
			$pParamHash['polygonset_store']['style_id'] = $pParamHash['style_id'];
		}

		if( ( !empty( $pParamHash['polylinestyle_id'] ) && is_numeric( $pParamHash['polylinestyle_id'] ) ) || $pParamHash['polylinestyle_id'] == 0 ) {
			$pParamHash['polygonset_store']['polylinestyle_id'] = $pParamHash['polylinestyle_id'];
		}

		// set values for updating the map set keychain	if its a new set
		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['keychain_store']['gmap_id'] = $pParamHash['gmap_id'];
		}

		if( !empty( $pParamHash['set_type'] ) ) {
			$pParamHash['keychain_store']['set_type'] = $pParamHash['set_type'];
		}

		return( count( $this->mErrors ) == 0 );		
		
	}
	
	/**
	* This function stores a polygon set
	**/
	function storePolygonSet( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolygonSet( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['set_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polygon_sets", $pParamHash['polygonset_store'], array( "name" => "set_id", "value" => $pParamHash['set_id'] ) );
			}else{
				 $pParamHash['set_id'] = $this->mDb->GenID( 'gmaps_polygon_sets_set_id_seq' );
				 $pParamHash['polygonset_store']['set_id'] = $pParamHash['set_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polygon_sets", $pParamHash['polygonset_store'] );
				 // if its a new polylineset we also get a set_id for the keychain and automaticallly associate it with a map.
				 $pParamHash['keychain_store']['set_id'] = $pParamHash['polygonset_store']['set_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolygonSetData($pParamHash['set_id']);
		}
		return $result;
	}




	function verifyMarkerStyle( &$pParamHash ) {

		$pParamHash['markerstyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['markerstyle_store']['name'] = $pParamHash['name'];
		}
		
		if( ( !empty( $pParamHash['type'] ) && is_numeric( $pParamHash['type'] ) ) || $pParamHash['type'] == 0 ) {
			$pParamHash['markerstyle_store']['type'] = $pParamHash['type'];
		}
		
		if( !empty( $pParamHash['label_hover_opacity'] ) && is_numeric( $pParamHash['label_hover_opacity'] ) ) {
			$pParamHash['markerstyle_store']['label_hover_opacity'] = $pParamHash['label_hover_opacity'];
		}
		
		if( !empty( $pParamHash['label_opacity'] ) && is_numeric( $pParamHash['label_opacity'] ) ) {
			$pParamHash['markerstyle_store']['label_opacity'] = $pParamHash['label_opacity'];
		}
		
		if( !empty( $pParamHash['label_hover_styles'] ) ) {
			$pParamHash['markerstyle_store']['label_hover_styles'] = $pParamHash['label_hover_styles'];
		}
		
		if( !empty( $pParamHash['window_styles'] ) ) {
			$pParamHash['markerstyle_store']['window_styles'] = $pParamHash['window_styles'];
		}
		
		return( count( $this->mErrors ) == 0 );
	}
	
	function storeMarkerStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyMarkerStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['style_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_marker_styles", $pParamHash['markerstyle_store'], array( "name" => "style_id", "value" => $pParamHash['style_id'] ) );
			}else{
				 $pParamHash['style_id'] = $this->mDb->GenID( 'gmaps_marker_styles_style_id_seq' );
				 $pParamHash['markerstyle_store']['style_id'] = $pParamHash['style_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_marker_styles", $pParamHash['markerstyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getMarkerStyleData($pParamHash['style_id']);
		}
		return $result;
	}




	function verifyIconStyle( &$pParamHash ) {

		$pParamHash['iconstyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['iconstyle_store']['name'] = $pParamHash['name'];
		}

		if( ( !empty( $pParamHash['type'] ) && is_numeric( $pParamHash['type'] ) ) || $pParamHash['type'] == 0 ) {
			$pParamHash['iconstyle_store']['type'] = $pParamHash['type'];
		}
		
		if( !empty( $pParamHash['image'] ) ) {
			$pParamHash['iconstyle_store']['image'] = $pParamHash['image'];
		}
		
		if( !empty( $pParamHash['icon_w'] ) && is_numeric( $pParamHash['icon_w'] ) ) {
			$pParamHash['iconstyle_store']['icon_w'] = $pParamHash['icon_w'];
		}
		
		if( !empty( $pParamHash['icon_h'] ) && is_numeric( $pParamHash['icon_h'] ) ) {
			$pParamHash['iconstyle_store']['icon_h'] = $pParamHash['icon_h'];
		}
		
		if( !empty( $pParamHash['shadow_image'] ) ) {
			$pParamHash['iconstyle_store']['shadow_image'] = $pParamHash['shadow_image'];
		}
		
		if( !empty( $pParamHash['shadow_w'] ) && is_numeric( $pParamHash['shadow_w'] ) ) {
			$pParamHash['iconstyle_store']['shadow_w'] = $pParamHash['shadow_w'];
		}
		
		if( !empty( $pParamHash['shadow_h'] ) && is_numeric( $pParamHash['shadow_h'] ) ) {
			$pParamHash['iconstyle_store']['shadow_h'] = $pParamHash['shadow_h'];
		}
		
		if( !empty( $pParamHash['rollover_image'] ) ) {
			$pParamHash['iconstyle_store']['rollover_image'] = $pParamHash['rollover_image'];
		}

		if( !empty( $pParamHash['icon_anchor_x'] ) && is_numeric( $pParamHash['icon_anchor_x'] ) ) {
			$pParamHash['iconstyle_store']['icon_anchor_x'] = $pParamHash['icon_anchor_x'];
		}
		
		if( !empty( $pParamHash['icon_anchor_y'] ) && is_numeric( $pParamHash['icon_anchor_y'] ) ) {
			$pParamHash['iconstyle_store']['icon_anchor_y'] = $pParamHash['icon_anchor_y'];
		}

		if( !empty( $pParamHash['shadow_anchor_x'] ) && is_numeric( $pParamHash['shadow_anchor_x'] ) ) {
			$pParamHash['iconstyle_store']['shadow_anchor_x'] = $pParamHash['shadow_anchor_x'];
		}
		
		if( !empty( $pParamHash['shadow_anchor_y'] ) && is_numeric( $pParamHash['shadow_anchor_y'] ) ) {
			$pParamHash['iconstyle_store']['shadow_anchor_y'] = $pParamHash['shadow_anchor_y'];
		}

		if( !empty( $pParamHash['infowindow_anchor_x'] ) && is_numeric( $pParamHash['infowindow_anchor_x'] ) ) {
			$pParamHash['iconstyle_store']['infowindow_anchor_x'] = $pParamHash['infowindow_anchor_x'];
		}
		
		if( !empty( $pParamHash['infowindow_anchor_y'] ) && is_numeric( $pParamHash['infowindow_anchor_y'] ) ) {
			$pParamHash['iconstyle_store']['infowindow_anchor_y'] = $pParamHash['infowindow_anchor_y'];
		}

		if( !empty( $pParamHash['points'] ) || $pParamHash['points'] == 0 ) {
			$pParamHash['iconstyle_store']['points'] = $pParamHash['points'];
		}

		if( !empty( $pParamHash['scale'] ) && is_numeric( $pParamHash['scale'] ) ) {
			$pParamHash['iconstyle_store']['scale'] = $pParamHash['scale'];
		}

		if( !empty( $pParamHash['outline_color'] ) ) {
			$pParamHash['iconstyle_store']['outline_color'] = $pParamHash['outline_color'];
		}

		if( !empty( $pParamHash['outline_weight'] ) && is_numeric( $pParamHash['outline_weight'] ) ) {
			$pParamHash['iconstyle_store']['outline_weight'] = $pParamHash['outline_weight'];
		}

		if( !empty( $pParamHash['fill_color'] ) ) {
			$pParamHash['iconstyle_store']['fill_color'] = $pParamHash['fill_color'];
		}

		if( !empty( $pParamHash['fill_opacity'] ) && is_numeric( $pParamHash['fill_opacity'] ) ) {
			$pParamHash['iconstyle_store']['fill_opacity'] = $pParamHash['fill_opacity'];
		}
		
		return( count( $this->mErrors ) == 0 );
	}
	
	function storeIconStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyIconStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['icon_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_icon_styles", $pParamHash['iconstyle_store'], array( "name" => "icon_id", "value" => $pParamHash['icon_id'] ) );
			}else{
				 $pParamHash['icon_id'] = $this->mDb->GenID( 'gmaps_icon_styles_icon_id_seq' );
				 $pParamHash['iconstyle_store']['icon_id'] = $pParamHash['icon_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_icon_styles", $pParamHash['iconstyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getIconStyleData($pParamHash['icon_id']);
		}
		return $result;
	}


	

	function verifyPolylineStyle( &$pParamHash ) {

		$pParamHash['polylinestyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polylinestyle_store']['name'] = $pParamHash['name'];
		}

		if( ( !empty( $pParamHash['type'] ) && is_numeric( $pParamHash['type'] ) ) || $pParamHash['type'] == 0 ) {
			$pParamHash['polylinestyle_store']['type'] = $pParamHash['type'];
		}
				
		if( !empty( $pParamHash['color'] ) ) {
			$pParamHash['polylinestyle_store']['color'] = $pParamHash['color'];
		}
		
		if( !empty( $pParamHash['weight'] ) && is_numeric( $pParamHash['weight'] ) ) {
			$pParamHash['polylinestyle_store']['weight'] = $pParamHash['weight'];
		}
		
		if( !empty( $pParamHash['opacity'] ) && is_numeric( $pParamHash['opacity'] ) ) {
			$pParamHash['polylinestyle_store']['opacity'] = $pParamHash['opacity'];
		}

		if( !empty( $pParamHash['pattern'] ) || $pParamHash['pattern'] == 0 ) {
			$pParamHash['polylinestyle_store']['pattern'] = $pParamHash['pattern'];
		}
		
		if( ( !empty( $pParamHash['segment_count'] ) && is_numeric( $pParamHash['segment_count'] ) ) || $pParamHash['segment_count'] == 0 ) {
			$pParamHash['polylinestyle_store']['segment_count'] = $pParamHash['segment_count'];
		}
		
		if( !empty( $pParamHash['begin_arrow'] ) ) {
			$pParamHash['polylinestyle_store']['begin_arrow'] = $pParamHash['begin_arrow'];
		}

		if( !empty( $pParamHash['end_arrow'] ) ) {
			$pParamHash['polylinestyle_store']['end_arrow'] = $pParamHash['end_arrow'];
		}
		
		if( ( !empty( $pParamHash['arrows_every'] ) && is_numeric( $pParamHash['arrows_every'] ) ) || $pParamHash['arrows_every'] == 0 ) {
			$pParamHash['polylinestyle_store']['arrows_every'] = $pParamHash['arrows_every'];
		}
		
		if( !empty( $pParamHash['font'] ) ) {
			$pParamHash['polylinestyle_store']['font'] = $pParamHash['font'];
		}
		
		if( ( !empty( $pParamHash['text_every'] ) && is_numeric( $pParamHash['text_every'] ) ) || $pParamHash['text_every'] == 0 ) {
			$pParamHash['polylinestyle_store']['text_every'] = $pParamHash['text_every'];
		}

		if( !empty( $pParamHash['text_fgstyle_color'] ) ) {
			$pParamHash['polylinestyle_store']['text_fgstyle_color'] = $pParamHash['text_fgstyle_color'];
		}
		
		if( !empty( $pParamHash['text_fgstyle_weight'] ) && is_numeric( $pParamHash['text_fgstyle_weight'] ) ) {
			$pParamHash['polylinestyle_store']['text_fgstyle_weight'] = $pParamHash['text_fgstyle_weight'];
		}
		
		if( ( !empty( $pParamHash['text_fgstyle_opacity'] ) && is_numeric( $pParamHash['text_fgstyle_opacity'] ) ) || $pParamHash['text_fgstyle_opacity'] == 0 ) {
			$pParamHash['polylinestyle_store']['text_fgstyle_opacity'] = $pParamHash['text_fgstyle_opacity'];
		}
		
		if( ( !empty( $pParamHash['text_fgstyle_zindex'] ) && is_numeric( $pParamHash['text_fgstyle_zindex'] ) ) || $pParamHash['text_fgstyle_zindex'] == 0 ) {
			$pParamHash['polylinestyle_store']['text_fgstyle_zindex'] = $pParamHash['text_fgstyle_zindex'];
		}
		
		if( !empty( $pParamHash['text_bgstyle_color'] ) ) {
			$pParamHash['polylinestyle_store']['text_bgstyle_color'] = $pParamHash['text_bgstyle_color'];
		}
		
		if( !empty( $pParamHash['text_bgstyle_weight'] ) && is_numeric( $pParamHash['text_bgstyle_weight'] ) ) {
			$pParamHash['polylinestyle_store']['text_bgstyle_weight'] = $pParamHash['text_bgstyle_weight'];
		}
		
		if( ( !empty( $pParamHash['text_bgstyle_opacity'] ) && is_numeric( $pParamHash['text_bgstyle_opacity'] ) ) || $pParamHash['text_bgstyle_opacity'] == 0 ) {
			$pParamHash['polylinestyle_store']['text_bgstyle_opacity'] = $pParamHash['text_bgstyle_opacity'];
		}
		
		if( ( !empty( $pParamHash['text_bgstyle_zindex'] ) && is_numeric( $pParamHash['text_bgstyle_zindex'] ) ) || $pParamHash['text_bgstyle_zindex'] == 0 ) {
			$pParamHash['polylinestyle_store']['text_bgstyle_zindex'] = $pParamHash['text_bgstyle_zindex'];
		}
				
		return( count( $this->mErrors ) == 0 );
	}
	
	function storePolylineStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolylineStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['style_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polyline_styles", $pParamHash['polylinestyle_store'], array( "name" => "style_id", "value" => $pParamHash['style_id'] ) );
			}else{
				 $pParamHash['style_id'] = $this->mDb->GenID( 'gmaps_polyline_styles_style_id_seq' );
				 $pParamHash['polylinestyle_store']['style_id'] = $pParamHash['style_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polyline_styles", $pParamHash['polylinestyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolylineStyleData($pParamHash['style_id']);
		}
		return $result;
	}
		




	function verifyPolygonStyle( &$pParamHash ) {

		$pParamHash['polygonstyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polygonstyle_store']['name'] = $pParamHash['name'];
		}

		if( ( !empty( $pParamHash['type'] ) && is_numeric( $pParamHash['type'] ) ) || $pParamHash['type'] == 0 ) {
			$pParamHash['polygonstyle_store']['type'] = $pParamHash['type'];
		}
				
		if( !empty( $pParamHash['color'] ) ) {
			$pParamHash['polygonstyle_store']['color'] = $pParamHash['color'];
		}
		
		if( !empty( $pParamHash['weight'] ) && is_numeric( $pParamHash['weight'] ) ) {
			$pParamHash['polygonstyle_store']['weight'] = $pParamHash['weight'];
		}
		
		if( !empty( $pParamHash['opacity'] ) && is_numeric( $pParamHash['opacity'] ) ) {
			$pParamHash['polygonstyle_store']['opacity'] = $pParamHash['opacity'];
		}
				
		return( count( $this->mErrors ) == 0 );
	}
	
	function storePolygonStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolygonStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['style_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polygon_styles", $pParamHash['polygonstyle_store'], array( "name" => "style_id", "value" => $pParamHash['style_id'] ) );
			}else{
				 $pParamHash['style_id'] = $this->mDb->GenID( 'gmaps_polygon_styles_style_id_seq' );
				 $pParamHash['polygonstyle_store']['style_id'] = $pParamHash['style_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polygon_styles", $pParamHash['polygonstyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolygonStyleData($pParamHash['style_id']);
		}
		return $result;
	}









// ALL EXPUNGE FUNCTIONS	

	
	/**
	* This function removes a map entry
	**/
	function expunge() {
		$ret = FALSE;
		if( $this->isValid() ) {
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps` WHERE `content_id` = ?";
			$result = $this->mDb->query( $query, array( $this->mContentId ) );
			if( LibertyAttachable::expunge() ) {
				$ret = TRUE;
				$this->mDb->CompleteTrans();
			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return $ret;
	}


	/**
	* This function deletes a maptype and all references to it in the map sets keychain
	**/
	function expungeMapType(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['maptype_id'] ) && is_numeric( $pParamHash['maptype_id'] ) ) {
  		$this->mDb->StartTrans();
  		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_map_types` 
  		WHERE `maptype_id` =?";
  		$result = $this->mDb->query( $query, array( $pParamHash['maptype_id'] ) );
  		$this->mDb->CompleteTrans();
			
			// delete all references to the maptype from the map sets keychain
			$this->mDb->StartTrans();
  		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
  			WHERE `set_id` =?
  			AND `set_type` ='map_types'";
			$result = $this->mDb->query( $query, array( $pParamHash['maptype_id'] ) );
			$this->mDb->CompleteTrans();
  		$ret = TRUE;			
		}
		
		return $ret;
	}	

	
	/**
	* This function deletes a polyline and all references to it in the polyline keychain
	**/
	function expungePolyline(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['polyline_id'] ) && is_numeric( $pParamHash['polyline_id'] ) ) {
  		$this->mDb->StartTrans();
  		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polylines` 
  		WHERE `polyline_id` =?";
  		$result = $this->mDb->query( $query, array( $pParamHash['polyline_id'] ) );
  		$this->mDb->CompleteTrans();
			
			// delete all references to the polyline from the polyline keychain
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polyline_keychain` WHERE `polyline_id` =?";				
			$result = $this->mDb->query( $query, array( $pParamHash['polyline_id'] ) );
			$this->mDb->CompleteTrans();
  		$ret = TRUE;
		}

		return $ret;
	}
	


	/**
	* This function deletes a polygon and all references to it in the polygon keychain
	**/
	function expungePolygon(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['polygon_id'] ) && is_numeric( $pParamHash['polygon_id'] ) ) {
  		$this->mDb->StartTrans();
  		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polygons` 
  		WHERE `polygon_id` =?";
  		$result = $this->mDb->query( $query, array( $pParamHash['polygon_id'] ) );
  		$this->mDb->CompleteTrans();
			
			// delete all references to the polygon from the polygon keychain
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polygon_keychain` WHERE `polygon_id` =?";				
			$result = $this->mDb->query( $query, array( $pParamHash['polygon_id'] ) );
			$this->mDb->CompleteTrans();
  		$ret = TRUE;
		}

		return $ret;
	}


	
	/**
	* This function deletes a marker set
	**/
	function expungeMarkerSet(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
    		$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_marker_sets` 
    			WHERE `set_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
    		$this->mDb->CompleteTrans();
  			
  			// delete all references to the marker set from the marker keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_marker_keychain` 
    			WHERE `set_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
    		$this->mDb->CompleteTrans();

  			// delete all references to the marker set from the map sets keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
    			WHERE `set_id` =?
          		AND `set_type` = 'markers'";
  			$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
  			$this->mDb->CompleteTrans();
    		$ret = TRUE;
		}

		return $ret;
	}	


	/**
	* This function deletes a polyline set
	**/
	function expungePolylineSet(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
    		$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polyline_sets` 
    			WHERE `set_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
    		$this->mDb->CompleteTrans();
  			
  			// delete all references to the polyline set from the polyline keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polyline_keychain` 
    			WHERE `set_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
    		$this->mDb->CompleteTrans();

  			// delete all references to the polyline set from the map sets keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
    			WHERE `set_id` =?
          		AND `set_type` = 'polylines'";					
  			$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
  			$this->mDb->CompleteTrans();
    		$ret = TRUE;
		}

		return $ret;
	}	




	/**
	* This function deletes a polygon set
	**/
	function expungePolygonSet(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
    		$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polygon_sets` 
    			WHERE `set_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
    		$this->mDb->CompleteTrans();
  			
  			// delete all references to the polygon set from the polygon keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polygon_keychain` 
    			WHERE `set_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
    		$this->mDb->CompleteTrans();

  			// delete all references to the polygon set from the map sets keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
    			WHERE `set_id` =?
          		AND ( `set_type` = 'set_polygons' OR `set_type` = 'init_polygons' )";					
  			$result = $this->mDb->query( $query, array( $pParamHash['set_id'] ) );
  			$this->mDb->CompleteTrans();
    		$ret = TRUE;
		}

		return $ret;
	}	



	//@todo all these - question - what to do if it is being used by sets? step through and delete? don't delete?:
	/**
	* This function deletes a marker style
	**/
	/**
	* This function deletes a icon style
	**/	
	/**
	* This function deletes a polyline style
	**/
	/**
	* This function deletes a polygon style
	**/


	
	// Marker set disassociation is handled in BitGmapMarker.php
	
	
	function verifyMapTypeRemove( &$pParamHash ) {
	
		$pParamHash['maptype_remove'] = array();

		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['maptype_remove']['gmap_id'] = $pParamHash['gmap_id'];
		}
		
		if( !empty( $pParamHash['maptype_id'] ) && is_numeric( $pParamHash['maptype_id'] ) ) {
			$pParamHash['maptype_remove']['set_id'] = $pParamHash['maptype_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a maptype from a map
	**/
	function removeMapTypeFromMap(&$pParamHash) {
		$ret = FALSE;

  		if( $this->verifyMapTypeRemove( $pParamHash ) ) {
  			$this->mDb->StartTrans();
  			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
  			WHERE `gmap_id` = ?
  			AND `set_id` =?
  			AND `set_type` = 'map_types'";
  			$result = $this->mDb->query( $query, $pParamHash['maptype_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}

		return $ret;
	}
	


	
	function verifyPolylineRemove( &$pParamHash ) {
	
		$pParamHash['polyline_remove'] = array();

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['polyline_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		if( !empty( $pParamHash['polyline_id'] ) && is_numeric( $pParamHash['polyline_id'] ) ) {
			$pParamHash['polyline_remove']['polyline_id'] = $pParamHash['polyline_id'];
		}

		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a polyline from a set
	**/
	function removePolylineFromSet(&$pParamHash) {
		$ret = FALSE;
		
  		if( $this->verifyPolylineRemove( $pParamHash ) ) {
  			$this->mDb->StartTrans();
  			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polyline_keychain` 
  			WHERE `set_id` = ?
  			AND `polyline_id` =?";
  			$result = $this->mDb->query( $query, $pParamHash['polyline_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}
			
		return $ret;
	}




	function verifyPolygonRemove( &$pParamHash ) {
	
		$pParamHash['polygon_remove'] = array();

		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['polygon_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		if( !empty( $pParamHash['polygon_id'] ) && is_numeric( $pParamHash['polygon_id'] ) ) {
			$pParamHash['polygon_remove']['polygon_id'] = $pParamHash['polygon_id'];
		}

		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a polygon from a set
	**/
	function removePolygonFromSet(&$pParamHash) {
		$ret = FALSE;
		
  		if( $this->verifyPolygonRemove( $pParamHash ) ) {
  			$this->mDb->StartTrans();
  			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_polygon_keychain` 
  			WHERE `set_id` = ?
  			AND `polygon_id` =?";
  			$result = $this->mDb->query( $query, $pParamHash['polygon_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}
			
		return $ret;
	}



	
	function verifyMarkerSetRemove( &$pParamHash ) {
	
		$pParamHash['markerset_remove'] = array();

		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['markerset_remove']['gmap_id'] = $pParamHash['gmap_id'];
		}
		
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['markerset_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a marker set from a map
	**/
	function removeMarkerSetFromMap(&$pParamHash) {
		$ret = FALSE;

  		if( $this->verifyMarkerSetRemove( $pParamHash ) ) {
  			$this->mDb->StartTrans();
  			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
  			WHERE `gmap_id` = ?
  			AND `set_id` =?
        	AND `set_type` = 'markers'";
  			$result = $this->mDb->query( $query, $pParamHash['markerset_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}

		return $ret;
	}

	
	//@todo - this and the remove function look identical to the removeMarkerSetFromMap function - consolidate - perhaps with removeMapTypeFromMap too
	function verifyPolylineSetRemove( &$pParamHash ) {
	
		$pParamHash['polylineset_remove'] = array();

		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['polylineset_remove']['gmap_id'] = $pParamHash['gmap_id'];
		}
		
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['polylineset_remove']['set_id'] = $pParamHash['set_id'];
		}
		
		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a polyline set from a map
	**/
	function removePolylineSetFromMap(&$pParamHash) {
		$ret = FALSE;

  		if( $this->verifyPolylineSetRemove( $pParamHash ) ) {
  			$this->mDb->StartTrans();
  			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
  			WHERE `gmap_id` = ?
  			AND `set_id` =?
        	AND `set_type` = 'polylines'";
  			$result = $this->mDb->query( $query, $pParamHash['polylineset_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}

		return $ret;
	}



	//@todo - this and the remove function look identical to the removeMarkerSetFromMap function - consolidate - perhaps with removeMapTypeFromMap too
	function verifyPolygonSetRemove( &$pParamHash ) {
	
		$pParamHash['polygonset_remove'] = array();

		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['polygonset_remove']['gmap_id'] = $pParamHash['gmap_id'];
		}
		
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['polygonset_remove']['set_id'] = $pParamHash['set_id'];
		}

		if( !empty( $pParamHash['set_type'] ) ) {
			$pParamHash['polygonset_remove']['set_type'] = $pParamHash['set_type'];
		}
		
		return( count( $this->mErrors ) == 0 );
				
	}	
	/**
	* This function removes a polygon set from a map
	**/
	function removePolygonSetFromMap(&$pParamHash) {
		$ret = FALSE;

  		if( $this->verifyPolygonSetRemove( $pParamHash ) ) {
  			$this->mDb->StartTrans();
  			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
  			WHERE `gmap_id` = ?
  			AND `set_id` =?
        	AND `set_type` = ?";
  			$result = $this->mDb->query( $query, $pParamHash['polygonset_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}

		return $ret;
	}

	

	
	/**
	* Make sure gmap is loaded and valid
	**/
	function isValid() {
		return( !empty( $this->mGmapId ) );
	}
	
	/**
	* Generates the URL to the sample page
	* @param pExistsHash the hash that was returned by LibertyContent::pageExists
	* @return the link to display the page.
	*/
	function getDisplayUrl() {
		$ret = NULL;
		if( !empty( $this->mGmapId ) ) {
			$ret = GMAP_PKG_URL."index.php?gmap_id=".$this->mGmapId;
		}
		return $ret;
	}

}

?>
