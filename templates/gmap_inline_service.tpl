{strip}
{if $serviceHash.lat && $serviceHash.lng && $smarty.const.ACTIVE_PACKAGE != 'gmap' && !$exclude_map_link }
<div class="gmap-permalink" style="float:right; width:190px; height:190px; padding:0; margin:0 0 1em 0;">
	<a href="{$smarty.const.GMAP_PKG_URL}map_content.php?content_id={$serviceHash.content_id}" title="View on a Google Map">View location of this on a map</a> {biticon ipackage="icons" iname="applications-internet" iforce="icon"}
	{assign var='path' value=$smarty.const.BIT_ROOT_URI|cat:"gmap/map_content.php?format=include&content_id="|cat:$serviceHash.content_id}
	<div><iframe src="{$path}" width="190" height="190"></iframe></div>
</div>
{/if}
{/strip}