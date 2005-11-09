<script type="text/javascript">
//<![CDATA[

{if count($gContent->mMapInitMarkers) > 0}
var bIMData = new Array();
{section name=initmarkers loop=$gContent->mMapInitMarkers}
bIMData[{$smarty.section.initmarkers.index}] = new Array();
bIMData[{$smarty.section.initmarkers.index}].marker_id = {$gContent->mMapInitMarkers[initmarkers].marker_id};
bIMData[{$smarty.section.initmarkers.index}].name = "{$gContent->mMapInitMarkers[initmarkers].name}";
bIMData[{$smarty.section.initmarkers.index}].lat = {$gContent->mMapInitMarkers[initmarkers].lat};
bIMData[{$smarty.section.initmarkers.index}].lon = {$gContent->mMapInitMarkers[initmarkers].lon};
bIMData[{$smarty.section.initmarkers.index}].window_data = "{$gContent->mMapInitMarkers[initmarkers].window_data}";
bIMData[{$smarty.section.initmarkers.index}].label_data = "{$gContent->mMapInitMarkers[initmarkers].label_data}";
bIMData[{$smarty.section.initmarkers.index}].set_id = {$gContent->mMapInitMarkers[initmarkers].set_id};
bIMData[{$smarty.section.initmarkers.index}].set_id = {$gContent->mMapInitMarkers[initmarkers].style_id};
bIMData[{$smarty.section.initmarkers.index}].set_id = {$gContent->mMapInitMarkers[initmarkers].icon_id};
{if $gContent->mMapInitMarkers[initmarkers].zindex != NULL}
bIMData[{$smarty.section.initmarkers.index}].zindex = {$gContent->mMapInitMarkers[initmarkers].zindex};
{/if}
{/section}
{/if}

{if count($gContent->mMapSetMarkers) > 0}
var bSMData = new Array();
{section name=setmarkers loop=$gContent->mMapSetMarkers}
bSMData[{$smarty.section.setmarkers.index}] = new Array();
bSMData[{$smarty.section.setmarkers.index}].marker_id = {$gContent->mMapSetMarkers[setmarkers].marker_id};
bSMData[{$smarty.section.setmarkers.index}].name = "{$gContent->mMapSetMarkers[setmarkers].name}";
bSMData[{$smarty.section.setmarkers.index}].lat = {$gContent->mMapSetMarkers[setmarkers].lat};
bSMData[{$smarty.section.setmarkers.index}].lon = {$gContent->mMapSetMarkers[setmarkers].lon};
bSMData[{$smarty.section.setmarkers.index}].window_data = "{$gContent->mMapSetMarkers[setmarkers].window_data}";
bSMData[{$smarty.section.setmarkers.index}].label_data = "{$gContent->mMapSetMarkers[setmarkers].label_data}";
bSMData[{$smarty.section.setmarkers.index}].set_id = {$gContent->mMapSetMarkers[setmarkers].set_id};
bSMData[{$smarty.section.setmarkers.index}].set_id = {$gContent->mMapSetMarkers[setmarkers].style_id};
bSMData[{$smarty.section.setmarkers.index}].set_id = {$gContent->mMapSetMarkers[setmarkers].icon_id};
{if $gContent->mMapSetMarkers[setmarkers].zindex != NULL}
bSMData[{$smarty.section.setmarkers.index}].zindex = {$gContent->mMapSetMarkers[setmarkers].zindex};
{/if}
{/section}
{/if}



// Create a variable with properties for a Marker
function createMarker(mypoint, mytext) {ldelim}
		// Create marker at location using specified icon
    var marker = new GMarker(mypoint);
   	// Add text to marker
    var html = mytext;
    // Add the click function
    GEvent.addListener(marker, "click", function(){ldelim}
			marker.openInfoWindowHtml(html);
     {rdelim});
    return marker;
{rdelim};



//]]>		
</script>