<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $markerstyleInfo}
<markerstyle>
	<style_id>{$markerstyleInfo.style_id}</style_id>
	<name>{$markerstyleInfo.name}</name>
	<marker_style_type>{$markerstyleInfo.marker_style_type}</marker_style_type>
	<label_hover_opacity>{$markerstyleInfo.label_hover_opacity}</label_hover_opacity>
	<label_opacity>{$markerstyleInfo.label_opacity}</label_opacity>
	<label_hover_styles>{$markerstyleInfo.label_hover_styles}</label_hover_styles>
	<window_styles>{$markerstyleInfo.window_styles}</window_styles>
</markerstyle>
{/if}
</response>
