{strip}
<div class="body">
	<div class="content">
		{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='body' serviceHash=$gContent->mInfo}
		{include file='bitpackage:gmap/gmap_sidepanel.tpl'}
		{include file='bitpackage:gmap/map_inc.tpl'}
	</div>
	<div id="mapcontent" class="content" style="clear:both">
		{$gContent->mInfo.clean_data}
	</div>
</div> <!-- end .body -->
{/strip}
