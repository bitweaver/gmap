{strip}
{if $serviceHash.lat && $serviceHash.lng && $smarty.const.ACTIVE_PACKAGE != 'gmap' && !$exclude_map_link }
	<div class="gmap-permalink">
		{assign var=iforce value=icon_text}
		{if $location == icon}
			{assign var=iforce value=icon}
		{/if}

		<a href="{$smarty.const.GMAP_PKG_URL}map_content.php?content_id={$serviceHash.content_id}" title="View on a Google Map">{booticon iname="icon-globe"  ipackage="icons"  iforce=$iforce iexplain="View location on map"}
		{if $location != icon}
			{assign var='path' value=$smarty.const.GMAP_PKG_URL|cat:"map_content.php?format=include&content_id="|cat:$serviceHash.content_id}
			<div>
				{* left here for convenience
				its possible one might want to imbed a fully funcitonal map in an iframe
				but this is very costly to the user - especially on lists with multiple maps *}
				{*
				<iframe src="{$path}" width="{$gBitSystem->getConfig('gmap_inline_map_width',190)}" height="{$gBitSystem->getConfig('gmap_inline_map_height',190)}"></iframe>
				*}
				<img src="http://maps.google.com/staticmap?center={$serviceHash.lat},{$serviceHash.lng}&zoom=7&size={$gBitSystem->getConfig('gmap_inline_map_width',190)}x{$gBitSystem->getConfig('gmap_inline_map_height',190)}&maptype=roadmap\&key={$gBitSystem->getConfig('gmap_api_key')}&sensor=false&markers={$serviceHash.lat},{$serviceHash.lng}" />
			</div>
		{/if}
		</a>
	</div>
{/if}
{/strip}
