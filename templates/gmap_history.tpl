{strip}
<div class="admin gmap display">
	<div class="header">
		<h1>{tr}History{/tr} {tr}of{/tr} <a href="{$gContent->mInfo.display_url}">{$gContent->mInfo.title|escape}</a></h1>
	</div>

	<div class="body">
		{if $version}
			<h2>{tr}Version{/tr} {$version}</h2>
		{/if}

		{if $smarty.request.preview}
			{include file="bitpackage:gmap/show_gmap.tpl"}
		{/if}

		{if $source}
			<div class="content">{$sourcev}</div>
		{/if}

		{if $compare eq 'y'}
			<table class="table data">
				<caption>{tr}Comparing versions{/tr}</caption>
				<tr>
					<th width="50%">{tr}Version {$version_from}{/tr}</td>
					<th></th>
					<th width="50%">{tr}Current version{/tr}</td>
				</tr>
				<tr valign="top">
					<td><div class="content">{$diff_from}</div></td>
					<td>&nbsp;</td>
					<td><div class="content">{$diff_to}</div></td>
				</tr>
			</table>
		{/if}

		{if $diff2 eq 'y'}
			<h2>{tr}Differences from version{/tr} {$version_from} to {$version_to}</h2>
			{$diffdata}
		{/if}

		{form}
			<input type="hidden" name="page_id" value="{$gContent->mInfo.page_id}" />
			<input type="hidden" name="page" value="{$page}" />

			<table class="table data">
				<caption>{tr}Gmap History{/tr}</caption>
				<tr>
					<th style="width:70%;">{tr}Date / Comment{/tr}</th>
					<th style="width:10%;">{tr}User{/tr}</th>
					<th style="width:10%;">{tr}IP{/tr}</th>
					<th style="width:10%;">{tr}Version{/tr}</th>
				</tr>

				<tr class="odd">
					<td>{$gContent->mInfo.last_modified|bit_short_datetime}<br />{$gContent->mInfo.edit_comment}</td>

					<td>{displayname user=$gContent->mInfo.modifier_user user_id=$gContent->mInfo.modifier_user_id real_name=$gContent->mInfo.modifier_real_name} </td>
					<td style="text-align:right;">{$gContent->mInfo.ip}</td>
					<td style="text-align:right;">{$gContent->mInfo.version}</td>
				</tr>

				<tr class="odd">
					<td colspan="4">
						<a href="{$gContent->mInfo.display_url}">{tr}Current{/tr}</a>
						&nbsp;&bull;&nbsp;{smartlink ititle="Source" gmap_id=$gContent->mGmapId source="current"}
					</td>
				</tr>

				{foreach from=$data item=item}
					<tr class="{cycle values='even,odd' advance=false}">
						<td><label for="hist_{$item.version}">{$item.last_modified|bit_short_datetime}<br />{$item.history_comment}</label></td>
						<td>{displayname hash=$item}</td>
						<td style="text-align:right;">{$item.ip}</td>
						<td style="text-align:right;">{$item.version}</td>
					</tr>
					<tr class="{cycle values='even,odd'}">
						<td colspan="3">
							{smartlink ititle="View" gmap_id=$gContent->mGmapId preview=$item.version}
							&nbsp;&bull;&nbsp;{smartlink ititle="Compare" gmap_id=$gContent->mGmapId compare=$item.version}
							&nbsp;&bull;&nbsp;{smartlink ititle="Difference" gmap_id=$gContent->mGmapId diff2=$item.version}
							&nbsp;&bull;&nbsp;{smartlink ititle="Source" gmap_id=$gContent->mGmapId source=$item.version}
							{if $gBitUser->hasPermission( 'p_gmap_rollback' )}
								&nbsp;&bull;&nbsp;{smartlink iurl="rollback.php" ititle="Rollback" gmap_id=$gContent->mGmapId version=$item.version}
							{/if}
						</td>
						<td style="text-align:right;">
							{if $gBitUser->hasPermission( 'p_gmap_remove' )}
								<input type="checkbox" name="hist[{$item.version}]" id="hist_{$item.version}" />
							{/if}
						</td>
					</tr>
				{foreachelse}
					<tr class="norecords">
						<td colspan="4">
							{tr}No records found{/tr}
						</td>
					</tr>
				{/foreach}
			</table>

			{if $gBitUser->hasPermission( 'p_gmap_remove' )}
				<div style="text-align:right;">
					<input type="submit" class="btn" name="delete" value="{tr}Delete selected versions{/tr}" />
				</div>
			{/if}
		{/form}

		{pagination page_id=$gContent->mInfo.page_id}
	</div><!-- end .body -->
</div> <!-- end .gmap -->
{/strip}
