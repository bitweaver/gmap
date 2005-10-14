<?php
/**
 * @todo wj: How to do the credits up here?
 * @package bitmap
 *
 * @author will <will@wjamesphoto.com>
 *
 * @version v.0
 *
 * Copyright (c) 2005 bitweaver.org
 * Copyright (c) 2004 bitweaver.org
 * Copyright (c) 2003 tikwiki.org
 * Copyright (c) 2002-2003, Luis Argerich, Garland Foster, Eduardo Polidor, et. al.
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details
 *
 */

/**
 *
 * @package bitmap
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
define( 'BITMAP_CONTENT_TYPE_GUID', 'bitmap' );

class BitMap extends LibertyAttachable {
	/**
	* Primary key for our map class
	* @public
	*/
	var $mBitmapId;


	/**
	* During initialisation, be sure to call our base constructors
	**/
	function BitMap( $pBitmapId=NULL, $pContentId=NULL ) {
		LibertyAttachable::LibertyAttachable();
		$this->mBitmapId = $pBitmapId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITMAP_CONTENT_TYPE_GUID;
		$this->registerContentType( BITMAP_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITMAP_CONTENT_TYPE_GUID,
			'content_description' => 'A Wikid GMap Engine',
			'handler_class' => 'BitMap',
			'handler_package' => 'bitmap',
			'handler_file' => 'BitMap.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
	}



	/**
	* Load the data from the database
	* @param pParamHash be sure to pass by reference in case we need to make modifcations to the hash
	**/
	function load() {
		if( !empty( $this->mBitmapId ) || !empty( $this->mContentId ) ) {
			// LibertyContent::load()assumes you have joined already, and will not execute any sql!
			// This is a significant performance optimization
			$lookupColumn = !empty( $this->mBitmapId )? 'map_id' : 'content_id';
			$lookupId = !empty( $this->mBitmapId )? $this->mBitmapId : $this->mContentId;

			$query = "SELECT bm.*, FROM `".BIT_DB_PREFIX."bit_gmaps` bm WHERE bm.`$lookupColumn`=?";
			$result = $this->mDb->query( $query, array( $lookupId ) );

			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mBitmapId = $result->fields['map_id'];
				$this->mContentId = $result->fields['content_id'];
				$this->mInfo['display_url'] = $this->getDisplayUrl();
				LibertyAttachable::load();
			}
		}
		return( count( $this->mInfo ) );
	}
 

	
	
	/**
	* @todo wj:the following are sketches for queries, but they really need to be part of a basic map request.
	*  Just how to integrate them I am still working out.
	**/
	 
	/**
	* This function gets the set ids and types of a map
	**/
	function getSetIds( &$pParamHash ) {
		LibertyContent::prepGetList( $pParamHash );
		
			$query = "SELECT bms.*, FROM `".BIT_DB_PREFIX."bit_gmaps_setskeychain` bms WHERE bms.`map_id`=?";
			$result = $this->mDb->query( $query, array( 'map_id' ) );

			//@todo wj: this seems conspicously wrong as the result is going to be an array of set ids and set types - is this how I should get the data back
			if( $result && $result->numRows() ) {
				$this->mInfo = $result->fields;
				$this->mSetId = $result->fields['set_id'];
				$this->mSetType = $result->fields['set_type'];
				LibertyAttachable::load();
			}
			
		  return( count( $this->mInfo ) );
	}



	/**
	* This function gets the set data for a given settype/id
	**/
	function getSets( &$pParamHash ) {
		LibertyContent::prepGetList( $pParamHash );
			
			$set_id = $pParamHash['set_id'];
			//an example is for type "set_markers"			
			if ($pParamHash['set_type'] == 'set_markers') {

  			//@todo wj question: is configuration of bmm.`marker_id`=? $set_id" at the end correct?
				//@todo wj question: when to set equal to a value and when is it ok to just use "?" or other
  			$query = "SELECT bmm.*, FROM `".BIT_DB_PREFIX."bit_gmaps_markersets` bmm WHERE bmm.`set_id`=? $set_id";
  			$result = $this->mDb->query( $query, array( $set_id ) );
  
  			if( $result && $result->numRows() ) {
  				$this->mInfo = $result->fields;
  				$this->mStyleId = $result->fields['style_id'];
  				$this->mIconId = $result->fields['icon_id'];
  				$this->mSetData = $result->fields['data'];
  				LibertyAttachable::load();
  			}
			}
		return( count( $this->mInfo ) );
	}



	/**
	* Generates the URL to the sample page
	* @param pExistsHash the hash that was returned by LibertyContent::pageExists
	* @return the link to display the page.
	*/
	function getDisplayUrl() {
		$ret = NULL;
		if( !empty( $this->mBitmapId ) ) {
			$ret = BITMAP_PKG_URL."index.php?map_id=".$this->mBitmapId;
		}
		return $ret;
	}

	
?>
