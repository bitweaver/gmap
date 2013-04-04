{* @todo header *}
<div class="floaticon">{bithelp}</div>

<div class="admin">
	<div class="header">
		<h1>{tr}Maps{/tr}</h1>
	</div>

	<div class="body">
		{minifind sort_mode=$sort_mode}

		{form id="checkform"}
{strip}
{* can't use strip for the entire page due to javascript later on *}
			<input type="hidden" name="offset" value="{$control.offset|escape}" />
			<input type="hidden" name="sort_mode" value="{$control.sort_mode|escape}" />

			<table class="data">
				<tr>
					{if $gBitUser->hasPermission( 'p_gmap_admin' )}
						<th>{smartlink ititle="Gmap Id" isort=gmap_id offset=$control.offset iorder=desc idefault=1}</th>
					{/if}

						<th>{smartlink ititle="Title" isort=title offset=$control.offset}</th>

						<th>{smartlink ititle="Description" isort=summary offset=$control.offset}</th>

					{if $gBitUser->hasPermission( 'p_gmap_remove' )}
						<th>{tr}Actions{/tr}</th>
					{/if}
				</tr>

				{section name=changes loop=$list}
					<tr class="{cycle values="odd,even"}">
						{if $gBitUser->hasPermission( 'p_gmap_admin' )}
							<td>{$list[changes].gmap_id|truncate:20:"...":true}</td>
						{/if}

							<td><a href="{$smarty.const.GMAP_PKG_URL}index.php?gmap_id={$list[changes].gmap_id|escape:"url"}" title="{$list[changes].gmap_id}">{$list[changes].title}</a></td>

							<td>{$list[changes].summary}</td>

						{if $gBitUser->hasPermission( 'p_gmap_remove' )}
							<td class="actionicon">
								{smartlink ititle="Edit" ifile="edit.php" booticon="icon-edit" gmap_id=$list[changes].gmap_id}
								<input type="checkbox" name="checked[]" title="{$list[changes].title}" value="{$list[changes].gmap_id|escape}" />
							</td>
						{/if}
					</tr>
				{sectionelse}
					<tr class="norecords"><td colspan="16">
						{tr}No records found{/tr}
					</td></tr>
				{/section}
			</table>
{/strip}

			{if $gBitUser->hasPermission( 'p_gmap_remove' )}
				<div style="text-align:right;">
					<script type="text/javascript">//<![CDATA[
						// check / uncheck all.
						document.write("<label for=\"switcher\">{tr}Select All{/tr}</label> ");
						document.write("<input name=\"switcher\" id=\"switcher\" type=\"checkbox\" onclick=\"BitBase.switchCheckboxes(this.form.id,'checked[]','switcher')\" /><br />");
					//]]></script>

					<select name="submit_mult" onchange="this.form.submit();">
						<option value="" selected="selected">{tr}with checked{/tr}:</option>
						{if $gBitUser->hasPermission( 'p_gmap_remove' )}
							<option value="remove_gmaps">{tr}remove{/tr}</option>
						{/if}
					</select>

					<script type="text/javascript">//<![CDATA[
					// Fake js to allow the use of the <noscript> tag (so non-js-users kenn still submit)
					//]]></script>

					<noscript>
						<div><input type="submit" class="btn" value="{tr}Submit{/tr}" /></div>
					</noscript>
				</div>
			{/if}
		{/form}
	</div><!-- end .body -->

	{pagination}
</div><!-- end .admin -->
