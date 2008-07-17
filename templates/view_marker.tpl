{if $pre_window}<div class="infowindow">{/if}
	{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='nav' serviceHash=$gContent->mInfo}
	<div class="display gmarker">
		<div class="header">
			<h1 id="mymarkertitle">{$gContent->getTitle()}</h1>
			<h2 id="mymarkerdesc">{$gContent->mInfo.description}</h2>
			{include file="bitpackage:gmap/gmap_date_bar.tpl"}
		</div><!-- end .header -->
		<div class="body">
			{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='body' serviceHash=$gContent->mInfo}
			{* we include a map natively if we are viewing the marker as a standalone page *}
			{if !$gBitThemes->isAjaxRequest()}
				<div class="gmap-permalink" style="overflow:hidden" width="{$gBitSystem->getConfig('gmap_inline_map_width',190)}" height="{$gBitSystem->getConfig('gmap_inline_map_height',190)}">
					{include file='bitpackage:gmap/map_inc.tpl'}
				</div>
			{/if}
			
			{if $marker.thumbnail_url}
				<div class="image">
					{assign var=size value=$gContent->getPreference('primary_attachment_size')|default:small}
					{jspopup notra=1 href=$marker.thumbnail_url.large alt=$marker.title|escape title=$marker.title|escape" img=$marker.thumbnail_url.$size}
				</div>
			{/if}
				
			<div id="markercontent" class="content">
				{$gContent->mInfo.parsed_data}
			</div>
		</div><!-- end .body --> 
	</div><!-- end .display -->
	<div class="gmarker-footer">
		{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='view' serviceHash=$gContent->mInfo}
		{if $gContent->isCommentable() }
			{if $pre_window}
				<div class="display">
					<a href="javascript:void(0);" onclick="BitMap.MapData[0].Map.map.getInfoWindow().maximize()">{if $comments != null}{$gContent->mInfo.num_comments}{else}0{/if} Comment(s)</a>
				</div>
			{else}
				{include file="bitpackage:liberty/comments.tpl"}
			{/if}
		{/if}
	</div><!-- end .gmarker-footer -->
{if $pre_window}</div>{/if}
