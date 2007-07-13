{strip}
<ul>
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}map_content.php">{biticon ipackage="icons" iname="applications-internet" iexplain="Shows Geo-Located Site Content on a Map" iforce="icon"} {tr}Map Site Content{/tr}</a></li>
	{/if}	
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}list_gmaps.php">{biticon ipackage="icons" iname="format-justify-fill" iexplain="List of Google Maps on This Site" iforce="icon"} {tr}List Maps{/tr}</a></li>
	{/if}
	{if $gBitUser->hasPermission( 'p_gmap_edit' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}edit.php">{biticon ipackage="icons" iname="document-new" iexplain="Create A New Google Map" iforce="icon"} {tr}Create New Map{/tr}</a></li>
	{/if}
</ul>
{/strip}
