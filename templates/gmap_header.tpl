{strip}
{if $gBitUser->hasPermission( 'p_users_view_icons_and_tools' )}
	{if !$map_list && !$edit_map && $gContent->hasEditPermission()}
	 <div class="floaticon">
		  <a href="{$smarty.const.GMAP_PKG_URL}edit.php?gmap_id={$gContent->mInfo.gmap_id}" >{biticon ipackage="icons" iname="accessories-text-editor" iexplain="edit"}</a>
	 </div>
	{/if}
{/if}

<div class="header" id="gmap-header">
	<h1 id="map_title">{if $gContent->mInfo.title}{$gContent->getTitle()}{elseif $edit_map}Create New Map{else}Map Geo-Located Site Content{/if}</h1>
	{if !$map_list}<h2 id="map_desc">{$gContent->mInfo.summary}</h2>
		{include file="bitpackage:gmap/gmap_date_bar.tpl"}
	{else}
		{include file="bitpackage:gmap/list_form.tpl"}
	{/if}
</div><!-- end .header -->
{/strip}
