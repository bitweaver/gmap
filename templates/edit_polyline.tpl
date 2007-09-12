{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polyline-form"}
	<input name="save_polyline" type="hidden" value="true">
	<input name="set_id" type="hidden" size="3" value="{$polylineInfo.set_id}">
	<input name="polyline_id" type="hidden" size="3" value="{$polylineInfo.polyline_id}">
	<div>
		Name:<br/>
		<input name="name" type="text" style="width:90%" value="{$polylineInfo.name}"><br/>

		Polyline Type:<br/>
		<select name="type">
			<option value="0" {if $polylineInfo.type == 0 }selected="selected"{/if}>Google (standard)</option>
			<option value="1" {if $polylineInfo.type == 1 }selected="selected"{/if}>Geodesic</option>
			<option value="2" {if $polylineInfo.type == 2 }selected="selected"{/if}>Encoded</option>
		</select><br/>
		
		<textarea name="points_data" style="width:90%" rows="3">{$polylineInfo.points_data}</textarea><br/>
		<a name="polyline_assist_btn" title="draw the line!" href="javascript:BitMap.EditSession.addAssistant('polyline', n);">Use Drawing Assistant</a><br/>

		Levels Data:<br/>
		<textarea name="levels_data" style="width:90%" rows="1">{$polylineInfo.levels_data}</textarea><br/>

		Zoom Factor:<br/>
		<input name="zoom_factor" type="text" style="width:90%" value="{$polylineInfo.zoom_factor}"><br/>

		Number of Levels:<br/>
		<input name="num_levels" type="text" style="width:90%" value="{$polylineInfo.num_levels}"><br/>
		
		<div class="row submit">
			<input type="button" name="save_polyline_btn" value="Save" onclick="javascript:BitMap.EditSession.storePolyline( this.form );">
		</div>
	</div>
{/form}
{/strip}