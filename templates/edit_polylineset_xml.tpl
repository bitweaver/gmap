<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $polylinesetInfo}
	<polylineset>
		<set_id>{$polylinesetInfo.set_id}</set_id>
		<title><![CDATA[{$polylinesetInfo.title}]]></title>
		<description><![CDATA[{$polylinesetInfo.data}]]></description>
		<style_id>{$polylinesetInfo.style_id}</style_id>
	</polylineset>
{/if}
</response>
