{strip}
<div id="{$smarty.const.ACTIVE_PACKAGE}-map" style="
	width:{if $gContent->mInfo.width}
		{if  $gContent->mInfo.width > 0}
			{$gContent->mInfo.width}px
		{else}
			auto
		{/if}
	{elseif $gBitSystem->getConfig("gmap_width")}
		{if $gBitSystem->getConfig("gmap_width") > 0}
			{$gBitSystem->getConfig("gmap_width")}px
		{else}
			auto
		{/if}
	{else}
		auto
	{/if};
	height:{if $gContent->mInfo.height}
		{if  $gContent->mInfo.height > 0}
			{$gContent->mInfo.height}px
		{else}
			auto
		{/if}
	{elseif $gBitSystem->getConfig("gmap_height")}
		{if $gBitSystem->getConfig("gmap_height") > 0}
			{$gBitSystem->getConfig("gmap_height")}px
		{else}
			auto
		{/if}
	{else}
		400px
	{/if};
	background-color:#ccc;">
	Google Map Goes Here
</div>
{/strip}
