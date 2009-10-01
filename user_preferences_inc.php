<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/user_preferences_inc.php,v 1.6 2009/10/01 13:45:39 wjames5 Exp $
 *
 * Copyright (c) 2007 bitweaver.org
 * All Rights Reserved. See copyright.txt for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 * @author Will <will@wjamesphoto.com>
 * 
 * @package gmap
 * @subpackage functions
 */

if ($gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && $gBitSystem->isFeatureActive( 'gmap_map_bituser')){
	$gBitSmarty->assign_by_ref('serviceHash', $editUser->mInfo );
	$gBitSmarty->assign('geo_edit_serv', TRUE);	
	$gBitSystem->mOnload[] = 'BitMap.EditContent();';
};
?>
