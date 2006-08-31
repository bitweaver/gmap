{strip}
<div class="body">
  <div id="mapsidepanel" /*class="hide"*/ style="height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
  {include file='bitpackage:gmap/map_inc.tpl'}
</div> <!-- end .body -->
{/strip}
