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
var bInitMarkers = <!--{$init_markers}-->;
var bInitPolylines = <!--{$init_polylines}-->;
var bInitPolygons = <!--{$init_polygons}-->;
var bMarkerSets = <!--{$markersets}-->; 
var bPolylineSets = <!--{$polylinesets}-->;
var bPolygonSets = <!--{$polygonsets}-->;

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
<!--{/section}-->
<!--{/if}-->

<!--{if $marker_styles_on eq 'y'}-->
var bMarkerStyles = new Array();
<!--{section name=markerstyle loop=$marker_styles}-->
//@todo wj:properties for php array $marker_styles do not yet exist in edit_map.tpl -- creat those first!
<!--{/section}-->
<!--{/if}-->

<!--{if $polyline_styles_on eq 'y'}-->
var bPolylineStyles = new Array();
<!--{section name=polylstyle loop=$polyline_styles}-->
//@todo wj:properties for php array $polyline_styles do not yet exist in edit_map.tpl -- creat those first!
<!--{/section}-->
<!--{/if}-->

<!--{if $polygon_styles_on eq 'y'}-->
var bPolygonStyles = new Array();
<!--{section name=polygstyle loop=$polygon_styles}-->
//@todo wj:properties for php array $polygon_styles do not yet exist in edit_map.tpl -- creat those first!
<!--{/section}-->
<!--{/if}-->

//@todo wj:create loops for mapsets/markersets/polysets in addition to finishing three above



var bIcons = new Array();

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


		  function createCustomMarkerStyles(){
  			if (typeof bMarkerStyles != 'undefined') {
  				for (i = 0; i < bMarkerStyles.length; i++) {
					//@todo fill out this function
					}
				}
			}

			
		  function createCustomPolylineStyles(){
  			if (typeof bPolylineStyles != 'undefined') {
  				for (i = 0; i < bPolylineStyles.length; i++) {
					//@todo fill out this function
					}
				}
			}


		  function createCustomPolygonStyles(){
  			if (typeof bPolygonStyles != 'undefined') {
  				for (i = 0; i < bPolygonStyles.length; i++) {
					//@todo fill out this function
					}
				}
			}
			



  		//Parse Data for a group of Markers  
      function makeMarkers(markerSet) {
			   for (i=0; i < markerSet.length; i++) {
    			// get the long/lat and create a point		
          var point = new GPoint(parseFloat(markerSet[i].lon), parseFloat(markerSet[i].lat));
  				
          // make the infoWindow HTML
  				var html = markerSet[i].html;
  								
          var newmarker = createMarker(point, html);
  				
          //add it to the map
  				map.addOverlay(newmarker);
        }
  		}		
						

  		//Create a Marker Instance
  		function createMarker(mypoint, myhtml) {
      	// Create marker at location using specified icon
        var marker = new GMarker(mypoint, myicon);
      	// Add the infoWindow click function and html content
        GEvent.addListener(marker, "click", function() {
          marker.openInfoWindowHtml(myhtml);
        });
        return marker;
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
			
			//Create Any Custom Parts
			createCustomIcons();
			createCustomMarkerStyles();
			createCustomPolylineStyles();
			createCustomPolygonStyles();
						
			//@todo this needs to change			
			makeMarkers(initMarkers);
																										
   	}
