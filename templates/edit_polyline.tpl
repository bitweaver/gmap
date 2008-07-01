{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polyline-form"}
	<input name="save_polyline" type="hidden" value="true" />
	<input name="content_id" type="hidden" value="{$polylineInfo.content_id}" />
	<input name="set_id" type="hidden" value="{$polylineInfo.set_id}" />
	<input name="polyline_id" type="hidden" value="{$polylineInfo.polyline_id}" />
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input name="title" type="text" style="width:90%" value="{$polylineInfo.title}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Polyline Type" for="type"}
			{forminput}
				<select name="type">
					<option value="0" {if $polylineInfo.type == 0 }selected="selected"{/if}>Google (standard)</option>
					<option value="1" {if $polylineInfo.type == 1 }selected="selected"{/if}>Geodesic</option>
					<option value="2" {if $polylineInfo.type == 2 }selected="selected"{/if}>Encoded</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Window Text" for="edit"}
			{forminput}
				<textarea name="edit" style="width:90%" rows="3">{$polylineInfo.data}</textarea>
				{formhelp note="This text will appear in an info ballon when someone clicks on the line."}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Data Points" for="poly_data"}
			{forminput}
				<textarea name="poly_data" style="width:90%" rows="3">{$polylineInfo.poly_data}</textarea>
				{formhelp note=""}
			{/forminput}
			<a name="polyline_assist_btn" title="draw the line!" href="javascript:void(0)" onclick="BitMap.EditSession.addAssistant('polyline', n);">Use Drawing Assistant</a>
	</div>
	<div class="row">
		{formlabel label="Levels Data" for="levels_data"}
			{forminput}
				<textarea name="levels_data" style="width:90%" rows="1">{$polylineInfo.levels_data}</textarea>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Zoom Factor" for="zoom_factor"}
			{forminput}
				<input name="zoom_factor" type="text" style="width:90%" value="{$polylineInfo.zoom_factor}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Number of Levels" for="num_levels"}
			{forminput}
				<input name="num_levels" type="text" style="width:90%" value="{$polylineInfo.num_levels}" />
				{formhelp note=""}
			{/forminput}
	</div>
	
	{if !$gContent->isValid() || $gContent->hasAdminPermission()}
	<div class="row">
		{formlabel label="Allow Registered Users To Edit" for="share_edit"}
			{forminput}
				<input type="checkbox" name="share_edit" value="y" {if $editShared}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to edit this polyline. This is good if you want this polyline to be editable like a wiki page."}
			{/forminput}
	</div>
	{/if}

	<div class="row submit">
		<input type="button" name="save_polyline_btn" value="Save" onclick="javascript:BitMap.EditSession.storePolyline( this.form );" />
	</div>
{/form}
{/strip}
