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
    $_REQUEST['geonotnull'] = TRUE;
    include_once( LIBERTY_PKG_PATH.'list_content.php' );
    $gBitSmarty->assign_by_ref('listcontent', $contentList["data"]);
  }

  //php is annoying, so 0 would be interpretted as null and not trigger the tpl this relates too.  
  $GeoStars = array('stars_pixels' => 1, 'stars_version_pixels' => 1, 'stars_load' => 1);
  $gBitSmarty->assign('loadStars', TRUE);
  $gBitSmarty->assign_by_ref('GeoStars', $GeoStars);

  $gBitSmarty->assign('map_list', TRUE);
  $gBitSystem->mOnload[] = 'BitMap.DisplayList();';
  $gBitSystem->display( 'bitpackage:gmap/map_list.tpl', tra( 'Gmap' ) );
}

?>
