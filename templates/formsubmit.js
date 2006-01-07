// We use Prototype library where ever possible.
// The most common use if substituting '$()' with '$()'
// MAP EDITING FUNCTIONS

// for tracking which object we are updating
var editArray;
var editObjectN;
var editSetId;
var editMarkerId;
var editPolylineId;
var editSetType;

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







/*******************
 *
 * MAP FORM FUNCTIONS
 *
 *******************/

// builds the map editing form
function editMap(){

				  $('mapform').reset();
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
      					mapTypeRoot.options[i+3].value = bMapTypesData[i].name;
      					mapTypeRoot.options[i+3].text = bMapTypesData[i].name;
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

function editMapTypes(){
	show('editmaptypemenu');
	show('editmaptypeform');
	show('editmaptypecancel');

	//if maptype data exists
	if ( typeof( bMapTypesData ) ) {
	
  	// We assume editMapTypes has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<bMapTypesData.length; a++) {
  		if ( bMapTypesData[a]!= null ){
    		var getElem = "editmaptypetable_" + bMapTypesData[a].maptype_id;
    		if ( $(getElem) ) {
        	var extraMapTypeForm = $(getElem);
    			$('editmaptypeform').removeChild(extraMapTypeForm);
    		}
			}
  	}
		
  	var editMapTypeId;
  	  	
  	// for each maptype data set clone the form
  	for (var b=0; b<bMapTypesData.length; b++) {
  	if ( bMapTypesData[b]!= null ){
						
  		editMapTypeId = bMapTypesData[b].maptype_id;
  	
  		// clone the form container
			var newMapType = $('editmaptypetable_n').cloneNode(true);
  		// give a new id to the new form container
  		newMapType.id = "editmaptypetable_"+editMapTypeId;
			
			// update the new form ids
  		newMapTypeForm = newMapType.childNodes;
      for ( var n = 0; n < newMapTypeForm.length; n++ ) {
  				if ( newMapTypeForm[n].id == "maptypeform_n" ) {					
        			 newMapTypeForm[n].id = "maptypeform_" + editMapTypeId;
        			 newMapTypeForm[n].name = "maptypeform_" + editMapTypeId;					 
							 var nMFKids = newMapTypeForm[n].childNodes;
							 for (var o=0; o<nMFKids.length; o++){
							   if (nMFKids[o].id == "maptypeformdata_n"){
									 nMFKids[o].id = "maptypeformdata_" + editMapTypeId;
								 }
							 }
					}
			}
  									
      // add form to set table
  		$('editmaptypeform').appendChild(newMapType);
  		show( 'editmaptypetable_'+editMapTypeId );
  		show( 'maptypeform_'+editMapTypeId );
						
			//@todo add cloning of the all maptypes form
	  
			// populate set form values
			form = $('maptypeform_' + editMapTypeId);

			form.array_n.value = b;
      form.maptype_id.value = bMapTypesData[b].maptype_id;
      form.name.value = bMapTypesData[b].name;
      form.description.value = bMapTypesData[b].description;
      form.copyright.value = bMapTypesData[b].copyright;
      form.maxzoom.value = bMapTypesData[b].maxzoom;
      for (var r=0; r < 3; r++) {
         if (form.basetype.options[r].value == bMapTypesData[b].basetype){
         		form.basetype.options[r].selected=true;
         }
      };			
      for (var r=0; r < 3; r++) {
         if (form.alttype.options[r].value == bMapTypesData[b].alttype){
         		form.alttype.options[r].selected=true;
         }
      };
      form.maptiles_url.value = bMapTypesData[b].maptiles_url;
      form.lowtiles_url.value = bMapTypesData[b].lowresmaptiles_url;
      form.hybridtiles_url.value = bMapTypesData[b].hybridtiles_url;
      form.lowhybridtiles_url.value = bMapTypesData[b].lowreshybridtiles_url;
							
			// just for a pretty button - js sucks it!
			var linkParent = $('maptypeformdata_'+editMapTypeId);
			var linkPKids = linkParent.childNodes;
			for (var p=0; p<linkPKids.length; p++){
						if (linkPKids[p].name == "save_maptype_btn"){
							 linkPKids[p].href = "javascript:storeMapType('edit_maptype.php', document.maptypeform_"+editMapTypeId+");" ;
						}
						if (linkPKids[p].name == "locate_maptype_btn"){
							 linkPKids[p].href = "javascript:alert('feature coming soon');" ;
						}
						if (linkPKids[p].name == "remove_maptype_btn"){
							 linkPKids[p].href = "javascript:removeMapType('edit_maptype.php', document.maptypeform_"+editMapTypeId+");" ;
						}
						if (linkPKids[p].name == "expunge_maptype_btn"){
							 linkPKids[p].href = "javascript:expungeMapType('edit_maptype.php', document.maptypeform_"+editMapTypeId+");" ;
						}
			}
  	}
		}
	}	
};


function newMapType(){
    // Display the New Marker Div and Cancel Button
   	show('newmaptypeform');

		// Reset the Form
		$('maptypeform_new').reset();
};




/*******************
 *
 * MARKER FORM FUNCTIONS
 *
 *******************/

function newMarker(){
    // Display the New Marker Div and Cancel Button
   	show('newmarkerform');

		// Reset the Form
		$('markerform_new').reset();
		
		// shortcut to the Select Option we are adding to
		var selectRoot = $('set_id');

		// we assume we have called this before and reset the options menu
		selectRoot.options.length = 0;

		// add option for each set available
		if ( typeof(bMSetData) != 'undefined' ){
  			for ( i=0; i<bMSetData.length; i++ ){
						if ( bMSetData[i] != null ){
               	selectRoot.options[selectRoot.options.length] = new Option( bMSetData[i].name, bMSetData[i].set_id );
						}
  			}
		}
};


function newMarkerSet(){
    // Display the New Form Div
   	show('newmarkersetform');
		// Reset the Form
		$('markersetform_new').reset();
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
  		if (bMSetData[a]!= null){
    		var getElem = "markerset_"+bMSetData[a].set_id;
    		if ( $(getElem) ) {
        	var extraMarkerForm = $(getElem);
    			$('editmarkerform').removeChild(extraMarkerForm);
    		}
			}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<bMSetData.length; b++) {
  	if (bMSetData[b]!= null){
						
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
      		menuKids[f].href = "javascript:alert('feature coming soon');";
  			}
  			if (menuKids[f].id == "seteditstyle"){
      		menuKids[f].href = "javascript:alert('feature coming soon');";
  			}
  			if (menuKids[f].id == "setremove"){
      		menuKids[f].href = "javascript:removeMarkerSet('edit_markerset.php', "+bMSetData[b].set_id+", 'I');";  //this needs to be modified to account for I or S set type
  			}
  			if (menuKids[f].id == "setdelete"){
      		menuKids[f].href = "javascript:expungeMarkerSet('edit_markerset.php', "+bMSetData[b].set_id+");";
  			}
  			if (menuKids[f].id == "setdesc"){
      		menuKids[f].innerHTML = bMSetData[b].description;
  			}
      }							
  					
      // add form to set table
  		$('editmarkerform').appendChild(newMarkerSet);
  		show('markerset_'+newSetId);
  	}
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
							newMarkerForm.name = "markerform_"+g;
							var nMFKids = newMarkerForm.childNodes;
							for (var o=0; o<nMFKids.length; o++){
							  if (nMFKids[o].id == "formdata_n"){
									nMFKids[o].id = "formdata_"+g;
									}
							}
							
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
				
				// just for a pretty button - js sucks it!
				var linkParent = $('formdata_'+g);
				var linkPKids = linkParent.childNodes;
				for (var p=0; p<linkPKids.length; p++){
						if (linkPKids[p].name == "save_marker_btn"){
							 linkPKids[p].href = "javascript:storeMarker('edit_marker.php', document.markerform_"+g+");" ;
						}
						if (linkPKids[p].name == "locate_marker_btn"){
							 linkPKids[p].href = "javascript:bIMData["+bIMData[g].array_n+"].marker.openInfoWindowHtml(bIMData["+bIMData[g].array_n+"].marker.my_html);" ;
						}
						if (linkPKids[p].name == "remove_marker_btn"){
							 linkPKids[p].href = "javascript:removeMarker('edit_marker.php', document.markerform_"+g+");" ;
						}
						if (linkPKids[p].name == "expunge_marker_btn"){
							 linkPKids[p].href = "javascript:expungeMarker('edit_marker.php', document.markerform_"+g+");" ;
						}
				}
			}
		}		
	}
}



//@todo change this to editMarkerSet(n)
function editSet(n){
				show('setform_'+n);
}




/*******************
 *
 * POLYLINE FORM FUNCTIONS
 *
 *******************/

function newPolyline(){
    // Display the New Form Div and Cancel Button
   	show('newpolylineform');
		// Reset the Form
		$('polylineform_new').reset();
		
		// shortcut to the Select Option we are adding to
		var selectRoot = $('polylineset_id');
		
		selectRoot.options.length = 0;

		// add option for each set available
		if ( typeof(bLSetData) != 'undefined' ){
  			for ( i=0; i<bLSetData.length; i++ ){
						if ( bLSetData[i] != null ){
               	selectRoot.options[selectRoot.options.length] = new Option( bLSetData[i].name, bLSetData[i].set_id );
						}
  			}
		}		
};


function newPolylineSet(){
    // Display the New Form Div
   	show('newpolylinesetform');
		// Reset the Form
		$('polylinesetform_new').reset();
};



/* @todo needs to support markers in bSLData as well as bILData */
function editPolylines(){
	show('editpolylinemenu');
  show('editpolylineform');
	show('editpolylinecancel');
	
	//if polyline data exists
	if ( typeof(bILData) ) {
	
  	// We assume editPolylines has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<bLSetData.length; a++) {
  		if (bLSetData[a]!= null){
    		var getElem = "polylineset_"+bLSetData[a].set_id;
    		if ( $(getElem) ) {
        	var extraPolylineForm = $(getElem);
    			$('editpolylineform').removeChild(extraPolylineForm);
    		}
			}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<bLSetData.length; b++) {
  	if (bLSetData[b]!= null){
		  	
  		newSetId = bLSetData[b].set_id;
  	
  		// clone model set UI
			var newPolylineSet = $('polylineset_n').cloneNode(true);
  		// give a new id to the new set UI
  		newPolylineSet.id = "polylineset_"+newSetId;
  									
  		// customize all the values of our new set UI this gets ugly...										
  		setKids = newPolylineSet.childNodes;
      for (var c=0; c<setKids.length; c++) { 
  			if (setKids[c].id == "editpolylinesetmenu_n"){
  				setKids[c].id = "editpolylinesetmenu_"+newSetId;
  				menuKids = setKids[c].childNodes;
  			}
  			if (setKids[c].id == "polylinesetform_n"){
  				setKids[c].id = "polylinesetform_"+newSetId;    					
  				setForm = setKids[c];
  			}
      }
  					
  		formKids = setForm.childNodes;
      for (var d=0; d<formKids.length; d++) {
  			if (formKids[d].id == "editpolylinetable_n"){
  				formKids[d].id = "editpolylinetable_"+newSetId;
  			}
  			if (formKids[d].id == "allavailpolylines_n"){
  				formKids[d].id = "allavailpolylines_"+newSetId;
  				allPolylinesForm = formKids[d];
  			}
  		}
  
  		allPolyKids = allPolylinesForm.childNodes;
      for (var e=0; e<allPolyKids.length; e++) {
  			if (allPolyKids[e].id == "addpolylinetable_n"){
  				allPolyKids[e].id = "addpolylinetable_"+newSetId;
  			}
  		}
  
  		// Update the set's menu
      for (var f=0; f<menuKids.length; f++) {
  			if (menuKids[f].id == "polylinesetid"){
      		menuKids[f].innerHTML = bLSetData[b].name;
  			}
  			if (menuKids[f].id == "polylinesetstyle"){
      		menuKids[f].innerHTML = bLSetData[b].style_id;
  			}
  			if (menuKids[f].id == "seteditpolylines"){
      		menuKids[f].href = "javascript:editPolylineSet("+newSetId+");";
  			}
  			if (menuKids[f].id == "setaddpolylines"){
      		menuKids[f].href = "javascript:alert('feature coming soon');";
  			}
  			if (menuKids[f].id == "seteditstyle"){
      		menuKids[f].href = "javascript:alert('feature coming soon');";
  			}
  			if (menuKids[f].id == "setremove"){
      		menuKids[f].href = "javascript:removePolylineSet('edit_polylineset.php', "+bLSetData[b].set_id+", 'I');";  //this needs to be modified to account for I or S set type
  			}
  			if (menuKids[f].id == "setdelete"){
      		menuKids[f].href = "javascript:expungePolylineSet('edit_polylineset.php', "+bLSetData[b].set_id+");";
  			}
  			if (menuKids[f].id == "setdesc"){
      		menuKids[f].innerHTML = bLSetData[b].description;
  			}
      }							
  					
      // add form to set table
  		$('editpolylineform').appendChild(newPolylineSet);
  		show('polylineset_'+newSetId);
  	}
		}
		
  	//for length of polylines add form to setelement on matching set_id
  	for (g=0; g<bILData.length; g++) {
			if (bILData[g]!= null){
				//add marker form...again a little ugly here
				var formCont = $("editpolylinetable_"+bILData[g].set_id);
  			formContKids = formCont.childNodes;
        for (var n = 0; n < formContKids.length; n++) {
  				if (formContKids[n].id == "polylineform_n"){
        			var newPolylineForm = formContKids[n].cloneNode(true);
    					newPolylineForm.id = "polylineform_"+g;
							newPolylineForm.name = "polylineform_"+g;
							var nLFKids = newPolylineForm.childNodes;
							for (var o=0; o<nLFKids.length; o++){
							  if (nLFKids[o].id == "polylineformdata_n"){
									nLFKids[o].id = "polylineformdata_"+g;
									}
							}
							
    					$('editpolylinetable_'+bILData[g].set_id).appendChild(newPolylineForm);
							show('polylineform_'+g);
							break;
					}
			  }
				
				// populate set form values
				form = $('polylineform_'+g);

        form.set_id.value = bILData[g].set_id;
        form.polyline_id.value = bILData[g].polyline_id;
        form.name.value = bILData[g].name;				
        for (var r=0; r < 2; r++) {
           if (form.type.options[r].value == bILData[g].type){
              form.type.options[r].selected=true;
           }
        };
        form.points_data.value = bILData[g].points_data;  //this might need to be a loop
        form.border_text.value = bILData[g].border_text;
        form.zindex.value = bILData[g].zindex;
        form.polyline_array.value = bILData[g].array;
        form.polyline_array_n.value = bILData[g].array_n;
				
				// just for a pretty button - js sucks it!
				var linkParent = $('polylineformdata_'+g);
				var linkPKids = linkParent.childNodes;
				for (var p=0; p<linkPKids.length; p++){
						if (linkPKids[p].name == "save_polyline_btn"){
							 linkPKids[p].href = "javascript:storePolyline('edit_polyline.php', document.polylineform_"+g+");" ;
						}
						if (linkPKids[p].name == "locate_polyline_btn"){
							 linkPKids[p].href = "javascript:alert('feature coming soon');" ;
						}
						if (linkPKids[p].name == "remove_polyline_btn"){
							 linkPKids[p].href = "javascript:removePolyline('edit_polyline.php', document.polylineform_"+g+");" ;
						}
						if (linkPKids[p].name == "expunge_polyline_btn"){
							 linkPKids[p].href = "javascript:expungePolyline('edit_polyline.php', document.polylineform_"+g+");" ;
						}
				}
			}
		}		
	}
};



function editPolylineSet(n){
				show('polylinesetform_'+n);
}























/*******************
 *
 *  AJAX FUNCTIONS
 *
 *******************/

   var http_request = false;
	 
	 function storeMap(u, f){
	 		var data;
      data = Form.serialize(f);
			data += "&save_map=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateMap } );
	 }

	 function storeNewMapType(u, f){
	 		var data = Form.serialize(f);
			data += "&gmap_id=" + bMapID;
			data.replace(/\:/g, '%3A');
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: addMapType } );
	 }

	 function storeMapType(u, f){
			editObjectN = Form.getInputs(f, 'hidden', 'array_n')[0].value;
	 		var data = Form.serialize(f);
			data += "&gmap_id=" + bMapID;
			data.replace(/\:/g, '%3A');
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateMapType } );
	 }
	 
	 function removeMapType(u, f){
			editObjectN = Form.getInputs(f, 'hidden', 'array_n')[0].value;
			editSetId = Form.getInputs(f, 'hidden', 'maptype_id')[0].value;
	 		var data = "maptype_id=" + editSetId + "&gmap_id=" + bMapID + "&remove_maptype=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemoveMapType } );
	 }
	 
	 function expungeMapType(u, f){
			editObjectN = Form.getInputs(f, 'hidden', 'array_n')[0].value;
			editSetId = Form.getInputs(f, 'hidden', 'maptype_id')[0].value;
	 		var data = "maptype_id=" + editSetId + "&expunge_maptype=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemoveMapType } );
	 }
	 
	 function storeNewMarker(u, f){
	 		var data;
      data = Form.serialize(f);
			data += '&save_marker=true';
			var elm = Form.getElements(f);
			editSetId = elm[elm.length-1].value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: addMarker } );
	 }
	 
	 function storeMarker(u, f){
	 		var data;
      data = Form.serialize(f);
			data += '&save_marker=true';
			editArray = Form.getInputs(f, 'hidden', 'marker_array')[0].value;
			editObjectN = Form.getInputs(f, 'hidden', 'marker_array_n')[0].value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateMarker } );
	 }
	 
	 function removeMarker(u, f){
	 		var data;
      data = Form.serialize(f);
			editSetId = Form.getInputs(f, 'hidden', 'set_id')[0].value;
			editMarkerId = Form.getInputs(f, 'hidden', 'marker_id')[0].value;
			data = "marker_id=" + editMarkerId + "&set_id=" + editSetId + "&remove_marker=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemoveMarker } );
	 }

	 function expungeMarker(u, f){
	 		var data;
      data = Form.serialize(f);
			editSetId = Form.getInputs(f, 'hidden', 'set_id')[0].value;
			editMarkerId = Form.getInputs(f, 'hidden', 'marker_id')[0].value;
			data = "marker_id=" + editMarkerId + "&expunge_marker=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemoveMarker } );
	 }	 

	 function storeNewMarkerSet(u, f){
	 		var data;
      data = Form.serialize(f);
			data += "&gmap_id=" + bMapID;
			var elm = Form.getElements(f);
			editSetType = elm[elm.length-1].value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: addMarkerSet } );
	 }

	 function removeMarkerSet(u, s, t){
	 		var data;
			var st;
      editArray = t;
			editSetId = s;
			if (t == 'I') {st = 'init_markers';}else{st = 'set_markers';};
			data = "markerset_id=" + s + "&set_type=" + st + "&gmap_id=" + bMapID + "&remove_markerset=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemoveMarkerSet } );
	 }
	 
	 function expungeMarkerSet(u, s){
	 		var data;
			editSetId = s;
			data = "set_id=" + s + "&expunge_markerset=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateExpungeMarkerSet } );
	 }

	 function storeNewPolyline(u, f){
	 		var data;
      data = Form.serialize(f);
			data += '&save_polyline=true';
			var elm = Form.getElements(f);
			editSetId = elm[elm.length-1].value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: addPolyline } );
	 }
	 
	 function storePolyline(u, f){
	 		var data;
      data = Form.serialize(f);
			data += '&save_polyline=true'; //@todo - I think this can come out, the value is in a hidden input field
			editArray = Form.getInputs(f, 'hidden', 'polyline_array')[0].value;
			editObjectN = Form.getInputs(f, 'hidden', 'polyline_array_n')[0].value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updatePolyline } );
	 }
	 
	 function removePolyline(u, f){
	 		var data;
      data = Form.serialize(f);
			editSetId = Form.getInputs(f, 'hidden', 'set_id')[0].value;
			editPolylineId = Form.getInputs(f, 'hidden', 'polyline_id')[0].value;
			data = "polyline_id=" + editPolylineId + "&set_id=" + editSetId + "&remove_polyline=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemovePolyline } );
	 }

	 function expungePolyline(u, f){
	 		var data;
      data = Form.serialize(f);
			editSetId = Form.getInputs(f, 'hidden', 'set_id')[0].value;
			editPolylineId = Form.getInputs(f, 'hidden', 'polyline_id')[0].value;
			data = "polyline_id=" + editPolylineId + "&expunge_polyline=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemovePolyline } );
	 }	 
	 
	 function storeNewPolylineSet(u, f){
	 		var data;
      data = Form.serialize(f);
			data += "&gmap_id=" + bMapID;
			var elm = Form.getElements(f);
			editSetType = elm[elm.length-1].value;
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: addPolylineSet } );
	 }

	 function removePolylineSet(u, s, t){
	 		var data;
			var st;
      editArray = t;
			editSetId = s;
			if (t == 'I') {st = 'init_polylines';}else{st = 'set_polylines';};
			data = "set_id=" + s + "&set_type=" + st + "&gmap_id=" + bMapID + "&remove_polylineset=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateRemovePolylineSet } );
	 }
	 
	 function expungePolylineSet(u, s){
	 		var data;
			editSetId = s;
			data = "set_id=" + s + "&expunge_polylineset=true";
			var newAjax = new Ajax.Request( u, {method: 'get', parameters: data, onComplete: updateExpungePolylineSet } );
	 }

	 








	 
	 
	 
	 
	 
	 
	 





	 

/*******************
 *
 * POST XML Map Functions
 *
 *******************/	 
	 
	 function updateMap(rslt){
	 
      var xml = rslt.responseXML;
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('gmap_id');
			bMapID = id[0].firstChild.nodeValue;
			
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
			
			editMap();
	 }



	 function addMapType(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new maptype in the data array
			var n = bMapTypesData.length;
			bMapTypesData[n] = new Array();
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		bMapTypesData[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		bMapTypesData[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		bMapTypesData[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		bMapTypesData[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		bMapTypesData[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		bMapTypesData[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		bMapTypesData[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		bMapTypesData[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		bMapTypesData[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		bMapTypesData[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		bMapTypesData[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		bMapTypesData[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
			
			bMapTypesData[n].maptype_node = map.mapTypes.length;
			
			// attach the new map type to the map
			var baseid = bMapTypesData[n].basetype;
			var typeid = bMapTypesData[n].maptype_id;
			var typename = bMapTypesData[n].name;
			var result = copy_obj( map.mapTypes[baseid] );

			result.baseUrls = new Array();
			result.baseUrls[0] = bMapTypesData[n].maptiles_url;
			result.typename = bMapTypesData[n].name;
			result.getLinkText = function() { return this.typename; };
			map.mapTypes[map.mapTypes.length] = result;
			bMapTypes[typename] = result;
			
			// set the map type to active
			map.setMapType(bMapTypes[typename]);

			// update the controls
  		map.removeControl(typecontrols);
  		map.addControl(typecontrols);

			// clear the form
			$('maptypeform_new').reset();
			// update the sets menus
			editMapTypes();
	 }



	 
	 function updateMapType(rslt){
      var xml = rslt.responseXML;

			var n = editObjectN;

			//clear maptype in this location from the Map array of Types
			bMapTypes[bMapTypesData[n].name] = null;
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		bMapTypesData[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		bMapTypesData[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		bMapTypesData[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		bMapTypesData[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		bMapTypesData[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		bMapTypesData[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		bMapTypesData[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		bMapTypesData[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		bMapTypesData[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		bMapTypesData[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		bMapTypesData[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		bMapTypesData[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
						
			var p = bMapTypesData[n].maptype_node;

			// attach the new map type to the map
			var baseid = bMapTypesData[n].basetype;
			var typeid = bMapTypesData[n].maptype_id;
			var typename = bMapTypesData[n].name;
			var result = copy_obj( map.mapTypes[baseid] );
			result.baseUrls = new Array();
			result.baseUrls[0] = bMapTypesData[n].maptiles_url;
			result.typename = bMapTypesData[n].name;
			result.getLinkText = function() { return this.typename; };
			map.mapTypes[p] = result;
			bMapTypes[typename] = result;
			
			// set the map type to active
			map.setMapType( bMapTypes[bMapTypesData[n].name] );
	 }

	 
	 
	 function updateRemoveMapType(rslt){
			var n = editObjectN;
			
			// get maptype node value
			var p = bMapTypesData[n].maptype_node;
			
			// remove the maptype ref form the map array of types
			bMapTypes[bMapTypesData[n].name] = null;
			
			// remove the controls
  		map.removeControl(typecontrols);
			
			// remove it from the map			
			map.mapTypes.splice(p, 1);
			
			// add the controls
  		map.addControl(typecontrols);
			
			// @todo we should first check if the map is on display, and then if so flip to street
			// we flip to street mode
			map.setMapType(map.mapTypes[0]);
			
	 		// remove by id the maptype form
    		for (var j=0; j<bMapTypesData.length; j++){
      			if ( ( bMapTypesData[j] != null ) && ( bMapTypesData[j].maptype_id == editSetId ) ){
          		var getElem = "editmaptypetable_" + bMapTypesData[j].maptype_id;
          		if ( $(getElem) ) {
              	var extraMapTypeForm = $(getElem);
          			$('editmaptypeform').removeChild(extraMapTypeForm);
          		}							
							bMapTypesData[n].maptype_id = null;
      				bMapTypesData[n] = null;
							
      			}
    		}			

				
	 }
	 
	 
	 
	 
/*******************
 *
 * POST XML Marker Functions
 *
 *******************/	 
	 	 
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
			//set the overlaying right
			m.marker.setZIndex(Math.round(m.marker.getLatitude()*-100000));
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
			for(a=0; a<bMSetData.length; a++){
					if ( ( bMSetData[a] != null ) && ( bMSetData[a].set_id == editSetId ) ){
						 s = a;
						 break;						 						 
					}
			};

			bIMData[n].set_id = parseInt(bMSetData[s].set_id);
			bIMData[n].style_id = parseInt(bMSetData[s].style_id);
			bIMData[n].icon_id = parseInt(bMSetData[s].icon_id);
			
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

	 

	 function addMarkerSet(rslt){
      var xml = rslt.responseXML;

			//@todo modify this to handle either bIMData or bSMData sets
			var n = bMSetData.length;
			bMSetData[n] = new Array();
						
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('set_id');			
			bMSetData[n].set_id = parseInt(id[0].firstChild.nodeValue);

			var nm = xml.documentElement.getElementsByTagName('name');
			bMSetData[n].name = nm[0].firstChild.nodeValue;			
			
			var dc = xml.documentElement.getElementsByTagName('description');
			bMSetData[n].description = dc[0].firstChild.nodeValue;			

			var sy = xml.documentElement.getElementsByTagName('style_id');
			bMSetData[n].style_id = parseInt(sy[0].firstChild.nodeValue);
			
			var ic = xml.documentElement.getElementsByTagName('icon_id');
			bMSetData[n].icon_id = parseInt(ic[0].firstChild.nodeValue);

  		bMSetData[n].set_type = editSetType;

			// clear the form
			$('markersetform_new').reset();
			// update the sets menus
			if ( $('newmarkerform').style.display == "block" ){ newMarker(); };
			editMarkers();
	 }
	


	function updateRemoveMarker(){
			for (var i=0; i<bIMData.length; i++){
					if ( ( bIMData[i] != null ) && ( bIMData[i].marker_id == editMarkerId ) ){
						map.removeOverlay(bIMData[i].marker);
						bIMData[i] = null;
						break;
					}
			}
			editMarkers();
			editSet(editSetId);
	}

	
	function updateRemoveMarkerSet(){
  	if (editArray == 'I') {
  			for (var i=0; i<bIMData.length; i++){
  					if ( ( bIMData[i] != null ) && ( bIMData[i].set_id == editSetId ) ){
  						map.removeOverlay(bIMData[i].marker);
  						bIMData[i] = null;
  					}
  			}
  	}else{
  			for (var i=0; i<bSMData.length; i++){
  					if ( ( bSMData[i] != null ) && ( bSMData[i].set_id == editSetId ) ){
  						map.removeOverlay(bSMData[i].marker);
  						bSMData[i] = null;
  					}
  			}
		}		
		for (var j=0; j<bMSetData.length; j++){
  			if ( ( bMSetData[j] != null ) && ( bMSetData[j].set_id == editSetId ) ){
      		var getElem = "markerset_"+bMSetData[j].set_id;
      		if ( $(getElem) ) {
          	var extraMarkerForm = $(getElem);
      			$('editmarkerform').removeChild(extraMarkerForm);
      		}
  				bMSetData[j] = null;
  			}
		}
	}
	

	function updateExpungeMarkerSet(){
  			for (var i=0; i<bIMData.length; i++){
  					if ( ( bIMData[i] != null ) && ( bIMData[i].set_id == editSetId ) ){
  						map.removeOverlay(bIMData[i].marker);
  						bIMData[i] = null;
  					}
  			}
				/**  
				 * This is turned off, cause when it doesn't exist it breaks. 
				 * The thing to do is to always create the array, but not fill it out
				 * if there are no markers, then all detection to see if the array exists
				 * can be striped from the code
				 **/
				/*
  			for (var i=0; i<bSMData.length; i++){
  					if ( ( bSMData[i] != null ) && ( bSMData[i].set_id == editSetId ) ){
  						map.removeOverlay(bSMData[i].marker);
  						bSMData[i] = null;
  					}
  			}
				*/
    		for (var j=0; j<bMSetData.length; j++){
      			if ( ( bMSetData[j] != null ) && ( bMSetData[j].set_id == editSetId ) ){
          		var getElem = "markerset_"+bMSetData[j].set_id;
          		if ( $(getElem) ) {
              	var extraMarkerForm = $(getElem);
          			$('editmarkerform').removeChild(extraMarkerForm);
          		}
							bMSetData[j].set_id = null;
      				bMSetData[j] = null;
      			}
    		}
	}
	

	
	
	
/*******************
 *
 * POST XML Polyline Functions
 *
 *******************/	 
	
	 function addPolylineSet(rslt){
      var xml = rslt.responseXML;

			//@todo modify this to handle either bILData or bSLData sets
			var n = bLSetData.length;
			bLSetData[n] = new Array();
						
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('set_id');			
			bLSetData[n].set_id = parseInt(id[0].firstChild.nodeValue);

			var nm = xml.documentElement.getElementsByTagName('name');
			bLSetData[n].name = nm[0].firstChild.nodeValue;			
			
			var dc = xml.documentElement.getElementsByTagName('description');
			bLSetData[n].description = dc[0].firstChild.nodeValue;			

			var sy = xml.documentElement.getElementsByTagName('style_id');
			bLSetData[n].style_id = parseInt(sy[0].firstChild.nodeValue);
			
  		bLSetData[n].set_type = editSetType;
			
			// clear the form
			$('polylinesetform_new').reset();
			// update the sets menus
			if ( $('newpolylineform').style.display == "block" ){ newPolyline(); };
			editPolylines();
	 }


	 function updatePolyline(rslt){
	 		var s;
      var xml = rslt.responseXML;
						
			var n = editObjectN;
			
			//@todo modify this to handle either bILData or bSLData sets
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polyline_id');			
			bILData[n].polyline_id = id[0].firstChild.nodeValue;

			var nm = xml.documentElement.getElementsByTagName('name');
			bILData[n].name = nm[0].firstChild.nodeValue;			
			
			var tp = xml.documentElement.getElementsByTagName('type');
			bILData[n].type = parseInt(tp[0].firstChild.nodeValue);
			
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		bILData[n].points_data = points_data.split(",");
			
			var bt = xml.documentElement.getElementsByTagName('border_text');
			bILData[n].border_text = bt[0].firstChild.nodeValue;			

			var zi = xml.documentElement.getElementsByTagName('zindex');
			bILData[n].zindex = parseInt(zi[0].firstChild.nodeValue);			

			//for now when updating a polyline, we dump the old version and make new.
			//@todo this is redundant to the polyline making loop in js_makegmap.tpl - consolidate
			for (q=0; q<bLStyData.length; q++){
				if (bLStyData[q].style_id == bILData[n].style_id){
					var linecolor = "#"+bLStyData[q].color;
					var lineweight = bLStyData[q].weight;
					var lineopacity = bLStyData[q].opacity;
				}
			}

			var pointlist = new Array();
			for (p = 0; p < bILData[n].points_data.length; p+=2 ){
				var point = new GPoint(
					parseFloat(bILData[n].points_data[p]),
					parseFloat(bILData[n].points_data[p+1])
				);
				pointlist.push(point);
			};
			
			map.removeOverlay(bILData[n].polyline);
			bILData[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
			map.addOverlay(bILData[n].polyline);
	}


	
	 function addPolyline(rslt){
	 		var s;
      var xml = rslt.responseXML;
						
			//@todo modify this to handle either bILData or bSLData sets
			var n = bILData.length;
			bILData[n] = new Array();
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polyline_id');			
			bILData[n].polyline_id = id[0].firstChild.nodeValue;

			var nm = xml.documentElement.getElementsByTagName('name');
			bILData[n].name = nm[0].firstChild.nodeValue;			
			
			var tp = xml.documentElement.getElementsByTagName('type');
			bILData[n].type = parseInt(tp[0].firstChild.nodeValue);
			
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		bILData[n].points_data = points_data.split(",");
			
			var bt = xml.documentElement.getElementsByTagName('border_text');
			bILData[n].border_text = bt[0].firstChild.nodeValue;			

			var zi = xml.documentElement.getElementsByTagName('zindex');
			bILData[n].zindex = parseInt(zi[0].firstChild.nodeValue);			

			//@todo this is such a crappy way to get this number
			for(var a=0; a<bLSetData.length; a++){
					if (bLSetData[a].set_id == editSetId){
						 s = a;
						 break;						 						 
					}
			};
			
			bILData[n].set_id = parseFloat(bLSetData[s].set_id);
			bILData[n].style_id = parseFloat(bLSetData[s].style_id);
			
			bILData[n].array = "I";
			bILData[n].array_n = parseFloat(n);

			//create polyline
			for (q=0; q<bLStyData.length; q++){
				if (bLStyData[q].style_id == bILData[n].style_id){
					var linecolor = "#"+bLStyData[q].color;
					var lineweight = bLStyData[q].weight;
					var lineopacity = bLStyData[q].opacity;
				}
			}

			var pointlist = new Array();
			for (p = 0; p < bILData[n].points_data.length; p+=2 ){
				var point = new GPoint(
					parseFloat(bILData[n].points_data[p]),
					parseFloat(bILData[n].points_data[p+1])
				);
				pointlist.push(point);
			};

			bILData[n].polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
			map.addOverlay(bILData[n].polyline);			

			// clear the form
			$('polylineform_new').reset();
			// update the sets menus
			editPolylines();
			editPolylineSet(editSetId);
	}	
	

	
	function updateRemovePolyline(){
			for (var i=0; i<bILData.length; i++){
					if ( ( bILData[i] != null ) && ( bILData[i].polyline_id == editPolylineId ) ){
						map.removeOverlay(bILData[i].polyline);
						bILData[i] = null;
						break;
					}
			}
			editPolylines();
			editPolylineSet(editSetId);
	}


	function updateRemovePolylineSet(){
  	if (editArray == 'I') {
  			for (var i=0; i<bILData.length; i++){
  					if ( ( bILData[i] != null ) && ( bILData[i].set_id == editSetId ) ){
  						map.removeOverlay(bILData[i].polyline);
  						bILData[i] = null;
  					}
  			}
  	}else{
  			for (var i=0; i<bSLData.length; i++){
  					if ( ( bSLData[i] != null ) && ( bSLData[i].set_id == editSetId ) ){
  						map.removeOverlay(bSLData[i].polyline);
  						bSLData[i] = null;
  					}
  			}
		}		
		for (var j=0; j<bLSetData.length; j++){
  			if ( ( bLSetData[j] != null ) && ( bLSetData[j].set_id == editSetId ) ){
      		var getElem = "polylineset_"+bLSetData[j].set_id;
      		if ( $(getElem) ) {
          	var extraPolylineForm = $(getElem);
      			$('editpolylineform').removeChild(extraPolylineForm);
      		}
  				bLSetData[j] = null;
  			}
		}
	}


	function updateExpungePolylineSet(){
  			for (var i=0; i<bILData.length; i++){
  					if ( ( bILData[i] != null ) && ( bILData[i].set_id == editSetId ) ){
  						map.removeOverlay(bILData[i].polyline);
  						bILData[i] = null;
  					}
  			}
				/**  
				 * This is turned off, cause when it doesn't exist it breaks. 
				 * The thing to do is to always create the array, but not fill it out
				 * if there are no markers, then all detection to see if the array exists
				 * can be striped from the code
				 **/
				/*
  			for (var i=0; i<bSLData.length; i++){
  					if ( ( bSLData[i] != null ) && ( bSLData[i].set_id == editSetId ) ){
  						map.removeOverlay(bSLData[i].polyline);
  						bSLData[i] = null;
  					}
  			}
				*/
    		for (var j=0; j<bLSetData.length; j++){
      			if ( ( bLSetData[j] != null ) && ( bLSetData[j].set_id == editSetId ) ){
          		var getElem = "polylineset_"+bLSetData[j].set_id;
          		if ( $(getElem) ) {
              	var extraPolylineForm = $(getElem);
          			$('editpolylineform').removeChild(extraPolylineForm);
          		}
      				bLSetData[j] = null;
      			}
    		}
	}

	