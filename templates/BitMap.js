if (typeof(BitMap) == 'undefined') {
    BitMap = {};
}

if (typeof(BitMap.MapData) == 'undefined') {
    BitMap.MapData = [];
}

BitMap.DisplayList = function(){
  BitMap.Initialize();
  BitMap.MapData[0].Map.addOverlayListener();
  BitMap.MapData[0].Map.attachSideMarkers();
};


BitMap.EditContent = function(){
  BitMap.Initialize();
  BitMap.MapData[0].Map.addLatLngCapture();
};


BitMap.Initialize = function(){
  var count = BitMap.MapData.length;
  for (n=0; n<count; n++){
    BitMap.MapData[n].Map = new BitMap.Map(
      n,
      BitMap.MapData[n].mapdiv,
      {lat: BitMap.MapData[n].lat, lng: BitMap.MapData[n].lng},
      BitMap.MapData[n].zoom,
      BitMap.MapData[n].map_type,
      {scale: BitMap.MapData[n].scale, type_control:BitMap.MapData[n].type_control, zoom_control: BitMap.MapData[n].zoom_control, overview_control: BitMap.MapData[n].overview_control},
      BitMap.MapData[n].Markers
      );
  };
};

//center is an object containing .lat and .lng
//controls is an object containing .scale .type_control .zoom_control
BitMap.Map = function (index, mapdiv, center, zoom, map_type, controls, markers) {
  this.index = index;
  this.mapdiv = mapdiv;
  this.center = center;
  this.zoom = zoom;
  this.map_type = map_type;
  this.controls = controls;
  this.markers = markers;
  this.map = new GMap2(document.getElementById(this.mapdiv));
  this.SetMapType();
  this.SetControls();
  this.map.setCenter(new GLatLng(this.center.lat, this.center.lng), this.zoom);
  if (this.markers.length > 0){
  	var ref = this;
  	this.loopOver(ref.markers, function(i){ref.addMarker(i);});
  }
};


//a utility method we use instead of for loops
BitMap.Map.prototype.loopOver = function(arr, fnc){
	var iIterations = arr.length;
	var iLoopCount = Math.ceil(iIterations / 8);
	var iTestValue = iIterations % 8;
	var n = 0;
	do {
		switch (iTestValue) {
			case 0: fnc(n++);
			case 7: fnc(n++);
			case 6: fnc(n++);
			case 5: fnc(n++);
			case 4: fnc(n++);
			case 3: fnc(n++);
			case 2: fnc(n++);
			case 1: fnc(n++);
		}
		iTestValue = 0;
	} while (--iLoopCount > 0);
};


BitMap.Map.prototype.SetControls = function(){
  if(this.controls.scale == true){
    this.map.addControl(new GScaleControl());
  }  
  switch (this.controls.zoom_control){
    case 's': this.map.addControl(new GSmallMapControl());
      break;
    case 'l': this.map.addControl(new GLargeMapControl());
      break;
    case 'z': this.map.addControl(new GSmallZoomControl());
      break;
    default:;
  }
  if (this.controls.type_control == true){
    this.map.addControl(new GMapTypeControl());  
  }
  if (this.controls.overview_control == true){
    this.map.addControl(new GOverviewMapControl());  
  }
};


BitMap.Map.prototype.SetMapType = function(){
  switch (this.maptype){
    case 'Street': this.map.setMapType(G_NORMAL_MAP);
      break;
    case 'Satellite': this.map.setMapType(G_SATELLITE_MAP);
      break;
    case 'Hybrid': this.map.setMapType(G_HYBRID_MAP);
      break;
  }
};


BitMap.Map.prototype.addOverlayListener = function(){
	GEvent.addListener(this.map, "click", function(overlay) {
    if (overlay){ 
      if (overlay.my_html){ 
        overlay.openInfoWindowHtml(overlay.my_html);
      }
     }
	});
};


BitMap.Map.prototype.addLatLngCapture = function(){
  var ref = this;
  GEvent.addListener(this.map, "click", function(overlay, point){
    if (overlay){ 
      if (overlay.my_html){ 
        overlay.openInfoWindowHtml(overlay.my_html);
      }
    }else{
      ref.map.clearOverlays();
      document.getElementById('geo_lat').value = point.lat();
      document.getElementById('geo_lng').value = point.lng();
      ref.map.addOverlay(new GMarker(point));
    }
  });
};


BitMap.Map.prototype.RequestContent = function(){
  //parse form
  //make ajax request
  //initiate loading graphic
  //set callback ReceiveFaves
  //else report error
  //clear loading graphic
};


BitMap.Map.prototype.ReceiveContent = function(){
  //add data to marker array
  //create markers
    //add to map
    //call UpdateMarkerList
  //display favorites list
};


BitMap.Map.prototype.UpdateMarkerList = function(){
  //add to general side panel list
};

/*--------------------------------------------------------------------*/
/*@todo this is a rough rewrite 
 *      need to look into hybrid types
 *      and what to do about boundry areas
 *      and what to show there 
 *      Also might need some variable to
 *      deal with V1 tile stack vs V2 tile stack  
 */
// Adds all MapTypes, it is called from loadMap()
BitMap.Map.prototype.addMapTypes = function(pParamHash){
  var Maptypes = BitMap.MapData[this.index].Maptypes;
  var count = Maptypes.length;
	for (var n=0; n < count; n++) {
		//must insert some sort of check for the Maptypes[n].basetype and special provisions for hybrids 
		var copyright = new GCopyright(1,
                              new GLatLngBounds(new GLatLng(-90, -180),
                                                new GLatLng(90, 180)),
                              Maptypes[n].minzoom,
                              Maptypes[n].copyright);                              
    var copyrightCollection = new GCopyrightCollection(Maptypes[n].name);
    copyrightCollection.addCopyright(copyright);        
    var tilelayers = [new GTileLayer(copyrightCollection, Maptypes[n].minzoom, Maptypes[n].maxzoom)];    
    tilelayers[0].getTileUrl = CustomGetTileUrl;
    function CustomGetTileUrl(a,b) {
	   var z = 17 - b;
	   var f = "/maps/?x="+a.x+"&y="+a.y+"&zoom="+z;
	   return f;
    }
    var custommap = new GMapType(tilelayers, new GMercatorProjection(Maptypes[n].maxzoom+1), "Maptypes[n].name", {errorMessage:"Sorry we do not have imagery available for this area"});
    this.map.addMapType(custommap);
	}
};


BitMap.Map.prototype.attachIcons = function(){
	var i = BitMap.MapData[this.index].IconStyles;
	if (i.length > 0){
  	for (n=0; n<i.length; n++){
  		if (i[n].icon_style_type != null && i[n].icon_style_type == 0){
  			this.defineGIcon(n);
  		}else if(i[n].icon_style_type != null && i[n].icon_style_type == 1){
  			this.defineXIcon(n);			
  		}
  	}
	}
};


//@todo - these image paths may not be universal enough, may need to get the root from kernel
BitMap.Map.prototype.defineGIcon = function(n){
		var IconStyle = BitMap.MapData[this.index].IconStyles[n];
		IconStyle.icon = new GIcon();
		IconStyle.icon.image = IconStyle.image;
		IconStyle.icon.iconSize = new GSize(IconStyle.icon_w, IconStyle.icon_h);
		IconStyle.icon.iconAnchor = new GPoint(IconStyle.icon_anchor_x, IconStyle.icon_anchor_y);
		IconStyle.icon.shadow = IconStyle.shadow_image;
		IconStyle.icon.shadowSize = new GSize(IconStyle.shadow_w, IconStyle.shadow_h);
		IconStyle.icon.infoShadowAnchor = new GPoint(IconStyle.shadow_anchor_x, IconStyle.shadow_anchor_y);
		IconStyle.icon.infoWindowAnchor = new GPoint(IconStyle.infowindow_anchor_x, IconStyle.infowindow_anchor_y);
};


//this might not be supportable in V2 api, requires Xmaps lib
BitMap.Map.prototype.defineXIcon = function(n){
		var IconStyle = BitMap.MapData[this.index].IconStyles[n];
    //make the shape
    var xishape = new Object;
    xishape.iconAnchor = new GPoint(IconStyle.icon_anchor_x, IconStyle.icon_anchor_y);
    xishape.infoWindowAnchor = new GPoint(IconStyle.infowindow_anchor_x, IconStyle.infowindow_anchor_y);
    xishape.shadow = true;
    xishape.points = IconStyle.points.split(",");
			/* @todo maybe in the future we'll add these
        contentAnchor: new GPoint(0, 0),
        contentSize: new GSize(31, 20),
			*/
    //put shape in the shape hash
    XIcon.shapes[IconStyle.name] = xishape;    
    //create the styles
    var xistyle = new Object;
    xistyle.scale = IconStyle.scale;
    xistyle.outlineColor = "#" + IconStyle.outline_color;
    xistyle.outlineWeight = IconStyle.outline_weight;
    xistyle.fillColor = "#" + IconStyle.fill_color;
    xistyle.fillOpacity = IconStyle.fill_opacity;
    //create the icon
		IconStyle.icon = new XIcon(IconStyle.name, xistyle);
};



/*@todo 
 *
 * reconcile with addMarkers below
 *  
 */ 
BitMap.Map.prototype.addMarker = function(i){
	if (this.markers[i]!= null && this.markers[i].plot_on_load == true){
    var Marker = this.markers[i];
    var p = new GLatLng(parseFloat(Marker.lat), parseFloat(Marker.lng));
    Marker.gmarker = new GMarker(p);
    Marker.gmarker.my_html = Marker.title;
    this.map.addOverlay(Marker.gmarker);
  }
};


/*@todo Merge this with function above */
BitMap.Map.prototype.attachMarker = function(n, o){
	var m = this.markers[n];
	var i = null;
	if (m.icon_id != 0){
	  var IconStyles = BitMap.MapData[this.index].IconStyles;
		for (var b=0; b<IconStyles.length; b++){
			if ( IconStyles[b].icon_id == m.icon_id ){
				i = b;
			}
		}
	}	
	if (m.style_id == 0){
		this.defineGMarker(n, i);
		if (o == true) {m.marker.openInfoWindowHtml( m.marker.my_html );};
  }else{
  	var s;
  	var MarkerStyles = BitMap.Map[this.index].MarkerStyles; 
    for (var c=0; c<MarkerStyles.length; c++){
    	if ( MarkerStyles[c].style_id == m.style_id ){
    		s = c;
    	}
  	}
  	if ( MarkerStyles[s].marker_style_type == 0){
  		this.defineGxMarker(n, i, s);
			if (o == true) {m.marker.openInfoWindowHtml(m.marker.my_html);};
  	}else if ( MarkerStyles[s].marker_style_type == 1){
  		this.definePdMarker(n, i, s);
			if (o == true) {
        	m.marker.showTooltip();
        	m.marker.hideTooltip();
				  m.marker.showDetailWin();
			};
  	}else if ( MarkerStyles[s].marker_style_type == 2){
  		this.defineXMarker(n, i, s);
			if (o == true) {m.marker.openInfoWindowHtml(m.marker.my_html);};
  	}
	}
}



BitMap.Map.prototype.defineGMarker = function(n, i){
	var a = this.markers;

  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = BitMap.MapData[this.index].IconStyles[i].icon;
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
		var imgLink = "<p><a onClick=\"javascript: window.open('"+urlSrc+"','TodoADDROOTHERE')\"><img src='"+medUrl+"'></a></p>"
	}

  a[n].marker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+a[n].title+"</h1>" + imgLink + "<p>"+a[n].parsed_data+"</p></div>";
  this.map.addOverlay(a[n].marker);
  //add the marker label if it exists
  if (typeof(a[n].label_data) != 'undefined'){
  	var topElement = a[n].marker.iconImage;
    if (a[n].marker.transparentIcon) {topElement = a[n].marker.transparentIcon;}
    if (a[n].marker.imageMap) {topElement = a[n].marker.imageMap;}
    topElement.setAttribute( "title" , a[n].label_data );
  }
}



BitMap.Map.prototype.defineGxMarker = function(n, i, s){
	var a = this.markers;

	var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = BitMap.MapData[this.index].IconStyles[i].icon;
	}
	var mytip = "<div class='tip-"+BitMap.MapData[this.index].MarkerStyles[s].name + "'>" + a[n].label_data + "</div>";
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
  this.map.addOverlay(a[n].marker);
}



BitMap.Map.prototype.definePdMarker = function(n, i, s){
	var a = this.markers;

	//PdMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = BitMap.MapData[this.index].IconStyles[i].icon;
	}
  a[n].marker = new PdMarker(point, icon);
  a[n].marker.marker_style_type = 1;
  a[n].marker.setTooltipClass( "tip-"+BitMap.MapData[this.index].MarkerStyles[s].name );
  a[n].marker.setDetailWinClass( "win-"+BitMap.MapData[this.index].MarkerStyles[s].name );
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
  this.map.addOverlay(a[n].marker);
}


BitMap.Map.prototype.attachPolylines = function(){
	//get the array we are working on
	var a = BitMap.MapData[this.index].Polylines;
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



BitMap.Map.prototype.attachPolyline = function(n){
	var a = BitMap.MapData[this.index].Polylines;
	if (a[n].style_id == 0){
		this.defineGPolyline(n);
	}else{
		var s;
		var PolylineStyles = BitMap.MapData[this.index].PolylineStyles;
		for (var b=0; b<PolylineStyles.length; b++){
			if ( PolylineStyles[b].style_id == a[n].style_id ){
				s = b;
			}
		}
		if ( PolylineStyles[s].polyline_style_type == 0){
			this.defineGPolyline(n, s);
		}else{
			this.defineXPolyline(n, s);
		}
	}
}



BitMap.Map.prototype.defineGPolyline = function(n, s){
	var a = BitMap.MapData[this.index].Polylines;

  var pointlist = new Array();
  for (p = 0; p < a[n].points_data.length; p+=2 ){
  	var point = new GPoint(
  		parseFloat(a[n].points_data[p]),
  		parseFloat(a[n].points_data[p+1])
  	);
		pointlist.push(point);
  };

	if ( s != null ){
		var PolylineStyles = BitMap.MapData[this.index].PolylineStyles;	
    var linecolor = "#"+PolylineStyles[s].color;
    var lineweight = PolylineStyles[s].weight;
    var lineopacity = PolylineStyles[s].opacity;
  };

  a[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
  this.map.addOverlay(a[n].polyline);
};


//@todo not sure if this can be supported in V2, requires Xmaps Lib
BitMap.Map.prototype.defineXPolyline = function(n, s){
	var a = BitMap.MapData[this.index].Polylines;

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
	var PolylineStyle = BitMap.MapData[this.index].PolylineStyles[s];	
  var linecolor = "#"+PolylineStyle.color;
  var txfgcolor = "#"+PolylineStyle.text_fgstyle_color;
  var txbgcolor = "#"+PolylineStyle.text_bgstyle_color;

  var linestyle = {
		color: linecolor,
		weight: PolylineStyle.weight,
		opacity: PolylineStyle.opacity,
    /* @todo this prolly needs to be parsed as it should be comma delim
     * pattern: [bLStyData[s].pattern];
		 */
		segmentCount: PolylineStyle.segment_count,
		beginArrow: PolylineStyle.begin_arrow,
    endArrow: PolylineStyle.end_arrow,
		arrowsEvery: PolylineStyle.arrows_every,
		text: a[n].border_text,
		textEvery: PolylineStyle.text_every,
		textFgStyle: { color: txfgcolor, weight: PolylineStyle.text_fgstyle_weight, opacity: PolylineStyle.text_fgstyle_opacity },
		textBgStyle: { color: txbgcolor, weight: PolylineStyle.text_bgstyle_weight, opacity: PolylineStyle.text_bgstyle_opacity }
  };

  a[n].polyline = new XPolyline(pointlist, linestyle);
  this.map.addOverlay(a[n].polyline);
};


/*@todo all Polygon constructors below might have to change
 *      the current Polygon constructors use the Xmaps Lib
 *      but there may not be an Xmaps Lib for V2
 */  
BitMap.Map.prototype.attachPolygons = function(){
	//get the array we are working on
	var a = BitMap.MapData[this.index].Polygons;

	//if the length of the array is > 0
	if (a.length > 0){
  	//loop through the array
		for(n=0; n<a.length; n++){
  		//if the array item is not Null
			if (a[n]!= null){
				this.attachPolygon(n);
			}
		}
	}
};


BitMap.Map.prototype.attachPolygon = function(n){
	var s;
	var p;
	var Polygon = BitMap.MapData[this.index].Polygons[n];
	var PolylineStyles = BitMap.MapData[this.index].PolylineStyles;
	var PolygonStyles = BitMap.MapData[this.index].PolygonStyles;
	for (var b=0; b<PolylineStyles.length; b++){
		if ( PolylineStyles[b].style_id == Polygon.polylinestyle_id ){
			s = b;
		}
	}
	for (var c=0; c<bPStyData.length; c++){
		if ( PolygonStyles[c].style_id == Polygon.style_id ){
			p = c;
		}
	}
	this.defineXPolygon(n, s, p);
}


BitMap.Map.prototype.defineXPolygon = function(n, s, p){
	var fillstyle = {};
	var linestyle = {};

	var a = BitMap.MapData[this.index].Polygons;

	//Create XPolygon styles
 	if (p != null){
	  var PolygonStyle = BitMap.MapData[this.index].PolygonStyles[p];
		var fillcolor = "#"+PolygonStyle.color;
		fillstyle = {
  		color: fillcolor,
  		weight: PolygonStyle.weight,
  		opacity: PolygonStyle.opacity
		}
	}

 	if (s != null){
	  var PolylineStyle = BitMap.MapData[this.index].PolylineStyles[s];
    var linecolor = "#"+PolylineStyle.color;
    var txfgcolor = "#"+PolylineStyle.text_fgstyle_color;
    var txbgcolor = "#"+PolylineStyle.text_bgstyle_color;
    linestyle = {
  		color: linecolor,
  		weight: PolylineStyle.weight,
  		opacity: PolylineStyle.opacity,
        /* @todo this prolly needs to be parsed as it should be comma delim
         * pattern: [bLStyData[s].pattern];
    		 */
  		segmentCount: PolylineStyle.segment_count,
  		beginArrow: PolylineStyle.begin_arrow,
      	endArrow: PolylineStyle.end_arrow,
  		arrowsEvery: PolylineStyle.arrows_every,
  		text: a[n].border_text,
  		textEvery: PolylineStyle.text_every,
  		textFgStyle: { color: txfgcolor, weight: PolylineStyle.text_fgstyle_weight, opacity: PolylineStyle[s].text_fgstyle_opacity },
  		textBgStyle: { color: txbgcolor, weight: PolylineStyle.text_bgstyle_weight, opacity: PolylineStyle[s].text_bgstyle_opacity }
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
  this.map.addOverlay(a[n].polygon);
};




//make side panel of markers
//works only with one map on a page
BitMap.Map.prototype.attachSideMarkers = function(){
	//unhide side list
	document.getElementById('mapsidepanel').className = 'mapsidepanel';
	//go through all markers and add marker to side list
	for ( var i=0; i<this.markers.length; i++ ){
		//make the link
		var theNewLink = document.createElement('a');
		theNewLink.href = "javascript: BitMap.MapData[0].Map.markers["+i+"].gmarker.openInfoWindowHtml(BitMap.MapData[0].Map.markers["+i+"].gmarker.my_html);";
		theNewLink.innerHTML = this.markers[i].title;
		
		//make a br
		var BR = document.createElement('br');
		//add link and space to container
		document.getElementById('mapsidepanel').appendChild(theNewLink);
		document.getElementById('mapsidepanel').appendChild(BR);
	}
};


/*@todo Merge this function with the one above
 */ 
//make side panel of markers
BitMap.Map.prototype.attachSideMarkers = function(){

	//add tracking var to get count of side sets
	var x = 0;

  var MarkerSets = BitMap.MapData[this.index].MarkerSets;
	//go through all marker sets
	for ( var n=0; n<MarkerSets.length; n++ ){
		//if show set == y
		var MarkerSet = MarkerSets[n];
		if ( MarkerSet.side_panel == true ){
			//up the counter
			x++;
			//add set container to side and mod id
			var theNewDiv = document.createElement('div');
			theNewDiv.id = 'sideset_'+ MarkerSet.set_id;
			theNewDiv.className = 'module box';

			var setTitle = "<h3 class='gmapsidetitle'>" + MarkerSet.name + "</h3>";
 			
			var theIcon = "<img src='http://www.google.com/mapfiles/marker.png' class='gmapsideicon' style='width:20px; height:34px;'>"; 
			var IconStyles = BitMap.MapData[this.index].IconStyles;
			for (var m=0; m<IconStyles.length; m++){
			  var IconStyle = IconStyles[m];
				if ( IconStyle.icon_id == IconStyle.icon_id ){
					var theIcon = "<img src='" + IconStyle.image + "' class='gmapsideicon' style='width:" + IconStyle.icon_w + "px; height:" + IconStyle.icon_h + "px;'>"; 
				}
			}

			var setDesc = "<div class='gmapsidedesc'>" + theIcon + " " + MarkerSet.description + "<div style='clear:both'></div></div>";
			var setList = "<div class='boxcontent gmapsidelist' id='listset_" + MarkerSet.set_id + "'></div>";
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
		for ( var q=0; q<this.markers.length; q++ ){
			//sort alphabetically
			//if show set == y and show marker == y
			var Marker = this.markers[q];
			if ( Marker.side_panel == true && Marker.explode == true ) {

				if (Marker.marker_type == 1){
					var urlSrc = Marker.photo_url;
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
		      theNewLink.href = "javascript: BitMap.MapData[0].Map.markers["+i+"].gmarker.openInfoWindowHtml(BitMap.MapData[0].Map.markers["+i+"].gmarker.my_html);";
					theNewLink.innerHTML = Marker.title + imgLink;

//					var theText = document.createTextNode( bMData[q].title);
//					theNewLink.appendChild(theText);

					var BR = document.createElement('br');
					document.getElementById('listset_'+ Marker.set_id).appendChild(theNewLink);
					document.getElementById('listset_'+ Marker.set_id).appendChild(BR);

					/*
					var openWindowLink = "<a href='javascript: bMData["+q+"].marker.openInfoWindowHtml(bMData["+q+"].marker.my_html'>"+bMData[q].title+"</a>";
					var attachLink = "<a href='javascript: attachMarker(" + bMData[q].array_n + ", true);'>attach</a>";
					document.getElementById('listset_'+ bMData[q].set_id).innerHTML = openWindowLink + " " + attachLink;
					*/

					//copy model html div
					//attach to document
  				//if marker is set to init
					if ( Marker.plot_on_load == true ) {
  					//set loaded to true
					}else{
  					//set loaded to false
					}
			}
		}
	}
};
