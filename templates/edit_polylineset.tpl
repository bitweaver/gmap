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
	
	<div class="row">
		{formlabel label="Share Editing of This Set With Registered Users" for="share_edit"}
			{forminput}
				<input type="checkbox" name="share_edit" value="y" {if $editShared}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to edit the parameters of this set - this does not effect if they can add polylines to this set."}
			{/forminput}
	</div>
	
	<div class="row submit">
		<input type="button" name="savenewpolylineset" value="Save" onclick="javascript:BitMap.EditSession.storePolylineSet( this.form );"/>
		<input type="button" name="closepolylinesetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditPolylineSet()"/>
	</div>
{/form}
{/strip}