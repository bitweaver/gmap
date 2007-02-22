<div class="list gmap display">
  {include file="bitpackage:gmap/gmap_header.tpl"}
  {include file="bitpackage:gmap/list_form.tpl"}
  <div class="body">
	<div class="gmap-content">
	
	{strip}
	<div id="gmap-sidepanel" class="module box hide" style="
		{* height:{if $gContent->mInfo.height == 0}
				auto
			  {else}
				{$gContent->mInfo.height}px
			  {/if}; *}
			  
		height: {if $gContent->mInfo.height}
			{if $gContent->mInfo.height == 0}
				auto
			{else}
				{$gContent->mInfo.height}px
			{/if}
		{elseif $gBitSystem->getConfig("gmap_height")}
			{if $gBitSystem->getConfig("gmap_height") == 0}
				auto
			{else}
				{$gBitSystem->getConfig("gmap_height")}px
			{/if}
		{else}
			400px
		{/if}
	">
		<h3>Search Results</h3>
		<div id="gmap-sidepanel-table" class="boxcontent"></div>
	</div>
	{/strip}

	{include file='bitpackage:gmap/map_inc.tpl'}
	</div>
	<div class="content">
		{$gContent->mInfo.clean_data}
	</div>
  </div> <!-- end .body -->
</div>
<div id="error"></div>
