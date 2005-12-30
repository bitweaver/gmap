// We use Prototype library where ever possible.
// The most common use if substituting '$()' with '$()'
// MAP EDITING FUNCTIONS

// for tracking which object we are updating
var editArray;
var editObjectN;
var editSetId;
var editMarkerId;


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



function newMarker(){
    // Display the New Form Div and Cancel Button
   	show('newmarkerform');
		// Reset the Form
		$('markerform_new').reset();
		
		// count of sets available
		var setCount = bMSetData.length;
		// shortcut to the Select Option we are adding to
		var selectRoot = $('set_id');
		
		//dupe it
		if (typeof(bMSetData) != 'undefined'){
				var newOption = selectRoot.options[0].cloneNode(false);
  			for (i=0; i<bMSetData.length; i++){
						if (i > 0){
       			selectRoot.appendChild(newOption);
						}
				 		selectRoot.options[i].value = bMSetData[i].set_id;
      			selectRoot.options[i].text = bMSetData[i].name;
  			}
		}
};




function editMarkers(){		
  // Display the Edit Form Div and Cancel Button
	show('editmarkermenu');
  show('editmarkerform');
	show('editmarkercancel');

	//if marker data exists
	if ( typeof(bIMData) ) {
	
  	// We assume editMarkers has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<bMSetData.length; a++) {
  		var getElem = "markerset_"+bMSetData[a].set_id;
  		if ( $(getElem) ) {
      	var extraMarkerForm = $(getElem);
  			$('editmarkerform').removeChild(extraMarkerForm);
  		}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<bMSetData.length; b++) {
		  	
  		newSetId = bMSetData[b].set_id;
  	
  		// clone model set UI
			var newMarkerSet = $('markerset_n').cloneNode(true);
  		// give a new id to the new set UI
  		newMarkerSet.id = "markerset_"+newSetId;
  									
  		// customize all the values of our new set UI this gets ugly...										
  		setKids = newMarkerSet.childNodes;
      for (var c=0; c<setKids.length; c++) { 
  			if (setKids[c].id == "editsetmenu_n"){
  				setKids[c].id = "editsetmenu_"+newSetId;
  				menuKids = setKids[c].childNodes;
  			}
  			if (setKids[c].id == "setform_n"){
  				setKids[c].id = "setform_"+newSetId;    					
  				setForm = setKids[c];
  			}
      }
  					
  		formKids = setForm.childNodes;
      for (var d=0; d<formKids.length; d++) {
  			if (formKids[d].id == "editmarkertable_n"){
  				formKids[d].id = "editmarkertable_"+newSetId;
  			}
  			if (formKids[d].id == "allavailmarkers_n"){
  				formKids[d].id = "allavailmarkers_"+newSetId;
  				allMarkersForm = formKids[d];
  			}
  		}
  
  		allMarkKids = allMarkersForm.childNodes;
      for (var e=0; e<allMarkKids.length; e++) {
  			if (allMarkKids[e].id == "addmarkertable_n"){
  				allMarkKids[e].id = "addmarkertable_"+newSetId;
  			}
  		}
  
  		// Update the set's menu
      for (var f=0; f<menuKids.length; f++) {
  			if (menuKids[f].id == "setid"){
      		menuKids[f].innerHTML = bMSetData[b].name;
  			}
  			if (menuKids[f].id == "setstyle"){
      		menuKids[f].innerHTML = bMSetData[b].style_id;
  			}
  			if (menuKids[f].id == "seticon"){
      		menuKids[f].innerHTML = bMSetData[b].icon_id;
  			}
  			if (menuKids[f].id == "seteditmarkers"){
      		menuKids[f].href = "javascript:editSet("+newSetId+");";
  			}
  			if (menuKids[f].id == "setaddmarkers"){
      		menuKids[f].href = "javascript:alert('feature coming soon');"; //"javascript:editSet("+newSetId+"); editAllMarkers("+newSetId+");";
  			}
  			if (menuKids[f].id == "seteditstyle"){
      		menuKids[f].href = "javascript:alert('feature coming soon');";
  			}
  			if (menuKids[f].id == "setremove"){
      		menuKids[f].href = "javascript:alert('feature coming soon');";
  			}
  			if (menuKids[f].id == "setdelete"){
      		menuKids[f].href = "javascript:alert('feature coming soon');";
  			}
  			if (menuKids[f].id == "setdesc"){
      		menuKids[f].innerHTML = bMSetData[b].description;
  			}
      }							
  					
      // add form to set table
  		$('editmarkerform').appendChild(newMarkerSet);
  		show('markerset_'+newSetId);
  	}

		
  	//for length of markers add form to setelement on matching set_id
  	for (g=0; g<bIMData.length; g++) {
			if (bIMData[g]!= null){
				//add marker form...again a little ugly here
				var formCont = $("editmarkertable_"+bIMData[g].set_id);
  			formContKids = formCont.childNodes;
        for (var n = 0; n < formContKids.length; n++) {
  				if (formContKids[n].id == "markerform_n"){
        			var newMarkerForm = formContKids[n].cloneNode(true);
    					newMarkerForm.id = "markerform_"+g;
    					$('editmarkertable_'+bIMData[g].set_id).appendChild(newMarkerForm);
							show('markerform_'+g);
							break;
					}
			  }
				
				// populate set form values
				form = $('markerform_'+g);

        form.set_id.value = bIMData[g].set_id;
        form.marker_id.value = bIMData[g].marker_id;
        form.title.value = bIMData[g].title;
        form.marker_lat.value = bIMData[g].lat;
        form.marker_lon.value = bIMData[g].lon;
        form.edit.value = bIMData[g].data;
        form.marker_labeltext.value = bIMData[g].label_data;
        form.marker_zi.value = bIMData[g].zindex;
        form.marker_array.value = bIMData[g].array;
        form.marker_array_n.value = bIMData[g].array_n;
			}
		}

	}
}




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

	 function expunge(u, m, s){
			data = "marker_id=" + m.value + "&expunge_marker=true";
			editSetId = s.value;
			editMarkerId = m.value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: removeMarker } );
	 }	 
	 
	 function remove(u, m, s){
			data = "marker_id=" + m.value + "&set_id=" + s.value + "&remove_marker=true";
			editSetId = s.value;
			editMarkerId = m.value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: removeMarker } );
	 }
	 
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

			if ( Form.getInputs(f, 'button', 'new_marker') != '' ){
				 // here we still use save_marker because edit_marker.php looks for it
				 data += '&save_marker=true';
				 // yet again here is another instance where getting a value sucks, 
				 // but neither js nor prototype make getting this info less than a nightmare
				 var elms = Form.getElements(f);
				 editSetId = elms[elms.length-1].value;  //we reference this later in addMarker()
				 var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: addMarker } );
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
			bMapTitle = t[0].firstChild.nodeValue;
			
			var d = xml.documentElement.getElementsByTagName('desc');
			bMapDesc = d[0].firstChild.nodeValue;
			
			var w = xml.documentElement.getElementsByTagName('w');
			bMapWidth = w[0].firstChild.nodeValue;
			
			var h = xml.documentElement.getElementsByTagName('h');
			bMapHeight = h[0].firstChild.nodeValue;
			
			var lt = xml.documentElement.getElementsByTagName('lat');
			bMapLat = parseFloat(lt[0].firstChild.nodeValue);
			
			var ln = xml.documentElement.getElementsByTagName('lon');
			bMapLon = parseFloat(ln[0].firstChild.nodeValue);
			
			var z = xml.documentElement.getElementsByTagName('z');
			bMapZoom = parseInt(z[0].firstChild.nodeValue);
			
			var ss = xml.documentElement.getElementsByTagName('scale');
			bMapScale = ss[0].firstChild.nodeValue;
			
			var sc = xml.documentElement.getElementsByTagName('cont');
			bMapControl = sc[0].firstChild.nodeValue;
			
			var sm = xml.documentElement.getElementsByTagName('typecon');
			bMapTypeCont = sm[0].firstChild.nodeValue;
			
			var mt = xml.documentElement.getElementsByTagName('maptype');
			bMapType = bMapTypes[mt[0].firstChild.nodeValue];			

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




	 function addMarker(rslt){
	 		var s;
      var xml = rslt.responseXML;
						
	 		var m; //the marker data we are changing
			//@todo modify this to handle either bIMData or bSMData sets
			var n = bIMData.length;
			bIMData[n] = new Array();
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			bIMData[n].marker_id = id[0].firstChild.nodeValue;

			var tl = xml.documentElement.getElementsByTagName('title');
			bIMData[n].title = tl[0].firstChild.nodeValue;			
			
			var lt = xml.documentElement.getElementsByTagName('lat');
			bIMData[n].lat = parseFloat(lt[0].firstChild.nodeValue);
			
			var ln = xml.documentElement.getElementsByTagName('lon');
			bIMData[n].lon = parseFloat(ln[0].firstChild.nodeValue);

			var dt = xml.documentElement.getElementsByTagName('data');
			bIMData[n].data = dt[0].firstChild.nodeValue;			

			var l = xml.documentElement.getElementsByTagName('label');
			bIMData[n].label_data = l[0].firstChild.nodeValue;			

			//@todo this is such a crappy way to get this number
			for(var a=0; a<bMSetData.length; a++){
					if (bMSetData[a].set_id == editSetId){
						 s = a;
						 break;						 						 
					}
			};
			
			bIMData[n].set_id = parseFloat(bMSetData[s].set_id);
			bIMData[n].style_id = parseFloat(bMSetData[s].style_id);
			bIMData[n].icon_id = parseFloat(bMSetData[s].icon_id);
			
			var z = xml.documentElement.getElementsByTagName('z');
			bIMData[n].zindex = parseInt(z[0].firstChild.nodeValue);

			bIMData[n].array = "I";
			bIMData[n].array_n = parseFloat(n);

			//create marker
			//@todo this is redundant to the marker making loop toward the end of js_makegmap - consolidate in a function
    	var point = new GPoint(parseFloat(bIMData[n].lon), parseFloat(bIMData[n].lat));
    	bIMData[n].marker = new GMarker(point);
    	bIMData[n].marker.my_html = "<div style='white-space: nowrap;'><strong>"+bIMData[n].title+"</strong><p>"+bIMData[n].data+"</p></div>";
    	map.addOverlay(bIMData[n].marker);
    	//add the marker label if it exists
    	if (typeof(bIMData[n].label_data) != 'undefined'){
    		var topElement = bIMData[n].marker.iconImage;
    		if (bIMData[n].marker.transparentIcon) {topElement = bIMData[n].marker.transparentIcon;}
    		if (bIMData[n].marker.imageMap) {topElement = bIMData[n].marker.imageMap;}
    		topElement.setAttribute( "title" , bIMData[n].label_data );
    	}
			
			bIMData[n].marker.openInfoWindowHtml(bIMData[n].marker.my_html);

			// clear the form
			$('markerform_new').reset();
			// update the sets menus
			editMarkers();
			editSet(editSetId);
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


	function removeMarker(){
			for (var i=0; i<bIMData.length; i++){
					if (bIMData[i].marker_id == editMarkerId){
						map.removeOverlay(bIMData[i].marker);
						bIMData[i] = null;
						break;
					}
			}
			editMarkers();
			editSet(editSetId);
	}