//for debugging
BitMap.dumpProps(obj, parent) {
   for (var i in obj) {
      if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
      if (!confirm(msg)) { return; }
      if (typeof obj[i] == "object") {
         if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
      }
   }
}

if (typeof(BitMap) == 'undefined') {
    BitMap = {};
}

if (typeof(BitMap.Edit) == 'undefined') {
    BitMap.Edit = [];
}

BitMap.EditMap = function(){
  BitMap.Initialize();
  BitMap.MapData[0].Map.addOverlayListener();
  BitMap.MapData[0].Map.attachSideMarkers();
};

// We use Mochikit library for AJAX and substituting getElementById with '$()'
// MAP EDITING FUNCTIONS

// for tracking which object we are updating
BitMap.Edit.editArray;
BitMap.Edit.editObjectN;
BitMap.Edit.editSetId;
BitMap.Edit.editMarkerId;
BitMap.Edit.editPolylineId;
BitMap.Edit.editSetType;

// for sorting arrays
BitMap.Edit.sortOn(a,b){ 
	return a['set_id']-b['set_id']; 
} 

BitMap.Edit.sortIt(pParamHash){
	pParamHash.sort(sortOn); 
}

BitMap.Edit.canceledit = function(i){
	$(i).style.display = "none";	
};

BitMap.Edit.toggleIconMenu = function(o, n){
	if (o == 0){
		$('xicon_style_head_'+n).style.display = 'none';
		$('xicon_style_menu_'+n).style.display = 'none';
		$('gicon_style_head_'+n).style.display = 'table-row';
		$('gicon_style_menu1_'+n).style.display = 'table-row';
		$('gicon_style_menu2_'+n).style.display = 'table-row';
	}else{
		$('xicon_style_head_'+n).style.display = 'table-row';
		$('xicon_style_menu_'+n).style.display = 'table-row';
		$('gicon_style_head_'+n).style.display = 'none';
		$('gicon_style_menu1_'+n).style.display = 'none';
		$('gicon_style_menu2_'+n).style.display = 'none';
	}
};



/*******************
 *
 * MAP FORM FUNCTIONS
 *
 *******************/

// builds the map editing form
BitMap.Edit.editMap = function(Map){
				  $('mapform').reset();
				 	BitMap.Edit.show('editmapform');

    			$('gmap_id').value = Map.id;
    			$('map_title').value = Map.title;
    			$('map_desc').value = Map.description;
    			$('map_w').value = Map.width;
    			$('map_h').value = Map.height;
    			$('map_lat').value = Map.lat;
    			$('map_lon').value = Map.lng;
    			$('map_z').value = Map.zoom;

					form = $('mapform');
					form.edit.value = Map.data;

        	for (var i=0; i < 4; i++) {
             if ($('map_showcont').options[i].value == Map.zoom_control){
                $('map_showcont').options[i].selected=true;
             }
          }

        	for (var i=0; i < 2; i++) {
             if ($('map_showscale').options[i].value == Map.scale){
                $('map_showscale').options[i].selected=true;
             }
          }
					
        	for (var i=0; i < 2; i++) {
             if ($('map_showtypecont').options[i].value == Map.type_control){
                $('map_showtypecont').options[i].selected=true;
             }
          }
					
    			var mapTypeRoot = $('map_type');

					var mapTypeCount = 2;
					
					if (typeof(Map.Maptypes) != 'undefined'){
						mapTypeCount += Map.Maptypes.length;
						var newMapType = mapTypeRoot.options[0].cloneNode(false);
  					for (i=0; i<Map.Maptypes.length; i++){
     					  mapTypeRoot.appendChild(newMapType);
      					mapTypeRoot.options[i+3].value = Map.Maptypes[i].name;
      					mapTypeRoot.options[i+3].text = Map.Maptypes[i].name;
  					}
					}
						
          for (var i=0; i<mapTypeCount; i++) {
             if ($('map_type').options[i].value == Map.maptype){
                $('map_type').options[i].selected=true;
             }
          }
									
    			/*@todo create value for comments
					  $('map_comm').value = ?; for type="checkbox
					 */
};

BitMap.Edit.editMapTypes = function(Map){
	BitMap.Edit.show('editmaptypemenu');
	BitMap.Edit.show('editmaptypeform');
	BitMap.Edit.show('editmaptypecancel');

	//if maptype data exists
	if ( typeof( Map.Maptypes ) ) {
	
  	// We assume editMapTypes has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<Map.Maptypes.length; a++) {
  		if ( Map.Maptypes[a]!= null ){
    		var getElem = "editmaptypetable_" + Map.Maptypes[a].maptype_id;
    		if ( $(getElem) ) {
        	var extraMapTypeForm = $(getElem);
    			$('editmaptypeform').removeChild(extraMapTypeForm);
    		}
			}
  	}
		
  	var editMapTypeId;
  	  	
  	// for each maptype data set clone the form
  	for (var b=0; b<Map.Maptypes.length; b++) {
  	if ( Map.Maptypes[b]!= null ){
						
  		editMapTypeId = Map.Maptypes[b].maptype_id;
  	
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
  		BitMap.Edit.show( 'editmaptypetable_'+editMapTypeId );
  		BitMap.Edit.show( 'maptypeform_'+editMapTypeId );
						
			//@todo add cloning of the all maptypes form
	  
			// populate set form values
			form = $('maptypeform_' + editMapTypeId);

			form.array_n.value = b;
        form.maptype_id.value = Map.Maptypes[b].maptype_id;
        form.name.value = Map.Maptypes[b].name;
        form.description.value = Map.Maptypes[b].description;
        form.copyright.value = Map.Maptypes[b].copyright;
        form.maxzoom.value = Map.Maptypes[b].maxzoom;
        for (var r=0; r < 3; r++) {
           if (form.basetype.options[r].value == Map.Maptypes[b].basetype){
           		form.basetype.options[r].selected=true;
           }
        };			
        for (var r=0; r < 3; r++) {
           if (form.alttype.options[r].value == Map.Maptypes[b].alttype){
           		form.alttype.options[r].selected=true;
           }
        };
        form.maptiles_url.value = Map.Maptypes[b].maptiles_url;
        form.lowtiles_url.value = Map.Maptypes[b].lowresmaptiles_url;
        form.hybridtiles_url.value = Map.Maptypes[b].hybridtiles_url;
        form.lowhybridtiles_url.value = Map.Maptypes[b].lowreshybridtiles_url;

			// just for a pretty button - js sucks it!
        var mytable = $('maptypeformdata_'+editMapTypeId);
        var mytablebody = mytable.getElementsByTagName("tbody").item(0);
			var myrow = mytablebody.getElementsByTagName("tr").item(0);
        var mycel = myrow.getElementsByTagName("td").item(6);
			mycel.getElementsByTagName("a").item(0).href = "javascript:storeMapType(document.maptypeform_"+editMapTypeId+");";
			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";
			mycel.getElementsByTagName("a").item(2).href = "javascript:removeMapType(document.maptypeform_"+editMapTypeId+");";
			mycel.getElementsByTagName("a").item(3).href = "javascript:expungeMapType(document.maptypeform_"+editMapTypeId+");";

  	}
		}
	}	
};


BitMap.Edit.newMapType = function(){
    // Display the New Marker Div and Cancel Button
   	BitMap.Edit.show('newmaptypeform');

		// Reset the Form
		$('maptypeform_new').reset();
};




/*******************
 *
 * MARKER FORM FUNCTIONS
 *
 *******************/

BitMap.Edit.newMarker = function(Map){
		var check = false;
  	for (var i=0; i<Map.MarkerSets.length; i++){
  		if ( Map.MarkerSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a marker, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new marker!";
			BitMap.Edit.show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      BitMap.Edit.newMarkerSet();

		}else{
      // Display the New Marker Div and Cancel Button
     	BitMap.Edit.show('newmarkerform');

  		// Reset the Form
  		$('markerform_new').reset();
  		
  		// shortcut to the Select Option we are adding to
  		var selectRoot = $('set_id');
  
  		// we assume we have called this before and reset the options menu
  		selectRoot.options.length = 0;
  
  		// add option for each set available
  		if ( typeof(Map.MarkerSets) != 'undefined' ){
    			for ( i=0; i<Map.MarkerSets.length; i++ ){
  						if ( Map.MarkerSets[i] != null ){
								selectRoot.options[selectRoot.options.length] = new Option( Map.MarkerSets[i].name, Map.MarkerSets[i].set_id );
  						}
    			}
  		}
		}
};


BitMap.Edit.newMarkerSet = function(){
    // Display the New Form Div
   	BitMap.Edit.show('newmarkersetform');
		// Reset the Form
		$('markersetform_new').reset();
};



BitMap.Edit.editMarkers = function(Map){		
  // Display the Edit Form Div and Cancel Button
	BitMap.Edit.show('editmarkermenu');
  BitMap.Edit.show('editmarkerform');
	BitMap.Edit.show('editmarkercancel');

	//if marker data exists
	if ( typeof(Map.Markers) ) {
	
  	// We assume editMarkers has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<Map.MarkerSets.length; a++) {
  		if (Map.MarkerSets[a]!= null){
    		var getElem = "markerset_"+Map.MarkerSets[a].set_id;
    		if ( $(getElem) ) {
        	var extraMarkerForm = $(getElem);
    			$('editmarkerform').removeChild(extraMarkerForm);
    		}
			}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<Map.MarkerSets.length; b++) {
    	if (Map.MarkerSets[b]!= null){
  						
    		newSetId = Map.MarkerSets[b].set_id;
    	
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
    		BitMap.Edit.show('markerset_'+newSetId);
				BitMap.Edit.show('markersetform_'+newSetId);

				//get form data div children and update
           	var mytable = $('markersetformdata_'+newSetId);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);

   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("b").item(0).innerHTML = Map.MarkerSets[b].name;
   			mycel = myrow.getElementsByTagName("td").item(7);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storeMarkerSet(document.markersetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:BitMap.Edit.removeMarkerSet(document.markersetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.Edit.expungeMarkerSet(document.markersetform_"+newSetId+");";

   			myrow = mytablebody.getElementsByTagName("tr").item(1);
   			mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.editSet("+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";

				//get form and update values
				form = $('markersetform_'+newSetId);
				form.set_id.value = newSetId;
				form.set_array_n.value = b;
				if (Map.MarkerSets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (Map.MarkerSets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (Map.MarkerSets[b].explode == false){ form.explode.options[1].selected=true };
				if (Map.MarkerSets[b].cluster == false){ form.cluster.options[1].selected=true };
				if ( (typeof(Map.MarkerStyles) != 'undefined') && (Map.MarkerStyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<Map.MarkerStyles.length; d++){
						if ( Map.MarkerStyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( Map.MarkerStyles[d].name, Map.MarkerStyles[d].style_id );
							if ( Map.MarkerStyles[d].style_id == Map.MarkerSets[b].style_id){
							form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
				}
				if ( (typeof(Map.IconStyles) != 'undefined') && (Map.IconStyles.length > 0) ){
					var IconN = form.icon_id.options.length;
  				for (var e=0; e<Map.IconStyles.length; e++){
						if ( Map.IconStyles[e] != null ){
							form.icon_id.options[IconN+e] = new Option( Map.IconStyles[e].name, Map.IconStyles[e].icon_id );
							if ( Map.IconStyles[e].icon_id == Map.MarkerSets[b].icon_id){
							form.icon_id.options[IconN+e].selected=true;
							}
  					}
  				}
				}
			}
		}			
		
  	//for length of markers add form to setelement on matching set_id
		var x = 0;
  	for (g=0; g<Map.Markers.length; g++) {
			if (Map.Markers[g]!= null){
				x++;
				//add marker form...again a little ugly here
				var formCont = $("editmarkertable_"+Map.Markers[g].set_id);
  			formContKids = formCont.childNodes;

            for (var n = 0; n < formContKids.length; n++) {
      			if (formContKids[n].id == "markerform_n"){
            		var newMarkerForm = formContKids[n].cloneNode(true);
        			newMarkerForm.id = "markerform_"+g;
    				newMarkerForm.name = "markerform_"+g;
            		if (x % 2){
            			addElementClass( newMarkerForm, 'even');
            		}else{
            			addElementClass( newMarkerForm, 'odd');
            		}
    				var nMFKids = newMarkerForm.childNodes;
    				for (var o=0; o<nMFKids.length; o++){
    					if (nMFKids[o].id == "formdata_n"){
    						nMFKids[o].id = "formdata_"+g;
    					}
    				}
						$('editmarkertable_'+Map.Markers[g].set_id).appendChild(newMarkerForm);
    				BitMap.Edit.show('markerform_'+g);
    			}
    		}
				
				// populate set form values
				form = $('markerform_'+g);
            form.set_id.value = Map.Markers[g].set_id;
				if ( Map.Markers[g].marker_type == 1 ){
					form.marker_type.options[1].selected = true;
  			}
            form.marker_id.value = Map.Markers[g].marker_id;
            form.title.value = Map.Markers[g].title;
            form.marker_lat.value = Map.Markers[g].lat;
            form.marker_lon.value = Map.Markers[g].lon;
            form.edit.value = Map.Markers[g].data;
            form.marker_labeltext.value = Map.Markers[g].label_data;
            form.photo_url.value = Map.Markers[g].photo_url;
            form.marker_zi.value = Map.Markers[g].zindex;
            form.marker_array_n.value = Map.Markers[g].array_n;
				
				// just for a pretty button - js sucks it!
           	var mytable = $('formdata_'+g);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(2);
				mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.addAssistant('marker', "+g+");";

				mycel = myrow.getElementsByTagName("td").item(7);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storeMarker(document.markerform_"+g+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:Map.Markers["+Map.Markers[g].array_n+"].marker.openInfoWindowHtml(Map.Markers["+Map.Markers[g].array_n+"].marker.my_html);";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.Edit.removeMarker(document.markerform_"+g+");";
   			mycel.getElementsByTagName("a").item(3).href = "javascript:BitMap.Edit.expungeMarker(document.markerform_"+g+");";

			}
		}		
	}
};



//@todo change this to editMarkerSet(n)
BitMap.Edit.editSet = function(n){
				BitMap.Edit.show('setform_'+n);
};


BitMap.Edit.newIconStyle = function(Map){
		var check = false;
  	for (var i=0; i<Map.MarkerSets.length; i++){
  		if ( Map.MarkerSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a icon style, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new icon style!";
			BitMap.Edit.show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      BitMap.Edit.newMarkerSet();

		}else{
      // Display the New Icon Style Div
   		BitMap.Edit.show('newiconstyleform');

  		// Reset the Form
  		$('iconstyleform_new').reset();  		  
		}
};


BitMap.Edit.editIconStyles = function(Map){
		BitMap.Edit.show('editiconstylesmenu');
		BitMap.Edit.show('editiconstyleform');
		BitMap.Edit.show('editiconstylescancel');

  	//if iconstyles data exists
  	if ( typeof( Map.IconStyles ) ) {
  
    	// We assume editIconStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<Map.IconStyles.length; a++) {
    		if ( Map.IconStyles[a]!= null ){
      			var getElem = "editiconstyletable_" + Map.IconStyles[a].icon_id;
        		if ( $(getElem) ) {
            		var extraIconStyleForm = $(getElem);
        			$('editiconstyleform').removeChild(extraIconStyleForm);
        		}
  			}
    	}
  
    	var editIconStyleId;
			var x = 0;  
    	// for each iconstyle data set clone the form
    	for (var b=0; b<Map.IconStyles.length; b++) {
        	if ( Map.IconStyles[b]!= null ){  						
					x++;    
        		editIconStyleId = Map.IconStyles[b].icon_id;
    
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
            			if (x % 2){
            				addElementClass( newIconStyleForm[n], 'even');
            			}else{
            				addElementClass( newIconStyleForm[n], 'odd');
            			}			 
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
        		BitMap.Edit.show( 'editiconstyletable_'+editIconStyleId );
        		BitMap.Edit.show( 'iconstyleform_'+editIconStyleId );
    
      			// populate set form values
      			form = $('iconstyleform_' + editIconStyleId );
    
                form.style_array_n.value = b;
                form.icon_id.value = Map.IconStyles[b].icon_id;
                form.name.value = Map.IconStyles[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.icon_style_type.options[r].value == Map.IconStyles[b].icon_style_type){
                   		form.icon_style_type.options[r].selected=true;
                   }
                };
                form.image.value = Map.IconStyles[b].image;
                form.rollover_image.value = Map.IconStyles[b].rollover_image;
                form.icon_w.value = Map.IconStyles[b].icon_w;
                form.icon_h.value = Map.IconStyles[b].icon_h;

				 /* not sure want to both supporting these, 
			 	  * probably more complex than people want to be bothered with
				  * they are NOT in the edit_form.tpl
					----------------------------------------------------------	
					form.print_image.value = Map.IconStyles[b].print_image;
                form.moz_print_image.value = Map.IconStyles[b].moz_print_image;
                form.transparent.value = Map.IconStyles[b].transparent;
                form.print_shadow.value = Map.IconStyles[b].print_shadow;
                form.image_map.value = Map.IconStyles[b].image_map;
				  */

                form.shadow_image.value = Map.IconStyles[b].shadow_image;
                form.shadow_w.value = Map.IconStyles[b].shadow_w;
                form.shadow_h.value = Map.IconStyles[b].shadow_h;
                form.icon_anchor_x.value = Map.IconStyles[b].icon_anchor_x;
                form.icon_anchor_y.value = Map.IconStyles[b].icon_anchor_y;
                form.shadow_anchor_x.value = Map.IconStyles[b].shadow_anchor_x;
                form.shadow_anchor_y.value = Map.IconStyles[b].shadow_anchor_y;
                form.infowindow_anchor_x.value = Map.IconStyles[b].infowindow_anchor_x;
                form.infowindow_anchor_y.value = Map.IconStyles[b].infowindow_anchor_y;
                form.points.value = Map.IconStyles[b].points;
                form.scale.value = Map.IconStyles[b].scale;
                form.outline_color.value = Map.IconStyles[b].outline_color;
                form.outline_weight.value = Map.IconStyles[b].outline_weight;
                form.fill_color.value = Map.IconStyles[b].fill_color;
                form.fill_opacity.value = Map.IconStyles[b].fill_opacity;
    
      			// custom menu options and a pretty button
           		var mytable = $('iconstyleformdata_'+editIconStyleId);
           		var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   				var myrow = mytablebody.getElementsByTagName("tr").item(0);
           		var mycel = myrow.getElementsByTagName("td").item(1);

//					alert(mycel.getElementsByTagName("select").item(0).onchange);
//					mycel.getElementsByTagName("select").item(0).onchange = "javascript:toggleIconMenu(this.value, "+editIconStyleId+");";

					mycel = myrow.getElementsByTagName("td").item(6);
					mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storeIconStyle(document.iconstyleform_"+editIconStyleId+");";

					mytablebody.getElementsByTagName("tr").item(1).id = "gicon_style_head_"+editIconStyleId;
					mytablebody.getElementsByTagName("tr").item(2).id = "gicon_style_menu1_"+editIconStyleId;
					mytablebody.getElementsByTagName("tr").item(3).id = "gicon_style_menu2_"+editIconStyleId;
					mytablebody.getElementsByTagName("tr").item(4).id = "xicon_style_head_"+editIconStyleId;
					mytablebody.getElementsByTagName("tr").item(5).id = "xicon_style_menu_"+editIconStyleId;

      		}
  		}
  	}
}


BitMap.Edit.newMarkerStyle = function(Map){
		var check = false;
  	for (var i=0; i<Map.MarkerSets.length; i++){
  		if ( Map.MarkerSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a marker style, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new marker style!";
			BitMap.Edit.show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      BitMap.Edit.newMarkerSet();

		}else{
      // Display the New Marker Style Div
   		BitMap.Edit.show('newmarkerstyleform');

  		// Reset the Form
  		$('markerstyleform_new').reset();  		  
		};
}


BitMap.Edit.editMarkerStyles = function(Map){
		BitMap.Edit.show('editmarkerstylesmenu');
		BitMap.Edit.show('editmarkerstyleform');
		BitMap.Edit.show('editmarkerstylescancel');

		//if markerstyles data exists
		if ( typeof( Map.MarkerStyles ) ) {

  	// We assume editMarkerStyles has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<Map.MarkerStyles.length; a++) {
  		if ( Map.MarkerStyles[a]!= null ){
    		var getElem = "editmarkerstyletable_" + Map.MarkerStyles[a].style_id;
    		if ( $(getElem) ) {
        	var extraMarkerStyleForm = $(getElem);
    			$('editmarkerstyleform').removeChild(extraMarkerStyleForm);
    		}
			}
  	}

  	var editMarkerStyleId;

		var x = 0;
  	// for each markerstyle data set clone the form
  	for (var b=0; b<Map.MarkerStyles.length; b++) {
    	if ( Map.MarkerStyles[b]!= null ){  						
				x++
    		editMarkerStyleId = Map.MarkerStyles[b].style_id;

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
            		if (x % 2){
            			addElementClass( newMarkerStyleForm[n], 'even');
            		}else{
            			addElementClass( newMarkerStyleForm[n], 'odd');
            		}
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
    		BitMap.Edit.show( 'editmarkerstyletable_'+editMarkerStyleId );
    		BitMap.Edit.show( 'markerstyleform_'+editMarkerStyleId );

  			// populate set form values
  			form = $('markerstyleform_' + editMarkerStyleId );

            form.style_id.value = Map.MarkerStyles[b].style_id;
            form.style_array_n.value = b;
            form.name.value = Map.MarkerStyles[b].name;
            for (var r=0; r < 3; r++) {
               if (form.marker_style_type.options[r].value == Map.MarkerStyles[b].marker_style_type){
               		form.marker_style_type.options[r].selected=true;
               }
            };
            form.label_hover_opacity.value = Map.MarkerStyles[b].label_hover_opacity;
            form.label_opacity.value = Map.MarkerStyles[b].label_opacity;
            form.label_hover_styles.value = Map.MarkerStyles[b].label_hover_styles;
            form.window_styles.value = Map.MarkerStyles[b].window_styles;

  			// just for a pretty button - js sucks it!
	/*
  			var linkParent = $('markerstyleformdata_'+editMarkerStyleId);
  			var linkPKids = linkParent.childNodes;
  			for (var p=0; p<linkPKids.length; p++){
  						if (linkPKids[p].name == "save_markerstyle_btn"){
  							 linkPKids[p].href = "javascript:storeMarkerStyle('edit_markerstyle.php', document.markerstyleform_"+editMarkerStyleId+");" ;
  						}
				}
	*/

           	var mytable = $('markerstyleformdata_'+editMarkerStyleId);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(6);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:storeMarkerStyle(document.markerstyleform_"+editMarkerStyleId+");";
  		}
		}
	}
};


/*******************
 *
 * POLYLINE FORM FUNCTIONS
 *
 *******************/

BitMap.Edit.newPolyline = function(Map){
		var check = false;
  	for (var i=0; i<Map.PolylineSets.length; i++){
  		if ( Map.PolylineSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polyline, there first must be a polyline set associated with this map. Please create a new polyline set, then you can add your new polyline!";
			BitMap.Edit.show('editerror');
  		Fat.fade_all();
  		//display new polyline set form
      BitMap.Edit.newPolylineSet();

		}else{
      // Display the New Form Div and Cancel Button
     	BitMap.Edit.show('newpolylineform');
  		// Reset the Form
  		$('polylineform_new').reset();
  		
  		// shortcut to the Select Option we are adding to
  		var selectRoot = $('polylineset_id');
  		
  		selectRoot.options.length = 0;
  
  		// add option for each set available
  		if ( typeof(Map.PolylineSets) != 'undefined' ){
    			for ( i=0; i<Map.PolylineSets.length; i++ ){
  						if ( Map.PolylineSets[i] != null ){
                 	selectRoot.options[selectRoot.options.length] = new Option( Map.PolylineSets[i].name, Map.PolylineSets[i].set_id );
  						}
    			}
  		}
		}
};



BitMap.Edit.newPolylineSet = function(){
    // Display the New Form Div
   	BitMap.Edit.show('newpolylinesetform');
		// Reset the Form
		$('polylinesetform_new').reset();
};



/* @todo needs to support markers in bSLData as well as Map.Polylines */
BitMap.Edit.editPolylines = function(Map){
	BitMap.Edit.show('editpolylinemenu');
  BitMap.Edit.show('editpolylineform');
	BitMap.Edit.show('editpolylinecancel');
	
	//if polyline data exists
	if ( typeof(Map.Polylines) ) {
	
  	// We assume editPolylines has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<Map.PolylineSets.length; a++) {
  		if (Map.PolylineSets[a]!= null){
    		var getElem = "polylineset_"+Map.PolylineSets[a].set_id;
    		if ( $(getElem) ) {
        	var extraPolylineForm = $(getElem);
    			$('editpolylineform').removeChild(extraPolylineForm);
    		}
			}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<Map.PolylineSets.length; b++) {
  	if (Map.PolylineSets[b]!= null){
		  	
  		newSetId = Map.PolylineSets[b].set_id;
  	
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
    		BitMap.Edit.show('polylineset_'+newSetId);
				BitMap.Edit.show('polylinesetform_'+newSetId);
  
				//get form data div children and update
           	var mytable = $('polylinesetformdata_' + newSetId);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("b").item(0).innerHTML = Map.PolylineSets[b].name;
           	mycel = myrow.getElementsByTagName("td").item(5);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storePolylineSet(document.polylinesetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:BitMap.Edit.removePolylineSet(document.polylinesetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.Edit.expungePolylineSet(document.polylinesetform_"+newSetId+");";

   			myrow = mytablebody.getElementsByTagName("tr").item(1);
   			mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.editPolylineSet("+newSetId+");";
  			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";

				//get form and update values
				form = $('polylinesetform_'+newSetId);
				form.set_id.value = newSetId;
				if (Map.PolylineSets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (Map.PolylineSets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (Map.PolylineSets[b].explode == false){ form.explode.options[1].selected=true };
				form.set_array_n.value = b;
				if ( (typeof(Map.PolylineStyles) != 'undefined') && (Map.PolylineStyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<Map.PolylineStyles.length; d++){
						if ( Map.PolylineStyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( Map.PolylineStyles[d].name, Map.PolylineStyles[d].style_id );
							if ( Map.PolylineStyles[d].style_id == Map.PolylineSets[b].style_id){
							form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
				}
			}
		}			

  	//for length of polylines add form to setelement on matching set_id
		var x = 0;
  	for (g=0; g<Map.Polylines.length; g++) {
			if (Map.Polylines[g]!= null){
				x++;
				//add polyline form...again a little ugly here
				var formCont = $("editpolylinetable_"+Map.Polylines[g].set_id);
  			formContKids = formCont.childNodes;
            for (var n = 0; n < formContKids.length; n++) {
      			if (formContKids[n].id == "polylineform_n"){
            		var newPolylineForm = formContKids[n].cloneNode(true);
        			newPolylineForm.id = "polylineform_"+g;
    				newPolylineForm.name = "polylineform_"+g;
            		if (x % 2){
            			addElementClass( newPolylineForm, 'even');
            		}else{
            			addElementClass( newPolylineForm, 'odd');
            		}
    				var nLFKids = newPolylineForm.childNodes;
    				for (var o=0; o<nLFKids.length; o++){
    					if (nLFKids[o].id == "polylineformdata_n"){
    						nLFKids[o].id = "polylineformdata_"+g;
    					}
    				}
    							
        			$('editpolylinetable_'+Map.Polylines[g].set_id).appendChild(newPolylineForm);
    				BitMap.Edit.show('polylineform_'+g);
    			}
    		}

				// populate set form values
				form = $('polylineform_'+g);

            form.set_id.value = Map.Polylines[g].set_id;
            form.polyline_id.value = Map.Polylines[g].polyline_id;
            form.name.value = Map.Polylines[g].name;
            form.points_data.value = Map.Polylines[g].points_data;
            form.border_text.value = Map.Polylines[g].border_text;
            form.zindex.value = Map.Polylines[g].zindex;
            form.polyline_array_n.value = Map.Polylines[g].array_n;
				
				// just for a pretty button - js sucks it!
           	var mytable = $('polylineformdata_'+g);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(1);
				mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.addAssistant('polyline', "+g+");";

				mycel = myrow.getElementsByTagName("td").item(4);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storePolyline(document.polylineform_"+g+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.Edit.removePolyline(document.polylineform_"+g+");";
   			mycel.getElementsByTagName("a").item(3).href = "javascript:BitMap.Edit.expungePolyline(document.polylineform_"+g+");";
			}
		}		
	}
};



BitMap.Edit.editPolylineSet = function(n){
		BitMap.Edit.show('plsetform_'+n);
}


BitMap.Edit.cancelPolylineEdit = function(){
		BitMap.Edit.canceledit('editpolylinemenu'); 
		BitMap.Edit.canceledit('newpolylineform');
		BitMap.Edit.canceledit('editpolylineform'); 
		BitMap.Edit.canceledit('editpolylinecancel');
		BitMap.Edit.removeAssistant();
}; 


BitMap.Edit.editPolylineStyles = function(Map){
		BitMap.Edit.show('editpolylinestylesmenu');
		BitMap.Edit.show('editpolylinestyleform');
		BitMap.Edit.show('editpolylinestylescancel');

  	//if polylinestyles data exists
  	if ( typeof( Map.PolylineStyles ) ) {
  
    	// We assume editPolylineStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<Map.PolylineStyles.length; a++) {
    		if ( Map.PolylineStyles[a]!= null ){
      			var getElem = "editpolylinestyletable_" + Map.PolylineStyles[a].style_id;
        		if ( $(getElem) ) {
            		var extraPolylineStyleForm = $(getElem);
        			$('editpolylinestyleform').removeChild(extraPolylineStyleForm);
        		}
  			}
    	}
  
    	var editPolylineStyleId;
  
    	// for each markerstyle data set clone the form
			var x = 0;
    	for (var b=0; b<Map.PolylineStyles.length; b++) {
        	if ( Map.PolylineStyles[b]!= null ){  						
					x++;    
        		editPolylineStyleId = Map.PolylineStyles[b].style_id;
    
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
                 		if (x % 2){
                 			addElementClass( newPolylineStyleForm[n], 'even');
                 		}else{
                 			addElementClass( newPolylineStyleForm[n], 'odd');
                 		}							
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
        		BitMap.Edit.show( 'editpolylinestyletable_'+editPolylineStyleId );
        		BitMap.Edit.show( 'polylinestyleform_'+editPolylineStyleId );
    
      			// populate set form values
      			form = $('polylinestyleform_' + editPolylineStyleId );
    
                form.style_array_n.value = b;
                form.style_id.value = Map.PolylineStyles[b].style_id;
                form.name.value = Map.PolylineStyles[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.polyline_style_type.options[r].value == Map.PolylineStyles[b].polyline_style_type){
                   		form.polyline_style_type.options[r].selected=true;
                   }
                };
                form.color.value = Map.PolylineStyles[b].color;
                form.weight.value = Map.PolylineStyles[b].weight;
                form.opacity.value = Map.PolylineStyles[b].opacity;
                form.pattern.value = Map.PolylineStyles[b].pattern;
                form.segment_count.value = Map.PolylineStyles[b].segment_count;
                form.text_every.value = Map.PolylineStyles[b].text_every;
                if (Map.PolylineStyles[b].begin_arrow == false){
                	form.begin_arrow.options[0].selected=true;
                }else{
                	form.begin_arrow.options[1].selected=true;
					}
                if (Map.PolylineStyles[b].end_arrow == false){
                	form.end_arrow.options[0].selected=true;
                }else{
                	form.end_arrow.options[1].selected=true;
                }
                form.arrows_every.value = Map.PolylineStyles[b].arrows_every;
                form.text_fgstyle_color.value = Map.PolylineStyles[b].text_fgstyle_color;
                form.text_fgstyle_weight.value = Map.PolylineStyles[b].text_fgstyle_weight;
                form.text_fgstyle_opacity.value = Map.PolylineStyles[b].text_fgstyle_opacity;
                form.text_fgstyle_zindex.value = Map.PolylineStyles[b].text_fgstyle_zindex;
                form.text_bgstyle_color.value = Map.PolylineStyles[b].text_bgstyle_color;
                form.text_bgstyle_weight.value = Map.PolylineStyles[b].text_bgstyle_weight;
                form.text_bgstyle_opacity.value = Map.PolylineStyles[b].text_bgstyle_opacity;
                form.text_bgstyle_zindex.value = Map.PolylineStyles[b].text_bgstyle_zindex;
    
      			// just for a pretty button - js sucks it!
           		var mytable = $('polylinestyleformdata_'+editPolylineStyleId);
           		var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   				var myrow = mytablebody.getElementsByTagName("tr").item(0);
           		var mycel = myrow.getElementsByTagName("td").item(5);
					mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storePolylineStyle(document.polylinestyleform_"+editPolylineStyleId+");";
      		}
  		}
  	}
};


BitMap.Edit.newPolylineStyle = function(Map){
		var check = false;
  	for (var i=0; i<Map.PolylineSets.length; i++){
  		if ( Map.PolylineSets[i] != null ){
				check = true;
  		}
  	}
  	for (var i=0; i<Map.PolygonSets.length; i++){
  		if ( Map.PolygonSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polyline style, there must be a polyline or polygon set associated with this map. Please create a new polyline or polygon set, then you can add your new polyline style!";
			BitMap.Edit.show('editerror');
  		Fat.fade_all();
  		//display new polyline set form
      BitMap.Edit.newPolylineSet();

		}else{
      // Display the New Polyline Style Div
   		BitMap.Edit.show('newpolylinestyleform');

  		// Reset the Form
  		$('polylinestyleform_new').reset();  		  
		};
}





/*******************
 *
 * Polygon FORM FUNCTIONS
 *
 *******************/

BitMap.Edit.newPolygon = function(Map){
		var check = false;
  	for (var i=0; i<Map.PolygonSets.length; i++){
  		if ( Map.PolygonSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polygon, there first must be a polygon set associated with this map. Please create a new polygon set, then you can add your new polygon!";
			BitMap.Edit.show('editerror');
  		Fat.fade_all();
  		//display new polygon set form
      BitMap.Edit.newPolygonSet();

		}else{
      // Display the New Form Div and Cancel Button
     	BitMap.Edit.show('newpolygonform');
  		// Reset the Form
  		$('polygonform_new').reset();
  		
  		// shortcut to the Select Option we are adding to
  		var selectRoot = $('polygonset_id');
  		
  		selectRoot.options.length = 0;
  
  		// add option for each set available
  		if ( typeof(Map.PolygonSets) != 'undefined' ){
    			for ( i=0; i<Map.PolygonSets.length; i++ ){
  						if ( Map.PolygonSets[i] != null ){
                 	selectRoot.options[selectRoot.options.length] = new Option( Map.PolygonSets[i].name, Map.PolygonSets[i].set_id );
  						}
    			}
  		}
		}
};



BitMap.Edit.newPolygonSet = function(){
    // Display the New Form Div
   	BitMap.Edit.show('newpolygonsetform');
		// Reset the Form
		$('polygonsetform_new').reset();
};





/* @todo needs to support markers in bSLData as well as Map.Polylines */
BitMap.Edit.editPolygons = function(Map){
	BitMap.Edit.show('editpolygonmenu');
  BitMap.Edit.show('editpolygonform');
	BitMap.Edit.show('editpolygoncancel');
	
	//if polygon data exists
	if ( typeof(Map.Polygons) ) {

  	// We assume editPolygons has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<Map.PolygonSets.length; a++) {
  		if (Map.PolygonSets[a]!= null){
    		var getElem = "polygonset_"+Map.PolygonSets[a].set_id;
    		if ( $(getElem) ) {
        	var extraPolygonForm = $(getElem);
    			$('editpolygonform').removeChild(extraPolygonForm);
    		}
			}
  	}

  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<Map.PolygonSets.length; b++) {
  	if (Map.PolygonSets[b]!= null){
		  	
  		newSetId = Map.PolygonSets[b].set_id;

  		// clone model set UI
			var newPolygonSet = $('polygonset_n').cloneNode(true);
  		// give a new id to the new set UI
  		newPolygonSet.id = "polygonset_"+newSetId;

  		// customize all the values of our new set UI this gets ugly...										
  		newPolygonSetKids = newPolygonSet.childNodes;
			for ( var n = 0; n < newPolygonSetKids.length; n++ ) {
          		if ( newPolygonSetKids[n].id == "polygonsetform_n" ) {					
              		newPolygonSetKids[n].id = "polygonsetform_" + newSetId;
                	newPolygonSetKids[n].name = "polygonsetform_" + newSetId;					 
            		var nMSFKids = newPolygonSetKids[n].childNodes;
            		for (var o=0; o<nMSFKids.length; o++){
              			if (nMSFKids[o].id == "polygonsetformdata_n"){
              				nMSFKids[o].id = "polygonsetformdata_" + newSetId;
              			}
            		}
					}

          		if ( newPolygonSetKids[n].id == "pgsetform_n" ) {					
              		newPolygonSetKids[n].id = "pgsetform_" + newSetId;
						formKids = newPolygonSetKids[n].childNodes;
   					for (var p=0; p<formKids.length; p++) {
   						if (formKids[p].id == "editpolygontable_n"){
              				formKids[p].id = "editpolygontable_"+newSetId;
                			if (formKids[p].id == "allavailpolygons_n"){
                				formKids[p].id = "allavailpolygons_"+newSetId;
     							allPolyKids = formKids[p].childNodes;
     							for (var e=0; e<allPolyKids.length; e++) {
        							if (allPolyKids[e].id == "addpolygontable_n"){
        								allPolyKids[e].id = "addpolygontable_"+newSetId;
        							}
     							}
                			}
              			}
   					}
					}
			}

        	// add form container to set table
  			$('editpolygonform').appendChild(newPolygonSet);
    		BitMap.Edit.show('polygonset_'+newSetId);
				BitMap.Edit.show('polygonsetform_'+newSetId);

				//get form data div children and update
           	var mytable = $('polygonsetformdata_' + newSetId);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("b").item(0).innerHTML = Map.PolygonSets[b].name;
           	mycel = myrow.getElementsByTagName("td").item(5);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storePolygonSet(document.polygonsetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:BitMap.Edit.removePolygonSet(document.polygonsetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.Edit.expungePolygonSet(document.polygonsetform_"+newSetId+");";

   			myrow = mytablebody.getElementsByTagName("tr").item(1);
   			mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.editPolygonSet("+newSetId+");";
  			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";


				//get form and update values
				form = $('polygonsetform_'+newSetId);
				form.set_id.value = newSetId;
				if (Map.PolygonSets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (Map.PolygonSets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (Map.PolygonSets[b].explode == false){ form.explode.options[1].selected=true };
				form.set_array_n.value = b;
				if ( (typeof(Map.PolygonStyles) != 'undefined') && (Map.PolygonStyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<Map.PolygonStyles.length; d++){
						if ( Map.PolygonStyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( Map.PolygonStyles[d].name, Map.PolygonStyles[d].style_id );
							if ( Map.PolygonStyles[d].style_id == Map.PolygonSets[b].style_id){
								form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
					var OptionO = form.polylinestyle_id.options.length;
  				for (var e=0; e<Map.PolylineStyles.length; e++){
						if ( Map.PolylineStyles[e] != null ){
							form.polylinestyle_id.options[OptionO + e] = new Option( Map.PolylineStyles[e].name, Map.PolylineStyles[e].style_id );
							if ( Map.PolylineStyles[e].style_id == Map.PolygonSets[b].polylinestyle_id){
								form.polylinestyle_id.options[OptionO + e].selected=true;
							}
  					}
  				}
				}
			}
		}			

  	//for length of polygons add form to setelement on matching set_id
		x = 0;
  	for (g=0; g<Map.Polygons.length; g++) {
			if (Map.Polygons[g]!= null){
				x++;
				//add polygon form...again a little ugly here
				var formCont = $("editpolygontable_"+Map.Polygons[g].set_id);

  			formContKids = formCont.childNodes;

            for (var n = 0; n < formContKids.length; n++) {
      			if (formContKids[n].id == "polygonform_n"){
            		var newPolygonForm = formContKids[n].cloneNode(true);
        			newPolygonForm.id = "polygonform_"+g;
    				newPolygonForm.name = "polygonform_"+g;
                 	if (x % 2){
                 		addElementClass( newPolygonForm, 'even');
                 	}else{
                 		addElementClass( newPolygonForm, 'odd');
                 	}							
    				var nPFKids = newPolygonForm.childNodes;
     				for (var o=0; o<nPFKids.length; o++){
    					if (nPFKids[o].id == "polygonformdata_n"){
    						nPFKids[o].id = "polygonformdata_"+g;
    					}
    				}
    							
        			$('editpolygontable_'+Map.Polygons[g].set_id).appendChild(newPolygonForm);
    				BitMap.Edit.show('polygonform_'+g);
    			}
    		}
				
				// populate set form values
				form = $('polygonform_'+g);

            form.set_id.value = Map.Polygons[g].set_id;
            form.polygon_id.value = Map.Polygons[g].polygon_id;
            form.name.value = Map.Polygons[g].name;
				if (Map.Polygons[g].circle == false){
					form.circle.options[0].selected=true;
				}else{
					form.circle.options[1].selected=true;
				}
            form.points_data.value = Map.Polygons[g].points_data;
            form.circle_center.value = Map.Polygons[g].circle_center;
            form.radius.value = Map.Polygons[g].radius;
            form.border_text.value = Map.Polygons[g].border_text;
            form.zindex.value = Map.Polygons[g].zindex;
            form.polygon_array_n.value = Map.Polygons[g].array_n;
				
				// just for a pretty button - js sucks it!
           	var mytable = $('polygonformdata_'+g);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(2);
				mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.addAssistant('polygon', "+g+");";

				mycel = myrow.getElementsByTagName("td").item(7);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storePolygon(document.polygonform_"+g+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.Edit.removePolygon(document.polygonform_"+g+");";
   			mycel.getElementsByTagName("a").item(3).href = "javascript:BitMap.Edit.expungePolygon(document.polygonform_"+g+");";
			}
		}		
	}
};



BitMap.Edit.editPolygonSet = function(n){
		BitMap.Edit.show('pgsetform_'+n);
}


BitMap.Edit.cancelPolygonEdit = function(){
		BitMap.Edit.canceledit('editpolygonmenu'); 
		BitMap.Edit.canceledit('newpolygonform'); 
		BitMap.Edit.canceledit('editpolygonform'); 
		BitMap.Edit.canceledit('editpolygoncancel');
		BitMap.Edit.removeAssistant();
}; 


BitMap.Edit.editPolygonStyles = function(Map){
		BitMap.Edit.show('editpolygonstylesmenu');
		BitMap.Edit.show('editpolygonstyleform');
		BitMap.Edit.show('editpolygonstylescancel');

  	//if polygonstyles data exists
  	if ( typeof( Map.PolygonStyles ) ) {
  
    	// We assume editPolygonStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<Map.PolygonStyles.length; a++) {
    		if ( Map.PolygonStyles[a]!= null ){
      			var getElem = "editpolygonstyletable_" + Map.PolygonStyles[a].style_id;
        		if ( $(getElem) ) {
            		var extraPolygonStyleForm = $(getElem);
        			$('editpolygonstyleform').removeChild(extraPolygonStyleForm);
        		}
  			}
    	}
  
    	var editPolygonStyleId;
  		var x=0;
    	// for each markerstyle data set clone the form
    	for (var b=0; b<Map.PolygonStyles.length; b++) {
        	if ( Map.PolygonStyles[b]!= null ){  						
					x++;    
        		editPolygonStyleId = Map.PolygonStyles[b].style_id;

        		// clone the form container
      			var newPolygonStyle = $('editpolygonstyletable_n').cloneNode(true);
        		// give a new id to the new form container
        		newPolygonStyle.id = "editpolygonstyletable_"+editPolygonStyleId;
    
      			// update the new form ids
        		newPolygonStyleForm = newPolygonStyle.childNodes;
                for ( var n = 0; n < newPolygonStyleForm.length; n++ ) {
            		if ( newPolygonStyleForm[n].id == "polygonstyleform_n" ) {
                  		newPolygonStyleForm[n].id = "polygonstyleform_" + editPolygonStyleId;
                  		newPolygonStyleForm[n].name = "polygonstyleform_" + editPolygonStyleId;
							if (x % 2){
                 			addElementClass( newPolygonStyleForm[n], 'even');
                 		}else{
                 			addElementClass( newPolygonStyleForm[n], 'odd');
                 		}							
          				var nPSFKids = newPolygonStyleForm[n].childNodes;
          				for (var o=0; o<nPSFKids.length; o++){
          					if (nPSFKids[o].id == "polygonstyleformdata_n"){
          						nPSFKids[o].id = "polygonstyleformdata_" + editPolygonStyleId;
          					}
          				}
          			}
          		}
    
            	// add form to style table
        		$('editpolygonstyleform').appendChild(newPolygonStyle);
        		BitMap.Edit.show( 'editpolygonstyletable_'+editPolygonStyleId );
        		BitMap.Edit.show( 'polygonstyleform_'+editPolygonStyleId );
    
      			// populate set form values
      			form = $('polygonstyleform_' + editPolygonStyleId );
    
                form.style_array_n.value = b;
                form.style_id.value = Map.PolygonStyles[b].style_id;
                form.name.value = Map.PolygonStyles[b].name;
                form.color.value = Map.PolygonStyles[b].color;
                form.weight.value = Map.PolygonStyles[b].weight;
                form.opacity.value = Map.PolygonStyles[b].opacity;
 
      			// just for a pretty button - js sucks it!
           		var mytable = $('polygonstyleformdata_'+editPolygonStyleId);
           		var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   				var myrow = mytablebody.getElementsByTagName("tr").item(0);
           		var mycel = myrow.getElementsByTagName("td").item(5);
					mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.Edit.storePolygonStyle(document.polygonstyleform_"+editPolygonStyleId+");";
      		}
  		}
  	}
};


BitMap.Edit.newPolygonStyle = function(Map){
		var check = false;
  	for (var i=0; i<Map.PolygonSets.length; i++){
  		if ( Map.PolygonSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polygon style, there first must be a polygon set associated with this map. Please create a new polygon set, then you can add your new polygon style!";
			BitMap.Edit.show('editerror');
  		Fat.fade_all();
  		//display new polygon set form
      BitMap.Edit.newPolygonSet();

		}else{
      // Display the New Polygon Style Div
   		BitMap.Edit.show('newpolygonstyleform');

  		// Reset the Form
  		$('polygonstyleform_new').reset();  		  
		};
}







/*******************
 *
 *  AJAX FUNCTIONS
 *
 *******************/

   var http_request = false;
	 
	 BitMap.Edit.storeMap = function(f){
			doSimpleXMLHttpRequest("edit.php", f).addCallback(updateMap); 
	 }

	 BitMap.Edit.storeNewMapType = function(f){
	 		var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( addMapType ); 
	 }

	 BitMap.Edit.storeMapType = function(f){	 
			editObjectN = f.array_n.value;
	 		var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( updateMapType ); 
	 }
	 
	 BitMap.Edit.removeMapType = function(f){
			editObjectN = f.array_n.value;
			editSetId = f.maptype_id.value;
	 		var str = "edit_maptype.php?" + "maptype_id=" + editSetId + "&gmap_id=" + bMapID + "&remove_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMapType ); 
	 }
	 
	 BitMap.Edit.expungeMapType = function(f){
			editObjectN = f.array_n.value;
			editSetId = f.maptype_id.value;
	 		var str = "edit_maptype.php?" + "maptype_id=" + editSetId + "&expunge_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMapType ); 
	 }
	 
	 BitMap.Edit.storeNewMarker = function(f){
			editSetId = f.set_id.value;
	 		var str = "edit_marker.php?" + queryString(f) + "&save_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( addMarker ); 
	 }
	 
	 BitMap.Edit.storeMarker = function(f){
			editObjectN = f.marker_array_n.value;
	 		var str = "edit_marker.php?" + queryString(f) + "&save_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateMarker ); 
	 }
	 
	 BitMap.Edit.removeMarker = function(f){
			editSetId = f.set_id.value;
			editMarkerId = f.marker_id.value;
	 		var str = "edit_marker.php?set_id=" + editSetId + "&marker_id=" + editMarkerId + "&remove_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarker ); 
	 }

	 BitMap.Edit.expungeMarker = function(f){
			editSetId = f.set_id.value;
			editMarkerId = f.marker_id.value;
	 		var str = "edit_marker.php?marker_id=" + editMarkerId + "&expunge_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarker ); 
	 }	 

	 BitMap.Edit.storeNewMarkerSet = function(f){
			canceledit('editerror');
	 		var str = "edit_markerset.php?" + queryString(f) + "&set_type=markers" + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( addMarkerSet ); 
	 }

	 BitMap.Edit.storeMarkerSet = function(f){
			editSetId = f.set_id.value;
			editObjectN = f.set_array_n.value;
	 		var str = "edit_markerset.php?" + queryString(f) + "&gmap_id=" + bMapID + "&save_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateMarkerSet ); 
	 }

	 BitMap.Edit.removeMarkerSet = function(f){
			editSetId = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + bMapID + "&remove_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarkerSet ); 
	 }

	 BitMap.Edit.expungeMarkerSet = function(f){
			editSetId = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&expunge_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarkerSet ); 
	 }
	 
	 BitMap.Edit.storeNewMarkerStyle = function(f){
	 		var str = "edit_markerstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addMarkerStyle ); 
	 }

	 BitMap.Edit.storeMarkerStyle = function(f){
			editObjectN = f.style_array_n.value;
	 		var str = "edit_markerstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updateMarkerStyle ); 
	 }

	 BitMap.Edit.storeNewIconStyle = function(f){
	 		var str = "edit_iconstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addIconStyle ); 
	 }

	 BitMap.Edit.storeIconStyle = function(f){
			editObjectN = f.style_array_n.value;
	 		var str = "edit_iconstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updateIconStyle ); 
	 }

	 BitMap.Edit.storeNewPolyline = function(f){
			editSetId = f.set_id.value;
	 		var str = "edit_polyline.php?" + queryString(f) + "&save_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( addPolyline );
	 }
	 
	 BitMap.Edit.storePolyline = function(f){
			editObjectN = f.polyline_array_n.value;
			doSimpleXMLHttpRequest("edit_polyline.php", f).addCallback( updatePolyline );
	 }
	 
	 BitMap.Edit.removePolyline = function(f){
			editSetId = f.set_id.value;
			editPolylineId = f.polyline_id.value;
	 		var str = "edit_polyline.php?set_id=" + editSetId + "&polyline_id=" + f.polyline_id.value + "&remove_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolyline );
	 }

	 BitMap.Edit.expungePolyline = function(f){
			editSetId = f.set_id.value;
			editPolylineId = f.polyline_id.value;
	 		var str = "edit_polyline.php?polyline_id=" + f.polyline_id.value + "&expunge_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolyline );
	 }	 
	 
	 BitMap.Edit.storeNewPolylineSet = function(f){
			canceledit('editerror');
	 		var str = "edit_polylineset.php?" + queryString(f) + "&set_type=polylines" + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( addPolylineSet );
	 }

	 BitMap.Edit.storePolylineSet = function(f){
			editSetId = f.set_id.value;
			editObjectN = f.set_array_n.value;
	 		var str = "edit_polylineset.php?" + queryString(f) + "&gmap_id=" + bMapID + "&save_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updatePolylineSet );
	 }

	 BitMap.Edit.removePolylineSet = function(f){
			editSetId = f.set_id.value;
	 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&gmap_id=" + bMapID + "&remove_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolylineSet );
	 }
	 
	 BitMap.Edit.expungePolylineSet = function(f){
			editSetId = f.set_id.value;
	 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&expunge_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolylineSet );
	 }

	 BitMap.Edit.storeNewPolylineStyle = function(f){
	 		var str = "edit_polylinestyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addPolylineStyle ); 
	 }

	 BitMap.Edit.storePolylineStyle = function(f){
			editObjectN = f.style_array_n.value;
	 		var str = "edit_polylinestyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updatePolylineStyle ); 
	 }
	 
	 BitMap.Edit.storeNewPolygon = function(f){
			editSetId = f.set_id.value;
	 		var str = "edit_polygon.php?" + queryString(f) + "&save_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( addPolygon );
	 }
	 
	 BitMap.Edit.storePolygon = function(f){
			editObjectN = f.polygon_array_n.value;
			doSimpleXMLHttpRequest("edit_polygon.php", f).addCallback( updatePolygon );
	 }
	 
	 BitMap.Edit.removePolygon = function(f){
			editSetId = f.set_id.value;
			editPolygonId = f.polygon_id.value;
	 		var str = "edit_polygon.php?set_id=" + editSetId + "&polygon_id=" + f.polygon_id.value + "&remove_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygon );
	 }

	 BitMap.Edit.expungePolygon = function(f){
			editSetId = f.set_id.value;
			editPolygonId = f.polygon_id.value;
	 		var str = "edit_polygon.php?polygon_id=" + f.polygon_id.value + "&expunge_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygon );
	 }	 
	 
	 BitMap.Edit.storeNewPolygonSet = function(f){
			canceledit('editerror');
	 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + bMapID;
			doSimpleXMLHttpRequest(str).addCallback( addPolygonSet );
	 }

	 BitMap.Edit.storePolygonSet = function(f){
			editSetId = f.set_id.value;
			editObjectN = f.set_array_n.value;
	 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + bMapID + "&save_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( updatePolygonSet );
	 }

	 BitMap.Edit.removePolygonSet = function(f){
			editSetId = f.set_id.value;
	 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&gmap_id=" + bMapID + "&remove_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygonSet );
	 }
	 
	 BitMap.Edit.expungePolygonSet = function(f){
			editSetId = f.set_id.value;
	 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&expunge_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygonSet );
	 }

	 BitMap.Edit.storeNewPolygonStyle = function(f){
	 		var str = "edit_polygonstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addPolygonStyle ); 
	 }

	 BitMap.Edit.storePolygonStyle = function(f){
			editObjectN = f.style_array_n.value;
	 		var str = "edit_polygonstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updatePolygonStyle ); 
	 }








	 
	 
	 
	 
	 
	 
	 





	 

/*******************
 *
 * POST XML Map Functions
 *
 *******************/	 
	 
	 BitMap.Edit.updateMap = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
	 
      var xml = rslt.responseXML;
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('gmap_id');
			Map.id = id[0].firstChild.nodeValue;			
 			var t = xml.documentElement.getElementsByTagName('title');
			Map.title = t[0].firstChild.nodeValue;
			var d = xml.documentElement.getElementsByTagName('desc');
			Map.description = d[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('data');
			var data = dt[0].firstChild.nodeValue;
	 		Map.data = data;
			var pdt = xml.documentElement.getElementsByTagName('parsed_data');
			var parsed_data = pdt[0].firstChild.nodeValue;
	 		Map.parsed_data = parsed_data;
			var w = xml.documentElement.getElementsByTagName('w');
			Map.width = w[0].firstChild.nodeValue;
			var h = xml.documentElement.getElementsByTagName('h');
			Map.height = h[0].firstChild.nodeValue;			
			var lt = xml.documentElement.getElementsByTagName('lat');
			Map.lat = parseFloat(lt[0].firstChild.nodeValue);
			var ln = xml.documentElement.getElementsByTagName('lon');
			Map.lng = parseFloat(ln[0].firstChild.nodeValue);
			var z = xml.documentElement.getElementsByTagName('z');
			Map.zoom = parseInt(z[0].firstChild.nodeValue);
			var ss = xml.documentElement.getElementsByTagName('scale');
			Map.scale = ss[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('cont');
			Map.zoom_control = sc[0].firstChild.nodeValue;
			var sm = xml.documentElement.getElementsByTagName('typecon');
			Map.type_control = sm[0].firstChild.nodeValue;
			var oc = xml.documentElement.getElementsByTagName('overviewcont');
			Map.overview_control = oc[0].firstChild.nodeValue;
			var mt = xml.documentElement.getElementsByTagName('maptype');
			Map.maptype = Map.Maptypes[mt[0].firstChild.nodeValue];			

			//replace everything	
      var maptile = $('mymaptitle');
      if (maptile){maptile.innerHTML=Map.title;}

      var mapdesc = $('mymapdesc');
      if (mapdesc){mapdesc.innerHTML=Map.description;}

      $('mapcontent').innerHTML = Map.parsed_data;

      var mapdiv = $('map');
			if (Map.width !== '0' && Map.width !== 0){
			   var newWidth = Map.width + "px";
				}else{
			   var newWidth = 'auto';
				}
			if (Map.height !== '0' && Map.height !== 0){
			   var newHeight = Map.height + "px";
				}else{
			   var newHeight = 'auto';
				}
      if (mapdiv){mapdiv.style.width=newWidth; mapdiv.style.height=newHeight; map.onResize();}
			
			map.setMapType(Map.maptype);
			
      //Add Map TYPE controls - buttons in the upper right corner
  		if (Map.type_control == 'TRUE'){
  		map.removeControl(typecontrols);
  		map.addControl(typecontrols);
  		}else{
  		map.removeControl(typecontrols);
  		}
  		
  		//Add Scale controls
  		if (Map.scale == 'TRUE'){
  		map.removeControl(scale);
  		map.addControl(scale);
  		}else{
  		map.removeControl(scale);
  		}
  		
      //Add Navigation controls - buttons in the upper left corner		
  		map.removeControl(smallcontrols);
  		map.removeControl(largecontrols);
  		map.removeControl(zoomcontrols);
  		if (Map.zoom_control == 's') {
  		map.addControl(smallcontrols);
  		}else if (bMapControl == 'l') {
  		map.addControl(largecontrols);		
  		}else if (bMapControl == 'z') {
  		map.addControl(zoomcontrols);
  		}
			
			map.centerAndZoom(new GPoint(Map.lng, Map.lat), Map.zoom);
			
			BitMap.Edit.editMap();
	 }



	 BitMap.Edit.addMapType = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			// create a spot for a new maptype in the data array
			var n = Map.Maptypes.length;
			Map.Maptypes[n] = new Array();
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		Map.Maptypes[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		Map.Maptypes[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		Map.Maptypes[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		Map.Maptypes[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		Map.Maptypes[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		Map.Maptypes[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		Map.Maptypes[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		Map.Maptypes[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		Map.Maptypes[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		Map.Maptypes[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		Map.Maptypes[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		Map.Maptypes[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
			
			Map.Maptypes[n].maptype_node = map.mapTypes.length;
			
			// attach the new map type to the map
			var baseid = Map.Maptypes[n].basetype;
			var typeid = Map.Maptypes[n].maptype_id;
			var typename = Map.Maptypes[n].name;
			var result = copy_obj( map.mapTypes[baseid] );

			result.baseUrls = new Array();
			result.baseUrls[0] = Map.Maptypes[n].maptiles_url;
			result.typename = Map.Maptypes[n].name;
			result.getLinkText = function() { return this.typename; };
			map.mapTypes[map.mapTypes.length] = result;
			Map.Maptypes[typename] = result;
			
			// set the map type to active
			map.setMapType(Map.Maptypes[typename]);

			// update the controls
  		map.removeControl(typecontrols);
  		map.addControl(typecontrols);

			// clear the form
			$('maptypeform_new').reset();
			// update the sets menus
			BitMap.Edit.editMapTypes();
	 }



	 
	 BitMap.Edit.updateMapType = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;

      var xml = rslt.responseXML;

			var n = editObjectN;

			//clear maptype in this location from the Map array of Types
			Map.Maptypes[Map.Maptypes[n].name] = null;
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		Map.Maptypes[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		Map.Maptypes[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		Map.Maptypes[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		Map.Maptypes[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		Map.Maptypes[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		Map.Maptypes[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		Map.Maptypes[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		Map.Maptypes[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		Map.Maptypes[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		Map.Maptypes[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		Map.Maptypes[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		Map.Maptypes[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
						
			var p = Map.Maptypes[n].maptype_node;

			// attach the new map type to the map
			var baseid = Map.Maptypes[n].basetype;
			var typeid = Map.Maptypes[n].maptype_id;
			var typename = Map.Maptypes[n].name;
			var result = copy_obj( map.mapTypes[baseid] );
			result.baseUrls = new Array();
			result.baseUrls[0] = Map.Maptypes[n].maptiles_url;
			result.typename = Map.Maptypes[n].name;
			result.getLinkText = function() { return this.typename; };
			map.mapTypes[p] = result;
			Map.Maptypes[typename] = result;
			
			// set the map type to active
			map.setMapType( Map.Maptypes[Map.Maptypes[n].name] );
	 }

	 
	 
	 BitMap.Edit.updateRemoveMapType = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
			var n = editObjectN;
			
			// get maptype node value
			var p = Map.Maptypes[n].maptype_node;
			
			// remove the maptype ref form the map array of types
			Map.Maptypes[Map.Maptypes[n].name] = null;
			
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
    		for (var j=0; j<Map.Maptypes.length; j++){
      			if ( ( Map.Maptypes[j] != null ) && ( Map.Maptypes[j].maptype_id == editSetId ) ){
          		var getElem = "editmaptypetable_" + Map.Maptypes[j].maptype_id;
          		if ( $(getElem) ) {
              	var extraMapTypeForm = $(getElem);
          			$('editmaptypeform').removeChild(extraMapTypeForm);
          		}							
							Map.Maptypes[n].maptype_id = null;
      				Map.Maptypes[n] = null;
							
      			}
    		}			

				
	 }
	 
	 
	 
	 
/*******************
 *
 * POST XML Marker Functions
 *
 *******************/	 

BitMap.Edit.addMarker = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

	 		//the marker data we are changing
			var n = Map.Markers.length;
			Map.Markers[n] = new Array();
			var m = Map.Markers[n];

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			m.marker_id = id[0].firstChild.nodeValue;
			var ty = xml.documentElement.getElementsByTagName('marker_type');			
			m.marker_type = ty[0].firstChild.nodeValue;
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
			var pu = xml.documentElement.getElementsByTagName('photo_url');
			m.photo_url = pu[0].firstChild.nodeValue;
			var z = xml.documentElement.getElementsByTagName('z');
			m.zindex = parseInt(z[0].firstChild.nodeValue);

	 		var s;
			for(a=0; a<Map.MarkerSets.length; a++){
				if ( ( Map.MarkerSets[a] != null ) && ( Map.MarkerSets[a].set_id == editSetId ) ){
					s = a;
				}
			};

			m.set_id = Map.MarkerSets[s].set_id;
			m.style_id = Map.MarkerSets[s].style_id;
			m.icon_id = Map.MarkerSets[s].icon_id;
			m.plot_on_load = Map.MarkerSets[s].plot_on_load;
			m.side_panel = Map.MarkerSets[s].side_panel;
			m.explode = Map.MarkerSets[s].explode;
			m.array_n = parseInt(n);

        //make the marker
			Map.attachMarker(n, true);
			// clear the form
			$('markerform_new').reset();
			BitMap.Edit.removeAssistant();
			// update the sets menus
			BitMap.Edit.editMarkers();
			BitMap.Edit.editSet(editSetId);
}

	 	 
BitMap.Edit.updateMarker = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;

      var xml = rslt.responseXML;
						
	 		//the marker data we are changing
			var n = editObjectN;
			var m = Map.Markers[n];

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			var marker_id = id[0].firstChild.nodeValue;
			var ty = xml.documentElement.getElementsByTagName('marker_type');			
			m.marker_type = ty[0].firstChild.nodeValue;
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
			var pu = xml.documentElement.getElementsByTagName('photo_url');
			m.photo_url = pu[0].firstChild.nodeValue;
			var z = xml.documentElement.getElementsByTagName('z');
			var zindex = parseInt(z[0].firstChild.nodeValue);
			m.zindex = zindex;
			
        //unload the marker
      Map.map.removeOverlay( m.marker );
        //remake the marker
			Map.attachMarker(n, true);
			//remove the assistant
			BitMap.Edit.removeAssistant();
}


	 

BitMap.Edit.addMarkerSet = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			//@todo modify this to handle either Map.Markers or bSMData sets
			var n = Map.MarkerSets.length;
			Map.MarkerSets[n] = new Array();
			var s= Map.MarkerSets[n];
						
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
			var pol = xml.documentElement.getElementsByTagName('plot_on_load');
			if (pol[0].firstChild.nodeValue == 'true'){s.plot_on_load = true;}else{s.plot_on_load = false};
			var sp = xml.documentElement.getElementsByTagName('side_panel');
			if (sp[0].firstChild.nodeValue == 'true'){s.side_panel = true;}else{s.side_panel = false};
			var ex = xml.documentElement.getElementsByTagName('explode');
			if (ex[0].firstChild.nodeValue == 'true'){s.explode = true;}else{s.explode = false};
			var cl = xml.documentElement.getElementsByTagName('cluster');
			if (cl[0].firstChild.nodeValue == 'true'){s.cluster = true;}else{s.cluster = false};
  		s.set_type = 'markers';

			// clear the form
			$('markersetform_new').reset();
			// update the sets menus
			if ( $('newmarkerform').style.display == "block" ){ newMarker(); };
			BitMap.Edit.editMarkers();
}
	


BitMap.Edit.updateMarkerSet = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			var s = Map.MarkerSets[editObjectN];
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
			var pol = xml.documentElement.getElementsByTagName('plot_on_load');
			if (pol[0].firstChild.nodeValue == 'true'){s.plot_on_load = true;}else{s.plot_on_load = false};
			var sp = xml.documentElement.getElementsByTagName('side_panel');
			if (sp[0].firstChild.nodeValue == 'true'){s.side_panel = true;}else{s.side_panel = false};
			var ex = xml.documentElement.getElementsByTagName('explode');
			if (ex[0].firstChild.nodeValue == 'true'){s.explode = true;}else{s.explode = false};
			var cl = xml.documentElement.getElementsByTagName('cluster');
			if (cl[0].firstChild.nodeValue == 'true'){s.cluster = true;}else{s.cluster = false};

			if ( ( oldStyle != s.style_id ) || ( oldIcon != s.icon_id ) ) {
				a = Map.Markers;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(n=0; n<a.length; n++){
             		//if the array item is not Null
           			if (a[n]!= null && a[n].plot_on_load == true){
       					if (a[n].set_id == s.set_id){
								a[n].style_id = s.style_id;
								a[n].icon_id = s.icon_id;
								//unload the marker
         				Map.map.removeOverlay( a[n].marker );
    						//define marker
								Map.attachMarker(n);
       					}
       				}
       			}
       		}
			};

			// update the sets menus
			BitMap.Edit.editMarkers();
}


//this needs special attention
BitMap.Edit.updateRemoveMarker = function(){
		for (var n=0; n<Map.Markers.length; n++){
			if ( ( Map.Markers[n] != null ) && ( Map.Markers[n].marker_id == editMarkerId ) ){
				Map.map.removeOverlay(Map.Markers[n].marker);
				Map.Markers[n].marker = null;
				Map.Markers[n] = null;
			}
		}
		BitMap.Edit.editMarkers();
		BitMap.Edit.editSet(editSetId);
}



BitMap.Edit.updateRemoveMarkerSet = function(Map){
  	for (var n=0; n<Map.Markers.length; n++){
  		if ( ( Map.Markers[n] != null ) && ( Map.Markers[n].set_id == editSetId ) && ( Map.Markers[n].marker != null ) ){
				Map.map.removeOverlay(Map.Markers[n].marker); 			
				Map.Markers[n].marker = null;
				Map.Markers[n] = null;
  		}
  	}
		for (var s=0; s<Map.MarkerSets.length; s++){
  		if ( ( Map.MarkerSets[s] != null ) && ( Map.MarkerSets[s].set_id == editSetId ) ){
      		var getElem = "markerset_"+Map.MarkerSets[s].set_id;
      		if ( $(getElem) ) {
         		var extraMarkerForm = $(getElem);
      			$('editmarkerform').removeChild(extraMarkerForm);
      		}
				Map.MarkerSets[s].set_id = null;
  			Map.MarkerSets[s] = null;
  		}
		}
		BitMap.Edit.editMarkers();
}
	


BitMap.Edit.addMarkerStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			// create a spot for a new markerstyle in the data array
			var n = Map.MarkerStyles.length;
			Map.MarkerStyles[n] = new Array();
			var s = Map.MarkerStyles[n];

			// assign markerstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('marker_style_type');
  		s.marker_style_type = parseInt( tp[0].firstChild.nodeValue );
			var lho = xml.documentElement.getElementsByTagName('label_hover_opacity');			
  		s.label_hover_opacity = parseInt( lho[0].firstChild.nodeValue );
			var lo = xml.documentElement.getElementsByTagName('label_opacity');			
  		s.label_opacity = parseInt( lo[0].firstChild.nodeValue );
			var lhs = xml.documentElement.getElementsByTagName('label_hover_styles');			
  		s.label_hover_styles = lhs[0].firstChild.nodeValue;
			var ws = xml.documentElement.getElementsByTagName('window_styles');			
  		s.window_styles = ws[0].firstChild.nodeValue;

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
						
			// clear the form
			$('markerstyleform_new').reset();
			// update the styles menus
			BitMap.Edit.editMarkerStyles();
			BitMap.Edit.editMarkers();
}



BitMap.Edit.updateMarkerStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			//get the style we are updating
			var s = Map.MarkerStyles[editObjectN];
			var oldtp = s.marker_style_type;

			// assign markerstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('marker_style_type');
  		s.marker_style_type = parseInt( tp[0].firstChild.nodeValue );
			var lho = xml.documentElement.getElementsByTagName('label_hover_opacity');			
  		s.label_hover_opacity = parseInt( lho[0].firstChild.nodeValue );
			var lo = xml.documentElement.getElementsByTagName('label_opacity');			
  		s.label_opacity = parseInt( lo[0].firstChild.nodeValue );
			var lhs = xml.documentElement.getElementsByTagName('label_hover_styles');			
  		s.label_hover_styles = lhs[0].firstChild.nodeValue;
			var ws = xml.documentElement.getElementsByTagName('window_styles');			
  		s.window_styles = ws[0].firstChild.nodeValue;

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

			//update all markers
      	var a = Map.Markers;
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null && a[n].marker != null && a[n].style_id == s.style_id && s.marker_style_type != oldtp){
	      			//unload the marker
  					BitMap.Edit.map.removeOverlay( a[n].marker );
	      			//define new marker with new styles
						BitMap.Edit.attachMarker(n);
					}
				}
			}
			BitMap.Edit.editMarkerStyles();
			BitMap.Edit.editMarkers();
}

	



BitMap.Edit.addIconStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			// create a spot for a new iconstyle in the data array
			var n = Map.IconStyles.length;
			Map.IconStyles[n] = new Array();
			var i = Map.IconStyles[n];

			// assign iconstyle values to data array			
			var id = xml.documentElement.getElementsByTagName('icon_id');
  		i.icon_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');
  		i.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('icon_style_type');
  		i.icon_style_type = parseInt( tp[0].firstChild.nodeValue );
			var ig = xml.documentElement.getElementsByTagName('image');
  		i.image = ig[0].firstChild.nodeValue;
			var rig = xml.documentElement.getElementsByTagName('rollover_image');
  		i.rollover_image = rig[0].firstChild.nodeValue;
			var icw = xml.documentElement.getElementsByTagName('icon_w');
  		i.icon_w = parseInt( icw[0].firstChild.nodeValue );
			var ich = xml.documentElement.getElementsByTagName('icon_h');
  		i.icon_h = parseInt( ich[0].firstChild.nodeValue );
			var is = xml.documentElement.getElementsByTagName('shadow_image');			
  		i.shadow_image = is[0].firstChild.nodeValue;
			var isw = xml.documentElement.getElementsByTagName('shadow_w');
  		i.shadow_w = parseInt( isw[0].firstChild.nodeValue );
			var ish = xml.documentElement.getElementsByTagName('shadow_h');
  		i.shadow_h = parseInt( ish[0].firstChild.nodeValue );
			var iax = xml.documentElement.getElementsByTagName('icon_anchor_x');			
  		i.icon_anchor_x = parseInt( iax[0].firstChild.nodeValue );
			var iay = xml.documentElement.getElementsByTagName('icon_anchor_y');			
  		i.icon_anchor_y = parseInt( iay[0].firstChild.nodeValue );
			var sax = xml.documentElement.getElementsByTagName('shadow_anchor_x');			
  		i.shadow_anchor_x = parseInt( sax[0].firstChild.nodeValue );
			var say = xml.documentElement.getElementsByTagName('shadow_anchor_y');			
  		i.shadow_anchor_y = parseInt( say[0].firstChild.nodeValue );
			var wax = xml.documentElement.getElementsByTagName('infowindow_anchor_x');			
  		i.infowindow_anchor_x = parseInt( wax[0].firstChild.nodeValue );
			var way = xml.documentElement.getElementsByTagName('infowindow_anchor_y');			
  		i.infowindow_anchor_y = parseInt( way[0].firstChild.nodeValue );
			var pt = xml.documentElement.getElementsByTagName('points');
  		i.points = pt[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('scale');
  		i.scale = sc[0].firstChild.nodeValue;
			var olc = xml.documentElement.getElementsByTagName('outline_color');
  		i.outline_color = olc[0].firstChild.nodeValue;
			var olw = xml.documentElement.getElementsByTagName('outline_weight');
  		i.outline_weight = olw[0].firstChild.nodeValue;
			var fc = xml.documentElement.getElementsByTagName('fill_color');
  		i.fill_color = fc[0].firstChild.nodeValue;
			var fo = xml.documentElement.getElementsByTagName('fill_opacity');
  		i.fill_opacity = fo[0].firstChild.nodeValue;

			//make the icon available
  		if (i.icon_style_type == 0) {
  			Map.defineGIcon(n);
  		}

			// clear the form
			$('iconstyleform_new').reset();
			// update the styles menus
			BitMap.Edit.editMarkers();
			BitMap.Edit.editIconStyles();
}


	
BitMap.Edit.updateIconStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      	var xml = rslt.responseXML;

			//get the style we are updating
			var i = Map.IconStyles[editObjectN];

			// assign iconsstyle values to data array
			var id = xml.documentElement.getElementsByTagName('icon_id');
  		i.icon_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');
  		i.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('icon_style_type');
  		i.icon_style_type = parseInt( tp[0].firstChild.nodeValue );
			var ig = xml.documentElement.getElementsByTagName('image');
  		i.image = ig[0].firstChild.nodeValue;
			var rig = xml.documentElement.getElementsByTagName('rollover_image');
  		i.rollover_image = rig[0].firstChild.nodeValue;
			var icw = xml.documentElement.getElementsByTagName('icon_w');
  		i.icon_w = parseInt( icw[0].firstChild.nodeValue );
			var ich = xml.documentElement.getElementsByTagName('icon_h');
  		i.icon_h = parseInt( ich[0].firstChild.nodeValue );
			var is = xml.documentElement.getElementsByTagName('shadow_image');			
  		i.shadow_image = is[0].firstChild.nodeValue;
			var isw = xml.documentElement.getElementsByTagName('shadow_w');
  		i.shadow_w = parseInt( isw[0].firstChild.nodeValue );
			var ish = xml.documentElement.getElementsByTagName('shadow_h');
  		i.shadow_h = parseInt( ish[0].firstChild.nodeValue );
			var iax = xml.documentElement.getElementsByTagName('icon_anchor_x');			
  		i.icon_anchor_x = parseInt( iax[0].firstChild.nodeValue );
			var iay = xml.documentElement.getElementsByTagName('icon_anchor_y');			
  		i.icon_anchor_y = parseInt( iay[0].firstChild.nodeValue );
			var sax = xml.documentElement.getElementsByTagName('shadow_anchor_x');			
  		i.shadow_anchor_x = parseInt( sax[0].firstChild.nodeValue );
			var say = xml.documentElement.getElementsByTagName('shadow_anchor_y');			
  		i.shadow_anchor_y = parseInt( say[0].firstChild.nodeValue );
			var wax = xml.documentElement.getElementsByTagName('infowindow_anchor_x');			
  		i.infowindow_anchor_x = parseInt( wax[0].firstChild.nodeValue );
			var way = xml.documentElement.getElementsByTagName('infowindow_anchor_y');			
  		i.infowindow_anchor_y = parseInt( way[0].firstChild.nodeValue );
			var pt = xml.documentElement.getElementsByTagName('points');
  		i.points = pt[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('scale');
  		i.scale = sc[0].firstChild.nodeValue;
			var olc = xml.documentElement.getElementsByTagName('outline_color');
  		i.outline_color = olc[0].firstChild.nodeValue;
			var olw = xml.documentElement.getElementsByTagName('outline_weight');
  		i.outline_weight = olw[0].firstChild.nodeValue;
			var fc = xml.documentElement.getElementsByTagName('fill_color');
  		i.fill_color = fc[0].firstChild.nodeValue;
			var fo = xml.documentElement.getElementsByTagName('fill_opacity');
  		i.fill_opacity = fo[0].firstChild.nodeValue;

			//update the icon
  		if (i.icon_style_type == 0) {
  			Map.defineGIcon(editObjectN);
  		}

			//update all markers
      	var a = Map.Markers;
    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null && a[n].marker != null && a[n].icon_id == i.icon_id){
	      			//unload the marker
  					Map.map.removeOverlay( a[n].marker );
						//define the marker
						BitMap.Edit.attachMarker(n);
					}
    		}
			}
}









	
/*******************
 *
 * POST XML Polyline Functions
 *
 *******************/	 

BitMap.Edit.addPolyline = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      	var xml = rslt.responseXML;
	 		var s;

			//this is such a crappy way to get this number
			for(var a=0; a<Map.PolylineSets.length; a++){
				if (Map.PolylineSets[a] != null && Map.PolylineSets[a].set_id == editSetId){
					s = a;
				}
			};

  		var n = Map.Polylines.length;
  		Map.Polylines[n] = new Array();
			var p = Map.Polylines[n];
  		p.array_n = n;
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polyline_id');			
			p.polyline_id = id[0].firstChild.nodeValue;
			var nm = xml.documentElement.getElementsByTagName('name');
			p.name = nm[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		p.points_data = points_data.split(",");			
			var bt = xml.documentElement.getElementsByTagName('border_text');
			if (bt[0].firstChild != null){p.border_text = bt[0].firstChild.nodeValue;}else{p.border_text = "";}	
			var zi = xml.documentElement.getElementsByTagName('zindex');
			p.zindex = parseInt(zi[0].firstChild.nodeValue);			
			
			p.set_id = Map.PolylineSets[s].set_id;
			p.style_id = Map.PolylineSets[s].style_id;
			p.plot_on_load = Map.PolylineSets[s].plot_on_load;
			p.side_panel = Map.PolylineSets[s].side_panel;
			p.explode = Map.PolylineSets[s].explode;
			p.array_n = parseInt(n);

			//create polyline
			Map.attachPolyline(n);

			// clear the form
			$('polylineform_new').reset();
			// update the sets menus
			BitMap.Edit.editPolylines();
			BitMap.Edit.editPolylineSet(editSetId);
			BitMap.Edit.removeAssistant();
}	




BitMap.Edit.updatePolyline = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
			var xml = rslt.responseXML;
			var n = editObjectN;
			var p = Map.Polylines[n];
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polyline_id');
			p.polyline_id = id[0].firstChild.nodeValue;
			var nm = xml.documentElement.getElementsByTagName('name');
			p.name = nm[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		p.points_data = points_data.split(",");
			var bt = xml.documentElement.getElementsByTagName('border_text');
			if (bt[0].firstChild != null){p.border_text = bt[0].firstChild.nodeValue;}else{p.border_text = "";}	
			var zi = xml.documentElement.getElementsByTagName('zindex');
			p.zindex = parseInt(zi[0].firstChild.nodeValue);			
			
			//remove old version
			Map.map.removeOverlay(p.polyline);
			//create polyline
			Map.attachPolyline(n);

			BitMap.Edit.removeAssistant();
}


	
	 BitMap.Edit.addPolylineSet = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			//@todo modify this to handle either Map.Polylines or bSLData sets
			var n = Map.PolylineSets.length;
			Map.PolylineSets[n] = new Array();
			var s = Map.PolylineSets[n];
 						
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('set_id');
			s.set_id = parseInt(id[0].firstChild.nodeValue);
			var nm = xml.documentElement.getElementsByTagName('name');
			s.name = nm[0].firstChild.nodeValue;
			var dc = xml.documentElement.getElementsByTagName('description');
			s.description = dc[0].firstChild.nodeValue;
			var sy = xml.documentElement.getElementsByTagName('style_id');
			s.style_id = parseInt(sy[0].firstChild.nodeValue);
			var pol = xml.documentElement.getElementsByTagName('plot_on_load');
			if (pol[0].firstChild.nodeValue == 'true'){s.plot_on_load = true;}else{s.plot_on_load = false};
			var sp = xml.documentElement.getElementsByTagName('side_panel');
			if (sp[0].firstChild.nodeValue == 'true'){s.side_panel = true;}else{s.side_panel = false};
			var ex = xml.documentElement.getElementsByTagName('explode');
			if (ex[0].firstChild.nodeValue == 'true'){s.explode = true;}else{s.explode = false};
  		s.set_type = 'polylines';
						
			// clear the form
			$('polylinesetform_new').reset();
			// update the sets menus
			if ( $('newpolylineform').style.display == "block" ){ newPolyline(); };
			BitMap.Edit.editPolylines();
	 }




	BitMap.Edit.updatePolylineSet = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      	var xml = rslt.responseXML;

			var s = Map.PolylineSets[editObjectN];
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
			var pol = xml.documentElement.getElementsByTagName('plot_on_load');
			if (pol[0].firstChild.nodeValue == 'true'){s.plot_on_load = true;}else{s.plot_on_load = false};
			var sp = xml.documentElement.getElementsByTagName('side_panel');
			if (sp[0].firstChild.nodeValue == 'true'){s.side_panel = true;}else{s.side_panel = false};
			var ex = xml.documentElement.getElementsByTagName('explode');
			if (ex[0].firstChild.nodeValue == 'true'){s.explode = true;}else{s.explode = false};

			if ( oldStyle != s.style_id ) {
				a = Map.Polylines;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(n=0; n<a.length; n++){
             		//if the array item is not Null
						if (a[n]!= null && a[n].polyline != null && a[n].set_id == s.set_id){
							a[n].style_id = s.style_id;
							//unload the polyline
         				Map.map.removeOverlay( a[n].polyline );
                 		//create polyline
							BitMap.Edit.attachPolyline(n);
       				}
       			}
       		}
			};

			// update the sets menus
			BitMap.Edit.editPolylines();
	}
	



	 BitMap.Edit.addPolylineStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
	 
      var xml = rslt.responseXML;

			// create a spot for a new polylinestyle in the data array
			var n = Map.PolylineStyles.length;
			Map.PolylineStyles[n] = new Array();
			var s = Map.PolylineStyles[n];

			// assign polylinestyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('polyline_style_type');			
  		s.polyline_style_type = parseInt( tp[0].firstChild.nodeValue );
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
			if (ba[0].firstChild.nodeValue == 'true'){ s.begin_arrow = true; }else{ s.begin_arrow = false; };
			var ea = xml.documentElement.getElementsByTagName('end_arrow');
			if (ea[0].firstChild.nodeValue == 'true'){ s.end_arrow = true; }else{ s.end_arrow = false; };
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
			BitMap.Edit.editPolylines();
			BitMap.Edit.editPolylineStyles();
	 }



	 BitMap.Edit.updatePolylineStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      	var xml = rslt.responseXML;

			//get the style we are updating
			var s = Map.PolylineStyles[editObjectN];

			// assign markerstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('polyline_style_type');			
  		s.polyline_style_type = parseInt( tp[0].firstChild.nodeValue );
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
			if (ba[0].firstChild.nodeValue == 'true'){ s.begin_arrow = true; }else{ s.begin_arrow = false; };
			var ea = xml.documentElement.getElementsByTagName('end_arrow');
			if (ea[0].firstChild.nodeValue == 'true'){ s.end_arrow = true; }else{ s.end_arrow = false; };
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

			//for each polyline
      	var a = Map.Polylines;
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
        		if (a[n]!= null && a[n].polyline != null && a[n].style_id == s.style_id){
						Map.map.removeOverlay( a[n].polyline );
        		Map.attachPolyline(n);
    			}
    		}
    	}

			//for each polygon
      	var b = Map.Polygons;
    	//if the length of the array is > 0
    	if (b.length > 0){
      	//loop through the array
    		for(i=0; i<b.length; i++){
      		//if the array item is not Null
        		if (b[i]!= null && b[i].polygon != null && b[i].style_id == s.style_id){
						Map.map.removeOverlay( b[i].polygon );
        			Map.attachPolygon(i);
    			}
    		}
    	}

			// update the polyline menus
			BitMap.Edit.editPolylineStyles();
			BitMap.Edit.editPolylines();
	 }



	
BitMap.Edit.updateRemovePolyline = function(Map){
	for (var i=0; i<Map.Polylines.length; i++){
		if ( Map.Polylines[i] != null && Map.Polylines[n].polyline != null && Map.Polylines[i].polyline_id == editPolylineId ){
			Map.map.removeOverlay(Map.Polylines[i].polyline);
			Map.Polylines[i].polyline = null;
			Map.Polylines[i] = null;
		}
	}
	BitMap.Edit.editPolylines();
	BitMap.Edit.editPolylineSet(editSetId);
}



//this needs special attention
BitMap.Edit.updateRemovePolylineSet = function(Map){
  	for (var n=0; n<Map.Polylines.length; n++){
  		if ( ( Map.Polylines[n] != null ) && ( Map.Polylines[n].set_id == editSetId ) && ( Map.Polylines[n].polyline != null ) ){
  			Map.map.removeOverlay(Map.Polylines[n].polyline);
				Map.Polylines[n].polyline = null;
  			Map.Polylines[n] = null;
  		}
  	}
		for (var s=0; s<Map.PolylineSets.length; s++){
  		if ( ( Map.PolylineSets[s] != null ) && ( Map.PolylineSets[s].set_id == editSetId ) ){
      		var getElem = "polylineset_"+Map.PolylineSets[s].set_id;
      		if ( $(getElem) ) {
          		var extraPolylineForm = $(getElem);
      			$('editpolylineform').removeChild(extraPolylineForm);
      		}
				Map.PolylineSets[s].set_id = null;
  			Map.PolylineSets[s] = null;
  		}
		}
}






/*******************
 *
 * POST XML Polygon Functions
 *
 *******************/	 

BitMap.Edit.addPolygon = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      	var xml = rslt.responseXML;
	 		var s;

			for(var a=0; a<Map.PolygonSets.length; a++){
				if ( Map.PolygonSets[a] != null && Map.PolygonSets[a].set_id == editSetId ){
					s = a;
				}
			};

  		var n = Map.Polygons.length;
  		Map.Polygons[n] = new Array();
			var p = Map.Polygons[n];
  		p.array_n = n;
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polygon_id');			
			p.polygon_id = parseInt(id[0].firstChild.nodeValue);
			var nm = xml.documentElement.getElementsByTagName('name');
			p.name = nm[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('circle');
			p.circle = cr[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		p.points_data = points_data.split(",");
			var cc = xml.documentElement.getElementsByTagName('circle_center');
			var circle_center = cc[0].firstChild.nodeValue;
	 		p.circle_center = circle_center.split(",");
			var rd = xml.documentElement.getElementsByTagName('radius');
			p.radius = rd[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('border_text');
			if (bt[0].firstChild != null){p.border_text = bt[0].firstChild.nodeValue;}else{p.border_text = "";}	
			var zi = xml.documentElement.getElementsByTagName('zindex');
			p.zindex = parseInt(zi[0].firstChild.nodeValue);			

			p.set_id = Map.PolygonSets[s].set_id;
			p.style_id = Map.PolygonSets[s].style_id;
			p.polylinestyle_id = Map.PolygonSets[s].polylinestyle_id;
			p.plot_on_load = Map.PolygonSets[s].plot_on_load;
			p.side_panel = Map.PolygonSets[s].side_panel;
			p.explode = Map.PolygonSets[s].explode;
			p.array_n = parseInt(n);

			//create polygon
			Map.attachPolygon(n);

			// clear the form
			$('polygonform_new').reset();
			// update the sets menus
			BitMap.Edit.editPolygons();
			BitMap.Edit.editPolygonSet(editSetId);
			BitMap.Edit.removeAssistant();
}	



BitMap.Edit.updatePolygon = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
			var xml = rslt.responseXML;
			var n = editObjectN;
			var p = Map.Polygons[n];
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('polygon_id');
			p.polygon_id = parseInt(id[0].firstChild.nodeValue);
			var nm = xml.documentElement.getElementsByTagName('name');
			p.name = nm[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('circle');
			p.circle = cr[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('points_data');
			var points_data = dt[0].firstChild.nodeValue;
	 		p.points_data = points_data.split(",");
			var cc = xml.documentElement.getElementsByTagName('circle_center');
			var circle_center = cc[0].firstChild.nodeValue;
	 		p.circle_center = circle_center.split(",");
			var rd = xml.documentElement.getElementsByTagName('radius');
			p.radius = rd[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('border_text');
			if (bt[0].firstChild != null){p.border_text = bt[0].firstChild.nodeValue;}else{p.border_text = "";}
			var zi = xml.documentElement.getElementsByTagName('zindex');
			p.zindex = parseInt(zi[0].firstChild.nodeValue);			
			
			//remove old version
			Map.map.removeOverlay(p.polygon);
			//create polygon
			Map.attachPolygon(n);

			BitMap.Edit.removeAssistant();
}




BitMap.Edit.addPolygonSet = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			//@todo modify this to handle either Map.Polylines or bSLData sets
			var n = Map.PolygonSets.length;
			Map.PolygonSets[n] = new Array();
			var s = Map.PolygonSets[n];			
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('set_id');
			s.set_id = parseInt(id[0].firstChild.nodeValue);
			var nm = xml.documentElement.getElementsByTagName('name');
			s.name = nm[0].firstChild.nodeValue;
			var dc = xml.documentElement.getElementsByTagName('description');
			s.description = dc[0].firstChild.nodeValue;
			var sy = xml.documentElement.getElementsByTagName('style_id');
			s.style_id = parseInt(sy[0].firstChild.nodeValue);
			var psy = xml.documentElement.getElementsByTagName('polylinestyle_id');
			s.polylinestyle_id = parseInt(psy[0].firstChild.nodeValue);
			var pol = xml.documentElement.getElementsByTagName('plot_on_load');
			if (pol[0].firstChild.nodeValue == 'true'){s.plot_on_load = true;}else{s.plot_on_load = false};
			var sp = xml.documentElement.getElementsByTagName('side_panel');
			if (sp[0].firstChild.nodeValue == 'true'){s.side_panel = true;}else{s.side_panel = false};
			var ex = xml.documentElement.getElementsByTagName('explode');
			if (ex[0].firstChild.nodeValue == 'true'){s.explode = true;}else{s.explode = false};
  		s.set_type = 'polygons';
			
			// clear the form
			$('polygonsetform_new').reset();
			// update the sets menus
			if ( $('newpolygonform').style.display == "block" ){ newPolygon(); };
			BitMap.Edit.editPolygons();
}




BitMap.Edit.updatePolygonSet = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      	var xml = rslt.responseXML;

			var s = Map.PolygonSets[editObjectN];
			var oldStyle = s.style_id;
			var oldLineStyle = s.polylinestyle_id;

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('set_id');			
			s.set_id = parseInt(id[0].firstChild.nodeValue);
			var nm = xml.documentElement.getElementsByTagName('name');
			s.name = nm[0].firstChild.nodeValue;
			var dc = xml.documentElement.getElementsByTagName('description');
			s.description = dc[0].firstChild.nodeValue;
			var sy = xml.documentElement.getElementsByTagName('style_id');
			s.style_id = parseInt(sy[0].firstChild.nodeValue);			
			var psy = xml.documentElement.getElementsByTagName('polylinestyle_id');
			s.polylinestyle_id = parseInt(psy[0].firstChild.nodeValue);
			var pol = xml.documentElement.getElementsByTagName('plot_on_load');
			if (pol[0].firstChild.nodeValue == 'true'){s.plot_on_load = true;}else{s.plot_on_load = false};
			var sp = xml.documentElement.getElementsByTagName('side_panel');
			if (sp[0].firstChild.nodeValue == 'true'){s.side_panel = true;}else{s.side_panel = false};
			var ex = xml.documentElement.getElementsByTagName('explode');
			if (ex[0].firstChild.nodeValue == 'true'){s.explode = true;}else{s.explode = false};

			if ( oldStyle != s.style_id || oldLineStyle != s.polylinestyle_id) {
				a = Map.Polygons;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(n=0; n<a.length; n++){
             		//if the array item is not Null
           			if (a[n]!= null && a[n].polygon != null && a[n].set_id == s.set_id){
							//update the style ids
							a[n].style_id = s.style_id;
							a[n].polylinestyle_id = s.polylinestyle_id
							//unload the polygon
         				Map.map.removeOverlay( a[n].polygon );
                 		//create polygon
							Map.attachPolygon(n);
       				}
       			}
       		}
			};
			// update the sets menus
			BitMap.Edit.editPolygons();
}



BitMap.Edit.addPolygonStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;
      
      var xml = rslt.responseXML;

			// create a spot for a new polygonstyle in the data array
			var n = Map.PolygonStyles.length;
			Map.PolygonStyles[n] = new Array();
			var s = Map.PolygonStyles[n];

			// assign polygonstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('polygon_style_type');			
  		s.polygon_style_type = parseInt( tp[0].firstChild.nodeValue );
			var cl = xml.documentElement.getElementsByTagName('color');			
  		s.color = cl[0].firstChild.nodeValue;
			var wt = xml.documentElement.getElementsByTagName('weight');			
  		s.weight = parseInt( wt[0].firstChild.nodeValue );
			var op = xml.documentElement.getElementsByTagName('opacity');			
  		s.opacity = op[0].firstChild.nodeValue;

			// clear the form
			$('polygonstyleform_new').reset();
			// update the styles menus
			BitMap.Edit.editPolygonStyles();
			BitMap.Edit.editPolygons();
}



BitMap.Edit.updatePolygonStyle = function(rslt){
	    //@todo change this - bad harding coded ref to the map data - not nice
      var Map = BitMap.MapData[0].Map;

      	var xml = rslt.responseXML;

			//get the style we are updating
			var s = Map.PolygonStyles[editObjectN];

			// assign markerstyle values data array			
			var id = xml.documentElement.getElementsByTagName('style_id');			
  		s.style_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		s.name = nm[0].firstChild.nodeValue;
			var tp = xml.documentElement.getElementsByTagName('polygon_style_type');			
  		s.polygon_style_type = parseInt( tp[0].firstChild.nodeValue );
			var cl = xml.documentElement.getElementsByTagName('color');			
  		s.color = cl[0].firstChild.nodeValue;
			var wt = xml.documentElement.getElementsByTagName('weight');			
  		s.weight = parseInt( wt[0].firstChild.nodeValue );
			var op = xml.documentElement.getElementsByTagName('opacity');			
  		s.opacity = op[0].firstChild.nodeValue;

			//update all polygons
      	var a = Map.Polygons;    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null && a[n].polygon != null && a[n].style_id == s.style_id){
						Map.map.removeOverlay(a[n].polygon);
						Map.attachPolygon(n);
    			}
    		}
    	}

			// update the styles menus
			BitMap.Edit.editPolygonStyles();
			BitMap.Edit.editPolygons();
}



BitMap.Edit.updateRemovePolygon = function(Map){
	for (var n=0; n<Map.Polygons.length; n++){
		if ( Map.Polygons[n] != null && Map.Polygons[n].polygon != null && Map.Polygons[n].polygon_id == editPolygonId ){
			map.removeOverlay(Map.Polygons[n].polygon);
			Map.Polygons[n].polygon = null;
			Map.Polygons[n] = null;
		}
	}
	BitMap.Edit.editPolygons();
	BitMap.Edit.editPolygonSet(editSetId);
}


BitMap.Edit.updateRemovePolygonSet = function(Map){
	for (var n=0; n<Map.Polygons.length; n++){
		if ( Map.Polygons[n] != null && Map.Polygons[n].polygon != null && Map.Polygons[n].set_id == editSetId ){
			map.removeOverlay(Map.Polygons[n].polygon);
			Map.Polygons[n].polygon = null;
			Map.Polygons[n] = null;
		}
	}
	for (var s=0; s<Map.PolygonSets.length; s++){
		if ( ( Map.PolygonSets[s] != null ) && ( Map.PolygonSets[s].set_id == editSetId ) ){
			var getElem = "polygonset_"+Map.PolygonSets[s].set_id;
			if ( $(getElem) ) {
				var extraPolygonForm = $(getElem);
				$('editpolygonform').removeChild(extraPolygonForm);
			}
			Map.PolygonSets[s].set_id = null;
			Map.PolygonSets[s] = null;
  	}
	}
}





	
/******************
 *
 *  Editing Tools
 *
 ******************/
 BitMap.Edit.bLastpoint;
 BitMap.Edit.bAssistant;
 BitMap.Edit.bTempPoints = new Array();	//create point array
 BitMap.Edit.bTP; //temporary polyline
 BitMap.Edit.bModForm;
 BitMap.Edit.bModPData; 
 BitMap.Edit.bModMLat;
 BitMap.Edit.bModMLon;
	
 BitMap.Edit.addAssistant = function(a, b){
 	removeAssistant();
 	if (a == 'polyline'){
		bModForm = $('polylineform_'+b);
 		bModPData = bModForm.points_data; 
		alert ('Polyline drawing assistant activated for '+ bModForm.name.value + ' polyline. \n Click to Draw!');
		
		bLastpoint = null;
	  bTempPoints = [];
  	bTP = new GPolyline(bTempPoints);
  	Map.map.addOverlay(bTP);		//create polyline object from points and add to map
  
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

 	if (a == 'polygon'){
		bModForm = $('polygonform_'+b);

  	if (bModForm.circle.options[bModForm.circle.selectedIndex].value == 'true'){
      	bModPData = bModForm.circle_center;
     	alert ('Circle-Center drawing assistant activated for '+ bModForm.name.value + ' polygon. \n Click to marker the center of your circle!');
     
       	bAssistant = GEvent.addListener(map, "click", function(overlay, point){
                         if (point) {
                     		Map.map.recenterOrPanToLatLng(point);
                     		bModPData.value = point.x + ", " + point.y;
                         }
                       });
  	}else{
   		bModPData = bModForm.points_data; 
  		alert ('Polygon drawing assistant activated for '+ bModForm.name.value + ' polygon. \n Click to draw the outline. \n\nThe final connection will automatically be \ncompleted for you, so don\'t worry about that.');
   		bLastpoint = null;
   	 	bTempPoints = [];
     	bTP = new GPolyline(bTempPoints);
     	Map.map.addOverlay(bTP);		//create polyline object from points and add to map
     
     	bAssistant = GEvent.addListener(map, "click", function(overlay,point) {
                		if(bLastpoint && bLastpoint.x==point.x && bLastpoint.y==point.y) return;
                		bLastpoint = point;
                		
                		bTempPoints.push(point);
                		Map.map.removeOverlay(bTP);
                		bTP = new GPolyline(bTempPoints);
                		Map.map.addOverlay(bTP);

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
	}
	
	if (a == 'marker'){
		bModForm = $('markerform_'+b);
 		bModMLat = bModForm.marker_lat; 
 		bModMLon = bModForm.marker_lon; 
		alert ('Marker ploting assistant activated for '+ bModForm.title.value + ' marker. \n Click to Position!');
	
  	bAssistant = GEvent.addListener(map, "click", function(overlay, point){
      if (point) {
  		if (bTP != null) {
        	Map.map.removeOverlay(bTP);
  		}
  		bTP = new GMarker(point);
  		Map.map.addOverlay(bTP);
  		Map.map.recenterOrPanToLatLng(point);
  		bModMLat.value = point.y;
  		bModMLon.value = point.x;											
      }
    });
	}

	if (a == 'map'){
		f = $('mapform');
		alert ('Map centering assistant activated. \n Click to get center lat and lon values!');
	
  	bAssistant = GEvent.addListener(map, "click", function(overlay, point){
      if (point) {
  		Map.map.recenterOrPanToLatLng(point);
  		f.map_lon.value = point.x;
  		f.map_lat.value = point.y;
      }
    });
	}

}	

	
 BitMap.Edit.removeAssistant = function(){
   if (bAssistant != null){
      Map.map.removeOverlay(bTP);
   		GEvent.removeListener(bAssistant);
  		bAssistant = null;
	 }
 } 
