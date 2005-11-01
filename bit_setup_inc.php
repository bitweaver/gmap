<?php
	global $gBitSystem, $gBitUser, $gBitSmarty;
	$gBitSystem->registerPackage( 'gmap', dirname( __FILE__).'/' );

	if($gBitSystem->isPackageActive( 'gmap' ) ) {
		if ($gBitUser->hasPermission( 'bit_gm_view_map' )) {
			$gBitSystem->registerAppMenu( 'gmap', 'Gmap', GMAP_PKG_URL.'index.php', 'bitpackage:gmap/menu_gmap.tpl', 'gmap');
		}

		/* @todo wj: either of these wanted for gmap (source: WikiPackage)?
		$gBitSystem->registerNotifyEvent( array( "wiki_page_changes" => tra("Any wiki page is changed") ) );
		// Stuff found in kernel that is package dependent - wolff_borg
		// include_once( WIKI_PKG_PATH.'diff.php' );
		*/

		$gmapHomePage = $gBitSystem->getPreference("gmapHomePage", 'HomePage');
		//@todo wj: does this cause conflict with wiki or are these package independent and therefor can have same name?
		$anonCanEdit = $gBitSystem->getPreference("anonCanEdit", 'n');
		$gBitSmarty->assign('anonCanEdit', $anonCanEdit);
		$gBitSmarty->assign('gmapHomePage', $wikiHomePage);
	}

?>
