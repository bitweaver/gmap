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
require_once( BITMAP_PKG_URL.'BitMap.php' );


// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('bitmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('bit_p_read_bitmap' );

if (!isset($_REQUEST['map_id'] ) ) {
    $_REQUEST['map_id'] = $gBitSystem->getPreference("home_bitmap");
}

require_once(BITMAP_PKG_PATH.'lookup_bitmap_inc.php' );



//@todo wj: this line from wiki package - might want to use it
include( BITMAP_PKG_URL.'display_bitmap_inc.php' );		



// Display the template
$gBitSystem->display('bitpackage:bitmap/show_bitmap.tpl', tra('BitMap') );

?>
