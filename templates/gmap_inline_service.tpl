{strip}
{if $serviceHash.lat && $serviceHash.lng && $smarty.const.ACTIVE_PACKAGE != 'gmap'}
<div id="gmap-permalink">
	<a href="{$smarty.const.GMAP_PKG_URL}map_content.php?content_id={$serviceHash.content_id}" title="View on a Google Map">View location of this on a map</a> {biticon ipackage="icons" iname="applications-internet" iforce="icon"}
</div>
{/if}
{/strip}