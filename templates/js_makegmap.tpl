<script type="text/javascript">
//<![CDATA[
var map;
var typecontrols;
var scale;
var smallcontrols;
var largecontrols;
var zoomcontrols;

var bMapID = {$gContent->mMapData.gmap_id};
var bMapTitle = "{$gContent->mMapData.title}";
var bMapDesc = "{$gContent->mMapData.description}";
var bMapWidth = {$gContent->mMapData.width};
var bMapHeight = {$gContent->mMapData.height};
var bMapLat = {$gContent->mMapData.lat};
var bMapLon = {$gContent->mMapData.lon};
var bMapZoom = {$gContent->mMapData.zoom_level};
var bMapScale = {$gContent->mMapData.show_scale}; //0,1
var bMapControl = "{$gContent->mMapData.show_controls}"; //s,l,z,n
var bMapTypeCont = {$gContent->mMapData.show_typecontrols};//0,1
var bMapType = "{$gContent->mMapData.map_type}";
		
var bMapTypes = new Array();


function getEditTools(){ldelim}
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'get_edit_script.php';
  document.getElementsByTagName('head')[0].appendChild(script);	

	var xmlDoc = null ;
	
	getEditHtml();
{rdelim};


function getEditHtml(){ldelim}
	function load() {ldelim}
        if (typeof window.ActiveXObject != 'undefined' ) {ldelim}
          xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
          xmlDoc.onreadystatechange = process ;
        {rdelim} else {ldelim}
          xmlDoc = new XMLHttpRequest();
          xmlDoc.onload = process ;
        {rdelim}
        xmlDoc.open( "GET", "templates/edit_form.html", true );
				xmlDoc.overrideMimeType('text/html');
        xmlDoc.send( null );
      {rdelim}
  function process() {ldelim}
        if ( xmlDoc.readyState != 4 ) return ;
//				alert("The HTML requested: " + xmlDoc.responseText)
        document.getElementById("editform").innerHTML = xmlDoc.responseText ;
      {rdelim}			

	load();		
{rdelim};



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
				
    map.centerAndZoom(new GPoint(bMapLon, bMapLat), bMapZoom);

		
		//@todo this needs to be more complex and account for all the variety of types and styles 
		//@todo wrap "edit" link in permission
		{if count($gContent->mMapInitMarkers) > 0}
		for(n=0; n<bIMData.length; n++){ldelim}
		    var point = new GPoint(parseFloat(bIMData[n].lon), parseFloat(bIMData[n].lat));
				bIMData[n].marker = new GMarker(point);
				bIMData[n].marker.my_html = "<div style='white-space: nowrap;'><div class='editbtn'><a href='javascript:editMarker(\"I\","+n+")'>edit<a></div><strong>"+bIMData[n].name+"</strong><p>"+bIMData[n].window_data+"</p></div>";
				map.addOverlay(bIMData[n].marker);
				//add the marker label if it exists
				if (bIMData[n].label_data){ldelim}
  				var topElement = bIMData[n].marker.iconImage;
  				if (bIMData[n].marker.transparentIcon) {ldelim}topElement = bIMData[n].marker.transparentIcon;{rdelim}
  				if (bIMData[n].marker.imageMap) {ldelim}topElement = bIMData[n].marker.imageMap;{rdelim}    
  				topElement.setAttribute( "title" , bIMData[n].label_data );
				{rdelim}
		{rdelim};
		{/if}

		
/*
		//@todo this needs to be more complex and account for all the variety of types and styles 
		{if count($gContent->mMapSetMarkers) > 0}
		for(n=0; n<bSMData.length; n++){ldelim}
		    var point = new GPoint(parseFloat(bSMData[n].lon), parseFloat(bSMData[n].lat));
				var bSMData[n].marker = new GMarker(point);
				var bSMData[n].marker.my_html = "<div style='white-space: nowrap;'><h3>"+bSMData[n].name+"</h3><p>"+bSMData[n].window_data+"</p></div>";
				//@todo this needs to come out when side panel is added to engine.
				map.addOverlay(bSMData[n].marker);
				//@todo marker label construction needs to be added via the side panel
				//add the marker label if it exists
				if (bSMData[n].label_data != ""){ldelim}
  				var topElement = newmarker.iconImage;
  				if (newmarker.transparentIcon) {ldelim}topElement = newmarker.transparentIcon;{rdelim}
  				if (newmarker.imageMap) {ldelim}topElement = newmarker.imageMap;{rdelim}    
  				topElement.setAttribute( "title" , bSMData[n].label_data );
				{rdelim}
		{rdelim};
		{/if}
*/


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

//]]>		
</script>