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
{if ( count($gContent->mMapPolylineStyles) > 0 ) }
	{section name=linestyles loop=$gContent->mMapPolylineStyles}
		bLStyData[{$smarty.section.linestyles.index}] = new Array();
		bLStyData[{$smarty.section.linestyles.index}].style_id = {$gContent->mMapPolylineStyles[linestyles].style_id};
		bLStyData[{$smarty.section.linestyles.index}].name = "{$gContent->mMapPolylineStyles[linestyles].name}";
		bLStyData[{$smarty.section.linestyles.index}].type = {$gContent->mMapPolylineStyles[linestyles].type};
		bLStyData[{$smarty.section.linestyles.index}].color = "{$gContent->mMapPolylineStyles[linestyles].color}";
		bLStyData[{$smarty.section.linestyles.index}].weight = {$gContent->mMapPolylineStyles[linestyles].weight};
		bLStyData[{$smarty.section.linestyles.index}].opacity = {$gContent->mMapPolylineStyles[linestyles].opacity};
		bLStyData[{$smarty.section.linestyles.index}].pattern = new Array();
		{if $gContent->mMapPolylineStyles[linestyles].pattern != NULL}
			bLStyData[{$smarty.section.linestyles.index}].pattern = {$gContent->mMapPolylineStyles[linestyles].pattern};
		{/if}
		bLStyData[{$smarty.section.linestyles.index}].segment_count = {$gContent->mMapPolylineStyles[linestyles].segment_count};
		bLStyData[{$smarty.section.linestyles.index}].text_every = {$gContent->mMapPolylineStyles[linestyles].text_every};
		bLStyData[{$smarty.section.linestyles.index}].begin_arrow = {$gContent->mMapPolylineStyles[linestyles].begin_arrow};
		bLStyData[{$smarty.section.linestyles.index}].end_arrow = {$gContent->mMapPolylineStyles[linestyles].end_arrow};
		bLStyData[{$smarty.section.linestyles.index}].arrows_every = {$gContent->mMapPolylineStyles[linestyles].arrows_every};
		bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_color = "{$gContent->mMapPolylineStyles[linestyles].text_fgstyle_color}";
		bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_weight = {$gContent->mMapPolylineStyles[linestyles].text_fgstyle_weight};
		bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_opacity = {$gContent->mMapPolylineStyles[linestyles].text_fgstyle_opacity};
		{if $gContent->mMapPolylineStyles[linestyles].text_fgstyle_zindex != NULL}
			bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_zindex = {$gContent->mMapPolylineStyles[linestyles].text_fgstyle_zindex};
		{/if}
		bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_color = "{$gContent->mMapPolylineStyles[linestyles].text_bgstyle_color}";
		bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_weight = {$gContent->mMapPolylineStyles[linestyles].text_bgstyle_weight};
		bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_opacity = {$gContent->mMapPolylineStyles[linestyles].text_bgstyle_opacity};
		{if $gContent->mMapPolylineStyles[linestyles].text_bgstyle_zindex != NULL}
			bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_zindex = {$gContent->mMapPolylineStyles[linestyles].text_bgstyle_zindex};
		{/if}
	{/section}
{/if}


var bLSetData = new Array();
{if count($gContent->mMapPolylineSets) > 0}
	{section name=polylinesetdata loop=$gContent->mMapPolylineSets}
		bLSetData[{$smarty.section.polylinesetdata.index}] = new Array();
		bLSetData[{$smarty.section.polylinesetdata.index}].set_id = {$gContent->mMapPolylineSets[polylinesetdata].set_id};
		bLSetData[{$smarty.section.polylinesetdata.index}].name = "{$gContent->mMapPolylineSets[polylinesetdata].name}";
		bLSetData[{$smarty.section.polylinesetdata.index}].description = "{$gContent->mMapPolylineSets[polylinesetdata].description}";
		bLSetData[{$smarty.section.polylinesetdata.index}].style_id = {$gContent->mMapPolylineSets[polylinesetdata].style_id};
		bLSetData[{$smarty.section.polylinesetdata.index}].plot_on_load = {$gContent->mMapPolylineSets[polylinesetdata].plot_on_load};
		bLSetData[{$smarty.section.polylinesetdata.index}].side_panel = {$gContent->mMapPolylineSets[polylinesetdata].side_panel};
		bLSetData[{$smarty.section.polylinesetdata.index}].explode = {$gContent->mMapPolylineSets[polylinesetdata].explode};
	{/section}
{/if}


//]]></script>
