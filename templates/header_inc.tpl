{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $geo_edit_serv ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}

{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $view_map ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}

{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $edit_map ) }
  {include file="bitpackage:gmap/header_base.tpl"}
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Base.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Iter.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Async.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/DOM.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}templates/Edit.js" type="text/javascript"></script>
{/if}

<style type="text/css">
{literal}
	td {vertical-align:top;}
	th {text-align:left;}
	.map-op {margin-right:160px;}
	.gmapeditstrong {background-color:#ddd;}
	.hide {float:right; width:160px; display:none;}
	.mapsidepanel {float:right; overflow:auto; width:190px; display:block; border:1px #ddd solid;}
	.gmapsideicon {float:left; margin-right:3px;}
	.gmapsidedesc {margin:6px 0px;}
	.gmapsidelist {padding:0px 2px 0px 6px; line-height:1.5em; clear:both;}
{/literal}
{if count($gContent->mMapMarkerStyles) > 0}
	{section name=markerstyledata loop=$gContent->mMapMarkerStyles}
		.tip-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}{rdelim}
		.win-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].window_styles}{rdelim}
	{/section}
{/if}
</style>
