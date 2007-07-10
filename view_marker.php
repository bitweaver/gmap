<?php
// Initialization
require_once('../bit_setup_inc.php' );

// Is package installed and enabled
$gBitSystem->verifyPackage('gmap' );

// Now check permissions to access this page
$gBitSystem->verifyPermission('p_marker_view' );

// Get the map for specified gmap_id
require_once(GMAP_PKG_PATH.'lookup_marker_inc.php' );

//use Mochikit - prototype sucks
$gBitThemes->loadAjax( 'mochikit', array( 'Iter.js', 'DOM.js' ) );

if( $gContent->isCommentable() ) {
	$gBitThemes->loadAjax( 'mochikit', array( 'Style.js', 'Color.js', 'Position.js', 'Visual.js' ) );	
	$gBitSmarty->assign('comments_ajax', TRUE);
	$commentsParentId = $gContent->mContentId;
	$gBitSmarty->assign('commentsParentId', $commentsParentId);
	$comments_vars = Array('gmap');
	$comments_prefix_var='gmap:';
	$comments_object_var='gmap';
	$comments_return_url = $_SERVER['PHP_SELF']."view_marker.php?marker_id=".$gContent->mGmarkerId;
	include_once( LIBERTY_PKG_PATH.'comments_inc.php' );
}	

$gBitSmarty->assign_by_ref('marker', $gContent->mInfo);

echo $gBitSmarty->fetch('bitpackage:gmap/view_marker.tpl', tra('Gmap Marker') );
//$gBitSystem->display('bitpackage:gmap/view_marker.tpl', tra('Gmap Marker') );
?>
