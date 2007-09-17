<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $polylineInfo}
	<polyline>
		<polyline_id>{$polylineInfo.polyline_id}</polyline_id>
		<name>{$polylineInfo.title}</name>
		<type>{$polylineInfo.type}</type>
		<points_data>{$polylineInfo.data}</points_data>
		<levels_data>{$polylineInfo.levels_data}</levels_data>
		<zoom_factor>{$polylineInfo.zoom_factor}</zoom_factor>
		<num_levels>{$polylineInfo.num_levels}</num_levels>
	</polyline>
{else}
	<status>success</status>
{/if}
