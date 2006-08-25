if (typeof(BitMap) == 'undefined') {
    BitMap = {};
}

if (typeof(BitMap.MapData) == 'undefined') {
    BitMap.MapData = [];
}


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


BitMap.Map.prototype.addMarker = function(i){
	var p = new GLatLng(parseFloat(this.markers[i].lat), parseFloat(this.markers[i].lng));
	var tx = this.markers[i].title
	this.createMarker(p, tx, i);
};


BitMap.Map.prototype.createMarker = function(p, tx, i, t) {
	this.markers[i].gmarker = new GMarker(p);
	this.markers[i].gmarker.my_html = tx;
	this.map.addOverlay(this.markers[i].gmarker);
};


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
