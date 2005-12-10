{strip}
<div class="body">
	<div class="content">
		<div id="map" style="width:{$gContent->mInfo.width}px; height:{$gContent->mInfo.height}px;"></div>
	{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
		<div id="editform"><a href="javascript:getEditTools();">Load Edit Tools</a></div>
	{/if}
		{$gContent->parseData()}
		<div class="clear"></div>
	</div> <!-- end .content -->
</div> <!-- end .body -->
{/strip}

