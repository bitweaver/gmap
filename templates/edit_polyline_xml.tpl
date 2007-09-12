<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $polylineInfo}
	<polyline>
		<polyline_id>{$polylineInfo.polyline_id}</polyline_id>
		<name>{$polylineInfo.name}</name>
		<points_data>{$polylineInfo.points_data}</points_data>
		<border_text>{$polylineInfo.border_text}</border_text>
		<zindex>{$polylineInfo.zindex}</zindex>
	</polyline>
{else}
	<status>success</status>
{/if}