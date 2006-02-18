{if $smarty.const.ACTIVE_PACKAGE eq 'gmap'}
<style type="text/css">
	v\:* {ldelim}
	  behavior:url(#default#VML);
  {rdelim}
</style>
 
<script src="http://maps.google.com/maps?file=api&v=1&key={$gBitSystem->getPreference('gmaps_api_key')}" type="text/javascript"></script>
{include file="bitpackage:gmap/js_makemarkers.tpl"}
{include file="bitpackage:gmap/js_makepolylines.tpl"}
{include file="bitpackage:gmap/js_makepolygons.tpl"}
{include file="bitpackage:gmap/js_makegmap.tpl"}

{include file="bitpackage:gmap/js_gmap_methods.tpl"}

<script src="libraries/pdmarker.js" type="text/javascript"></script>
<script src="libraries/gxmarker.1.js" type="text/javascript"></script>
<script src="libraries/xmaps.1c.js" type="text/javascript"></script>

{* if we are editing a map we load the supporting methods *}
{if $loadEditMethods}
<script src="MochiKit/Base.js" type="text/javascript"></script>
<script src="MochiKit/Iter.js" type="text/javascript"></script>
<script src="MochiKit/Async.js" type="text/javascript"></script>
<script src="MochiKit/DOM.js" type="text/javascript"></script>
{/if}
{if $loadEditMethods}
<script src="templates/js_edit_methods.js" type="text/javascript"></script>
{/if}


{literal}
<style type="text/css">
	td {vertical-align:top;}
	th {text-align:left;}
	.map-op {margin-right:160px;}
	.gmapeditstrong {background-color:#ddd;}
	.hide {float:right; width:160px; display:none;}
	.mapsidepanel {float:right; overflow:auto; width:160px; display:block; border:1px #ddd solid;}
	.gmapsideicon {float:left; margin-right:3px;}
	.gmapsidedesc {margin:6px 0px;}
	.gmapsidelist {padding:0px 2px 0px 6px; line-height:1.5em; clear:both;}
</style>
{/literal}


<style type="text/css">
{if count($gContent->mMapMarkerStyles) > 0}
	{section name=markerstyledata loop=$gContent->mMapMarkerStyles}
		.tip-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}{rdelim}
		.win-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].window_styles}{rdelim}
	{/section}
{/if}
</style>


{/if}
