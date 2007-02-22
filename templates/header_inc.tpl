{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') }
 {if $geo_edit_serv || $view_map || $map_list || $edit_map}
		{include file="bitpackage:gmap/header_base.tpl"}
 {/if}
 {if $smarty.const.ACTIVE_PACKAGE == 'gmap'}
	{if $view_map }
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Base.js" type="text/javascript"></script>
  		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Iter.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/DOM.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}templates/Display.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/gxmarker2.js" type="text/javascript"></script>
	{/if}
	{if $map_list }
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Base.js" type="text/javascript"></script>
  		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Iter.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Async.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/DOM.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/DateTime.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Style.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}templates/List.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/gxmarker2.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/yahoo.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/dom.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/event.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/calendar.js" type="text/javascript"></script>
		<link type="text/css" rel="stylesheet" href="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/calendar.css">
	{/if}
	{if $edit_map }
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Base.js" type="text/javascript"></script>
  	    <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Iter.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Async.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/DOM.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}templates/Display.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}templates/Edit.js" type="text/javascript"></script>
	{/if}

	<style type="text/css">
		{if $map_list }
		{literal}
		#gmap-sidepanel {float:right; margin:0; padding:0; width:300px; overflow:auto;}
		#gmap-sidepanel-table {margin:0; padding:0;}
		.gmap-tooltip {background:white; font-weight:bold; padding:2px 4px; white-space:nowrap; border:#999 solid 1px;}
		#gmap-cal-container {background:#fff;padding:6px;border:#333 solid 1px;}
  		table.data {border-collapse:collapse;}
  		table.data td{border-top:#eee solid 1px;padding:1px 3px;}
		div.data-header {background-color:#eee; font-weight:bold; font-size:1.1em; padding:1px 3px;}
		.data-date {width:36%; text-align:center}
		.data-rating {width:14%; text-align:center}
		{/literal}
		{elseif $edit_map }
    	{literal}
		  td {vertical-align:top; padding:0px;}
		  th {text-align:left;}
		  .map-op {margin-right:160px;}
		  .gmapeditstrong {background-color:#ddd;}
		  .gmapsideicon {float:left; margin-right:3px;}
		  .gmapsidedesc {margin:6px 0px;}
		  .gmapsidelist {padding:0px 2px 0px 6px; line-height:1.5em; clear:both;}

		  .edit-optionstable {background-color:#eef; border-bottom:2px solid #f30;}
		  .edit-datatable {background-color:#feb; border-bottom:2px solid #f30;}
		  .edit-datatable ul {margin-left:0em;}
		  .edit-datatable ul li {margin:0; padding:.25em 1em;}
		  .edit-titlebar {background-color:#cdf; margin:.5em 0em;}
		  .edit-selected {background-color:#fc7; border-top:2px solid #f30;}
		  .edit-selected .bar a.list {background-color:#feb}
		  .edit-select {background-color:#fff;}
		  .tplform {background-color:#fff; margin:1em 0em; padding:2em; border:none;}
		  table {border-collapse:collapse;}
		  table.data td {padding:.5em;}
		{/literal}
		{else}
		{literal}
			#gmap-sidepanel {float:right; margin:0; padding:0; width:300px; overflow:auto;}
			#gmap-sidepanel-table {margin:0; padding:0;}
			table.data {border-collapse:collapse;}
			table.data td{border-top:#eee solid 1px;padding:1px 3px;}
			div.data-header {background-color:#eee; font-weight:bold; font-size:1.1em; padding:1px 3px;}
			.data-date {width:36%; text-align:center}
			.data-rating {width:14%; text-align:center}
		{/literal}
		{/if}
	   
    {literal}
      .hide {display:none;}
    {/literal}
	  {if count($gContent->mMapMarkerStyles) > 0}
		  {section name=markerstyledata loop=$gContent->mMapMarkerStyles}
			  .tip-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}{rdelim}
			  .win-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].window_styles}{rdelim}
		  {/section}
	  {/if}
   </style>
 {/if}
{/if}
