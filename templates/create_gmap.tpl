{strip}

<div class="floaticon">
	<a href="{$smarty.const.FISHEYE_PKG_URL}edit_image.php">{biticon ipackage="liberty" iname="upload" iexplain="upload new image"}</a>
</div>

<div class="admin gmap">
	<div class="header">
		<h1>{if $gContent->mInfo.image_id}{tr}Edit Gmap{/tr}: {$gContent->mInfo.title} {else}{tr}Create Gmap{/tr} {/if}</h1>
	</div>

	<div class="body">
			{jstabs}
				{jstab title="Map Tools"}
					{legend legend="Map Tools"}
					{form enctype="multipart/form-data"}
						<input name="map_id" id="map_id" type="hidden" size="25" value="{$gContent->mInfo.gmap_id}" />

						{formfeedback error=$errors}

						<input type="hidden" name="gallery_id" value="{$galleryId|escape}"/>
						<input type="hidden" name="image_id" value="{$imageId}"/>
						<input type="hidden" name="MAX_FILE_SIZE" value="1000000000" />

						<div class="row">
							{formlabel label="Title" for="image-title"}
							{forminput}
								<input type="text" name="title" id="map-title" value="{$gContent->mInfo.title|escape}" maxlength="160" size="50"/>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Description" for="image-title"}
							{forminput}
								<input type="text" name="description" id="map-desc" value="{$gContent->mInfo.description|escape:html}" maxlength="200" size="80"/>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Details" for="map-details"}
							{forminput}
								<textarea name="edit" id="map-details" rows="4" cols="50">{$gContent->mInfo.data|escape:html}</textarea>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Width" for="width"}
							{forminput}
								<input type="text" name="map_w" id="map_w" value="{$gContent->mInfo.width|escape}" size="25"/>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Height" for="height"}
							{forminput}
								<input type="text" name="map_h" id="map_h" value="{$gContent->mInfo.height|escape}" size="25"/>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Latitude" for="latitude"}
							{forminput}
								<input type="text" name="map_lat" id="map_lat" value="{$gContent->mInfo.lat|escape}" size="25"/>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Longitude" for="longitude"}
							{forminput}
								<input type="text" name="map_lon" id="map_lon" value="{$gContent->mInfo.lon|escape}" size="25"/>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Zoom Level" for="zoomlevel"}
							{forminput}
								<input type="text" name="map_z" id="map_z" value="{$gContent->mInfo.zoom_level|escape}" size="25"/>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Show Controls" for="showcontrols"}
							{forminput}
								<SELECT name="map_showcont" id="map_showcont">
								<OPTION value="s" {if $gContent->mInfo.show_controls == "s"}SELECTED{/if}>Small</OPTION>
								<OPTION value="l" {if $gContent->mInfo.show_controls == "l"}SELECTED{/if}>Large</OPTION>
								<OPTION value="z" {if $gContent->mInfo.show_controls == "z"}SELECTED{/if}>Zoom Only</OPTION>
								<OPTION value="n" {if $gContent->mInfo.show_controls == "n"}SELECTED{/if}>None</OPTION>
								</SELECT>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Show Scale" for="showscale"}
							{forminput}
								<SELECT name="map_showscale" id="map_showscale">
								<OPTION value="1" {if $gContent->mInfo.show_scale == 1}SELECTED{/if}>Yes</OPTION>
								<OPTION value="0" {if $gContent->mInfo.show_scale == 0}SELECTED{/if}>No</OPTION>
								</SELECT>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Show Map Type Buttons" for="showbuttons"}
							{forminput}
								<SELECT name="map_showtypecont" id="map_showtypecont">
								<OPTION value="1" {if $gContent->mInfo.show_typecontrols == 1}SELECTED{/if}>Yes</OPTION>
								<OPTION value="0" {if $gContent->mInfo.show_typecontrols == 0}SELECTED{/if}>No</OPTION>
								</SELECT>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Default Map Type" for="defaultmaptype"}
							{forminput}
								<SELECT name="map_type" id="map_type">
									<OPTION value="G_MAP_TYPE" {if $gContent->mInfo.map_type == "G_MAP_TYPE"}SELECTED{/if}>Street Map</OPTION>
									<OPTION value="G_SATELLITE_TYPE" {if $gContent->mInfo.map_type == "G_SATELLITE_TYPE"}SELECTED{/if}>Satellite</OPTION>
									<OPTION value="G_HYBRID_TYPE" {if $gContent->mInfo.map_type == "G_HYBRID_TYPE"}SELECTED{/if}>Hybrid</OPTION>
									{if count($gContent->mMapTypes) > 0}
										{section name=addonmt loop=$gContent->mMapTypes}
											{$typeid = $gContent->mMapTypes[addonmt].maptype_id}
										<OPTION value="{$gContent->mMapTypes[addonmt].name}" {if $gContent->mInfo.map_type == $gContent->mMapTypes[addonmt].name}SELECTED{/if}>{$gContent->mMapTypes[addonmt].name}</OPTION>
										{/section}
									{/if}
								</SELECT>
							{/forminput}
						</div>

						<div class="row">
							{formlabel label="Allow Comments" for="allowcomments"}
							{forminput}
								<input name="map_comm" id="map_comm" type="checkbox" value="True"><br/>
							{/forminput}
						</div>

						<div class="row submit">
							<input type="submit" name="save_map" value="Save Map"/>
						</div>
					{/form}
    				{/legend}
				{/jstab}

				{include file="bitpackage:liberty/edit_services_inc.tpl serviceFile=content_edit_tab_tpl}
			{/jstabs}

	</div> <!-- class="body" -->
</div> <!-- class="admin fisheye" -->

{/strip}
