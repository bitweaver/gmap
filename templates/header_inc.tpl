{if $smarty.const.ACTIVE_PACKAGE eq 'gmap'}
<style type="text/css">
	v\:* {ldelim}behavior:url(#default#VML);{rdelim}
</style>
<script src="http://maps.google.com/maps?file=api&v=1&key={$gBitSystem->getPreference('gmaps_api_key')}" type="text/javascript"></script>
{include file="bitpackage:gmap/js_makemarkers.tpl"}
{include file="bitpackage:gmap/js_makepolylines.tpl"}
{include file="bitpackage:gmap/js_makegmap.tpl"}

{* @todo make include of formsubmit conditional *}
<script src="templates/formsubmit.js" type="text/javascript"></script>
<script src="http://www.wjamesphoto.com/bw/themes/js/prototype.js" type="text/javascript"></script>

<style type="text/css">
	textarea	{ldelim}font-size:.9em;{rdelim}
	.cell		{ldelim}float:left; background:#ccc; width:100px; padding-left:3px; padding-right:3px;{rdelim}
	.data		{ldelim}clear:both;{rdelim}
	.editform	{ldelim}width:860px; background-color:#fff;{rdelim}
</style>
{/if}
