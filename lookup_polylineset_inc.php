<?php
	global $gContent;
	require_once( GMAP_PKG_PATH.'BitGmapPolylineSet.php');
	require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );

	// if we already have a gContent, we assume someone else created it for us, and has properly loaded everything up.
	if( empty( $gContent ) || !is_object( $gContent ) || !$gContent->isValid() ) {
		if (!empty($_REQUEST['set_id']) && is_numeric($_REQUEST['set_id'])) {
			// if sample_id supplied, use that
			$gContent = new BitGmapPolylineSet( $_REQUEST['set_id'] );
		} elseif (!empty($_REQUEST['content_id']) && is_numeric($_REQUEST['content_id'])) {
			// if content_id supplied, use that
			$gContent = new BitGmapPolylineSet( NULL, $_REQUEST['content_id'] );
		} else {
			// otherwise create new object
			$gContent = new BitGmapPolylineSet();
		}
		if (empty($_REQUEST['gmap_id']) || !is_numeric($_REQUEST['gmap_id'])){
			$_REQUEST['gmap_id'] = NULL;
		}
		$gContent->load( $_REQUEST['gmap_id'] );

		$gBitSmarty->assign_by_ref( "gContent", $gContent );
	}
?>