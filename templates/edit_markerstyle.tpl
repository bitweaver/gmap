{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-markerstyle-form"}
	<input name="style_id" type="hidden" value="{$markerstyleInfo.style_id}">
	<!-- <input name="style_array_n" type="hidden" value="n"> -->
	<input name="save_markerstyle" type="hidden" value="true">
	<div>Name<br/>
		<input name="name" type="text" style="width:90%" value="{$markerstyleInfo.name}">
	</div>
	<div>Type<select name="marker_style_type">
		<option value="0" {if $markerstyleInfo.marker_style_type == 0 }selected="selected"{/if}>GMarker</option>
		<option value="1" {if $markerstyleInfo.marker_style_type == 1 }selected="selected"{/if}>PdMarker</option>
		</select>
	</div>
	<div>Label Hover Opacity (%) <input name="label_hover_opacity" type="text" size="5" value="{if $markerstyleInfo.label_hover_opacity}{$markerstyleInfo.label_hover_opacity}{else}70{/if}"></div>
	<div>Label Opacity (%) <input name="label_opacity" type="text" size="5" value="{if $markerstyleInfo.label_opacity}{$markerstyleInfo.label_opacity}{else}100{/if}"></div>
	<div>Label Hover Styles (CSS)<br />
		<textarea name="label_hover_styles" style="width:90%" rows="3">{$markerstyleInfo.label_hover_styles}</textarea>
	</div>
	<div>Window Styles (CSS)<br />
		<textarea name="window_styles" style="width:90%" rows="3">{$markerstyleInfo.window_styles}</textarea>
	</div>
	<div><input type="button" name="save_markerstyle_btn" value="Save" onclick="javascript:BitMap.EditSession.storeMarkerStyle( this.form );"></div>
{/form}
{/strip}