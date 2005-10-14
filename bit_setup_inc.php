<?php
	global $gBitSystem, $gBitUser, $gBitSmarty;
	$gBitSystem->registerPackage( 'bitmap', dirname( __FILE__).'/' );

	if($gBitSystem->isPackageActive( 'bitmap' ) ) {
		if ($gBitUser->hasPermission( 'bit_p_view_bitmap' )) {
			$gBitSystem->registerAppMenu( 'bitmap', 'BitMap', BITMAP_PKG_URL.'index.php', 'bitpackage:bitmap/menu_bitmap.tpl', 'bitmap');
		}

		/* @todo wj: address this later when getting into advanced features
		$gBitSystem->registerNotifyEvent( array( "wiki_page_changes" => tra("Any wiki page is changed") ) );

		// Stuff found in kernel that is package dependent - wolff_borg
		// include_once( WIKI_PKG_PATH.'diff.php' );

		$wikiHomePage = $gBitSystem->getPreference("wikiHomePage", 'HomePage');
		$anonCanEdit = $gBitSystem->getPreference("anonCanEdit", 'n');
		$gBitSmarty->assign('anonCanEdit', $anonCanEdit);
		$gBitSmarty->assign('wikiHomePage', $wikiHomePage);
		*/
}

?>
