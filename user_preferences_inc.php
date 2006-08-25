<?php
if ($gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap')){
	$gBitSmarty->assign_by_ref('serviceHash', $editUser->mInfo );
	$gBitSystem->mOnload[] = 'BitMap.EditContent();';
};
?>