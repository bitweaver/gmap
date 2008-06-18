{strip}
{if $serviceHash.lat && $serviceHash.lng && $smarty.const.ACTIVE_PACKAGE != 'gmap' && !$exclude_map_link }
	<div class="gmap-permalink">
		{assign var=iforce value=icon_text}
		{if $location == icon}
			{assign var=iforce value=icon}
		{/if}

		<a href="{$smarty.const.GMAP_PKG_URL}map_content.php?content_id={$serviceHash.content_id}" title="View on a Google Map">{biticon ipackage="icons" iname="applications-internet" iforce=$iforce iexplain="View location on map"}</a>

		{if $location != icon}
			{assign var='path' value=$smarty.const.GMAP_PKG_URL|cat:"map_content.php?format=include&content_id="|cat:$serviceHash.content_id}
			<div><iframe src="{$path}" width="{$gBitSystem->getConfig('gmap_inline_map_width',190)}" height="{$gBitSystem->getConfig('gmap_inline_map_height',190)}"></iframe></div>
		{/if}
	</div>
{/if}
{/strip}
