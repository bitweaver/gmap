{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polylineset-options-form"}
	<input name="set_id" type="hidden" value="{$polylinesetInfo.set_id}">
	<input name="gmap_id" type="hidden" value="{$polylinesetInfo.gmap_id}">
	<input name="save_polylineset" type="hidden" value="true">
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input size="40" name="title" type="text" value="{$polylinesetInfo.title}"><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Description" for="description"}
			{forminput}
				<input size="40" id="editliberty" name="edit" type="text" value="{$polylinesetInfo.data}">
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Style" for="style_id"}
			{forminput}
				<select name="style_id" id="style_id">
					<option value="0" {if $polylinesetInfo.style_id == 0 }selected="selected"{/if}>Google (standard)</option>
					{if count($polylineStyles) > 0}{section name=ix loop=$polylineStyles}
						<option value="{$polylineStyles[ix].style_id}" {if $polylinesetInfo.style_id == $polylineStyles[ix].style_id}selected="selected"{else}{/if}>{$polylineStyles[ix].name}</option>
					{/section}{/if}
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	
	{if $gContent->hasAdminPermission()}
	<div class="row">
		{formlabel label="Allow Registered Users to Add Polylines To This Set" for="allow_children"}
			{forminput}
				<input type="checkbox" name="allow_children" value="y" {if $childrenAllowed}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to add polylines to this set."}
			{/forminput}
	</div>
	
	<div class="row">
		{formlabel label="Allow Registered Users To Edit" for="share_edit"}
			{forminput}
				<input type="checkbox" name="share_edit" value="y" {if $editShared}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to edit the parameters of this set - this does not effect if they can add polylines to this set."}
			{/forminput}
	</div>
	{/if}

	<div class="row submit">
		<input type="button" name="savenewpolylineset" value="Save" onclick="javascript:BitMap.EditSession.storePolylineSet( this.form );"/>
		<input type="button" name="closepolylinesetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditPolylineSet()"/>
	</div>
{/form}
{/strip}