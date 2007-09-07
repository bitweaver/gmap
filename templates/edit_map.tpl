<!--map editing form -->
<div id="edit-map-table">
	{form action="javascript:;" enctype="multipart/form-data" id="edit-map-form"}
	{jstabs}
		{jstab title="Map Properties"}
			<input name="save_map" type="hidden" size="25" value="true" />
			<input name="gmap_id" type="hidden" size="25" value="{$mapInfo.gmap_id}" />
			<div class="row">
				{formlabel label="Title" for="title"}
					{forminput}
						<input name="title" type="text" size="40" value="{$mapInfo.title}" />
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Description" for="map_desc"}
					{forminput}
						<input name="map_desc" type="text" size="40" value="{$mapInfo.description}" />
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Center Latitude" for="geo[lat]"}
					{forminput}
						<input name="geo[lat]" type="text" size="40" value="{if $mapInfo.lat}{$mapInfo.lat}{elseif $gBitSystem->getConfig('gmap_lat')}{$gBitSystem->getConfig('gmap_lat')}{else}0{/if}" />
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Center Longitude" for="geo[lng]"}
					{forminput}
						<input name="geo[lng]" type="text" size="40" value="{if $mapInfo.lng}{$mapInfo.lng}{elseif $gBitSystem->getConfig('gmap_lng')}{$gBitSystem->getConfig('gmap_lng')}{else}0{/if}" />
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
					{forminput}
						<a name="map_assist_btn" title="click a center!" href="javascript:BitMap.EditSession.addAssistant('map');">( Use Locating Assistant )</a>
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Width" for="map_w"}
					{forminput}
						<input name="map_w" type="text" size="12" value="{if $mapInfo.width}{$mapInfo.width}{elseif $gBitSystem->getConfig('gmap_width')}{$gBitSystem->getConfig('gmap_width')}{else}0{/if}" />
						{formhelp note="(use '0' for auto)"}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Height" for="map_h"}
					{forminput}
						<input name="map_h" type="text" size="12" value="{if $geo_edit_serv}400{elseif $mapInfo.height}{$mapInfo.height}{elseif $gBitSystem->getConfig('gmap_height')}{$gBitSystem->getConfig('gmap_height')}{else}0{/if}" />
						{formhelp note="(use '0' for auto)"}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Zoom Level" for="map_z"}
					{forminput}
						<input name="map_z" type="text" size="12" value="{if $mapInfo.zoom}{$mapInfo.zoom}{elseif $gBitSystem->getConfig('gmap_zoom')}{$gBitSystem->getConfig('gmap_zoom')}{else}2{/if}" />
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Show Controls" for="map_showcont"}
					{forminput}
						<select name="map_showcont">
							<option value="s" {if $mapInfo.zoom_control eq 's'}selected="selected"{/if}>Small</option>
							<option value="l" {if $mapInfo.zoom_control eq 'l'}selected="selected"{/if}>Large</option>
							<option value="z" {if $mapInfo.zoom_control eq 'z'}selected="selected"{/if}>Zoom Only</option>
							<option value="n" {if $mapInfo.zoom_control eq 'n'}selected="selected"{/if}>None</option>
							</select>
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Show Scale" for="map_showscale"}
					{forminput}
						<select name="map_showscale">
							<option value="false" {if $mapInfo.scale == "false" }selected="selected"{/if}>No</option>
							<option value="true" {if $mapInfo.scale == "true" }selected="selected"{/if}>Yes</option>
						</select>
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Show Map Type Buttons" for="map_showtypecont"}
					{forminput}
						<select name="map_showtypecont">
							<option value="false" {if $mapInfo.maptype_control == "false" }selected="selected"{/if}>No</option>
							<option value="true" {if $mapInfo.maptype_control == "true" }selected="selected"{/if}>Yes</option>
						</select>
						{formhelp note=""}
					{/forminput}
			</div>
			<div class="row">
				{formlabel label="Default Map Type" for="maptype"}
					{forminput}
						<select name="maptype">
							<option value="0" {if $mapInfo.maptype == 0 }selected="selected"{/if}>Street Map</option>
							<option value="-1" {if $mapInfo.maptype == -1 }selected="selected"{/if}>Satellite</option>
							<option value="-2" {if $mapInfo.maptype == -2 }selected="selected"{/if}>Hybrid</option>
							{if $mapTypes}
							{section name=mt loop=$mapTypes}
							<option value="{$mapTypes[mt].maptype_id}" {if $mapInfo.maptype == $mapTypes[mt].maptype_id }selected="selected"{/if}>{$mapTypes[mt].name}</option>
							{/section}
							{/if}					
						</select>
						{formhelp note=""}
					{/forminput}
			</div>
			{* @TODO add option for overview - make sure supported in schema *}
			{*
			<div class="row">
				{formlabel label="Stuff" for="stuff"}
					{forminput}
						{if $mapInfo.overview_control}{$mapInfo.overview_control}{elseif $gBitSystem->getConfig('gmap_overview_control')}{$gBitSystem->getConfig('gmap_overview_control')}{else}true{/if}
						{formhelp note=""}
					{/forminput}
			</div>
			 *}
			<div class="row">
				{formlabel label="Allow Comments" for="allow_comments"}
					{forminput}
						<input type="checkbox" name="allow_comments" value="y" {if $gContent->getPreference('allow_comments') eq 'y'}checked="checked"{/if} />
						{formhelp note=""}
					{/forminput}
			</div>
			{textarea}{$mapInfo.raw}{/textarea}
			
			{include file="bitpackage:liberty/edit_services_inc.tpl serviceFile=content_edit_mini_tpl}
			
			<div class="row submit">
				<input type="button" name="save_map_btn" value="Submit" onclick="javascript:BitMap.EditSession.storeMap( this.form );" /> 
				<input type="button" name="closemapform" value="Cancel" onclick="javascript:BitMap.EditSession.canceledit( this.form );" />
			</div>
		{/jstab}
		
 		{include file="bitpackage:liberty/edit_services_inc.tpl serviceFile=content_edit_tab_tpl}
		
		{if $gBitUser->hasPermission('p_liberty_attach_attachments') }
		{jstab title="Attachments"}
			{legend legend="Attachments"}
				{include file="bitpackage:liberty/edit_storage.tpl"}
			{/legend}
		{/jstab}
		{/if}
 		
	{/jstabs}
	{/form}
</div><!--end map editing form -->