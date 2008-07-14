{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && $gBitSystem->isFeatureActive('gmap_api_key')}
 {if $geo_edit_serv || $view_map || $simple_map || $map_list || $edit_map}
		{include file="bitpackage:gmap/header_base.tpl"}
 {/if}
 {if $smarty.const.ACTIVE_PACKAGE == 'gmap'}
	{if $view_map }
		<script src="{$smarty.const.GMAP_PKG_URL}scripts/Display.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/gxmarker2.js" type="text/javascript"></script>
	{/if}
	{if $simple_map }
		<script src="{$smarty.const.GMAP_PKG_URL}scripts/Display.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/gxmarker2.js" type="text/javascript"></script>
	{/if}
	{if $map_list }
		<script src="{$smarty.const.GMAP_PKG_URL}scripts/List.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/gxmarker2.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/yahoo.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/dom.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/event.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/calendar.js" type="text/javascript"></script>
		<link type="text/css" rel="stylesheet" href="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/calendar.css" />
	{/if}
	{if $edit_map }
		<script src="{$smarty.const.GMAP_PKG_URL}scripts/Utl.JSCSS.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}scripts/Display.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}scripts/Edit.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/gxmarker2.js" type="text/javascript"></script>
		<script type="text/javascript">
		LibertyServices = {ldelim}
			"ajax_edit_params":{ldelim}
				{if $connect_group_content_id}
				"connect_group_content_id":{$connect_group_content_id}
				{/if}
			{rdelim}
		{rdelim};
		</script>
	{/if}
		<script src="{$smarty.const.GMAP_PKG_URL}scripts/Utl.MapResize.js" type="text/javascript"></script>

	<style type="text/css">
		{if $simple_map}
		{literal}
			body {margin:0; padding:0}
		{/literal}
		{/if}
		{literal}
			.hide {display:none;}
			#gmap-sidepanel {float:right; margin:0; padding:0; width:300px; overflow:auto;}
			#gmap-sidepanel-table {margin:0; padding:0;}
			.gmap-tooltip {background:white; font-weight:bold; padding:2px 4px; white-space:nowrap; border:#999 solid 1px;}
			.data-date {width:36%; text-align:center}
			.data-rating {width:14%; text-align:center}
			div.data-header {background-color:#eee; font-weight:bold; font-size:1.1em; padding:1px 3px;}
			#gmap-cal-container {background:#fff;padding:6px;border:#333 solid 1px;}
			.gmarker-footer {margin-bottom:25px;clear:both;}
		{/literal}
		{if $edit_map }
    	{literal}
			.formlabel {float:none !important; width:100% !important; text-align:left !important;}
			.forminput {margin-left:0 !important;}
			td {vertical-align:top; padding:0px;}
			th {text-align:left;}
			.gmapsidedesc {margin:6px 0px;}
			.gmapsidelist {padding:0px 2px 0px 6px; line-height:1.5em; clear:both;}
			
			.edit-datatable {background-color:#feb; border-bottom:2px solid #f30;}
			.edit-datatable  ul {list-style-type:none; margin:16px 0 0 1em; padding:0;}
		    .edit-datatable  ul li {padding:.25em .5em;}
			.edit-titlebar {background-color:#cdf; margin:.5em 0em;}
			.edit-selected {background-color:#fc7; border-top:2px solid #f30;}
			.bar td {padding:1px 2px;}
			.edit-selected .bar a.list {background-color:#feb; padding:1px 6px 2px 6px;}
			.edit-select {background-color:#fff;}
			.edit-form				{margin:6px 0px; padding:8px; background:white}
			.tplform {background-color:#fff; margin:1em 0em; padding:2em; border:none;}
			table {border-collapse:collapse;}
			table.data td {padding:.5em;}
		{/literal}
		{/if}
		{if count($gContent->mMapMarkerStyles) > 0}
			{section name=markerstyledata loop=$gContent->mMapMarkerStyles}
				.tip-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}{rdelim}
				.win-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].window_styles}{rdelim}
			{/section}
		{/if}
   </style>
 {/if}
{/if}
