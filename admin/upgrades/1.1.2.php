<?php
/**
 * @version $Header$
 */
global $gBitInstaller;

$infoHash = array(
	'package'      => GMAP_PKG_NAME,
	'version'      => str_replace( '.php', '', basename( __FILE__ )),
	'description'  => "Set base position values for all overlays and sets so that auto sequencing and sorting works nicely. Position values are derived from the created date.",
);
$gBitInstaller->registerPackageUpgrade( $infoHash, array( 

array( 'PHP' => '
// Is package installed and enabled
global $gBitSystem;

$gBitSystem->verifyPackage( "gmap" );

// yeah we need all these
require_once(GMAP_PKG_PATH."BitGmap.php" );
require_once( GMAP_PKG_PATH."BitGmapMarkerSet.php");
require_once( GMAP_PKG_PATH."BitGmapPolylineSet.php");
require_once( GMAP_PKG_PATH."BitGmapPolygonSet.php");
require_once( GMAP_PKG_PATH."BitGmapMarker.php");
require_once( GMAP_PKG_PATH."BitGmapPolyline.php");
require_once( GMAP_PKG_PATH."BitGmapPolygon.php");

// for code legibility
$listHashBase = array( "max_records" => 99999 );

// list of all maps
$gmap = new BitGmap();
$listHash1 = $listHashBase;
$rslt = $gmap->getList( $listHash1 ); 
if( !empty( $rslt["data"] ) ){
	$maps = $rslt["data"];
	// for each map set the pos values of its overlay sets
	foreach( $maps as $key=>$map ){
		gmap_reset_set_pos( $map["gmap_id"], "BitGmapMarkerSet", "markers" );
		gmap_reset_set_pos( $map["gmap_id"], "BitGmapPolylineSet", "polylines" );
		gmap_reset_set_pos( $map["gmap_id"], "BitGmapPolygonSet", "polygons" );
		gmap_reset_overlay_pos( "BitGmapMarkerSet", "BitGmapMarker", "marker" );
		gmap_reset_overlay_pos( "BitGmapPolylineSet", "BitGmapPolyline", "polyline" );
		gmap_reset_overlay_pos( "BitGmapPolygonSet", "BitGmapPolygon", "polygon" );
	}
}

function gmap_reset_set_pos( $pGmapId, $pOverlaySetClass, $pOverlaySetType ){
	// get list of overlay mappings by gmap id
	$set = new $pOverlaySetClass();

	$listHash2 = array( "max_records" => 99999, "sort_mode" => "created_asc" );
	$listHash2["gmap_id"] = $pGmapId;

	$rslt1 = $set->getList( $listHash2 ); 
	if( !empty( $rslt1["data"] ) ){
		$overlaysets = $rslt1["data"]; 
		$pos = 0;
		foreach( $overlaysets as $key=>$overlayset ){
			$query = "UPDATE `".BIT_DB_PREFIX."gmaps_sets_keychain` SET `pos` = ? WHERE `set_type` = ? AND `gmap_id` = ? AND `set_id` = ?"; 
			$bind_vars = array( $pos, $pOverlaySetType, $pGmapId, $overlayset["set_id"] );
			$set->mDb->query( $query, $bind_vars );
			// auto increment the pos value
			$pos++;
		}
	}
}

function gmap_reset_overlay_pos( $pOverlaySetClass, $pOverlayClass, $pOverlayDesc ){
	// get all overlay sets of the give class 
	$set = new $pOverlaySetClass();
	$listHash3 = array( "max_records" => 99999 );
	$rslt2 = $set->getList( $listHash3 ); 
	if( !empty( $rslt2["data"] ) ){
		$overlaysets = $rslt2["data"]; 

		foreach( $overlaysets as $key=>$overlayset ){
			$overlay = new $pOverlayClass();
			$listHash4 = array( "max_records" => 99999, "sort_mode" => "created_asc" );
			$listHash4["set_id"] = $overlayset["set_id"];
			// get list of all overlays mapped to the set
			$rslt3 = $overlay->getList( $listHash4 );
			if( !empty( $rslt3["data"] ) ){
				$overlays = $rslt3["data"]; 

				// for each overlay in a set, set the pos values
				$pos = 0;
				foreach( $overlays as $key=>$object ){
					$query = "UPDATE `".BIT_DB_PREFIX."gmaps_".$pOverlayDesc."_keychain` SET `pos` = ? WHERE `".$pOverlayDesc."_id` = ? AND `set_id` = ?"; 
					$bind_vars = array( $pos, $object[$pOverlayDesc."_id"], $overlayset["set_id"] );
					$set->mDb->query( $query, $bind_vars );
					// auto increment the pos value
					$pos++;
				}
			}
		}
	}
}
' ),

));


