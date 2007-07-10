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

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

//Check if this is a update or a new map
if (!empty($_REQUEST["save_map"])) {
    if( $gContent->store( $_REQUEST ) ) {
    
		//$gContent->storePreference( 'is_public', !empty( $_REQUEST['is_public'] ) ? $_REQUEST['is_public'] : NULL );
		$gContent->storePreference( 'allow_comments', !empty( $_REQUEST['allow_comments'] ) ? $_REQUEST['allow_comments'] : NULL );
		$gContent->load();    
    
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
			."<maptype_control>".$gContent->mInfo['maptype_control']."</maptype_control>"
			."<overview_control>".$gContent->mInfo['overview_control']."</overview_control>"
			."<scale>".$gContent->mInfo['scale']."</scale>"
			."<allow_comments>".(($gContent->getPreference('allow_comments') == 'y')?"y":"n")."</allow_comments>"
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
    
	$gBitSmarty->assign( 'loadGoogleMapsAPI', TRUE );
	$gBitSmarty->assign( 'loadMochiKit', TRUE );
	$gBitSmarty->assign( 'edit_map', TRUE );

    //set onload function in body
	$gBitSystem->mOnload[] = 'BitMap.EditMap();';
    
    //use Mochikit - prototype sucks
	$gBitThemes->loadAjax( 'mochikit', array( 'Base.js', 'Iter.js', 'Async.js', 'DOM.js' ) );	
    // Display the template
    $gBitSystem->display( 'bitpackage:gmap/edit_gmap.tpl', tra('Gmap') );    		
}

?>
