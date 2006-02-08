<script type="text/javascript">//<![CDATA[

var bIPData = new Array();
{if count($gContent->mMapInitPolygons) > 0}
	{section name=initpolygons loop=$gContent->mMapInitPolygons}
		bIPData[{$smarty.section.initpolygons.index}] = new Array();
		bIPData[{$smarty.section.initpolygons.index}].polygon_id = {$gContent->mMapInitPolygons[initpolygons].polygon_id};
		bIPData[{$smarty.section.initpolygons.index}].user_id = {$gContent->mMapInitPolygons[initpolygons].user_id};
		bIPData[{$smarty.section.initpolygons.index}].modifier_user_id = {$gContent->mMapInitPolygons[initpolygons].modifier_user_id};
		bIPData[{$smarty.section.initpolygons.index}].created = {$gContent->mMapInitPolygons[initpolygons].created};
		bIPData[{$smarty.section.initpolygons.index}].last_modified = {$gContent->mMapInitPolygons[initpolygons].last_modified};
		bIPData[{$smarty.section.initpolygons.index}].version = {$gContent->mMapInitPolygons[initpolygons].version};
		bIPData[{$smarty.section.initpolygons.index}].name = "{$gContent->mMapInitPolygons[initpolygons].name}";
		bIPData[{$smarty.section.initpolygons.index}].circle = {$gContent->mMapInitPolygons[initpolygons].circle};
		bIPData[{$smarty.section.initpolygons.index}].points_data = new Array();
		bIPData[{$smarty.section.initpolygons.index}].points_data = [{$gContent->mMapInitPolygons[initpolygons].points_data}];
		bIPData[{$smarty.section.initpolygons.index}].circle_center = new Array();
		bIPData[{$smarty.section.initpolygons.index}].circle_center = [{$gContent->mMapInitPolygons[initpolygons].circle_center}];
		{if $gContent->mMapInitPolygons[initpolygons].radius != NULL}
			bIPData[{$smarty.section.initpolygons.index}].radius = {$gContent->mMapInitPolygons[initpolygons].radius};
		{/if}
		bIPData[{$smarty.section.initpolygons.index}].border_text = "{$gContent->mMapInitPolygons[initpolygons].border_text}";
		{if $gContent->mMapInitPolygons[initpolygons].zindex != NULL}
			bIPData[{$smarty.section.initpolygons.index}].zindex = {$gContent->mMapInitPolygons[initpolygons].zindex};
		{/if}
		bIPData[{$smarty.section.initpolygons.index}].set_id = {$gContent->mMapInitPolygons[initpolygons].set_id};
		bIPData[{$smarty.section.initpolygons.index}].style_id = {$gContent->mMapInitPolygons[initpolygons].style_id};
		bIPData[{$smarty.section.initpolygons.index}].polylinestyle_id = {$gContent->mMapInitPolygons[initpolygons].polylinestyle_id};
		bIPData[{$smarty.section.initpolygons.index}].array = "I";
		bIPData[{$smarty.section.initpolygons.index}].array_n = {$smarty.section.initpolygons.index};
	{/section}
{/if}

var bSPData = new Array();
{if count($gContent->mMapSetPolygons) > 0}
	{section name=setpolygons loop=$gContent->mMapSetPolygons}
		bSPData[{$smarty.section.setpolygons.index}] = new Array();
		bSPData[{$smarty.section.setpolygons.index}].polygon_id = {$gContent->mMapSetPolygons[setpolygons].polygon_id};
		bSPData[{$smarty.section.setpolygons.index}].user_id = {$gContent->mMapSetPolygons[setpolygons].user_id};
		bSPData[{$smarty.section.setpolygons.index}].modifier_user_id = {$gContent->mMapSetPolygons[setpolygons].modifier_user_id};
		bSPData[{$smarty.section.setpolygons.index}].created = {$gContent->mMapSetPolygons[setpolygons].created};
		bSPData[{$smarty.section.setpolygons.index}].last_modified = {$gContent->mMapSetPolygons[setpolygons].last_modified};
		bSPData[{$smarty.section.setpolygons.index}].version = {$gContent->mMapSetPolygons[setpolygons].version};
		bSPData[{$smarty.section.setpolygons.index}].name = "{$gContent->mMapSetPolygons[setpolygons].name}";
		bSPData[{$smarty.section.setpolygons.index}].circle = {$gContent->mMapSetPolygons[setpolygons].circle};
		bSPData[{$smarty.section.setpolygons.index}].points_data = new Array();
		bSPData[{$smarty.section.setpolygons.index}].points_data = [{$gContent->mMapSetPolygons[setpolygons].points_data}];
		bSPData[{$smarty.section.setpolygons.index}].circle_center = new Array();
		bSPData[{$smarty.section.setpolygons.index}].circle_center = [{$gContent->mMapSetPolygons[setpolygons].circle_center}];
		{if $gContent->mMapInitPolygons[setpolygons].radius != NULL}
			bSPData[{$smarty.section.setpolygons.index}].radius = {$gContent->mMapSetPolygons[setpolygons].radius};
		{/if}
		bSPData[{$smarty.section.setpolygons.index}].border_text = "{$gContent->mMapSetPolygons[setpolygons].border_text}";
		{if $gContent->mMapSetPolygons[setpolygons].zindex != NULL}
			bSPData[{$smarty.section.setpolygons.index}].zindex = {$gContent->mMapSetPolygons[setpolygons].zindex};
		{/if}
		bSPData[{$smarty.section.setpolygons.index}].set_id = {$gContent->mMapSetPolygons[setpolygons].set_id};
		bSPData[{$smarty.section.setpolygons.index}].style_id = {$gContent->mMapSetPolygons[setpolygons].style_id};
		bSPData[{$smarty.section.setpolygons.index}].polylinestyle_id = {$gContent->mMapSetPolygons[setpolygons].polylinestyle_id};
		bSPData[{$smarty.section.setpolygons.index}].array = "S";
		bSPData[{$smarty.section.setpolygons.index}].array_n = {$smarty.section.setpolygons.index};
	{/section}
{/if}


var bPStyData = new Array();
{if count($gContent->mMapInitPolygons) > 0 || count($gContent->mMapSetPolygons) > 0}
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
