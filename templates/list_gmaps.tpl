{* @todo header *}
<div class="floaticon">{bithelp}</div>

<div class="listing gmap">
	<div class="header">
		<h1>{tr}Gmap Records{/tr}</h1>
	</div>

	<div class="body">
		{form id="checkform"}
{strip}
{* can't use strip for the entire page due to javascript later on *}
			<input type="hidden" name="offset" value="{$control.offset|escape}" />
			<input type="hidden" name="sort_mode" value="{$control.sort_mode|escape}" />

			<table class="data">
				<tr>
{*					{if $gBitSystem->isFeatureActive( 'gmap_list_gmap_id' ) eq 'y'}				*}
						<th>{smartlink ititle="Gmap Id" isort=gmap_id offset=$control.offset iorder=desc idefault=1}</th>
{*					{/if}											 																						*}

{*					{if $gBitSystem->isFeatureActive( 'gmap_list_title' ) eq 'y'}					*}
						<th>{smartlink ititle="Title" isort=title offset=$control.offset}</th>
{*					{/if}											 																						*}

{*					{if $gBitSystem->isFeatureActive( 'gmap_list_description' ) eq 'y'}		*}
						<th>{smartlink ititle="Description" isort=description offset=$control.offset}</th>
{*					{/if}											 																						*}

{*					{if $gBitSystem->isFeatureActive( 'gmap_list_data' ) eq 'y'}					*}
						<th>{smartlink ititle="Text" isort=data offset=$control.offset}</th>
{*					{/if}											 																						*}

{*					{if $gBitUser->hasPermission( 'bit_p_remove_gmap' )}									*}
						<th>{tr}Actions{/tr}</th>
{*					{/if}											 																						*}
				</tr>

				{section name=changes loop=$list}
					<tr class="{cycle values="even,odd"}">
{*						{if $gmap_list_gmap_id eq 'y'}           *}
							<td><a href="{$smarty.const.GMAP_PKG_URL}index.php?gmap_id={$list[changes].gmap_id|escape:"url"}" title="{$list[changes].gmap_id}">{$list[changes].gmap_id|truncate:20:"...":true}</a></td>
{*						{/if}

{*						{if $gmap_list_title eq 'y'}						 *}
							<td>{$list[changes].title}</td>
{*						{/if}													 					 *}

{*						{if $gmap_list_description eq 'y'}			 *}
							<td>{$list[changes].description}</td>
{*						{/if}																 		 *}

{*						{if $gmap_list_data eq 'y'}							 *}
							<td>{$list[changes].data}</td>
{*						{/if}																		 *}

						{if $gBitUser->hasPermission( 'bit_p_remove_gmap' )}
							<td class="actionicon">
								{smartlink ititle="Edit" ifile="edit.php" ibiticon="liberty/edit" gmap_id=$list[changes].gmap_id}
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

			{if $gBitUser->hasPermission( 'bit_p_remove_gmap' )}
				<div style="text-align:right;">
					<script type="text/javascript">//<![CDATA[
						// check / uncheck all.
						document.write("<label for=\"switcher\">{tr}Select All{/tr}</label> ");
						document.write("<input name=\"switcher\" id=\"switcher\" type=\"checkbox\" onclick=\"switchCheckboxes(this.form.id,'checked[]','switcher')\" /><br />");
					//]]></script>

					<select name="submit_mult" onchange="this.form.submit();">
						<option value="" selected="selected">{tr}with checked{/tr}:</option>
						{if $gBitUser->hasPermission( 'bit_p_remove_gmap' )}
							<option value="remove_gmaps">{tr}remove{/tr}</option>
						{/if}
					</select>

					<script type="text/javascript">//<![CDATA[
					// Fake js to allow the use of the <noscript> tag (so non-js-users kenn still submit)
					//]]></script>

					<noscript>
						<div><input type="submit" value="{tr}Submit{/tr}" /></div>
					</noscript>
				</div>
			{/if}
		{/form}
	</div><!-- end .body -->

	{pagination_c}
	{minifind sort_mode=$sort_mode}
</div><!-- end .admin -->
