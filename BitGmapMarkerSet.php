<?php
/**
 * @version $Header$
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See below for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 */

/**
 * required setup
 */

require_once( GMAP_PKG_PATH.'BitGmapOverlaySetBase.php' );

define( 'BITGMAPMARKERSET_CONTENT_TYPE_GUID', 'bitgmarkerset' );

/**
 * class BitGmapMarkerSet
 * this is the class that contains all the functions for the package
 * 
 * @package gmap
 */
class BitGmapMarkerSet extends BitGmapOverlaySetBase{
	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapMarkerSet( $pOverlaySetId=NULL, $pContentId=NULL ) {
		parent::BitGmapOverlaySetBase();
		$this->mOverlaySetId = $pOverlaySetId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPMARKERSET_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPMARKERSET_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPMARKERSET_CONTENT_TYPE_GUID,
			'content_name' => 'Map Markers Set',
			'handler_class' => 'BitGmapMarkerSet',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapMarkerSet.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
		
		//variables created in the parent BitGmapOverlaySetBase class		
		$this->mOverlaySetType = "markers";
		$this->mOverlaySetTable = "gmaps_marker_sets";
		$this->mOverlaySetKeychainTable = "gmaps_marker_keychain";
		$this->mOverlaySetSeq = 'gmaps_marker_sets_set_id_seq';
	}


	function verify( &$pParamHash ) {

		$pParamHash['set_store'] = array();
		$pParamHash['keychain_store'] = array();
		$pParamHash['keychain_update'] = array();
		$pParamHash['keychain_ids'] = array();

		/* DEPRECATED		
		if( !empty( $pParamHash['name'] ) ) {
			$pParamHash['set_store']['name'] = $pParamHash['name'];
		}

		if( !empty( $pParamHash['description'] ) ) {
			$pParamHash['set_store']['description'] = $pParamHash['description'];
		}
		*/
		
		if( isset( $pParamHash['style_id'] ) && is_numeric( $pParamHash['style_id'] ) ) {
			$pParamHash['set_store']['style_id'] = $pParamHash['style_id'];
		}else{
			$pParamHash['set_store']['style_id'] = 0;
		}
		
		if( isset( $pParamHash['icon_id'] ) && is_numeric( $pParamHash['icon_id'] ) ) {
			$pParamHash['set_store']['icon_id'] = $pParamHash['icon_id'];
		}else{
			$pParamHash['set_store']['icon_id'] = 0;
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
				$pParamHash['keychain_update']['pos'] = $pos; 
			}else{
				// new set get the highest pos used in map chain and increment
				$query = "SELECT `pos` FROM `".BIT_DB_PREFIX."gmaps_sets_keychain` WHERE `set_type` = ? AND `gmap_id` = ? ORDER BY `pos` DESC";
				$result = $this->mDb->getOne($query, array( $this->mOverlaySetType, $pParamHash['gmap_id'] ));
				// increment or if null start at 0
				$pos = ( $result != NULL )?(int)$result+1:0;
				$pParamHash['keychain_store']['pos'] = $pos; 
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

		$pParamHash['keychain_store']['set_type'] = 'markers';
		$pParamHash['keychain_ids']['set_type'] = 'markers';

		return( count( $this->mErrors ) == 0 );
	}

	function getIcon( $pIconId ){
		$ret = NULL;
		if( @BitBase::verifyId( $pIconId ) ) {
			$icon = $this->mDb->query( "SELECT * FROM `".BIT_DB_PREFIX."gmaps_icon_styles` gmis WHERE gmis.`icon_id` = ?", array( $pIconId ) );
			$ret = $icon->fields;
		}
		return $ret;
	}	

}
