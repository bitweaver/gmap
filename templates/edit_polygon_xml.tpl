<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $polygonInfo}
	<polygon>
		<polygon_id>{$polygonInfo.polygon_id}</polygon_id>
		<name>{$polygonInfo.title}</name>
		<type>{$polygonInfo.type}</type>
		<points_data>{$polygonInfo.data}</points_data>
		<circle_center>{$polygonInfo.circle_center}</circle_center>
		<radius>{$polygonInfo.radius}</radius>
		<levels_data>{$polygonInfo.levels_data}</levels_data>
		<zoom_factor>{$polygonInfo.zoom_factor}</zoom_factor>
		<num_levels>{$polygonInfo.num_levels}</num_levels>
	</polygon>
{else}
	{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{/if}