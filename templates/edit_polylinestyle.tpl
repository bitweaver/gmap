{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polylinestyle-form"}
	<input name="save_polylinestyle" type="hidden" value="true">
	<input name="style_id" type="hidden" value="{$polylinestyleInfoInfo.style_id}">
	<div>
		Name <br/><input name="name" type="text" value="{$polylinestyleInfoInfo.name}"><br/>
		Color <br/><input name="color" type="text" value="{if $polylinestyleInfoInfo.color}{$polylinestyleInfoInfo.color}{else}ff3300{/if}"><br/>
		Weight <br/><input name="weight" type="text" value="{if $polylinestyleInfoInfo.weight}{$polylinestyleInfoInfo.weight}{else}2{/if}"><br/>
		Opacity <br/><input name="opacity" type="text" value="{if $polylinestyleInfoInfo.opacity}{$polylinestyleInfoInfo.opacity}{else}.75{/if}"><br/>
	</div>
	<div><input type="button" name="save_polylinestyle_btn" value="Save" onclick="javascript:BitMap.EditSession.storePolylineStyle( this.form );"></div>
{/form}
{/strip}