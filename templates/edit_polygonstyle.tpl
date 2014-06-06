{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polygonstyle-form"}
	<input name="save_polygonstyle" type="hidden" value="true" />
	<input name="style_id" type="hidden" value="{$polygonstyleInfo.style_id}" />
	<div class="form-group">
		{formlabel label="Name" for="name"}
			{forminput}
				<input name="name" type="text" value="{$polygonstyleInfo.name}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Color" for="color"}
			{forminput}
				<input name="color" type="text" value="{if $polygonstyleInfo.color}{$polygonstyleInfo.color}{else}ff3300{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Opacity" for="opacity"}
			{forminput}
				<input name="opacity" type="text" value="{if $polygonstyleInfo.opacity}{$polygonstyleInfo.opacity}{else}.75{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group submit">
		<input type="button" name="save_polygonstyle_btn" value="Save" onclick="javascript:BitMap.EditSession.storePolygonStyle( this.form );" />
	</div>
{/form}
{/strip}
