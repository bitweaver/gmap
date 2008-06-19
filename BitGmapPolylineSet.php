<?php
/**
 * @version $Header: 
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 */
 
/**
 * required setup
 */

require_once( GMAP_PKG_PATH.'BitGmapOverlaySetBase.php' );

define( 'BITGMAPPOLYLINESET_CONTENT_TYPE_GUID', 'bitgpolylineset' );


/**
 * class BitGmapPolylineSet
 * this is the class that contains all the functions for the package
 * 
 * @package gmap
 */
class BitGmapPolylineSet extends BitGmapOverlaySetBase{
	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapPolylineSet( $pOverlaySetId=NULL, $pContentId=NULL ) {
		parent::BitGmapOverlaySetBase();
		$this->mOverlaySetId = $pOverlaySetId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPPOLYLINESET_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPPOLYLINESET_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPPOLYLINESET_CONTENT_TYPE_GUID,
			'content_description' => 'Set of Polylines for Google Map',
			'handler_class' => 'BitGmapPolylineSet',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapPolylineSet.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		//variables created in the parent BitGmapOverlaySetBase class		
		$this->mOverlaySetType = "polylines";
		$this->mOverlaySetTable = "gmaps_polyline_sets";
		$this->mOverlaySetKeychainTable = "gmaps_polyline_keychain";
		$this->mOverlaySetSeq = 'gmaps_polyline_sets_set_id_seq';
	}


	function verify( &$pParamHash ) {

		$pParamHash['set_store'] = array();
		$pParamHash['keychain_store'] = array();
		$pParamHash['keychain_update'] = array();
		$pParamHash['keychain_ids'] = array();

		if( isset( $pParamHash['style_id'] ) && is_numeric( $pParamHash['style_id'] ) ) {
			$pParamHash['set_store']['style_id'] = $pParamHash['style_id'];
		}

		// set values for updating the map set keychain	if its a new set
		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['keychain_store']['gmap_id'] = $pParamHash['gmap_id'];
			$pParamHash['keychain_ids']['gmap_id'] = $pParamHash['gmap_id'];
		}

		if( !empty( $pParamHash['plot_on_load'] ) ) {
			$pParamHash['keychain_store']['plot_on_load'] = $pParamHash['plot_on_load'];
			$pParamHash['keychain_update']['plot_on_load'] = $pParamHash['plot_on_load'];
		}else{
			$pParamHash['keychain_store']['plot_on_load'] = 'false';
			$pParamHash['keychain_update']['plot_on_load'] = 'false';
		}

		if( !empty( $pParamHash['side_panel'] ) ) {
			$pParamHash['keychain_store']['side_panel'] = $pParamHash['side_panel'];
			$pParamHash['keychain_update']['side_panel'] = $pParamHash['side_panel'];
		}else{
			$pParamHash['keychain_store']['side_panel'] = 'false';
			$pParamHash['keychain_update']['side_panel'] = 'false';
		}

		if( !empty( $pParamHash['explode'] ) ) {
			$pParamHash['keychain_store']['explode'] = $pParamHash['explode'];
			$pParamHash['keychain_update']['explode'] = $pParamHash['explode'];
		}else{
			$pParamHash['keychain_store']['explode'] = 'false';
			$pParamHash['keychain_update']['explode'] = 'false';
		}

		$pParamHash['keychain_store']['set_type'] = 'polylines';
		$pParamHash['keychain_ids']['set_type'] = 'polylines';
				
		return( count( $this->mErrors ) == 0 );
	}
}
?>