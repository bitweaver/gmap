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

//]]></script>
