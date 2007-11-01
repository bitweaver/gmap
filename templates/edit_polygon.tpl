{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polygon-form"}
	<input name="save_polygon" type="hidden" value="true">
	<input name="set_id" type="hidden" size="3" value="{$polygonInfo.set_id}">
	<input name="polygon_id" type="hidden" size="3" value="{$polygonInfo.polygon_id}">
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input name="title" type="text" style="width:90%" value="{$polygonInfo.title}">
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Polygon Type" for="type"}
			{forminput}
				<select name="type">
					<option value="0" {if $polygonInfo.type == 0 }selected="selected"{/if}>Google (standard)</option>
					<option value="1" {if $polygonInfo.type == 1 }selected="selected"{/if}>Circle</option>
					<option value="2" {if $polygonInfo.type == 2 }selected="selected"{/if}>Encoded</option>
				</select><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Window Text" for="edit"}
			{forminput}
				<textarea name="edit" style="width:90%" rows="3">{$polygonInfo.data}</textarea>
				{formhelp note="This text will appear in an info ballon when someone clicks on the line."}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Data Points" for="poly_data"}
			{forminput}
				<textarea name="poly_data" style="width:90%" rows="3">{$polygonInfo.poly_data}</textarea>
				{formhelp note=""}
			{/forminput}
			<a name="polygon_assist_btn" title="draw the line!" href="javascript:BitMap.EditSession.addAssistant('polygon', n);">Use Drawing Assistant</a>
	</div>
	<div class="row">
		{formlabel label="Circle Center" for="circle_center"}
			{forminput}
				<input name="circle_center" type="text" style="width:90%" value="{$polygonInfo.circle_center}"><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Radius" for="radius"}
			{forminput}
				<input name="radius" type="text" style="width:90%" value="{$polygonInfo.radius}"><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Levels Data" for="levels_data"}
			{forminput}
				<textarea name="levels_data" style="width:90%" rows="1">{$polygonInfo.levels_data}</textarea>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Zoom Factor" for="zoom_factor"}
			{forminput}
				<input name="zoom_factor" type="text" style="width:90%" value="{$polygonInfo.zoom_factor}"><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Number of Levels" for="num_levels"}
			{forminput}
				<input name="num_levels" type="text" style="width:90%" value="{$polygonInfo.num_levels}"><br/>
				{formhelp note=""}
			{/forminput}
	</div>
	
	{if !$gContent->isValid() || $gContent->hasAdminPermission()}
	<div class="row">
		{formlabel label="Allow Registered Users To Edit" for="share_edit"}
			{forminput}
				<input type="checkbox" name="share_edit" value="y" {if $editShared}checked="checked"{/if} />
				{formhelp note="Checking this box will allow any registered user to edit this polygon. This is good if you want this polygon to be editable like a wiki page."}
			{/forminput}
	</div>
	{/if}
	
	<div class="row submit">
		<input type="button" name="save_polygon_btn" value="Save" onclick="javascript:BitMap.EditSession.storePolygon( this.form );">
	</div>
{/form}
{/strip}