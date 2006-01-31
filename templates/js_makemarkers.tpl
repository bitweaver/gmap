<script type="text/javascript">//<![CDATA[

var bIMData = new Array();
{if count($gContent->mMapInitMarkers) > 0}
	{section name=initmarkers loop=$gContent->mMapInitMarkers}
		bIMData[{$smarty.section.initmarkers.index}] = new Array();
		bIMData[{$smarty.section.initmarkers.index}].marker_id = {$gContent->mMapInitMarkers[initmarkers].marker_id};
		bIMData[{$smarty.section.initmarkers.index}].title = "{$gContent->mMapInitMarkers[initmarkers].title}";
		bIMData[{$smarty.section.initmarkers.index}].lat = {$gContent->mMapInitMarkers[initmarkers].lat};
		bIMData[{$smarty.section.initmarkers.index}].lon = {$gContent->mMapInitMarkers[initmarkers].lon};
		bIMData[{$smarty.section.initmarkers.index}].data = "{$gContent->mMapInitMarkers[initmarkers].data}";
		bIMData[{$smarty.section.initmarkers.index}].label_data = "{$gContent->mMapInitMarkers[initmarkers].label_data}";
		bIMData[{$smarty.section.initmarkers.index}].set_id = {$gContent->mMapInitMarkers[initmarkers].set_id};
		bIMData[{$smarty.section.initmarkers.index}].style_id = {$gContent->mMapInitMarkers[initmarkers].style_id};
		bIMData[{$smarty.section.initmarkers.index}].icon_id = {$gContent->mMapInitMarkers[initmarkers].icon_id};
		{if $gContent->mMapInitMarkers[initmarkers].zindex != NULL}
			bIMData[{$smarty.section.initmarkers.index}].zindex = {$gContent->mMapInitMarkers[initmarkers].zindex};
		{/if}
		bIMData[{$smarty.section.initmarkers.index}].array = "I";
		bIMData[{$smarty.section.initmarkers.index}].array_n = {$smarty.section.initmarkers.index};
	{/section}
{/if}

var bSMData = new Array();
{if count($gContent->mMapSetMarkers) > 0}
	{section name=setmarkers loop=$gContent->mMapSetMarkers}
		bSMData[{$smarty.section.setmarkers.index}] = new Array();
		bSMData[{$smarty.section.setmarkers.index}].marker_id = {$gContent->mMapSetMarkers[setmarkers].marker_id};
		bSMData[{$smarty.section.setmarkers.index}].title = "{$gContent->mMapSetMarkers[setmarkers].title}";
		bSMData[{$smarty.section.setmarkers.index}].lat = {$gContent->mMapSetMarkers[setmarkers].lat};
		bSMData[{$smarty.section.setmarkers.index}].lon = {$gContent->mMapSetMarkers[setmarkers].lon};
		bSMData[{$smarty.section.setmarkers.index}].data = "{$gContent->mMapSetMarkers[setmarkers].data}";
		bSMData[{$smarty.section.setmarkers.index}].label_data = "{$gContent->mMapSetMarkers[setmarkers].label_data}";
		bSMData[{$smarty.section.setmarkers.index}].set_id = {$gContent->mMapSetMarkers[setmarkers].set_id};
		bSMData[{$smarty.section.setmarkers.index}].style_id = {$gContent->mMapSetMarkers[setmarkers].style_id};
		bSMData[{$smarty.section.setmarkers.index}].icon_id = {$gContent->mMapSetMarkers[setmarkers].icon_id};
		{if $gContent->mMapSetMarkers[setmarkers].zindex != NULL}
			bSMData[{$smarty.section.setmarkers.index}].zindex = {$gContent->mMapSetMarkers[setmarkers].zindex};
		{/if}
		bSMData[{$smarty.section.setmarkers.index}].array = "S";
		bSMData[{$smarty.section.setmarkers.index}].array_n = {$smarty.section.setmarkers.index};
	{/section}
{/if}

var bMSetData = new Array();
{if count($gContent->mMapMarkerSetDetails) > 0}
	{section name=markersetdata loop=$gContent->mMapMarkerSetDetails}
		bMSetData[{$smarty.section.markersetdata.index}] = new Array();
		bMSetData[{$smarty.section.markersetdata.index}].set_id = {$gContent->mMapMarkerSetDetails[markersetdata].set_id};
		bMSetData[{$smarty.section.markersetdata.index}].name = "{$gContent->mMapMarkerSetDetails[markersetdata].name}";
		bMSetData[{$smarty.section.markersetdata.index}].description = "{$gContent->mMapMarkerSetDetails[markersetdata].description}";
		bMSetData[{$smarty.section.markersetdata.index}].style_id = {$gContent->mMapMarkerSetDetails[markersetdata].style_id};
		bMSetData[{$smarty.section.markersetdata.index}].icon_id = {$gContent->mMapMarkerSetDetails[markersetdata].icon_id};
		bMSetData[{$smarty.section.markersetdata.index}].set_type = "{$gContent->mMapMarkerSetDetails[markersetdata].set_type}";
	{/section}
{/if}

var bMStyleData = new Array();
{if count($gContent->mMapMarkerStyles) > 0}
	{section name=markerstyledata loop=$gContent->mMapMarkerStyles}
		bMStyleData[{$smarty.section.markerstyledata.index}] = new Array();
		bMStyleData[{$smarty.section.markerstyledata.index}].style_id = {$gContent->mMapMarkerStyles[markerstyledata].style_id};
		bMStyleData[{$smarty.section.markerstyledata.index}].name = "{$gContent->mMapMarkerStyles[markerstyledata].name}";
		bMStyleData[{$smarty.section.markerstyledata.index}].type = {$gContent->mMapMarkerStyles[markerstyledata].type};
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
		bMIconData[{$smarty.section.markericondata.index}].type = {$gContent->mMapIconStyles[markericondata].type};
		bMIconData[{$smarty.section.markericondata.index}].image = "{$gContent->mMapIconStyles[markericondata].image}";
		bMIconData[{$smarty.section.markericondata.index}].print_image = "{$gContent->mMapIconStyles[markericondata].print_image}";
		bMIconData[{$smarty.section.markericondata.index}].moz_print_image = "{$gContent->mMapIconStyles[markericondata].moz_print_image}";
		bMIconData[{$smarty.section.markericondata.index}].transparent = "{$gContent->mMapIconStyles[markericondata].transparent}";
		bMIconData[{$smarty.section.markericondata.index}].shadow_image = "{$gContent->mMapIconStyles[markericondata].shadow_image}";
		bMIconData[{$smarty.section.markericondata.index}].print_shadow = "{$gContent->mMapIconStyles[markericondata].print_shadow}";
		bMIconData[{$smarty.section.markericondata.index}].image_map = {$gContent->mMapIconStyles[markericondata].image_map};
		bMIconData[{$smarty.section.markericondata.index}].icon_w = {$gContent->mMapIconStyles[markericondata].icon_w};
		bMIconData[{$smarty.section.markericondata.index}].icon_h = {$gContent->mMapIconStyles[markericondata].icon_h};
		bMIconData[{$smarty.section.markericondata.index}].shadow_w = {$gContent->mMapIconStyles[markericondata].shadow_w};
		bMIconData[{$smarty.section.markericondata.index}].shadow_h = {$gContent->mMapIconStyles[markericondata].shadow_h};
		bMIconData[{$smarty.section.markericondata.index}].rollover_image = "{$gContent->mMapIconStyles[markericondata].rollover_image}";
		bMIconData[{$smarty.section.markericondata.index}].icon_anchor_x = {$gContent->mMapIconStyles[markericondata].icon_anchor_x};
		bMIconData[{$smarty.section.markericondata.index}].icon_anchor_y = {$gContent->mMapIconStyles[markericondata].icon_anchor_y};
		bMIconData[{$smarty.section.markericondata.index}].infowindow_anchor_x = {$gContent->mMapIconStyles[markericondata].infowindow_anchor_x};
		bMIconData[{$smarty.section.markericondata.index}].infowindow_anchor_y = {$gContent->mMapIconStyles[markericondata].infowindow_anchor_x};
	{/section}
{/if}

//]]></script>
