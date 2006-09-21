{strip}
<div id="gmap-sidepanel" class="module box hide" style="
	{* height:{if $gContent->mInfo.height == 0}
            auto
          {else}
            {$gContent->mInfo.height}px
          {/if}; *}
          
	height: {if $gContent->mInfo.height}
		{if $gContent->mInfo.height == 0}
			auto
		{else}
			{$gContent->mInfo.height}px
		{/if}
	{elseif $gBitSystem->getConfig("gmap_height")}
		{if $gBitSystem->getConfig("gmap_height") == 0}
			auto
		{else}
			{$gBitSystem->getConfig("gmap_height")}px
		{/if}
	{else}
		400px
	{/if}
">
	<h3>Search Results</h3>
	<div id="gmap-sidepanel-table" class="boxcontent"></div>
</div>
{/strip}
