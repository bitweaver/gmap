{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && $gBitSystem->isFeatureActive('gmap_api_key') && $geo_edit_serv && $smarty.const.ACTIVE_PACKAGE != 'gmap'}
{strip}
	{include file='bitpackage:geo/edit_geo.tpl' serviceHash=$userInfo}
	<div class="control-group"> {formlabel label="Zoom Level" for="gmap_zoom"}
		{forminput}
			<input type="text" name="gmap_zoom" id="gmap_zoom" value="{if $gContent}{$gContent->getPreference('gmap_zoom','')}
																	{else if $serviceHash}{$serviceHash->getPreference('gmap_zoom','')}{/if}" />
			{formhelp note="Optional"}
		{/forminput}
	</div>
	<div class="control-group">
		{formlabel label="Click on the map to set the location fields above"}
		{forminput}
			{include file='bitpackage:gmap/map_inc.tpl'}
		{/forminput}
	</div>
{/strip}
{/if}
