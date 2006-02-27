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

if (!empty($_REQUEST["save_polylinestyle"])) {
    if( $result = $gContent->storePolylineStyle( $_REQUEST ) ) {

				//@todo - returned results need to include all the associated style properties as well
				//if store is successful we return XML
				$mRet = "<polylinestyle>"
      		  ."<style_id>".$result->fields['style_id']."</style_id>"
      		  ."<name>".$result->fields['name']."</name>"
      		  ."<polyline_style_type>".$result->fields['polyline_style_type']."</polyline_style_type>"
      		  ."<color>".$result->fields['color']."</color>"
      		  ."<weight>".$result->fields['weight']."</weight>"
      		  ."<opacity>".$result->fields['opacity']."</opacity>"
      		  ."<pattern>".$result->fields['pattern']."</pattern>"
      		  ."<segment_count>".$result->fields['segment_count']."</segment_count>"
      		  ."<begin_arrow>".$result->fields['begin_arrow']."</begin_arrow>"
      		  ."<end_arrow>".$result->fields['end_arrow']."</end_arrow>"
      		  ."<arrows_every>".$result->fields['arrows_every']."</arrows_every>"
      		  ."<font>".$result->fields['font']."</font>"
      		  ."<text_every>".$result->fields['text_every']."</text_every>"
      		  ."<text_fgstyle_color>".$result->fields['text_fgstyle_color']."</text_fgstyle_color>"
      		  ."<text_fgstyle_weight>".$result->fields['text_fgstyle_weight']."</text_fgstyle_weight>"
      		  ."<text_fgstyle_opacity>".$result->fields['text_fgstyle_opacity']."</text_fgstyle_opacity>"
      		  ."<text_fgstyle_zindex>".$result->fields['text_fgstyle_zindex']."</text_fgstyle_zindex>"
      		  ."<text_bgstyle_color>".$result->fields['text_bgstyle_color']."</text_bgstyle_color>"
      		  ."<text_bgstyle_weight>".$result->fields['text_bgstyle_weight']."</text_bgstyle_weight>"
      		  ."<text_bgstyle_opacity>".$result->fields['text_bgstyle_opacity']."</text_bgstyle_opacity>"
      		  ."<text_bgstyle_zindex>".$result->fields['text_bgstyle_zindex']."</text_bgstyle_zindex>"
						."</polylinestyle>";
						
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
