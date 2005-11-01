<div class="floaticon">
		{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
		<a href="{$smarty.const.GMAP_PKG_URL}edit.php?gmap_id={$gContent->mMapData.gmap_id}" >{biticon ipackage=liberty iname="edit" iexplain="edit"}</a>
		{/if}
</div>

<div class="header">
		<h1 id="mymaptitle">{$gContent->mMapData.title}</h1>

		<h2 id="mymapdesc">{$gContent->mMapData.description}</h2>

	{include file="bitpackage:gmap/gmap_date_bar.tpl"}
</div><!-- end .header -->
