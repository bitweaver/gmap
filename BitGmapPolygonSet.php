<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/BitGmapPolygonSet.php,v 1.7 2009/06/10 17:12:17 wjames5 Exp $
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

define( 'BITGMAPPOLYGONSET_CONTENT_TYPE_GUID', 'bitgpolygonset' );


/**
 * class BitGmapPolygonSet
 * this is the class that contains all the functions for the package
 * 
 * @package gmap
 */class BitGmapPolygonSet extends BitGmapOverlaySetBase{
	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapPolygonSet( $pOverlaySetId=NULL, $pContentId=NULL ) {
		parent::BitGmapOverlaySetBase();
		$this->mOverlaySetId = $pOverlaySetId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPPOLYGONSET_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPPOLYGONSET_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPPOLYGONSET_CONTENT_TYPE_GUID,
			'content_description' => 'Map Polygons Set',
			'handler_class' => 'BitGmapPolygonSet',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapPolygonSet.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		//variables created in the parent BitGmapOverlaySetBase class		
		$this->mOverlaySetType = "polygons";
		$this->mOverlaySetTable = "gmaps_polygon_sets";
		$this->mOverlaySetKeychainTable = "gmaps_polygon_keychain";
		$this->mOverlaySetSeq = 'gmaps_polygon_sets_set_id_seq';
	}


	function verify( &$pParamHash ) {
	
		$pParamHash['set_store'] = array();
		$pParamHash['keychain_store'] = array();
		$pParamHash['keychain_update'] = array();
		$pParamHash['keychain_ids'] = array();

		if( isset( $pParamHash['style_id'] ) && is_numeric( $pParamHash['style_id'] ) ) {
			$pParamHash['set_store']['style_id'] = $pParamHash['style_id'];
		}else{
			$pParamHash['set_store']['style_id'] = 0;
		}

		if( isset( $pParamHash['polylinestyle_id'] ) && is_numeric( $pParamHash['polylinestyle_id'] ) ) {
			$pParamHash['set_store']['polylinestyle_id'] = $pParamHash['polylinestyle_id'];
		}else{
			$pParamHash['set_store']['polylinestyle_id'] = 0;
		}

		// set values for updating the map set keychain	if its a new set
		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			$pParamHash['keychain_store']['gmap_id'] = $pParamHash['gmap_id'];
			$pParamHash['keychain_ids']['gmap_id'] = $pParamHash['gmap_id'];
		}

		// if we have a gmap_id then we're are going to associate the set with that map
		if( !empty( $pParamHash['gmap_id'] ) && is_numeric( $pParamHash['gmap_id'] ) ) {
			// set values for setting the map set keychain if its a new set
			$pParamHash['keychain_store']['gmap_id'] = $pParamHash['gmap_id'];
			$pParamHash['keychain_ids']['gmap_id'] = $pParamHash['gmap_id'];

			// set the position value if its going to be mapped to a map
			$pos = NULL;
			if( $this->isValid() ){
				if( !empty( $pParamHash['pos'] ) ){
					// if pos is passed in we assume it is on purpose 
					// dont do this casually, this could screw up auto sorting
					$pos = $pParamHash['pos'];
				}else{
					// if pos is not set in the hash then get it from info
					$pos = $this->getField( 'pos' );
				}
				$pParmaHash['keychain_update']['pos'] = $pos; 
			}else{
				// new set get the highest pos used in map chain and increment
				$query = "SELECT MAX( `pos` ) FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` WHERE `gmap_id` = ?";
				$result = $this->mDb->getOne($query,array( $pParamHash['gmap_id'] ));
				// increment or if null start at 0
				$pos = $result?$result+1:0;
				$pParmaHash['keychain_store']['pos'] = $pos; 
			}
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

		$pParamHash['keychain_store']['set_type'] = 'polygons';
		$pParamHash['keychain_ids']['set_type'] = 'polygons';
				
		return( count( $this->mErrors ) == 0 );
	}
}
?>
