{strip}
<ul>
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}map_content.php">{biticon ipackage="icons" iname="applications-internet" iexplain="Map Site Content" ilocation="menu"}</a></li>
	{/if}	
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}list_gmaps.php">{booticon iname="icon-list" ipackage="icons" iexplain="List Maps" ilocation="menu"}</a></li>
	{/if}
	{if $gBitUser->hasPermission( 'p_gmap_create' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}edit.php">{booticon iname="icon-file" ipackage="icons" iexplain="Create a Map" ilocation="menu"}</a></li>
	{/if}
</ul>
{/strip}
