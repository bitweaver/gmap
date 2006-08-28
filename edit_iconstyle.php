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

if (!empty($_REQUEST["save_iconstyle"])) {
    if( $result = $gContent->storeIconStyle( $_REQUEST ) ) {

				//@todo - returned results need to include all the associated style properties as well
				//if store is successful we return XML
				$mRet = "<iconstyle>"
      		  ."<icon_id>".$result->fields['icon_id']."</icon_id>"
      		  ."<name>".$result->fields['name']."</name>"
      		  ."<icon_style_type>".$result->fields['icon_style_type']."</icon_style_type>"
      		  ."<image>".$result->fields['image']."</image>"
      		  ."<rollover_image>".$result->fields['rollover_image']."</rollover_image>"
      		  ."<icon_w>".$result->fields['icon_w']."</icon_w>"
      		  ."<icon_h>".$result->fields['icon_h']."</icon_h>"
      		  ."<shadow_image>".$result->fields['shadow_image']."</shadow_image>"
      		  ."<shadow_w>".$result->fields['shadow_w']."</shadow_w>"
      		  ."<shadow_h>".$result->fields['shadow_h']."</shadow_h>"
      		  ."<icon_anchor_x>".$result->fields['icon_anchor_x']."</icon_anchor_x>"
      		  ."<icon_anchor_y>".$result->fields['icon_anchor_y']."</icon_anchor_y>"
      		  ."<shadow_anchor_x>".$result->fields['shadow_anchor_x']."</shadow_anchor_x>"
      		  ."<shadow_anchor_y>".$result->fields['shadow_anchor_y']."</shadow_anchor_y>"
      		  ."<infowindow_anchor_x>".$result->fields['infowindow_anchor_x']."</infowindow_anchor_x>"
      		  ."<infowindow_anchor_y>".$result->fields['infowindow_anchor_y']."</infowindow_anchor_y>"
      		  ."<points>".$result->fields['points']."</points>"
      		  ."<scale>".$result->fields['scale']."</scale>"
      		  ."<outline_color>".$result->fields['outline_color']."</outline_color>"
      		  ."<outline_weight>".$result->fields['outline_weight']."</outline_weight>"
      		  ."<fill_color>".$result->fields['fill_color']."</fill_color>"
      		  ."<fill_opacity>".$result->fields['fill_opacity']."</fill_opacity>"
						."</iconstyle>";

    }else{
		//@todo - return some sort of store failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}

//@todo currently there is no function for deleting a style

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
