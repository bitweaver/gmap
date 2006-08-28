<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('bit_gm_edit_map' );

// Access the gmap class
global $gContent;
require_once( GMAP_PKG_PATH.'BitGmap.php');
require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );
$gContent = new BitGmap();

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

if (!empty($_REQUEST["save_polygon"])) {
    if( $result = $gContent->storePolygon( $_REQUEST ) ) {

				//if store is successful we return XML
				$mRet = "<polygon>"
      		    ."<polygon_id>".$result->fields['polygon_id']."</polygon_id>"
                ."<name>".$result->fields['name']."</name>"
                ."<circle>".$result->fields['circle']."</circle>"
                ."<points_data>".$result->fields['points_data']."</points_data>"
                ."<circle_center>".$result->fields['circle_center']."</circle_center>"
                ."<radius>".$result->fields['radius']."</radius>"
                ."<border_text>".$result->fields['border_text']."</border_text>"
                ."<zindex>".$result->fields['zindex']."</zindex>"
						."</polygon>";
													
    }else{
		//@todo - return some sort of store failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
//Check if this to remove from a set, or to delete completely
}elseif ( !empty($_REQUEST["remove_polygon"]) ) {
    if( $gContent->removePolygonFromSet( $_REQUEST ) ) {
				//if store is successful we return XML
				$mRet = "<remove>success</remove>";

		}else{
		//@todo - return some sort of remove failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}elseif (!empty($_REQUEST["expunge_polygon"])) {
    if( $gContent->expungePolygon( $_REQUEST ) ) {
				//if store is successful we return XML
				$mRet = "<remove>success</remove>";

		}else{
		//@todo - return some sort of remove failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}

//since we are returning xml we must report so in the header
//we also need to tell the browser not to cache the page
//see: http://mapki.com/index.php?title=Dynamic_XML
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
header("content-type:text/xml");
     		
print_r($mRet);

die;

?>	
