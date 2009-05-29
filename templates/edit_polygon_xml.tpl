<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $polygonInfo}
	<polygon>
		<polygon_id>{$polygonInfo.polygon_id}</polygon_id>
		<title><![CDATA[{$polygonInfo.title}]]></title>
		<type>{$polygonInfo.type}</type>
		<points_data>{$polygonInfo.poly_data}</points_data>
		<circle_center>{$polygonInfo.circle_center}</circle_center>
		<radius>{$polygonInfo.radius}</radius>
		<levels_data>{$polygonInfo.levels_data}</levels_data>
		<zoom_factor>{$polygonInfo.zoom_factor}</zoom_factor>
		<num_levels>{$polygonInfo.num_levels}</num_levels>
	</polygon>
{/if}
</response>
