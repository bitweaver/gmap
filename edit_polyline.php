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

//Check if this is a update or a new map
if (!empty($_REQUEST["save_polyline"])) {
    if( $result = $gContent->storePolyline( $_REQUEST ) ) {

				//if store is successful we return XML
				$mRet = "<polyline>"
      		  ."<id>".$result->fields['polyline_id']."</id>"
              ."<name>".$result->fields['name']."</name>"
              ."<type>".$result->fields['type']."</type>"
              ."<points>".$result->fields['points_data']."</points>"
              ."<border>".$result->fields['border_text']."</border>"
              ."<z>".$result->fields['zindex']."</z>"
						  ."</polyline>";

				//@todo replace in xml when I know what I am doing
				//	."<data>".$gContent->parseData()."</data>"
					
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
								
    }else{
		//@todo - return some sort of store failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}

?>	
