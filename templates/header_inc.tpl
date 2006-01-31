{if $smarty.const.ACTIVE_PACKAGE eq 'gmap'}
<style type="text/css">
	v\:* {ldelim}
	  behavior:url(#default#VML);
  {rdelim}
</style>
<script src="MochiKit/Base.js" type="text/javascript"></script>
<script src="MochiKit/Iter.js" type="text/javascript"></script>
<script src="MochiKit/Async.js" type="text/javascript"></script>
<script src="MochiKit/DOM.js" type="text/javascript"></script>
 
<script src="http://maps.google.com/maps?file=api&v=1&key={$gBitSystem->getPreference('gmaps_api_key')}" type="text/javascript"></script>
{include file="bitpackage:gmap/js_makemarkers.tpl"}
{include file="bitpackage:gmap/js_makepolylines.tpl"}
{include file="bitpackage:gmap/js_makegmap.tpl"}
{include file="bitpackage:gmap/js_gmap_methods.tpl"}

<script src="extensions/pdmarker.js" type="text/javascript"></script>
<script src="extensions/gxmarker.1.js" type="text/javascript"></script>
<script src="extensions/xmaps.1c.js" type="text/javascript"></script>

<script src="templates/formsubmit.js" type="text/javascript"></script>

<style type="text/css">
	textarea	{ldelim}font-size:.9em;{rdelim}
	.cell		{ldelim}float:left; background:#ccc; width:100px; padding-left:3px; padding-right:3px;{rdelim}
	.data		{ldelim}clear:both;{rdelim}
	.editform	{ldelim}background-color:#fff;{rdelim}
	.table		{ldelim}clear:both;{rdelim}
</style>


<style>
{if count($gContent->mMapMarkerStyles) > 0}
	{section name=markerstyledata loop=$gContent->mMapMarkerStyles}
		.tip-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}{rdelim}
		.win-{$gContent->mMapMarkerStyles[markerstyledata].name} {ldelim}{$gContent->mMapMarkerStyles[markerstyledata].window_styles}{rdelim}
	{/section}
{/if}
</style>

{/if}
