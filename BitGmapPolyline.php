<?php
/**
 * BitGmapPolyline Class
 *
 * @package gmap
 * @subpackage BitGmapPolyline
 *
 * @author will <will@onnyturf.com>
 *
 * @version v.0
 *
 * Copyright (c) 2005,2006,2007 bitweaver.org, Will James
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 *
 */

/**
 * required setup
 */

require_once( GMAP_PKG_PATH.'BitGmapOverlayBase.php' );
require_once( LIBERTY_PKG_PATH.'LibertyComment.php' );

/**
* This is used to uniquely identify the object
*/
define( 'BITGMAPPOLYLINE_CONTENT_TYPE_GUID', 'bitgmappolyline' );


// this is the class that contains all the functions for the package
class BitGmapPolyline extends BitGmapOverlayBase {

	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapPolyline( $pOverlayId=NULL, $pContentId=NULL ) {
		parent::BitGmapOverlayBase();
		$this->mOverlayId = $pOverlayId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPPOLYLINE_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPPOLYLINE_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPPOLYLINE_CONTENT_TYPE_GUID,
			'content_description' => 'Polyline for Google Map',
			'handler_class' => 'BitGmapPolyline',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapPolyline.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		$this->mOverlayType = 'polyline';
		$this->mOverlayTable = 'gmaps_polylines';
		$this->mOverlayKeychainTable = 'gmaps_polyline_keychain';
		$this->mOverlaySeq = 'gmaps_polylines_polyline_id_seq';
	}


	function verify( &$pParamHash ) {

		$pParamHash['overlay_store'] = array();
		$pParamHash['keychain_store'] = array();

		if( !empty( $pParamHash['type'] ) ) {
			$pParamHash['overlay_store']['type'] = $pParamHash['type'];
		}
		
		if( !empty( $pParamHash['levels_data'] ) ) {
			$pParamHash['overlay_store']['levels_data'] = $pParamHash['levels_data'];
		}

		if( isset( $pParamHash['zoom_factor'] ) && is_numeric( $pParamHash['zoom_factor'] ) ) {
			$pParamHash['overlay_store']['zoom_factor'] = $pParamHash['zoom_factor'];
		}

		if( isset( $pParamHash['num_levels'] ) && is_numeric( $pParamHash['num_levels'] ) ) {
			$pParamHash['overlay_store']['num_levels'] = $pParamHash['num_levels'];
		}

		// set values for updating the polyline keychain
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}

		return( count( $this->mErrors ) == 0 );
	}
}
?>