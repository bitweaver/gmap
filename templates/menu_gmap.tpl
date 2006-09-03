{strip}
<ul>
	{if $gBitUser->hasPermission( 'bit_gm_view_map' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}index.php">{biticon ipackage="icons" iname="go-home" iexplain="Gmap Home" iforce="icon"} {tr}Gmap Home{/tr}</a></li>
	{/if}	
	{if $gBitUser->hasPermission( 'bit_gm_view_map' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}list_gmaps.php">{biticon ipackage="icons" iname="format-justify-fill" iexplain="List Maps" iforce="icon"} {tr}List Maps{/tr}</a></li>
	{/if}
	{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}edit.php">{biticon ipackage="icons" iname="document-new" iexplain="Create Map" iforce="icon"} {tr}Create New Map{/tr}</a></li>
	{/if}
</ul>
{/strip}
