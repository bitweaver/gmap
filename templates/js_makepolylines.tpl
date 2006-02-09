<script type="text/javascript">
//<![CDATA[

var bLData = new Array();
{if count($gContent->mMapPolylines) > 0}
	{section name=polyline_n loop=$gContent->mMapPolylines}
		bLData[{$smarty.section.polyline_n.index}] = new Array();
		bLData[{$smarty.section.polyline_n.index}].polyline_id = {$gContent->mMapPolylines[polyline_n].polyline_id};
		bLData[{$smarty.section.polyline_n.index}].user_id = {$gContent->mMapPolylines[polyline_n].user_id};
		bLData[{$smarty.section.polyline_n.index}].modifier_user_id = {$gContent->mMapPolylines[polyline_n].modifier_user_id};
		bLData[{$smarty.section.polyline_n.index}].created = {$gContent->mMapPolylines[polyline_n].created};
		bLData[{$smarty.section.polyline_n.index}].last_modified = {$gContent->mMapPolylines[polyline_n].last_modified};
		bLData[{$smarty.section.polyline_n.index}].version = {$gContent->mMapPolylines[polyline_n].version};
		bLData[{$smarty.section.polyline_n.index}].name = "{$gContent->mMapPolylines[polyline_n].name}";
		bLData[{$smarty.section.polyline_n.index}].points_data = new Array();
		bLData[{$smarty.section.polyline_n.index}].points_data = [{$gContent->mMapPolylines[polyline_n].points_data}];
		bLData[{$smarty.section.polyline_n.index}].border_text = "{$gContent->mMapPolylines[polyline_n].border_text}";
		{if $gContent->mMapPolylines[polyline_n].zindex != NULL}
			bLData[{$smarty.section.polyline_n.index}].zindex = {$gContent->mMapPolylines[polyline_n].zindex};
		{/if}
		bLData[{$smarty.section.polyline_n.index}].set_id = {$gContent->mMapPolylines[polyline_n].set_id};
		bLData[{$smarty.section.polyline_n.index}].style_id = {$gContent->mMapPolylines[polyline_n].style_id};
		bLData[{$smarty.section.polyline_n.index}].array_n = {$smarty.section.polyline_n.index};
		bLData[{$smarty.section.polyline_n.index}].plot_on_load = {$gContent->mMapPolylines[polyline_n].plot_on_load};
		bLData[{$smarty.section.polyline_n.index}].side_panel = {$gContent->mMapPolylines[polyline_n].side_panel};
		bLData[{$smarty.section.polyline_n.index}].explode = {$gContent->mMapPolylines[polyline_n].explode};
	{/section}
{/if}


var bLStyData = new Array();
{if count($gContent->mMapPolylineStyles) > 0 }
	{section name=style_n loop=$gContent->mMapPolylineStyles}
		bLStyData[{$smarty.section.style_n.index}] = new Array();
		bLStyData[{$smarty.section.style_n.index}].style_id = {$gContent->mMapPolylineStyles[style_n].style_id};
		bLStyData[{$smarty.section.style_n.index}].name = "{$gContent->mMapPolylineStyles[style_n].name}";
		bLStyData[{$smarty.section.style_n.index}].type = {$gContent->mMapPolylineStyles[style_n].type};
		bLStyData[{$smarty.section.style_n.index}].color = "{$gContent->mMapPolylineStyles[style_n].color}";
		bLStyData[{$smarty.section.style_n.index}].weight = {$gContent->mMapPolylineStyles[style_n].weight};
		bLStyData[{$smarty.section.style_n.index}].opacity = {$gContent->mMapPolylineStyles[style_n].opacity};
		bLStyData[{$smarty.section.style_n.index}].pattern = new Array();
		{if $gContent->mMapPolylineStyles[style_n].pattern != NULL}
			bLStyData[{$smarty.section.style_n.index}].pattern = {$gContent->mMapPolylineStyles[style_n].pattern};
		{/if}
		bLStyData[{$smarty.section.style_n.index}].segment_count = {$gContent->mMapPolylineStyles[style_n].segment_count};
		bLStyData[{$smarty.section.style_n.index}].text_every = {$gContent->mMapPolylineStyles[style_n].text_every};
		bLStyData[{$smarty.section.style_n.index}].begin_arrow = {$gContent->mMapPolylineStyles[style_n].begin_arrow};
		bLStyData[{$smarty.section.style_n.index}].end_arrow = {$gContent->mMapPolylineStyles[style_n].end_arrow};
		bLStyData[{$smarty.section.style_n.index}].arrows_every = {$gContent->mMapPolylineStyles[style_n].arrows_every};
		bLStyData[{$smarty.section.style_n.index}].text_fgstyle_color = "{$gContent->mMapPolylineStyles[style_n].text_fgstyle_color}";
		bLStyData[{$smarty.section.style_n.index}].text_fgstyle_weight = {$gContent->mMapPolylineStyles[style_n].text_fgstyle_weight};
		bLStyData[{$smarty.section.style_n.index}].text_fgstyle_opacity = {$gContent->mMapPolylineStyles[style_n].text_fgstyle_opacity};
		{if $gContent->mMapPolylineStyles[style_n].text_fgstyle_zindex != NULL}
			bLStyData[{$smarty.section.style_n.index}].text_fgstyle_zindex = {$gContent->mMapPolylineStyles[style_n].text_fgstyle_zindex};
		{/if}
		bLStyData[{$smarty.section.style_n.index}].text_bgstyle_color = "{$gContent->mMapPolylineStyles[style_n].text_bgstyle_color}";
		bLStyData[{$smarty.section.style_n.index}].text_bgstyle_weight = {$gContent->mMapPolylineStyles[style_n].text_bgstyle_weight};
		bLStyData[{$smarty.section.style_n.index}].text_bgstyle_opacity = {$gContent->mMapPolylineStyles[style_n].text_bgstyle_opacity};
		{if $gContent->mMapPolylineStyles[style_n].text_bgstyle_zindex != NULL}
			bLStyData[{$smarty.section.style_n.index}].text_bgstyle_zindex = {$gContent->mMapPolylineStyles[style_n].text_bgstyle_zindex};
		{/if}
	{/section}
{/if}


var bLSetData = new Array();
{if count($gContent->mMapPolylineSets) > 0}
	{section name=set_n loop=$gContent->mMapPolylineSets}
		bLSetData[{$smarty.section.set_n.index}] = new Array();
		bLSetData[{$smarty.section.set_n.index}].set_id = {$gContent->mMapPolylineSets[set_n].set_id};
		bLSetData[{$smarty.section.set_n.index}].name = "{$gContent->mMapPolylineSets[set_n].name}";
		bLSetData[{$smarty.section.set_n.index}].description = "{$gContent->mMapPolylineSets[set_n].description}";
		bLSetData[{$smarty.section.set_n.index}].style_id = {$gContent->mMapPolylineSets[set_n].style_id};
		bLSetData[{$smarty.section.set_n.index}].plot_on_load = {$gContent->mMapPolylineSets[set_n].plot_on_load};
		bLSetData[{$smarty.section.set_n.index}].side_panel = {$gContent->mMapPolylineSets[set_n].side_panel};
		bLSetData[{$smarty.section.set_n.index}].explode = {$gContent->mMapPolylineSets[set_n].explode};
	{/section}
{/if}


//]]></script>
