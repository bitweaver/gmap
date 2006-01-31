{strip}
<div class="body">
	<div id="map" style="width:{if $gContent->mInfo.width == 0}auto{else}{$gContent->mInfo.width}px{/if}; height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
	{$gContent->parseData()}
</div> <!-- end .body -->
{/strip}

