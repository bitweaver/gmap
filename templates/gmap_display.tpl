{strip}
<div class="body">
  <div id="mapsidepanel" class="hide" style="height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};">
	</div>
	<div id="map" style="{if $gContent->mInfo.width == 0}{else}width:{$gContent->mInfo.width}px{/if}; height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
	<div class="content">
		{$gContent->mInfo.parsed_data}
	</div>
</div> <!-- end .body -->
{/strip}

