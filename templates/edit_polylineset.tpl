{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polylineset-options-form"}
	<input name="set_id" type="hidden" value="{$polylinesetInfo.set_id}">
	<input name="save_polylineset" type="hidden" value="true">
	<table class="data">
		<tr>
			<th>Name</th>
			<th>Description</th>
			<th>Style</th>
			<th style="width:80px">ACTIONS</th>
		</tr>
		<tr class="gmapeditstrong">
			<td><input name="name" type="text" style="width:90%" value="{$polylineInfo.name}"></td>
			<td><textarea name="description" style="width:90%" rows="2">{$polylineInfo.description}</textarea></td>
			<td><select name="style_id" id="style_id">
					<option value="0" >Google (standard)</option>
				</select>
			</td>
			<td width="200px">
				<div id="edit-polylineset-options-tips">Tips<br/>
				Put advice here
				</div>
				<div id="edit-polylineset-options-actions">Edit Polyline Actions<br/>
				<a id="polylinesetremove" href="javascript:BitMap.EditSession.removePolylineSet( this.form );">remove</a> 
				<a id="polylinesetdelete" href="javascript:BitMap.EditSession.expungePolylineSet( this.form );">delete</a><br/><br/>
				<a id="setaddpolylines" href="javascript:alert('feature coming soon');">Add Polylines from Archives</a>
				<div>
			</td>
		</tr>
	</table>
	<input type="button" name="savenewpolylineset" value="Save" onclick="javascript:BitMap.EditSession.storePolylineSet( this.form );"/>
	<input type="button" name="closepolylinesetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditPolylineSet()"/>
{/form}
{/strip}