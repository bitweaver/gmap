<?php
/**
 * BitGmapMarker Class
 *
 * @package gmap
 * @subpackage BitGmapMarker
 *
 * @author will <will@wjamesphoto.com>
 *
 * @version v.0
 *
 * Copyright (c) 2005 bitweaver.org, Will James
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 *
 */

/**
 * required setup
 */

require_once( LIBERTY_PKG_PATH.'LibertyAttachable.php' );

/**
* This is used to uniquely identify the object
*/
define( 'BITGMAPMARKER_CONTENT_TYPE_GUID', 'bitgmapmarker' );


// this is the class that contains all the functions for the package
class BitGmapMarker extends LibertyAttachable {
	/**
	* Primary key for our map class
	* @public
	*/
	var $mGmarkerId;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmapMarker( $pGmarkerId=NULL, $pContentId=NULL ) {
		parent::LibertyAttachable();
		$this->mGmarkerId = $pGmarkerId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAPMARKER_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAPMARKER_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAPMARKER_CONTENT_TYPE_GUID,
			'content_description' => 'Markers for the Gmap Package',
			'handler_class' => 'BitGmapMarker',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmapMarker.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
	}



	//returns array of marker data and associated style and icon style ids for given gmap_id and set_type
	function load() {
		if( !empty( $this->mGmarkerId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mGmarkerId )? 'marker_id' : 'content_id';
			$lookupId = !empty( $this->mGmarkerId )? $this->mGmarkerId : $this->mContentId;

			$query = "SELECT *
					  FROM `".BIT_DB_PREFIX."bit_gmaps_markers` bmm INNER JOIN `".BIT_DB_PREFIX."tiki_content` tc ON( bmm.`content_id`=tc.`content_id` )
					  WHERE bmm.`$lookupColumn`=?";
			$result = $this->mDb->query( $query, array( $lookupId ) );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mGmarkerId = $result->fields['marker_id'];
				$this->mContentId = $result->fields['content_id'];
				parent::load();				
			}
		}
		return( count( $this->mInfo ) );
	}

	
	
	
	

//ALL STORE FUNCTIONS

	function verify( &$pParamHash ) {

		$pParamHash['marker_store'] = array();
		$pParamHash['keychain_store'] = array();
		
		if( !empty( $pParamHash['marker_lat'] ) && is_numeric( $pParamHash['marker_lat'] ) ) {
			$pParamHash['marker_store']['lat'] = $pParamHash['marker_lat'];
		}

		if( !empty( $pParamHash['marker_lon'] ) && is_numeric( $pParamHash['marker_lon'] ) ) {
			$pParamHash['marker_store']['lon'] = $pParamHash['marker_lon'];
		}

		if( !empty( $pParamHash['marker_labeltext'] ) ) {
			$pParamHash['marker_store']['label_data'] = $pParamHash['marker_labeltext'];
		}

		if( !empty( $pParamHash['marker_zi'] ) && is_numeric( $pParamHash['marker_zi'] ) ) {
			$pParamHash['marker_store']['zindex'] = $pParamHash['marker_zi'];
		}
		
		if( !empty( $pParamHash['map_comm'] ) ) {
			$pParamHash['marker_store']['allow_comments'] = 'TRUE';
		}

		// set values for updating the marker keychain		
		if( !empty( $pParamHash['set_id'] ) && is_numeric( $pParamHash['set_id'] ) ) {
			$pParamHash['keychain_store']['set_id'] = $pParamHash['set_id'];
		}

		
		return( count( $this->mErrors ) == 0 );
	}

	
	function store( &$pParamHash ) {
		if( $this->verify( $pParamHash ) ) {
			$this->mDb->StartTrans();
			if( parent::store( $pParamHash ) ) {
				if( $this->mGmarkerId ) {
					// store the posted changes
					$this->mDb->associateUpdate( BIT_DB_PREFIX."bit_gmaps_markers", $pParamHash['marker_store'], array( "name" => "marker_id", "value" => $pParamHash['marker_id'] ) );
				} else {
					$pParamHash['marker_store']['content_id'] = $this->mContentId;
					$pParamHash['marker_store']['marker_id'] = $this->mDb->GenID( 'bit_gmaps_markers_marker_id_seq' );
					$this->mDb->associateInsert( BIT_DB_PREFIX."bit_gmaps_markers", $pParamHash['marker_store'] );
					$pParamHash['keychain_store']['marker_id'] = $pParamHash['marker_store']['marker_id'];
					$this->mDb->associateInsert( BIT_DB_PREFIX."bit_gmaps_marker_keychain", $pParamHash['keychain_store'] );													
				}
				$this->mDb->CompleteTrans();

				// re-query to confirm results
				$result = $this->load();

			} else {
				$this->mDb->RollbackTrans();
			}
		}
		return( count( $this->mInfo ) );
	}

}

?>
