{if $feature_bitmap_sidebar eq 'y' }
	{include file="bitpackage:bitmap/bitmap_sidebar.tpl"}
	<div id="map" class="withsidebar"></map>
{else}
	<div id="map"></map>
{/if}
