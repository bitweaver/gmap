<?php
/**
 * @version $Header$
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
