<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $maptypeInfo}
<maptype>
	<maptype_id>{$maptypeInfo.maptype_id}</maptype_id>
	<name>{$maptypeInfo.name}</name>
	<shortname>{$maptypeInfo.shortname}</shortname>
	<description>{$maptypeInfo.description}</description>
	<minzoom>{$maptypeInfo.minzoom}</minzoom>
	<maxzoom>{$maptypeInfo.maxzoom}</maxzoom>
	<errormsg>{$maptypeInfo.errormsg}</errormsg>
</maptype>
{/if}
</response>
