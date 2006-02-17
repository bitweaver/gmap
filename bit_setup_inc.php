<?php
global $gBitSystem, $gBitUser, $gBitSmarty;

$registerHash = array(
	'package_name' => 'gmap',
	'package_path' => dirname( __FILE__ ).'/',
);
$gBitSystem->registerPackage( $registerHash );

if($gBitSystem->isPackageActive( 'gmap' ) ) {
	if ($gBitUser->hasPermission( 'bit_gm_view_map' )) {
		$gBitSystem->registerAppMenu( GMAP_PKG_DIR, 'Gmap', GMAP_PKG_URL.'index.php', 'bitpackage:gmap/menu_gmap.tpl', 'gmap');
	}

	$gmapHomePage = $gBitSystem->getPreference("gmapHomePage", 'HomePage');
	//@todo wj: does this cause conflict with wiki or are these package independent and therefor can have same name?
	$anonCanEdit = $gBitSystem->getPreference("anonCanEdit", 'n');
	$gBitSmarty->assign('anonCanEdit', $anonCanEdit);
	$gBitSmarty->assign('gmapHomePage', $gmapHomePage);
}

?>
