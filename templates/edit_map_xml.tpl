<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<response>
{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{if $mapInfo}
<map>
	<gmap_id>{$mapInfo.gmap_id}</gmap_id>
	<title><![CDATA[{$gContent->getTitle()}]]></title>
	<description><![CDATA[{$mapInfo.summary}]]></description>
	<data><![CDATA[{$mapInfo.xml_data}]]></data>
	<parsed_data><![CDATA[{$mapInfo.xml_parsed_data}]]></parsed_data>	
	<width>{$mapInfo.width}</width>
	<height>{$mapInfo.height}</height>
	<lat>{$mapInfo.lat}</lat>
	<lng>{$mapInfo.lng}</lng>
	<zoom>{$mapInfo.zoom}</zoom>
	<maptype>{$mapInfo.maptype}</maptype>
	<zoom_control>{$mapInfo.zoom_control}</zoom_control>
	<maptype_control>{$mapInfo.maptype_control}</maptype_control>
	<overview_control>{$mapInfo.overview_control}</overview_control>
	<scale>{$mapInfo.scale}</scale>
	<allow_comments>{if $gContent->getPreference('allow_comments') == 'y'}y{else}n{/if}</allow_comments>
</map>
{/if}
</response>
