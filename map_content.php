<?php
/**
* required setup
*/
require_once( '../bit_setup_inc.php' );
/*
require_once( LIBERTY_PKG_PATH.'bit_setup_inc.php' );
*/

require_once( LIBERTY_PKG_PATH.'LibertyContent.php' );
global $gLibertySystem;

if ($gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap')){
	if ( !empty($_REQUEST['content_type_guid']) ){
		//forces return of $contentList from get_content_list_inc.php
		$_REQUEST['output'] = 'raw';
		//forces only geo located data
		$_REQUEST['geo_notnull'] = TRUE;
		include_once( LIBERTY_PKG_PATH.'list_content.php' );
		$gBitSmarty->assign_by_ref('listcontent', $contentList["data"]);
	}

	//get pigeonholes list
	//this is just like pigeonholes:list.php without the tpl call
	
	$gBitSystem->verifyPackage( 'pigeonholes' );
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
	
	//get content types in database list  
	$c_types = $gLibertySystem->mContentTypes;
	sort($c_types);
	$gBitSmarty->assign_by_ref('ContentTypes', $c_types);

	//php is annoying, so 0 would be interpretted as null and not trigger the tpl this relates too.  
	$GeoStars = array('stars_pixels' => 1, 'stars_version_pixels' => 1, 'stars_load' => 1);
	$gBitSmarty->assign('loadStars', TRUE);
	$gBitSmarty->assign_by_ref('GeoStars', $GeoStars);

	$gBitSmarty->assign('map_list', TRUE);
	$gBitSystem->mOnload[] = 'BitMap.DisplayList();';
	
    //use Mochikit - prototype sucks
	$gBitThemes->loadAjax( 'mochikit', array( 'Base.js', 'Iter.js', 'Async.js', 'DOM.js', 'DateTime.js',  'Style.js' ) );
	
	$gBitSystem->display( 'bitpackage:gmap/map_list.tpl', tra( 'Gmap' ) );
}
?>
