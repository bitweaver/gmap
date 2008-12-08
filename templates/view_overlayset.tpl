{* @todo header *}
{strip}
<div class="floaticon">{bithelp}</div>

<div class="display gmap">
	<div class="header">
		<h2>{tr}{$gContent->mType.content_description}{/tr}:</h2>
		<h1>{$gContent->getField('title')}</h1>
	</div>

	<div class="body">
			<table class="data">
				<caption>{tr}{$overlayTypePlural} in this Set{/tr}</caption>
				<tr>
					<th>{tr}Title{/tr}</th>
					<th>{tr}Description{/tr}</th>
				</tr>

				{section name=changes loop=$list}
					<tr class="{cycle values="odd,even"}">
						<td><a href="{$list[changes].display_url}">{$list[changes].title}</a></td>
						<td>{$list[changes].summary}</td>
					</tr>
				{sectionelse}
					<tr class="norecords"><td colspan="16">
						{tr}No records found{/tr}
					</td></tr>
				{/section}
			</table>
	</div><!-- end .body -->

	{pagination}
</div><!-- end .admin -->
{/strip}
