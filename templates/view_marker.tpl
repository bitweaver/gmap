{strip}
<div class="display gmarker">
	<div class="header">
		<h1 id="mymarkertitle">{$gContent->getTitle()}</h1>
		<h2 id="mymarkerdesc">{$gContent->mInfo.description}</h2>
		{include file="bitpackage:gmap/gmap_date_bar.tpl"}
	</div><!-- end .header -->
	<div class="body">
		<div id="markercontent" class="content">
			{$gContent->mInfo.parsed_data}
		</div>
	</div> <!-- end .body -->
</div>
{if $gContent->isCommentable() }
	{include file="bitpackage:liberty/comments.tpl"}
{/if}
{/strip}
