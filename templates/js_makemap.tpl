var bMapID = <!--{$map_id}-->;
var bMapWidth = <!--{$map_w}-->;
var bMapHeight = <!--{$map_h}-->;
var bMapLat = <!--{$map_lat}-->;
var bMapLon = <!--{$map_lon}-->;
var bZoomLevel = <!--{$map_zoom}-->;
var bMapType = <!--{$map_type}-->;
var bMapTypes = <!--{$map_types}-->;
var bControls = <!--{$show_controls}-->;
var bScale = <!--{$show_scale}-->;
var bTypecontrols = <!--{$show_typecontrols}-->;
var bInitMarkers = <!--{$init_markers}-->;
var bInitPolylines = <!--{$init_polylines}-->;
var bInitPolygons = <!--{$init_polygons}-->;
var bMarkerSets = <!--{$markersets}-->; 
var bPolylineSets = <!--{$polylinesets}-->;
var bPolygonSets = <!--{$polygonsets}-->;

//@todo wj: can an array be passed up to js from smarty?

var myArray = {$arrayFromPHP};

var bIconStyles = <!--{$icon_styles}-->;
var bMarkerStyles = <!--{$marker_styles}-->;
var bPolylineStyles = <!--{$polyline_styles}-->;
var bPolygonStyles = <!--{$polygon_styles}-->;

var bIcons = new Array();



		  function createCustomIcons (){
				for (i = 0; i < bIconStyles.length; i++) {
            bIcons[i] = new Array();
						bIcons[i].icon = new GIcon();
            bIcons[i].image = bIconStyles[i].iconpath;
            bIcons[i].shadow = bIconStyles[i].shadowpath;
            bIcons[i].iconSize = new GSize(bIconStyles[i].icon_w, bIconStyles[i].icon_h);
            bIcons[i].shadowSize = new GSize(bIconStyles[i].icon_shadoww, bIconStyles[i].icon_shadowh);
            bIcons[i].iconAnchor = new GPoint(bIconStyles[i].icon_anchorx, bIconStyles[i].icon_anchory);
            bIconSs[i].infoWindowAnchor = new GPoint(bIconStyles[i].icon_infoanchorx, bIconStyles[i].icon_infoanchory);
				};				
			}





  		// Create a variable with properties for a Marker
  		function createMarker(mypoint, myhtml) {
      	// Create marker at location using specified icon
        var marker = new GMarker(mypoint, myicon);
      	// Add the infoWindow click function and html content
        GEvent.addListener(marker, "click", function() {
          marker.openInfoWindowHtml(myhtml);
        });
        return marker;
      }			
		

	
  		//Part of adding a large group of markers to the map.  
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



function onLoad() {	
		
			//Create a new map      
      var map = new GMap(document.getElementById("map"));      			
                
      //Add Map TYPE controls - buttons in the upper right corner
      map.addControl(new GMapTypeControl());

			//Add Small zoom controls
      map.addControl(new GLargeMapControl());    			   			    

      //Set Map Type
      map.setMapType(bMapType);
			
    	map.centerAndZoom(new GPoint(bMapLon, bMapLat), bZoomLevel);
			
			makeMarkers(initMarkers);
																										
   	}
