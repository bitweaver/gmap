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

//Preview mode is handled by javascript on the client side.
//There is no callback to the server for previewing changes


//@todo wj: remove this part, as we are going to make an AJAX connection to a script that returns XML
// Check if the page has changed
if (!empty($_REQUEST["save_map"])) {
    if( $gContent->store( $_REQUEST ) ) {
        header("Location: ".$gContent->getDisplayUrl() );
        die;
    } else {
    	$gContent->mInfo = $_REQUEST['gmap_store'];
    	$gContent->mInfo['title'] = $_REQUEST['title'];
    	$gContent->mInfo['data'] = $_REQUEST['edit'];
        $gBitSmarty->assign_by_ref('errors', $gContent->mErrors );
    }
}

// Configure quicktags list
if ($gBitSystem->isPackageActive( 'quicktags' ) ) {
	include_once( QUICKTAGS_PKG_PATH.'quicktags_inc.php' );
}

// WYSIWYG and Quicktag variable
$gBitSmarty->assign( 'textarea_id', 'editsample' );

//set onload function in body
$gBodyOnload[] = 'loadMap()';

// Display the template
if( $gContent->isValid() ) {
	$mid = 'bitpackage:gmap/edit_gmap.tpl';
} else {
	$mid = 'bitpackage:gmap/create_gmap.tpl';
}
$gBitSystem->display( $mid, tra('Gmap') );
?>
