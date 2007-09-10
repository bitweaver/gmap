{strip}
{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='nav' serviceHash=$gContent->mInfo}

<div class="display gmap">
	{include file="bitpackage:gmap/gmap_header.tpl"}
	{include file="bitpackage:gmap/gmap_display.tpl"}
</div>

{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='view' serviceHash=$gContent->mInfo}

{if $gContent->isCommentable() }
	{include file="bitpackage:liberty/comments.tpl"}
{/if}
{/strip}