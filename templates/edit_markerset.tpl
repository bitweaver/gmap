{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-markerset-options-form"}
	<input name="set_id" type="hidden" value="{$markersetInfo.set_id}" />
	<input name="gmap_id" type="hidden" value="{$markersetInfo.gmap_id}" />
	<input name="save_markerset" type="hidden" value="true" />
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input size="40" name="title" type="text" value="{$markersetInfo.title}" />
				{formhelp note=""}
			{/forminput}
	</div>
	
	<div class="row">
		{formlabel label="Description" for="description"}
			{forminput}
				<input size="40" id="editliberty" name="edit" type="text" value="{$markersetInfo.data}" />
				{formhelp note=""}
			{/forminput}
	</div>
{*	  if ( this.Map.markerstyles.length > 0 && form.style_id.options.length < (this.Map.markerstyles.length + 1) ){
form.style_id.options[OptionN + d] = new Option( this.Map.markerstyles[d].name, this.Map.markerstyles[d].style_id );
	*}
	<div class="row">
		{formlabel label="Marker Style" for="style_id"}
			{forminput}
				<select name="style_id">
				<option value="0" {if $markersetInfo.style_id == 0 }selected="selected"{/if}>Google (standard)</option>
				{if count($markerStyles) > 0}{section name=ix loop=$markerStyles}
					<option value="{$markerStyles[ix].style_id}" {if $markersetInfo.style_id == $markerStyles[ix].style_id}selected="selected"{else}{/if}>{$markerStyles[ix].name}</option>
				{/section}{/if}
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Icon Style" for="icon_id"}
			{forminput}
				<a href="javascript:void(0);" onclick="BitMap.EditSession.getIconStyles();" title="{tr}Click to select another icon{/tr}"><img id="icon_img" src="{if $icon.image}{$icon.image}{else}http://www.google.com/mapfiles/marker.png{/if}" /></a>
				<div id="icon_styles" style="position:absolute; padding:10px; width:212px; overflow:auto; display:none; background:white; border:2px solid #666"></div>
				<input name="icon_id" id="icon_id" type="hidden" value="{$iconStyles[ix].icon_id}" />
				<!--
				<select name="icon_id">
				<option value="0" {if $markersetInfo.icon_id == 0 }selected="selected"{/if}>Google (standard)</option>
				{if count($iconStyles) > 0}{section name=ix loop=$iconStyles}
					<option value="{$iconStyles[ix].icon_id}" {if $markersetInfo.icon_id == $iconStyles[ix].icon_id}selected="selected"{else}{/if}>{$iconStyles[ix].name}</option>
				{/section}{/if}
				</select>
				-->
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Plot-On-Load" for="plot_on_load"}
			{forminput}
				<select name="plot_on_load">
				<option value="false" {if $markersetInfo.plot_on_load == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.plot_on_load == "true" }selected="selected"{/if}>Yes</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="List Set In Side Panel" for="side_panel"}
			{forminput}
				<select name="side_panel">
				<option value="false" {if $markersetInfo.side_panel == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.side_panel == "true" }selected="selected"{/if}>Yes</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="List Markers In Side Panel" for="explode"}
			{forminput}
				<select name="explode">
				<option value="false" {if $markersetInfo.explode == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.explode == "true" }selected="selected"{/if}>Yes</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>

	{if !$gContent->isValid() || $gContent->hasAdminPermission()}
	<div class="row">
		{formlabel label="Allow Registered Users to Add Markers To This Set" for="allow_children"}
			{forminput}
				<input type="checkbox" name="allow_children" value="y" {if $childrenAllowed}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to add markers to this set."}
			{/forminput}
	</div>
	
	<div class="row">
		{formlabel label="Allow Registered Users To Edit" for="share_edit"}
			{forminput}
				<input type="checkbox" name="share_edit" value="y" {if $editShared}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to edit the parameters of this set - this does not effect if they can add markers to this set."}
			{/forminput}
	</div>
	{/if}
	
	<div class="row submit">
		<input type="button" name="savenewmarkerset" value="Save" onclick="javascript:BitMap.EditSession.storeMarkerSet( this.form );"/>
		<input type="button" name="closemarkersetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditMarkerSet()"/>
	</div>		
{/form}
{/strip}
