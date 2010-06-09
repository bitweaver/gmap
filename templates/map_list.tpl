<div class="list gmap display">
{if $gBitSystem->getConfig('gmap_api_key')}    
  {include file="bitpackage:gmap/gmap_header.tpl"}
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
{elseif $gBitUser->isAdmin()}
	{formfeedback warning="You must get a Google Map API key from Google to use Gmap Package!"}
	Get and store your Google Maps API in the <a href="{$smarty.const.KERNEL_PKG_PATH}/admin/index.php?page=gmap">Gmap Package Administration Panel</a>
{else}
	Sorry, the Google Maps Package is not enabled on this site.
{/if}
</div>
<div id="error"></div>
