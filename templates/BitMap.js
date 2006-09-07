if (typeof(BitMap) == 'undefined') {
    BitMap = {};
}

if (typeof(BitMap.MapData) == 'undefined') {
    BitMap.MapData = [];
}

// for displaying and hiding menu parts
BitMap.show = function (i){
	document.getElementById(i).style.display = "block";
};

BitMap.hide = function (i){
	document.getElementById(i).style.display = "none";
};

//for changing elm class properties
//(action,domelm,class1,class2)
BitMap.jscss = function (a,o,c1,c2){
  switch (a){
    case 'swap':
      o.className=!BitMap.jscss('check',o,c1)?o.className.replace(c2,c1):o.className.replace(c1,c2);
    break;
    case 'add':
      if(!BitMap.jscss('check',o,c1)){o.className+=o.className?' '+c1:c1;}
    break;
    case 'remove':
      var rep=o.className.match(' '+c1)?' '+c1:c1;
      o.className=o.className.replace(rep,'');
    break;
    case 'check':
      return new RegExp('\\b'+c1+'\\b').test(o.className)
    break;
  }
};

BitMap.Display = function(){
  BitMap.Initialize();
  BitMap.MapData[0].Map.addOverlayListener();
  BitMap.MapData[0].Map.attachSideMarkers();
};

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
      BitMap.MapData[n].id,
      BitMap.MapData[n].title,
      BitMap.MapData[n].description,      
      BitMap.MapData[n].data,
      BitMap.MapData[n].parsed_data,
      BitMap.MapData[n].width,
      BitMap.MapData[n].height,
      {lat: BitMap.MapData[n].lat, lng: BitMap.MapData[n].lng},
      BitMap.MapData[n].zoom,
      BitMap.MapData[n].maptype,
      {scale: BitMap.MapData[n].scale, maptype_control:BitMap.MapData[n].maptype_control, zoom_control: BitMap.MapData[n].zoom_control, overview_control: BitMap.MapData[n].overview_control},
      BitMap.MapData[n].Maptypes,
      BitMap.MapData[n].Markers,
      BitMap.MapData[n].MarkerSets,
      BitMap.MapData[n].MarkerStyles,
      BitMap.MapData[n].IconStyles,
      BitMap.MapData[n].Polylines,
      BitMap.MapData[n].PolylineSets,
      BitMap.MapData[n].PolylineStyles,
      BitMap.MapData[n].Polygons,
      BitMap.MapData[n].PolygonSets,
      BitMap.MapData[n].PolygonStyles
      );
  };
};

//center is an object containing .lat and .lng
//controls is an object containing .scale .type_control .zoom_control
BitMap.Map = function (index, mapdiv, id, title, desc, data, parsed_data, width, height, center, zoom, maptype, controls, maptypes, markers, markersets, markerstyles, iconstyles, polylines, polylinesets, polylinestyles, polygons, polygonsets, polygonstyles) {
  this.index = index;
  this.mapdiv = mapdiv;
  this.id = id;
  this.title = title;
  this.description = desc;
  this.data = data;
  this.parsed_data = parsed_data;
  this.width = width;
  this.height = height;
  this.center = center;
  this.zoom = zoom;
  this.maptype = maptype;
  this.controls = controls;
  this.maptypes = maptypes;
  this.markers = markers;
  this.markersets = markersets;
  this.markerstyles = markerstyles;
  this.iconstyles = iconstyles;
  this.polylines = polylines;
  this.polylinesets = polylinesets;
  this.polylinestyles = polylinestyles;
  this.polygons = polygons;
  this.polygonsets = polygonsets;
  this.polygonstyles = polygonstyles;
  this.map = new GMap2(document.getElementById(this.mapdiv));
  this.map.setCenter(new GLatLng(this.center.lat, this.center.lng), this.zoom);
  this.SetMapType();
  this.SetControls();
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
  if (this.controls.maptype_control == true){
    this.map.addControl(new GMapTypeControl());  
  }
  if (this.controls.overview_control == true){
    this.map.addControl(new GOverviewMapControl());  
  }
};


BitMap.Map.prototype.SetMapType = function(){
  if (this.maptype < 3){
    switch (this.maptype){
      case 0: this.map.setMapType(G_NORMAL_MAP);
        break;
      case 1: this.map.setMapType(G_SATELLITE_MAP);
        break;
      case 2: this.map.setMapType(G_HYBRID_MAP);
        break;
    }
  }else{
    //insert check for maptype name in maptype array and set map to that
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
  var Maptypes = this.maptypes;
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
	var i = this.iconstyles;
	if (i.length > 0){
  	for (n=0; n<i.length; n++){
  		if (i[n].icon_style_type != null && i[n].icon_style_type == 0){
  			this.defineGIcon(n);
  		}
  	}
	}
};


//@todo - these image paths may not be universal enough, may need to get the root from kernel
BitMap.Map.prototype.defineGIcon = function(i){
		var IconStyle = this.iconstyles[i];
		IconStyle.icon = new GIcon();
		IconStyle.icon.image = IconStyle.image;
		IconStyle.icon.iconSize = new GSize(IconStyle.icon_w, IconStyle.icon_h);
		IconStyle.icon.iconAnchor = new GPoint(IconStyle.icon_anchor_x, IconStyle.icon_anchor_y);
		IconStyle.icon.shadow = IconStyle.shadow_image;
		IconStyle.icon.shadowSize = new GSize(IconStyle.shadow_w, IconStyle.shadow_h);
		IconStyle.icon.infoShadowAnchor = new GPoint(IconStyle.shadow_anchor_x, IconStyle.shadow_anchor_y);
		IconStyle.icon.infoWindowAnchor = new GPoint(IconStyle.infowindow_anchor_x, IconStyle.infowindow_anchor_y);
};



BitMap.Map.prototype.addMarker = function(i){
  if (this.markers[i]!= null && this.markers[i].plot_on_load == true){
    var M = this.markers[i];
    
    //a variable to set a marker to open on initialization
    //not implemented! script will break if removed    
    var o = false;
    
    var icon = null;
    if (M.icon_id != 0 && M.icon_id != null){
	   var is = this.iconstyles;
		  for (var b=0; b<is.length; b++){
			 if ( is[b].icon_id == M.icon_id ){
			   icon = b;
			 }
		  }
    }
	if (M.style_id == 0 || typeof( M.style_id ) == 'undefined' || M.style_id == null){
	  this.defineGMarker(i, icon);
	  if (o == true) {M.gmarker.openInfoWindowHtml( M.gmarker.my_html );};
    }else{
  	 var s;
  	 var MarkerStyles = this.markerstyles; 
      for (var c=0; c<MarkerStyles.length; c++){
    	 if ( MarkerStyles[c].style_id == M.style_id ){
    		s = c;
    	 }
  	  }
  	 if ( MarkerStyles[s].marker_style_type == 0){
  		this.defineGxMarker(n, icon, s);
			if (o == true) {M.gmarker.openInfoWindowHtml(M.gmarker.my_html);};
  	 }else if ( MarkerStyles[s].marker_style_type == 1){
  		this.definePdMarker(n, icon, s);
			if (o == true) {
        	M.gmarker.showTooltip();
        	M.gmarker.hideTooltip();
			  M.gmarker.showDetailWin();
			};
  	 }
	 }
  }
};



BitMap.Map.prototype.defineGMarker = function(i, n){
  var M = this.markers[i];
  var p = new GLatLng(parseFloat(M.lat), parseFloat(M.lng));
  var myicon = (n != null)?this.iconstyles[n].icon:null;
  var mytitle;
  //add marker roll over
  if (typeof(M.label_data) != 'undefined' && M.label_date != null){
    mytitle = M.label_data;
  }else if (typeof(M.title) != 'undefined' && M.title != null){
    mytitle = M.title;
  }
	  	
  M.gmarker = new GMarker(p, {icon: myicon, title:mytitle});
  
  //@todo why is this here?
  //M.gmarker.style_id = 0;
 
  var imgLink ="";
  if (M.marker_type == 1){
		var urlSrc = Marker.photo_url;
		var pos = urlSrc.lastIndexOf('.');
		var str_1 = urlSrc.substring(0, pos);
		var str_2 = urlSrc.substring(pos, urlSrc.length); 
		var medUrl = str_1 + "_medium" + str_2;
		//@todo add some better form of pathing to image
		var imgLink = ["<p><a onClick=\"javascript: window.open('", urlSrc, "','", /*//@todo: PathToRoot here*/ "')\"><img src='", medUrl, "'></a></p>"].join("");
  }

  //@todo this needs to be better
  var creator = (M.creator_real_name != '')?["Created by: ", M.creator_real_name].join(""):'';
  var url = (M.display_url != '')?["<p>", "<a href='", M.display_url, "'/>view item</a>", "</p>"].join(""):'';
  var data = [creator, url].join("");
  if ( typeof(M.parsed_data)!='undefined' ){
    data = [data, "<p>", M.parsed_data, "</p>"].join("");
  }  
  M.gmarker.my_html = ["<div style='white-space: nowrap;'><h1 class='markertitle'>", M.title, "</h1>", imgLink, data, "</div>"].join("");
 
  this.map.addOverlay(M.gmarker);
}



BitMap.Map.prototype.defineGxMarker = function(n, i, s){
	var a = this.markers;

	var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = this.iconstyles[i].icon;
	}
	var mytip = "<div class='tip-"+this.markerstyles[s].name + "'>" + a[n].label_data + "</div>";
  a[n].gmarker = new GxMarker(point, icon, mytip);
  a[n].gmarker.marker_style_type = 0;

	var imgLink ='';
	if (a[n].marker_type == 1){
		var urlSrc = a[n].photo_url;
		var pos = urlSrc.lastIndexOf('.');
		var str_1 = urlSrc.substring(0, pos);
		var str_2 = urlSrc.substring(pos, urlSrc.length); 
		var medUrl = str_1 + "_medium" + str_2;
		var imgLink = "<p><img src='"+medUrl+"'></p>"
	}

  a[n].gmarker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+a[n].title+"</h1>" + imgLink + "<p>"+a[n].parsed_data+"</p></div>";
  this.map.addOverlay(a[n].gmarker);
}



BitMap.Map.prototype.definePdMarker = function(n, i, s){
	var a = this.markers;

	//PdMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (i != null){
		icon = this.iconstyles[i].icon;
	}
  a[n].gmarker = new PdMarker(point, icon);
  a[n].gmarker.marker_style_type = 1;
  a[n].gmarker.setTooltipClass( "tip-"+this.markerstyles[s].name );
  a[n].gmarker.setDetailWinClass( "win-"+this.markerstyles[s].name );
  a[n].gmarker.setTooltip( "<div>" + a[n].label_data + "</div>");

	var imgLink ='';
	if (a[n].marker_type == 1){
		var urlSrc = a[n].photo_url;
		var pos = urlSrc.lastIndexOf('.');
		var str_1 = urlSrc.substring(0, pos);
		var str_2 = urlSrc.substring(pos, urlSrc.length); 
		var medUrl = str_1 + "_medium" + str_2;
		var imgLink = "<p><img src='"+medUrl+"'></p>"
	}

  a[n].gmarker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+a[n].title+"</h1>" + imgLink + "<p>"+a[n].parsed_data+"</p></div>";
  a[n].gmarker.setDetailWinHTML( a[n].marker.my_html );
  //rollover-icon: a[n].marker.setHoverImage("http://www.google.com/mapfiles/dd-start.png");
  this.map.addOverlay(a[n].gmarker);
}


BitMap.Map.prototype.attachPolylines = function(){
	//get the array we are working on
	var a = this.polylines;
	//if the length of the array is > 0
	if (a.length > 0){
  	//loop through the array
		for(n=0; n<a.length; n++){
  		//if the array item is not Null
			if (a[n]!= null && a[n].plot_on_load == true){
				this.attachPolyline(n);
			}
		}
	}
};


BitMap.Map.prototype.attachPolyline = function(n){
	var a = this.polylines;
	if (a[n].style_id == 0){
		this.defineGPolyline(n);
	}else{
		var s;
		var PolylineStyles = this.polylinestyles;
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
	var a = this.polylines;

  var pointlist = new Array();
  for (p = 0; p < a[n].points_data.length; p+=2 ){
  	var point = new GPoint(
  		parseFloat(a[n].points_data[p]),
  		parseFloat(a[n].points_data[p+1])
  	);
		pointlist.push(point);
  };

	if ( s != null ){
		var PolylineStyle = this.polylinestyles[s];	
    var linecolor = "#"+PolylineStyle.color;
    var lineweight = PolylineStyle.weight;
    var lineopacity = PolylineStyle.opacity;
  };

  a[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
  this.map.addOverlay(a[n].polyline);
};


//@todo not sure if this can be supported in V2, requires Xmaps Lib
BitMap.Map.prototype.defineXPolyline = function(n, s){
	var a = this.polylines;

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
	var PolylineStyle = this.polylinestyles[s];	
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
	var a = this.polygons;

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
	var Polygon = this.polygons[n];
	var PolylineStyles = this.polylinestyles;
	var PolygonStyles = this.polygonstyles;
	for (var b=0; b<PolylineStyles.length; b++){
		if ( PolylineStyles[b].style_id == Polygon.polylinestyle_id ){
			s = b;
		}
	}
	for (var c=0; c<PolygonStyles.length; c++){
		if ( PolygonStyles[c].style_id == Polygon.style_id ){
			p = c;
		}
	}
	this.defineXPolygon(n, s, p);
}


BitMap.Map.prototype.defineXPolygon = function(n, s, p){
	var fillstyle = {};
	var linestyle = {};

	var a = this.polygons;

	//Create XPolygon styles
 	if (p != null){
	  var PolygonStyle = this.polygonstyles[p];
		var fillcolor = "#"+PolygonStyle.color;
		fillstyle = {
  		color: fillcolor,
  		weight: PolygonStyle.weight,
  		opacity: PolygonStyle.opacity
		}
	}

 	if (s != null){
	  var PolylineStyle = this.polylinestyles[s];
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
BitMap.Map.prototype.attachSideMarkersOld = function(){

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
