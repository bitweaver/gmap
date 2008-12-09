<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $polylinestyleInfo}
<polylinestyle>
	<style_id>{$polylinestyleInfo.style_id}</style_id>
	<name>{$polylinestyleInfo.name}</name>
	<color>{$polylinestyleInfo.color}</color>
	<weight>{$polylinestyleInfo.weight}</weight>
	<opacity>{$polylinestyleInfo.opacity}</opacity>
</polylinestyle>
{/if}
</response>
