<?php
	global $gContent;
	require_once( GMAP_PKG_PATH.'BitGmap.php');
	require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );

	// if we already have a gContent, we assume someone else created it for us, and has properly loaded everything up.
	if( empty( $gContent ) || !is_object( $gContent ) || !$gContent->isValid() ) {
		// if sample_id supplied, use that
		if (!empty($_REQUEST['gmap_id']) && is_numeric($_REQUEST['gmap_id'])) {
			$gContent = new BitGmap( $_REQUEST['gmap_id'] );

		// if content_id supplied, use that
		} elseif (!empty($_REQUEST['content_id']) && is_numeric($_REQUEST['content_id'])) {
			$gContent = new BitGmap( NULL, $_REQUEST['content_id'] );

		// otherwise create new object
		} else {
			$gContent = new BitGmap();
		}

		//handle legacy forms that use plain 'sample' form variable name
		// TODO not sure what this does - wolff_borg
		if( empty( $gContent->mGmapId ) && empty( $gContent->mContentId )  ) {
		}
		$gContent->get_map();
		$smarty->assign_by_ref( "gContent", $gContent );
	}
?>