{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-maptype-options-form"}
	<input name="save_maptype" type="hidden" value="true" />
	<input name="maptype_id" type="hidden" size="3" value="{$maptypeInfo.maptype_id}" />
	<div class="form-group">
		{formlabel label="Name" for="name"}
		{forminput}
			<input name="name" type="text" size="50" value="{$maptypeInfo.name}" />
			{formhelp note=""}
		{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Short Name" for="shortname"}
		{forminput}
			<input name="shortname" type="text" size="10" value="{$maptypeInfo.shortname}" />
			{formhelp note=""}
		{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Description" for="description"}
		{forminput}
			<input name="description" type="text" size="50" value="{$maptypeInfo.description}" />
			{formhelp note=""}
		{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Min Zoom" for="minzoom"}
		{forminput}
		<input name="minzoom" type="text" size="3" value="{if $maptypeInfo.minzoom}{$maptypeInfo.minzoom}{else}0{/if}" />
			{formhelp note=""}
		{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Max Zoom" for="maxzoom"}
		{forminput}
		<input name="maxzoom" type="text" size="3" value="{if $maptypeInfo.maxzoom}{$maptypeInfo.maxzoom}{else}16{/if}" />
			{formhelp note=""}
		{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Error Message" for="maxzoom"}
		{forminput}
			<input name="errormsg" type="text" size="50" value="{$maptypeInfo.errormsg}" />
			{formhelp note=""}
		{/forminput}
	</div>
	<div class="form-group submit">
		<input type="button" name="save_maptype_btn" value="Save" onclick="javascript:BitMap.EditSession.storeMaptype( this.form );" />
	</div>
{/form}
{/strip}
