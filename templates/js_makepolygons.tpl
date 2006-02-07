<script type="text/javascript">//<![CDATA[

var bIPData = new Array();
{if count($gContent->mMapInitPolygons) > 0}
	{section name=initpolylines loop=$gContent->mMapInitPolygons}
		bIPData[{$smarty.section.initpolylines.index}] = new Array();
		bIPData[{$smarty.section.initpolylines.index}].polyline_id = {$gContent->mMapInitPolygons[initpolylines].polyline_id};
		bIPData[{$smarty.section.initpolylines.index}].user_id = {$gContent->mMapInitPolygons[initpolylines].user_id};
		bIPData[{$smarty.section.initpolylines.index}].modifier_user_id = {$gContent->mMapInitPolygons[initpolylines].modifier_user_id};
		bIPData[{$smarty.section.initpolylines.index}].created = {$gContent->mMapInitPolygons[initpolylines].created};
		bIPData[{$smarty.section.initpolylines.index}].last_modified = {$gContent->mMapInitPolygons[initpolylines].last_modified};
		bIPData[{$smarty.section.initpolylines.index}].version = {$gContent->mMapInitPolygons[initpolylines].version};
		bIPData[{$smarty.section.initpolylines.index}].name = "{$gContent->mMapInitPolygons[initpolylines].name}";
		bIPData[{$smarty.section.initpolylines.index}].circle = {$gContent->mMapInitPolygons[initpolylines].circle};
		bIPData[{$smarty.section.initpolylines.index}].points_data = new Array();
		bIPData[{$smarty.section.initpolylines.index}].points_data = [{$gContent->mMapInitPolygons[initpolylines].points_data}];
		bIPData[{$smarty.section.initpolylines.index}].circle_center = new Array();
		bIPData[{$smarty.section.initpolylines.index}].circle_center = [{$gContent->mMapInitPolygons[initpolylines].circle_center}];
		bIPData[{$smarty.section.initpolylines.index}].radius = {$gContent->mMapInitPolygons[initpolylines].radius};
		bIPData[{$smarty.section.initpolylines.index}].border_text = "{$gContent->mMapInitPolygons[initpolylines].border_text}";
		{if $gContent->mMapInitPolygons[initpolylines].zindex != NULL}
			bIPData[{$smarty.section.initpolylines.index}].zindex = {$gContent->mMapInitPolygons[initpolylines].zindex};
		{/if}
	{/section}
{/if}

var bSPData = new Array();
{if count($gContent->mMapSetPolygons) > 0}
	{section name=setpolygons loop=$gContent->mMapSetPolylines}
		bSPData[{$smarty.section.setpolygons.index}] = new Array();
		bSPData[{$smarty.section.setpolygons.index}].polyline_id = {$gContent->mMapSetPolylines[setpolygons].polyline_id};
		bSPData[{$smarty.section.setpolygons.index}].user_id = {$gContent->mMapSetPolylines[setpolygons].user_id};
		bSPData[{$smarty.section.setpolygons.index}].modifier_user_id = {$gContent->mMapSetPolylines[setpolygons].modifier_user_id};
		bSPData[{$smarty.section.setpolygons.index}].created = {$gContent->mMapSetPolylines[setpolygons].created};
		bSPData[{$smarty.section.setpolygons.index}].last_modified = {$gContent->mMapSetPolylines[setpolygons].last_modified};
		bSPData[{$smarty.section.setpolygons.index}].version = {$gContent->mMapSetPolylines[setpolygons].version};
		bSPData[{$smarty.section.setpolygons.index}].name = "{$gContent->mMapSetPolylines[setpolygons].name}";
		bSPData[{$smarty.section.setpolygons.index}].circle = {$gContent->mMapSetPolylines[setpolygons].circle};
		bSPData[{$smarty.section.setpolygons.index}].points_data = new Array();
		bSPData[{$smarty.section.setpolygons.index}].points_data = [{$gContent->mMapSetPolylines[setpolygons].points_data}];
		bSPData[{$smarty.section.setpolygons.index}].circle_center = new Array();
		bSPData[{$smarty.section.setpolygons.index}].circle_center = [{$gContent->mMapSetPolylines[setpolygons].circle_center}];
		bSPData[{$smarty.section.setpolygons.index}].radius = {$gContent->mMapSetPolylines[setpolygons].radius};
		bSPData[{$smarty.section.setpolygons.index}].border_text = "{$gContent->mMapSetPolylines[setpolygons].border_text}";
		{if $gContent->mMapSetPolylines[setpolygons].zindex != NULL}
			bSPData[{$smarty.section.setpolygons.index}].zindex = {$gContent->mMapSetPolylines[setpolygons].zindex};
		{/if}
	{/section}
{/if}


var bPStyData = new Array();
{if count($gContent->mMapInitLines) > 0 || count($gContent->mMapSetLines) > 0}
	{section name=polygonstyles loop=$gContent->mMapPolygonsStyles}
		bPStyData[{$smarty.section.polygonstyles.index}] = new Array();
		bPStyData[{$smarty.section.polygonstyles.index}].style_id = {$gContent->mMapPolygonsStyles[polygonstyles].style_id};
		bPStyData[{$smarty.section.polygonstyles.index}].name = "{$gContent->mMapPolygonsStyles[polygonstyles].name}";
		bPStyData[{$smarty.section.polygonstyles.index}].type = {$gContent->mMapPolygonsStyles[polygonstyles].type};
		bPStyData[{$smarty.section.polygonstyles.index}].color = "{$gContent->mMapPolygonsStyles[polygonstyles].color}";
		bPStyData[{$smarty.section.polygonstyles.index}].weight = {$gContent->mMapPolygonsStyles[polygonstyles].weight};
		bPStyData[{$smarty.section.polygonstyles.index}].opacity = {$gContent->mMapPolygonsStyles[polygonstyles].opacity};
	{/section}
{/if}


var bPSetData = new Array();
{if count($gContent->mMapPolygonsSetDetails) > 0}
	{section name=polygonsetdata loop=$gContent->mMapPolygonsSetDetails}
		bPSetData[{$smarty.section.polygonsetdata.index}] = new Array();
		bPSetData[{$smarty.section.polygonsetdata.index}].set_id = {$gContent->mMapPolygonsSetDetails[polygonsetdata].set_id};
		bPSetData[{$smarty.section.polygonsetdata.index}].name = "{$gContent->mMapPolygonsSetDetails[polygonsetdata].name}";
		bPSetData[{$smarty.section.polygonsetdata.index}].description = "{$gContent->mMapPolygonsSetDetails[polygonsetdata].description}";
		bPSetData[{$smarty.section.polygonsetdata.index}].style_id = {$gContent->mMapPolygonsSetDetails[polygonsetdata].style_id};
		bPSetData[{$smarty.section.polygonsetdata.index}].polylinestyle_id = {$gContent->mMapPolygonsSetDetails[polygonsetdata].polylinestyle_id};
		bPSetData[{$smarty.section.polygonsetdata.index}].set_type = "{$gContent->mMapPolygonsSetDetails[polygonsetdata].set_type}";
	{/section}
{/if}


//]]></script>
