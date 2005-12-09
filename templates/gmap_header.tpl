{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
	<div class="floaticon">
		<a href="{$smarty.const.GMAP_PKG_URL}edit.php?gmap_id={$gContent->mMapData.gmap_id}" >{biticon ipackage=liberty iname="edit" iexplain="edit"}</a>
	</div>
{/if}

<div class="header">
	<h1>{$gContent->mMapData.title}</h1>
	<h2>{$gContent->mMapData.description}</h2>
	{include file="bitpackage:gmap/gmap_date_bar.tpl"}
</div><!-- end .header -->
