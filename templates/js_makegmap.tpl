<script type="text/javascript">
//<![CDATA[
var map;
var typecontrols;
var scale;
var smallcontrols;
var largecontrols;
var zoomcontrols;

var bMapID = {$gContent->mMapData.gmap_id};
var bMapWidth = {$gContent->mMapData.width};
var bMapHeight = {$gContent->mMapData.height};
var bMapLat = {$gContent->mMapData.lat};
var bMapLon = {$gContent->mMapData.lon};
var bZoomLevel = {$gContent->mMapData.zoom_level};

var bMapTypes = new Array();


{if count($gContent->mMapTypes) > 0}
var bMapTypesData = new Array();
{section name=maptypes loop=$gContent->mMapTypes}
bMapTypesData[{$smarty.section.maptypes.index}] = new Array();
bMapTypesData[{$smarty.section.maptypes.index}].map_typeid = {$gContent->mMapTypes[maptypes].maptype_id};
bMapTypesData[{$smarty.section.maptypes.index}].map_typename = "{$gContent->mMapTypes[maptypes].name}";
bMapTypesData[{$smarty.section.maptypes.index}].map_typebase = {$gContent->mMapTypes[maptypes].basetype};
{if $gContent->mMapTypes[maptypes].maptiles_url != NULL}
bMapTypesData[{$smarty.section.maptypes.index}].map_typetilesurl = "{$gContent->mMapTypes[maptypes].maptiles_url}";
{/if}
{if $gContent->mMapTypes[maptypes].hybridtiles_url != NULL}
bMapTypesData[{$smarty.section.maptypes.index}].map_typehybridtilesurl = "{$gContent->mMapTypes[maptypes].hybridtiles_url}";
{/if}
{/section}
            
// Copy Object Function
function copy_obj(o) {ldelim}var c = new Object(); for (var e in o) {ldelim} c[e] = o[e]; {rdelim} return c;{rdelim}


//@todo insert variables for zoomed out tiles path, and hybrid type tiles path
// Adds all MapTypes, it is called from loadMap()      
function addMapTypes(pParamHash){ldelim}
	for (n=0; n < pParamHash.length; n++) {ldelim}
		var baseid = pParamHash[n].map_typebase;
		var typeid = pParamHash[n].map_typeid;
		var typename = pParamHash[n].map_typename;
		var result = copy_obj(map.mapTypes[baseid]);
		result.baseUrls = new Array();
		result.baseUrls[0] = pParamHash[n].map_typetilesurl;
		result.typename = pParamHash[n].map_typename;;
		result.getLinkText = function() {ldelim} return this.typename; {rdelim};
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
    		{if $gContent->mMapData.map_type != "G_SATELLITE_TYPE" && $gContent->mMapData.map_type != "G_MAP_TYPE" && $gContent->mMapData.map_type != "G_HYBRID_TYPE" }
    				map.setMapType(bMapTypes['{$gContent->mMapData.map_type}']);
    		{else}
    				map.setMapType({$gContent->mMapData.map_type});
    		{/if}
    {else}
    		map.setMapType({$gContent->mMapData.map_type});
		{/if}



    typecontrols = new GMapTypeControl();
    scale = new GScaleControl();
    smallcontrols = new GSmallMapControl();
    largecontrols = new GLargeMapControl();
    zoomcontrols = new GSmallZoomControl();

				
    //Add Map TYPE controls - buttons in the upper right corner
		{if $gContent->mMapData.show_typecontrols eq '1'}
		map.addControl(typecontrols);
		{/if}

		//Add Scale controls
		{if $gContent->mMapData.show_scale eq '1'}		
		map.addControl(scale);
		{/if}		
		
    //Add Navigation controls - buttons in the upper left corner		
		{if $gContent->mMapData.show_controls eq 's'}
		map.addControl(smallcontrols);
		{/if}
		{if $gContent->mMapData.show_controls eq 'l'}
		map.addControl(largecontrols);
		{/if}
		{if $gContent->mMapData.show_controls eq 'z'}
		map.addControl(zoomcontrols);
		{/if}
				
    map.centerAndZoom(new GPoint(bMapLon, bMapLat), bZoomLevel);

		//uses generic createMarker to add all markers in bIMData array
		//@todo this needs to be more complex and account for all the variety of types and styles 
		{if count($gContent->mMapInitMarkers) > 0}
		for(n=0; n<bIMData.length; n++){ldelim}
		    var point = new GPoint(parseFloat(bIMData[n].lon), parseFloat(bIMData[n].lat));
				var newmarker = createMarker(point, bIMData[n].window_data);
				map.addOverlay(newmarker);
		{rdelim};
		{/if}

		//uses generic createMarker to add all markers in bIMData array
		//@todo this needs to be more complex and account for all the variety of types and styles 
		{if count($gContent->mMapSetMarkers) > 0}
		for(n=0; n<bSMData.length; n++){ldelim}
		    var point = new GPoint(parseFloat(bSMData[n].lon), parseFloat(bSMData[n].lat));
				var newmarker = createMarker(point, bSMData[n].window_data);
				map.addOverlay(newmarker);
		{rdelim};
		{/if}

		
		{if count($gContent->mMapInitMarkers) > 0}
		for(n=0; n<bILData.length; n++){ldelim}
		    var linedata = bILData[n];
				var newpolyline = createPolyline(linedata);
				map.addOverlay(newpolyline);
		{rdelim};
		{/if}

		
{rdelim};

//]]>		
</script>