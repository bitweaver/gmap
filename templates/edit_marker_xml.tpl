<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $markerInfo}
	<marker>
		<marker_id>{$markerInfo.marker_id}</marker_id>
		<content_id>{$markerInfo.content_id}</content_id>
		<title>{$markerInfo.title}</title>
		<lat>{$markerInfo.lat}</lat>
		<lng>{$markerInfo.lng}</lng>
		<data>{$markerInfo.xml_data}</data>
		<parsed_data><![CDATA[{$markerInfo.xml_parsed_data}]]></parsed_data>
		<nav><![CDATA[{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='nav' serviceHash=$gContent->mInfo}]]></nav>
		<view><![CDATA[{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='view' serviceHash=$gContent->mInfo}]]></view>
		<label>{$markerInfo.label_data}</label>
		<parsed_label><![CDATA[{$markerInfo.parsed_label_data}]]></parsed_label>
		<z>{$markerInfo.zindex}</z>
		<allow_comments>{if $gContent->getPreference("allow_comments") == "y"}y{else}n{/if}</allow_comments>
	</marker>
{else}
	{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{/if}
