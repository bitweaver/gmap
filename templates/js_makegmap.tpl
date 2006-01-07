<script type="text/javascript">//<![CDATA[

// Copy Object Function
function copy_obj(o) {ldelim}var c = new Object(); for (var e in o) {ldelim} c[e] = o[e]; {rdelim} return c;{rdelim}

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
var bMapZoom{if $gContent->mInfo.zoom_level} = {$gContent->mInfo.zoom_level}{/if};
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

	//@todo insert variables for zoomed out tiles path, and hybrid type tiles path
	// Adds all MapTypes, it is called from loadMap()
	function addMapTypes(pParamHash){ldelim}
		for (n=0; n < pParamHash.length; n++) {ldelim}
			var baseid = pParamHash[n].basetype;
			var typename = pParamHash[n].name;
			var result = copy_obj(map.mapTypes[baseid]);
			result.baseUrls = new Array();
			result.baseUrls[0] = pParamHash[n].maptiles_url;
			result.typename = typename;
			result.getLinkText = function() {ldelim} return this.typename; {rdelim};
			bMapTypesData[n].maptype_node = map.mapTypes.length;  //@todo this needs to change to make a universal function - its too specific to the hash
			map.mapTypes[map.mapTypes.length] = result;
			bMapTypes[typename] = result;
		{rdelim}
	{rdelim};
{/if}



function loadMap() {ldelim}
    map = new GMap(document.getElementById('map'));

	bMapTypes['G_MAP_TYPE'] = map.mapTypes[0];
	bMapTypes['G_SATELLITE_TYPE'] = map.mapTypes[1];
	bMapTypes['G_HYBRID_TYPE'] = map.mapTypes[2];

	{if count($gContent->mMapTypes) > 0}
		addMapTypes(bMapTypesData);
		{if $gContent->mInfo.map_type != "G_SATELLITE_TYPE" && $gContent->mInfo.map_type != "G_MAP_TYPE" && $gContent->mInfo.map_type != "G_HYBRID_TYPE" }
				map.setMapType(bMapTypes['{$gContent->mInfo.map_type}']);
		{else}
				map.setMapType({$gContent->mInfo.map_type});
		{/if}
	{else}
		map.setMapType({$gContent->mInfo.map_type});
	{/if}

    typecontrols = new GMapTypeControl();
    scale = new GScaleControl();
    smallcontrols = new GSmallMapControl();
    largecontrols = new GLargeMapControl();
    zoomcontrols = new GSmallZoomControl();

	//Add Map TYPE controls - buttons in the upper right corner
	{if $gContent->mInfo.show_typecontrols eq 'TRUE'}
		map.addControl(typecontrols);
	{/if}

	//Add Scale controls
	{if $gContent->mInfo.show_scale eq 'TRUE'}
		map.addControl(scale);
	{/if}

	//Add Navigation controls - buttons in the upper left corner
	{if $gContent->mInfo.show_controls eq 's'}
		map.addControl(smallcontrols);
	{/if}
	{if $gContent->mInfo.show_controls eq 'l'}
		map.addControl(largecontrols);
	{/if}
	{if $gContent->mInfo.show_controls eq 'z'}
		map.addControl(zoomcontrols);
	{/if}

    map.centerAndZoom(new GPoint(bMapLon, bMapLat), bMapZoom);
		
	//@todo this needs to be more complex and account for all the variety of types and styles
	{if count($gContent->mMapInitMarkers) > 0}
		for(n=0; n<bIMData.length; n++){ldelim}
			var point = new GPoint(parseFloat(bIMData[n].lon), parseFloat(bIMData[n].lat));
				bIMData[n].marker = new GMarker(point);
				bIMData[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+bIMData[n].title+"</strong><p>"+bIMData[n].data+"</p></div>";
				map.addOverlay(bIMData[n].marker);
				//add the marker label if it exists
				if (typeof(bIMData[n].label_data) != 'undefined'){ldelim}
					var topElement = bIMData[n].marker.iconImage;
					if (bIMData[n].marker.transparentIcon) {ldelim}topElement = bIMData[n].marker.transparentIcon;{rdelim}
					if (bIMData[n].marker.imageMap) {ldelim}topElement = bIMData[n].marker.imageMap;{rdelim}
					topElement.setAttribute( "title" , bIMData[n].label_data );
				{rdelim}
		{rdelim};
	{/if}

	{if count($gContent->mMapInitLines) > 0}
		for(n=0; n<bILData.length; n++){ldelim}
			for (s=0; s<bLStyData.length; s++){ldelim}
				if (bLStyData[s].style_id == bILData[n].style_id){ldelim}
					var linecolor = "#"+bLStyData[s].color;
					var lineweight = bLStyData[s].weight;
					var lineopacity = bLStyData[s].opacity;
				{rdelim}
			{rdelim}

			var pointlist = new Array();
			for (p = 0; p < bILData[n].points_data.length; p+=2 ){ldelim}
				var point = new GPoint(
					parseFloat(bILData[n].points_data[p]),
					parseFloat(bILData[n].points_data[p+1])
				);
				pointlist.push(point);
			{rdelim};

			bILData[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
			map.addOverlay(bILData[n].polyline);
		{rdelim};
	{/if}

	//opens any infoWindow when clicked if it has content	my_html
	GEvent.addListener(map, "click", function(overlay, point) {ldelim}
		if (overlay) {ldelim}
			if (overlay.my_html) {ldelim}
				overlay.openInfoWindowHtml(overlay.my_html);
			{rdelim}
		{rdelim}
	{rdelim});
	
{rdelim};

//]]></script>
