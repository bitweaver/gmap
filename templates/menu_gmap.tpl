{strip}
<ul>
	{if $gBitUser->hasPermission( 'bit_mg_view_map' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}index.php">{biticon ipackage=liberty iname=home iexplain="Gmap Home" iforce="icon"} {tr}Gmap Home{/tr}</a></li>
	{/if}
	
	{* @todo - how to turn this on? *}
	
	{if {* $gBitSystem->isFeatureActive( 'feature_listMaps' ) and *} $gBitUser->hasPermission( 'bit_mg_view_map' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}list_gmaps.php">{biticon ipackage=liberty iname=list iexplain="List Maps" iforce="icon"} {tr}List Maps{/tr}</a></li>
	{/if}
	{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
		<li><a class="item" href="{$smarty.const.GMAP_PKG_URL}edit.php">{biticon ipackage=liberty iname=new iexplain="Create Map" iforce="icon"} {tr}Create Map{/tr}</a></li>
	{/if}
</ul>
{/strip}
