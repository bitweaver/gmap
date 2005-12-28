// We use Prototype library where ever possible.
// The most common use if substituting '$()' with '$()'
// MAP EDITING FUNCTIONS

// for tracking which object we are updating
var editArray;
var editObjectN;


// for sorting arrays
function sortOn(a,b){ 
				 return a['set_id']-b['set_id']; 
		} 

function sortIt(pParamHash){
		pParamHash.sort(sortOn); 
}


// for displaying and hiding menu parts
function show (i){
				 $(i).style.display = "block";
};

function canceledit(i){
   			$(i).style.display = "none";	
};


// builds the map editing form
function editMap(){
				 	show('editmapform');

    			$('gmap_id').value = bMapID;
    			$('map_title').value = bMapTitle;
    			$('map_desc').value = bMapDesc;
    			$('map_w').value = bMapWidth;
    			$('map_h').value = bMapHeight;
    			$('map_lat').value = bMapLat;
    			$('map_lon').value = bMapLon;
    			$('map_z').value = bMapZoom;

        	for (var i=0; i < 4; i++) {
             if ($('map_showcont').options[i].value == bMapControl){
                $('map_showcont').options[i].selected=true;
             }
          }

        	for (var i=0; i < 2; i++) {
             if ($('map_showscale').options[i].value == bMapScale){
                $('map_showscale').options[i].selected=true;
             }
          }
					
        	for (var i=0; i < 2; i++) {
             if ($('map_showtypecont').options[i].value == bMapTypeCont){
                $('map_showtypecont').options[i].selected=true;
             }
          }
					
    			var mapTypeRoot = $('map_type');

					var mapTypeCount = 2;
					
					if (typeof(bMapTypesData) != 'undefined'){
						mapTypeCount += bMapTypesData.length;					
						var newMapType = mapTypeRoot.options[0].cloneNode(false);
  					for (i=0; i<bMapTypesData.length; i++){
     					  mapTypeRoot.appendChild(newMapType);
      					mapTypeRoot.options[i+3].value = bMapTypesData[i].map_typename;
      					mapTypeRoot.options[i+3].text = bMapTypesData[i].map_typename;
  					}
					}
						
          for (var i=0; i<mapTypeCount; i++) {
             if ($('map_type').options[i].value == bMapType){
                $('map_type').options[i].selected=true;
             }
          }
									
    			/*@todo create value for comments
					  $('map_comm').value = ?; for type="checkbox
					 */
};




function editMarkers(){
		// Sort The Marker Array on set_id
		sortIt(bIMData);
		
    // Display the Edit Form Div and Cancel Button
   	show('editmarkerform');
		show('editmarkercancel');


		// We assume editMarkers has been called before and remove any previously existing sets
		// Step through the Marker Array
		/* 
		 * @todo it would probably be better 
		 * to keep a list of all marker sets 
		 * used on map and then remove forms 
		 * based on that list.
		 */

		
		for (d=0; d<bIMData.length; d++) {

			var getElem = "markerset_"+bIMData[d].set_id;

			if ( $(getElem) ) {
    		var extraMarkerForm = $(getElem);
				$('editmarkerform').removeChild(extraMarkerForm);
			}
		}
		
			
    // Set the set_id check
		var setIdCheck;
		var markerTableCount;
		
    // Step through the Marker Array
		for (i=0; i<bIMData.length; i++) {
    	 // Check the set_id
			 if ( bIMData[i].set_id != setIdCheck ){
    	 // if not same 
			 		var newMarkerSet;
					var setKids;
					var menuKids;
					var setForm;
					var formKids;
					var allMarkersForm;
					var allMarkKids;

			 		// change Check
					setIdCheck = bIMData[i].set_id;
					
					// reset the table count
					markerTableCount = 0;
					
    	 		// clone set table and change ids
    			newMarkerSet = $('markerset_n').cloneNode(true);
					newMarkerSet.id = "markerset_"+(setIdCheck);
									
					// this gets ugly...										
					setKids = newMarkerSet.childNodes;
          for (var j = 0; j < setKids.length; j++) { 
						if (setKids[j].id == "editsetmenu_n"){
							 setKids[j].id = "editsetmenu_"+(setIdCheck);
							 menuKids = setKids[j].childNodes;
						}
						if (setKids[j].id == "setform_n"){
							 setKids[j].id = "setform_"+(setIdCheck);    					
							 setForm = setKids[j];
						}
          }
					
					formKids = setForm.childNodes;
          for (var k = 0; k < formKids.length; k++) {
						if (formKids[k].id == "editmarkertable_n"){
							 formKids[k].id = "editmarkertable_"+(setIdCheck);
						}
						if (formKids[j].id == "allavailmarkers_n"){
							 formKids[j].id = "allavailmarkers_"+(setIdCheck);
							 allMarkersForm = formKids[j];
						}
					}

					allMarkKids = allMarkersForm.childNodes;
          for (var l = 0; l < allMarkKids.length; l++) {
						if (allMarkKids[l].id == "addmarkertable_n"){
							 allMarkKids[l].id = "addmarkertable_"+(setIdCheck);
						}
					}
													
					// Update the set's menu
          for (var m = 0; m < menuKids.length; m++) {
						if (menuKids[m].id == "setid"){
    					menuKids[m].innerHTML = "setid: "+bIMData[i].set_id;
						}
						if (menuKids[m].id == "setstyle"){
    					menuKids[m].innerHTML = bIMData[i].style_id;
						}
						if (menuKids[m].id == "seticon"){
    					menuKids[m].innerHTML = bIMData[i].icon_id;
						}
						if (menuKids[m].id == "seteditmarkers"){
    					menuKids[m].href = "javascript:editSet("+setIdCheck+");";
						}
						if (menuKids[m].id == "setaddmarkers"){
    					menuKids[m].href = "javascript:editSet("+setIdCheck+"); editAllMarkers("+setIdCheck+");";
						}
						if (menuKids[m].id == "seteditstyle"){
    					menuKids[m].href = "";
						}
						if (menuKids[m].id == "setremove"){
    					menuKids[m].href = "";
						}
						if (menuKids[m].id == "setdelete"){
    					menuKids[m].href = "";
						}
						if (menuKids[m].id == "setdesc"){
    					menuKids[m].innerHTML = "MarkerSet description - feature coming soon.";					
						}
          }							
					
    	 		// add form to set table
					$('editmarkerform').appendChild(newMarkerSet);
					show('markerset_'+(setIdCheck));
					
			 }

		 
			 //add marker form
				var formCont = $("editmarkertable_"+(setIdCheck));
  			formContKids = formCont.childNodes;
        for (var n = 0; n < formContKids.length; n++) {
  				if (formContKids[n].id == "markerform_n"){
        			var newMarkerForm = formContKids[n].cloneNode(true);
    					newMarkerForm.id = "markerform_"+(i);
    					$('editmarkertable_'+(setIdCheck)).appendChild(newMarkerForm);
							show('markerform_'+(i));
							break;
					}
			  }
				
				// populate set table values
				form = $('markerform_'+(i));

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



function editSet(n){
				show('setform_'+n);
}



/* @todo needs to support markers in bSLData as well as bILData */
function editPolylines(){				
   			show('editpolylineform');

				/* get rid of any extra fields we may have created 
				 * if this has been called once before
				 * this way we dont add any extra fields
				 */
				for (i=1; i<bILData.length; i++){
				 if($('polylineform_'+i)){
    				var extraPolylineForm = $('polylineform_'+i);
						$('editpolylinetable').removeChild(extraPolylineForm);
					}
				}

				/* add more fields and fill them with data */
				for (i=0; i<bILData.length; i++) {
	
					if( i < (bILData.length-1) ){
    				var newPolylineForm = $('polylineform_0').cloneNode(true);				
						newPolylineForm.id = "polylineform_"+(i+1);
						$('editpolylinetable').appendChild(newPolylineForm);
					}

					form = $('polylineform_'+(i));					
					
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








//AJAX FUNCTIONS

   var http_request = false;

	 
	 function get(u, f, a, n){
			editArray = a;
			editObjectN = n;
	 		var data;
      data = Form.serialize(f);

			if ( Form.getInputs(f, 'button', 'save_map') != '' ){
				 data += '&save_map=true';
				 var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateMap } );
			}
		
			if ( Form.getInputs(f, 'button', 'save_marker') != '' ){
				 data += '&save_marker=true';
				 var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateMarker } );
			}
		 
			if ( Form.getInputs(f, 'button', 'save_polyline') != '' ){
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
      var maptile = $('mymaptitle');
      if (maptile){maptile.innerHTML=bMapTitle;}

      var mapdesc = $('mymapdesc');
      if (mapdesc){mapdesc.innerHTML=bMapDesc;}

      var mapdiv = $('map');
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

