{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-markerstyle-form"}
	<input name="style_id" type="hidden" value="{$markerstyleInfo.style_id}" />
	<input name="save_markerstyle" type="hidden" value="true" />
	<div class="form-group">
		{formlabel label="Name" for="name"}
			{forminput}
				<input name="name" type="text" style="width:90%" value="{$markerstyleInfo.name}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Type" for="marker_style_type"}
			{forminput}
				<select name="marker_style_type">
				<option value="0" {if $markerstyleInfo.marker_style_type == 0 }selected="selected"{/if}>GXMarker</option>
				<option value="1" {if $markerstyleInfo.marker_style_type == 1 }selected="selected"{/if}>PdMarker</option>
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Label Hover Opacity (%)" for="label_hover_opacity"}
			{forminput}
				<input name="label_hover_opacity" type="text" size="5" value="{if $markerstyleInfo.label_hover_opacity}{$markerstyleInfo.label_hover_opacity}{else}70{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Label Opacity (%)" for="label_opacity"}
			{forminput}
				<input name="label_opacity" type="text" size="5" value="{if $markerstyleInfo.label_opacity}{$markerstyleInfo.label_opacity}{else}100{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Label Hover Styles (CSS)" for="label_hover_styles"}
			{forminput}
				<textarea name="label_hover_styles" style="width:90%" rows="3">{$markerstyleInfo.label_hover_styles}</textarea>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Window Styles (CSS)" for="window_styles"}
			{forminput}
				<textarea name="window_styles" style="width:90%" rows="3">{$markerstyleInfo.window_styles}</textarea>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group submit">
		<input type="button" name="save_markerstyle_btn" value="Save" onclick="javascript:BitMap.EditSession.storeMarkerStyle( this.form );" />
	</div>
{/form}
{/strip}
