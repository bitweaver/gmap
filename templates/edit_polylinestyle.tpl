{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polylinestyle-form"}
	<input name="save_polylinestyle" type="hidden" value="true">
	<input name="style_id" type="hidden" value="{$polylinestyleInfoInfo.style_id}">
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input name="name" type="text" value="{$polylinestyleInfoInfo.name}">
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Color" for="color"}
			{forminput}
				<input name="color" type="text" value="{if $polylinestyleInfoInfo.color}{$polylinestyleInfoInfo.color}{else}ff3300{/if}">
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Weight" for="weight"}
			{forminput}
				<input name="weight" type="text" value="{if $polylinestyleInfoInfo.weight}{$polylinestyleInfoInfo.weight}{else}2{/if}">
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Opacity" for="opacity"}
			{forminput}
				<input name="opacity" type="text" value="{if $polylinestyleInfoInfo.opacity}{$polylinestyleInfoInfo.opacity}{else}.75{/if}">
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row submit">
		<input type="button" name="save_polylinestyle_btn" value="Save" onclick="javascript:BitMap.EditSession.storePolylineStyle( this.form );">
	</div>
{/form}
{/strip}