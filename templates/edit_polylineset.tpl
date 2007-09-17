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
					<option value="0" >Google (standard)</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row submit">
		<input type="button" name="savenewpolylineset" value="Save" onclick="javascript:BitMap.EditSession.storePolylineSet( this.form );"/>
		<input type="button" name="closepolylinesetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditPolylineSet()"/>
	</div>
{/form}
{/strip}