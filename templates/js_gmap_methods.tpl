<script type="text/javascript">//<![CDATA[

{* escape smarty *}
{literal}

// for displaying and hiding menu parts
function show (i){
	document.getElementById(i).style.display = "block";
};

// Copy Object Function
function copy_obj(o) {
	var c = new Object(); 
	for (var e in o) {
		c[e] = o[e]; 
	} 
	return c;
};



//@todo insert variables for zoomed out tiles path, and hybrid type tiles path
// Adds all MapTypes, it is called from loadMap()
function addMapTypes(pParamHash){
	for (var n=0; n < pParamHash.length; n++) {
		var baseid = pParamHash[n].basetype;
		var typename = pParamHash[n].name;
		var result = copy_obj(map.mapTypes[baseid]);
		result.baseUrls = new Array();
		result.baseUrls[0] = pParamHash[n].maptiles_url;
		result.typename = typename;
		result.getLinkText = function() { return this.typename; };
		bMapTypesData[n].maptype_node = map.mapTypes.length;  //@todo this needs to change to make a universal function - its too specific to the hash
		map.mapTypes[map.mapTypes.length] = result;
		bMapTypes[typename] = result;
	}
};



function attachIcons(){
	var i = bMIconData;
	if (i.length > 0){
  	for (n=0; n<i.length; n++){
  		if (i[n].icon_style_type != null && i[n].icon_style_type == 0){
  			defineGIcon(n);
  		}else if(i[n].icon_style_type != null && i[n].icon_style_type == 1){
  			defineXIcon(n);			
  		}
  	}
	}
};


//@todo - these image paths may not be universal enough, may need to get the root from kernel
function defineGIcon(n){
		bMIconData[n].icon = new GIcon();
		bMIconData[n].icon.image = bMIconData[n].image;
		bMIconData[n].icon.iconSize = new GSize(bMIconData[n].icon_w, bMIconData[n].icon_h);
		bMIconData[n].icon.iconAnchor = new GPoint(bMIconData[n].icon_anchor_x, bMIconData[n].icon_anchor_y);
		bMIconData[n].icon.shadow = bMIconData[n].shadow_image;
		bMIconData[n].icon.shadowSize = new GSize(bMIconData[n].shadow_w, bMIconData[n].shadow_h);
		bMIconData[n].icon.infoShadowAnchor = new GPoint(bMIconData[n].shadow_anchor_x, bMIconData[n].shadow_anchor_y);
		bMIconData[n].icon.infoWindowAnchor = new GPoint(bMIconData[n].infowindow_anchor_x, bMIconData[n].infowindow_anchor_y);
};


function defineXIcon(n){
    //make the shape
    var xishape = new Object;
    xishape.iconAnchor = new GPoint(bMIconData[n].icon_anchor_x, bMIconData[n].icon_anchor_y);
    xishape.infoWindowAnchor = new GPoint(bMIconData[n].infowindow_anchor_x, bMIconData[n].infowindow_anchor_y);
    xishape.shadow = true;
    xishape.points = bMIconData[n].points.split(",");
			/* @todo maybe in the future we'll add these
        contentAnchor: new GPoint(0, 0),
        contentSize: new GSize(31, 20),
			*/
    
    //put shape in the shape hash
    XIcon.shapes[bMIconData[n].name] = xishape;
    
    //create the styles
    var xistyle = new Object;
    xistyle.scale = bMIconData[n].scale;
    xistyle.outlineColor = "#" + bMIconData[n].outline_color;
    xistyle.outlineWeight = bMIconData[n].outline_weight;
    xistyle.fillColor = "#" + bMIconData[n].fill_color;
    xistyle.fillOpacity = bMIconData[n].fill_opacity;

		bMIconData[n].icon = new XIcon(bMIconData[n].name, xistyle);
};


function attachMarkers(){
	var a = bMData;
	//if the length of the array is > 0
	if (a.length > 0){
  	//loop through the array
		for(n=0; n<a.length; n++){
  		//if the array item is not Null
			if (a[n]!= null && a[n].plot_on_load == true){
				attachMarker(n);
			}
		}
	}
};


function attachMarker(n, o){
	var m = bMData[n];
	var i = null;
	if (m.icon_id != 0){
		for (var b=0; b<bMIconData.length; b++){
			if ( bMIconData[b].icon_id == m.icon_id ){
				i = b;
			}
		}
	}	
	if (m.style_id == 0){
		defineGMarker(n, i);
		if (o == true) {m.marker.openInfoWindowHtml(m.marker.my_html);};
  }else{
  	var s;
    for (var c=0; c<bMStyleData.length; c++){
    	if ( bMStyleData[c].style_id == m.style_id ){
    		s = c;
    	}
  	}
  	if ( bMStyleData[s].marker_style_type == 0){
  		defineGxMarker(n, i, s);
			if (o == true) {m.marker.openInfoWindowHtml(m.marker.my_html);};
  	}else if ( bMStyleData[s].marker_style_type == 1){
  		definePdMarker(n, i, s);
			if (o == true) {
        	m.marker.showTooltip();
        	m.marker.hideTooltip();
				m.marker.showDetailWin();
			};
  	}else if ( bMStyleData[s].marker_style_type == 2){
  		defineXMarker(n, i, s);
			if (o == true) {m.marker.openInfoWindowHtml(m.marker.my_html);};
  	}
	}
}



function defineGMarker(n, i){
	var a = bMData;

  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = bMIconData[i].icon;
	}
  a[n].marker = new GMarker(point, icon);
  a[n].marker.style_id = 0;

	var imgLink ='';
	if (a[n].marker_type == 1){
		var urlSrc = a[n].photo_url;
		var pos = urlSrc.lastIndexOf('.');
		var str_1 = urlSrc.substring(0, pos);
		var str_2 = urlSrc.substring(pos, urlSrc.length); 
		var medUrl = str_1 + "_medium" + str_2;
		var imgLink = "<p><img src='"+medUrl+"'></p>"
	}

  a[n].marker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+a[n].title+"</h1>" + imgLink + "<p>"+a[n].parsed_data+"</p></div>";
  map.addOverlay(a[n].marker);
  //add the marker label if it exists
  if (typeof(a[n].label_data) != 'undefined'){
  	var topElement = a[n].marker.iconImage;
    if (a[n].marker.transparentIcon) {topElement = a[n].marker.transparentIcon;}
    if (a[n].marker.imageMap) {topElement = a[n].marker.imageMap;}
    topElement.setAttribute( "title" , a[n].label_data );
  }
}



function defineGxMarker(n, i, s){
	var a = bMData;

	var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = bMIconData[i].icon;
	}
	var mytip = "<div class='tip-"+bMStyleData[s].name + "'>" + a[n].label_data + "</div>";
  a[n].marker = new GxMarker(point, icon, mytip);
  a[n].marker.marker_style_type = 0;

	var imgLink ='';
	if (a[n].marker_type == 1){
		var urlSrc = a[n].photo_url;
		var pos = urlSrc.lastIndexOf('.');
		var str_1 = urlSrc.substring(0, pos);
		var str_2 = urlSrc.substring(pos, urlSrc.length); 
		var medUrl = str_1 + "_medium" + str_2;
		var imgLink = "<p><img src='"+medUrl+"'></p>"
	}

  a[n].marker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+a[n].title+"</h1>" + imgLink + "<p>"+a[n].parsed_data+"</p></div>";
  map.addOverlay(a[n].marker);
}



function definePdMarker(n, i, s){
	var a = bMData;

	//PdMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = bMIconData[i].icon;
	}
  a[n].marker = new PdMarker(point, icon);
  a[n].marker.marker_style_type = 1;
  a[n].marker.setTooltipClass( "tip-"+bMStyleData[s].name );
  a[n].marker.setDetailWinClass( "win-"+bMStyleData[s].name );
  a[n].marker.setTooltip( "<div>" + a[n].label_data + "</div>");

	var imgLink ='';
	if (a[n].marker_type == 1){
		var urlSrc = a[n].photo_url;
		var pos = urlSrc.lastIndexOf('.');
		var str_1 = urlSrc.substring(0, pos);
		var str_2 = urlSrc.substring(pos, urlSrc.length); 
		var medUrl = str_1 + "_medium" + str_2;
		var imgLink = "<p><img src='"+medUrl+"'></p>"
	}

  a[n].marker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+a[n].title+"</h1>" + imgLink + "<p>"+a[n].parsed_data+"</p></div>";
  a[n].marker.setDetailWinHTML( a[n].marker.my_html );
  //rollover-icon: a[n].marker.setHoverImage("http://www.google.com/mapfiles/dd-start.png");
  map.addOverlay(a[n].marker);
}



function defineXMarker(n, i, s){
	var a = bMData;

	var icon = null;
	if (i != null){
		icon = bMIconData[i].icon;
	}

	//XMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var mytip = "<div class='tip-"+bMStyleData[s].name + "'>" + a[n].label_data + "</div>";
  a[n].marker = new XMarker(point, icon, null, mytip);
  a[n].marker.marker_style_type = 2;

	var imgLink ='';
	if (a[n].marker_type == 1){
		var urlSrc = a[n].photo_url;
		var pos = urlSrc.lastIndexOf('.');
		var str_1 = urlSrc.substring(0, pos);
		var str_2 = urlSrc.substring(pos, urlSrc.length); 
		var medUrl = str_1 + "_medium" + str_2;
		var imgLink = "<p><img src='"+medUrl+"'></p>"
	}

  a[n].marker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+a[n].title+"</h1>" + imgLink + "<p>"+a[n].parsed_data+"</p></div>";
  map.addOverlay(a[n].marker);
}



function attachPolylines(){
	//get the array we are working on
	var a = bLData;
	//if the length of the array is > 0
	if (a.length > 0){
  	//loop through the array
		for(n=0; n<a.length; n++){
  		//if the array item is not Null
			if (a[n]!= null && a[n].plot_on_load == true){
				attachPolyline(n);
			}
		}
	}
};



function attachPolyline(n){
	var a = bLData;
	if (a[n].style_id == 0){
		defineGPolyline(n);
	}else{
		var s;
		for (var b=0; b<bLStyData.length; b++){
			if ( bLStyData[b].style_id == a[n].style_id ){
				s = b;
			}
		}
		if ( bLStyData[s].polyline_style_type == 0){
			defineGPolyline(n, s);
		}else{
			defineXPolyline(n, s);
		}
	}
}



function defineGPolyline(n, s){
	var a = bLData;

  var pointlist = new Array();
  for (p = 0; p < a[n].points_data.length; p+=2 ){
  	var point = new GPoint(
  		parseFloat(a[n].points_data[p]),
  		parseFloat(a[n].points_data[p+1])
  	);
		pointlist.push(point);
  };

	if ( s != null ){
    var linecolor = "#"+bLStyData[s].color;
    var lineweight = bLStyData[s].weight;
    var lineopacity = bLStyData[s].opacity;
  };

  a[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
  map.addOverlay(a[n].polyline);
};



function defineXPolyline(n, s){
	var a = bLData;

	//make the array of points needed
  var pointlist = new Array();
  for (p = 0; p < a[n].points_data.length; p+=2 ){
  	var point = new GPoint(
  		parseFloat(a[n].points_data[p]),
  		parseFloat(a[n].points_data[p+1])
  	);
		pointlist.push(point);
  };

	//if we are given a style_id we look up the styles otherwise defaults kick in
  var linecolor = "#"+bLStyData[s].color;
  var txfgcolor = "#"+bLStyData[s].text_fgstyle_color;
  var txbgcolor = "#"+bLStyData[s].text_bgstyle_color;

  var linestyle = {
		color: linecolor,
		weight: bLStyData[s].weight,
		opacity: bLStyData[s].opacity,
    /* @todo this prolly needs to be parsed as it should be comma delim
     * pattern: [bLStyData[s].pattern];
		 */
		segmentCount: bLStyData[s].segment_count,
		beginArrow: bLStyData[s].begin_arrow,
    endArrow: bLStyData[s].end_arrow,
		arrowsEvery: bLStyData[s].arrows_every,
		text: a[n].border_text,
		textEvery: bLStyData[s].text_every,
		textFgStyle: { color: txfgcolor, weight: bLStyData[s].text_fgstyle_weight, opacity: bLStyData[s].text_fgstyle_opacity },
		textBgStyle: { color: txbgcolor, weight: bLStyData[s].text_bgstyle_weight, opacity: bLStyData[s].text_bgstyle_opacity }
  };

  a[n].polyline = new XPolyline(pointlist, linestyle);
  map.addOverlay(a[n].polyline);
};



function attachPolygons(){
	//get the array we are working on
	var a = bPData;

	//if the length of the array is > 0
	if (a.length > 0){
  	//loop through the array
		for(n=0; n<a.length; n++){
  		//if the array item is not Null
			if (a[n]!= null){
				attachPolygon(n);
			}
		}
	}
};


function attachPolygon(n){
	var s;
	var p;
	for (var b=0; b<bLStyData.length; b++){
		if ( bLStyData[b].style_id == bPData[n].polylinestyle_id ){
			s = b;
		}
	}
	for (var c=0; c<bPStyData.length; c++){
		if ( bPStyData[c].style_id == bPData[n].style_id ){
			p = c;
		}
	}
	defineXPolygon(n, s, p);
}


function defineXPolygon(n, s, p){
	var fillstyle = {};
	var linestyle = {};

	var a = bPData;

	//Create XPolygon styles
 	if (p != null){
		var fillcolor = "#"+bPStyData[p].color;
		fillstyle = {
  		color: fillcolor,
  		weight: bPStyData[p].weight,
  		opacity: bPStyData[p].opacity
		}
	}

 	if (s != null){
    var linecolor = "#"+bLStyData[s].color;
    var txfgcolor = "#"+bLStyData[s].text_fgstyle_color;
    var txbgcolor = "#"+bLStyData[s].text_bgstyle_color;
    linestyle = {
  		color: linecolor,
  		weight: bLStyData[s].weight,
  		opacity: bLStyData[s].opacity,
        /* @todo this prolly needs to be parsed as it should be comma delim
         * pattern: [bLStyData[s].pattern];
    		 */
  		segmentCount: bLStyData[s].segment_count,
  		beginArrow: bLStyData[s].begin_arrow,
      	endArrow: bLStyData[s].end_arrow,
  		arrowsEvery: bLStyData[s].arrows_every,
  		text: a[n].border_text,
  		textEvery: bLStyData[s].text_every,
  		textFgStyle: { color: txfgcolor, weight: bLStyData[s].text_fgstyle_weight, opacity: bLStyData[s].text_fgstyle_opacity },
  		textBgStyle: { color: txbgcolor, weight: bLStyData[s].text_bgstyle_weight, opacity: bLStyData[s].text_bgstyle_opacity }
    };
	};

	if (a[n].circle == true){
	//if its a circle
  	var center = new GPoint(parseFloat(a[n].circle_center[0]), parseFloat(a[n].circle_center[1]));
  	var radius = new XDistance(a[n].radius, XDistance.KM);
  	a[n].polygon = new XPolygon.createRegularPolygonFromRadius(center, radius, 42, 0, linestyle, fillstyle);
  }else{
	//if its not
  	var pointlist = new Array();
    for (q = 0; q < a[n].points_data.length; q+=2 ){
    	var point = new GPoint(
    		parseFloat(a[n].points_data[q]),
    		parseFloat(a[n].points_data[q+1])
    	);
  		pointlist.push(point);
    };
    a[n].polygon = new XPolygon(pointlist, linestyle, fillstyle);
  };
  map.addOverlay(a[n].polygon);
};








//make side panel of markers
function attachSideMarkers(){

	//add tracking var to get count of side sets
	var x = 0;

	//go through all marker sets
	for ( var n=0; n<bMSetData.length; n++ ){
		//if show set == y
		if ( bMSetData[n].side_panel == true ){
			//up the counter
			x++;
			//add set container to side and mod id
			var theNewDiv = document.createElement('div');
			theNewDiv.id = 'sideset_'+ bMSetData[n].set_id;
			theNewDiv.className = 'module box';

			var setTitle = "<h3 class='gmapsidetitle'>" + bMSetData[n].name + "</h3>";
 			
			var theIcon = "<img src='http://www.google.com/mapfiles/marker.png' class='gmapsideicon' style='width:20px; height:34px;'>"; 
			for (var m=0; m<bMIconData.length; m++){
				if ( bMIconData[m].icon_id == bMSetData[n].icon_id ){
					var theIcon = "<img src='" + bMIconData[m].image + "' class='gmapsideicon' style='width:" + bMIconData[m].icon_w + "px; height:" + bMIconData[m].icon_h + "px;'>"; 
				}
			}

			var setDesc = "<div class='gmapsidedesc'>" + theIcon + " " + bMSetData[n].description + "<div style='clear:both'></div></div>";
			var setList = "<div class='boxcontent gmapsidelist' id='listset_" + bMSetData[n].set_id + "'></div>";

			theNewDiv.innerHTML += setTitle + setDesc + setList;

			document.getElementById('mapsidepanel').appendChild(theNewDiv);
		}
	}


	if ( x != 0 ){
			document.getElementById('mapsidepanel').className = 'mapsidepanel';
		if (bBrowser == 'op'){
			document.getElementById('map').className = 'map-op';
		}
		//go through all markers
		for ( var q=0; q<bMData.length; q++ ){
			//sort alphabetically
			//if show set == y and show marker == y
			if ( bMData[q].side_panel == true && bMData[q].explode == true ) {

				if (bMData[q].marker_type == 1){
					var urlSrc = bMData[q].photo_url;
					var pos = urlSrc.lastIndexOf('.');
					var str_1 = urlSrc.substring(0, pos);
					var str_2 = urlSrc.substring(pos, urlSrc.length); 
					var thumbUrl = str_1 + "_thumb" + str_2;
					var imgLink = "<br/><img src='" + thumbUrl + "'>"
				}else{
					var imgLink ='';
				}

				//add marker to side list 
					var theNewLink = document.createElement('a');
					theNewLink.href = "javascript: bMData["+q+"].marker.openInfoWindowHtml(bMData["+q+"].marker.my_html);";
					theNewLink.innerHTML = bMData[q].title + imgLink;

//					var theText = document.createTextNode( bMData[q].title);
//					theNewLink.appendChild(theText);

					var BR = document.createElement('br');
					document.getElementById('listset_'+ bMData[q].set_id).appendChild(theNewLink);
					document.getElementById('listset_'+ bMData[q].set_id).appendChild(BR);

					/*
					var openWindowLink = "<a href='javascript: bMData["+q+"].marker.openInfoWindowHtml(bMData["+q+"].marker.my_html'>"+bMData[q].title+"</a>";
					var attachLink = "<a href='javascript: attachMarker(" + bMData[q].array_n + ", true);'>attach</a>";
					document.getElementById('listset_'+ bMData[q].set_id).innerHTML = openWindowLink + " " + attachLink;
					*/

					//copy model html div
					//attach to document
  				//if marker is set to init
					if ( bMData[q].plot_on_load == true ) {
  					//set loaded to true
					}else{
  					//set loaded to false
					}
			}
		}
	}
};


{/literal}
{* end smarty escaping *}







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

	//create custom Icons
	{if count($gContent->mMapIconStyles) > 0}
		attachIcons();
	{/if}
	//Attach Markers
	{if count($gContent->mMapMarkers) > 0}
		attachMarkers();
		attachSideMarkers();
	{/if}
	//Attach Polylines
	{if count($gContent->mMapPolylines) > 0}
		attachPolylines();
	{/if}
	//Attach Polygons
	{if count($gContent->mMapPolygons) > 0}
		attachPolygons();
	{/if}

	//opens any infoWindow when clicked if it has content	my_html
	GEvent.addListener(map, "click", function(overlay, point) {ldelim}
		if (overlay) {ldelim}
			if (overlay.my_html && (overlay.style_id == 0 || overlay.marker_type == 0 || overlay.marker_type == 2 ) ) {ldelim}
				overlay.openInfoWindowHtml(overlay.my_html);
			{rdelim}
		{rdelim}
	{rdelim});

	// Monitor the window resize event and let the map know when it occurs 
  if (window.attachEvent) {ldelim} 
      window.attachEvent("onresize", function() {ldelim} 
				//document.getElementById('map').style.height = ( document.body.clientHeight*80/100 ) + "px"; 
				this.map.onResize() 
			{rdelim} ); 
  {rdelim} else {ldelim} 
		  window.addEventListener("resize", function() {ldelim} 
				//document.getElementById('map').style.height = ( document.body.clientHeight*80/100 ) + "px"; 
				this.map.onResize()
			{rdelim} , false); 
  {rdelim}
	
{rdelim};

//]]></script>
