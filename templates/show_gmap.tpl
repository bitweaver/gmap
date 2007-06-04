{strip}
<div class="display gmap">
  {include file="bitpackage:gmap/gmap_header.tpl"}
  {include file="bitpackage:gmap/gmap_display.tpl"}
</div>

{if $gContent->getPreference('allow_comments') eq 'y'}
	{include file="bitpackage:liberty/comments.tpl"}
{/if}
{/strip}
