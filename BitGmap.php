<?php

require_once( LIBERTY_PKG_PATH.'LibertyAttachable.php' );

define( 'BITGMAP_CONTENT_TYPE_GUID', 'bitgmap' );

class BitGmap extends LibertyAttachable {

	var $mGmapId;

	function BitGmap( $pGmapId=NULL, $pContentId=NULL ) {
		LibertyAttachable::LibertyAttachable();
		$this->mGmapId = $pGmapId;
		$this->mContentId = $pContentId;
		$this->mContentTypeGuid = BITGMAP_CONTENT_TYPE_GUID;
		$this->registerContentType( BITGMAP_CONTENT_TYPE_GUID, array(
			'content_type_guid' => BITGMAP_CONTENT_TYPE_GUID,
			'content_description' => 'gmap package with bare essentials',
			'handler_class' => 'BitGmap',
			'handler_package' => 'gmap',
			'handler_file' => 'BitGmap.php',
			'maintainer_url' => 'http://www.bitweaver.org'
		) );
	}
}

function gmap_content_edit() {
	global $gBitSmarty;
	global $gBitSystem;
	$gBitSmarty->assign('geo_edit', TRUE);
	$gBitSystem->mOnload[] = 'BitMap.EditContent();';
}
?>
