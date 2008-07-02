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

BitMap.Display = function(){
  BitMap.Initialize(400);
  BitMap.MapData[0].Map.addOverlayListener();
  if( $('gmap-sidepanel') ){ BitMap.MapData[0].Map.attachSideMarkers(); };
};

BitMap.DisplaySimple = function(){
  BitMap.Initialize(0);
};

BitMap.DisplayList = function(){
  BitMap.MakeCalendar();
  BitMap.Initialize(400);
  BitMap.MapData[0].Map.addOverlayListener();
  BitMap.MapData[0].Map.attachSideMarkers();
};

BitMap.EditContent = function(){
  BitMap.Initialize(400);
  var MD = BitMap.MapData[0];
  MD.Map.map.addOverlay(new GMarker( new GLatLng( MD.lat, MD.lng ) ));
  MD.Map.addLatLngCapture();
};


BitMap.Initialize = function(minsize){
  var count = BitMap.MapData.length;
  for (n=0; n<count; n++){
    BitMap.MapData[n].Map = new BitMap.Map(
      n,
      BitMap.MapData[n].mapdiv,
      BitMap.MapData[n].id,
      BitMap.MapData[n].width,
      BitMap.MapData[n].height,
      {lat: BitMap.MapData[n].lat, lng: BitMap.MapData[n].lng},
      BitMap.MapData[n].zoom,
      minsize,
      BitMap.MapData[n].maptype,
      {scale: BitMap.MapData[n].scale, maptype_control:BitMap.MapData[n].maptype_control, zoom_control: BitMap.MapData[n].zoom_control, overview_control: BitMap.MapData[n].overview_control},
      BitMap.MapData[n].allow_comments,
      BitMap.MapData[n].Maptypes,
      BitMap.MapData[n].Tilelayers,
      BitMap.MapData[n].Copyrights,
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
BitMap.Map = function (index, mapdiv, id, width, height, center, zoom, minsize, maptype, controls, allow_comments, maptypes, tilelayers, copyrights, markers, markersets, markerstyles, iconstyles, polylines, polylinesets, polylinestyles, polygons, polygonsets, polygonstyles) {
	this.index = index;
	this.mapdiv = mapdiv;
	this.id = id;
	this.width = width;
	this.height = height;
	this.center = center;
	this.zoom = zoom;
	this.minsize = minsize;
	this.maptype = maptype;
	this.controls = controls;
	this.allow_comments = allow_comments;
	this.maptypes = maptypes;
	this.tilelayers = tilelayers;
	this.copyrights = copyrights;
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
	this.setControls();

	//auto resize stuff
	if (this.height == 0){
		this.MR = BitMap.Utl.MapResize;
		//set these variables to customize
		var elms = []
		if ($('gmap-header')){ elms.push($('gmap-header'))};
		if ($('footer')){ elms.push($('footer'))};
		this.MR.regOffsetObjs(elms);
		this.MR.regOffsetBonus(0);
		this.MR.regMinSize(this.minsize);
		//these are constants dont mess with them
		this.MR.regMap(this.map);
		this.MR.regMapDiv($(this.mapdiv));
		if ($('gmap-sidepanel')){ this.MR.regPanelDiv($('gmap-sidepanel')) };
		this.MR.sizeMapDiv();
		this.MR.setResizeListener();
		this.map.checkResize();
	}
	
	this.map.setCenter(new GLatLng(this.center.lat, this.center.lng), this.zoom);
	
	if (this.maptypes.length > 0){
	var ref = this;
	this.loopOver(ref.maptypes, function(i){ref.addMaptype(i);});
	}
	
	this.setMapType();
	
	if (this.iconstyles.length > 0){
	var ref = this;
	this.loopOver(ref.iconstyles, function(i){ref.defineGIcon(i);});
	} 
	
	if (this.markers.length > 0){
	var ref = this;
	this.loopOver(ref.markers, function(i){ if(ref.markers[i].plot_on_load == true){ ref.addMarker(i);} });
	}  

	if (this.polylines.length > 0){
	var ref = this;
	this.loopOver(ref.polylines, function(i){ref.addPolyline(i);});
	}	
	
	if (this.polygons.length > 0){
	var ref = this;
	this.loopOver(ref.polygons, function(i){ref.addPolygon(i);});
	}	
}

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

	"setControls": function(){
		if(this.controls.scale == true){
			this.scaleControl = new GScaleControl();
			this.map.addControl( this.scaleControl );
		}
		switch (this.controls.zoom_control){
			case 's': 
				this.navControls = new GSmallMapControl();
				break;
			case 'l': 
				this.navControls = new GLargeMapControl();
				break;
			case 'z': 
				this.navControls = new GSmallZoomControl();
				break;
			default:
				this.navControls = null;
				break;
		}
		if ( this.navControls != null ){
			this.map.addControl( this.navControls );
		}
		if (this.controls.maptype_control == true){
			var mini = (this.width == 0 && this.minsize < 200)?true:false;
			this.typeControl = new GMapTypeControl(mini);
			this.map.addControl( this.typeControl );  
		}
		if (this.controls.overview_control == true){
			this.map.addControl(new GOverviewMapControl());  
		}
	},
	
	"makeGetTileUrl": function( url ){
		var func = function(a, b){
					var c = 17 - b;
					return url+"?x="+a.x+"&y="+a.y+"&zoom="+c;
				};
		return func;
	},
	
	"addMaptype": function(i){
		var M = this.maptypes[i];

		var layers = [];

		for (m in M.tilelayer_ids ){
			for (n in this.tilelayers){
				if (this.tilelayers[n].tilelayer_id == M.tilelayer_ids[m]){
					var T = this.tilelayers[n];
					//get copyright info
					var copyrightCollection = new GCopyrightCollection();
					for (c in this.copyrights){
						var C = this.copyrights[c];
						if (C.tilelayer_id == T.tilelayer_id){
							// create copyright
							var copyright = new GCopyright(C.copyright_id,
												  new GLatLngBounds( new GLatLng( C.bounds[0],C.bounds[1] ), new GLatLng( C.bounds[2],C.bounds[3] ) ),
												  C.copyright_minzoom,
												  C.notice);
							
							//add to copyright collection
							copyrightCollection.addCopyright(copyright);
						}
					}
	
					layers.push( new GTileLayer( copyrightCollection, T.tiles_minzoom, T.tiles_maxzoom ) );
					x = layers.length-1;
					layers[x].getTileUrl = this.makeGetTileUrl( T.tilesurl );
					
					if ( T.ispng == true || T.ispng == 'true' ){
						layers[x].isPng = function(){return true;};
					}else{
						layers[x].isPng = function(){return false;};
					}	
				}
			}
		}
		
		var opts = {};
		opts.shortName = M.shortname?M.shortname:M.name;
		opts.minResolution = (M.minzoom != null)?M.minzoom:0;
		opts.maxResolution = (M.maxzoom != null)?M.maxzoom:17;
		opts.errorMessage = M.errormsg?M.errormsg:"";

		M.type = new GMapType(layers, G_NORMAL_MAP.getProjection(), M.name, opts);
		this.map.addMapType(M.type);
	},
	
	"setMapType": function(){
		if (this.maptype < 1){
			switch (this.maptype){
				case 0: 
					this.map.setMapType(G_NORMAL_MAP);
					break;
				case -1: 
					this.map.setMapType(G_SATELLITE_MAP);
					break;
				case -2: 
					this.map.setMapType(G_HYBRID_MAP);
					break;
			}
		}else{
		//insert check for maptype name in maptype array and set map to that
			var count = this.maptypes.length;
			for (n=0; n<count; n++){
				if (this.maptypes[n].maptype_id == this.maptype){
					this.map.setMapType(this.maptypes[n].type);
				}
			}
		}
	},

	"addOverlayListener": function(){
		GEvent.addListener(this.map, "click", function(overlay) {
			if (overlay){ 
				if (overlay.my_html){ 
					if (overlay.my_maxurl){
						overlay.openInfoWindow(overlay.my_html, {maxUrl:overlay.my_maxurl});
					}else{
						overlay.openInfoWindow(overlay.my_html);
					}
				}else{
					if (overlay.type == 'marker'){
						BitMap.MapData[0].Map.openMarkerWindow(overlay.index);
					}
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
	}

}
//end of BitMap.Map.prototype declaration

//this is temporary - google map api requires it in current version, future versions will not - dumb.
var _mFlags = {};
