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

    			document.getElementById('gmap_id').value = bMapID;
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

					form = document.getElementById('markerform_'+(i));

        	form.marker_id.value = bIMData[i].marker_id;
        	form.title.value = bIMData[i].title;
        	form.marker_lat.value = bIMData[i].lat;
        	form.marker_lon.value = bIMData[i].lon;
        	form.edit.value = bIMData[i].data;
        	form.marker_labeltext.value = bIMData[i].label_data;
        	form.marker_zi.value = bIMData[i].zindex;
        	form.marker_array.value = bIMData[i].array;
        	form.marker_array_n.value = bIMData[i].array_n;

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

					form = document.getElementById('polylineform_'+(i));					
					
        	form.polyline_id.value = bILData[i].polyline_id;
        	form.line_name.value = bILData[i].name;
        	for (var j=0; j < 2; j++) {
             if (form.line_type.options[j].value == bILData[i].type){
                form.line_type.options[j].selected=true;
             }
          }					
        	form.line_data.value = bILData[i].points_data;
        	form.line_bordertext.value = bILData[i].border_text;
        	form.line_z.value = bILData[i].zindex;
        	form.line_array.value = bILData[i].array;
        	form.line_array_n.value = bILData[i].array_n;
					
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

	 
	 function get(u, f, a, n){
			editArray = a;
			editObjectN = n;
	 		var data;
      data = Form.serialize(f);


			if ( Form.getInputs(f, 'button', 'save_map') != '' ){
			alert('mapupdate');
				 data += '&save_map=true';
				 var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateMap } );				 
			}
		
			if ( Form.getInputs(f, 'button', 'save_marker') != '' ){
			alert('markerupdate');
				 data += '&save_marker=true';
				 var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateMarker } );				 
			}
		 
			if ( Form.getInputs(f, 'button', 'save_polyline') != '' ){
			alert('polylineupdate');
				 data += '&save_polyline=true';
				 var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updatePolyline } );				 
			}

	 }



	 function updateMap(rslt){
      var xml = rslt.responseXML;

	 		//shorten var names
			var t = xml.documentElement.getElementsByTagName('title');
			var title = t[0].firstChild.nodeValue;
			bMapTitle = title;
			
			var d = xml.documentElement.getElementsByTagName('desc');
			var desc = d[0].firstChild.nodeValue;
			bMapDesc = desc;
			
			var w = xml.documentElement.getElementsByTagName('w');
			var width = w[0].firstChild.nodeValue;
			bMapWidth = width;
			
			var h = xml.documentElement.getElementsByTagName('h');
			var height = h[0].firstChild.nodeValue;
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
			if (bMapWidth !== '0' && bMapWidth !== 0){
			   var newWidth = bMapWidth + "px";
				}else{
			   var newWidth = 'auto';
				}
			if (bMapHeight !== '0' && bMapHeight !== 0){
			   var newHeight = bMapHeight + "px";
				}else{
			   var newHeight = 'auto';
				}
      if (mapdiv){mapdiv.style.width=newWidth; mapdiv.style.height=newHeight; map.onResize();}
			
			map.setMapType(bMapType);
			
      //Add Map TYPE controls - buttons in the upper right corner
  		if (bMapTypeCont == 'TRUE'){
  		map.removeControl(typecontrols);
  		map.addControl(typecontrols);
  		}else{
  		map.removeControl(typecontrols);
  		}
  		
  		//Add Scale controls
  		if (bMapScale == 'TRUE'){
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


	 
	 	 
	 function updateMarker(rslt){
      var xml = rslt.responseXML;
						
	 		var m; //the marker data we are changing
			if (editArray == "I"){m = bIMData[editObjectN]}else{m = bSMData[editObjectN]};

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			var marker_id = id[0].firstChild.nodeValue;

			var tl = xml.documentElement.getElementsByTagName('title');
			var title = tl[0].firstChild.nodeValue;			
	 		m.title = title;
			
			var lt = xml.documentElement.getElementsByTagName('lat');
			var lat = parseFloat(lt[0].firstChild.nodeValue);
	 		m.lat = lat;
			
			var ln = xml.documentElement.getElementsByTagName('lon');
			var lon = parseFloat(ln[0].firstChild.nodeValue);
	 		m.lon = lon;

			var dt = xml.documentElement.getElementsByTagName('data');
			var data = dt[0].firstChild.nodeValue;			
	 		m.data = data;

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
			m.marker.my_html = "<div style='white-space: nowrap;'><strong>"+m.title+"</strong><p>"+m.data+"</p></div>";
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

	 

	
	 function updatePolyline(rslt){
      var xml = rslt.responseXML;

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

