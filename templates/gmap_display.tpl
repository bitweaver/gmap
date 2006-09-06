{strip}
<div class="body">
	<div class="content">
  <div id="mapsidepanel" class="hide" style="height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
  {include file='bitpackage:gmap/map_inc.tpl'}
  </div>
</div> <!-- end .body -->
{/strip}
