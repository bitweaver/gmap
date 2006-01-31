<script type="text/javascript">//<![CDATA[

// Copy Object Function
function copy_obj(o) {ldelim}var c = new Object(); for (var e in o) {ldelim} c[e] = o[e]; {rdelim} return c;{rdelim}

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




function attachMarkers(arrayId){ldelim}
	//get the array we are working on
	var a;
	if (arrayId == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

	//if the length of the array is > 0
	if (a.length > 0){ldelim}
  	//loop through the array
		for(n=0; n<a.length; n++){ldelim}
  		//if the array item is not Null
			if (a[n]!= null){ldelim}

				if (a[n].style_id == 0){ldelim}
					defineGMarker(arrayId, n);
				{rdelim}else{ldelim}
					var stylen;
					for (var b=0; b<bMStyleData.length; b++){ldelim}
						if ( bMStyleData[b].style_id == a[n].style_id ){ldelim}
							stylen = b;
						{rdelim}
					{rdelim}

					if ( bMStyleData[stylen].type == 0){ldelim}
						defineGxMarker(arrayId, n, stylen);
					{rdelim}else if ( bMStyleData[stylen].type == 1){ldelim}
						definePdMarker(arrayId, n, stylen);
					{rdelim}else if ( bMStyleData[stylen].type == 2){ldelim}
						defineXMarker(arrayId, n, stylen);
					{rdelim}

				{rdelim}

			{rdelim}
		{rdelim}
	{rdelim};
{rdelim};




function defineGMarker(i, n){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
  a[n].marker = new GMarker(point);
  a[n].marker.style_id = 0;
  a[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+a[n].title+"</strong><p>"+a[n].data+"</p></div>";
  map.addOverlay(a[n].marker);
  //add the marker label if it exists
  if (typeof(a[n].label_data) != 'undefined'){ldelim}
  	var topElement = a[n].marker.iconImage;
    if (a[n].marker.transparentIcon) {ldelim}topElement = a[n].marker.transparentIcon;{rdelim}
    if (a[n].marker.imageMap) {ldelim}topElement = a[n].marker.imageMap;{rdelim}
    topElement.setAttribute( "title" , a[n].label_data );
  {rdelim}
{rdelim}



function defineGxMarker(i, n, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

	var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var mytip = "<div class='tip-"+bMStyleData[s].name + "'>" + a[n].label_data + "</div>";
  a[n].marker = new GxMarker(point, null, mytip);
  a[n].marker.type = 0;
  a[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+a[n].title+"</strong><p>"+a[n].data+"</p></div>";
  map.addOverlay(a[n].marker);
{rdelim}


function definePdMarker(i, n, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

	//PdMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
  a[n].marker = new PdMarker(point);
  a[n].marker.type = 1;
  a[n].marker.setTooltipClass( "tip-"+bMStyleData[s].name );
  a[n].marker.setDetailWinClass( "win-"+bMStyleData[s].name );
  a[n].marker.setTooltip( "<div>" + a[n].label_data + "</div>");
  a[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+a[n].title+"</strong><p>"+a[n].data+"</p></div>";
  a[n].marker.setDetailWinHTML( a[n].marker.my_html );
  //rollover-icon: a[n].marker.setHoverImage("http://www.google.com/mapfiles/dd-start.png");
  map.addOverlay(a[n].marker);
{rdelim}


function defineXMarker(i, n, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

	//XMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var mytip = "<div class='tip-"+bMStyleData[s].name + "'>" + a[n].label_data + "</div>";
  a[n].marker = new XMarker(point, null, null, mytip);
  a[n].marker.type = 2;
  a[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+a[n].title+"</strong><p>"+a[n].data+"</p></div>";
  map.addOverlay(a[n].marker);
{rdelim}



function attachPolylines(arrayId){ldelim}
	//get the array we are working on
	var a;
	if (arrayId == "I"){ldelim}
  	a = bILData;
	{rdelim}else{ldelim}
  	a = bSLData;
	{rdelim};

	//if the length of the array is > 0
	if (a.length > 0){ldelim}
  	//loop through the array
		for(n=0; n<a.length; n++){ldelim}
  		//if the array item is not Null
			if (a[n]!= null){ldelim}
  			for (s=0; s<bLStyData.length; s++){ldelim}
  				if (bLStyData[s].style_id == a[n].style_id){ldelim}
  					var linecolor = "#"+bLStyData[s].color;
  					var lineweight = bLStyData[s].weight;
  					var lineopacity = bLStyData[s].opacity;
  				{rdelim}
  			{rdelim}  
  			var pointlist = new Array();
  			for (p = 0; p < a[n].points_data.length; p+=2 ){ldelim}
  				var point = new GPoint(
  					parseFloat(a[n].points_data[p]),
  					parseFloat(a[n].points_data[p+1])
  				);
  				pointlist.push(point);
  			{rdelim};  
  			a[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
  			map.addOverlay(a[n].polyline);
  	  {rdelim}
		{rdelim}
	{rdelim};
{rdelim};





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
		
	//Attach Markers
	{if count($gContent->mMapInitMarkers) > 0}
		attachMarkers("I");
	{/if}

	//Attach Polylines
	{if count($gContent->mMapInitLines) > 0}
		attachPolylines("I");
	{/if}

	//opens any infoWindow when clicked if it has content	my_html
	GEvent.addListener(map, "click", function(overlay, point) {ldelim}
		if (overlay) {ldelim}
			if (overlay.my_html && (overlay.style_id == 0 || overlay.type == 0 || overlay.type == 2 ) ) {ldelim}
				overlay.openInfoWindowHtml(overlay.my_html);
			{rdelim}
		{rdelim}
	{rdelim});

	// Monitor the window resize event and let the map know when it occurs 
  if (window.attachEvent) {ldelim} 
      window.attachEvent("onresize", function() {ldelim} this.map.onResize() {rdelim} ); 
  {rdelim} else {ldelim} 
		  window.addEventListener("resize", function() {ldelim} this.map.onResize() {rdelim} , false); 
  {rdelim}
	
{rdelim};

//]]></script>
