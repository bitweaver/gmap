//MAP EDITING FUNCTIONS

var editArray;
var editObjectN;


function show (i){
				 document.getElementById(i).style.display = "block";
};


function canceledit(i){
   			document.getElementById(i).style.display = "none";	
};


function editMap(){
				 	show('editmapform');

    			document.getElementById('map_id').value = bMapID;
    			document.getElementById('map_title').value = bMapTitle;
    			document.getElementById('map_desc').value = bMapDesc;
    			document.getElementById('map_w').value = bMapWidth;
    			document.getElementById('map_h').value = bMapHeight;
    			document.getElementById('map_lat').value = bMapLat;
    			document.getElementById('map_lon').value = bMapLon;
    			document.getElementById('map_z').value = bMapZoom;

        	for (var i=0; i < 4; i++) {
             if (document.getElementById('map_showcont').options[i].value == bMapControl){
                document.getElementById('map_showcont').options[i].selected=true;
             }
          }

        	for (var i=0; i < 2; i++) {
             if (document.getElementById('map_showscale').options[i].value == bMapScale){
                document.getElementById('map_showscale').options[i].selected=true;
             }
          }
					
        	for (var i=0; i < 2; i++) {
             if (document.getElementById('map_showtypecont').options[i].value == bMapTypeCont){
                document.getElementById('map_showtypecont').options[i].selected=true;
             }
          }
					
    			var mapTypeRoot = document.getElementById('map_type');
					var newMapType = mapTypeRoot.options[0].cloneNode(false);
					for (i=0; i<bMapTypesData.length; i++){ 
   					  mapTypeRoot.appendChild(newMapType);
    					mapTypeRoot.options[i+3].value = bMapTypesData[i].map_typename;
    					mapTypeRoot.options[i+3].text = bMapTypesData[i].map_typename;
					}
					
        	for (var i=0; i < (bMapTypesData.length+2); i++) {
             if (document.getElementById('map_type').options[i].value == bMapType){
                document.getElementById('map_type').options[i].selected=true;
             }
          }
				
    			/*@todo create value for comments
					  document.getElementById('map_comm').value = ?; for type="checkbox
					 */
};



/* @todo needs to support markers in bSMData as well as bIMData */
function editMarkers(){				
   			show('editmarkerform');

				/* get rid of any extra fields we may have created 
				 * if this has been called once before
				 * this way we dont add any extra fields
				 */
				for (i=1; i<bIMData.length; i++){
				 if(document.getElementById('markerform_'+i)){
    				var extraMarkerForm = document.getElementById('markerform_'+i);
						document.getElementById('editmarkertable').removeChild(extraMarkerForm);
					}
				}

				/* add more fields and fill them with data */
				for (i=0; i<bIMData.length; i++) {
	
					if( i < (bIMData.length-1) ){
    				var newMarkerForm = document.getElementById('markerform_0').cloneNode(true);				
						newMarkerForm.id = "markerform_"+(i+1);
						document.getElementById('editmarkertable').appendChild(newMarkerForm);
					}

        	document.getElementsByName('marker_id').item(i).value = bIMData[i].marker_id;
        	document.getElementsByName('marker_name').item(i).value = bIMData[i].name;
        	document.getElementsByName('marker_lat').item(i).value = bIMData[i].lat;
        	document.getElementsByName('marker_lon').item(i).value = bIMData[i].lon;
        	document.getElementsByName('marker_wintext').item(i).value = bIMData[i].window_data;
        	document.getElementsByName('marker_labeltext').item(i).value = bIMData[i].label_data;
        	document.getElementsByName('marker_zi').item(i).value = bIMData[i].zindex;
        	document.getElementsByName('marker_array').item(i).value = bIMData[i].array;
        	document.getElementsByName('marker_array_n').item(i).value = bIMData[i].array_n;
					
    			/* @todo include the following 
            bIMData[i].set_id;
            bIMData[i].style_id;
            bIMData[i].icon_id;
    				*/					
				}
};





/* @todo needs to support markers in bSLData as well as bILData */
function editPolylines(){				
   			show('editpolylineform');

				/* get rid of any extra fields we may have created 
				 * if this has been called once before
				 * this way we dont add any extra fields
				 */
				for (i=1; i<bILData.length; i++){
				 if(document.getElementById('polylineform_'+i)){
    				var extraPolylineForm = document.getElementById('polylineform_'+i);
						document.getElementById('editpolylinetable').removeChild(extraPolylineForm);
					}
				}

				/* add more fields and fill them with data */
				for (i=0; i<bILData.length; i++) {
	
					if( i < (bILData.length-1) ){
    				var newPolylineForm = document.getElementById('polylineform_0').cloneNode(true);				
						newPolylineForm.id = "polylineform_"+(i+1);
						document.getElementById('editpolylinetable').appendChild(newPolylineForm);
					}

        	document.getElementsByName('line_id').item(i).value = bILData[i].polyline_id;
        	document.getElementsByName('line_name').item(i).value = bILData[i].name;
        	for (var j=0; j < 2; j++) {
             if (document.getElementsByName('line_type').item(i).options[j].value == bILData[i].type){
                document.getElementsByName('line_type').item(i).options[j].selected=true;
             }
          }					
        	document.getElementsByName('line_data').item(i).value = bILData[i].points_data;
        	document.getElementsByName('line_bordertext').item(i).value = bILData[i].border_text;
        	document.getElementsByName('line_z').item(i).value = bILData[i].zindex;
        	document.getElementsByName('line_array').item(i).value = bILData[i].array;
        	document.getElementsByName('line_array_n').item(i).value = bILData[i].array_n;
					
    			/* @todo include the following 
            bILData[i].set_id;
            bILData[i].style_id;
    				*/					
				}
};




/* First Attempts at Editing Functions - we may still want to use these
function editMarker(a, b){
				var m; //the marker data we are changing
				b = parseFloat(b);
				if (a == "I"){m = bIMData[b]}else{m = bSMData[b]};
   			show('editmarkerform');
    			document.getElementById('marker_id').value = m.marker_id;
        	document.getElementById('marker_name').value = m.name;
        	document.getElementById('marker_lat').value = m.lat;
        	document.getElementById('marker_lon').value = m.lon;
        	document.getElementById('marker_wintext').value = m.window_data;
        	document.getElementById('marker_labeltext').value = m.label_data;
        	document.getElementById('marker_zi').value = m.zindex;
				editArray = a;
				editObjectN = b;
};


function editPolyline(a, b){
				var pl; //the marker data we are changing
				b = parseFloat(b);
				if (a == "I"){pl = bILData[b]}else{pl = bSLData[b]};
   			document.getElementById('editpolylineform').style.display = "block";
    			document.getElementById('line_id').value = pl.polyline_id;
    			document.getElementById('line_name').value = pl.name;
    			document.getElementById('line_type').value = pl.type;
    			document.getElementById('line_data').value = pl.points_data;
    			document.getElementById('line_bordertext').value = pl.border_text;
    			document.getElementById('line_z').value = pl.zindex;
				editArray = a;
				editObjectN = b;
};
*/





//AJAX FUNCTIONS

   var http_request = false;

	 
   //get translates the DOM of any FORM into a string of values for php
	 //also relays the url of the php script to makeRequest().
   function get(url, o, a, n) {
			editArray = a;
			editObjectN = n;
      var getstr = "?";
			var part = "";
			function parseObj(obj){
        for (i=0; i<obj.childNodes.length; i++) {

					 if (obj.childNodes[i].tagName == "DIV"){
					 		var newObj = obj.childNodes[i].getElementsByTagName("DIV");
							for (x=0; x<newObj.length; x++){
  								parseObj(newObj.item(x));
							}
					 }

					 if (obj.childNodes[i].tagName == "TABLE"){
					 		for (j=0; j<obj.childNodes[i].rows.length; j++){
									for (k=0; k<obj.childNodes[i].rows[j].cells.length; k++){
											parseObj(obj.childNodes[i].rows[j].cells[k]);
									};
							};
					 }
					 					   			
           if (obj.childNodes[i].tagName == "INPUT") {
              if (obj.childNodes[i].type == "text" || "hidden") {
                 getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
              }
              if (obj.childNodes[i].type == "checkbox") {
                 if (obj.childNodes[i].checked) {
                    getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
                 } else {
                    getstr += obj.childNodes[i].name + "=&";
                 }
              }
              if (obj.childNodes[i].type == "radio") {
                 if (obj.childNodes[i].checked) {
                    getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
                 }
              }
              if (obj.childNodes[i].type == "button") {
  							 if (obj.childNodes[i].value == "Submit"){
  							 		part = obj.childNodes[i].name;
  							 }
  						}
           }   
           if (obj.childNodes[i].tagName == "SELECT") {
              var sel = obj.childNodes[i];
              getstr += sel.name + "=" + sel.options[sel.selectedIndex].value + "&";
           }
           if (obj.childNodes[i].tagName == "TEXTAREA") {
              getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
           }
        }
			}
			parseObj(o);
			getstr = url + getstr;
      makeRequest(getstr, part);
   }	 
	 
	 
	 
   //makeRequest handles any XMLHttpRequest relaying a url and a string of values
   function makeRequest(url, part) {
	 		// for url checking:
			// document.getElementById('alertmsg').innerHTML = url;
      http_request = false;
      if (window.XMLHttpRequest) { // Mozilla, Safari,...
         http_request = new XMLHttpRequest();
         if (http_request.overrideMimeType) {
            http_request.overrideMimeType('text/xml');
         }
      } else if (window.ActiveXObject) { // IE
         try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
         } catch (e) {
            try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
         }
      }
      if (!http_request) {
         alert('Cannot create XMLHTTP instance');
         return false;
      }
			if (part == "mapsubmit"){
			      http_request.onreadystatechange = alertMap;
			}
			if (part == "markersubmit"){
			      http_request.onreadystatechange = alertMarker;
			}
			if (part == "polylinesubmit"){
			      http_request.onreadystatechange = alertPolyline;
			}
			if (part == "polygonsubmit"){
			      http_request.onreadystatechange = alertPolygon;
			}
      http_request.open('GET', url, true);
      http_request.send(null);
   }
	 
	 

   function alertMap() {
      if (http_request.readyState == 4) {
         if (http_request.status == 200) {
				 		//alert(http_request.responseText);
            var result = http_request.responseXML;
						updateMap(result);
         } else {
            alert('There was a problem connecting to the server, please contact the site admin.');
         }
      }
   }

   function alertMarker() {
      if (http_request.readyState == 4) {
         if (http_request.status == 200) {
				 		//alert(http_request.responseText);
            var result = http_request.responseXML;
						updateMarker(result);
         } else {
            alert('There was a problem connecting to the server, please contact the site admin.');
         }
      }
   }
	 
   function alertPolyline() {
      if (http_request.readyState == 4) {
         if (http_request.status == 200) {
				 		//alert(http_request.responseText);
            var result = http_request.responseXML;
						updatePolyline(result);
         } else {
            alert('There was a problem connecting to the server, please contact the site admin.');
         }
      }
   }
	 
   function alertPolygon() {
      if (http_request.readyState == 4) {
         if (http_request.status == 200) {
				 		//alert(http_request.responseText);
            var result = http_request.responseXML;
						updatePolygon(result);
         } else {
            alert('There was a problem connecting to the server, please contact the site admin.');
         }
      }
   }



	 function updateMap(xml){
	 		//shorten var names
			var t = xml.documentElement.getElementsByTagName('title');
			var title = t[0].firstChild.nodeValue;
			bMapTitle = title;
			
			var d = xml.documentElement.getElementsByTagName('desc');
			var desc = d[0].firstChild.nodeValue;
			bMapDesc = desc;
			
			var w = xml.documentElement.getElementsByTagName('w');
			var width = w[0].firstChild.nodeValue + "px";
			bMapWidth = width;
			
			var h = xml.documentElement.getElementsByTagName('h');
			var height = h[0].firstChild.nodeValue + "px";
			bMapHeight = height;
			
			var lt = xml.documentElement.getElementsByTagName('lat');
			var lat = parseFloat(lt[0].firstChild.nodeValue);
			bMapLat = lat;
			
			var ln = xml.documentElement.getElementsByTagName('lon');
			var lon = parseFloat(ln[0].firstChild.nodeValue);
			bMapLon = lon;
			
			var z = xml.documentElement.getElementsByTagName('z');
			var zoom = parseInt(z[0].firstChild.nodeValue);
			bMapZoom = zoom;
			
			var ss = xml.documentElement.getElementsByTagName('scale');
			var show_scale = ss[0].firstChild.nodeValue;
			bMapScale = show_scale;
			
			var sc = xml.documentElement.getElementsByTagName('cont');
			var show_cont = sc[0].firstChild.nodeValue;
			bMapControl = show_cont;
			
			var sm = xml.documentElement.getElementsByTagName('typecon');
			var show_typecont = sm[0].firstChild.nodeValue;
			bMapTypeCont = show_typecont;
			
			var mt = xml.documentElement.getElementsByTagName('maptype');
			var maptype = bMapTypes[mt[0].firstChild.nodeValue];
			bMapType = maptype;
			

			//replace everything	
      var maptile = document.getElementById('mymaptitle');
      if (maptile){maptile.innerHTML=bMapTitle;}

      var mapdesc = document.getElementById('mymapdesc');
      if (mapdesc){mapdesc.innerHTML=bMapDesc;}

      var mapdiv = document.getElementById('map');
      if (mapdiv){mapdiv.style.width=bMapWidth; mapdiv.style.height=bMapHeight; map.onResize();}
			
			map.setMapType(bMapType);
			
      //Add Map TYPE controls - buttons in the upper right corner
  		if (bMapTypeCont == 1){
  		map.removeControl(typecontrols);
  		map.addControl(typecontrols);
  		}else{
  		map.removeControl(typecontrols);
  		}
  		
  		//Add Scale controls
  		if (bMapScale == 1){
  		map.removeControl(scale);
  		map.addControl(scale);
  		}else{
  		map.removeControl(scale);
  		}
  		
      //Add Navigation controls - buttons in the upper left corner		
  		map.removeControl(smallcontrols);
  		map.removeControl(largecontrols);
  		map.removeControl(zoomcontrols);
  		if (bMapControl == 's') {
  		map.addControl(smallcontrols);
  		}else if (bMapControl == 'l') {
  		map.addControl(largecontrols);		
  		}else if (bMapControl == 'z') {
  		map.addControl(zoomcontrols);
  		}
			
			map.centerAndZoom(new GPoint(bMapLon, bMapLat), bMapZoom);		
	 }


	 
	 	 
	 function updateMarker(xml){
	 		var m; //the marker data we are changing
			if (editArray == "I"){m = bIMData[editObjectN]}else{m = bSMData[editObjectN]};

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			var marker_id = id[0].firstChild.nodeValue;

			var nm = xml.documentElement.getElementsByTagName('name');
			var name = nm[0].firstChild.nodeValue;			
	 		m.name = name;
			
			var lt = xml.documentElement.getElementsByTagName('lat');
			var lat = parseFloat(lt[0].firstChild.nodeValue);
	 		m.lat = lat;
			
			var ln = xml.documentElement.getElementsByTagName('lon');
			var lon = parseFloat(ln[0].firstChild.nodeValue);
	 		m.lon = lon;

			var dt = xml.documentElement.getElementsByTagName('data');
			var data = dt[0].firstChild.nodeValue;			
	 		m.window_data = data;

			var l = xml.documentElement.getElementsByTagName('label');
			var label = l[0].firstChild.nodeValue;			
	 		m.label_data = label;
			
			var z = xml.documentElement.getElementsByTagName('z');
			var zindex = parseInt(z[0].firstChild.nodeValue);
			m.zindex = zindex;
			
			//update position
			m.marker.point.x = parseFloat(m.lon);
			m.marker.point.y = parseFloat(m.lat);
			
			//update infoWindow html
			m.marker.my_html = "<div style='white-space: nowrap;'><div><a href='javascript:editMarker(\""+editArray+"\","+editObjectN+"])'>edit<a></div><strong>"+m.name+"</strong><p>"+m.window_data+"</p></div>";
			m.marker.openInfoWindowHtml(m.marker.my_html);

			//update label
			if (m.label_data){
  				var topElement = m.marker.iconImage;
  				if (m.marker.transparentIcon) {topElement = m.marker.transparentIcon;}
  				if (m.marker.imageMap) {topElement = m.marker.imageMap;}
  				topElement.setAttribute( "title" , m.label_data );
			}

			m.marker.redraw(true);
	}

	 

	
	 function updatePolyline(xml){
	 		var pl; //the marker data we are changing
			if (editArray == "I"){pl = bILData[editObjectN]}else{pl = bSLData[editObjectN]};			
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			var polyline_id = id[0].firstChild.nodeValue;

			var nm = xml.documentElement.getElementsByTagName('name');
			var name = nm[0].firstChild.nodeValue;			
	 		pl.name = name;
			
			var ty = xml.documentElement.getElementsByTagName('type');
			var type = ty[0].firstChild.nodeValue;
	 		pl.type = type;
			
			var pt = xml.documentElement.getElementsByTagName('points');
			var points_data = pt[0].firstChild.nodeValue;
	 		pl.points_data = points_data.split(",");

			var bt = xml.documentElement.getElementsByTagName('border');
			var border_text = bt[0].firstChild.nodeValue;			
	 		pl.border_text = border_text;
			
			var z = xml.documentElement.getElementsByTagName('z');
			var zindex = parseInt(z[0].firstChild.nodeValue);
			pl.zindex = zindex;

			//for now when updating a polyline, we dump the old version and make new.
			//this will be more efficient if we can find a way to just change the poinst on the fly			
			for (s=0; s<bLStyData.length; s++){
      		if (bLStyData[s].style_id == pl.style_id){
        		 var linecolor = "#"+bLStyData[s].color;
        		 var lineweight = bLStyData[s].weight;
        		 var lineopacity = bLStyData[s].opacity;
        	}
      }

			var pointlist = new Array();
    	for (p = 0; p < pl.points_data.length; p+=2 ){
    				var point = new GPoint(
    						parseFloat(pl.points_data[p]),
    						parseFloat(pl.points_data[p+1])
    				);
    				pointlist.push(point);
    		};

			map.removeOverlay(pl.polyline);
			pl.polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
			map.addOverlay(pl.polyline);

	}

