{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-markerset-options-form"}
	<input name="set_id" type="hidden" value="{$markersetInfo.set_id}">
	<input name="save_markerset" type="hidden" value="true">
	<table class="data">
		<tr>
			<td>
				Name:<br/>
				<input size="40" name="name" type="text" value="{$markersetInfo.name}"><br/>
				Description:<br/>
				<input size="40" name="description" type="text" value="{$markersetInfo.description}">
			</td>
			<td>
			{*	  if ( this.Map.markerstyles.length > 0 && form.style_id.options.length < (this.Map.markerstyles.length + 1) ){
		    form.style_id.options[OptionN + d] = new Option( this.Map.markerstyles[d].name, this.Map.markerstyles[d].style_id );
				*}
				Marker Style:<br/>
				<select name="style_id">
				<option value="0" {if $markersetInfo.style_id == 0 }selected="selected"{/if}>Google (standard)</option>
				</select><br/>
				Icon Style:<br/>
				<select name="icon_id">
				<option value="0" {if $markersetInfo.icon_id == 0 }selected="selected"{/if}>Google (standard)</option>
				</select>
			<td>
				Cluster:<br/>
				<select name="cluster">
				<option value="false" {if $markersetInfo.cluster == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.cluster == "true" }selected="selected"{/if}>Yes</option>
				</select><br/>
				Plot-On-Load:<br/>
				<select name="plot_on_load">
				<option value="false" {if $markersetInfo.plot_on_load == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.plot_on_load == "true" }selected="selected"{/if}>Yes</option>
				</select>
			</td>
			<td>
				List Set In Side Panel:<br/>
				<select name="side_panel">
				<option value="false" {if $markersetInfo.side_panel == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.side_panel == "true" }selected="selected"{/if}>Yes</option>
				</select><br/>
				List Markers In Side Panel:<br/>
				<select name="explode">
				<option value="false" {if $markersetInfo.explode == "false" }selected="selected"{/if}>No</option>
				<option value="true" {if $markersetInfo.explode == "true" }selected="selected"{/if}>Yes</option>
				</select>
			</td>
			<td width="200px">
				<div id="edit-markerset-options-tips">Tips<br/>
				Put advice here
				</div>
				<div id="edit-markerset-options-actions">Edit Marker Actions<br/>
				<a id="setremove" href="javascript:BitMap.EditSession.removeMarkerSet( this.form );">remove</a> 
				<a id="setdelete" href="javascript:BitMap.EditSession.expungeMarkerSet( this.form );">delete</a><br/><br/>
				<a id="setaddmarkers" href="javascript:alert('feature coming soon');">Add Markers from Archives</a>
				<div>
			</td>
		</tr>
	</table>
	<input type="button" name="savenewmarkerset" value="Save" onclick="javascript:BitMap.EditSession.storeMarkerSet( this.form );"/>
	<input type="button" name="closemarkersetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditMarkerSet()"/>
{/form}
{/strip}