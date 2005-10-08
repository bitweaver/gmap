<?php
	global $gContent;
	require_once( SAMPLE_PKG_PATH.'BitMap.php');
	require_once( LIBERTY_PKG_PATH.'lookup_content_inc.php' );

	// if we already have a gContent, we assume someone else created it for us, and has properly loaded everything up.
	if( empty( $gContent ) || !is_object( $gContent ) || !$gContent->isValid() ) {
		// if sample_id supplied, use that
		if (!empty($_REQUEST['map_id']) && is_numeric($_REQUEST['map_id'])) {
			$gContent = new BitMap( $_REQUEST['map_id'] );

		// if content_id supplied, use that
		} elseif (!empty($_REQUEST['content_id']) && is_numeric($_REQUEST['content_id'])) {
			$gContent = new BitMap( NULL, $_REQUEST['content_id'] );

		// otherwise create new object
		} else {
			$gContent = new BitSample();
		}

		//handle legacy forms that use plain 'sample' form variable name
		// TODO not sure what this does - wolff_borg
		if( empty( $gContent->mBitmapId ) && empty( $gContent->mContentId )  ) {
		}
		$gContent->load();
		$smarty->assign_by_ref( "gContent", $gContent );
	}
?>