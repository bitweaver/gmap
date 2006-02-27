<script type="text/javascript">//<![CDATA[

var bPData = new Array();
{if count($gContent->mMapPolygons) > 0}
	{section name=polygon_n loop=$gContent->mMapPolygons}
		bPData[{$smarty.section.polygon_n.index}] = new Array();
		bPData[{$smarty.section.polygon_n.index}].polygon_id = {$gContent->mMapPolygons[polygon_n].polygon_id};
		bPData[{$smarty.section.polygon_n.index}].user_id = {$gContent->mMapPolygons[polygon_n].user_id};
		bPData[{$smarty.section.polygon_n.index}].modifier_user_id = {$gContent->mMapPolygons[polygon_n].modifier_user_id};
		bPData[{$smarty.section.polygon_n.index}].created = {$gContent->mMapPolygons[polygon_n].created};
		bPData[{$smarty.section.polygon_n.index}].last_modified = {$gContent->mMapPolygons[polygon_n].last_modified};
		bPData[{$smarty.section.polygon_n.index}].version = {$gContent->mMapPolygons[polygon_n].version};
		bPData[{$smarty.section.polygon_n.index}].name = "{$gContent->mMapPolygons[polygon_n].name}";
		bPData[{$smarty.section.polygon_n.index}].circle = {$gContent->mMapPolygons[polygon_n].circle};
		bPData[{$smarty.section.polygon_n.index}].points_data = new Array();
		bPData[{$smarty.section.polygon_n.index}].points_data = [{$gContent->mMapPolygons[polygon_n].points_data}];
		bPData[{$smarty.section.polygon_n.index}].circle_center = new Array();
		bPData[{$smarty.section.polygon_n.index}].circle_center = [{$gContent->mMapPolygons[polygon_n].circle_center}];
		{if $gContent->mMapPolygons[polygon_n].radius != NULL}
			bPData[{$smarty.section.polygon_n.index}].radius = {$gContent->mMapPolygons[polygon_n].radius};
		{/if}
		bPData[{$smarty.section.polygon_n.index}].border_text = "{$gContent->mMapPolygons[polygon_n].border_text}";
		{if $gContent->mMapPolygons[polygon_n].zindex != NULL}
			bPData[{$smarty.section.polygon_n.index}].zindex = {$gContent->mMapPolygons[polygon_n].zindex};
		{/if}
		bPData[{$smarty.section.polygon_n.index}].set_id = {$gContent->mMapPolygons[polygon_n].set_id};
		bPData[{$smarty.section.polygon_n.index}].style_id = {$gContent->mMapPolygons[polygon_n].style_id};
		bPData[{$smarty.section.polygon_n.index}].polylinestyle_id = {$gContent->mMapPolygons[polygon_n].polylinestyle_id};
		bPData[{$smarty.section.polygon_n.index}].array_n = {$smarty.section.polygon_n.index};
		bPData[{$smarty.section.polygon_n.index}].plot_on_load = {$gContent->mMapPolygons[polygon_n].plot_on_load};
		bPData[{$smarty.section.polygon_n.index}].side_panel = {$gContent->mMapPolygons[polygon_n].side_panel};
		bPData[{$smarty.section.polygon_n.index}].explode = {$gContent->mMapPolygons[polygon_n].explode};
	{/section}
{/if}


var bPStyData = new Array();
{if count($gContent->mMapPolygonStyles) > 0 }
	{section name=style_n loop=$gContent->mMapPolygonStyles}
		bPStyData[{$smarty.section.style_n.index}] = new Array();
		bPStyData[{$smarty.section.style_n.index}].style_id = {$gContent->mMapPolygonStyles[style_n].style_id};
		bPStyData[{$smarty.section.style_n.index}].name = "{$gContent->mMapPolygonStyles[style_n].name}";
		bPStyData[{$smarty.section.style_n.index}].polygon_style_type = {$gContent->mMapPolygonStyles[style_n].polygon_style_type};
		bPStyData[{$smarty.section.style_n.index}].color = "{$gContent->mMapPolygonStyles[style_n].color}";
		bPStyData[{$smarty.section.style_n.index}].weight = {$gContent->mMapPolygonStyles[style_n].weight};
		bPStyData[{$smarty.section.style_n.index}].opacity = {$gContent->mMapPolygonStyles[style_n].opacity};
	{/section}
{/if}


var bPSetData = new Array();
{if count($gContent->mMapPolygonSets) > 0}
	{section name=set_n loop=$gContent->mMapPolygonSets}
		bPSetData[{$smarty.section.set_n.index}] = new Array();
		bPSetData[{$smarty.section.set_n.index}].set_id = {$gContent->mMapPolygonSets[set_n].set_id};
		bPSetData[{$smarty.section.set_n.index}].name = "{$gContent->mMapPolygonSets[set_n].name}";
		bPSetData[{$smarty.section.set_n.index}].description = "{$gContent->mMapPolygonSets[set_n].description}";
		bPSetData[{$smarty.section.set_n.index}].style_id = {$gContent->mMapPolygonSets[set_n].style_id};
		bPSetData[{$smarty.section.set_n.index}].polylinestyle_id = {$gContent->mMapPolygonSets[set_n].polylinestyle_id};
		bPSetData[{$smarty.section.set_n.index}].plot_on_load = {$gContent->mMapPolygonSets[set_n].plot_on_load};
		bPSetData[{$smarty.section.set_n.index}].side_panel = {$gContent->mMapPolygonSets[set_n].side_panel};
		bPSetData[{$smarty.section.set_n.index}].explode = {$gContent->mMapPolygonSets[set_n].explode};
	{/section}
{/if}


//]]></script>
