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
		"gmaps_tilelayers_tilelayer_id_seq" => "gmaps_tilelayer_id_seq",
		"gmaps_copyrights_copyright_id_seq" => "gmaps_copyright_id_seq",
		"gmaps_marker_styles_style_id_seq" => "gmaps_marker_style_id_seq",
		"gmaps_polyline_styles_style_id_seq" => "gmaps_polyline_style_id_seq",
		"gmaps_polygon_styles_style_id_seq" => "gmaps_polygon_style_id_seq",
	)),
)),

));
?>
