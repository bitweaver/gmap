<script type="text/javascript">//<![CDATA[

// Copy Object Function
function copy_obj(o) {ldelim}
	var c = new Object(); 
	for (var e in o) {ldelim}
		c[e] = o[e]; 
	{rdelim} 
	return c;
{rdelim}



//@todo insert variables for zoomed out tiles path, and hybrid type tiles path
// Adds all MapTypes, it is called from loadMap()
function addMapTypes(pParamHash){ldelim}
	for (var n=0; n < pParamHash.length; n++) {ldelim}
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



function attachIcons(){ldelim}
	var i = bMIconData;
	if (i.length > 0){ldelim}
  	for (n=0; n<i.length; n++){ldelim}
  		if (i[n].type != null && i[n].type == 0) {ldelim}
  			defineGIcon(n);
  		{rdelim}else if(i[n].type != null && i[n].type == 1){ldelim}
  			defineXIcon(n);			
  		{rdelim}
  	{rdelim}
	{rdelim}
{rdelim}


//@todo - these image paths may not be universal enough, may need to get the root from kernel
function defineGIcon(n){ldelim}
		bMIconData[n].icon = new GIcon();
		bMIconData[n].icon.image = bMIconData[n].image;
		bMIconData[n].icon.iconSize = new GSize(bMIconData[n].icon_w, bMIconData[n].icon_h);
		bMIconData[n].icon.iconAnchor = new GPoint(bMIconData[n].icon_anchor_x, bMIconData[n].icon_anchor_y);
		bMIconData[n].icon.shadow = bMIconData[n].shadow_image;
		bMIconData[n].icon.shadowSize = new GSize(bMIconData[n].shadow_w, bMIconData[n].shadow_h);
		bMIconData[n].icon.infoShadowAnchor = new GPoint(bMIconData[n].shadow_anchor_x, bMIconData[n].shadow_anchor_y);
		bMIconData[n].icon.infoWindowAnchor = new GPoint(bMIconData[n].infowindow_anchor_x, bMIconData[n].infowindow_anchor_y);
{rdelim};


//@todo this is just a copy of GIcon right now and needs to be fully implemented
function defineXIcon(n){ldelim}
    //make the shape
    var triShape = {ldelim}
        iconAnchor: new GPoint(15, 26),
        infoWindowAnchor: new GPoint(15, 0),
        shadow: true,
        contentAnchor: new GPoint(0, 0),
        contentSize: new GSize(31, 20),
        points: [0,0,15,26,30,0]
    {rdelim};
    
    //put shape in the shape hash
    XIcon.shapes['triangle'] = triShape;
    
    //create the styles
    var triStyle = {ldelim}
        scale: 1.5,
        outlineColor: '#ffffff',
        outlineWeight: 2,
        fillColor: '#7f00ff',
        fillOpacity: 0.5
    {rdelim};    

		bMIconData[n].icon = new XIcon('triangle', triStyle);
/*
		bMIconData[n].icon.image = bMIconData[n].image;
		bMIconData[n].icon.iconSize = new GSize(bMIconData[n].icon_w, bMIconData[n].icon_h);
		bMIconData[n].icon.iconAnchor = new GPoint(bMIconData[n].icon_anchor_x, bMIconData[n].icon_anchor_y);
		bMIconData[n].icon.shadow = bMIconData[n].shadow_image;
		bMIconData[n].icon.shadowSize = new GSize(bMIconData[n].shadow_w, bMIconData[n].shadow_h);
		bMIconData[n].icon.infoShadowAnchor = new GPoint(bMIconData[n].shadow_anchor_x, bMIconData[n].shadow_anchor_y);
		bMIconData[n].icon.infoWindowAnchor = new GPoint(bMIconData[n].infowindow_anchor_x, bMIconData[n].infowindow_anchor_y);
*/
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
				var iconn = null;
				if (a[n].icon_id != 0){ldelim}
					for (var c=0; c<bMIconData.length; c++){ldelim}
						if ( bMIconData[c].icon_id == a[n].icon_id ){ldelim}
							iconn = c;
						{rdelim}
					{rdelim}
				{rdelim}
				if (a[n].style_id == 0){ldelim}
					defineGMarker(arrayId, n, iconn);
				{rdelim}else{ldelim}
					var stylen;
					for (var b=0; b<bMStyleData.length; b++){ldelim}
						if ( bMStyleData[b].style_id == a[n].style_id ){ldelim}
							stylen = b;
						{rdelim}
					{rdelim}
					if ( bMStyleData[stylen].type == 0){ldelim}
						defineGxMarker(arrayId, n, iconn, stylen);
					{rdelim}else if ( bMStyleData[stylen].type == 1){ldelim}
						definePdMarker(arrayId, n, iconn, stylen);
					{rdelim}else if ( bMStyleData[stylen].type == 2){ldelim}
						defineXMarker(arrayId, n, iconn, stylen);
					{rdelim}
				{rdelim}
			{rdelim}
		{rdelim}
	{rdelim};
{rdelim};




function defineGMarker(i, n, c){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (c != null){ldelim}
		icon = bMIconData[c].icon;
	{rdelim}
  a[n].marker = new GMarker(point, icon);
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



function defineGxMarker(i, n, c, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

	var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (c != null){ldelim}
		icon = bMIconData[c].icon;
	{rdelim}
	var mytip = "<div class='tip-"+bMStyleData[s].name + "'>" + a[n].label_data + "</div>";
  a[n].marker = new GxMarker(point, icon, mytip);
  a[n].marker.type = 0;
  a[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+a[n].title+"</strong><p>"+a[n].data+"</p></div>";
  map.addOverlay(a[n].marker);
{rdelim}



function definePdMarker(i, n, c, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

	//PdMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var icon = null;
	if (c != null){ldelim}
		icon = bMIconData[c].icon;
	{rdelim}
  a[n].marker = new PdMarker(point, icon);
  a[n].marker.type = 1;
  a[n].marker.setTooltipClass( "tip-"+bMStyleData[s].name );
  a[n].marker.setDetailWinClass( "win-"+bMStyleData[s].name );
  a[n].marker.setTooltip( "<div>" + a[n].label_data + "</div>");
  a[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+a[n].title+"</strong><p>"+a[n].data+"</p></div>";
  a[n].marker.setDetailWinHTML( a[n].marker.my_html );
  //rollover-icon: a[n].marker.setHoverImage("http://www.google.com/mapfiles/dd-start.png");
  map.addOverlay(a[n].marker);
{rdelim}



function defineXMarker(i, n, c, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bIMData;
	{rdelim}else{ldelim}
  	a = bSMData;
	{rdelim};

	var icon = null;
	if (c != null){ldelim}
		icon = bMIconData[c].icon;
	{rdelim}

	//XMarker Style
  var point = new GPoint(parseFloat(a[n].lon), parseFloat(a[n].lat));
	var mytip = "<div class='tip-"+bMStyleData[s].name + "'>" + a[n].label_data + "</div>";
  a[n].marker = new XMarker(point, icon, null, mytip);
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

				if (a[n].style_id == 0){ldelim}
					defineGPolyline(arrayId, n);
				{rdelim}else{ldelim}
					var stylen;
					for (var b=0; b<bLStyData.length; b++){ldelim}
						if ( bLStyData[b].style_id == a[n].style_id ){ldelim}
							stylen = b;
						{rdelim}
					{rdelim}

					if ( bLStyData[stylen].type == 0){ldelim}
						defineGPolyline(arrayId, n, stylen);
					{rdelim}else{ldelim}
						defineXPolyline(arrayId, n, stylen);
					{rdelim}
				{rdelim}

			{rdelim}
		{rdelim}
	{rdelim}
{rdelim};



function defineGPolyline(i, n, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bILData;
	{rdelim}else{ldelim}
  	a = bSLData;
	{rdelim};

	//make the array of points needed
  var pointlist = new Array();
  for (p = 0; p < a[n].points_data.length; p+=2 ){ldelim}
  	var point = new GPoint(
  		parseFloat(a[n].points_data[p]),
  		parseFloat(a[n].points_data[p+1])
  	);
		pointlist.push(point);
  {rdelim};

	if (s!=null){ldelim}
    var linecolor = "#"+bLStyData[s].color;
    var lineweight = bLStyData[s].weight;
    var lineopacity = bLStyData[s].opacity;
  {rdelim};

  a[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
  map.addOverlay(a[n].polyline);
{rdelim};




function defineXPolyline(i, n, s){ldelim}
	var a;
	if (i == "I"){ldelim}
  	a = bILData;
	{rdelim}else{ldelim}
  	a = bSLData;
	{rdelim};

	//make the array of points needed
  var pointlist = new Array();
  for (p = 0; p < a[n].points_data.length; p+=2 ){ldelim}
  	var point = new GPoint(
  		parseFloat(a[n].points_data[p]),
  		parseFloat(a[n].points_data[p+1])
  	);
		pointlist.push(point);
  {rdelim};

	//if we are given a style_id we look up the styles otherwise defaults kick in
  var linecolor = "#"+bLStyData[s].color;
	var txfgcolor = "#"+bLStyData[s].text_fgstyle_color;
	var txbgcolor = "#"+bLStyData[s].text_bgstyle_color;

  var linestyle = {ldelim}
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
		textFgStyle: {ldelim} color: txfgcolor, weight: bLStyData[s].text_fgstyle_weight, opacity: bLStyData[s].text_fgstyle_opacity {rdelim},
		textBgStyle: {ldelim} color: txbgcolor, weight: bLStyData[s].text_bgstyle_weight, opacity: bLStyData[s].text_bgstyle_opacity {rdelim}
  {rdelim};

  a[n].polyline = new XPolyline(pointlist, linestyle);
  map.addOverlay(a[n].polyline);
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

	//create custom Icons
	{if count($gContent->mMapIconStyles) > 0}
		attachIcons();
	{/if}

		
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
