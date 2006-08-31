<?php
if ($gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap')){
	$gBitSmarty->assign_by_ref('serviceHash', $editUser->mInfo );
	$gBitSmarty->assign('geo_edit_serv', TRUE);	
	$gBitSystem->mOnload[] = 'BitMap.EditContent();';
};
?>
