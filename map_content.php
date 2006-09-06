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
  $_REQUEST['output'] = 'raw';
  include_once( LIBERTY_PKG_PATH.'get_content_list_inc.php' );
  $gBitSmarty->assign_by_ref('listcontent', $contentList["data"]);
  $gBitSmarty->assign('map_list', TRUE);
  $gBitSystem->mOnload[] = 'BitMap.DisplayList();';
  $gBitSystem->display( 'bitpackage:gmap/map_list.tpl', tra( 'Gmap' ) );
}

?>
