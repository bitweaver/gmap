{strip}
{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='nav' serviceHash=$gContent->mInfo}

<div class="display gmarker">
	<div class="header">
		<h1 id="mymarkertitle">{$gContent->getTitle()}</h1>
		<h2 id="mymarkerdesc">{$gContent->mInfo.description}</h2>
		{include file="bitpackage:gmap/gmap_date_bar.tpl"}
	</div><!-- end .header -->
	<div class="body">
		{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='body' serviceHash=$gContent->mInfo}
		
		{if $marker.thumbnail_url}
			<div class="image">
				{* @TODO create option for markers_image_size that admin can set *}
				{assign var=size value=$gBitSystem->getConfig('markers_image_size','small')}
				{jspopup notra=1 href=$marker.thumbnail_url.large alt=$marker.title|escape title=$marker.title|escape" img=$marker.thumbnail_url.$size}
			</div>
		{/if}
			
		<div id="markercontent" class="content">
			{$gContent->mInfo.parsed_data}
		</div>
	</div><!-- end .body --> 
</div><!-- end .display -->

{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='view' serviceHash=$gContent->mInfo}

{if $gContent->isCommentable() }
	{if $pre_window}
		<div><a href="javascript:void(0);" onclick="BitMap.MapData[0].Map.map.getInfoWindow().maximize()">{if $comments != null}{$gContent.num_comments}{else}0{/if} Comment(s)</a></div>
	{else}
		{include file="bitpackage:liberty/comments.tpl"}
	{/if}
{/if}
{/strip}