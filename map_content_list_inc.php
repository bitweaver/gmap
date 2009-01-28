<?php

if ( $gBitSystem->isPackageActive('geo') && 
	 $gBitSystem->isPackageActive('gmap') &&
	 $gBitSystem->isFeatureActive('gmap_api_key') ){	

	// get users geo location if they have one
	/**
	 * @TODO this really should be taken care of the initial load of gBitUser, however
	 * because of the way each bit_setup_inc file is currently processed it doesn't happen.
	 * bitweaver needs better initialization process, then this cruft can be removed.
	 **/
	require_once( GEO_PKG_PATH.'LibertyGeo.php' );
	$geo = new LibertyGeo( $gBitUser->mContentId );	
	$geo->load();
	if ( is_numeric( $geo->getField( 'lat' ) ) ){
		$geo->mInfo['zoom'] = 10;
		$gBitSmarty->assign( 'mapInfo', $geo->mInfo );
	}

	// if we have at least one content type guid then we want a list
	if ( !empty($_REQUEST['content_type_guid']) ){
		if( $_REQUEST['content_type_guid'] == 'Any' ){
			$_REQUEST['content_type_guid'] = NULL;
		}

		//forces return of $contentList from get_content_list_inc.php
		$_REQUEST['output'] = 'raw';
		//forces only geo located data
		$_REQUEST['geo_notnull'] = TRUE;
		include_once( LIBERTY_PKG_PATH.'list_content.php' );
		$gBitSmarty->assign_by_ref('listcontent', $contentList);
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
