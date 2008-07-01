<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key={$gBitSystem->getConfig('gmap_api_key')}" type="text/javascript"></script>
<script src="{$smarty.const.GMAP_PKG_URL}scripts/BitMap.js" type="text/javascript"></script>
{if $geo_edit_serv}
	<script type="text/javascript">{include file="bitpackage:gmap/MapData_js.tpl" mapInfo=$gContent->mInfo}</script>
{else}
	<script type="text/javascript">{include file="bitpackage:gmap/MapData_js.tpl"}</script>
{/if}
