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
	function load( $pFullLoad = TRUE ) {
		if( !empty( $this->mGmapId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mGmapId )? 'gmap_id' : 'content_id';
			$lookupId = !empty( $this->mGmapId )? $this->mGmapId : $this->mContentId;

			$query = "SELECT *
					  FROM `".BIT_DB_PREFIX."bit_gmaps` bm INNER JOIN `".BIT_DB_PREFIX."tiki_content` tc ON( bm.`content_id`=tc.`content_id` )
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

					$this->mMapInitMarkers = $this->getMarkers($lookupId, "init_markers");
					$this->mMapSetMarkers = $this->getMarkers($lookupId, "set_markers");
					$this->mMapMarkerStyles = $this->getMarkerStyles($lookupId);
					$this->mMapIconStyles = $this->getIconStyles($lookupId);

					$this->mMapInitLines = $this->getPolylines($lookupId, "init_polylines");
					$this->mMapSetLines = $this->getPolylines($lookupId, "set_polylines");
					$this->mMapLinesStyles = $this->getPolylineStyles($lookupId);

					$this->mMapInitPolys = $this->getPolygons($lookupId, "init_polygons");
					$this->mMapSetPolys = $this->getPolygons($lookupId, "set_polygons");
					$this->mMapPolysStyles = $this->getPolygonStyles($lookupId);
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
					  FROM `".BIT_DB_PREFIX."bit_gmaps` bm
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
          			FROM `".BIT_DB_PREFIX."bit_gmaps_map_types` bmt, `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bmk
          			WHERE bmt.`maptype_id` = bmk.`set_id` AND bmk.`gmap_id` = ? AND bmk.`set_type` = ?";

  		$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		}
		return $ret;
	}



	//returns array of marker data and associated style and icon style ids for given gmap_id and set_type
	function getMarkers($gmap_id, $settype) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

		 	$bindVars = array((int)$gmap_id, $settype);
			$query = "SELECT bmm.*, tc.*, bms.* 
                FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bsk, `".BIT_DB_PREFIX."bit_gmaps_marker_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_markers` bmm, `".BIT_DB_PREFIX."bit_gmaps_marker_sets` bms
								INNER JOIN `".BIT_DB_PREFIX."tiki_content` tc ON( bmm.`content_id`=tc.`content_id` )
                WHERE bsk.`gmap_id` = ?
                AND bsk.`set_type` = ?
                AND bms.`set_id` = bsk.`set_id`
                AND bmk.`set_id` = bms.`set_id`
                AND bmm.`marker_id` = bmk.`marker_id`";
								
			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
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
			FROM `".BIT_DB_PREFIX."bit_gmaps_markers` bm
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
                FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_marker_sets` bms, `".BIT_DB_PREFIX."bit_gmaps_marker_styles` bs
                WHERE bmk.`gmap_id` = ?
                AND bmk.`set_type` = 'init_markers'
                AND bms.`set_id` = bmk.`set_id` AND bs.`style_id` = bms.`style_id`
                OR bmk.`set_type` = 'set_markers'
                AND bms.`set_id` = bmk.`set_id` AND bs.`style_id` = bms.`style_id`";

			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



	//get all icon styles for a given gmap_id
	function getIconStyles($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
			$query = "SELECT DISTINCT bis.*
						 	 	FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_marker_sets` bms, `".BIT_DB_PREFIX."bit_gmaps_icon_styles` bis
								WHERE bmk.`gmap_id` = ?
								AND bmk.`set_type` = 'init_markers'
								AND bms.`set_id` = bmk.`set_id` AND bis.`icon_id` = bms.`style_id`
								OR bmk.`set_type` = 'set_markers'
								AND bms.`set_id` = bmk.`set_id` AND bis.`icon_id` = bms.`style_id`";

			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



	//get all polyline data for given gmap_id and set_type
	function getPolylines($gmap_id, $settype) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

		 	$bindVars = array((int)$gmap_id, $settype);
			$query = "SELECT bmp.*, bps.*
		 				 	  FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bsk, `".BIT_DB_PREFIX."bit_gmaps_polyline_keychain` bpk, `".BIT_DB_PREFIX."bit_gmaps_polylines` bmp, `".BIT_DB_PREFIX."bit_gmaps_polyline_sets` bps
								WHERE bsk.`gmap_id` = ?
								AND bsk.`set_type` = ?
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

			//select map and get list of sets to look up
			$query = "SELECT bm.*
			FROM `".BIT_DB_PREFIX."bit_gmaps_polylines` bm
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
			$query = "SELECT DISTINCT bs.*
						 	  FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_polyline_sets` bps, `".BIT_DB_PREFIX."bit_gmaps_polyline_styles` bs
								WHERE bmk.`gmap_id` = ?
								AND bmk.`set_type` = 'init_polylines'
								AND bps.`set_id` = bmk.`set_id` AND bs.`style_id` = bps.`style_id`
								OR bmk.`set_type` = 'set_polylines'
								AND bps.`set_id` = bmk.`set_id` AND bs.`style_id` = bps.`style_id`";

			$result = $this->mDb->query( $query, array((int)$gmap_id) );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		};
		return $ret;
	}



		//get all polyline data for given gmap_id and set_type
	function getPolygons($gmap_id, $settype) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

		 	$bindVars = array((int)$gmap_id, $settype);
			$query = "SELECT bmp.*, bps.*
		 				 	  FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bsk, `".BIT_DB_PREFIX."bit_gmaps_polygon_keychain` bpk, `".BIT_DB_PREFIX."bit_gmaps_polygons` bmp, `".BIT_DB_PREFIX."bit_gmaps_polygon_sets` bps
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




	//get all polylines for given gmap_id and set_types
	function getPolygonStyles($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
			$query = "SELECT DISTINCT bs.*
						 	  FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_polygon_sets` bps, `".BIT_DB_PREFIX."bit_gmaps_polygon_styles` bs
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





//GENERAL LOOKUP FUNCTIONS

	//get all mapTypes data in database
	function getAllMapTypes() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bmt.* FROM `".BIT_DB_PREFIX."bit_gmaps_map_types` bmt";
		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



	//returns array of all marker sets
	function getAllMarkerSets() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bms.*, bsk.`set_type`, bsk.`gmap_id`, bmm.*
    			 	 	FROM `".BIT_DB_PREFIX."bit_gmaps_marker_keychain` bmk
							INNER JOIN `".BIT_DB_PREFIX."bit_gmaps_marker_sets` bms ON ( bmk.`set_id` = bms.`set_id` )
              INNER JOIN `".BIT_DB_PREFIX."bit_gmaps_markers` bmm ON ( bmm.`marker_id` = bmk.`marker_id` )
              LEFT OUTER JOIN `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bsk
							ON ( bsk.`set_id` = bms.`set_id`
							AND ( bsk.`set_type` = 'set_markers' OR bsk.`set_type` = 'init_markers'))
              ORDER BY bms.`set_id` ASC, bmm.`marker_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



	//returns array of all markers and sets they are in
	function getAllMarkers() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bmk.`set_id`, bmm.*
					 	  FROM `".BIT_DB_PREFIX."bit_gmaps_marker_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_markers` bmm
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
    			 	 	FROM `".BIT_DB_PREFIX."bit_gmaps_polyline_keychain` bmk
							INNER JOIN `".BIT_DB_PREFIX."bit_gmaps_polyline_sets` bms ON ( bmk.`set_id` = bms.`set_id` )
              INNER JOIN `".BIT_DB_PREFIX."bit_gmaps_polylines` bmm ON ( bmm.`polyline_id` = bmk.`polyline_id` )
              LEFT OUTER JOIN `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bsk
							ON ( bsk.`set_id` = bms.`set_id`
							AND ( bsk.`set_type` = 'set_polylines' OR bsk.`set_type` = 'init_polylines'))
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
					 	  FROM `".BIT_DB_PREFIX."bit_gmaps_polyline_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_polylines` bmm
          		WHERE bmm.`polyline_id` = bmk.`polyline_id`
          		ORDER BY bmm.`polyline_id` ASC, bmk.`set_id` ASC";

		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
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
					$this->mDb->associateUpdate( BIT_DB_PREFIX."bit_gmaps", $pParamHash['gmap_store'], array( "name" => "gmap_id", "value" => $pParamHash['gmap_id'] ) );
				} else {
					$pParamHash['gmap_store']['content_id'] = $this->mContentId;
					$this->mDb->associateInsert( BIT_DB_PREFIX."bit_gmaps", $pParamHash['gmap_store'] );
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



	//storage of markers is handled by the marker class in BitGmapMarker.php


	function verifyPolyline( &$pParamHash ) {

		$pParamHash['polyline_store'] = array();

		if( !empty( $pParamHash['line_name'] ) ) {
			$pParamHash['polyline_store']['name'] = $pParamHash['line_name'];
		}

		if( !empty( $pParamHash['line_type'] ) ) {
			$pParamHash['polyline_store']['type'] = $pParamHash['line_type'];
		}
				
		if( !empty( $pParamHash['line_data'] ) ) {
			$pParamHash['polyline_store']['points_data'] = $pParamHash['line_data'];
		}

		if( !empty( $pParamHash['line_bordertext'] ) ) {
			$pParamHash['polyline_store']['border_text'] = $pParamHash['line_bordertext'];
		}

		if( !empty( $pParamHash['line_z'] ) && is_numeric( $pParamHash['line_z'] ) ) {
			$pParamHash['polyline_store']['zindex'] = $pParamHash['line_z'];
		}
		
		return( count( $this->mErrors ) == 0 );
	}
	
	function storePolyline( &$pParamHash ) {
		if( $this->verifyPolyline( $pParamHash ) ) {
			$this->mDb->StartTrans();
				// store the posted changes
				$this->mDb->associateUpdate( BIT_DB_PREFIX."bit_gmaps_polylines", $pParamHash['polyline_store'], array( "name" => "polyline_id", "value" => $pParamHash['polyline_id'] ) );

				$this->mDb->CompleteTrans();

				// re-query to confirm results
				$result = $this->getPolylineData($pParamHash['polyline_id']);

		}
		return count( $result );
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
