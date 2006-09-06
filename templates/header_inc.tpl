{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') }
 {if $geo_edit_serv  }
		{include file="bitpackage:gmap/header_base.tpl"}
 {/if}
 {if $smarty.const.ACTIVE_PACKAGE == 'gmap'}
	{if $view_map }
		{include file="bitpackage:gmap/header_base.tpl"}
	{/if}

	{if $map_list }
		{include file="bitpackage:gmap/header_base.tpl"}
	{/if}

	{if $edit_map }
		{include file="bitpackage:gmap/header_base.tpl"}
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Base.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Iter.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Async.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}MochiKit/DOM.js" type="text/javascript"></script>
		<script src="{$smarty.const.GMAP_PKG_URL}templates/Edit.js" type="text/javascript"></script>

	  <style type="text/css">
     {literal}
		  td {vertical-align:top; padding:0px;}
		  th {text-align:left;}
		  .map-op {margin-right:160px;}
		  .gmapeditstrong {background-color:#ddd;}
		  .hide {float:right; width:160px; display:none;}
		  .mapsidepanel {float:right; overflow:auto; width:190px; display:block; border:1px #ddd solid;}
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
	  </style>
	{/if}

	<style type="text/css">
	  {if count($gContent->mMapMarkerStyles) > 0}
		  {section name=markerstyledata loop=$gContent->mMapMarkerStyles}
			  .tip-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}{rdelim}
			  .win-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].window_styles}{rdelim}
		  {/section}
	  {/if}
	</style>
 {/if}
{/if}
