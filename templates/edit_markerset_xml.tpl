<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $markersetInfo}
<markerset>
	<set_id>{$markersetInfo.set_id}</set_id>
	<name>{$markersetInfo.name}</name>
	<description>{$markersetInfo.description}</description>
	<style_id>{$markersetInfo.style_id}</style_id>
	<icon_id>{$markersetInfo.icon_id}</icon_id>
	<plot_on_load>{$markersetInfo.plot_on_load}</plot_on_load>
	<side_panel>{$markersetInfo.side_panel}</side_panel>
	<explode>{$markersetInfo.explode}</explode>
	<cluster>{$markersetInfo.cluster}</cluster>
</markerset>
{/if}