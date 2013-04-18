{strip}
{if $packageMenuTitle}<a class="dropdown-toggle" data-toggle="dropdown" href="#"> {tr}{$packageMenuTitle}{/tr} <b class="caret"></b></a>{/if}
<ul class="{$packageMenuClass}">
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}map_content.php">{booticon iname="icon-globe"  ipackage="icons"  iexplain="Map Site Content" ilocation="menu"}</a></li>
	{/if}	
	{if $gBitUser->hasPermission( 'p_gmap_view' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}list_gmaps.php">{booticon iname="icon-list" ipackage="icons" iexplain="List Maps" ilocation="menu"}</a></li>
	{/if}
	{if $gBitUser->hasPermission( 'p_gmap_create' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}edit.php">{booticon iname="icon-file" ipackage="icons" iexplain="Create a Map" ilocation="menu"}</a></li>
	{/if}
</ul>
{/strip}
