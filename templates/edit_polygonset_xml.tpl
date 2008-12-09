<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $polygonsetInfo}
	<polygonset>
		<set_id>{$polygonsetInfo.set_id}</set_id>
		<title>{$polygonsetInfo.title}</title>
		<description>{$polygonsetInfo.data}</description>
		<style_id>{$polygonsetInfo.style_id}</style_id>
		<polylinestyle_id>{$polygonsetInfo.polylinestyle_id}</polylinestyle_id>
	</polygonset>
{/if}
</response>
