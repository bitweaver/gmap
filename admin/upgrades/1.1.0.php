<?php
/**
 * @version $Header: /cvsroot/bitweaver/_bit_gmap/admin/upgrades/1.1.0.php,v 1.3 2009/02/28 03:32:10 tekimaki_admin Exp $
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
		"gmaps_tilelayers_tilelayer_id_seq" => "gmaps_tilelayer_id_seq",
		"gmaps_copyrights_copyright_id_seq" => "gmaps_copyright_id_seq",
		"gmaps_marker_styles_style_id_seq" => "gmaps_marker_style_id_seq",
		"gmaps_polyline_styles_style_id_seq" => "gmaps_polyline_style_id_seq",
		"gmaps_polygon_styles_style_id_seq" => "gmaps_polygon_style_id_seq",
	)),
)),

));
?>
