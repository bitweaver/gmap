{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-tilelayer-form"}
	<input name="save_tilelayer" type="hidden" value="true">
	<input name="tilelayer_id" type="hidden" value="{$tilelayerInfo.tilelayer_id}">
	<input name="maptype_id" type="hidden" value="{$tilelayerInfo.maptype_id}">
	<div>
		Name<br/>
		<input name="tiles_name" type="text" size="50" value="{$tilelayerInfo.tiles_name}"><br/>
		MinZoom<br/>
		<input name="tiles_minzoom" type="text" size="5" value="{if $tilelayerInfo.tiles_minzoom}{$tilelayerInfo.tiles_minzoom}{else}0{/if}"><br/>
		MaxZoom<br/>
		<input name="tiles_maxzoom" type="text" size="5" value="{if $tilelayerInfo.tiles_maxzoom}{$tilelayerInfo.tiles_maxzoom}{else}0{/if}"><br/>
		Tiles are PNGs<br/>
		<select name="ispng">
			<option {if $tilelayerInfo.ispng == 0}selected="selected"{/if} value="0" >False</option>
			<option {if $tilelayerInfo.ispng == 1}selected="selected"{/if} value="1" >True</option>
		</select><br/>	
		Tiles URL<br/>
		<input name="tilesurl" type="text" size="50" value="{$tilelayerInfo.tilesurl}"><br/>
		Opacity (a float from 0 to 1)<br/>
		<input name="opacity" type="text" size="5" value="{$tilelayerInfo.opacity}"><br/>
		</div>
		<div>
			<input type="button" name="save_tilelayer_btn" value="Save" onclick="javascript:BitMap.EditSession.storeTilelayer( this.form );">
		</div>
	</div>
{/form}
{/strip}