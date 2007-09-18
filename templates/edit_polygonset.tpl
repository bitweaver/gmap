{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polygonset-options-form"}
	<input name="set_id" type="hidden" value="{$polygonsetInfo.set_id}">
	<input name="gmap_id" type="hidden" value="{$polygonsetInfo.gmap_id}">
	<input name="save_polygonset" type="hidden" value="true">
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input size="40" name="title" type="text" value="{$polygonsetInfo.title}"><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Description" for="description"}
			{forminput}
				<input size="40" id="editliberty" name="edit" type="text" value="{$polygonsetInfo.data}">
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Line Style" for="polylinestyle_id"}
			{forminput}
				<select name="polylinestyle_id" id="polylinestyle_id">
					<option value="0" >Google (standard)</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Fill Style" for="style_id"}
			{forminput}
				<select name="style_id" id="style_id">
					<option value="0" >Google (standard)</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	
	{if $gContent->hasAdminPermission()}
	<div class="row">
		{formlabel label="Allow Registered Users to Add Polygons To This Set" for="allow_children"}
			{forminput}
				<input type="checkbox" name="allow_children" value="y" {if $childrenAllowed}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to add polygons to this set."}
			{/forminput}
	</div>
	
	<div class="row">
		{formlabel label="Allow Registered Users To Edit" for="share_edit"}
			{forminput}
				<input type="checkbox" name="share_edit" value="y" {if $editShared}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to edit the parameters of this set - this does not effect if they can add polygons to this set."}
			{/forminput}
	</div>
	{/if}
	
	<div class="row submit">
		<input type="button" name="savenewpolygonset" value="Save" onclick="javascript:BitMap.EditSession.storePolygonSet( this.form );"/>
		<input type="button" name="closepolygonsetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditPolygonSet()"/>
	</div>
{/form}
{/strip}