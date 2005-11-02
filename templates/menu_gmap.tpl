{strip}
<ul>
	{if $gBitUser->hasPermission( 'bit_mg_view_map' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}index.php">{biticon ipackage=liberty iname=home iexplain="Gmap Home" iforce="icon"} {tr}Gmap Home{/tr}</a></li>
	{/if}
</ul>
{/strip}