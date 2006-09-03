<?php
	global $gContent;
	require_once( GMAP_PKG_PATH.'BitGmap.php');
	require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );

	// if we already have a gContent, we assume someone else created it for us, and has properly loaded everything up.
	if( empty( $gContent ) || !is_object( $gContent ) || !$gContent->isValid() ) {
		if (!empty($_REQUEST['gmap_id']) && is_numeric($_REQUEST['gmap_id'])) {		
			// if gmap_id supplied, use that
			$gContent = new BitGmap( $_REQUEST['gmap_id'] );
		} elseif (!empty($_REQUEST['content_id']) && is_numeric($_REQUEST['content_id'])) {
			// if content_id supplied, use that
			$gContent = new BitGmap( NULL, $_REQUEST['content_id'] );
		} else {
			// otherwise create new object
			$gContent = new BitGmap();
		}
		$gContent->load();

		$gBitSmarty->assign_by_ref( "gContent", $gContent );
	}
?>