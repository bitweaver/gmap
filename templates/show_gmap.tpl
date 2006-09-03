<div class="display gmap">
  {include file="bitpackage:gmap/gmap_header.tpl"}
  {include file="bitpackage:gmap/gmap_display.tpl"}
</div>

{if $feature_gmap_comments eq 'y' }
<div id="mapcomments">
	{include file="bitpackage:liberty/comments.tpl"}
</div>
{/if}
