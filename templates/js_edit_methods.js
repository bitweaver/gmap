//for debugging
function dumpProps(obj, parent) {
   // Go through all the properties of the passed-in object
   for (var i in obj) {
      // if a parent (2nd parameter) was passed in, then use that to
      // build the message. Message includes i (the object's property name)
      // then the object's property value on a new line
      if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
      // Display the message. If the user clicks "OK", then continue. If they
      // click "CANCEL" then quit this level of recursion
      if (!confirm(msg)) { return; }
      // If this property (i) is an object, then recursively process the object
      if (typeof obj[i] == "object") {
         if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
      }
   }
}


// We use Mochikit library for AJAX and substituting getElementById with '$()'
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
		var check = false;
  	for (var i=0; i<bMSetData.length; i++){
  		if ( bMSetData[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a marker, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new marker!";
			show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      newMarkerSet();

		}else{
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
  
        	// update the new form ids
        	newMarkerSetKids = newMarkerSet.childNodes;
				for ( var n = 0; n < newMarkerSetKids.length; n++ ) {
          		if ( newMarkerSetKids[n].id == "markersetform_n" ) {					
              		newMarkerSetKids[n].id = "markersetform_" + newSetId;
                	newMarkerSetKids[n].name = "markersetform_" + newSetId;					 
            		var nMSFKids = newMarkerSetKids[n].childNodes;
            		for (var o=0; o<nMSFKids.length; o++){
              			if (nMSFKids[o].id == "markersetformdata_n"){
              				nMSFKids[o].id = "markersetformdata_" + newSetId;
              			}
            		}
					}

          		if ( newMarkerSetKids[n].id == "setform_n" ) {					
              		newMarkerSetKids[n].id = "setform_" + newSetId;
						formKids = newMarkerSetKids[n].childNodes;
   					for (var p=0; p<formKids.length; p++) {
   						if (formKids[p].id == "editmarkertable_n"){
              				formKids[p].id = "editmarkertable_"+newSetId;
                			if (formKids[p].id == "allavailmarkers_n"){
                				formKids[p].id = "allavailmarkers_"+newSetId;
     							allMarkKids = formKids[p].childNodes;
     							for (var e=0; e<allMarkKids.length; e++) {
        							if (allMarkKids[e].id == "addmarkertable_n"){
        								allMarkKids[e].id = "addmarkertable_"+newSetId;
        							}
     							}
                			}
              			}
   					}
					}
				}

  
        	// add form container to set table
    		$('editmarkerform').appendChild(newMarkerSet);
    		show('markerset_'+newSetId);
				show('markersetform_'+newSetId);

				//get form data div children and update
				var dataKids = $('markersetformdata_' + newSetId).childNodes;
				for (var c=0; c<dataKids.length; c++) { 
    			if (dataKids[c].id == "setname"){dataKids[c].innerHTML = bMSetData[b].name+":";}
     			if (dataKids[c].id == "setdesc"){dataKids[c].innerHTML = bMSetData[b].description;}
    			if (dataKids[c].id == "seteditmarkers"){dataKids[c].href = "javascript:editSet("+newSetId+");";}
    			if (dataKids[c].id == "setaddmarkers"){dataKids[c].href = "javascript:alert('feature coming soon');";}
    			if (dataKids[c].id == "setstore"){dataKids[c].href = "javascript:storeMarkerSet('edit_markerset.php', document.markersetform_"+newSetId+");";}
    			if (dataKids[c].id == "setremove"){dataKids[c].href = "javascript:removeMarkerSet('edit_markerset.php', document.markersetform_"+newSetId+");";}
    			if (dataKids[c].id == "setdelete"){dataKids[c].href = "javascript:expungeMarkerSet('edit_markerset.php', document.markersetform_"+newSetId+");";}
				}
				//get form and update values
				form = $('markersetform_'+newSetId);
				form.set_id.value = newSetId;
				form.set_type.value = bMSetData[b].set_type;
				form.set_array_n.value = b;
				if ( (typeof(bMStyleData) != 'undefined') && (bMStyleData.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<bMStyleData.length; d++){
						if ( bMStyleData[d] != null ){
							form.style_id.options[OptionN + d] = new Option( bMStyleData[d].name, bMStyleData[d].style_id );
							if ( bMStyleData[d].style_id == bMSetData[b].style_id){
							form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
				}
				if ( (typeof(bMIconData) != 'undefined') && (bMIconData.length > 0) ){
					var IconN = form.icon_id.options.length;
  				for (var e=0; e<bMIconData.length; e++){
						if ( bMIconData[e] != null ){
							form.icon_id.options[IconN+e] = new Option( bMIconData[e].name, bMIconData[e].icon_id );
							if ( bMIconData[e].icon_id == bMSetData[b].icon_id){
							form.icon_id.options[IconN+e].selected=true;
							}
  					}
  				}
				}
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
						if (linkPKids[p].name == "marker_assist_btn"){
							 linkPKids[p].href = "javascript:addAssistant('marker', "+g+");" ;
						}
				}
			}
		}		
	}
};



//@todo change this to editMarkerSet(n)
function editSet(n){
				show('setform_'+n);
};


function newIconStyle(){
		var check = false;
  	for (var i=0; i<bMSetData.length; i++){
  		if ( bMSetData[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a icon style, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new icon style!";
			show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      newMarkerSet();

		}else{
      // Display the New Icon Style Div
   		show('newiconstyleform');

  		// Reset the Form
  		$('iconstyleform_new').reset();  		  
		}
};


function editIconStyles(){
		show('editiconstylesmenu');
		show('editiconstyleform');
		show('editiconstylescancel');

  	//if iconstyles data exists
  	if ( typeof( bMIconData ) ) {
  
    	// We assume editIconStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<bMIconData.length; a++) {
    		if ( bMIconData[a]!= null ){
      			var getElem = "editiconstyletable_" + bMIconData[a].icon_id;
        		if ( $(getElem) ) {
            		var extraIconStyleForm = $(getElem);
        			$('editiconstyleform').removeChild(extraIconStyleForm);
        		}
  			}
    	}
  
    	var editIconStyleId;
  
    	// for each iconstyle data set clone the form
    	for (var b=0; b<bMIconData.length; b++) {
        	if ( bMIconData[b]!= null ){  						
    
        		editIconStyleId = bMIconData[b].icon_id;
    
        		// clone the form container
      			var newIconStyle = $('editiconstyletable_n').cloneNode(true);
        		// give a new id to the new form container
        		newIconStyle.id = "editiconstyletable_"+editIconStyleId;
    
      			// update the new form ids
        		newIconStyleForm = newIconStyle.childNodes;
                for ( var n = 0; n < newIconStyleForm.length; n++ ) {
            		if ( newIconStyleForm[n].id == "iconstyleform_n" ) {					
                  		newIconStyleForm[n].id = "iconstyleform_" + editIconStyleId;
                  		newIconStyleForm[n].name = "iconstyleform_" + editIconStyleId;					 
          				var nLSFKids = newIconStyleForm[n].childNodes;
          				for (var o=0; o<nLSFKids.length; o++){
          					if (nLSFKids[o].id == "iconstyleformdata_n"){
          						nLSFKids[o].id = "iconstyleformdata_" + editIconStyleId;
          					}
          				}
          			}
          		}
    
            	// add form to style table
        		$('editiconstyleform').appendChild(newIconStyle);
        		show( 'editiconstyletable_'+editIconStyleId );
        		show( 'iconstyleform_'+editIconStyleId );
    
      			// populate set form values
      			form = $('iconstyleform_' + editIconStyleId );
    
                form.style_array_n.value = b;
                form.icon_id.value = bMIconData[b].icon_id;
                form.name.value = bMIconData[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.type.options[r].value == bMIconData[b].type){
                   		form.type.options[r].selected=true;
                   }
                };
                form.image.value = bMIconData[b].image;
                form.rollover_image.value = bMIconData[b].rollover_image;
                form.icon_w.value = bMIconData[b].icon_w;
                form.icon_h.value = bMIconData[b].icon_h;

				 /* not sure want to both supporting these, 
			 	  * probably more complex than people want to be bothered with
				  * they are NOT in the edit_form.tpl
					----------------------------------------------------------	
					form.print_image.value = bMIconData[b].print_image;
                form.moz_print_image.value = bMIconData[b].moz_print_image;
                form.transparent.value = bMIconData[b].transparent;
                form.print_shadow.value = bMIconData[b].print_shadow;
                form.image_map.value = bMIconData[b].image_map;
				  */

                form.shadow_image.value = bMIconData[b].shadow_image;
                form.shadow_w.value = bMIconData[b].shadow_w;
                form.shadow_h.value = bMIconData[b].shadow_h;
                form.icon_anchor_x.value = bMIconData[b].icon_anchor_x;
                form.icon_anchor_y.value = bMIconData[b].icon_anchor_y;
                form.shadow_anchor_x.value = bMIconData[b].shadow_anchor_x;
                form.shadow_anchor_y.value = bMIconData[b].shadow_anchor_y;
                form.infowindow_anchor_x.value = bMIconData[b].infowindow_anchor_x;
                form.infowindow_anchor_y.value = bMIconData[b].infowindow_anchor_y;
                form.points.value = bMIconData[b].points;
                form.scale.value = bMIconData[b].scale;
                form.outline_color.value = bMIconData[b].outline_color;
                form.outline_weight.value = bMIconData[b].outline_weight;
                form.fill_color.value = bMIconData[b].fill_color;
                form.fill_opacity.value = bMIconData[b].fill_opacity;
    
      			// just for a pretty button - js sucks it!
      			var linkParent = $('iconstyleformdata_'+editIconStyleId);
      			var linkPKids = linkParent.childNodes;
      			for (var p=0; p<linkPKids.length; p++){
      				if (linkPKids[p].name == "save_iconstyle_btn"){
        				linkPKids[p].href = "javascript:storeIconStyle('edit_iconstyle.php', document.iconstyleform_"+editIconStyleId+");" ;
      				}
    			}
      		}
  		}
  	}
}


function newMarkerStyle(){
		var check = false;
  	for (var i=0; i<bMSetData.length; i++){
  		if ( bMSetData[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a marker style, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new marker style!";
			show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      newMarkerSet();

		}else{
      // Display the New Marker Style Div
   		show('newmarkerstyleform');

  		// Reset the Form
  		$('markerstyleform_new').reset();  		  
		};
}


function editMarkerStyles(){
		show('editmarkerstylesmenu');
		show('editmarkerstyleform');
		show('editmarkerstylescancel');

	//if markerstyles data exists
	if ( typeof( bMStyleData ) ) {

  	// We assume editMarkerStyles has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<bMStyleData.length; a++) {
  		if ( bMStyleData[a]!= null ){
    		var getElem = "editmarkerstyletable_" + bMStyleData[a].style_id;
    		if ( $(getElem) ) {
        	var extraMarkerStyleForm = $(getElem);
    			$('editmarkerstyleform').removeChild(extraMarkerStyleForm);
    		}
			}
  	}

  	var editMarkerStyleId;

  	// for each markerstyle data set clone the form
  	for (var b=0; b<bMStyleData.length; b++) {
    	if ( bMStyleData[b]!= null ){  						

    		editMarkerStyleId = bMStyleData[b].style_id;

    		// clone the form container
  			var newMarkerStyle = $('editmarkerstyletable_n').cloneNode(true);
    		// give a new id to the new form container
    		newMarkerStyle.id = "editmarkerstyletable_"+editMarkerStyleId;

  			// update the new form ids
    		newMarkerStyleForm = newMarkerStyle.childNodes;
            for ( var n = 0; n < newMarkerStyleForm.length; n++ ) {
        				if ( newMarkerStyleForm[n].id == "markerstyleform_n" ) {					
              			 newMarkerStyleForm[n].id = "markerstyleform_" + editMarkerStyleId;
              			 newMarkerStyleForm[n].name = "markerstyleform_" + editMarkerStyleId;					 
      							 var nMSFKids = newMarkerStyleForm[n].childNodes;
      							 for (var o=0; o<nMSFKids.length; o++){
      							   if (nMSFKids[o].id == "markerstyleformdata_n"){
      									 nMSFKids[o].id = "markerstyleformdata_" + editMarkerStyleId;
      								 }
      							 }
      					}
      		}

        	// add form to style table
    		$('editmarkerstyleform').appendChild(newMarkerStyle);
    		show( 'editmarkerstyletable_'+editMarkerStyleId );
    		show( 'markerstyleform_'+editMarkerStyleId );

  			// populate set form values
  			form = $('markerstyleform_' + editMarkerStyleId );

            form.style_id.value = bMStyleData[b].style_id;
            form.style_array_n.value = b;
            form.name.value = bMStyleData[b].name;
            for (var r=0; r < 3; r++) {
               if (form.type.options[r].value == bMStyleData[b].type){
               		form.type.options[r].selected=true;
               }
            };
            form.label_hover_opacity.value = bMStyleData[b].label_hover_opacity;
            form.label_opacity.value = bMStyleData[b].label_opacity;
            form.label_hover_styles.value = bMStyleData[b].label_hover_styles;
            form.window_styles.value = bMStyleData[b].window_styles;

  			// just for a pretty button - js sucks it!
  			var linkParent = $('markerstyleformdata_'+editMarkerStyleId);
  			var linkPKids = linkParent.childNodes;
  			for (var p=0; p<linkPKids.length; p++){
  						if (linkPKids[p].name == "save_markerstyle_btn"){
  							 linkPKids[p].href = "javascript:storeMarkerStyle('edit_markerstyle.php', document.markerstyleform_"+editMarkerStyleId+");" ;
  						}
				}

  		}
		}
	}
};


/*******************
 *
 * POLYLINE FORM FUNCTIONS
 *
 *******************/

function newPolyline(){
		var check = false;
  	for (var i=0; i<bLSetData.length; i++){
  		if ( bLSetData[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polyline, there first must be a polyline set associated with this map. Please create a new polyline set, then you can add your new polyline!";
			show('editerror');
  		Fat.fade_all();
  		//display new polyline set form
      newPolylineSet();

		}else{
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
  		newPolylineSetKids = newPolylineSet.childNodes;
			for ( var n = 0; n < newPolylineSetKids.length; n++ ) {
          		if ( newPolylineSetKids[n].id == "polylinesetform_n" ) {					
              		newPolylineSetKids[n].id = "polylinesetform_" + newSetId;
                	newPolylineSetKids[n].name = "polylinesetform_" + newSetId;					 
            		var nMSFKids = newPolylineSetKids[n].childNodes;
            		for (var o=0; o<nMSFKids.length; o++){
              			if (nMSFKids[o].id == "polylinesetformdata_n"){
              				nMSFKids[o].id = "polylinesetformdata_" + newSetId;
              			}
            		}
					}

          		if ( newPolylineSetKids[n].id == "plsetform_n" ) {					
              		newPolylineSetKids[n].id = "plsetform_" + newSetId;
						formKids = newPolylineSetKids[n].childNodes;
   					for (var p=0; p<formKids.length; p++) {
   						if (formKids[p].id == "editpolylinetable_n"){
              				formKids[p].id = "editpolylinetable_"+newSetId;
                			if (formKids[p].id == "allavailpolylines_n"){
                				formKids[p].id = "allavailpolylines_"+newSetId;
     							allPolyKids = formKids[p].childNodes;
     							for (var e=0; e<allPolyKids.length; e++) {
        							if (allPolyKids[e].id == "addpolylinetable_n"){
        								allPolyKids[e].id = "addpolylinetable_"+newSetId;
        							}
     							}
                			}
              			}
   					}
					}
				}

        	// add form container to set table
  			$('editpolylineform').appendChild(newPolylineSet);
    		show('polylineset_'+newSetId);
				show('polylinesetform_'+newSetId);
  
				//get form data div children and update
				var dataKids = $('polylinesetformdata_' + newSetId).childNodes;
				for (var c=0; c<dataKids.length; c++) { 
    			if (dataKids[c].id == "plsetname"){dataKids[c].innerHTML = bLSetData[b].name+":";}
     			if (dataKids[c].id == "plsetdesc"){dataKids[c].innerHTML = bLSetData[b].description;}
    			if (dataKids[c].id == "plsetedit"){dataKids[c].href = "javascript:editPolylineSet("+newSetId+");";}
    			if (dataKids[c].id == "plsetadd"){dataKids[c].href = "javascript:alert('feature coming soon');";}
    			if (dataKids[c].id == "plsetstore"){dataKids[c].href = "javascript:storePolylineSet('edit_polylineset.php', document.polylinesetform_"+newSetId+");";}
    			if (dataKids[c].id == "plsetremove"){dataKids[c].href = "javascript:removePolylineSet('edit_polylineset.php', document.polylinesetform_"+newSetId+");";}
    			if (dataKids[c].id == "plsetdelete"){dataKids[c].href = "javascript:expungePolylinerSet('edit_polylineset.php', document.polylinesetform_"+newSetId+");";}
				}
				//get form and update values
				form = $('polylinesetform_'+newSetId);
				form.set_id.value = newSetId;
				form.set_type.value = bLSetData[b].set_type;
				form.set_array_n.value = b;
				if ( (typeof(bLStyData) != 'undefined') && (bLStyData.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<bLStyData.length; d++){
						if ( bLStyData[d] != null ){
							form.style_id.options[OptionN + d] = new Option( bLStyData[d].name, bLStyData[d].style_id );
							if ( bLStyData[d].style_id == bLSetData[b].style_id){
							form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
				}
			}
		}			

  	//for length of polylines add form to setelement on matching set_id
  	for (g=0; g<bILData.length; g++) {
			if (bILData[g]!= null){
				//add polyline form...again a little ugly here
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
						if (linkPKids[p].name == "polyline_assist_btn"){
							 linkPKids[p].href = "javascript:addAssistant('polyline', " + g + ");" ;
						}
				}
			}
		}		
	}
};








/* @todo needs to support markers in bSLData as well as bILData */
function editPolylinesOld(){
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
						if (linkPKids[p].name == "polyline_assist_btn"){
							 linkPKids[p].href = "javascript:addAssistant('polyline', " + g + ");" ;
						}
				}
			}
		}		
	}
};


function editPolylineSet(n){
		show('plsetform_'+n);
}


function cancelPolylineEdit(){
		canceledit('editpolylinemenu'); 
		canceledit('newpolylineform'); 
		canceledit('editpolylineform'); 
		canceledit('editpolylinecancel');
		removeAssistant();
}; 


function editPolylineStyles(){
		show('editpolylinestylesmenu');
		show('editpolylinestyleform');
		show('editpolylinestylescancel');

  	//if polylinestyles data exists
  	if ( typeof( bLStyData ) ) {
  
    	// We assume editPolylineStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<bLStyData.length; a++) {
    		if ( bLStyData[a]!= null ){
      			var getElem = "editpolylinestyletable_" + bLStyData[a].style_id;
        		if ( $(getElem) ) {
            		var extraPolylineStyleForm = $(getElem);
        			$('editpolylinestyleform').removeChild(extraPolylineStyleForm);
        		}
  			}
    	}
  
    	var editPolylineStyleId;
  
    	// for each markerstyle data set clone the form
    	for (var b=0; b<bLStyData.length; b++) {
        	if ( bLStyData[b]!= null ){  						
    
        		editPolylineStyleId = bLStyData[b].style_id;
    
        		// clone the form container
      			var newPolylineStyle = $('editpolylinestyletable_n').cloneNode(true);
        		// give a new id to the new form container
        		newPolylineStyle.id = "editpolylinestyletable_"+editPolylineStyleId;
    
      			// update the new form ids
        		newPolylineStyleForm = newPolylineStyle.childNodes;
                for ( var n = 0; n < newPolylineStyleForm.length; n++ ) {
            		if ( newPolylineStyleForm[n].id == "polylinestyleform_n" ) {					
                  		newPolylineStyleForm[n].id = "polylinestyleform_" + editPolylineStyleId;
                  		newPolylineStyleForm[n].name = "polylinestyleform_" + editPolylineStyleId;					 
          				var nLSFKids = newPolylineStyleForm[n].childNodes;
          				for (var o=0; o<nLSFKids.length; o++){
          					if (nLSFKids[o].id == "polylinestyleformdata_n"){
          						nLSFKids[o].id = "polylinestyleformdata_" + editPolylineStyleId;
          					}
          				}
          			}
          		}
    
            	// add form to style table
        		$('editpolylinestyleform').appendChild(newPolylineStyle);
        		show( 'editpolylinestyletable_'+editPolylineStyleId );
        		show( 'polylinestyleform_'+editPolylineStyleId );
    
      			// populate set form values
      			form = $('polylinestyleform_' + editPolylineStyleId );
    
                form.style_array_n.value = b;
                form.style_id.value = bLStyData[b].style_id;
                form.name.value = bLStyData[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.type.options[r].value == bLStyData[b].type){
                   		form.type.options[r].selected=true;
                   }
                };
                form.color.value = bLStyData[b].color;
                form.weight.value = bLStyData[b].weight;
                form.opacity.value = bLStyData[b].opacity;
                form.pattern.value = bLStyData[b].pattern;
                form.segment_count.value = bLStyData[b].segment_count;
                form.text_every.value = bLStyData[b].text_every;
                if (bLStyData[b].begin_arrow == false){
                	form.begin_arrow.options[0].selected=true;
                }else{
                	form.begin_arrow.options[1].selected=true;
					}
                if (bLStyData[b].end_arrow == false){
                	form.end_arrow.options[0].selected=true;
                }else{
                	form.end_arrow.options[1].selected=true;
                }
                form.arrows_every.value = bLStyData[b].arrows_every;
                form.text_fgstyle_color.value = bLStyData[b].text_fgstyle_color;
                form.text_fgstyle_weight.value = bLStyData[b].text_fgstyle_weight;
                form.text_fgstyle_opacity.value = bLStyData[b].text_fgstyle_opacity;
                form.text_fgstyle_zindex.value = bLStyData[b].text_fgstyle_zindex;
                form.text_bgstyle_color.value = bLStyData[b].text_bgstyle_color;
                form.text_bgstyle_weight.value = bLStyData[b].text_bgstyle_weight;
                form.text_bgstyle_opacity.value = bLStyData[b].text_bgstyle_opacity;
                form.text_bgstyle_zindex.value = bLStyData[b].text_bgstyle_zindex;
    
      			// just for a pretty button - js sucks it!
      			var linkParent = $('polylinestyleformdata_'+editPolylineStyleId);
      			var linkPKids = linkParent.childNodes;
      			for (var p=0; p<linkPKids.length; p++){
      				if (linkPKids[p].name == "save_polylinestyle_btn"){
        				linkPKids[p].href = "javascript:storePolylineStyle('edit_polylinestyle.php', document.polylinestyleform_"+editPolylineStyleId+");" ;
      				}
    			}
      		}
  		}
  	}
};


function newPolylineStyle(){
		var check = false;
  	for (var i=0; i<bLSetData.length; i++){
  		if ( bLSetData[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polyline style, there first must be a polyline set associated with this map. Please create a new polyline set, then you can add your new polyline style!";
			show('editerror');
  		Fat.fade_all();
  		//display new polyline set form
      newPolylineSet();

		}else{
      // Display the New Polyline Style Div
   		show('newpolylinestyleform');

  		// Reset the Form
  		$('polylinestyleform_new').reset();  		  
		};
}












/*******************
 *
 *  AJAX FUNCTIONS
 *
 *******************/

   var http_request = false;
	 
	 function storeMap(u, f){
			doSimpleXMLHttpRequest(u, f).addCallback(updateMap); 
	 }

	 function storeNewMapType(u, f){
	 		var str = u + "?" + queryString(f) + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( addMapType ); 
	 }

	 function storeMapType(u, f){	 
			editObjectN = f.array_n.value;
	 		var str = u + "?" + queryString(f) + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( updateMapType ); 
	 }
	 
	 function removeMapType(u, f){
			editObjectN = f.array_n.value;
			editSetId = f.maptype_id.value;
	 		var str = u + "?" + "maptype_id=" + editSetId + "&gmap_id=" + bMapID + "&remove_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMapType ); 
	 }
	 
	 function expungeMapType(u, f){
			editObjectN = f.array_n.value;
			editSetId = f.maptype_id.value;
	 		var str = u + "?" + "maptype_id=" + editSetId + "&expunge_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMapType ); 
	 }
	 
	 function storeNewMarker(u, f){
			editSetId = f.set_id.value;
	 		var str = u + "?" + queryString(f) + "&save_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( addMarker ); 
	 }
	 
	 function storeMarker(u, f){
			editArray = f.marker_array.value;
			editObjectN = f.marker_array_n.value;
	 		var str = u + "?" + queryString(f) + "&save_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateMarker ); 
	 }
	 
	 function removeMarker(u, f){
			editSetId = f.set_id.value;
			editMarkerId = f.marker_id.value;
	 		var str = u + "?set_id=" + editSetId + "&marker_id=" + editMarkerId + "&remove_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarker ); 
	 }

	 function expungeMarker(u, f){
			editSetId = f.set_id.value;
			editMarkerId = f.marker_id.value;
	 		var str = u + "?marker_id=" + editMarkerId + "&expunge_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarker ); 
	 }	 

	 function storeNewMarkerSet(u, f){
			canceledit('editerror');
			editSetType = f.set_type.value;
	 		var str = u + "?" + queryString(f) + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( addMarkerSet ); 
	 }

	 function storeMarkerSet(u, f){
			editSetId = f.set_id.value;
			editObjectN = f.set_array_n.value;
			editSetType = f.set_type.value;
	 		var str = u + "?" + queryString(f) + "&gmap_id=" + bMapID + "&save_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateMarkerSet ); 
	 }

	 function removeMarkerSet(u, s, t){
			var st;
			editArray = t;
			editSetId = s;
			if (t == 'I') {st = 'init_markers';}else{st = 'set_markers';};
			var str = u + "?" + "markerset_id=" + s + "&set_type=" + st + "&gmap_id=" + bMapID + "&remove_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarkerSet ); 
	 }

	 function expungeMarkerSet(u, s){
			editSetId = s;
			var str = u + "?" + "set_id=" + s + "&expunge_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateExpungeMarkerSet ); 
	 }
	 
	 function storeNewMarkerStyle(u, f){
	 		var str = u + "?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addMarkerStyle ); 
	 }

	 function storeMarkerStyle(u, f){
			editObjectN = f.style_array_n.value;
	 		var str = u + "?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updateMarkerStyle ); 
	 }

	 function storeNewIconStyle(u, f){
	 		var str = u + "?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addIconStyle ); 
	 }

	 function storeIconStyle(u, f){
			editObjectN = f.style_array_n.value;
	 		var str = u + "?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updateIconStyle ); 
	 }

	 function storeNewPolyline(u, f){
			editSetId = f.set_id.value;
	 		var str = u + "?" + queryString(f) + "&save_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( addPolyline );
	 }
	 
	 function storePolyline(u, f){
			editArray = f.polyline_array.value;
			editObjectN = f.polyline_array_n.value;
			doSimpleXMLHttpRequest(u, f).addCallback( updatePolyline );
	 }
	 
	 function removePolyline(u, f){
			editSetId = f.set_id.value;
			editPolylineId = f.polyline_id.value;
	 		var str = u + "?set_id=" + editSetId + "&polyline_id=" + editPolylineId + "&remove_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolyline );
	 }

	 function expungePolyline(u, f){
			editSetId = f.set_id.value;
			editPolylineId = f.polyline_id.value;
	 		var str = u + "?polyline_id=" + editPolylineId + "&expunge_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolyline );
	 }	 
	 
	 function storeNewPolylineSet(u, f){
			canceledit('editerror');
			editSetType = f.set_type.value;
	 		var str = u + "?" + queryString(f) + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( addPolylineSet );
	 }


	 function storePolylineSet(u, f){
			editSetId = f.set_id.value;
			editObjectN = f.set_array_n.value;
			editSetType = f.set_type.value;
	 		var str = u + "?" + queryString(f) + "&gmap_id=" + bMapID + "&save_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updatePolylineSet );
	 }

	 function removePolylineSet(u, s, t){
			var st;
      	editArray = t;
			editSetId = s;
			if (t == 'I') {st = 'init_polylines';}else{st = 'set_polylines';};
	 		var str = u + "?" + "set_id=" + s + "&set_type=" + st + "&gmap_id=" + bMapID + "&remove_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolylineSet );
	 }
	 
	 function expungePolylineSet(u, s){
			editSetId = s;
	 		var str = u + "?" + "set_id=" + s + "&expunge_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateExpungePolylineSet );
	 }

	 function storeNewPolylineStyle(u, f){
	 		var str = u + "?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addPolylineStyle ); 
	 }

	 function storePolylineStyle(u, f){
			editObjectN = f.style_array_n.value;
	 		var str = u + "?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updatePolylineStyle ); 
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
			var pdt = xml.documentElement.getElementsByTagName('parsed_data');
			var parsed_data = pdt[0].firstChild.nodeValue;
	 		m.parsed_data = parsed_data;
			var l = xml.documentElement.getElementsByTagName('label');
			var label = l[0].firstChild.nodeValue;			
	 		m.label_data = label;			
			var z = xml.documentElement.getElementsByTagName('z');
			var zindex = parseInt(z[0].firstChild.nodeValue);
			m.zindex = zindex;

			var iconn = null;
			if (m.icon_id != 0){
				for (var c=0; c<bMIconData.length; c++){
					if ( bMIconData[c].icon_id == m.icon_id ){
						iconn = c;
					}
				}
			}
			
        //unload the marker
        map.removeOverlay( m.marker );
        //remake the marker
        if (m.style_id == 0){
         		defineGMarker(editArray, editObjectN, iconn);
					m.marker.openInfoWindowHtml(m.marker.my_html);
        }else{
        		var stylen;
        		for (var b=0; b<bMStyleData.length; b++){
        			if ( bMStyleData[b].style_id == m.style_id ){
        				stylen = b;
        			}
        		}
        		//define new marker with new styles
          	if (bMStyleData[stylen].type == 0){
          		defineGxMarker(editArray, editObjectN, iconn, stylen);
					m.marker.openInfoWindowHtml(m.marker.my_html);
          	}else if (bMStyleData[stylen].type == 1){
          		definePdMarker(editArray, editObjectN, iconn, stylen);
                m.marker.showTooltip();
                m.marker.hideTooltip();
					m.marker.showDetailWin();
//					m.marker.openInfoWindowHtml("<div style='white-space: nowrap;'>Click this marker to see its window details</div>");
          	}else if (bMStyleData[stylen].type == 2){
          		defineXMarker(editArray, editObjectN, iconn, stylen);
					m.marker.openInfoWindowHtml(m.marker.my_html);
          	}
        }
			removeAssistant();
	}




	 function addMarker(rslt){
	 		var s;
			for(a=0; a<bMSetData.length; a++){
					if ( ( bMSetData[a] != null ) && ( bMSetData[a].set_id == editSetId ) ){
						 s = a;
						 editArray = bMSetData[a].set_type;
					}
			};

      var xml = rslt.responseXML;						
	 		var m; //the marker data we are changing
			var n;

			/*  This is the new handler for the set types */
			if (editArray == "init_markers"){
  			n = bIMData.length;
  			bIMData[n] = new Array();
				m = bIMData[n];
			}else{
  			n = bSMData.length;
  			bSMData[n] = new Array();
				m = bSMData[n];
			};
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			m.marker_id = id[0].firstChild.nodeValue;
			var tl = xml.documentElement.getElementsByTagName('title');
			m.title = tl[0].firstChild.nodeValue;
			var lt = xml.documentElement.getElementsByTagName('lat');
			m.lat = parseFloat(lt[0].firstChild.nodeValue);
			var ln = xml.documentElement.getElementsByTagName('lon');
			m.lon = parseFloat(ln[0].firstChild.nodeValue);
			var dt = xml.documentElement.getElementsByTagName('data');
			m.data = dt[0].firstChild.nodeValue;
			var pdt = xml.documentElement.getElementsByTagName('parsed_data');
	 		m.parsed_data = pdt[0].firstChild.nodeValue;
			var l = xml.documentElement.getElementsByTagName('label');
			m.label_data = l[0].firstChild.nodeValue;
			m.set_id = parseInt(bMSetData[s].set_id);
			m.style_id = parseInt(bMSetData[s].style_id);
			m.icon_id = parseInt(bMSetData[s].icon_id);
			var z = xml.documentElement.getElementsByTagName('z');
			m.zindex = parseInt(z[0].firstChild.nodeValue);

			m.array = "I";
			m.array_n = parseFloat(n);			

			var iconn = null;
			if (m.icon_id != 0){
				for (var c=0; c<bMIconData.length; c++){
					if ( bMIconData[c].icon_id == m.icon_id ){
						iconn = c;
					}
				}
			}

        //make the marker
        if (m.style_id == 0){
         		defineGMarker(m.array, m.array_n, iconn);
					m.marker.openInfoWindowHtml(m.marker.my_html);
        }else{
        		var stylen;
        		for (var b=0; b<bMStyleData.length; b++){
        			if ( bMStyleData[b].style_id == m.style_id ){
        				stylen = b;
        			}
        		}
        		//define new marker with new styles
          	if (bMStyleData[stylen].type == 0){
          		defineGxMarker(m.array, m.array_n, iconn, stylen);
					m.marker.openInfoWindowHtml(m.marker.my_html);
          	}else if (bMStyleData[stylen].type == 1){
          		definePdMarker(m.array, m.array_n, iconn, stylen);
                m.marker.showTooltip();
                m.marker.hideTooltip();
					m.marker.showDetailWin();
//					m.marker.openInfoWindowHtml("<div style='white-space: nowrap;'>Click this marker to see its window details</div>");
          	}else if (bMStyleData[stylen].type == 2){
          		defineXMarker(m.array, m.array_n, iconn, stylen);
					m.marker.openInfoWindowHtml(m.marker.my_html);
          	}
        }


			// clear the form
			$('markerform_new').reset();
			removeAssistant();
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
	


	function updateMarkerSet(rslt){
      var xml = rslt.responseXML;

			var s = bMSetData[editObjectN];
			var oldStyle = s.style_id;
			var oldIcon = s.icon_id;

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('set_id');			
			s.set_id = parseInt(id[0].firstChild.nodeValue);
			var nm = xml.documentElement.getElementsByTagName('name');
			s.name = nm[0].firstChild.nodeValue;
			var dc = xml.documentElement.getElementsByTagName('description');
			s.description = dc[0].firstChild.nodeValue;
			var sy = xml.documentElement.getElementsByTagName('style_id');
			s.style_id = parseInt(sy[0].firstChild.nodeValue);			
			var ic = xml.documentElement.getElementsByTagName('icon_id');
			s.icon_id = parseInt(ic[0].firstChild.nodeValue);

			if ( ( oldStyle != s.style_id ) || ( oldIcon != s.icon_id ) ) {
				var arrayId = "I";
				a = bIMData;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(n=0; n<a.length; n++){
             		//if the array item is not Null
           			if (a[n]!= null){
       					if (a[n].set_id == s.set_id){
								a[n].style_id = s.style_id;
								a[n].icon_id = s.icon_id;
       						var iconn = null;
                     		if (a[n].icon_id != 0){
                     			for (var c=0; c<bMIconData.length; c++){
                     				if ( bMIconData[c].icon_id == a[n].icon_id ){
                     					iconn = c;
                     				}
                     			}
                     		}
								//unload the marker
         					map.removeOverlay( a[n].marker );
    						//define marker
            				if (a[n].style_id == 0){
            					defineGMarker(arrayId, n, iconn);
            				}else{
  								var stylen;
  								for (q=0; q<bMStyleData.length; q++){
  									if (bMStyleData[q].style_id == s.style_id) {
  										stylen = q;
  									}
  								}
             					if (bMStyleData[stylen].type == 0){
             						defineGxMarker(arrayId, n, iconn, stylen);
             					}else if (bMStyleData[stylen].type == 1){
             						definePdMarker(arrayId, n, iconn, stylen);
             					}else if (bMStyleData[stylen].type == 2){
             						defineXMarker(arrayId, n, iconn, stylen);
             					}
    						}
       					}
       				}
       			}
       		}
			};

			// update the sets menus
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
	


	 function addMarkerStyle(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new markerstyle in the data array
			var n = bMStyleData.length;
			bMStyleData[n] = new Array();
			var s = bMStyleData[n];

			// assign markerstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('type');			
  		s.type = parseInt( tp[0].firstChild.nodeValue );
			var lho = xml.documentElement.getElementsByTagName('label_hover_opacity');			
  		s.label_hover_opacity = parseInt( lho[0].firstChild.nodeValue );
			var lo = xml.documentElement.getElementsByTagName('label_opacity');			
  		s.label_opacity = parseInt( lo[0].firstChild.nodeValue );
			var lhs = xml.documentElement.getElementsByTagName('label_hover_styles');			
  		s.label_hover_styles = parseInt( lhs[0].firstChild.nodeValue );
			var ws = xml.documentElement.getElementsByTagName('window_styles');			
  		s.window_styles = parseInt( ws[0].firstChild.nodeValue );
						
			// clear the form
			$('markerstyleform_new').reset();
			// update the styles menus
			editMarkerStyles();
	 }



	 function updateMarkerStyle(rslt){
      var xml = rslt.responseXML;

			//get the style we are updating
			var s = bMStyleData[editObjectN];

			// assign markerstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('type');
			var oldtp = s.type;
  		s.type = parseInt( tp[0].firstChild.nodeValue );
			var lho = xml.documentElement.getElementsByTagName('label_hover_opacity');			
  		s.label_hover_opacity = parseInt( lho[0].firstChild.nodeValue );
			var lo = xml.documentElement.getElementsByTagName('label_opacity');			
  		s.label_opacity = parseInt( lo[0].firstChild.nodeValue );
			var lhs = xml.documentElement.getElementsByTagName('label_hover_styles');			
  		s.label_hover_styles = lhs[0].firstChild.nodeValue;
			var ws = xml.documentElement.getElementsByTagName('window_styles');			
  		s.window_styles = ws[0].firstChild.nodeValue;

			//@todo - this needs to be made to support more than just init_markers
			//update all markers
			//for each marker
			var arrayId = "I";
      	var a = bIMData;
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null){
						if (a[n].style_id == s.style_id){
							if (s.type != oldtp){
  						//if style type is different
								var iconn = null;
            				if (a[n].icon_id != 0){
            					for (var c=0; c<bMIconData.length; c++){
            						if ( bMIconData[c].icon_id == a[n].icon_id ){
            							iconn = c;
            						}
            					}
            				}

	      					//unload the marker
  							map.removeOverlay( a[n].marker );
	      					//define new marker with new styles
  							if (s.type == 0){
  								defineGxMarker(arrayId, n, iconn, editObjectN);
  							}else if (s.type == 1){
  								definePdMarker(arrayId, n, iconn, editObjectN);
  							}else if (s.type == 2){
  								defineXMarker(arrayId, n, iconn, editObjectN);
  							}
							}
						}
					}
				}
			}

			//add the replacement styles
        var ttStyle = document.createElement('style');
			var ttStyleProperties = document.createTextNode(".tip-" + s.name + " {" + s.label_hover_styles + "}");
        ttStyle.setAttribute ("type", "text/css");
        ttStyle.appendChild(ttStyleProperties);
			document.body.appendChild(ttStyle);

        var winStyle = document.createElement('style');
			var winStyleProperties = document.createTextNode(".win-" + s.name + " {" + s.window_styles + "}");
        winStyle.setAttribute ("type", "text/css");
        winStyle.appendChild(winStyleProperties);
			document.body.appendChild(winStyle);
	 }

	



	 function addIconStyle(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new iconstyle in the data array
			var n = bMIconData.length;
			bMIconData[n] = new Array();
			var m = bMIconData[n];

			// assign iconstyle values to data array			
			var id = xml.documentElement.getElementsByTagName('icon_id');
  		m.icon_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');
  		m.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('type');
  		m.type = parseInt( tp[0].firstChild.nodeValue );
			var ig = xml.documentElement.getElementsByTagName('image');
  		m.image = ig[0].firstChild.nodeValue;
			var rig = xml.documentElement.getElementsByTagName('rollover_image');
  		m.rollover_image = rig[0].firstChild.nodeValue;
			var icw = xml.documentElement.getElementsByTagName('icon_w');
  		m.icon_w = parseInt( icw[0].firstChild.nodeValue );
			var ich = xml.documentElement.getElementsByTagName('icon_h');
  		m.icon_h = parseInt( ich[0].firstChild.nodeValue );
			var is = xml.documentElement.getElementsByTagName('shadow_image');			
  		m.shadow_image = is[0].firstChild.nodeValue;
			var isw = xml.documentElement.getElementsByTagName('shadow_w');
  		m.shadow_w = parseInt( isw[0].firstChild.nodeValue );
			var ish = xml.documentElement.getElementsByTagName('shadow_h');
  		m.shadow_h = parseInt( ish[0].firstChild.nodeValue );
			var iax = xml.documentElement.getElementsByTagName('icon_anchor_x');			
  		m.icon_anchor_x = parseInt( iax[0].firstChild.nodeValue );
			var iay = xml.documentElement.getElementsByTagName('icon_anchor_y');			
  		m.icon_anchor_y = parseInt( iay[0].firstChild.nodeValue );
			var sax = xml.documentElement.getElementsByTagName('shadow_anchor_x');			
  		m.shadow_anchor_x = parseInt( sax[0].firstChild.nodeValue );
			var say = xml.documentElement.getElementsByTagName('shadow_anchor_y');			
  		m.shadow_anchor_y = parseInt( say[0].firstChild.nodeValue );
			var wax = xml.documentElement.getElementsByTagName('infowindow_anchor_x');			
  		m.infowindow_anchor_x = parseInt( wax[0].firstChild.nodeValue );
			var way = xml.documentElement.getElementsByTagName('infowindow_anchor_y');			
  		m.infowindow_anchor_y = parseInt( way[0].firstChild.nodeValue );
			var pt = xml.documentElement.getElementsByTagName('points');
  		m.points = pt[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('scale');
  		m.scale = sc[0].firstChild.nodeValue;
			var olc = xml.documentElement.getElementsByTagName('outline_color');
  		m.outline_color = olc[0].firstChild.nodeValue;
			var olw = xml.documentElement.getElementsByTagName('outline_weight');
  		m.outline_weight = olw[0].firstChild.nodeValue;
			var fc = xml.documentElement.getElementsByTagName('fill_color');
  		m.fill_color = fc[0].firstChild.nodeValue;
			var fo = xml.documentElement.getElementsByTagName('fill_opacity');
  		m.fill_opacity = fo[0].firstChild.nodeValue;


			//make the icon available
  		if (m.type == 0) {
  			defineGIcon(editObjectN);
  		}else if(m.type == 1){
  			defineXIcon(editObjectN);			
  		}

			// clear the form
			$('iconstyleform_new').reset();
			// update the styles menus
			editIconStyles();
	 }


	
	 function updateIconStyle(rslt){
      	var xml = rslt.responseXML;

			//get the style we are updating
			var m = bMIconData[editObjectN];

			// assign iconsstyle values to data array
			var id = xml.documentElement.getElementsByTagName('icon_id');
  		m.icon_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');
  		m.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('type');
  		m.type = parseInt( tp[0].firstChild.nodeValue );
			var ig = xml.documentElement.getElementsByTagName('image');
  		m.image = ig[0].firstChild.nodeValue;
			var rig = xml.documentElement.getElementsByTagName('rollover_image');
  		m.rollover_image = rig[0].firstChild.nodeValue;
			var icw = xml.documentElement.getElementsByTagName('icon_w');
  		m.icon_w = parseInt( icw[0].firstChild.nodeValue );
			var ich = xml.documentElement.getElementsByTagName('icon_h');
  		m.icon_h = parseInt( ich[0].firstChild.nodeValue );
			var is = xml.documentElement.getElementsByTagName('shadow_image');			
  		m.shadow_image = is[0].firstChild.nodeValue;
			var isw = xml.documentElement.getElementsByTagName('shadow_w');
  		m.shadow_w = parseInt( isw[0].firstChild.nodeValue );
			var ish = xml.documentElement.getElementsByTagName('shadow_h');
  		m.shadow_h = parseInt( ish[0].firstChild.nodeValue );
			var iax = xml.documentElement.getElementsByTagName('icon_anchor_x');			
  		m.icon_anchor_x = parseInt( iax[0].firstChild.nodeValue );
			var iay = xml.documentElement.getElementsByTagName('icon_anchor_y');			
  		m.icon_anchor_y = parseInt( iay[0].firstChild.nodeValue );
			var sax = xml.documentElement.getElementsByTagName('shadow_anchor_x');			
  		m.shadow_anchor_x = parseInt( sax[0].firstChild.nodeValue );
			var say = xml.documentElement.getElementsByTagName('shadow_anchor_y');			
  		m.shadow_anchor_y = parseInt( say[0].firstChild.nodeValue );
			var wax = xml.documentElement.getElementsByTagName('infowindow_anchor_x');			
  		m.infowindow_anchor_x = parseInt( wax[0].firstChild.nodeValue );
			var way = xml.documentElement.getElementsByTagName('infowindow_anchor_y');			
  		m.infowindow_anchor_y = parseInt( way[0].firstChild.nodeValue );
			var pt = xml.documentElement.getElementsByTagName('points');
  		m.points = pt[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('scale');
  		m.scale = sc[0].firstChild.nodeValue;
			var olc = xml.documentElement.getElementsByTagName('outline_color');
  		m.outline_color = olc[0].firstChild.nodeValue;
			var olw = xml.documentElement.getElementsByTagName('outline_weight');
  		m.outline_weight = olw[0].firstChild.nodeValue;
			var fc = xml.documentElement.getElementsByTagName('fill_color');
  		m.fill_color = fc[0].firstChild.nodeValue;
			var fo = xml.documentElement.getElementsByTagName('fill_opacity');
  		m.fill_opacity = fo[0].firstChild.nodeValue;

			//update the icon
  		if (m.type == 0) {
  			defineGIcon(editObjectN);
  		}else if(m.type == 1){
  			defineXIcon(editObjectN);			
  		}

			//@todo - this needs to be made to support more than just init_markers
			//update all markers
			//for each marker
			var arrayId = "I";
      	var a = bIMData;
    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null){
						if (a[n].icon_id == m.icon_id){
	      				//unload the marker
  						map.removeOverlay( a[n].marker );
							/* this stuff gets the correct style reference, 
							 * might be better to attach the styleArray 
							 * index to the marker data somewhere higher up 
							 * to minimize these loops - but several 
							 * update methods will have to be changed
							 */
        				if (a[n].style_id == 0){
        					defineGMarker(arrayId, n, editObjectN);
        				}else{
        					var stylen;
        					for (var b=0; b<bMStyleData.length; b++){
        						if ( bMStyleData[b].style_id == a[n].style_id ){
        							stylen = b;
        						}
        					}
        					if ( bMStyleData[stylen].type == 0){
        						defineGxMarker(arrayId, n, editObjectN, stylen);
        					}else if ( bMStyleData[stylen].type == 1){
        						definePdMarker(arrayId, n, editObjectN, stylen);
        					}else if ( bMStyleData[stylen].type == 2){
        						defineXMarker(arrayId, n, editObjectN, stylen);
        					}
        				}
						}
					}
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




	function updatePolylineSet(rslt){
      	var xml = rslt.responseXML;

			var s = bLSetData[editObjectN];
			var oldStyle = s.style_id;

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('set_id');			
			s.set_id = parseInt(id[0].firstChild.nodeValue);
			var nm = xml.documentElement.getElementsByTagName('name');
			s.name = nm[0].firstChild.nodeValue;
			var dc = xml.documentElement.getElementsByTagName('description');
			s.description = dc[0].firstChild.nodeValue;
			var sy = xml.documentElement.getElementsByTagName('style_id');
			s.style_id = parseInt(sy[0].firstChild.nodeValue);			

			if ( oldStyle != s.style_id ) {
				var arrayId = "I";
				a = bILData;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(n=0; n<a.length; n++){
             		//if the array item is not Null
           			if (a[n]!= null){
       					if (a[n].set_id == s.set_id){
								a[n].style_id = s.style_id;
								//unload the polyline
         					map.removeOverlay( a[n].polyline );
                 			//create polyline
            				if (a[n].style_id == 0){
                 				defineGPolyline(arrayId, n, null);
                 			}else{
                 				var stylen;
                 				for (var b=0; b<bLStyData.length; b++){
                 					if ( bLStyData[b].style_id == s.style_id ){
                 						stylen = b;
                 					}
                 				}
                 				if ( bLStyData[stylen].type == 0){
                 					defineGPolyline(arrayId, n, stylen);
                 				}else{
                 					defineXPolyline(arrayId, n, stylen);
                 				}
                 			}
       					}
       				}
       			}
       		}
			};

			// update the sets menus
			editPolylines();
	}





	 function updatePolyline(rslt){
			var xml = rslt.responseXML;
			var p;

			if (editArray == "I"){p = bILData[editObjectN];}else{p = bSLData[editObjectN];};
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polyline_id');			
			p.polyline_id = id[0].firstChild.nodeValue;
			var nm = xml.documentElement.getElementsByTagName('name');
			p.name = nm[0].firstChild.nodeValue;	
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		p.points_data = points_data.split(",");			
			var bt = xml.documentElement.getElementsByTagName('border_text');
			p.border_text = bt[0].firstChild.nodeValue;
			var zi = xml.documentElement.getElementsByTagName('zindex');
			p.zindex = parseInt(zi[0].firstChild.nodeValue);			
			
			//remove old version
			map.removeOverlay(p.polyline);

			//create polyline
			if (p.style_id == 0){
				defineGPolyline(p.array, p.array_n, null);
			}else{
				var stylen;
				for (var b=0; b<bLStyData.length; b++){
					if ( bLStyData[b].style_id == p.style_id ){
						stylen = b;
					}
				}
				if ( bLStyData[stylen].type == 0){
					defineGPolyline(p.array, p.array_n, stylen);
				}else{
					defineXPolyline(p.array, p.array_n, stylen);
				}
			}

			removeAssistant();
	}


	
	 function addPolyline(rslt){
      	var xml = rslt.responseXML;
	 		var s;
			var n;
			var p;

			for(a=0; a<bLSetData.length; a++){
					if ( ( bLSetData[a] != null ) && ( bLSetData[a].set_id == editSetId ) ){
						 s = a;
						 editArray = bLSetData[a].set_type;
					}
			};

			if (editArray == "init_polylines"){
  			n = bILData.length;
  			bILData[n] = new Array();
				p = bILData[n];
  			p.array = "I";
  			p.array_n = n;
			}else{
  			n = bSLData.length;
  			bSLData[n] = new Array();
				p = bSLData[n];
  			p.array = "S";
  			p.array_n = n;
			};
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polyline_id');			
			p.polyline_id = id[0].firstChild.nodeValue;
			var nm = xml.documentElement.getElementsByTagName('name');
			p.name = nm[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		p.points_data = points_data.split(",");			
			var bt = xml.documentElement.getElementsByTagName('border_text');
			p.border_text = bt[0].firstChild.nodeValue;
			var zi = xml.documentElement.getElementsByTagName('zindex');
			p.zindex = parseInt(zi[0].firstChild.nodeValue);			

			//this is such a crappy way to get this number
			for(var a=0; a<bLSetData.length; a++){
					if (bLSetData[a].set_id == editSetId){
						 s = a;
					}
			};
			
			p.set_id = parseFloat(bLSetData[s].set_id);
			p.style_id = parseFloat(bLSetData[s].style_id);

			//create polyline
			if (p.style_id == 0){
				defineGPolyline(p.array, p.array_n, null);
			}else{
				var stylen;
				for (var b=0; b<bLStyData.length; b++){
					if ( bLStyData[b].style_id == p.style_id ){
						stylen = b;
					}
				}
				if ( bLStyData[stylen].type == 0){
					defineGPolyline(p.array, p.array_n, stylen);
				}else{
					defineXPolyline(p.array, p.array_n, stylen);
				}
			}

			// clear the form
			$('polylineform_new').reset();
			// update the sets menus
			editPolylines();
			editPolylineSet(editSetId);
			removeAssistant();
	}	
	




	 function addPolylineStyle(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new polylinestyle in the data array
			var n = bLStyData.length;
			bLStyData[n] = new Array();
			var s = bLStyData[n];

			// assign polylinestyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('type');			
  		s.type = parseInt( tp[0].firstChild.nodeValue );
			var cl = xml.documentElement.getElementsByTagName('color');			
  		s.color = cl[0].firstChild.nodeValue;
			var wt = xml.documentElement.getElementsByTagName('weight');			
  		s.weight = parseInt( wt[0].firstChild.nodeValue );
			var op = xml.documentElement.getElementsByTagName('opacity');			
  		s.opacity = op[0].firstChild.nodeValue;
			var pt = xml.documentElement.getElementsByTagName('pattern');			
  		s.pattern = pt[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('segment_count');			
  		s.segment_count = parseInt( sc[0].firstChild.nodeValue );
			var ba = xml.documentElement.getElementsByTagName('begin_arrow');			
  		s.begin_arrow = ba[0].firstChild.nodeValue;
			var ea = xml.documentElement.getElementsByTagName('end_arrow');			
  		s.end_arrow = ea[0].firstChild.nodeValue;
			var ae = xml.documentElement.getElementsByTagName('arrows_every');			
  		s.arrows_every = parseInt( ae[0].firstChild.nodeValue );
			var te = xml.documentElement.getElementsByTagName('text_every');			
  		s.text_every = parseInt( te[0].firstChild.nodeValue );
			var tfc = xml.documentElement.getElementsByTagName('text_fgstyle_color');			
  		s.text_fgstyle_color = tfc[0].firstChild.nodeValue;
			var tfw = xml.documentElement.getElementsByTagName('text_fgstyle_weight');			
  		s.text_fgstyle_weight = parseInt( tfw[0].firstChild.nodeValue );
			var tfo = xml.documentElement.getElementsByTagName('text_fgstyle_opacity');			
  		s.text_fgstyle_opacity = tfo[0].firstChild.nodeValue;
			var tfi = xml.documentElement.getElementsByTagName('text_fgstyle_zindex');			
  		s.text_fgstyle_zindex = parseInt( tfi[0].firstChild.nodeValue );
			var tbc = xml.documentElement.getElementsByTagName('text_fgstyle_color');			
  		s.text_bgstyle_color = tbc[0].firstChild.nodeValue;
			var tbw = xml.documentElement.getElementsByTagName('text_fgstyle_weight');			
  		s.text_bgstyle_weight = parseInt( tbw[0].firstChild.nodeValue );
			var tbo = xml.documentElement.getElementsByTagName('text_fgstyle_opacity');			
  		s.text_bgstyle_opacity = tbo[0].firstChild.nodeValue;
			var tbi = xml.documentElement.getElementsByTagName('text_fgstyle_zindex');			
  		s.text_bgstyle_zindex = parseInt( tbi[0].firstChild.nodeValue );

			// clear the form
			$('polylinestyleform_new').reset();
			// update the styles menus
			editPolylineStyles();
	 }



	 function updatePolylineStyle(rslt){
      	var xml = rslt.responseXML;

			//get the style we are updating
			var s = bLStyData[editObjectN];

			// assign markerstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('type');			
  		s.type = parseInt( tp[0].firstChild.nodeValue );
			var cl = xml.documentElement.getElementsByTagName('color');			
  		s.color = cl[0].firstChild.nodeValue;
			var wt = xml.documentElement.getElementsByTagName('weight');			
  		s.weight = parseInt( wt[0].firstChild.nodeValue );
			var op = xml.documentElement.getElementsByTagName('opacity');			
  		s.opacity = op[0].firstChild.nodeValue;
			var pt = xml.documentElement.getElementsByTagName('pattern');			
  		s.pattern = pt[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('segment_count');			
  		s.segment_count = parseInt( sc[0].firstChild.nodeValue );
			var ba = xml.documentElement.getElementsByTagName('begin_arrow');
			if (ba[0].firstChild.nodeValue == 'true'){
	  		s.begin_arrow = true;
			}else{
	  		s.begin_arrow = false;
			}
			var ea = xml.documentElement.getElementsByTagName('end_arrow');			
			if (ea[0].firstChild.nodeValue == 'true'){
	  		s.end_arrow = true;
			}else{
	  		s.end_arrow = false;
			}
			var ae = xml.documentElement.getElementsByTagName('arrows_every');			
  		s.arrows_every = parseInt( ae[0].firstChild.nodeValue );
			var te = xml.documentElement.getElementsByTagName('text_every');			
  		s.text_every = parseInt( te[0].firstChild.nodeValue );
			var tfc = xml.documentElement.getElementsByTagName('text_fgstyle_color');			
  		s.text_fgstyle_color = tfc[0].firstChild.nodeValue;
			var tfw = xml.documentElement.getElementsByTagName('text_fgstyle_weight');			
  		s.text_fgstyle_weight = parseInt( tfw[0].firstChild.nodeValue );
			var tfo = xml.documentElement.getElementsByTagName('text_fgstyle_opacity');			
  		s.text_fgstyle_opacity = tfo[0].firstChild.nodeValue;
			var tfi = xml.documentElement.getElementsByTagName('text_fgstyle_zindex');			
  		s.text_fgstyle_zindex = parseInt( tfi[0].firstChild.nodeValue );
			var tbc = xml.documentElement.getElementsByTagName('text_bgstyle_color');			
  		s.text_bgstyle_color = tbc[0].firstChild.nodeValue;
			var tbw = xml.documentElement.getElementsByTagName('text_bgstyle_weight');			
  		s.text_bgstyle_weight = parseInt( tbw[0].firstChild.nodeValue );
			var tbo = xml.documentElement.getElementsByTagName('text_bgstyle_opacity');			
  		s.text_bgstyle_opacity = tbo[0].firstChild.nodeValue;
			var tbi = xml.documentElement.getElementsByTagName('text_bgstyle_zindex');			
  		s.text_bgstyle_zindex = parseInt( tbi[0].firstChild.nodeValue );

			//@todo - this needs to be made to support more than just init_polylines
			//update all polylines
			//for each marker
			var arrayId = "I";
      	var a = bILData;
    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null){
						if (a[n].style_id == s.style_id){
							map.removeOverlay(a[n].polyline);   
    					if (s.type == 0){
    						defineGPolyline(arrayId, n, editObjectN);
    					}else{
    						defineXPolyline(arrayId, n, editObjectN);
    					}
						}
    			}
    		}
    	}
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




	
	
	
/******************
 *
 *  Editing Tools
 *
 ******************/
 var bLastpoint;
 var bAssistant;
 var bTempPoints = new Array();	//create point array
 var bTP; //temporary polyline
 var bModForm;
 var bModPData; 
 var bModMLat;
 var bModMLon;
	
 function addAssistant(a, b){
 	removeAssistant();
 	if (a == 'polyline'){
		bModForm = $('polylineform_'+b);
 		bModPData = bModForm.points_data; 
		alert ('Polyline drawing assistant activated for '+ bModForm.name.value + ' polyline. \n Click to Draw!');
		
		bLastpoint = null;
	  bTempPoints = [];
  	bTP = new GPolyline(bTempPoints);
  	map.addOverlay(bTP);		//create polyline object from points and add to map
  
  	bAssistant = GEvent.addListener(map, "click", function(overlay,point) {
                		if(bLastpoint && bLastpoint.x==point.x && bLastpoint.y==point.y) return;
                		bLastpoint = point;
                		
                		bTempPoints.push(point);
                		map.removeOverlay(bTP);
                		bTP = new GPolyline(bTempPoints);
                		map.addOverlay(bTP);

                		for(var i=0; i<bTempPoints.length; i++){
											if (i == 0){
												msg = bTempPoints[i].x + ', ' + bTempPoints[i].y;
												}else{
                				msg += ', ' + bTempPoints[i].x + ', ' + bTempPoints[i].y;
											}
                		}
										
                		bModPData.value = msg;
              	});
	}
	
	if (a == 'marker'){
		bModForm = $('markerform_'+b);
 		bModMLat = bModForm.marker_lat; 
 		bModMLon = bModForm.marker_lon; 
		alert ('Marker ploting assistant activated for '+ bModForm.title.value + ' marker. \n Click to Position!');
	
  	bAssistant = GEvent.addListener(map, "click", function(overlay, point){
                    if (point) {
											if (bTP != null) {
                    	  map.removeOverlay(bTP);
											}
											bTP = new GMarker(point);
                      map.addOverlay(bTP);
                      map.recenterOrPanToLatLng(point);
											bModMLat.value = point.y;
											bModMLon.value = point.x;											
                    }
      					});
  }
 }	

	
 function removeAssistant(){
   if (bAssistant != null){
      map.removeOverlay(bTP);
   		GEvent.removeListener(bAssistant);
  		bAssistant = null;
	 }
 } 

