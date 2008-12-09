<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $polylineInfo}
	<polyline>
		<polyline_id>{$polylineInfo.polyline_id}</polyline_id>
		<title>{$polylineInfo.title}</title>
		<type>{$polylineInfo.type}</type>
		<points_data>{$polylineInfo.poly_data}</points_data>
		<levels_data>{$polylineInfo.levels_data}</levels_data>
		<zoom_factor>{$polylineInfo.zoom_factor}</zoom_factor>
		<num_levels>{$polylineInfo.num_levels}</num_levels>
	</polyline>
{/if}
</response>
