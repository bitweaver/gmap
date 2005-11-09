<script type="text/javascript">
//<![CDATA[

{if count($gContent->mMapInitLines) > 0}
var bILData = new Array();
{section name=initlines loop=$gContent->mMapInitLines}
bILData[{$smarty.section.initlines.index}] = new Array();
bILData[{$smarty.section.initlines.index}].polyline_id = {$gContent->mMapInitLines[initlines].polyline_id};
bILData[{$smarty.section.initlines.index}].user_id = {$gContent->mMapInitLines[initlines].user_id};
bILData[{$smarty.section.initlines.index}].modifier_user_id = {$gContent->mMapInitLines[initlines].modifier_user_id};
bILData[{$smarty.section.initlines.index}].created = {$gContent->mMapInitLines[initlines].created};
bILData[{$smarty.section.initlines.index}].last_modified = {$gContent->mMapInitLines[initlines].last_modified};
bILData[{$smarty.section.initlines.index}].version = {$gContent->mMapInitLines[initlines].version};
bILData[{$smarty.section.initlines.index}].name = "{$gContent->mMapInitLines[initlines].name}";
bILData[{$smarty.section.initlines.index}].type = {$gContent->mMapInitLines[initlines].type};
bILData[{$smarty.section.initlines.index}].points_data = new Array();
bILData[{$smarty.section.initlines.index}].points_data = [{$gContent->mMapInitLines[initlines].points_data}];
bILData[{$smarty.section.initlines.index}].border_text = "{$gContent->mMapInitLines[initlines].border_text}";
{if $gContent->mMapInitLines[initlines].zindex != NULL}
bILData[{$smarty.section.initlines.index}].zindex = {$gContent->mMapInitLines[initlines].zindex};
{/if}
bILData[{$smarty.section.initlines.index}].set_id = {$gContent->mMapInitLines[initlines].set_id};
bILData[{$smarty.section.initlines.index}].style_id = {$gContent->mMapInitLines[initlines].style_id};
{/section}
{/if}

{if count($gContent->mMapSetLines) > 0}
var bSLData = new Array();
{section name=setlines loop=$gContent->mMapSetLines}
bSLData[{$smarty.section.setlines.index}] = new Array();
bSLData[{$smarty.section.setlines.index}].polyline_id = {$gContent->mMapSetLines[setlines].polyline_id};
bSLData[{$smarty.section.setlines.index}].user_id = {$gContent->mMapSetLines[setlines].user_id};
bSLData[{$smarty.section.setlines.index}].modifier_user_id = {$gContent->mMapSetLines[setlines].modifier_user_id};
bSLData[{$smarty.section.setlines.index}].created = {$gContent->mMapSetLines[setlines].created};
bSLData[{$smarty.section.setlines.index}].last_modified = {$gContent->mMapSetLines[setlines].last_modified};
bSLData[{$smarty.section.setlines.index}].version = {$gContent->mMapSetLines[setlines].version};
bSLData[{$smarty.section.setlines.index}].name = "{$gContent->mMapSetLines[setlines].name}";
bSLData[{$smarty.section.setlines.index}].type = {$gContent->mMapSetLines[setlines].type};
bSLData[{$smarty.section.setlines.index}].points_data = [{$gContent->mMapSetLines[setlines].points_data}];
bSLData[{$smarty.section.setlines.index}].border_text = "{$gContent->mMapSetLines[setlines].border_text}";
{if $gContent->mMapSetLines[setlines].zindex != NULL}
bSLData[{$smarty.section.setlines.index}].zindex = {$gContent->mMapSetLines[setlines].zindex};
{/if}
bSLData[{$smarty.section.setlines.index}].set_id = {$gContent->mMapSetLines[setlines].set_id};
bSLData[{$smarty.section.setlines.index}].style_id = {$gContent->mMapSetLines[setlines].style_id};
{/section}
{/if}


{if count($gContent->mMapInitLines) > 0 || count($gContent->mMapInitLines) > 0}
var bLStyData = new Array();
{section name=linestyles loop=$gContent->mMapLinesStyles}
bLStyData[{$smarty.section.linestyles.index}] = new Array();
bLStyData[{$smarty.section.linestyles.index}].style_id = {$gContent->mMapLinesStyles[linestyles].style_id};
bLStyData[{$smarty.section.linestyles.index}].name = "{$gContent->mMapLinesStyles[linestyles].name}";
bLStyData[{$smarty.section.linestyles.index}].color = "{$gContent->mMapLinesStyles[linestyles].color}";
bLStyData[{$smarty.section.linestyles.index}].weight = {$gContent->mMapLinesStyles[linestyles].weight};
bLStyData[{$smarty.section.linestyles.index}].opacity = {$gContent->mMapLinesStyles[linestyles].opacity};
bLStyData[{$smarty.section.linestyles.index}].pattern = new Array();
{if $gContent->mMapLinesStyles[linestyles].pattern != NULL}
bLStyData[{$smarty.section.linestyles.index}].pattern = {$gContent->mMapLinesStyles[linestyles].pattern};
{/if}
bLStyData[{$smarty.section.linestyles.index}].opacity = {$gContent->mMapLinesStyles[linestyles].segment_count};
bLStyData[{$smarty.section.linestyles.index}].opacity = {$gContent->mMapLinesStyles[linestyles].begin_arrow};
bLStyData[{$smarty.section.linestyles.index}].opacity = {$gContent->mMapLinesStyles[linestyles].end_arrow};
bLStyData[{$smarty.section.linestyles.index}].opacity = {$gContent->mMapLinesStyles[linestyles].arrows_every};
bLStyData[{$smarty.section.linestyles.index}].opacity = "{$gContent->mMapLinesStyles[linestyles].font}";
bLStyData[{$smarty.section.linestyles.index}].opacity = {$gContent->mMapLinesStyles[linestyles].text_every};
bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_color = "{$gContent->mMapLinesStyles[linestyles].text_fgstyle_color}";
bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_weight = {$gContent->mMapLinesStyles[linestyles].text_fgstyle_weight};
bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_opacity = {$gContent->mMapLinesStyles[linestyles].text_fgstyle_opacity};
{if $gContent->mMapLinesStyles[linestyles].text_fgstyle_zindex != NULL}
bLStyData[{$smarty.section.linestyles.index}].text_fgstyle_zindex = {$gContent->mMapLinesStyles[linestyles].text_fgstyle_zindex};
{/if}
bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_color = "{$gContent->mMapLinesStyles[linestyles].text_bgstyle_color}";
bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_weight = {$gContent->mMapLinesStyles[linestyles].text_bgstyle_weight};
bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_opacity = {$gContent->mMapLinesStyles[linestyles].text_bgstyle_opacity};
{if $gContent->mMapLinesStyles[linestyles].text_bgstyle_zindex != NULL}
bLStyData[{$smarty.section.linestyles.index}].text_bgstyle_zindex = {$gContent->mMapLinesStyles[linestyles].text_bgstyle_zindex};
{/if}
{/section}
{/if}


		
function createPolyline(pParamArray){ldelim}
for (s=0; s<bLStyData.length; s++){ldelim}
		if (bLStyData[s].style_id == pParamArray.style_id){ldelim}
				 var linecolor = "#"+bLStyData[s].color;
				 var lineweight = bLStyData[s].weight;
				 var lineopacity = bLStyData[s].opacity;
		{rdelim}
{rdelim}

				 var pointlist = new Array();
				 for (p = 0; p < pParamArray.points_data.length; p+=2 ){ldelim}
				 		 var point = new GPoint(
						 		 parseFloat(pParamArray.points_data[p]),
								 parseFloat(pParamArray.points_data[p+1])
							);
						 pointlist.push(point);
				 {rdelim};
				 var polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
				 return polyline;
{rdelim}

//]]>		
</script>