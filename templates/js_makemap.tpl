var bMapID = <!--{$map_id}-->;
var bMapWidth = <!--{$map_w}-->;
var bMapHeight = <!--{$map_h}-->;
var bMapLat = <!--{$map_lat}-->;
var bMapLon = <!--{$map_lon}-->;
var bZoomLevel = <!--{$map_zoom}-->;
var bMapType = <!--{$map_type}-->;
var bControls = <!--{$show_controls}-->;
var bScale = <!--{$show_scale}-->;
var bTypecontrols = <!--{$show_typecontrols}-->;


<!--{if $map_types_on eq 'y'}-->
var bMapTypes = new Array();
<!--{section name=maptypes loop=$map_types}-->
  bMapTypes[<!--{maptypes}-->].map_typeid = <!--{$map_types[maptypes].map_typeid}-->;
  bMapTypes[<!--{maptypes}-->].map_typelaunch = <!--{$map_types[maptypes].map_typelaunch}-->;
  bMapTypes[<!--{maptypes}-->].map_typeside = <!--{$map_types[maptypes].map_typeside}-->;
<!--{/section}-->
<!--{/if}-->


<!--{if $icon_styles_on eq 'y'}-->
var bIconStyles = new Array();
<!--{section name=iconstyle loop=$icon_styles}-->
  bIconStyles[<!--{iconstyle}-->].icon_id = <!--{$icon_styles[iconstyle].icon_id}-->;
  bIconStyles[<!--{iconstyle}-->].icon_name = <!--{$icon_styles[iconstyle].icon_name}-->;
  bIconStyles[<!--{iconstyle}-->].icon_type = <!--{$icon_styles[iconstyle].icon_type}-->;
  bIconStyles[<!--{iconstyle}-->].icon_img = <!--{$icon_styles[iconstyle].icon_img}-->;
  bIconStyles[<!--{iconstyle}-->].icon_w = <!--{$icon_styles[iconstyle].icon_w}-->;
  bIconStyles[<!--{iconstyle}-->].icon_h = <!--{$icon_styles[iconstyle].icon_h}-->;
  bIconStyles[<!--{iconstyle}-->].icon_shadow = <!--{$icon_styles[iconstyle].icon_shadow}-->;
  bIconStyles[<!--{iconstyle}-->].icon_shadoww = <!--{$icon_styles[iconstyle].icon_shadoww}-->;
  bIconStyles[<!--{iconstyle}-->].icon_shadowh = <!--{$icon_styles[iconstyle].icon_shadowh}-->;
  bIconStyles[<!--{iconstyle}-->].icon_anchorx = <!--{$icon_styles[iconstyle].icon_anchorx}-->;
  bIconStyles[<!--{iconstyle}-->].icon_anchory = <!--{$icon_styles[iconstyle].icon_anchory}-->;
  bIconStyles[<!--{iconstyle}-->].icon_winanchorx = <!--{$icon_styles[iconstyle].icon_winanchorx}-->;
  bIconStyles[<!--{iconstyle}-->].icon_winanchory = <!--{$icon_styles[iconstyle].icon_winanchory}-->;
  bIconStyles[<!--{iconstyle}-->].icon_hoverimg = <!--{$icon_styles[iconstyle].icon_hoverimg}-->;
<!--{/section}-->
<!--{/if}-->


<!--{if $marker_styles_on eq 'y'}-->
var bMarkerStyles = new Array();
<!--{section name=markerstyle loop=$marker_styles}-->
  bMarkerStyles[<!--{markerstyle}-->].marker_styid = <!--{$marker_styles[markerstyle].marker_styid}-->;
  bMarkerStyles[<!--{markerstyle}-->].marker_styname = <!--{$marker_styles[markerstyle].marker_styname}-->;
  bMarkerStyles[<!--{markerstyle}-->].marker_stytype = <!--{$marker_styles[markerstyle].marker_type}-->;
  bMarkerStyles[<!--{markerstyle}-->].icon_hoverop = <!--{$marker_styles[markerstyle].icon_hoverop}-->;
  bMarkerStyles[<!--{markerstyle}-->].icon_labelop = <!--{$marker_styles[markerstyle].icon_labelop}-->;
  bMarkerStyles[<!--{markerstyle}-->].icon_hoverstyle = <!--{$marker_styles[markerstyle].icon_hoverstyle}-->;
  bMarkerStyles[<!--{markerstyle}-->].marker_winstyle = <!--{$marker_styles[markerstyle].marker_winstyle}-->;
<!--{/section}-->
<!--{/if}-->


<!--{if $polyline_styles_on eq 'y'}-->
var bPolylineStyles = new Array();
<!--{section name=polylstyle loop=$polyline_styles}-->
  bPolylineStyles[<!--{polylstyle}-->].line_styid = <!--{$polyline_styles[polylstyle].line_styid}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_styname = <!--{$polyline_styles[polylstyle].line_styname}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_color = <!--{$polyline_styles[polylstyle].line_color}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_weight = <!--{$polyline_styles[polylstyle].line_weight}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_op = <!--{$polyline_styles[polylstyle].line_op}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_pattern = <!--{$polyline_styles[polylstyle].line_pattern}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_seg = <!--{$polyline_styles[polylstyle].line_seg}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_beginarrow = <!--{$polyline_styles[polylstyle].line_beginarrow}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_endarrow = <!--{$polyline_styles[polylstyle].line_arrowint}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_arrowint = <!--{$polyline_styles[polylstyle].line_font}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_font = <!--{$polyline_styles[polylstyle].line_font}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_textint = <!--{$polyline_styles[polylstyle].line_textint}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtfgcolor = <!--{$polyline_styles[polylstyle].line_txtfgcolor}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtfgweight = <!--{$polyline_styles[polylstyle].line_txtfgweight}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtfgop = <!--{$polyline_styles[polylstyle].line_txtfgop}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtfgzi = <!--{$polyline_styles[polylstyle].line_txtfgzi}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtbgcolor = <!--{$polyline_styles[polylstyle].line_bgcolor}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtbgweight = <!--{$polyline_styles[polylstyle].line_weight}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtbgop = <!--{$polyline_styles[polylstyle].line_txtbgop}-->;
  bPolylineStyles[<!--{polylstyle}-->].line_txtbgzi = <!--{$polyline_styles[polylstyle].line_txtbgzi}-->;
<!--{/section}-->
<!--{/if}-->


<!--{if $polygon_styles_on eq 'y'}-->
var bPolygonStyles = new Array();
<!--{section name=polygstyle loop=$polygon_styles}-->
  bPolygonStyles[<!--{polygstyle}-->].poly_styid = <!--{$polygon_styles[polygstyle].poly_styid}-->;
  bPolygonStyles[<!--{polygstyle}-->].poly_styname = <!--{$polygon_styles[polygstyle].poly_styname}-->;
  bPolygonStyles[<!--{polygstyle}-->].poly_color = <!--{$polygon_styles[polygstyle].poly_color}-->;
  bPolygonStyles[<!--{polygstyle}-->].poly_weight = <!--{$polygon_styles[polygstyle].poly_weight}-->;
  bPolygonStyles[<!--{polygstyle}-->].poly_op = <!--{$polygon_styles[polygstyle].poly_op}-->;
<!--{/section}-->
<!--{/if}-->


<!--{if $init_markers_on eq 'y'}-->
var bInitMarkers = new Array();
<!--{section name=initmarkerset loop=$init_markers}-->
  bInitMarkers[<!--{initmarkerset}-->] = new Array();
	<!--{section name=initmarker loop=$init_markers[initmarkerset]}-->
	bInitMarkers[<!--{initmarkerset}-->].marker = new Array();
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_id = <!--{$init_markers[initmarkerset].marker[initmarker].marker_id}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_name = <!--{$init_markers[initmarkerset].marker[initmarker].marker_name}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_lat = <!--{$init_markers[initmarkerset].marker[initmarker].marker_lat}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_lon = <!--{$init_markers[initmarkerset].marker[initmarker].marker_lon}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_iconid = <!--{$init_markers[initmarkerset].marker[initmarker].marker_iconid}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_wintext = <!--{$init_markers[initmarkerset].marker[initmarker].marker_wintext}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_styleid = <!--{$init_markers[initmarkerset].marker[initmarker].marker_styleid}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_labeltext = <!--{$init_markers[initmarkerset].marker[initmarker].marker_labeltext}-->;
	bInitMarkers[<!--{initmarkerset}-->].marker[<!--{initmarker}-->].marker_zi = <!--{$init_markers[initmarkerset].marker[initmarker].marker_zi}-->;
	<!--{/section}-->	
<!--{/section}-->
<!--{/if}-->


<!--{if $init_polylines_on eq 'y'}-->
var bInitPolylines = new Array();
<!--{section name=initpolylineset loop=$init_polylines}-->
  bInitPolylines[<!--{initpolylineset}-->] = new Array();
	<!--{section name=initpolyline loop=$init_polylines[initpolylineset]}-->
	bInitPolylines[<!--{initpolylineset}-->].line = new Array();
	bInitPolylines[<!--{initpolylineset}-->].line[<!--{initpolyline}-->].line_id = <!--{$init_polylines[initpolylineset].line[initpolyline].line_id}-->;
	bInitPolylines[<!--{initpolylineset}-->].line[<!--{initpolyline}-->].line_name = <!--{$init_polylines[initpolylineset].line[initpolyline].line_name}-->;
	bInitPolylines[<!--{initpolylineset}-->].line[<!--{initpolyline}-->].line_type = <!--{$init_polylines[initpolylineset].line[initpolyline].line_type}-->;
	bInitPolylines[<!--{initpolylineset}-->].line[<!--{initpolyline}-->].line_styleid = <!--{$init_polylines[initpolylineset].line[initpolyline].line_styleid}-->;
	bInitPolylines[<!--{initpolylineset}-->].line[<!--{initpolyline}-->].line_bordertext = <!--{$init_polylines[initpolylineset].line[initpolyline].line_bordertext}-->;
	bInitPolylines[<!--{initpolylineset}-->].line[<!--{initpolyline}-->].line_zi = <!--{$init_polylines[initpolylineset].line[initpolyline].line_zi}-->;
	<!--{/section}-->	
<!--{/section}-->
<!--{/if}-->


<!--{if $init_polygons_on eq 'y'}-->
var bInitPolygons = new Array();
<!--{section name=initpolygonset loop=$init_polygons}-->
  bInitPolygons[<!--{initpolygonset}-->] = new Array();
	<!--{section name=initpolygon loop=$init_polygons[initpolygonset]}-->
	bInitPolygons[<!--{initpolygonset}-->].poly = new Array();
	bInitPolygons[<!--{initpolygonset}-->].poly[<!--{initpolygon}-->].poly_id = <!--{$init_polygons[initpolygonset].poly[initpolygon].poly_id}-->;
	bInitPolygons[<!--{initpolygonset}-->].poly[<!--{initpolygon}-->].poly_name = <!--{$init_polygons[initpolygonset].poly[initpolygon].poly_name}-->;
	bInitPolygons[<!--{initpolygonset}-->].poly[<!--{initpolygon}-->].poly_type = <!--{$init_polygons[initpolygonset].poly[initpolygon].poly_type}-->;
	bInitPolygons[<!--{initpolygonset}-->].poly[<!--{initpolygon}-->].poly_styleid = <!--{$init_polygons[initpolygonset].poly[initpolygon].poly_styleid}-->;
	bInitPolygons[<!--{initpolygonset}-->].poly[<!--{initpolygon}-->].poly_bordertext = <!--{$init_polygons[initpolygonset].poly[initpolygon].poly_bordertext}-->;
	bInitPolygons[<!--{initpolygonset}-->].poly[<!--{initpolygon}-->].poly_zi = <!--{$init_polygons[initpolygonset].poly[initpolygon].poly_zi}-->;
	<!--{/section}-->	
<!--{/section}-->
<!--{/if}-->



<!--{if $sets_markers_on eq 'y'}-->
var bSetsMarkers = new Array();
<!--{section name=setsmarkerset loop=$sets_markers}-->
  bSetsMarkers[<!--{setsmarkerset}-->] = new Array();
	<!--{section name=marker loop=$sets_markers[setsmarkerset]}-->
	bSetsMarkers[<!--{setsmarkerset}-->].marker = new Array();
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_id = <!--{$sets_markers[setsmarkerset].marker[marker].marker_id}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_name = <!--{$sets_markers[setsmarkerset].marker[marker].marker_name}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_lat = <!--{$sets_markers[setsmarkerset].marker[marker].marker_lat}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_lon = <!--{$sets_markers[setsmarkerset].marker[marker].marker_lon}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_iconid = <!--{$sets_markers[setsmarkerset].marker[marker].marker_iconid}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_wintext = <!--{$sets_markers[setsmarkerset].marker[marker].marker_wintext}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_styleid = <!--{$sets_markers[setsmarkerset].marker[marker].marker_styleid}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_labeltext = <!--{$sets_markers[setsmarkerset].marker[marker].marker_labeltext}-->;
	bSetsMarkers[<!--{setsmarkerset}-->].marker[<!--{marker}-->].marker_zi = <!--{$sets_markers[setsmarkerset].marker[marker].marker_zi}-->;
	<!--{/section}-->	
<!--{/section}-->
<!--{/if}-->


<!--{if $sets_polylines_on eq 'y'}-->
var bSetsPolylines = new Array();
<!--{section name=setspolylineset loop=$sets_polylines}-->
  bSetsPolylines[<!--{setspolylineset}-->] = new Array();
	<!--{section name=polyline loop=$sets_polylines[setspolylineset]}-->
	bSetsPolylines[<!--{setspolylineset}-->].line = new Array();
	bSetsPolylines[<!--{setspolylineset}-->].line[<!--{polyline}-->].line_id = <!--{$sets_polylines[setspolylineset].line[polyline].line_id}-->;
	bSetsPolylines[<!--{setspolylineset}-->].line[<!--{polyline}-->].line_name = <!--{$sets_polylines[setspolylineset].line[polyline].line_name}-->;
	bSetsPolylines[<!--{setspolylineset}-->].line[<!--{polyline}-->].line_type = <!--{$sets_polylines[setspolylineset].line[polyline].line_type}-->;
	bSetsPolylines[<!--{setspolylineset}-->].line[<!--{polyline}-->].line_styleid = <!--{$sets_polylines[setspolylineset].line[polyline].line_styleid}-->;
	bSetsPolylines[<!--{setspolylineset}-->].line[<!--{polyline}-->].line_bordertext = <!--{$sets_polylines[setspolylineset].line[polyline].line_bordertext}-->;
	bSetsPolylines[<!--{setspolylineset}-->].line[<!--{polyline}-->].line_zi = <!--{$sets_polylines[setspolylineset].line[polyline].line_zi}-->;
	<!--{/section}-->	
<!--{/section}-->
<!--{/if}-->


<!--{if $sets_polygons_on eq 'y'}-->
var bSetsPolygons = new Array();
<!--{section name=setspolygonset loop=$sets_polygons}-->
  bSetsPolygons[<!--{setspolygonset}-->] = new Array();
	<!--{section name=polygon loop=$sets_polygons[setspolygonset]}-->
	bSetsPolygons[<!--{setspolygonset}-->].poly = new Array();
	bSetsPolygons[<!--{setspolygonset}-->].poly[<!--{polygon}-->].poly_id = <!--{$sets_polygons[setspolygonset].poly[polygon].poly_id}-->;
	bSetsPolygons[<!--{setspolygonset}-->].poly[<!--{polygon}-->].poly_name = <!--{$sets_polygons[setspolygonset].poly[polygon].poly_name}-->;
	bSetsPolygons[<!--{setspolygonset}-->].poly[<!--{polygon}-->].poly_type = <!--{$sets_polygons[setspolygonset].poly[polygon].poly_type}-->;
	bSetsPolygons[<!--{setspolygonset}-->].poly[<!--{polygon}-->].poly_styleid = <!--{$sets_polygons[setspolygonset].poly[polygon].poly_styleid}-->;
	bSetsPolygons[<!--{setspolygonset}-->].poly[<!--{polygon}-->].poly_bordertext = <!--{$sets_polygons[setspolygonset].poly[polygon].poly_bordertext}-->;
	bSetsPolygons[<!--{setspolygonset}-->].poly[<!--{polygon}-->].poly_zi = <!--{$sets_polygons[setspolygonset].poly[polygon].poly_zi}-->;
	<!--{/section}-->	
<!--{/section}-->
<!--{/if}-->


//some values we use later
var bIcons = new Array();
var bMarkers = new Array();
var bPolylines = new Array();
var bPolgons = new Array();


		  function createCustomIcons(){
  			if (typeof bIconStyles != 'undefined') {
  				for (i = 0; i < bIconStyles.length; i++) {
  						bIcons[i] = new GIcon();
  						bIcons[i].id = bIconsStyles[i].icon_id
  						bIcons[i].name = bIconStyles[i].icon_name;
              bIcons[i].image = bIconStyles[i].iconpath;
              bIcons[i].shadow = bIconStyles[i].shadowpath;
              bIcons[i].iconSize = new GSize(bIconStyles[i].icon_w, bIconStyles[i].icon_h);
              bIcons[i].shadowSize = new GSize(bIconStyles[i].icon_shadoww, bIconStyles[i].icon_shadowh);
              bIcons[i].iconAnchor = new GPoint(bIconStyles[i].icon_anchorx, bIconStyles[i].icon_anchory);
              bIcons[i].infoWindowAnchor = new GPoint(bIconStyles[i].icon_infoanchorx, bIconStyles[i].icon_infoanchory);
  				}				
				}				
			}			



  		//Add Marker Sets  
      function makeMarkers(markerSets) {
			   for (n=0; n < markerSets.length; n++) {

				 			bMarkers[n] = new Array();

				 			for (m=0; m < markerSets[n].length; m++) {

									//Shorten the marker datapath to save us a headache
							    var q = markerSet[n].marker[m];
							
							    // get the lon/lat and create a point		
                  var myPoint = new GPoint(parseFloat(q.marker_lon), parseFloat(q.marker_lat));


									//@todo wj: everything from here down in this function still needs reworking
									
									//Set Icon Styles
                	var myIconKey = bIconKey[q.marker_iconid];
									var myIcon = bIcons[myIconKey];
									
									//set Z-index	
									if (q.marker_zi != NULL) {
                		 var myzi = q.marker_zi;
									}else{ 
										 var myzi = "auto";
									}
        
                	// Add the infoWindow click function and html content
                  GEvent.addListener(marker, "click", function() {
                    marker.openInfoWindowHtml(myhtml);

									if (q.marker_iconid == 0){									
                	// Create marker at location using specified icon
                  var marker = new GMarker(mypoint);
									}else{
                  var marker = new GMarker(mypoint, myicon);
									}							
							
									bMarkers[n][m] = marker;

									// make the infoWindow HTML
          				var myhtml = q.marker_wintext;

        				 	var myid = q.marker_id;
                	vra myname = q.marker_name;

									var mystyle = q.marker_styleid;
                	var mylabel = q.marker_labeltext;

									
									//remember ids for where I am in the set lists
        				 	var mySarrayid = [n];
        				 	var myMarrayid = [m];
        
                  //add it to the map
          				map.addOverlay(newmarker);

      }			
		
	

			//@todo the following functions
      function makePolylines(polyineSet) {
			}			
      function makePolygons(polygonSet) {
			}
			
			


function onLoad() {	
		
			//Create a new map      
      var map = new GMap(document.getElementById("map"));      			
                
      //Add Map TYPE controls - buttons in the upper right corner
      map.addControl(new GMapTypeControl());

			//Add Small zoom controls
      map.addControl(new GLargeMapControl());    			   			    

      //Set Map Type
      map.setMapType(bMapType);
			
			//Center the Map
    	map.centerAndZoom(new GPoint(bMapLon, bMapLat), bZoomLevel);
			
			//Create Custom Icons if any
			createCustomIcons();
						
			//Initialize Polygons			
			makePolygons(bInitPolygons);

			//Initialize Polylines			
			makePolyline(bInitPolylines);
			
			//Initialize Markers			
			makeMarkers(bInitMarkers);
																										
   	}
