{if $gBitSystem->isFeatureActive( 'gmap_map_bituser')}
{jstab title="Location" onclick="M=BitMap.MapData[0].Map.map; M.savePosition(); M.checkResize(); M.returnToSavedPosition();"}
	{form legend="Geo Coordinates"}
		<input type="hidden" name="view_user" value="{$view_user}" />
		<input type="hidden" name="real_name" value="{$editUser->mInfo.real_name|escape}" />
		{include file='bitpackage:gmap/edit_gmap_mini_inc.tpl'}
		<div class="form-group submit">
			<input type="submit" class="btn btn-default" name="prefs" value="{tr}Change preferences{/tr}" />
		</div>
	{/form}
{/jstab}
{/if}
