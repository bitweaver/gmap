{strip}
<div class="body">
	<div class="content">
		{include file='bitpackage:gmap/gmap_sidepanel.tpl'}
		{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='body' serviceHash=$gContent->mInfo}
		{include file='bitpackage:gmap/map_inc.tpl'}
	</div>
    {* if stars is active we include a model stars div
     * the container div has the id of 'stars-rating-1'
     *}   
	{if $gBitSystem->isPackageActive('stars') }
    <div id="iwindow-stars" style="display:none">
		{include file="bitpackage:stars/stars_list_service.tpl" serviceHash=$GeoStars}
	</div>
	{/if}
	<div id="mapcontent" class="content">
		{$gContent->mInfo.clean_data}
	</div>
</div> <!-- end .body -->
{/strip}
