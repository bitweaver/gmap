<?php

if ( $gBitSystem->isPackageActive('geo') && 
	 $gBitSystem->isPackageActive('gmap') &&
	 $gBitSystem->isFeatureActive('gmap_api_key') ){	

	//BUG: this include causes gContent to be set which messes some things up in the gmap tpls.
	$content = LibertyBase::getLibertyObject( $_REQUEST['content_id'] );
	$content->load( TRUE );
	$content->verifyViewPermission();
	$dataHash = $content->mInfo;

	// because content mInfo does not hand over the same info as contentList as below we need to complete the hash
	$dataHash['display_url'] = !empty($dataHash['display_url'])?$dataHash['display_url']:$content->getDisplayUrl();
	$dataHash['creator_user_id'] = !empty($dataHash['creator_user_id'])?$dataHash['creator_user_id']:$dataHash['user_id'];
	$dataHash['content_description'] = !empty($dataHash['content_description'])?$dataHash['content_description']:$content->mType['content_description'];
	$dataHash['gmap_zoom'] = $content->getPreference( 'gmap_zoom' );
//			$dataHash['real_name'] = !empty($dataHash['real_name'])?$dataHash['real_name']:$dataHash['creator_user'];
	$dataHash['creator_real_name'] = !empty($dataHash['creator_real_name'])?$dataHash['creator_real_name']:$dataHash['real_name'];
	if (empty($dataHash['modifier_real_name'])){
		$modUser = new BitUser( $dataHash['modifier_user_id'] );
		$modUser->load();
		$dataHash['modifier_real_name'] = $modUser->mInfo['real_name'];
	}
	
	//assign it in an array as a single item list
	$aContent = array( $dataHash );
	$gBitSmarty->assign_by_ref('listcontent', $aContent);

	//format include is for the inline service of including a map in other content when geo-located
	//we exit right away if thats all we need
	if (isset($_REQUEST['format']) && $_REQUEST['format']=="include"){
		//use Mochikit - prototype sucks
		$gBitThemes->loadAjax( 'mochikit', array( 'Base.js', 'Iter.js', 'Async.js', 'DOM.js', 'DateTime.js',  'Style.js' ) );

		//if the format is include then this is called internally as an iframe so we hide the rest of the layout
		$gHideModules = TRUE;
		$gBitSmarty->assign('simple_map', TRUE);
		//this disables marker clicking since infowindow would only contain the data thats already on display
		$gBitSystem->mOnload[] = 'BitMap.DisplaySimple();';
		$gBitThemes->setStyle( 'none' );
		$gBitSystem->display( 'bitpackage:gmap/map_inc.tpl', tra( 'Map' ) , array( 'display_mode' => 'display' ));
		die;
	}
}