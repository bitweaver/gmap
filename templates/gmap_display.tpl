{strip}
<div class="body">
	<div class="content">
		<div id="map" style="width:{$gContent->mMapData.width}px; height:{$gContent->mMapData.height}px;"></div>
	{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
		<div id="editform"><a href="javascript:getEditTools();">Load Edit Tools</a></div>		
	{/if}
		<div class="clear"></div>
	</div> <!-- end .content -->
</div> <!-- end .body -->
{/strip}

