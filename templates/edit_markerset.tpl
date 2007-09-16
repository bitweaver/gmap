{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-markerset-options-form"}
	<input name="set_id" type="hidden" value="{$markersetInfo.set_id}">
	<input name="save_markerset" type="hidden" value="true">
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input size="40" name="name" type="text" value="{$markersetInfo.name}"><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Description" for="description"}
			{forminput}
				<input size="40" name="description" type="text" value="{$markersetInfo.description}">
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
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Icon Style" for="icon_id"}
			{forminput}
				<select name="icon_id">
				<option value="0" {if $markersetInfo.icon_id == 0 }selected="selected"{/if}>Google (standard)</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Cluster" for="cluster"}
			{forminput}
				<select name="cluster">
				<option value="false" {if $markersetInfo.cluster == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.cluster == "true" }selected="selected"{/if}>Yes</option>
				</select>
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
	<div class="row submit">
		<input type="button" name="savenewmarkerset" value="Save" onclick="javascript:BitMap.EditSession.storeMarkerSet( this.form );"/>
		<input type="button" name="closemarkersetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditMarkerSet()"/>
	</div>		
{/form}
{/strip}