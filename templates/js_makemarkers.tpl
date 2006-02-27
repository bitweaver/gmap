<script type="text/javascript">//<![CDATA[

var bMData = new Array();
{if count($gContent->mMapMarkers) > 0}
	{section name=marker_n loop=$gContent->mMapMarkers}
		bMData[{$smarty.section.marker_n.index}] = new Array();
		bMData[{$smarty.section.marker_n.index}].marker_id = {$gContent->mMapMarkers[marker_n].marker_id};
		bMData[{$smarty.section.marker_n.index}].marker_type = {$gContent->mMapMarkers[marker_n].marker_type};
		bMData[{$smarty.section.marker_n.index}].title = "{$gContent->mMapMarkers[marker_n].title}";
		bMData[{$smarty.section.marker_n.index}].lat = {$gContent->mMapMarkers[marker_n].lat};
		bMData[{$smarty.section.marker_n.index}].lon = {$gContent->mMapMarkers[marker_n].lon};
		bMData[{$smarty.section.marker_n.index}].data = '{$gContent->mMapMarkers[marker_n].data}';
		bMData[{$smarty.section.marker_n.index}].parsed_data = '{$gContent->mMapMarkers[marker_n].parsed_data}';
		bMData[{$smarty.section.marker_n.index}].label_data = '{$gContent->mMapMarkers[marker_n].label_data}';
		bMData[{$smarty.section.marker_n.index}].photo_url = '{$gContent->mMapMarkers[marker_n].photo_url}';
		{if $gContent->mMapMarkers[marker_n].zindex != NULL}
			bMData[{$smarty.section.marker_n.index}].zindex = {$gContent->mMapMarkers[marker_n].zindex};
		{/if}
		bMData[{$smarty.section.marker_n.index}].set_id = {$gContent->mMapMarkers[marker_n].set_id};
		bMData[{$smarty.section.marker_n.index}].style_id = {$gContent->mMapMarkers[marker_n].style_id};
		bMData[{$smarty.section.marker_n.index}].icon_id = {$gContent->mMapMarkers[marker_n].icon_id};
		bMData[{$smarty.section.marker_n.index}].array_n = {$smarty.section.marker_n.index};
		bMData[{$smarty.section.marker_n.index}].plot_on_load = {$gContent->mMapMarkers[marker_n].plot_on_load};
		bMData[{$smarty.section.marker_n.index}].side_panel = {$gContent->mMapMarkers[marker_n].side_panel};
		bMData[{$smarty.section.marker_n.index}].explode = {$gContent->mMapMarkers[marker_n].explode};
		bMData[{$smarty.section.marker_n.index}].cluster = {$gContent->mMapMarkers[marker_n].cluster};
	{/section}
{/if}


var bMSetData = new Array();
{if count($gContent->mMapMarkerSets) > 0}
	{section name=markersetdata loop=$gContent->mMapMarkerSets}
		bMSetData[{$smarty.section.markersetdata.index}] = new Array();
		bMSetData[{$smarty.section.markersetdata.index}].set_id = {$gContent->mMapMarkerSets[markersetdata].set_id};
		bMSetData[{$smarty.section.markersetdata.index}].name = "{$gContent->mMapMarkerSets[markersetdata].name}";
		bMSetData[{$smarty.section.markersetdata.index}].description = "{$gContent->mMapMarkerSets[markersetdata].description}";
		bMSetData[{$smarty.section.markersetdata.index}].style_id = {$gContent->mMapMarkerSets[markersetdata].style_id};
		bMSetData[{$smarty.section.markersetdata.index}].icon_id = {$gContent->mMapMarkerSets[markersetdata].icon_id};
		bMSetData[{$smarty.section.markersetdata.index}].set_type = "{$gContent->mMapMarkerSets[markersetdata].set_type}";
		bMSetData[{$smarty.section.markersetdata.index}].plot_on_load = {$gContent->mMapMarkerSets[markersetdata].plot_on_load};
		bMSetData[{$smarty.section.markersetdata.index}].side_panel = {$gContent->mMapMarkerSets[markersetdata].side_panel};
		bMSetData[{$smarty.section.markersetdata.index}].explode = {$gContent->mMapMarkerSets[markersetdata].explode};
		bMSetData[{$smarty.section.markersetdata.index}].cluster = {$gContent->mMapMarkerSets[markersetdata].cluster};
	{/section}
{/if}

var bMStyleData = new Array();
{if count($gContent->mMapMarkerStyles) > 0}
	{section name=markerstyledata loop=$gContent->mMapMarkerStyles}
		bMStyleData[{$smarty.section.markerstyledata.index}] = new Array();
		bMStyleData[{$smarty.section.markerstyledata.index}].style_id = {$gContent->mMapMarkerStyles[markerstyledata].style_id};
		bMStyleData[{$smarty.section.markerstyledata.index}].name = "{$gContent->mMapMarkerStyles[markerstyledata].name}";
		bMStyleData[{$smarty.section.markerstyledata.index}].marker_style_type = {$gContent->mMapMarkerStyles[markerstyledata].marker_style_type};
		bMStyleData[{$smarty.section.markerstyledata.index}].label_hover_opacity = {$gContent->mMapMarkerStyles[markerstyledata].label_hover_opacity};
		bMStyleData[{$smarty.section.markerstyledata.index}].label_opacity = {$gContent->mMapMarkerStyles[markerstyledata].label_opacity};
		bMStyleData[{$smarty.section.markerstyledata.index}].label_hover_styles = "{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}";
		bMStyleData[{$smarty.section.markerstyledata.index}].window_styles = "{$gContent->mMapMarkerStyles[markerstyledata].window_styles}";
	{/section}
{/if}

var bMIconData = new Array();
{if count($gContent->mMapIconStyles) > 0}
	{section name=markericondata loop=$gContent->mMapIconStyles}
		bMIconData[{$smarty.section.markericondata.index}] = new Array();
		bMIconData[{$smarty.section.markericondata.index}].icon_id = {$gContent->mMapIconStyles[markericondata].icon_id};
		bMIconData[{$smarty.section.markericondata.index}].name = "{$gContent->mMapIconStyles[markericondata].name}";
		bMIconData[{$smarty.section.markericondata.index}].icon_style_type = {$gContent->mMapIconStyles[markericondata].icon_style_type};
		bMIconData[{$smarty.section.markericondata.index}].image = "{$gContent->mMapIconStyles[markericondata].image}";
		bMIconData[{$smarty.section.markericondata.index}].rollover_image = "{$gContent->mMapIconStyles[markericondata].rollover_image}";
		bMIconData[{$smarty.section.markericondata.index}].print_image = "{$gContent->mMapIconStyles[markericondata].print_image}";
		bMIconData[{$smarty.section.markericondata.index}].moz_print_image = "{$gContent->mMapIconStyles[markericondata].moz_print_image}";
		bMIconData[{$smarty.section.markericondata.index}].transparent = "{$gContent->mMapIconStyles[markericondata].transparent}";
		bMIconData[{$smarty.section.markericondata.index}].shadow_image = "{$gContent->mMapIconStyles[markericondata].shadow_image}";
		bMIconData[{$smarty.section.markericondata.index}].print_shadow = "{$gContent->mMapIconStyles[markericondata].print_shadow}";
		bMIconData[{$smarty.section.markericondata.index}].icon_w = {$gContent->mMapIconStyles[markericondata].icon_w};
		bMIconData[{$smarty.section.markericondata.index}].icon_h = {$gContent->mMapIconStyles[markericondata].icon_h};
		bMIconData[{$smarty.section.markericondata.index}].shadow_w = {$gContent->mMapIconStyles[markericondata].shadow_w};
		bMIconData[{$smarty.section.markericondata.index}].shadow_h = {$gContent->mMapIconStyles[markericondata].shadow_h};
		bMIconData[{$smarty.section.markericondata.index}].icon_anchor_x = {$gContent->mMapIconStyles[markericondata].icon_anchor_x};
		bMIconData[{$smarty.section.markericondata.index}].icon_anchor_y = {$gContent->mMapIconStyles[markericondata].icon_anchor_y};
		bMIconData[{$smarty.section.markericondata.index}].shadow_anchor_x = {$gContent->mMapIconStyles[markericondata].shadow_anchor_x};
		bMIconData[{$smarty.section.markericondata.index}].shadow_anchor_y = {$gContent->mMapIconStyles[markericondata].shadow_anchor_y};
		bMIconData[{$smarty.section.markericondata.index}].infowindow_anchor_x = {$gContent->mMapIconStyles[markericondata].infowindow_anchor_x};
		bMIconData[{$smarty.section.markericondata.index}].infowindow_anchor_y = {$gContent->mMapIconStyles[markericondata].infowindow_anchor_y};
		{* bMIconData[{$smarty.section.markericondata.index}].image_map = {$gContent->mMapIconStyles[markericondata].image_map}; *}
		bMIconData[{$smarty.section.markericondata.index}].points = "{$gContent->mMapIconStyles[markericondata].points}";
		bMIconData[{$smarty.section.markericondata.index}].scale = {$gContent->mMapIconStyles[markericondata].scale};
		bMIconData[{$smarty.section.markericondata.index}].outline_color = "{$gContent->mMapIconStyles[markericondata].outline_color}";
		bMIconData[{$smarty.section.markericondata.index}].outline_weight = {$gContent->mMapIconStyles[markericondata].outline_weight};
		bMIconData[{$smarty.section.markericondata.index}].fill_color = "{$gContent->mMapIconStyles[markericondata].fill_color}";
		bMIconData[{$smarty.section.markericondata.index}].fill_opacity = {$gContent->mMapIconStyles[markericondata].fill_opacity};
	{/section}
{/if}

//]]></script>
