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
BitMap.Map.prototype = {
	"loopOver": function(arr, fnc){
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
	},

	"SetControls": function(){
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
	},

	"SetMapType": function(){
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
			var count = this.maptypes.length;
			for (n=0; n<count; n++){
				if (this.maptypes[n].maptype_id == this.maptype){
					this.map.setMapType(this.maptypes[n].name);
				}
			}
		}
	},

	"addOverlayListener": function(){
		GEvent.addListener(this.map, "click", function(overlay) {
			if (overlay){ 
				if (overlay.my_html){ 
					overlay.openInfoWindow(overlay.my_html);
				}
			}
		});
	},

	"addLatLngCapture": function(){
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
	},

/*--------------------------------------------------------------------*/
/*@todo this is a rough rewrite 
 *      need to look into hybrid types
 *      and what to do about boundry areas
 *      and what to show there 
 *      Also might need some variable to
 *      deal with V1 tile stack vs V2 tile stack  
 */
// Adds all MapTypes, it is called from loadMap()
	"addMapTypes": function(pParamHash){
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
	}
}
//end of BitMap.Map.prototype declaration

