<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/admin/upgrades/1.1.1.php,v 1.1 2009/05/01 18:23:04 lsces Exp $
 */
global $gBitInstaller;

$infoHash = array(
	'package'      => GMAP_PKG_NAME,
	'version'      => str_replace( '.php', '', basename( __FILE__ )),
	'description'  => "Reduce length of sequence fields for Firebird/Oracle.",
);
$gBitInstaller->registerPackageUpgrade( $infoHash, array( 

array( 'DATADICT' => array(
	// Update sequence names
	array( 'RENAMESEQUENCE' => array(
		"gmaps_polylines_polyline_id_seq" => "gmaps_polyline_polyline_id_seq",
	)),
)),

));
?>
