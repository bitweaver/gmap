<script type="text/javascript">//<![CDATA[

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
		bILData[{$smarty.section.initlines.index}].points_data = [{$gContent->mMapInitLines[initlines].points_data}];
		bILData[{$smarty.section.initlines.index}].border_text = "{$gContent->mMapInitLines[initlines].border_text}";
		{if $gContent->mMapInitLines[initlines].zindex != NULL}
			bILData[{$smarty.section.initlines.index}].zindex = {$gContent->mMapInitLines[initlines].zindex};
		{/if}
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
	{/section}
{/if}

//]]></script>
