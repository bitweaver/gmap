<script type="text/javascript">//<![CDATA[

var map;
var typecontrols;
var scale;
var smallcontrols;
var largecontrols;
var zoomcontrols;

var bMapID{if $gContent->mInfo.gmap_id} = {$gContent->mInfo.gmap_id}{/if};
var bMapTitle = "{$gContent->mInfo.title}";
var bMapDesc = "{$gContent->mInfo.description}";
var bMapWidth{if $gContent->mInfo.width} = {$gContent->mInfo.width}{/if};
var bMapHeight{if $gContent->mInfo.height} = {$gContent->mInfo.height}{/if};
var bMapLat = {$gContent->mInfo.lat};
var bMapLon = {$gContent->mInfo.lon};
var bMapZoom = {$gContent->mInfo.zoom_level};
var bMapScale = "{$gContent->mInfo.show_scale}"; //TRUE or FALSE
var bMapControl = "{$gContent->mInfo.show_controls}"; //s,l,z,n
var bMapTypeCont = "{$gContent->mInfo.show_typecontrols}";//TRUE or FALSE
var bMapType = "{$gContent->mInfo.map_type}";
var bMapTypes = new Array();
var bMapTypesData = new Array();

{if count($gContent->mMapTypes) > 0}
	{section name=maptypes loop=$gContent->mMapTypes}
		bMapTypesData[{$smarty.section.maptypes.index}] = new Array();
		bMapTypesData[{$smarty.section.maptypes.index}].maptype_id = {$gContent->mMapTypes[maptypes].maptype_id};
		bMapTypesData[{$smarty.section.maptypes.index}].name = "{$gContent->mMapTypes[maptypes].name}";
		bMapTypesData[{$smarty.section.maptypes.index}].description = "{$gContent->mMapTypes[maptypes].description}";
		bMapTypesData[{$smarty.section.maptypes.index}].copyright = "{$gContent->mMapTypes[maptypes].copyright}";
		bMapTypesData[{$smarty.section.maptypes.index}].basetype = {$gContent->mMapTypes[maptypes].basetype};
		bMapTypesData[{$smarty.section.maptypes.index}].alttype = {$gContent->mMapTypes[maptypes].alttype};
		bMapTypesData[{$smarty.section.maptypes.index}].maxzoom = {$gContent->mMapTypes[maptypes].maxzoom};
		{if $gContent->mMapTypes[maptypes].maptiles_url != NULL}
			bMapTypesData[{$smarty.section.maptypes.index}].maptiles_url = "{$gContent->mMapTypes[maptypes].maptiles_url}";
		{/if}
		{if $gContent->mMapTypes[maptypes].lowresmaptiles_url != NULL}
			bMapTypesData[{$smarty.section.maptypes.index}].lowresmaptiles_url = "{$gContent->mMapTypes[maptypes].lowresmaptiles_url}";
		{/if}
		{if $gContent->mMapTypes[maptypes].hybridtiles_url != NULL}
			bMapTypesData[{$smarty.section.maptypes.index}].hybridtiles_url = "{$gContent->mMapTypes[maptypes].hybridtiles_url}";
		{/if}
		{if $gContent->mMapTypes[maptypes].lowreshybridtiles_url != NULL}
			bMapTypesData[{$smarty.section.maptypes.index}].lowreshybridtiles_url = "{$gContent->mMapTypes[maptypes].lowreshybridtiles_url}";
		{/if}
	{/section}
{/if}

//]]></script>
