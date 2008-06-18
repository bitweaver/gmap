{strip}
<ul>
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}map_content.php">{biticon ipackage="icons" iname="applications-internet" iexplain="Map Site Content" ilocation="menu"}</a></li>
	{/if}	
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}list_gmaps.php">{biticon ipackage="icons" iname="format-justify-fill" iexplain="List Maps" ilocation="menu"}</a></li>
	{/if}
	{if $gBitUser->hasPermission( 'p_gmap_edit' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}edit.php">{biticon ipackage="icons" iname="document-new" iexplain="Create a Map" ilocation="menu"}</a></li>
	{/if}
</ul>
{/strip}
