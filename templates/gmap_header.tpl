{strip}
{if $view_map}
  {if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
	 <div class="floaticon">
		  <a href="{$smarty.const.GMAP_PKG_URL}edit.php?gmap_id={$gContent->mInfo.gmap_id}" >{biticon ipackage="icons" iname="accessories-text-editor" iexplain="edit"}</a>
	 </div>
  {/if}
{/if}

<div class="header">
	<h1 id="mymaptitle">{if $gContent->mInfo.title}{$gContent->getTitle()}{elseif $edit_map}Create New Map{else}Map Geo-Located Site Content{/if}</h1>
	<h2 id="mymapdesc">{$gContent->mInfo.description}</h2>
	{include file="bitpackage:gmap/gmap_date_bar.tpl"}
</div><!-- end .header -->
{/strip}
