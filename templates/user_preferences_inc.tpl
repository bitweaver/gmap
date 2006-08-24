{jstab title="User Location"}
	{form legend="Geo Coordinates"}
    <input type="hidden" name="view_user" value="{$editUser.user_id}" />
		<input type="hidden" name="real_name" value="{$editUser.real_name|escape}" />
    {include file='bitpackage:gmap/edit_gmap_mini_inc.tpl'}
		<div class="row submit">
			<input type="submit" name="prefs" value="{tr}Change preferences{/tr}" />
		</div>
	{/form}
{/jstab}
