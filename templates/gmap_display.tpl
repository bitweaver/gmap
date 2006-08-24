{strip}
<div class="body">
  <div id="mapsidepanel" /*class="hidden"*/ style="height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};">LINK LIST
	</div>
    {include file='bitpackage:gmap/map_inc.tpl'}
</div> <!-- end .body -->
{/strip}
