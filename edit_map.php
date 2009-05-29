<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/edit_map.php,v 1.22 2009/05/29 17:30:56 tekimaki_admin Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 * @subpackage functions
 */

/**
 * required setup
 */
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_gmap_inc.php' );

$gBitThemes->setFormatHeader( 'center_only' );

// Now check permissions to access this page
if( $gContent->isValid() ) {
	$gContent->verifyUpdatePermission();
} else {
	$gContent->verifyCreatePermission();
}


//if there is no API key don't even bother
if ($gBitSystem->isFeatureActive('gmap_api_key')){
	$gBitThemes->setFormatHeader( NULL );
	//Preview mode is handled by javascript on the client side.
	//There is no callback to the server for previewing changes.
	
	//Check if this is a update or a new map
	if (!empty($_REQUEST["save_map"])) {
		$gBitUser->verifyTicket();
		$format = 'xml';
		$XMLContent = "";
		$statusCode = 401;
		$storeHash = $_REQUEST;
		// the user might be submitting encoded html chars by ajax - decode them before storing
		if( !empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest' ){
			@BitGmap::decodeAjaxRequest( $storeHash );
		}
		if( $gContent->store( $storeHash ) ) {
			$statusCode = 200;
			if ( $gContent->hasAdminPermission() ){
				$gContent->setUpdateSharing( $_REQUEST );
				$gContent->setAllowChildren( $_REQUEST );
			}    
			$gContent->storePreference( 'allow_comments', !empty( $_REQUEST['allow_comments'] ) ? $_REQUEST['allow_comments'] : NULL );
			$gContent->load();
			$gBitSmarty->assign_by_ref('mapInfo', $gContent->mInfo);
		}

		if ( count($gContent->mErrors) > 0 ){
			$XMLContent = "There were errors with your request:";
			foreach( $gContent->mErrors as $key=>$error ){
				$XMLContent .= "\n".$error."\n";
			}
		}

		$gBitSmarty->assign( 'statusCode', $statusCode);
		$gBitSmarty->assign( 'XMLContent', $XMLContent);
		$gBitThemes->setFormatHeader( $format );
		$gBitSystem->display('bitpackage:gmap/edit_map_xml.tpl', null, array( 'display_mode' => 'edit' ));
	}else{
		/* HACKTASTIC!
		 * if we're just ajaxing up the form then turn this off - hacking around trouble at top of liberty::edit_storage_list.tpl
		 * we need the wrapper div when just ajaxing in the form. the check in the tpl is not sensative enough.
		 */
		$_SERVER['HTTP_X_REQUESTED_WITH'] = NULL;

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

		$mapTypes = $gContent->getMapTypes(); 
		$gBitSmarty->assign( 'mapTypes', $mapTypes);
		
		$gBitSmarty->assign( 'updateShared', $gContent->isUpdateShared() );
		$gBitSmarty->assign( 'childrenAllowed', $gContent->childrenAllowed() );
		$gBitSmarty->assign_by_ref('mapInfo', $map);
		$gBitSmarty->assign_by_ref('mapTypes', $gContent->mMapTypes);
		$gBitSystem->display('bitpackage:gmap/edit_map.tpl', null, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
	}
}else{
	$gBitSystem->display('bitpackage:gmap/error_nokey.tpl', null, array( 'format' => 'center_only', 'display_mode' => 'edit' ));
}
?>
