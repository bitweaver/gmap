{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-maptype-options-form"}
	<input name="save_maptype" type="hidden" value="true">
	<input name="maptype_id" type="hidden" size="3" value="{$maptypeInfo.maptype_id}">
	  <div>
		Name<br/>
		<input name="name" type="text" size="50" value="{$maptypeInfo.name}"><br/>
		Short Name<br/>
		<input name="shortname" type="text" size="10" value="{$maptypeInfo.shortname}"><br/>
		Description<br/>
		<input name="description" type="text" size="50" value="{$maptypeInfo.description}">
	  </div>
	  <div>
		Min Zoom <input name="minzoom" type="text" size="3" value="{if $maptypeInfo.minzoom}{$maptypeInfo.minzoom}{else}0{/if}"><br/>
		Max Zoom <input name="maxzoom" type="text" size="3" value="{if $maptypeInfo.maxzoom}{$maptypeInfo.maxzoom}{else}16{/if}"><br/>
		Error Message<br/>
		<input name="errormsg" type="text" size="50" value="{$maptypeInfo.errormsg}">
	  </div>
	  <div>
		<input type="button" name="save_maptype_btn" value="Save" onclick="javascript:BitMap.EditSession.storeMaptype( this.form );">
	  </div>
	{/form}
{/strip}
