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

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_gmap_inc.php' );

// Tells smarty to include the Prototype js library
// $gBitSmarty->assign( 'loadAjax', TRUE );

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

/*
//@todo kill - we think we dont need these when we use constants set in schema_inc
if ( empty($_REQUEST['gmap_id']) && empty($_REQUEST['content_id']) ){

		$gContent->mInfo['title'] = '';
		$gContent->mInfo['description'] = '';
		$gContent->mInfo['data'] = '';
		$gContent->mInfo['parsed_data'] = '';
		$gContent->mInfo['width'] = 0;
		$gContent->mInfo['height'] = 400;
		$gContent->mInfo['lat'] = 0;
		$gContent->mInfo['lng'] = 0;
		$gContent->mInfo['zoom'] = 16;
		$gContent->mInfo['maptype'] = 0;
		$gContent->mInfo['zoom_control'] = 's';
		$gContent->mInfo['maptype_control'] = 'TRUE';
		$gContent->mInfo['overview_control'] = 'TRUE';
		$gContent->mInfo['scale'] = 'TRUE';
		$gContent->mInfo['allow_comments'] = 'TRUE';

}
*/

//Check if this is a update or a new map
if (!empty($_REQUEST["save_map"])) {
    if( $gContent->store( $_REQUEST ) ) {
				//if store is successful we return XML				
				$mRet = "<map>"
					."<gmap_id>".$gContent->mInfo['gmap_id']."</gmap_id>"
					."<title>".$gContent->getTitle()."</title>"
					."<description>".$gContent->mInfo['description']."</description>"
					."<data>".$gContent->mInfo['xml_data']."</data>"
					."<parsed_data><![CDATA[".$gContent->mInfo['parsed_data']."]]></parsed_data>"				
					."<width>".$gContent->mInfo['width']."</width>"
					."<height>".$gContent->mInfo['height']."</height>"
					."<lat>".$gContent->mInfo['lat']."</lat>"
					."<lng>".$gContent->mInfo['lng']."</lng>"
					."<zoom>".$gContent->mInfo['zoom']."</zoom>"
					."<maptype>".$gContent->mInfo['maptype']."</maptype>"
					."<zoom_control>".$gContent->mInfo['zoom_control']."</zoom_control>"
					."<type_control>".$gContent->mInfo['maptype_control']."</type_control>"
					."<overview_control>".$gContent->mInfo['overview_control']."</overview_control>"
					."<scale>".$gContent->mInfo['scale']."</scale>"
					."</map>";
					
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

			print_r('<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>');
      	print_r($mRet);
								
        die;
								
    }else{
		//@todo - return some sort of store failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}else{

		//@todo this was causing a header problem when needed and when not?
    //header("Location: ".$gContent->getDisplayUrl());
				
    // Configure quicktags list
    if ($gBitSystem->isPackageActive( 'quicktags' ) ) {
    	include_once( QUICKTAGS_PKG_PATH.'quicktags_inc.php' );
    }
    
    // WYSIWYG and Quicktag variable
    $gBitSmarty->assign( 'textarea_id', 'editsample' );
		$gBitSmarty->assign( 'loadGoogleMapsAPI', TRUE );
		$gBitSmarty->assign( 'loadMochiKit', TRUE );
		$gBitSmarty->assign( 'edit_map', TRUE );

    //set onload function in body
	  $gBitSystem->mOnload[] = 'BitMap.EditMap();';
    
    // Display the template
    $gBitSystem->display( 'bitpackage:gmap/edit_gmap.tpl', tra('Gmap') );    		
}

?>
