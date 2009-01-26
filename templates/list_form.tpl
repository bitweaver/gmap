<div>
	{form name="list-query-form" id="list-query-form" legend="Search"}
		{* boundries - set this in RequestContent if we want it *}
		{* offset - probably set this dynamically and hidden *}
		{* stars_rating_count - is this supported? *}    
		<input name="output" type="hidden" value="json" />
		<input name="max_records" type="hidden" value="{$gBitSystem->getConfig('max_records')|default:10}" />
		<input name="sort_mode" type="hidden" value="content_type_guid_asc" />

		{if $smarty.request.content_type_guid && $smarty.const.ACTIVE_PACKAGE != 'gmap'}	
			<input type="hidden" name="content_type_guid" value="bitgroup" />
		{else}
			<div style="float:left; margin-right:10px;">
				<span>Content Types: </span><br />
				<select multiple size=5 name="content_type_guid[]">
					<option value="Any" {if !$contentSelect}selected{/if} >Any</option>
					{foreach from=$ContentTypes item=c_type}
						{if $c_type.content_type_guid != 'bitcomment' && $c_type.content_type_guid != 'pigeonholes'}
						<option value="{$c_type.content_type_guid}" {if $contentSelect && in_array($c_type.content_type_guid, $contentSelect)}selected{/if}>{if $c_type.content_description == "User Information"}Site Members{else}{$c_type.content_description}s{/if}</option>
						{/if}
					{/foreach}
				</select>
			</div>
		{/if}

			<div style="float:left; margin-right:10px;">
				<span>Find (key word or phrase):</span><br />
				<input type="text" name="find" value="{$find|default:$smarty.request.find|default:$prompt|escape}" {if $prompt}onclick="if (this.value == '{$prompt}') this.value = '';"{/if}/>&nbsp;
			</div>


			{if $pigeonList}
				<div style="float:left; margin-right:10px;">
					<span>Categories: </span><br />
					<select multiple size=5 name="liberty_categories[]">
						<option value="Any" selected >Any</option>
						{foreach from=$pigeonList item=item}
							{section name=ix loop=$item.subtree}
								<option value="{$item.subtree[ix].content_id}">{$item.subtree[ix].title}</option>
							{/section}
						{/foreach}
					</select><br />
				</div>
			{/if}

			<div style="float:left; margin-right:10px;">
				<div>
					Date: <br />
					<input name="hr_date" type="text" size="25px" value="" onchange="BitMap.EvalDate()" />
					<a href="javascript:void(null)" onclick="BitMap.ShowCalendar()" title="select date from calendar"><img id="CalLink" src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/pdate.gif" style="vertical-align:top;"></a>
					<input name="from_date" type="hidden" value="" />
					<input name="until_date" type="hidden" value="" />
				</div>
				<div id="gmap-date-range" style="display:none;margin-top:4px">
					Date Range: 
					<select name="date_range" onchange="return BitMap.SelectDateRange(this)">
						<option value="selectiononly" >On This Date Only</option>
						<option value="sinceselection" >Since This Date</option>
					</select>
				</div>
			</div>
			<div id="gmap-block-viewaslist" style="float:right; margin-right:10px; {if !$listInfo}display:none;{/if}">
				{if $smarty.const.ACTIVE_PACKAGE == 'gmap'}
					{assign var=listUrl value="`$smarty.const.LIBERTY_PKG_URL`list_content.php"}
				{/if}
				<a href="{pageurl listInfo=$listInfo pgnUrl=$listUrl}" id="gmap-link-viewaslist">{tr}View Results as a List{/tr}</a>
			</div>

		<div style="clear:both">
			<div style="padding-top:4px">
				<input type="button" value="Submit" onclick="javascript:BitMap.MapData[0].Map.RequestContent(document['list-query-form']);" />
			</div>
			{formhelp note="Searches are limited to the visible map area. Drag the map or zoom out to change the area to search."}
		</div>
	{/form}
</div>
{*we put the calendar object outside the form to save some js processing time, otherwise it gets processed when the form is evaluated*}
<div id="gmap-cal-container" style="position:absolute;z-index:10000;display:none;width:170px;">
	<a style="float:right" href="javascript:void(null)" onclick="BitMap.HideCalendar()"><img src="{$smarty.const.GMAP_PKG_URL}libraries/yahoo/x_d.gif" title="close"></a>
	Select a date 
	<div id="gmap-cal"></div>
</div>
