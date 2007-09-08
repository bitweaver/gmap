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

//if there is no API key don't even bother
if ($gBitSystem->isFeatureActive('gmap_api_key')){
	//Preview mode is handled by javascript on the client side.
	//There is no callback to the server for previewing changes.
	
	//Check if this is a update or a new map
	if (!empty($_REQUEST["save_map"])) {
		if( $gContent->store( $_REQUEST ) ) {

			//$gContent->storePreference( 'is_public', !empty( $_REQUEST['is_public'] ) ? $_REQUEST['is_public'] : NULL );
			$gContent->storePreference( 'allow_comments', !empty( $_REQUEST['allow_comments'] ) ? $_REQUEST['allow_comments'] : NULL );
			$gContent->load();    
		
			//if store is successful we return XML				
			$XMLContent = "<map>"
				."<gmap_id>".$gContent->mInfo['gmap_id']."</gmap_id>"
				."<title>".$gContent->getTitle()."</title>"
				."<description>".$gContent->mInfo['description']."</description>"
				."<data>".$gContent->mInfo['xml_data']."</data>"
				."<parsed_data><![CDATA[".$gContent->mInfo['xml_parsed_data']."]]></parsed_data>"
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
			print_r($XMLContent);									
			die;
		}else{
		  echo $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
		}
	}else{
	
		$gContent->invokeServices( 'content_edit_function' );
		
		$map = $gContent->mInfo;
		if ( empty( $map['zoom_control'] ) ){
			if ( $gBitSystem->getConfig('gmap_zoom_control') ){
				$map['zoom_control'] = $gBitSystem->getConfig('gmap_zoom_control');
			}else{
				$map['zoom_control'] = 's';
			}
		}
		
		if ( empty( $map['scale'] ) ){
			if ( $gBitSystem->getConfig('gmap_scale') ){
				$map['scale'] = $gBitSystem->getConfig('gmap_scale');
			}else{
				$map['scale'] = 'false';
			}
		}

		if ( empty( $map['maptype_control'] ) ){
			if ( $gBitSystem->getConfig('gmap_maptype_control') ){
				$map['maptype_control'] = $gBitSystem->getConfig('gmap_maptype_control');
			}else{
				$map['maptype_control'] = 'true';
			}
		}

		if ( empty( $map['maptype'] ) ){
			if ( $gBitSystem->getConfig('gmap_maptype') ){
				$map['maptype'] = $gBitSystem->getConfig('gmap_maptype');
			}else{
				$map['maptype'] = 0;
			}
		}

		$gBitSmarty->assign_by_ref('mapInfo', $map);
		$gBitSmarty->assign_by_ref('mapTypes', $gContent->mMapTypes);
		echo $gBitSmarty->fetch( 'bitpackage:gmap/edit_map.tpl' );
	}
}else{
	echo $gBitSmarty->fetch('bitpackage:gmap/error_nokey.tpl');
}
?>