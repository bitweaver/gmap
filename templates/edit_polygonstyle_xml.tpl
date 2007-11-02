<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $polygonstyleInfo}
<polygonstyle>
	<style_id>{$polygonstyleInfo.style_id}</style_id>
	<name>{$polygonstyleInfo.name}</name>
	<color>{$polygonstyleInfo.color}</color>
	<opacity>{$polygonstyleInfo.opacity}</opacity>
</polygonstyle>
{else}
	{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{/if}