<?php
/**
 * @version $Header$
 *
 * Copyright (c) 2008 bitweaver.org
 * All Rights Reserved. See below for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 * @subpackage functions
 */

if ( $gBitSystem->isPackageActive('geo') && 
	 $gBitSystem->isPackageActive('gmap') &&
	 $gBitSystem->isFeatureActive('gmap_api_key') ){	

	// list results will be assigned to contentList by liberty
	$contentList = array();

	// get users geo location if they have one
	/**
	 * @TODO this really should be taken care of the initial load of gBitUser, however
	 * because of the way each bit_setup_inc file is currently processed it doesn't happen.
	 * bitweaver needs better initialization process, then this cruft can be removed.
	 **/
	require_once( GEO_PKG_PATH.'LibertyGeo.php' );
	$geo = new LibertyGeo( $gBitUser->mContentId );	
	$geo->load();
	array_push( $gBitUser->mInfo, $geo->mInfo );

	// if we have at least one content type guid or we have a distance request then we want a list
	if ( !empty($_REQUEST['content_type_guid']) || !empty( $_REQUEST['distance'] ) ){
		
		// if we have distance we need a center to check from
		if( !empty( $_REQUEST['distance'] ) ){
			if( !is_numeric( $_REQUEST['distance'] ) ){
				$gBitSystem->fatalError( 'Invalid distance value, distance must be a number. Note, the default unit is kilometers.' );
			}
			// start with defaults - we'll use these if we don't have a better reference point
			$dLat = $gBitSystem->getConfig('gmap_lat');
			$dLng = $gBitSystem->getConfig('gmap_lng');
			// if lat and lng are set and numeric use them otherwise fatal to report bad value
			if( !empty( $_REQUEST['lat'] ) && !empty( $_REQUEST['lng'] ) ){
				if(	!is_numeric( $_REQUEST['lat'] ) ){
					$gBitSystem->fatalError( 'Invalid latitude submitted, please check the lat value' );
				}
				if(	!is_numeric( $_REQUEST['lng'] ) ){
					$gBitSystem->fatalError( 'Invalid longitude submitted, please check the lng value' );
				}
				$dLat = $_REQUEST['lat'];
				$dLng = $_REQUEST['lng'];
			// if we have lat lng values for the user we use it as the center
			}elseif ( is_numeric( $gBitUser->getField( 'lat' ) ) ){
				$dLat = $gBitUser->getField( 'lat' );
				$dLng = $gBitUser->getField( 'lng' );
			}

			require_once( UTIL_PKG_PATH.'geocalc/GeoCalc.class.php' );
			$oGC = new GeoCalc();

			// distance in kilometers
			// @TODO turn this into a package config default
			$dRadius = $_REQUEST['distance'];
			// Calculate the boundary distance in degrees longitude / latitude
			$dAddLat = $oGC->getLatPerKm() * $dRadius;
			$dAddLon = $oGC->getLonPerKmAtLat($dLat) * $dRadius;
	 
			// trip the geo service
			$_REQUEST['up_lat'] = $dLat + $dAddLat;
			$_REQUEST['right_lng'] = $dLng + $dAddLon;
			$_REQUEST['down_lat'] = $dLat - $dAddLat;
			$_REQUEST['left_lng'] = $dLng - $dAddLon;
		}

		// can force a general lookup using Any param if distance is not specified
		if( !empty( $_REQUEST['content_type_guid'] ) && $_REQUEST['content_type_guid'] == 'Any' ){
			$_REQUEST['content_type_guid'] = NULL;
		}

		//forces return of $contentList from get_content_list_inc.php
		$_REQUEST['output'] = 'raw';
		//forces only geo located data
		$_REQUEST['geo_notnull'] = TRUE;
		include_once( LIBERTY_PKG_PATH.'list_content.php' );
		$gBitSmarty->assign_by_ref('listcontent', $contentList);
	}

	// if we have no results we want to default center on the users area if they have geo data
	if( count( $contentList ) == 0  && is_numeric( $gBitUser->getField( 'lat' ) ) ){
		$gBitUser->mInfo['zoom'] = 10;
		$gBitSmarty->assign( 'mapInfo', $gBitUser->mInfo );
	}

	//get content types in database list  
	$gBitSmarty->assign_by_ref('ContentTypes',  $gLibertySystem->mContentTypes);

	/** 
	 * additional package search options 
	 *
	 * @TODO would be nice if packages provided this as service 
	 **/
	//get pigeonholes list
	if ( $gBitSystem->isPackageActive('pigeonholes') ){			
		//this is just like pigeonholes:list.php without the tpl call
		$gBitSystem->verifyPermission( 'p_pigeonholes_view' );
		
		include_once( PIGEONHOLES_PKG_PATH.'lookup_pigeonholes_inc.php' );
		
		$listHash = &$_REQUEST;
		$listHash['load_only_root'] = TRUE;
		$listHash['sort_mode'] = !empty( $listHash['sort_mode'] ) ? $listHash['sort_mode'] : 'title_asc';
		$pigeonList = $gContent->getList( $listHash );
		
		// set up structure related stuff
		if( !empty( $pigeonList ) ) {
			foreach( $pigeonList as $key => $pigeonhole ) {
				if( empty( $gStructure ) ) {
					$gStructure = new LibertyStructure();
				}
				$pigeonList[$key]['subtree'] = $gStructure->getSubTree( $pigeonhole['root_structure_id'] );
				// add permissions to all so we know if we can display pages within category
		//		foreach( $pigeonList[$key]['subtree'] as $k => $node ) {
		//			$pigeonList[$key]['subtree'][$k]['preferences'] = $gContent->loadPreferences( $node['content_id'] );
		//		}
			}
			$gBitSmarty->assign( 'pigeonList', $pigeonList );
		}
		$gBitSmarty->assign( 'listInfo', $listHash['listInfo'] );
	}

	if ( $gBitSystem->isPackageActive('stars') ){			
		//php is annoying, so 0 would be interpretted as null and not trigger the tpl this relates too.  
		$GeoStars = array('stars_pixels' => 1, 'stars_version_pixels' => 1, 'stars_load' => 1);
		$gBitSmarty->assign('loadStars', TRUE);
		$gBitSmarty->assign_by_ref('GeoStars', $GeoStars);
	}
	/* end additional package search options */

	//use Mochikit - prototype sucks
	$gBitThemes->loadAjax( 'mochikit', array( 'Base.js', 'Iter.js', 'Async.js', 'DOM.js', 'DateTime.js',  'Style.js' ) );

	$gBitSmarty->assign('map_list', TRUE);
	$gBitSmarty->assign('map_search_srvc', TRUE);
	$gBitSystem->mOnload[] = 'BitMap.DisplayList();';
	//set pageTitle to override page name
	if( empty( $pageTitle ) ){ $pageTitle = tra( 'Map Geo-Located Site Content' ); }
	$gBitSmarty->assign( 'pageTitle', $pageTitle );
	$gBitSystem->display( 'bitpackage:gmap/map_list.tpl', $pageTitle , array( 'display_mode' => 'display' ));
	die;
}
