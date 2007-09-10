<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $markersetInfo}
<markerset>
	<set_id>{$markerset.Infoset_id}</set_id>
	<name>{$markerset.Infoname}</name>
	<description>{$markerset.Infodescription}</description>
	<style_id>{$markerset.Infostyle_id}</style_id>
	<icon_id>{$markerset.Infoicon_id}</icon_id>
	<plot_on_load>{$markerset.Infoplot_on_load}</plot_on_load>
	<side_panel>{$markerset.Infoside_panel}</side_panel>
	<explode>{$markerset.Infoexplode}</explode>
	<cluster>{$markerset.Infocluster}</cluster>
</markerset>
{/if}