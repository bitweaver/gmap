<!--map editing form -->
{assign var="formid" value="edit-map-form"}
{form action="javascript:;" enctype="multipart/form-data" id=$formid}
{jstabs}
	{jstab title="Map Properties"}
		<input name="save_map" type="hidden" value="true" />
		<input name="content_id" type="hidden" value="{$mapInfo.content_id}" />
		<input name="gmap_id" type="hidden" value="{$mapInfo.gmap_id}" />
		<div class="form-group">
			{formlabel label="Title" for="title"}
			{forminput}
				<input name="title" type="text" size="40" value="{$mapInfo.title}" />
				{formhelp note=""}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Summary" for="summary"}
			{forminput}
				<input size="40" type="text" name="summary" id="summary" value="{$mapInfo.summary|escape:html}" />
				{formhelp note="Brief description of the map. This is visible just below the title of the map."}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Center Latitude" for="geo-lat"}
			{forminput}
				<input name="geo[lat]" id="geo-lat" type="text" size="40" value="{if $mapInfo.lat}{$mapInfo.lat}{elseif $gBitSystem->getConfig('gmap_lat')}{$gBitSystem->getConfig('gmap_lat')}{else}0{/if}" />
				{formhelp note=""}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Center Longitude" for="geo-lng"}
			{forminput}
				<input name="geo[lng]" name="geo-lng" type="text" size="40" value="{if $mapInfo.lng}{$mapInfo.lng}{elseif $gBitSystem->getConfig('gmap_lng')}{$gBitSystem->getConfig('gmap_lng')}{else}0{/if}" />
				{formhelp note=""}
			{/forminput}
		</div>
		<div class="form-group">
			{forminput}
				<a name="map_assist_btn" title="click a center!" href="javascript:void(0)" onclick="BitMap.EditSession.addAssistant('map');">( Use Locating Assistant )</a>
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Width" for="map_w"}
			{forminput}
				<input name="map_w" type="text" size="12" value="{if $mapInfo.width}{$mapInfo.width}{elseif $gBitSystem->getConfig('gmap_width')}{$gBitSystem->getConfig('gmap_width')}{else}0{/if}" />
				{formhelp note="(use '0' for auto)"}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Height" for="map_h"}
			{forminput}
				<input name="map_h" type="text" size="12" value="{if $geo_edit_serv}400{elseif $mapInfo.height}{$mapInfo.height}{elseif $gBitSystem->getConfig('gmap_height')}{$gBitSystem->getConfig('gmap_height')}{else}0{/if}" />
				{formhelp note="(use '0' for auto)"}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Zoom Level" for="map_z"}
			{forminput}
				<input name="map_z" type="text" size="12" value="{if $mapInfo.zoom}{$mapInfo.zoom}{elseif $gBitSystem->getConfig('gmap_zoom')}{$gBitSystem->getConfig('gmap_zoom')}{else}2{/if}" />
				{formhelp note=""}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Show Controls" for="map_showcont"}
			{forminput}
				<select name="map_showcont">
					<option value="s" {if $mapInfo.zoom_control eq 's'}selected="selected"{/if}>Small</option>
					<option value="l" {if $mapInfo.zoom_control eq 'l' || !$gContent->isValid()}selected="selected"{/if}>Large</option>
					<option value="z" {if $mapInfo.zoom_control eq 'z'}selected="selected"{/if}>Zoom Only</option>
					<option value="n" {if $mapInfo.zoom_control eq 'n'}selected="selected"{/if}>None</option>
				</select>
				{formhelp note=""}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Show Map Type Buttons" for="map_showtypecont"}
			{forminput}
				<select name="map_showtypecont">
					<option value="false" {if $mapInfo.maptype_control == "false" }selected="selected"{/if}>No</option>
					<option value="true" {if $mapInfo.maptype_control == "true" || !$gContent->isValid()}selected="selected"{/if}>Yes</option>
				</select>
				{formhelp note=""}
			{/forminput}
		</div>
		<div class="form-group">
			{formlabel label="Show Scale" for="map_showscale"}
			{forminput}
				<select name="map_showscale">
					<option value="false" {if $mapInfo.scale == "false" }selected="selected"{/if}>No</option>
					<option value="true" {if $mapInfo.scale == "true" }selected="selected"{/if}>Yes</option>
				</select>
				{formhelp note=""}
			{/forminput}
		</div>
		<div class="form-group">
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
		<div class="form-group">
			{formlabel label="Stuff" for="stuff"}
			{forminput}
			{if $mapInfo.overview_control}{$mapInfo.overview_control}{elseif $gBitSystem->getConfig('gmap_overview_control')}{$gBitSystem->getConfig('gmap_overview_control')}{else}true{/if}
					{formhelp note=""}
				{/forminput}
			</div>
			*}

			{textarea edit=$mapInfo.raw}

			{if !$gContent->isValid() || $gContent->hasAdminPermission()}
				<div class="form-group">
					{forminput label="checkbox"}
						<input type="checkbox" name="allow_comments" value="y" {if $gContent->getPreference('allow_comments') eq 'y'}checked="checked"{/if} />Allow Comments
						{formhelp note=""}
					{/forminput}
				</div>

				<div class="form-group">
					{forminput label="checkbox"}
						<input type="checkbox" name="allow_children" value="y" {if $childrenAllowed}checked="checked"{/if} />Allow Registered Users to Attach Maptypes and Sets
						{formhelp note="Checking this box will allow any registered user to add maptypes and sets of markers, polylines, polygons to this map. This is good if you want this map to be editable like a wiki page."}
					{/forminput}
				</div>

				<div class="form-group">
					{forminput label="checkbox"}
						<input type="checkbox" name="share_update" value="y" {if $updateShared}checked="checked"{/if} />Allow Registered Users To Edit
						{formhelp note="Checking this box will allow any registered user to edit the parameters of this map, like its center point, title, body text, etc. This is good if you want this map to be editable like a wiki page. NOTE: This does NOT effect if users can add markers, polylines, polygons, or other data to this map."}
					{/forminput}
				</div>
			{/if}

			{include file="bitpackage:liberty/edit_services_inc.tpl" serviceFile="content_edit_mini_tpl"}

			<div class="form-group submit">
				<input type="button" name="save_map_btn" value="Save" onclick="BitMap.EditSession.storeMap( this.form );" />
			</div>

			{include file="bitpackage:liberty/edit_storage_list.tpl" primary_label="Marker Image"}
		{/jstab}

		{include file="bitpackage:liberty/edit_services_inc.tpl" serviceFile="content_edit_tab_tpl"}

		{if $gBitUser->hasPermission('p_liberty_attach_attachments') }
			{jstab title="Attachments"}
				{legend legend="Attachments"}
					{include file="bitpackage:liberty/edit_storage.tpl" formid=$formid}
				{/legend}
			{/jstab}
		{/if}

	{/jstabs}
{/form}
<!--end map editing form -->
