{include file="bitpackage:bitmap/bitmap_header.tpl"}

<div id="bitmap">
  {include file="bitpackage:bitmap/bitmap_date_bar.tpl"}
  {include file="bitpackage:bitmap/bitmap_display.tpl"}
</div>

{if $feature_bitmap_comments eq 'y' }
<div id="mapcomments">
	{include file="bitpackage:liberty/comments.tpl"}
</div>
{/if}
