{strip}
<div class="body">
	<div id="map" style="width:{$gContent->mInfo.width}px; height:{$gContent->mInfo.height}px;"></div>
	{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
		<div id="editform"><a href="javascript:getEditTools();">Load Edit Tools</a></div>
	{/if}
	{$gContent->parseData()}
</div> <!-- end .body -->
{/strip}

