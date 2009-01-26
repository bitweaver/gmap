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

BitMap.Display = function(type) {
	BitMap.Initialize(400);
	var MD = BitMap.MapData[0];
	switch(type){
		case "marker":
			MD.Map.map.addOverlay(new GMarker( new GLatLng( MD.lat, MD.lng ) ));
			break;
		case "polyline":
		case "polygon":
			/* poly overlays are attached in init process */
			MD.Map.centerMapOnPoly(MD.Map[type+"s"][0][type]);
			break;
		case "map":
		default:
			MD.Map.addOverlayListener();
			if( $('gmap-sidepanel') ){ MD.Map.attachSideMarkers(); };
			break;
	}
};

BitMap.DisplaySimple = function(){
  BitMap.Initialize(0);
};

BitMap.DisplayList = function(){
	BitMap.MakeCalendar();
	BitMap.Initialize(400);
	var Map = BitMap.MapData[0].Map;
	Map.addOverlayListener();
	Map.attachSideMarkers();
	if( Map.markers.length > 0 ){
		// add pagination
		Map.attachPagination(BitMap.listInfo);
		// make all visible within map
		var bounds = new GLatLngBounds(); 
		for (i=0;i<Map.markers.length;i++) { 
			bounds.extend(Map.markers[i].gmarker.getPoint()); 
		} 
		var center = bounds.getCenter(); 
		var zoom = Map.map.getBoundsZoomLevel(bounds); 
		zoom = zoom>-1?zoom-1:zoom;
		Map.map.setCenter(center,zoom);
	}
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
	  var MD = BitMap.MapData[n];
	  MD.index = n;
	  MD.minsize = minsize;
	  MD.Map = new BitMap.Map( MD );
  };
};

BitMap.Map = function ( pHash ){
	this.index = pHash.index;
	this.mapdiv = pHash.mapdiv;
	this.id = pHash.id;
	this.width = pHash.width;
	this.height = pHash.height;
	this.center = {lat:pHash.lat, lng:pHash.lng};
	this.zoom = pHash.zoom;
	this.minsize = pHash.minsize;
	this.maptype = pHash.maptype;
	this.controls = {scale:pHash.scale, maptype_control:pHash.maptype_control, zoom_control:pHash.zoom_control, overview_control:pHash.overview_control},
	this.allow_comments = pHash.allow_comments;
	this.maptypes = pHash.Maptypes;
	this.tilelayers = pHash.Tilelayers;
	this.copyrights = pHash.Copyrights;
	this.markers = pHash.Markers;
	this.markersets = pHash.MarkerSets;
	this.markerstyles = pHash.MarkerStyles;
	this.iconstyles = pHash.IconStyles;
	this.polylines = pHash.Polylines;
	this.polylinesets = pHash.PolylineSets;
	this.polylinestyles = pHash.PolylineStyles;
	this.polygons = pHash.Polygons;
	this.polygonsets = pHash.PolygonSets;
	this.polygonstyles = pHash.PolygonStyles;
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

	if (this.polygons.length > 0){
	var ref = this;
	this.loopOver(ref.polygons, function(i){ref.addPolygon(i);});
	}	

	if (this.polylines.length > 0){
	var ref = this;
	this.loopOver(ref.polylines, function(i){ref.addPolyline(i);});
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

	"getXMLTagValue": function( xml, tag ){
		var node = xml.getElementsByTagName( tag );
		if( typeof( node[0] ) != 'undefined' ){
			return this.getNodeValue( node[0].firstChild );
		}
		return null;
	},

	"getNodeValue": function( node ){
		if( node != null ){
			return node.nodeValue;
		}
		return null;
	},

	"toUpperCaseFirst": function(str){
        var typeInitCap = str;
        var tmpChar = typeInitCap.substring(0,1).toUpperCase();
        var postString = typeInitCap.substring(1,typeInitCap.length);
        typeInitCap = tmpChar + postString;
        return typeInitCap;
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
		var a = url.search(/\?/)>-1?url:url+"?";
		var b = url.search(/google.com/)>-1?17:0;
		var $f = function(p, z){
					z = b?b-z:z;
					return a+"&x="+p.x+"&y="+p.y+"&zoom="+z;
				};
		return $f;
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
	
					var opts = {
						'isPng':( T.ispng == true || T.ispng == 'true' )?true:false,
						'opacity':T.opacity
					}
					layers.push( new GTileLayer( copyrightCollection, T.tiles_minzoom, T.tiles_maxzoom, opts ) );
					x = layers.length-1;
					layers[x].getTileUrl = this.makeGetTileUrl( T.tilesurl );
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
		GEvent.addListener(this.map, "click", function(overlay, point, overlaypoint) {
			if (overlay){ 
				if (overlay.type == 'marker'){
					BitMap.MapData[0].Map.openMarkerWindow(overlay.index);
				}else if( overlay.type != undefined ){
					BitMap.MapData[0].Map.openOverlayWindow(overlay.type, overlay.index, overlaypoint);
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
