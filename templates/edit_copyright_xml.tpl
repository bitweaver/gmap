<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
{if $copyrightInfo}
	<copyright>
		<copyright_id>{$copyrightInfo.copyright_id}</copyright_id>
		<copyright_minzoom>{$copyrightInfo.copyright_minzoom}</copyright_minzoom>
		<bounds>{$copyrightInfo.bounds}</bounds>
		<notice>{$copyrightInfo.notice}</notice>
	</copyright>
{else}
	{include file="bitpackage:gmap/edit_status_xml_inc.tpl"}
{/if}