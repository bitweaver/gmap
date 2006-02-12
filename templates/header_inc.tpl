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


{* these styles need to be moved into a style sheet and out of here! They are only here for testing *}
<style type="text/css">
	textarea	{ldelim}font-size:.9em;{rdelim}
	.cell		{ldelim}float:left; background:#ccc; width:100px; padding-left:3px; padding-right:3px;{rdelim}
	.data 	{ldelim}clear:both;{rdelim}
	table.data 	{ldelim}clear:both;{rdelim}
	.editform	{ldelim}background-color:#fff;{rdelim}
	.table	{ldelim}clear:both;{rdelim}
	.gmapeditstrong {ldelim}background-color:#ddd;{rdelim}
	td {ldelim}vertical-align:top;{rdelim}
	th {ldelim}text-align:left;{rdelim}
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
