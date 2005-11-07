<?php
/**
 * @todo wj: How to do the credits up here?
 * @package gmap
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
 *
 * @package gmap
 *
 * creation started 2005/10/05
 */
 
/**
 * required setup
 */

require_once( LIBERTY_PKG_PATH.'LibertyAttachable.php' );


/**
* This is used to uniquely identify the object
*/
define( 'BITGMAP_CONTENT_TYPE_GUID', 'bitgmap' );


// this is the class that contains all the functions for the package
class BitGmap extends LibertyAttachable {
	/**
	* Primary key for our map class
	* @public
	*/
	var $mGmapId;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitGmap( $pGmapId=NULL, $pContentId=NULL ) {
		LibertyAttachable::LibertyAttachable();
		$this->mGmapId = $pGmapId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAP_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAP_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAP_CONTENT_TYPE_GUID,
			'content_description' => 'A Wikid GMap Engine',
			'handler_class' => 'BitGMap',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmap.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
	}


	/**
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 * @todo wj: Right now no plan to use this function, as content model of bitweaver does not work for Gmap
	 * @todo wj: It is only here because it is in the sample package
	 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	 *
	 * Load the data from the database
	 * @param pParamHash be sure to pass by reference in case we need to make modifcations to the hash
	**/
	function load() {
		if( !empty( $this->mGmapId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mGmapId )? 'map_id' : 'content_id';
			$lookupId = !empty( $this->mGmapId )? $this->mGmapId : $this->mContentId;

			$query = "SELECT bm.*, FROM `".BIT_DB_PREFIX."bit_gmaps` bm WHERE bm.`$lookupColumn`=?";
			$result = $this->mDb->query( $query, array( $lookupId ) );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mGmapId = $result->fields['map_id'];
				$this->mContentId = $result->fields['content_id'];
				$this->mInfo['display_url'] = $this->getDisplayUrl();
				LibertyAttachable::load();
			}
		}
		return( count( $this->mInfo ) );
	}
 

	
	// Instead of using load() we use getMap()
	function getMap(){
		global $gBitSystem;
		if( !empty( $this->mGmapId ) ) {
			$lookupId = !empty( $this->mGmapId )? $this->mGmapId : $this->mContentId;
			
			$map_result = $this->getMapData($lookupId);
			$this->mMapData = $map_result->fields;
			
			$map_types_result = $this->getMapTypes($lookupId);
			$this->mMapTypes = $map_types_result;		

			$init_markers_result = $this->getMarkers($lookupId, "init_markers");
			$this->mMapInitMarkers = $init_markers_result;

			$set_markers_result = $this->getMarkers($lookupId, "set_markers");
			$this->mMapSetMarkers = $set_markers_result;
																																				
			$this->mInfo['display_url'] = $this->getDisplayUrl();
		}
	}
	
	
	
	//* Gets the basic map info.
	function getMapData($gmap_id) {
		global $gBitSystem;
		if ($gmap_id && is_numeric($gmap_id)) {

			//select map and get list of sets to look up
			$query = "SELECT bm.* 
			FROM `".BIT_DB_PREFIX."bit_gmaps` bm 
			WHERE bm.gmap_id = ?";
  		$result = $this->mDb->query( $query, array((int)$gmap_id));
			
		}
		return $result;
	}	



	//get all mapTypes data associated with a given $gmap_id
	function getMapTypes($gmap_id) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {
		
			$bindVars = array((int)$gmap_id, "map_types");
			$query = "SELECT bmt.* 
          			FROM `".BIT_DB_PREFIX."bit_gmaps_map_types` bmt, `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bmk 
          			WHERE bmt.`maptype_id` = bmk.`set_id` AND bmk.`gmap_id` = ? AND bmk.`set_type` = ?";
								
  		$result = $this->mDb->query( $query, $bindVars );
						
			$ret = array();
			
			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};			
		}
		return $ret;
	}



	//returns array of marker data and associated style and icon style ids for given gmap_id and set_type
	function getMarkers($gmap_id, $settype) {
		global $gBitSystem;
		$ret = NULL;
		if ($gmap_id && is_numeric($gmap_id)) {

		 	$bindVars = array((int)$gmap_id, $settype);
			$query = "SELECT bmm.*, bms.* 
                FROM `".BIT_DB_PREFIX."bit_gmaps_sets_keychain` bsk, `".BIT_DB_PREFIX."bit_gmaps_marker_keychain` bmk, `".BIT_DB_PREFIX."bit_gmaps_markers` bmm, `".BIT_DB_PREFIX."bit_gmaps_marker_sets` bms
                WHERE bsk.`gmap_id` = ? 
                AND bsk.`set_type` = ? 
                AND bms.`set_id` = bsk.`set_id` 
                AND bmk.`set_id` = bms.`set_id` 
                AND bmm.`marker_id` = bmk.`marker_id`";
			
			$result = $this->mDb->query( $query, $bindVars );

			$ret = array();
			
			while ($res = $result->fetchrow()) {
				$ret[] = $res;
			};			
		};
		return $ret;
	}
	
		
		

	function storeMapData( &$pParamHash ) {
			// store the posted changes
			$table = BIT_DB_PREFIX."bit_gmaps";
			$this->mDb->StartTrans();
			$locId = array( "name" => "gmap_id", "value" => $pParamHash['gmap_id'] );			
			$rslt = $this->mDb->associateUpdate( $table, $pParamHash, $locId );			
			$this->mDb->CompleteTrans();			
						
			// re-query to confirm results		
			$result = $this->getMapData($pParamHash['gmap_id']);
			
			$this->mRet = "<map>"
					 	 ."<title>".$result->fields['title']."</title>"
						 ."<desc>".$result->fields['description']."</desc>"
						 ."<w>".$result->fields['width']."</w>"
						 ."<h>".$result->fields['height']."</h>"
						 ."<lat>".$result->fields['lat']."</lat>"
						 ."<lon>".$result->fields['lon']."</lon>"
						 ."<z>".$result->fields['zoom_level']."</z>"
						 ."<maptype>".$result->fields['map_type']."</maptype>"
						 ."<cont>".$result->fields['show_controls']."</cont>"
						 ."<scale>".$result->fields['show_scale']."</scale>"
						 ."<typecon>".$result->fields['show_typecontrols']."</typecon>"
						 ."</map>";			
	}
	
	
	

	/**
	* Generates the URL to the sample page
	* @param pExistsHash the hash that was returned by LibertyContent::pageExists
	* @return the link to display the page.
	*/
	function getDisplayUrl() {
		$ret = NULL;
		if( !empty( $this->mGmapId ) ) {
			$ret = GMAP_PKG_URL."index.php?map_id=".$this->mGmapId;
		}
		return $ret;
	}

}
	
?>
