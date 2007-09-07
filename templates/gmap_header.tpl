{strip}
{if $gBitUser->hasPermission( 'p_users_view_icons_and_tools' )}
	{if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
	 <div class="floaticon">
		  <a href="{$smarty.const.GMAP_PKG_URL}edit.php?gmap_id={$gContent->mInfo.gmap_id}" >{biticon ipackage="icons" iname="accessories-text-editor" iexplain="edit"}</a>
	 </div>
	{/if}
{/if}

<div class="header" id="gmap-header">
	<h1 id="mymaptitle">{if $gContent->mInfo.title}{$gContent->getTitle()}{elseif $edit_map}Create New Map{else}Map Geo-Located Site Content{/if}</h1>
	<h2 id="mymapdesc">{$gContent->mInfo.description}</h2>
	{include file="bitpackage:gmap/gmap_date_bar.tpl"}
	{if $map_list}{include file="bitpackage:gmap/list_form.tpl"}{/if}
</div><!-- end .header -->
{/strip}
