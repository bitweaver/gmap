<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $markerInfo}
	<marker>
		<id>{$markerInfo.marker_id}</id>
		<title>{$markerInfo.title}</title>
		<marker_type>{$markerInfo.marker_type}</marker_type>
		<lat>{$markerInfo.lat}</lat>
		<lng>{$markerInfo.lng}</lng>
		<data>{$markerInfo.xml_data}</data>
		<parsed_data><![CDATA[{$markerInfo.xml_parsed_data}]]></parsed_data>
		<nav><![CDATA[{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='nav' serviceHash=$gContent->mInfo}]]></nav>
		<view><![CDATA[{include file="bitpackage:liberty/services_inc.tpl" serviceLocation='view' serviceHash=$gContent->mInfo}]]></view>
		<label>{$markerInfo.label_data}</label>
		<photo_url>{$markerInfo.photo_url}</photo_url>
		<z>{$markerInfo.zindex}</z>
		<allow_comments>{if $gContent->getPreference("allow_comments") == "y"}y{else}n{/if}</allow_comments>
	</marker>
{else}
	<status>success</status>
{/if}