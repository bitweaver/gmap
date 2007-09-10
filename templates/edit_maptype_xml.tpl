<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
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
{else}
	<status>success</status>
{/if}
