<?php
/**
 * @version v .0 ?
 * @package bitMapki
 *
 * @author Will <will@wjamesphoto.com>
 *
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
 * required setup
 */

/**
 * wj: Most of this page is based on the Sample Package
 */
 
require_once( '../bit_setup_inc.php' );
require_once( BITMAP_PKG_URL.'BitGmap.php' );


// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('bit_p_read_gmap' );

if (!isset($_REQUEST['gmap_id'] ) ) {
    $_REQUEST['gmap_id'] = $gBitSystem->getPreference("home_gmap");
}

require_once(BITMAP_PKG_PATH.'lookup_gmap_inc.php' );


//@todo wj: this line from wiki package - might want to use it
//include( BITMAP_PKG_URL.'display_gmap_inc.php' );		


// Display the template
$gBitSystem->display('bitpackage:gmap/show_gmap.tpl', tra('Gmap') );

?>
