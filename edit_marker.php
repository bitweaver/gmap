<?php
// Copyright (c) 2005 bitweaver Gmap
// All Rights Reserved. See copyright.txt for details and a complete list of authors.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

//@todo consolidate the xml headers, they are all the same

// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('bit_gm_edit_map' );

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_marker_inc.php' );

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes.

if (!empty($_REQUEST["save_marker"])) {
    if( $gContent->store( $_REQUEST ) ) {		
		//$gContent->storePreference( 'is_public', !empty( $_REQUEST['is_public'] ) ? $_REQUEST['is_public'] : NULL );
		$gContent->storePreference( 'allow_comments', !empty( $_REQUEST['allow_comments'] ) ? $_REQUEST['allow_comments'] : NULL );
		$gContent->load();    
    
		//if store is successful we return XML
		$mRet = "<marker>"
			."<id>".$gContent->mInfo['marker_id']."</id>"
			."<title>".$gContent->getTitle()."</title>"
			."<marker_type>".$gContent->mInfo['marker_type']."</marker_type>"
			."<lat>".$gContent->mInfo['lat']."</lat>"
			."<lng>".$gContent->mInfo['lng']."</lng>"
			."<data>".$gContent->mInfo['xml_data']."</data>"
			."<parsed_data><![CDATA[".$gContent->mInfo['xml_parsed_data']."]]></parsed_data>"
			."<label>".$gContent->mInfo['label_data']."</label>"
			."<photo_url>".$gContent->mInfo['photo_url']."</photo_url>"
			."<z>".$gContent->mInfo['zindex']."</z>"
			."<allow_comments>".(($gContent->getPreference('allow_comments') == 'y')?"y":"n")."</allow_comments>"
			."</marker>";

		//@todo replace in xml when I know what I am doing
		//	."<data>".$gContent->parseData()."</data>"
	}else{
	//@todo - return some sort of store failure message in the xml
	$gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
}
						
//Check if this to remove from a set, or to delete completely
}elseif (!empty($_REQUEST["remove_marker"])) {
    if( $gContent->removeFromSet( $_REQUEST ) ) {
				//if store is successful we return XML
				$mRet = "<remove>success</remove>";

		}else{
		//@todo - return some sort of remove failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}elseif (!empty($_REQUEST["expunge_marker"])) {
    if( $gContent->expunge() ) {
				//if store is successful we return XML
				$mRet = "<remove>success</remove>";

		}else{
		//@todo - return some sort of remove failure message in the xml
      $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}

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
     		
print_r($mRet);

die;

?>
