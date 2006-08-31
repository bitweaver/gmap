{if $view_map}
  {if $gBitUser->hasPermission( 'bit_gm_edit_map' )}
	 <div class="floaticon">
		  <a href="{$smarty.const.GMAP_PKG_URL}edit.php?gmap_id={$gContent->mInfo.gmap_id}" >{biticon ipackage=liberty iname="edit" iexplain="edit"}</a>
	 </div>
  {/if}
{/if}

<div class="header">
	<h1 id="mymaptitle">{if $gContent->mInfo.title}{$gContent->getTitle()}{elseif $edit_map}Create New Map{else}Stuff on a map{/if}</h1>
	<h2 id="mymapdesc">{$gContent->mInfo.description}</h2>
	{if $view_map}{include file="bitpackage:gmap/gmap_date_bar.tpl"}{/if}
</div><!-- end .header -->
