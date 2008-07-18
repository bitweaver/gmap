<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/BitGmap.php,v 1.135 2008/07/18 04:02:11 wjames5 Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 * @author Will <will@wjamesphoto.com>
 *
 * @package gmap
 */

/**
 * Initialize
 */
require_once( LIBERTY_PKG_PATH.'LibertyMime.php' );
require_once( LIBERTY_PKG_PATH.'LibertyComment.php' );

define( 'BITGMAP_CONTENT_TYPE_GUID', 'bitgmap' );

/**
 * class BitGmap
 * 
 * @package gmap
 */
class BitGmap extends LibertyMime {

	var $mGmapId;

	function BitGmap( $pGmapId=NULL, $pContentId=NULL ) {
		parent::LibertyMime();
		$this->mGmapId = $pGmapId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAP_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAP_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAP_CONTENT_TYPE_GUID,
			'content_description' => 'Google Map',
			'handler_class' => 'BitGmap',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmap.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );

		// Permission setup
		$this->mViewContentPerm  = 'p_gmap_view';
		$this->mEditContentPerm  = 'p_gmap_edit';
		$this->mAdminContentPerm = 'p_gmap_admin';
	}
	

	/**
	 * Load the data from the database
	 * @param pParamHash be sure to pass by reference in case we need to make modifcations to the hash
	**/
	function load( $pFullLoad = TRUE ) {
		if( !empty( $this->mGmapId ) || !empty( $this->mContentId ) ) {
			$lookupColumn = !empty( $this->mGmapId )? 'gmap_id' : 'content_id';

			$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
			array_push( $bindVars,  $lookupId = @BitBase::verifyId( $this->mGmapId )? $this->mGmapId : $this->mContentId );
			$this->getServicesSql( 'content_load_sql_function', $selectSql, $joinSql, $whereSql, $bindVars );

			$query = "select bm.*, lc.*, lcds.`data` AS `summary`,
					  uue.`login` AS modifier_user, uue.`real_name` AS modifier_real_name,
					  uuc.`login` AS creator_user, uuc.`real_name` AS creator_real_name $selectSql
					  FROM `".BIT_DB_PREFIX."gmaps` bm
						INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON (lc.`content_id` = bm.`content_id`) $joinSql
						LEFT OUTER JOIN `".BIT_DB_PREFIX."liberty_content_data` lcds ON (lc.`content_id` = lcds.`content_id` AND lcds.`data_type`='summary')
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uue ON (uue.`user_id` = lc.`modifier_user_id`)
						LEFT JOIN `".BIT_DB_PREFIX."users_users` uuc ON (uuc.`user_id` = lc.`user_id`)
					  WHERE bm.`$lookupColumn`=? $whereSql";

			$result = $this->mDb->query( $query, $bindVars );
			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mGmapId = $result->fields['gmap_id'];
				$this->mContentId = $result->fields['content_id'];
				$this->mInfo['display_url'] = $this->getDisplayUrl();
				$this->mInfo['raw'] = $this->mInfo['data'];
				$this->mInfo['xml_parsed_data'] = $this->parseData( $this->mInfo['data'], $this->mInfo['format_guid'] );
				$this->mInfo['parsed_data'] = $this->parseData( $this->mInfo['data'], $this->mInfo['format_guid'] );
				$this->mInfo['clean_data'] = $this->mInfo['parsed_data'];
				$this->mInfo['parsed_data'] = addslashes($this->mInfo['parsed_data']);
				$this->mInfo['xml_data'] = str_replace("\n", "&#13;", $this->mInfo['data']);
				$this->mInfo['data'] = addslashes($this->mInfo['data']);
				$this->mInfo['data'] = str_replace("\n", "\\n", $this->mInfo['data']);
				parent::load();

				if( $pFullLoad ) {
					$this->mMapTypes = $this->getMapTypes($lookupId);
					$this->mTilelayers = $this->getTilelayers($lookupId);
					$this->mCopyrights = $this->getCopyrights($lookupId);

					//@TODO should prolly find a better way to deal with large numbers of markers - like when +1000
					$joinHash = array('gmap_id' => $this->mGmapId, 'max_records' => 9999);
					require_once( GMAP_PKG_PATH.'BitGmapMarker.php' );
					$marker = new BitGmapMarker();
					$markersList = $marker->getList( $joinHash );
					$this->mMapMarkers = $markersList['data'];
					
					require_once( GMAP_PKG_PATH.'BitGmapMarkerSet.php' );
					$markerSet = new BitGmapMarkerSet();
					$markerSetsList = $markerSet->getList( $joinHash );
					$this->mMapMarkerSets = $markerSetsList['data'];
					
					$this->mMapMarkerStyles = $this->getMarkerStyles($lookupId);
					$this->mMapIconStyles = $this->getIconStyles($lookupId);

					require_once( GMAP_PKG_PATH.'BitGmapPolyline.php' );
					$polyline = new BitGmapPolyline();
					$polylinesList = $polyline->getList( $joinHash );
					$this->mMapPolylines = $polylinesList['data'];
					
					require_once( GMAP_PKG_PATH.'BitGmapPolylineSet.php' );
					$polylineSet = new BitGmapPolylineSet();
					$polylineSetsList = $polylineSet->getList( $joinHash );
					$this->mMapPolylineSets = $polylineSetsList['data'];
					
					$this->mMapPolylineStyles = $this->getPolylineStyles($lookupId);

					require_once( GMAP_PKG_PATH.'BitGmapPolygon.php' );
					$polygon = new BitGmapPolygon();
					$polygonsList = $polygon->getList( $joinHash );
					$this->mMapPolygons = $polygonsList['data'];
					
					require_once( GMAP_PKG_PATH.'BitGmapPolygonSet.php' );
					$polygonSet = new BitGmapPolygonSet();
					$polygonSetsList = $polygonSet->getList( $joinHash );
					$this->mMapPolygonSets = $polygonSetsList['data'];
					
					$this->mMapPolygonStyles = $this->getPolygonStyles($lookupId);
				}
			}
		}


/*
		$accessError = $this->invokeServices( 'content_verify_access', $this );
		if( empty( $accessError ) ) {
	    // Display the template
		}else{
			vd($accessError);
		}
*/
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



	//get a maptype
	function getMapType( &$pGmaptypeId ) {
		global $gBitSystem;
		$ret = NULL;
		if ( $pGmaptypeId && is_numeric( $pGmaptypeId )) {

			$bindVars = array( (int)$pGmaptypeId );

			$query = "SELECT bmt.*
          			FROM `".BIT_DB_PREFIX."gmaps_maptypes` bmt
          			WHERE bmt.`maptype_id` = ?";

			$result = $this->mDb->query( $query, $bindVars );
			
			if( $result && $result->numRows() ) {
				$ret = $result->fields;
			}
		}
		return $ret;
	}



	//get all maptypes for a given gmap_id
	function getMapTypes( &$pGmapId = NULL ) {
		global $gBitSystem;
		$ret = NULL;
		
		$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
		
		if( @$this->verifyId( $pGmapId ) ) {
			$selectSql .= ", ( SELECT GROUP_CONCAT( gtk.`tilelayer_id` ORDER BY gtk.".$this->mDb->convertSortmode( array( 'pos_asc' ) )." ) 
					  FROM `".BIT_DB_PREFIX."gmaps_tilelayers_keychain` gtk 
					  INNER JOIN `".BIT_DB_PREFIX."gmaps_tilelayers` gtl ON (gtl.`tilelayer_id` = gtk.`tilelayer_id` )
					  WHERE gtk.`maptype_id` = gsk.`set_id` )
					  `tilelayer_ids`";
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON (gmt.`maptype_id` = gsk.`set_id`) "; 
			$whereSql .= " WHERE gsk.`gmap_id` = ? AND gsk.`set_type` = 'maptypes' ";
			array_push( $bindVars, (int)$pGmapId );
		}
		
		$query = "SELECT gmt.* $selectSql
				FROM `".BIT_DB_PREFIX."gmaps_maptypes` gmt
				$joinSql
				$whereSql";

		$result = $this->mDb->query( $query, $bindVars );
	
		$ret = array();
	
		while ($res = $result->fetchrow()) {
			$ret[] = $res;
		};
			
		return $ret;
	}




	//get all Tilelayers data associated with maptypes associated with a given $gmap_id
	function getTilelayers($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

			$bindVars = array((int)$gmap_id, "maptypes");

			$query = "SELECT DISTINCT gtl.*
					FROM `".BIT_DB_PREFIX."gmaps_tilelayers` gtl
					INNER JOIN `".BIT_DB_PREFIX."gmaps_tilelayers_keychain` gtk ON ( gtl.`tilelayer_id` = gtk.`tilelayer_id` )
					INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON (gtk.`maptype_id` = gsk.`set_id`)
					WHERE gsk.`gmap_id` = ? AND gsk.`set_type` = ?";

			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		}		
		return $ret;
	}


	
	//* Gets data for a given tilelayer.
	function getTilelayer( &$pParamHash ) {
		global $gBitSystem;

		$ret = NULL;

		if ( isset( $pParamHash['tilelayer_id'] ) && is_numeric( $pParamHash['tilelayer_id'] ) ) {
			$bindVars = array( $pParamHash['tilelayer_id'] );

			if ( isset( $pParamHash['maptype_id'] ) && is_numeric( $pParamHash['maptype_id'] ) ) {
				$select = ", gtk.`pos`";
				$join = " INNER JOIN `".BIT_DB_PREFIX."gmaps_tilelayers_keychain` gtk ON ( gtl.`tilelayer_id` = gtk.`tilelayer_id` )";
				$where = " AND gtk.`maptype_id` = ?";
				$bindVars[] = $pParamHash['maptype_id'];
			}
			
			$query = "SELECT gtl.*".$select.
			" FROM `".BIT_DB_PREFIX."gmaps_tilelayers` gtl".$join.
			" WHERE gtl.`tilelayer_id` = ?".$where;
	  		$result = $this->mDb->query( $query, $bindVars );
	  		
			if( $result && $result->numRows() ) {
				$ret = $result->fields;
			}
		}
		return $ret;
	}



	//get all Copyrights data associated with tilelayers of maptypes associated with a given $gmap_id
	function getCopyrights($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

			$bindVars = array((int)$gmap_id, "maptypes");

			$query = "SELECT gcr.*, gck.*
					FROM `".BIT_DB_PREFIX."gmaps_copyrights_keychain` gck
						INNER JOIN `".BIT_DB_PREFIX."gmaps_tilelayers_keychain` gtk ON(gck.`tilelayer_id` = gtk.`tilelayer_id` )
						INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON(gtk.`maptype_id` = gsk.`set_id`)
						INNER JOIN `".BIT_DB_PREFIX."gmaps_copyrights` gcr ON ( gcr.`copyright_id` = gck.`copyright_id` )
					WHERE gsk.`gmap_id` = ? AND gsk.`set_type` = ?";

			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();

			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		}		
		return $ret;
	}


	
	//* Gets data for a given copyright.
	function getCopyright($copyright_id) {
		global $gBitSystem;
		if ($copyright_id && is_numeric($copyright_id)) {
			$query = "SELECT gcr.*
			FROM `".BIT_DB_PREFIX."gmaps_copyrights` gcr
			WHERE gcr.copyright_id = ?";
	  		$result = $this->mDb->query( $query, array((int)$copyright_id));

			if( $result && $result->numRows() ) {
				$ret = $result->fields;
			}
		}
		return $ret;
	}



	//* Gets data for a given marker style.
	// @ todo this should probably take an array so that we can get data for a bunch of styles if we want
	function getMarkerStyle( &$pStyleId ) {
		global $gBitSystem;
		if ( $pStyleId && is_numeric( $pStyleId )) {
		
			$bindVars = array( (int)$pStyleId );
		
			$query = "SELECT bs.*
			FROM `".BIT_DB_PREFIX."gmaps_marker_styles` bs
			WHERE bs.style_id = ?";
			
			$result = $this->mDb->query( $query, $bindVars );

			if( $result && $result->numRows() ) {
				$ret = $result->fields;
			}
		}
		return $result;
	}



	//get all marker styles for a given gmap_id
	function getMarkerStyles( &$pGmapId = NULL ) {
		global $gBitSystem;
		$ret = NULL;
		
		$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
		
		if( @$this->verifyId( $pGmapId ) ) {
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_marker_sets` gms ON (gms.`style_id` = gis.`style_id`) ";
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON (gms.`set_id` = gsk.`set_id`) "; 
			$whereSql .= " WHERE gsk.`gmap_id` = ? AND gsk.`set_type` = 'markers' ";
			array_push( $bindVars, (int)$pGmapId );
		}
		
		$query = "SELECT DISTINCT gis.* $selectSql
				FROM `".BIT_DB_PREFIX."gmaps_marker_styles` gis
				$joinSql
				$whereSql";

		$result = $this->mDb->query( $query, $bindVars );
	
		$ret = array();
	
		while ($res = $result->fetchrow()) {
			$ret[] = $res;
		};
			
		return $ret;
	}

	
		
	function getIconStyle( &$pStyleId ) {
		global $gBitSystem;
		$ret = NULL;
		if ( $pStyleId && is_numeric( $pStyleId )) {

			$bindVars = array( (int)$pStyleId );

			$query = "SELECT gps.*
          			FROM `".BIT_DB_PREFIX."gmaps_icon_styles` gps
          			WHERE gps.`icon_id` = ?";

			$result = $this->mDb->query( $query, $bindVars );
			
			if( $result && $result->numRows() ) {
				$ret = $result->fields;
			}
		}
		return $ret;
	}
	
	
	
	//get all icon styles for a given gmap_id
	function getIconStyles( &$pGmapId = NULL ) {
		global $gBitSystem;
		$ret = NULL;
		
		$bindVars = array(); $selectSql = ''; $joinSql = ''; $whereSql = '';
		
		if( @$this->verifyId( $pGmapId ) ) {
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_marker_sets` gms ON (gms.`icon_id` = gis.`icon_id`) ";
			$joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` gsk ON (gms.`set_id` = gsk.`set_id`) "; 
			$whereSql .= " WHERE gsk.`gmap_id` = ? AND gsk.`set_type` = 'markers' ";
			array_push( $bindVars, (int)$pGmapId );
		}
		
		$query = "SELECT DISTINCT gis.* $selectSql
				FROM `".BIT_DB_PREFIX."gmaps_icon_styles` gis
				$joinSql
				$whereSql";

		$result = $this->mDb->query( $query, $bindVars );
	
		$ret = array();
	
		while ($res = $result->fetchrow()) {
			$ret[] = $res;
		};
			
		return $ret;
	}


		
	function getPolylineStyle( &$pStyleId ) {
		global $gBitSystem;
		$ret = NULL;
		if ( $pStyleId && is_numeric( $pStyleId )) {

			$bindVars = array( (int)$pStyleId );

			$query = "SELECT gps.*
          			FROM `".BIT_DB_PREFIX."gmaps_polyline_styles` gps
          			WHERE gps.`style_id` = ?";

			$result = $this->mDb->query( $query, $bindVars );
			
			if( $result && $result->numRows() ) {
				$ret = $result->fields;
			}
		}
		return $ret;
	}

	//get all polylines for given gmap_id and set_types
    function getPolylineStyles( &$pGmapId = NULL ) {
        global $gBitSystem;
        $ret = NULL;
        
        $bindVars = array(); $joinSql = ''; $whereSql = '';

        $query = "SELECT DISTINCT gis.*
                FROM `".BIT_DB_PREFIX."gmaps_polyline_styles` gis";
                
        if( @$this->verifyId( $pGmapId ) ) {
            // Polyline setup
            $polyline_joinSql = " INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_sets` lgms ON (lgms.`style_id` = gis.`style_id`) ";
            $polyline_joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` lgsk ON (lgms.`set_id` = lgsk.`set_id`) "; 
            $polyline_whereSql = " WHERE lgsk.`gmap_id` = ? AND lgsk.`set_type` = 'polylines' ";
            $bindVars[] = $pGmapId;

            // Build the whole sodding mess
            $query = $query . $polyline_joinSql . $polyline_whereSql . " UNION " . $query . $polyline_joinSql;
        }

        $result = $this->mDb->query( $query, $bindVars );
    
        $ret = array();
    
        while ($res = $result->fetchrow()) {
            $ret[] = $res;
        };
            
        return $ret;
	}



	function getPolygonStyle( &$pStyleId ) {
		global $gBitSystem;
		$ret = NULL;
		if ( $pStyleId && is_numeric( $pStyleId )) {

			$bindVars = array( (int)$pStyleId );

			$query = "SELECT gps.*
          			FROM `".BIT_DB_PREFIX."gmaps_polygon_styles` gps
          			WHERE gps.`style_id` = ?";

			$result = $this->mDb->query( $query, $bindVars );
			
			if( $result && $result->numRows() ) {
				$ret = $result->fields;
			}
		}
		return $ret;
	}



	//get all polylines for given gmap_id and set_types
    function getPolygonStyles( &$pGmapId = NULL ) {
        global $gBitSystem;
        $ret = NULL;
        
        $bindVars = array(); $joinSql = ''; $whereSql = '';

        $query = "SELECT DISTINCT gis.*
                FROM `".BIT_DB_PREFIX."gmaps_polygon_styles` gis";
        
        if( @$this->verifyId( $pGmapId ) ) {
            // Polygon setup
            $polygon_joinSql = " INNER JOIN `".BIT_DB_PREFIX."gmaps_polygon_sets` pgms ON (pgms.`style_id` = gis.`style_id`) ";
            $polygon_joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` pgsk ON (pgms.`set_id` = pgsk.`set_id`) "; 
            $polygon_whereSql = " WHERE pgsk.`gmap_id` = ? AND pgsk.`set_type` = 'polygons' ";
            $bindVars[] = $pGmapId;

            // Polyline setup
            $polyline_joinSql = " INNER JOIN `".BIT_DB_PREFIX."gmaps_polyline_sets` lgms ON (lgms.`style_id` = gis.`style_id`) ";
            $polyline_joinSql .= " INNER JOIN `".BIT_DB_PREFIX."gmaps_sets_keychain` lgsk ON (lgms.`set_id` = lgsk.`set_id`) "; 
            $polyline_whereSql = " WHERE lgsk.`gmap_id` = ? AND lgsk.`set_type` = 'polylines' ";
            $bindVars[] = $pGmapId;

            // Build the whole sodding mess
            $query = $query . $polygon_joinSql . $polygon_whereSql . " UNION " . $query . $polyline_joinSql . $polyline_whereSql;
        }

        $result = $this->mDb->query( $query, $bindVars );
    
        $ret = array();
    
        while ($res = $result->fetchrow()) {
            $ret[] = $res;
        };
            
        return $ret;
    }
	
	

	//get all mapTypes data in database
	function getAllMapTypes() {
		global $gBitSystem;
		$ret = NULL;
		$query = "SELECT bmt.* FROM `".BIT_DB_PREFIX."gmaps_maptypes` bmt";
		$result = $this->mDb->query( $query );
		$ret = array();
		while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};
		return $ret;
	}



// ALL LIST FUNCTIONS	
	
	/**
	* This function generates a list of records from the liberty_content database for use in a list page
	**/
	function getList( &$pParamHash ) {
		global $commentsLib;
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

		$query = "SELECT bm.*, lc.`content_id`, lc.`title`, lc.`data`, lcds.`data` AS `summary`
			FROM `".BIT_DB_PREFIX."gmaps` bm 
			INNER JOIN `".BIT_DB_PREFIX."liberty_content` lc ON( lc.`content_id` = bm.`content_id` )
			LEFT OUTER JOIN `".BIT_DB_PREFIX."liberty_content_data` lcds ON (lc.`content_id` = lcds.`content_id` AND lcds.`data_type`='summary')
			".( !empty( $mid )? $mid.' AND ' : ' WHERE ' )." lc.`content_type_guid` = '".BITGMAP_CONTENT_TYPE_GUID."'
			ORDER BY ".$this->mDb->convertSortmode( $sort_mode );
		$query_cant = "select count( * )from `".BIT_DB_PREFIX."liberty_content` lc ".( !empty( $mid )? $mid.' AND ' : ' WHERE ' )." lc.`content_type_guid` = '".BITGMAP_CONTENT_TYPE_GUID."'";
		$result = $this->mDb->query( $query,$bindvars,$max_records,$offset );
		$ret = array();
		
		$comment = &new LibertyComment();
		while( $res = $result->fetchRow() ) {
			if( $this->getPreference('allow_comments', null, $res['content_id']) == 'y' ) {
				$res['num_comments'] = $comment->getNumComments( $res['content_id'] );
			}
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

		if( isset( $pParamHash['map_w'] ) && is_numeric( $pParamHash['map_w'] ) ) {
			$pParamHash['gmap_store']['width'] = $pParamHash['map_w'];
		}
		if( isset( $pParamHash['map_h'] ) && is_numeric( $pParamHash['map_h'] ) ) {
			$pParamHash['gmap_store']['height'] = $pParamHash['map_h'];
		}		
		if( isset( $pParamHash['map_z'] ) && is_numeric( $pParamHash['map_z'] ) ) {
			$pParamHash['gmap_store']['zoom'] = $pParamHash['map_z'];
		}
		if( isset( $pParamHash['maptype'] ) && is_numeric( $pParamHash['maptype'] ) ) {
			$pParamHash['gmap_store']['maptype'] = $pParamHash['maptype'];
		}
		if( !empty( $pParamHash['map_showcont'] ) ) {
			$pParamHash['gmap_store']['zoom_control'] = $pParamHash['map_showcont'];
		}
		if( !empty( $pParamHash['map_showtypecont'] ) ) {
			$pParamHash['gmap_store']['maptype_control'] = $pParamHash['map_showtypecont'];
		}
		if( !empty( $pParamHash['map_overview'] ) ) {
			$pParamHash['gmap_store']['overview_control'] = $pParamHash['map_overview'];
		}
		if( !empty( $pParamHash['map_showscale'] ) ) {
			$pParamHash['gmap_store']['scale'] = $pParamHash['map_showscale'] ;
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
//				vd($pParamHash['gmap_store']);
//				die;
					// store the posted changes
					$this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps", $pParamHash['gmap_store'], array( "gmap_id" => $this->mGmapId ) );
				} else {
					$pParamHash['gmap_store']['content_id'] = $this->mContentId;
					$pParamHash['gmap_store']['gmap_id'] = $this->mDb->GenID( 'gmaps_gmap_id_seq' );
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

		if( !empty( $pParamHash['shortname'] ) ) {
			$pParamHash['maptype_store']['shortname'] = $pParamHash['shortname'];
		}

		if( !empty( $pParamHash['description'] ) ) {
			$pParamHash['maptype_store']['description'] = $pParamHash['description'];
		}

		if( isset( $pParamHash['minzoom'] ) && is_numeric( $pParamHash['minzoom'] ) ) {
			$pParamHash['maptype_store']['minzoom'] = $pParamHash['minzoom'];
		}

		if( isset( $pParamHash['maxzoom'] ) && is_numeric( $pParamHash['maxzoom'] ) ) {
			$pParamHash['maptype_store']['maxzoom'] = $pParamHash['maxzoom'];
		}

		if( !empty( $pParamHash['errormsg'] ) ) {
			$pParamHash['maptype_store']['errormsg'] = $pParamHash['errormsg'];
		}

		global $gBitUser;
		$pParamHash['maptype_store']['user_id'] = $gBitUser->mUserId;

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
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_maptypes", $pParamHash['maptype_store'], array( "maptype_id" => $pParamHash['maptype_id'] ) );
			}else{
				 $pParamHash['maptype_id'] = $this->mDb->GenID( 'gmaps_maptypes_maptype_id_seq' );
				 $pParamHash['maptype_store']['maptype_id'] = $pParamHash['maptype_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_maptypes", $pParamHash['maptype_store'] );
				 // if its a new maptype we also get a set_id for the keychain and automaticallly associate it with a map.
				 $pParamHash['keychain_store']['set_id'] = $pParamHash['maptype_store']['maptype_id'];
				 $pParamHash['keychain_store']['set_type'] = "maptypes";
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_sets_keychain", $pParamHash['keychain_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getMapType($pParamHash['maptype_id']);
		}
		return $result;
	}
	
	
	function verifyTilelayer( &$pParamHash ) {

		$pParamHash['tilelayer_store'] = array();

		if( !empty( $pParamHash['tiles_name'] ) ) {
			$pParamHash['tilelayer_store']['tiles_name'] = $pParamHash['tiles_name'];
		}

		if( isset( $pParamHash['tiles_minzoom'] ) && is_numeric( $pParamHash['tiles_minzoom'] ) ) {
			$pParamHash['tilelayer_store']['tiles_minzoom'] = $pParamHash['tiles_minzoom'];
		}

		if( isset( $pParamHash['tiles_maxzoom'] ) && is_numeric( $pParamHash['tiles_maxzoom'] ) ) {
			$pParamHash['tilelayer_store']['tiles_maxzoom'] = $pParamHash['tiles_maxzoom'];
		}
		
		if( !empty( $pParamHash['ispng'] ) ) {
			$pParamHash['tilelayer_store']['ispng'] = $pParamHash['ispng'];
		}

		if( !empty( $pParamHash['tilesurl'] ) ) {
			$pParamHash['tilelayer_store']['tilesurl'] = $pParamHash['tilesurl'];
		}

		if( isset( $pParamHash['opacity'] ) && is_numeric( $pParamHash['opacity'] ) ) {
			$pParamHash['tilelayer_store']['opacity'] = $pParamHash['opacity'];
		}

		// if we have a maptype id we'll also update the keychain
		if( isset( $pParamHash['maptype_id'] ) ){
			$pParamHash['keychain_store'] = array( 'maptype_id' => $pParamHash['maptype_id'] );
			$pParamHash['keychain_store']['pos'] = ( isset( $pParamHash['pos'] ) && is_numeric( $pParamHash['pos'] ) )?$pParamHash['pos']:1;
		}

		return( count( $this->mErrors ) == 0 );
	}
	
	function storeTilelayer( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyTilelayer( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['tilelayer_id'] ) ) {			
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_tilelayers", $pParamHash['tilelayer_store'], array( "tilelayer_id" => $pParamHash['tilelayer_id'] ) );
				 if ( !empty( $pParamHash['keychain_store'] ) ){
					 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_tilelayers_keychain", $pParamHash['keychain_store'], array( "tilelayer_id" => $pParamHash['tilelayer_id'] ) );
				 }
			}else{
				 $pParamHash['tilelayer_id'] = $this->mDb->GenID( 'gmaps_tilelayers_tilelayer_id_seq' );
				 $pParamHash['tilelayer_store']['tilelayer_id'] = $pParamHash['tilelayer_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_tilelayers", $pParamHash['tilelayer_store'] );				 
				 // if its a new tilelayer we also associate it with a maptype.
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_tilelayers_keychain", $pParamHash['keychain_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getTilelayer($pParamHash);
		}
		return $result;
	}
	

	function verifyCopyright( &$pParamHash ) {

		$pParamHash['copyright_store'] = array();

		if( isset( $pParamHash['copyright_minzoom'] ) && is_numeric( $pParamHash['copyright_minzoom'] ) ) {
			$pParamHash['copyright_store']['copyright_minzoom'] = $pParamHash['copyright_minzoom'];
		}

		if( !empty( $pParamHash['bounds'] ) ) {
			$pParamHash['copyright_store']['bounds'] = $pParamHash['bounds'];
		}

		if( !empty( $pParamHash['notice'] ) ) {
			$pParamHash['copyright_store']['notice'] = $pParamHash['notice'];
		}

		return( count( $this->mErrors ) == 0 );
	}
	
	function storeCopyright( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyCopyright( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['copyright_id'] ) ) {			
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_copyrights", $pParamHash['copyright_store'], array( "copyright_id" => $pParamHash['copyright_id'] ) );
			}else{
				 $pParamHash['copyright_id'] = $this->mDb->GenID( 'gmaps_copyrights_copyright_id_seq' );
				 $pParamHash['copyright_store']['copyright_id'] = $pParamHash['copyright_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_copyrights", $pParamHash['copyright_store'] );
				 // if its a new copyright we also get a tilelayer_id for the keychain and automaticallly associate it with a tilelayer.
				 $pParamHash['keychain_store']['tilelayer_id'] = $pParamHash['tilelayer_id'];
				 $pParamHash['keychain_store']['copyright_id'] = $pParamHash['copyright_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_copyrights_keychain", $pParamHash['keychain_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getCopyright($pParamHash['copyright_id']);
		}
		return $result;
	}



	function verifyMarkerStyle( &$pParamHash ) {

		$pParamHash['markerstyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['markerstyle_store']['name'] = $pParamHash['name'];
		}
		
		if( isset( $pParamHash['marker_style_type'] ) && is_numeric( $pParamHash['marker_style_type'] ) ) {
			$pParamHash['markerstyle_store']['marker_style_type'] = $pParamHash['marker_style_type'];
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
		
		global $gBitUser;
		$pParamHash['markerstyle_store']['user_id'] = $gBitUser->mUserId;
		
		return( count( $this->mErrors ) == 0 );
	}
	
	function storeMarkerStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyMarkerStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['style_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_marker_styles", $pParamHash['markerstyle_store'], array( "style_id" => $pParamHash['style_id'] ) );
			}else{
				 $pParamHash['style_id'] = $this->mDb->GenID( 'gmaps_marker_styles_style_id_seq' );
				 $pParamHash['markerstyle_store']['style_id'] = $pParamHash['style_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_marker_styles", $pParamHash['markerstyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getMarkerStyle($pParamHash['style_id']);
		}
		return $result;
	}




	function verifyIconStyle( &$pParamHash ) {

		$pParamHash['iconstyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['iconstyle_store']['name'] = $pParamHash['name'];
		}

		if( isset( $pParamHash['icon_style_type'] ) && is_numeric( $pParamHash['icon_style_type'] ) ) {
			$pParamHash['iconstyle_store']['icon_style_type'] = $pParamHash['icon_style_type'];
		}
		
		if( !empty( $pParamHash['icon_image'] ) ) {
			$pParamHash['iconstyle_store']['image'] = $pParamHash['icon_image'];
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

		global $gBitUser;
		$pParamHash['iconstyle_store']['user_id'] = $gBitUser->mUserId;

		return( count( $this->mErrors ) == 0 );
	}
	
	function storeIconStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyIconStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['icon_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_icon_styles", $pParamHash['iconstyle_store'], array( "icon_id" => $pParamHash['icon_id'] ) );
			}else{
				 $pParamHash['icon_id'] = $this->mDb->GenID( 'gmaps_icon_styles_icon_id_seq' );
				 $pParamHash['iconstyle_store']['icon_id'] = $pParamHash['icon_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_icon_styles", $pParamHash['iconstyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getIconStyle($pParamHash['icon_id']);
		}
		return $result;
	}


	

	function verifyPolylineStyle( &$pParamHash ) {

		$pParamHash['polylinestyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polylinestyle_store']['name'] = $pParamHash['name'];
		}

		if( isset( $pParamHash['polyline_style_type'] ) && is_numeric( $pParamHash['polyline_style_type'] ) ) {
			$pParamHash['polylinestyle_store']['polyline_style_type'] = $pParamHash['polyline_style_type'];
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
		
		global $gBitUser;
		$pParamHash['polylinestyle_store']['user_id'] = $gBitUser->mUserId;
				
		return( count( $this->mErrors ) == 0 );
	}
	
	function storePolylineStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolylineStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['style_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polyline_styles", $pParamHash['polylinestyle_store'], array( "style_id" => $pParamHash['style_id'] ) );
			}else{
				 $pParamHash['style_id'] = $this->mDb->GenID( 'gmaps_polyline_styles_style_id_seq' );
				 $pParamHash['polylinestyle_store']['style_id'] = $pParamHash['style_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polyline_styles", $pParamHash['polylinestyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolylineStyle($pParamHash['style_id']);
		}
		return $result;
	}
		




	function verifyPolygonStyle( &$pParamHash ) {

		$pParamHash['polygonstyle_store'] = array();

		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['polygonstyle_store']['name'] = $pParamHash['name'];
		}

		if( isset( $pParamHash['polygon_style_type'] ) && is_numeric( $pParamHash['polygon_style_type'] ) ) {
			$pParamHash['polygonstyle_store']['polygon_style_type'] = $pParamHash['polygon_style_type'];
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
		
		global $gBitUser;
		$pParamHash['polygonstyle_store']['user_id'] = $gBitUser->mUserId;

		return( count( $this->mErrors ) == 0 );
	}
	
	function storePolygonStyle( &$pParamHash ) {
		$return = FALSE;
		if( $this->verifyPolygonStyle( $pParamHash ) ) {
			$this->mDb->StartTrans();
			// store the posted changes
			if ( !empty( $pParamHash['style_id'] ) ) {
				 $this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_polygon_styles", $pParamHash['polygonstyle_store'], array( "style_id" => $pParamHash['style_id'] ) );
			}else{
				 $pParamHash['style_id'] = $this->mDb->GenID( 'gmaps_polygon_styles_style_id_seq' );
				 $pParamHash['polygonstyle_store']['style_id'] = $pParamHash['style_id'];
				 $this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_polygon_styles", $pParamHash['polygonstyle_store'] );
			}
			$this->mDb->CompleteTrans();

			// re-query to confirm results
			$result = $this->getPolygonStyle($pParamHash['style_id']);
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
			if( LibertyMime::expunge() ) {
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
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_maptypes` 
				WHERE `maptype_id` =?";
			$result = $this->mDb->query( $query, array( $pParamHash['maptype_id'] ) );
			$this->mDb->CompleteTrans();

			// delete all references to the maptype from the map sets keychain
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` 
				WHERE `set_id` =?
				AND `set_type` ='maptypes'";
			$result = $this->mDb->query( $query, array( $pParamHash['maptype_id'] ) );
			$this->mDb->CompleteTrans();

  			// delete all references to the marker set from the marker keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_tilelayers_keychain` 
    			WHERE `maptype_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['maptype_id'] ) );
    		$this->mDb->CompleteTrans();				
				
			$ret = TRUE;		
		}
		
		return $ret;
	}	


	/**
	* This function deletes a tilelayer and all references to it in the tilelayers keychain
	**/
	function expungeTilelayer(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['tilelayer_id'] ) && is_numeric( $pParamHash['tilelayer_id'] ) ) {
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_tilelayers` 
				WHERE `tilelayer_id` =?";
			$result = $this->mDb->query( $query, array( $pParamHash['tilelayer_id'] ) );
			$this->mDb->CompleteTrans();

			// delete all references to the tilelayer from the tilelayers keychain
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_tilelayers_keychain` 
				WHERE `tilelayer_id` =?";
			$result = $this->mDb->query( $query, array( $pParamHash['tilelayer_id'] ) );
			$this->mDb->CompleteTrans();

  			// delete all references to the tilelayer set from the copyright keychain
  			$this->mDb->StartTrans();
    		$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_copyrights_keychain` 
    			WHERE `tilelayer_id` =?";
    		$result = $this->mDb->query( $query, array( $pParamHash['tilelayer_id'] ) );
    		$this->mDb->CompleteTrans();

			$ret = TRUE;		
		}
		
		return $ret;
	}	


	/**
	* This function deletes a copyright and all references to it in the copyright keychain
	**/
	function expungeCopyright(&$pParamHash) {
		$ret = FALSE;

		if( !empty( $pParamHash['copyright_id'] ) && is_numeric( $pParamHash['copyright_id'] ) ) {
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_copyrights` 
				WHERE `copyright_id` =?";
			$result = $this->mDb->query( $query, array( $pParamHash['copyright_id'] ) );
			$this->mDb->CompleteTrans();

			// delete all references to the copyright from the copyrights keychain
			$this->mDb->StartTrans();
			$query = "DELETE FROM `".BIT_DB_PREFIX."gmaps_copyrights_keychain` 
				WHERE `copyright_id` =?";
			$result = $this->mDb->query( $query, array( $pParamHash['copyright_id'] ) );
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
  			AND `set_type` = 'maptypes'";
  			$result = $this->mDb->query( $query, $pParamHash['maptype_remove'] );
  			$ret = TRUE;
  			$this->mDb->CompleteTrans();
  		}

		return $ret;
	}
	
	
	
	/**
	* Make sure gmap is loaded and valid
	**/
	function isValid() {
		return( $this->verifyId( $this->mGmapId ) );
	}

	/**
	 * Function that determines if this content specified permission for the current gBitUser. 
	 * Override LibertyContent method default $pCheckGlobalPerm=FALSE to enable shared editing
	 * See LibertyContent method for defaults
	*/
	/*
	function hasEditPermission( $pVerifyAccessControl=TRUE, $pCheckGlobalPerm=TRUE ) {
		return( $this->hasUserPermission( $this->mEditContentPerm, $pVerifyAccessControl, $pCheckGlobalPerm ) );
	}
	*/
	
	// === verifyEditPermission
	/**
	 * Function that determines if this content specified permission for the current gBitUser. 
	 * Override LibertyContent method default $pCheckGlobalPerm=FALSE to enable shared editing
	 * See LibertyContent method for defaults
	*/
	/*
	function verifyEditPermission( $pVerifyAccessControl=TRUE, $pCheckGlobalPerm=TRUE ) {
		return parent::verifyEditPermission( $pVerifyAccessControl, $pCheckGlobalPerm );
	}
	*/
	
	/**
	* Generates the URL to the gmap page
	* @param pMixed a hash passed in by LibertyContent:getList
	* @return the link to display the gmap.
	*/
	function getDisplayUrl( $pContentId=NULL, $pMixed=NULL ) {
		$ret = NULL;
		$id = NULL;
		if( empty( $this->mGmapId ) && empty( $pMixed['gmap_id'] ) && !empty( $pContentId ) ) {
  			$this->mDb->StartTrans();
  			$query = "SELECT `gmap_id` FROM `".BIT_DB_PREFIX."gmaps` WHERE `content_id` = ?";
  			$result = $this->mDb->query( $query, $pContentId );
  			$this->mDb->CompleteTrans();
  			$res = $result->fetchrow();
  			$id = $res['gmap_id'];
  		}
	
		if( empty( $this->mGmapId ) && !empty( $pMixed['gmap_id'] )) {
			$id = $pMixed['gmap_id'];
		}
		
		if( !empty( $this->mGmapId ) ) {
			$id = $this->mGmapId;
		}
		
		if ($id != NULL){
			$ret = GMAP_PKG_URL."index.php?gmap_id=".$id;
		} elseif( @BitBase::verifyId( $pMixed['content_id'] ) ) {
			$ret = BIT_ROOT_URL.'index.php?content_id='.$pMixed['content_id'];
		} elseif( $this->isValid() ) {
			$ret = BIT_ROOT_URL.'index.php?content_id='.$this->mContentId;
		}
		return $ret;
	}
	
	function setEditSharing(&$pParamHash){
		if ( isset( $pParamHash['share_edit'] ) ){
			$this->storePermission( 3, 'p_gmap_edit' );
		}else{
			$this->removePermission( 3, 'p_gmap_edit' ); 
		}
	}
	
	function isEditShared(){
		$ret = FALSE;
		if ( isset( $this->mPerms['p_gmap_edit'] ) && $this->mPerms['p_gmap_edit']['group_id'] == 3 && $this->mPerms['p_gmap_edit']['is_revoked'] != "y"){
			$ret = TRUE;
		}
		return $ret;
	}

	function setAllowChildren(&$pParamHash){
		if ( isset( $pParamHash['allow_children'] ) ){
			$this->storePermission( 3, 'p_gmap_attach_children' );
		}else{
			$this->removePermission( 3, 'p_gmap_attach_children' ); 
		}
	}
	
	function childrenAllowed(){
		$ret = FALSE;
		if ( isset( $this->mPerms['p_gmap_attach_children'] ) && $this->mPerms['p_gmap_attach_children']['group_id'] == 3 && $this->mPerms['p_gmap_attach_children']['is_revoked'] != "y"){
			$ret = TRUE;
		}
		return $ret;
	}	


	/* ============= Icon styles and themes ============= */

	/**
	 * getIconList 
	 * 
	 * @param array $pListHash 
	 * @access public
	 * @return array of icons
	 */
	function getIconList( &$pListHash = NULL ) {
		$whereSql = "";
		$bindVars = $ret = array();

		if( empty( $pListHash['sort_mode'] )) {
			$pListHash['sort_mode'] = array( 'gmit.`theme_title_asc`', 'gmis.`name_asc`' );
		}
		$this->prepGetList( $pListHash );

		if( !empty( $pListHash['theme_title'] )) {
			$pListHash['theme_id'] = $this->getIconThemeId( $pListHash['theme_title'] );
		}

		if( @BitBase::verifyId( $pListHash['theme_id'] )) {
			$whereSql = " WHERE gmis.`theme_id` = ? ";
			$bindVars[] = $pListHash['theme_id'];
		}

		$sql = "SELECT gmis.`icon_id` AS `key`, gmis.*, gmit.`theme_title`
			FROM `".BIT_DB_PREFIX."gmaps_icon_styles` gmis
				INNER JOIN `".BIT_DB_PREFIX."gmaps_icon_themes` gmit ON( gmit.`theme_id` = gmis.`theme_id` )
			$whereSql
			ORDER BY ".$this->mDb->convertSortmode( $pListHash['sort_mode'] );
		$result = $this->mDb->query( $sql, $bindVars, $pListHash['max_records'], $pListHash['offset'] );
		while( $aux = $result->fetchRow() ) {
			// convert relative path to valid url
			$aux['image'] = BIT_ROOT_URL.str_replace( '//', '/', str_replace( '+', '%20', str_replace( '%2F', '/', urlencode( $aux['image'] ))));
			$ret[] = $aux;
		}

		$pListHash['cant'] = $this->mDb->getOne( "SELECT COUNT( `icon_id` ) FROM `".BIT_DB_PREFIX."gmaps_icon_styles` gmis $whereSql", $bindVars );

		LibertyContent::postGetList( $pListHash );
		return $ret;
	}

	/**
	 * getIconThemes 
	 * 
	 * @access public
	 * @return array of all available icon themes
	 */
	function getIconThemes() {
		// INNER JOIN is needed to weed out themes that don't have icons in them
		// this can happen when you remove a dir of icons and run importIcons();
		return( $this->mDb->getAssoc( "
			SELECT git.`theme_id`, git.`theme_title`
			FROM `".BIT_DB_PREFIX."gmaps_icon_themes` git
				INNER JOIN `".BIT_DB_PREFIX."gmaps_icon_styles` gis ON( gis.`theme_id` = git.`theme_id` )
			ORDER BY ".$this->mDb->convertSortmode( 'theme_title_asc' )
		));
	}

	/**
	 * fetchIcons 
	 * 
	 * @param string $pDir absolute path to dir that should be scanned
	 * @access public
	 * @return nested array of all icons found in path
	 */
	function fetchIcons( $pDir ) {
		$ret = array();
		if( !empty( $pDir ) && is_dir( $pDir ) && $handle = opendir( $pDir )) {
			while( FALSE !== ( $file = readdir( $handle ))) {
				if( !preg_match( "#^\.#", $file ) && $file != 'CVS' ) {
					if( is_dir( $pDir."/".$file )) {
						$theme[$file] = $this->fetchIcons( $pDir."/".$file );
					// include icons setup file
					} elseif( $file == 'gmap_icons.tsv' ) {
						$lines = explode( "\n", file_get_contents( $pDir."/".$file ));
						// first line contains columns
						$tableColumns = explode( "\t", array_shift( $lines ));
						$i = 0;

						// a list of valid columns that can be set using the tsv file
						$validColumns = array(
							"name",
							"icon_style_type",
							"rollover_image",
							"shadow_image",
							"shadow_w",
							"shadow_h",
							"icon_anchor_x",
							"icon_anchor_y",
							"shadow_anchor_x",
							"shadow_anchor_y",
							"infowindow_anchor_x",
							"infowindow_anchor_y",
							"image_map",
						);

						foreach( $lines as $line ) {
							if( !empty( $line ) && !preg_match( "/^#/", $line )) {
								$key = $i++;
								foreach( explode( "\t", $line ) as $k => $value ) {
									if( !empty( $tableColumns[$k] ) && in_array( $tableColumns[$k], $validColumns )) {
										$settings[$tableColumns[$k]] = $value;

										// we place default settings in 'default' for easy retrieval later
										if( $tableColumns[$k] == 'name' && $value == "DEFAULT" ) {
											$key = 'default';
										}
									}
								}
								$theme['settings'][$key] = $settings;
							}
						}
					// avoid picking up icons in icons/ dir
					} elseif( basename( $pDir ) != 'icons' && preg_match( "#\.(png|jpe?g|gif|bmp|tiff?)$#i", $file )) {
						// too lazy to code this for servers without GD installed
						list( $width, $height, $type, $attr ) = @getimagesize( $pDir."/".$file );
						$theme['icons'][] = array(
							'icon_w' => $width,
							'icon_h' => $height,
							'name' => $file,
							'image' => str_replace( BIT_ROOT_PATH, "", $pDir )."/".$file,
							//'image' => BIT_ROOT_URL.str_replace( '//', '/', str_replace( '+', '%20', str_replace( '%2F', '/', urlencode( str_replace( BIT_ROOT_PATH, "", $pDir )."/".$file )))),
						);
					}
				}
			}
			closedir( $handle );
			if( !empty( $theme )) {
				$ret = array_merge( $theme, $ret );
			}
		}
		return $ret;
	}

	/**
	 * importIcons store all icons recursively found in $pDir
	 * NOTE: This process is _very_ expensive and you should only run this when absoluteley needed.
	 * 
	 * @param array $pDir 
	 * @access public
	 * @return void
	 */
	function importIcons( $pDir ) {
		global $gBitUser;
		if( $iconThemes = $this->fetchIcons( $pDir )) {
			foreach( $iconThemes as $theme => $data ) {
				$theme_id = $this->storeIconTheme( $theme );
				if( !empty( $data['icons'] )) {
					foreach( $data['icons'] as $icon ) {
						$icon['theme_id'] = $theme_id;
						$icon['user_id']  = $gBitUser->mUserId;
						$this->storeIcon( $icon );
					}
				}

				if( !empty( $data['settings'] )) {
					$this->storeIconThemeSettings( $theme_id, $data['settings'] );
				}
			}
		}

		$this->pruneIcons();
	}

	/**
	 * storeIcon 
	 * 
	 * @param array $pStoreHash icon information
	 *                          if no $pStoreHash['name'] is given and only a theme_id, all icons with that theme_id will be updated
	 * @access public
	 * @return TRUE on success, FALSE on failure - mErrors will contain reason for failure
	 */
	function storeIcon( $pStoreHash ) {
		if( empty( $pStoreHash['theme_id'] )) {
			$pStoreHash['theme_id'] = $this->storeIconTheme( 'Custom icons' );
		}

		// either update or insert icon based on information we have available
		if( !empty( $pStoreHash['name'] ) && @BitBase::verifyId( $pStoreHash['theme_id'] )) {
			if( $icon_id = $this->mDb->getOne( "SELECT `icon_id` FROM `".BIT_DB_PREFIX."gmaps_icon_styles` WHERE `theme_id` = ? AND `name` = ?", array( $pStoreHash['theme_id'], $pStoreHash['name'] ))) {
				$this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_icon_styles", $pStoreHash, array( 'icon_id' => $icon_id ));
			} elseif( !empty( $pStoreHash['image'] ) && is_readable( BIT_ROOT_PATH.$pStoreHash['image'] )) {
				$pStoreHash['icon_id'] = $this->mDb->GenID( 'gmaps_icon_styles_icon_id_seq' );
				$this->mDb->associateInsert( BIT_DB_PREFIX."gmaps_icon_styles", $pStoreHash );
			}
		} elseif( @BitBase::verifyId( $pStoreHash['theme_id'] )) {
			$this->mDb->associateUpdate( BIT_DB_PREFIX."gmaps_icon_styles", $pStoreHash, array( 'theme_id' => $pStoreHash['theme_id'] ));
		}
	}

	/**
	 * pruneIcons remove icons that have been removed from the server
	 * 
	 * @access public
	 * @return TRUE on success, FALSE on failure - mErrors will contain reason for failure
	 */
	function pruneIcons() {
		foreach( $this->mDb->getAll( "SELECT `icon_id`,`image` FROM `".BIT_DB_PREFIX."gmaps_icon_styles`" ) as $icon ) {
			if( empty( $icon['image'] ) || !is_readable( BIT_ROOT_PATH.$icon['image'] )) {
				$this->mDb->query( "DELETE FROM `".BIT_DB_PREFIX."gmaps_icon_styles` WHERE `icon_id` = ?", array( $icon['icon_id'] ));
			}
		}
	}

	/**
	 * storeIconThemeSettings will store information extracted from the gmap_icons.tsv file
	 * 
	 * @param array $pThemeId Theme ID
	 * @param array $pStoreHash array of icons
	 * @access public
	 * @return TRUE on success, FALSE on failure - mErrors will contain reason for failure
	 */
	function storeIconThemeSettings( $pThemeId, $pStoreHash ) {
		if( BitBase::verifyId( $pThemeId )) {
			if( !empty( $pStoreHash['default'] ) && is_array( $pStoreHash['default'] )) {
				// these are the default settings for all icons in this theme
				$default = $pStoreHash['default'];
				$default['theme_id'] = $pThemeId;
				unset( $default['name'] );
				unset( $pStoreHash['default'] );
				$this->storeIcon( $default );

				foreach( $pStoreHash as $icon ) {
					// we need to replace empty icon values with the default ones
					foreach( $icon as $key => $value ) {
						if( empty( $value )) {
							unset( $icon[$key] );
						}
					}
					$icon = array_merge( $default, $icon );
					$this->storeIcon( $icon );
				}
			}
		}
	}

	/**
	 * storeIconTheme store icon theme if it's new
	 * 
	 * @param array $pTheme name of the icon theme
	 * @access public
	 * @return theme_id of stored theme
	 */
	function storeIconTheme( $pTheme ) {
		global $gBitSystem;
		$ret = FALSE;
		if( !empty( $pTheme )) {
			if( !( $ret = $this->getIconThemeId( $pTheme ))) {
				$store = array(
					"theme_id"    => $gBitSystem->mDb->GenID( "gmaps_icon_theme_id_seq" ),
					"theme_title" => $pTheme,
				);
				$gBitSystem->mDb->associateInsert( BIT_DB_PREFIX."gmaps_icon_themes", $store );
				$ret = $store["theme_id"];
			}
		}
		return $ret;
	}

	/**
	 * getIconThemeId get icon theme id based on theme name
	 * 
	 * @param array $pTheme name of the icon theme
	 * @access public
	 * @return theme_id if it was found in the database
	 */
	function getIconThemeId( $pTheme ) {
		$ret = FALSE;
		if( !empty( $pTheme )) {
			$ret = $this->mDb->getOne( "SELECT `theme_id` FROM `".BIT_DB_PREFIX."gmaps_icon_themes` WHERE `theme_title` = ?", array( $pTheme ));
		}
		return $ret;
	}
}


function gmap_content_edit( &$pObject ) {
	global $gBitSmarty;
	global $gBitSystem;
	if( $gBitSystem->isFeatureActive('gmap_api_key') && $gBitSystem->isFeatureActive( 'gmap_map_'.$pObject->getContentType() ) ) {
		$pObject->mInfo['zoom'] = $pObject->getPreference( 'gmap_zoom', NULL );
		$gBitSmarty->assign('geo_edit_serv', TRUE);
		$gBitSystem->mOnload[] = 'BitMap.EditContent();';
	}
}


function gmap_content_preview( &$pObject) {
	global $gBitSystem, $gBitSmarty;
	if( $gBitSystem->isFeatureActive('gmap_api_key') && $gBitSystem->isFeatureActive( 'gmap_map_'.$pObject->getContentType() ) ) {
		$gBitSmarty->assign('geo_edit_serv', TRUE);
		$gBitSystem->mOnload[] = 'BitMap.EditContent();';
		if ( isset( $_REQUEST['geo']['lat'] ) && isset( $_REQUEST['geo']['lng'] ) ) {
			$pObject->mInfo['lat'] = $_REQUEST['geo']['lat'];
			$pObject->mInfo['lng'] = $_REQUEST['geo']['lng'];
		}
	}
}
function gmap_content_store( &$pObject, &$pParamHash ) {
	global $gBitSystem;
	$errors = NULL;
	// If a content access system is active, let's call it
	if( $gBitSystem->isFeatureActive('gmap_api_key') && $gBitSystem->isFeatureActive( 'gmap_map_'.$pObject->getContentType() ) ) {
		$pObject->storePreference( 'gmap_zoom', !empty( $_REQUEST["gmap_zoom"] ) && is_numeric( $_REQUEST["gmap_zoom"] ) ? $_REQUEST["gmap_zoom"] : NULL );
	}
	return( $errors );
}
?>
