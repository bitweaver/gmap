{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
	<div class="floaticon">
		<a href="{$smarty.const.GMAP_PKG_URL}edit.php?gmap_id={$gContent->mInfo.gmap_id}" >{biticon ipackage=liberty iname="edit" iexplain="edit"}</a>
	</div>
{/if}

<div class="header">
	<h1>{$gContent->getTitle()}</h1>
	{if $gContent->mInfo.description}
		<h2>{$gContent->mInfo.description}</h2>
	{/if}
	{include file="bitpackage:gmap/gmap_date_bar.tpl"}
</div><!-- end .header -->
