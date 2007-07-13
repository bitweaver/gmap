{strip}
<div class="display gmap">
	{include file="bitpackage:gmap/gmap_header.tpl"}
	{include file="bitpackage:gmap/gmap_display.tpl"}
</div>

{if $gContent->isCommentable() }
	{include file="bitpackage:liberty/comments.tpl"}
{/if}
{/strip}
