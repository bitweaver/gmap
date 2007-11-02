<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $polylinesetInfo}
	<polylineset>
		<set_id>{$polylinesetInfo.set_id}</set_id>
		<name>{$polylinesetInfo.title}</name>
		<description>{$polylinesetInfo.data}</description>
		<style_id>{$polylinesetInfo.style_id}</style_id>
	</polylineset>
{else}
	{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{/if}