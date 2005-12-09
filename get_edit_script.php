<?php 
// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

$gBitSystem->verifyPermission('bit_gm_edit_map' );


	//since we are returning js we must report so in the header
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
  header("content-type:text/javascript");


include("templates/formsubmit.js"); 
?>