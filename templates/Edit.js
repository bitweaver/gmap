//for debugging
BitMap.dumpProps = function(obj, parent) {
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

BitMap.EditMap = function(){
  BitMap.Initialize();
  BitMap.EditSession = new BitMap.Edit();
  BitMap.MapData[0].Map.addOverlayListener();
  BitMap.MapData[0].Map.attachSideMarkers();
};

// We use Mochikit library for AJAX and substituting getElementById with '$()'
// MAP EDITING FUNCTIONS

BitMap.Edit = function(){
  this.Map = BitMap.MapData[0].Map;
  // for tracking which object we are updating
  this.editArray;
  this.editObjectN;
  this.editSetId;
  this.editMarkerId;
  this.editPolylineId;
  this.editSetType;
  //constants for editing tools - declaired last in this script
  this.bLastpoint;
  this.bAssistant;
  this.bTempPoints = new Array();	//create point array
  this.bTP; //temporary polyline
  this.bModForm;
  this.bModPData; 
  this.bModMLat;
  this.bModMLng;
}


// for sorting arrays
BitMap.Edit.prototype.sortOn = function(a,b){ 
	return a['set_id']-b['set_id']; 
} 

BitMap.Edit.prototype.sortIt = function(pParamHash){
	pParamHash.sort(sortOn); 
}

BitMap.Edit.prototype.canceledit = function(i){
	$(i).style.display = "none";	
};

BitMap.Edit.prototype.toggleIconMenu = function(o, n){
	if (o == 0){
		$('gicon_style_head_'+n).style.display = 'table-row';
		$('gicon_style_menu1_'+n).style.display = 'table-row';
		$('gicon_style_menu2_'+n).style.display = 'table-row';
	}else{
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
BitMap.Edit.prototype.editMap = function(){
				  $('mapform').reset();
				 	BitMap.show('editmapform');

    			$('gmap_id').value = this.Map.id;
    			$('map_title').value = this.Map.title;
    			$('map_desc').value = this.Map.description;
    			$('map_w').value = this.Map.width;
    			$('map_h').value = this.Map.height;
    			$('map_lat').value = this.Map.lat;
    			$('map_lng').value = this.Map.lng;
    			$('map_z').value = this.Map.zoom;

					form = $('mapform');
					form.edit.value = this.Map.data;

        	for (var i=0; i < 4; i++) {
             if ($('map_showcont').options[i].value == this.Map.zoom_control){
                $('map_showcont').options[i].selected=true;
             }
          }

        	for (var i=0; i < 2; i++) {
             if ($('map_showscale').options[i].value == this.Map.scale){
                $('map_showscale').options[i].selected=true;
             }
          }
					
        	for (var i=0; i < 2; i++) {
             if ($('map_showtypecont').options[i].value == this.Map.type_control){
                $('map_showtypecont').options[i].selected=true;
             }
          }
					
    			var mapTypeRoot = $('map_type');

					var mapTypeCount = 2;
					
					if (typeof(this.Map.Maptypes) != 'undefined'){
						mapTypeCount += this.Map.Maptypes.length;
						var newMapType = mapTypeRoot.options[0].cloneNode(false);
  					for (i=0; i<this.Map.Maptypes.length; i++){
     					  mapTypeRoot.appendChild(newMapType);
      					mapTypeRoot.options[i+3].value = this.Map.Maptypes[i].name;
      					mapTypeRoot.options[i+3].text = this.Map.Maptypes[i].name;
  					}
					}
						
          for (var i=0; i<mapTypeCount; i++) {
             if ($('map_type').options[i].value == this.Map.maptype){
                $('map_type').options[i].selected=true;
             }
          }
									
    			/*@todo create value for comments
					  $('map_comm').value = ?; for type="checkbox
					 */
};

BitMap.Edit.prototype.editMapTypes = function(){
	BitMap.show('editmaptypemenu');
	BitMap.show('editmaptypeform');
	BitMap.show('editmaptypecancel');

	//if maptype data exists
	if ( typeof( this.Map.Maptypes ) ) {
	
  	// We assume editMapTypes has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.Maptypes.length; a++) {
  		if ( this.Map.Maptypes[a]!= null ){
    		var getElem = "editmaptypetable_" + this.Map.Maptypes[a].maptype_id;
    		if ( $(getElem) ) {
        	var extraMapTypeForm = $(getElem);
    			$('editmaptypeform').removeChild(extraMapTypeForm);
    		}
			}
  	}
		
  	var editMapTypeId;
  	  	
  	// for each maptype data set clone the form
  	for (var b=0; b<this.Map.Maptypes.length; b++) {
  	if ( this.Map.Maptypes[b]!= null ){
						
  		editMapTypeId = this.Map.Maptypes[b].maptype_id;
  	
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
  		BitMap.show( 'editmaptypetable_'+editMapTypeId );
  		BitMap.show( 'maptypeform_'+editMapTypeId );
						
			//@todo add cloning of the all maptypes form
	  
			// populate set form values
			form = $('maptypeform_' + editMapTypeId);

			form.array_n.value = b;
        form.maptype_id.value = this.Map.Maptypes[b].maptype_id;
        form.name.value = this.Map.Maptypes[b].name;
        form.description.value = this.Map.Maptypes[b].description;
        form.copyright.value = this.Map.Maptypes[b].copyright;
        form.maxzoom.value = this.Map.Maptypes[b].maxzoom;
        for (var r=0; r < 3; r++) {
           if (form.basetype.options[r].value == this.Map.Maptypes[b].basetype){
           		form.basetype.options[r].selected=true;
           }
        };			
        for (var r=0; r < 3; r++) {
           if (form.alttype.options[r].value == this.Map.Maptypes[b].alttype){
           		form.alttype.options[r].selected=true;
           }
        };
        form.maptiles_url.value = this.Map.Maptypes[b].maptiles_url;
        form.lowtiles_url.value = this.Map.Maptypes[b].lowresmaptiles_url;
        form.hybridtiles_url.value = this.Map.Maptypes[b].hybridtiles_url;
        form.lowhybridtiles_url.value = this.Map.Maptypes[b].lowreshybridtiles_url;

			// just for a pretty button - js sucks it!
        var mytable = $('maptypeformdata_'+editMapTypeId);
        var mytablebody = mytable.getElementsByTagName("tbody").item(0);
			var myrow = mytablebody.getElementsByTagName("tr").item(0);
        var mycel = myrow.getElementsByTagName("td").item(6);
			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storeMapType(document.maptypeform_"+editMapTypeId+");";
			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";
			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.EditSession.removeMapType(document.maptypeform_"+editMapTypeId+");";
			mycel.getElementsByTagName("a").item(3).href = "javascript:BitMap.EditSession.expungeMapType(document.maptypeform_"+editMapTypeId+");";

  	}
		}
	}	
};


BitMap.Edit.prototype.newMapType = function(){
    // Display the New Marker Div and Cancel Button
   	BitMap.show('newmaptypeform');

		// Reset the Form
		$('maptypeform_new').reset();
};




/*******************
 *
 * MARKER FORM FUNCTIONS
 *
 *******************/

BitMap.Edit.prototype.newMarker = function(){
		var check = false;
  	for (var i=0; i<this.Map.MarkerSets.length; i++){
  		if ( this.Map.MarkerSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a marker, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new marker!";
			BitMap.show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      this.newMarkerSet();

		}else{
      // Display the New Marker Div and Cancel Button
     	BitMap.show('newmarkerform');

  		// Reset the Form
  		$('markerform_new').reset();
  		
  		// shortcut to the Select Option we are adding to
  		var selectRoot = $('set_id');
  
  		// we assume we have called this before and reset the options menu
  		selectRoot.options.length = 0;
  
  		// add option for each set available
  		if ( typeof(this.Map.MarkerSets) != 'undefined' ){
    			for ( i=0; i<this.Map.MarkerSets.length; i++ ){
  						if ( this.Map.MarkerSets[i] != null ){
								selectRoot.options[selectRoot.options.length] = new Option( this.Map.MarkerSets[i].name, this.Map.MarkerSets[i].set_id );
  						}
    			}
  		}
		}
};


BitMap.Edit.prototype.newMarkerSet = function(){
    // Display the New Form Div
   	BitMap.show('newmarkersetform');
		// Reset the Form
		$('markersetform_new').reset();
};



BitMap.Edit.prototype.editMarkers = function(){		
  // Display the Edit Form Div and Cancel Button
	BitMap.show('editmarkermenu');
  BitMap.show('editmarkerform');
	BitMap.show('editmarkercancel');

	//if marker data exists
	if ( typeof(this.Map.Markers) ) {
	
  	// We assume editMarkers has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.MarkerSets.length; a++) {
  		if (this.Map.MarkerSets[a]!= null){
    		var getElem = "markerset_"+this.Map.MarkerSets[a].set_id;
    		if ( $(getElem) ) {
        	var extraMarkerForm = $(getElem);
    			$('editmarkerform').removeChild(extraMarkerForm);
    		}
			}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<this.Map.MarkerSets.length; b++) {
    	if (this.Map.MarkerSets[b]!= null){
  						
    		newSetId = this.Map.MarkerSets[b].set_id;
    	
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
    		BitMap.show('markerset_'+newSetId);
				BitMap.show('markersetform_'+newSetId);

				//get form data div children and update
           	var mytable = $('markersetformdata_'+newSetId);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);

   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("b").item(0).innerHTML = this.Map.MarkerSets[b].name;
   			mycel = myrow.getElementsByTagName("td").item(7);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storeMarkerSet(document.markersetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:BitMap.EditSession.removeMarkerSet(document.markersetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.EditSession.expungeMarkerSet(document.markersetform_"+newSetId+");";

   			myrow = mytablebody.getElementsByTagName("tr").item(1);
   			mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.editSet("+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";

				//get form and update values
				form = $('markersetform_'+newSetId);
				form.set_id.value = newSetId;
				form.set_array_n.value = b;
				if (this.Map.MarkerSets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (this.Map.MarkerSets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (this.Map.MarkerSets[b].explode == false){ form.explode.options[1].selected=true };
				if (this.Map.MarkerSets[b].cluster == false){ form.cluster.options[1].selected=true };
				if ( (typeof(this.Map.MarkerStyles) != 'undefined') && (this.Map.MarkerStyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<this.Map.MarkerStyles.length; d++){
						if ( this.Map.MarkerStyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( this.Map.MarkerStyles[d].name, this.Map.MarkerStyles[d].style_id );
							if ( this.Map.MarkerStyles[d].style_id == this.Map.MarkerSets[b].style_id){
							form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
				}
				if ( (typeof(this.Map.IconStyles) != 'undefined') && (this.Map.IconStyles.length > 0) ){
					var IconN = form.icon_id.options.length;
  				for (var e=0; e<this.Map.IconStyles.length; e++){
						if ( this.Map.IconStyles[e] != null ){
							form.icon_id.options[IconN+e] = new Option( this.Map.IconStyles[e].name, this.Map.IconStyles[e].icon_id );
							if ( this.Map.IconStyles[e].icon_id == this.Map.MarkerSets[b].icon_id){
							form.icon_id.options[IconN+e].selected=true;
							}
  					}
  				}
				}
			}
		}			
		
  	//for length of markers add form to setelement on matching set_id
		var x = 0;
  	for (g=0; g<this.Map.Markers.length; g++) {
			if (this.Map.Markers[g]!= null){
				x++;
				//add marker form...again a little ugly here
				var formCont = $("editmarkertable_"+this.Map.Markers[g].set_id);
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
						$('editmarkertable_'+this.Map.Markers[g].set_id).appendChild(newMarkerForm);
    				BitMap.show('markerform_'+g);
    			}
    		}
				
				// populate set form values
				form = $('markerform_'+g);
            form.set_id.value = this.Map.Markers[g].set_id;
				if ( this.Map.Markers[g].marker_type == 1 ){
					form.marker_type.options[1].selected = true;
  			}
            form.marker_id.value = this.Map.Markers[g].marker_id;
            form.title.value = this.Map.Markers[g].title;
            form.marker_lat.value = this.Map.Markers[g].lat;
            form.marker_lng.value = this.Map.Markers[g].lon;
            form.edit.value = this.Map.Markers[g].data;
            form.marker_labeltext.value = this.Map.Markers[g].label_data;
            form.photo_url.value = this.Map.Markers[g].photo_url;
            form.marker_zi.value = this.Map.Markers[g].zindex;
            form.marker_array_n.value = this.Map.Markers[g].array_n;
				
				// just for a pretty button - js sucks it!
           	var mytable = $('formdata_'+g);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(2);
				mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.addAssistant('marker', "+g+");";

				mycel = myrow.getElementsByTagName("td").item(7);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storeMarker(document.markerform_"+g+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:Map.Markers["+Map.Markers[g].array_n+"].marker.openInfoWindowHtml(Map.Markers["+Map.Markers[g].array_n+"].marker.my_html);";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.EditSession.removeMarker(document.markerform_"+g+");";
   			mycel.getElementsByTagName("a").item(3).href = "javascript:BitMap.EditSession.expungeMarker(document.markerform_"+g+");";

			}
		}		
	}
};



//@todo change this to editMarkerSet(n)
BitMap.Edit.prototype.editSet = function(n){
				BitMap.show('setform_'+n);
};


BitMap.Edit.prototype.newIconStyle = function(){
		var check = false;
  	for (var i=0; i<this.Map.MarkerSets.length; i++){
  		if ( this.Map.MarkerSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a icon style, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new icon style!";
			BitMap.show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      this.newMarkerSet();

		}else{
      // Display the New Icon Style Div
   		BitMap.show('newiconstyleform');

  		// Reset the Form
  		$('iconstyleform_new').reset();  		  
		}
};


BitMap.Edit.prototype.editIconStyles = function(){
		BitMap.show('editiconstylesmenu');
		BitMap.show('editiconstyleform');
		BitMap.show('editiconstylescancel');

  	//if iconstyles data exists
  	if ( typeof( this.Map.IconStyles ) ) {
  
    	// We assume editIconStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<this.Map.IconStyles.length; a++) {
    		if ( this.Map.IconStyles[a]!= null ){
      			var getElem = "editiconstyletable_" + this.Map.IconStyles[a].icon_id;
        		if ( $(getElem) ) {
            		var extraIconStyleForm = $(getElem);
        			$('editiconstyleform').removeChild(extraIconStyleForm);
        		}
  			}
    	}
  
    	var editIconStyleId;
			var x = 0;  
    	// for each iconstyle data set clone the form
    	for (var b=0; b<this.Map.IconStyles.length; b++) {
        	if ( this.Map.IconStyles[b]!= null ){  						
					x++;    
        		editIconStyleId = this.Map.IconStyles[b].icon_id;
    
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
        		BitMap.show( 'editiconstyletable_'+editIconStyleId );
        		BitMap.show( 'iconstyleform_'+editIconStyleId );
    
      			// populate set form values
      			form = $('iconstyleform_' + editIconStyleId );
    
                form.style_array_n.value = b;
                form.icon_id.value = this.Map.IconStyles[b].icon_id;
                form.name.value = this.Map.IconStyles[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.icon_style_type.options[r].value == this.Map.IconStyles[b].icon_style_type){
                   		form.icon_style_type.options[r].selected=true;
                   }
                };
                form.image.value = this.Map.IconStyles[b].image;
                form.rollover_image.value = this.Map.IconStyles[b].rollover_image;
                form.icon_w.value = this.Map.IconStyles[b].icon_w;
                form.icon_h.value = this.Map.IconStyles[b].icon_h;

				 /* not sure want to both supporting these, 
			 	  * probably more complex than people want to be bothered with
				  * they are NOT in the edit_form.tpl
					----------------------------------------------------------	
					form.print_image.value = this.Map.IconStyles[b].print_image;
                form.moz_print_image.value = this.Map.IconStyles[b].moz_print_image;
                form.transparent.value = this.Map.IconStyles[b].transparent;
                form.print_shadow.value = this.Map.IconStyles[b].print_shadow;
                form.image_map.value = this.Map.IconStyles[b].image_map;
				  */

                form.shadow_image.value = this.Map.IconStyles[b].shadow_image;
                form.shadow_w.value = this.Map.IconStyles[b].shadow_w;
                form.shadow_h.value = this.Map.IconStyles[b].shadow_h;
                form.icon_anchor_x.value = this.Map.IconStyles[b].icon_anchor_x;
                form.icon_anchor_y.value = this.Map.IconStyles[b].icon_anchor_y;
                form.shadow_anchor_x.value = this.Map.IconStyles[b].shadow_anchor_x;
                form.shadow_anchor_y.value = this.Map.IconStyles[b].shadow_anchor_y;
                form.infowindow_anchor_x.value = this.Map.IconStyles[b].infowindow_anchor_x;
                form.infowindow_anchor_y.value = this.Map.IconStyles[b].infowindow_anchor_y;
                form.points.value = this.Map.IconStyles[b].points;
                form.scale.value = this.Map.IconStyles[b].scale;
                form.outline_color.value = this.Map.IconStyles[b].outline_color;
                form.outline_weight.value = this.Map.IconStyles[b].outline_weight;
                form.fill_color.value = this.Map.IconStyles[b].fill_color;
                form.fill_opacity.value = this.Map.IconStyles[b].fill_opacity;
    
      			// custom menu options and a pretty button
           		var mytable = $('iconstyleformdata_'+editIconStyleId);
           		var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   				var myrow = mytablebody.getElementsByTagName("tr").item(0);
           		var mycel = myrow.getElementsByTagName("td").item(1);

//					alert(mycel.getElementsByTagName("select").item(0).onchange);
//					mycel.getElementsByTagName("select").item(0).onchange = "javascript:toggleIconMenu(this.value, "+editIconStyleId+");";

					mycel = myrow.getElementsByTagName("td").item(6);
					mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storeIconStyle(document.iconstyleform_"+editIconStyleId+");";

					mytablebody.getElementsByTagName("tr").item(1).id = "gicon_style_head_"+editIconStyleId;
					mytablebody.getElementsByTagName("tr").item(2).id = "gicon_style_menu1_"+editIconStyleId;
					mytablebody.getElementsByTagName("tr").item(3).id = "gicon_style_menu2_"+editIconStyleId;

      		}
  		}
  	}
}


BitMap.Edit.prototype.newMarkerStyle = function(){
		var check = false;
  	for (var i=0; i<this.Map.MarkerSets.length; i++){
  		if ( this.Map.MarkerSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a marker style, there first must be a marker set associated with this map. Please create a new marker set, then you can add your new marker style!";
			BitMap.show('editerror');
  		Fat.fade_all();
  		//display new marker set form
      this.newMarkerSet();

		}else{
      // Display the New Marker Style Div
   		BitMap.show('newmarkerstyleform');

  		// Reset the Form
  		$('markerstyleform_new').reset();  		  
		};
}


BitMap.Edit.prototype.editMarkerStyles = function(){
		BitMap.show('editmarkerstylesmenu');
		BitMap.show('editmarkerstyleform');
		BitMap.show('editmarkerstylescancel');

		//if markerstyles data exists
		if ( typeof( this.Map.MarkerStyles ) ) {

  	// We assume editMarkerStyles has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.MarkerStyles.length; a++) {
  		if ( this.Map.MarkerStyles[a]!= null ){
    		var getElem = "editmarkerstyletable_" + this.Map.MarkerStyles[a].style_id;
    		if ( $(getElem) ) {
        	var extraMarkerStyleForm = $(getElem);
    			$('editmarkerstyleform').removeChild(extraMarkerStyleForm);
    		}
			}
  	}

  	var editMarkerStyleId;

		var x = 0;
  	// for each markerstyle data set clone the form
  	for (var b=0; b<this.Map.MarkerStyles.length; b++) {
    	if ( this.Map.MarkerStyles[b]!= null ){  						
				x++
    		editMarkerStyleId = this.Map.MarkerStyles[b].style_id;

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
    		BitMap.show( 'editmarkerstyletable_'+editMarkerStyleId );
    		BitMap.show( 'markerstyleform_'+editMarkerStyleId );

  			// populate set form values
  			form = $('markerstyleform_' + editMarkerStyleId );

            form.style_id.value = this.Map.MarkerStyles[b].style_id;
            form.style_array_n.value = b;
            form.name.value = this.Map.MarkerStyles[b].name;
            for (var r=0; r < 3; r++) {
               if (form.marker_style_type.options[r].value == this.Map.MarkerStyles[b].marker_style_type){
               		form.marker_style_type.options[r].selected=true;
               }
            };
            form.label_hover_opacity.value = this.Map.MarkerStyles[b].label_hover_opacity;
            form.label_opacity.value = this.Map.MarkerStyles[b].label_opacity;
            form.label_hover_styles.value = this.Map.MarkerStyles[b].label_hover_styles;
            form.window_styles.value = this.Map.MarkerStyles[b].window_styles;

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
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storeMarkerStyle(document.markerstyleform_"+editMarkerStyleId+");";
  		}
		}
	}
};


/*******************
 *
 * POLYLINE FORM FUNCTIONS
 *
 *******************/

BitMap.Edit.prototype.newPolyline = function(){
		var check = false;
  	for (var i=0; i<this.Map.PolylineSets.length; i++){
  		if ( this.Map.PolylineSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polyline, there first must be a polyline set associated with this map. Please create a new polyline set, then you can add your new polyline!";
			BitMap.show('editerror');
  		Fat.fade_all();
  		//display new polyline set form
      this.newPolylineSet();

		}else{
      // Display the New Form Div and Cancel Button
     	BitMap.show('newpolylineform');
  		// Reset the Form
  		$('polylineform_new').reset();
  		
  		// shortcut to the Select Option we are adding to
  		var selectRoot = $('polylineset_id');
  		
  		selectRoot.options.length = 0;
  
  		// add option for each set available
  		if ( typeof(this.Map.PolylineSets) != 'undefined' ){
    			for ( i=0; i<this.Map.PolylineSets.length; i++ ){
  						if ( this.Map.PolylineSets[i] != null ){
                 	selectRoot.options[selectRoot.options.length] = new Option( this.Map.PolylineSets[i].name, this.Map.PolylineSets[i].set_id );
  						}
    			}
  		}
		}
};



BitMap.Edit.prototype.newPolylineSet = function(){
    // Display the New Form Div
   	BitMap.show('newpolylinesetform');
		// Reset the Form
		$('polylinesetform_new').reset();
};



/* @todo needs to support markers in bSLData as well as Map.Polylines */
BitMap.Edit.prototype.editPolylines = function(){
	BitMap.show('editpolylinemenu');
  BitMap.show('editpolylineform');
	BitMap.show('editpolylinecancel');
	
	//if polyline data exists
	if ( typeof(this.Map.Polylines) ) {
	
  	// We assume editPolylines has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.PolylineSets.length; a++) {
  		if (this.Map.PolylineSets[a]!= null){
    		var getElem = "polylineset_"+this.Map.PolylineSets[a].set_id;
    		if ( $(getElem) ) {
        	var extraPolylineForm = $(getElem);
    			$('editpolylineform').removeChild(extraPolylineForm);
    		}
			}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<this.Map.PolylineSets.length; b++) {
  	if (this.Map.PolylineSets[b]!= null){
		  	
  		newSetId = this.Map.PolylineSets[b].set_id;
  	
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
    		BitMap.show('polylineset_'+newSetId);
				BitMap.show('polylinesetform_'+newSetId);
  
				//get form data div children and update
           	var mytable = $('polylinesetformdata_' + newSetId);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("b").item(0).innerHTML = this.Map.PolylineSets[b].name;
           	mycel = myrow.getElementsByTagName("td").item(5);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storePolylineSet(document.polylinesetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:BitMap.EditSession.removePolylineSet(document.polylinesetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.EditSession.expungePolylineSet(document.polylinesetform_"+newSetId+");";

   			myrow = mytablebody.getElementsByTagName("tr").item(1);
   			mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.editPolylineSet("+newSetId+");";
  			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";

				//get form and update values
				form = $('polylinesetform_'+newSetId);
				form.set_id.value = newSetId;
				if (this.Map.PolylineSets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (this.Map.PolylineSets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (this.Map.PolylineSets[b].explode == false){ form.explode.options[1].selected=true };
				form.set_array_n.value = b;
				if ( (typeof(this.Map.PolylineStyles) != 'undefined') && (this.Map.PolylineStyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<this.Map.PolylineStyles.length; d++){
						if ( this.Map.PolylineStyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( this.Map.PolylineStyles[d].name, this.Map.PolylineStyles[d].style_id );
							if ( this.Map.PolylineStyles[d].style_id == this.Map.PolylineSets[b].style_id){
							form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
				}
			}
		}			

  	//for length of polylines add form to setelement on matching set_id
		var x = 0;
  	for (g=0; g<this.Map.Polylines.length; g++) {
			if (this.Map.Polylines[g]!= null){
				x++;
				//add polyline form...again a little ugly here
				var formCont = $("editpolylinetable_"+this.Map.Polylines[g].set_id);
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
    							
        			$('editpolylinetable_'+this.Map.Polylines[g].set_id).appendChild(newPolylineForm);
    				BitMap.show('polylineform_'+g);
    			}
    		}

				// populate set form values
				form = $('polylineform_'+g);

            form.set_id.value = this.Map.Polylines[g].set_id;
            form.polyline_id.value = this.Map.Polylines[g].polyline_id;
            form.name.value = this.Map.Polylines[g].name;
            form.points_data.value = this.Map.Polylines[g].points_data;
            form.border_text.value = this.Map.Polylines[g].border_text;
            form.zindex.value = this.Map.Polylines[g].zindex;
            form.polyline_array_n.value = this.Map.Polylines[g].array_n;
				
				// just for a pretty button - js sucks it!
           	var mytable = $('polylineformdata_'+g);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(1);
				mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.addAssistant('polyline', "+g+");";

				mycel = myrow.getElementsByTagName("td").item(4);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storePolyline(document.polylineform_"+g+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.EditSession.removePolyline(document.polylineform_"+g+");";
   			mycel.getElementsByTagName("a").item(3).href = "javascript:BitMap.EditSession.expungePolyline(document.polylineform_"+g+");";
			}
		}		
	}
};



BitMap.Edit.prototype.editPolylineSet = function(n){
		BitMap.show('plsetform_'+n);
}


BitMap.Edit.prototype.cancelPolylineEdit = function(){
		this.canceledit('editpolylinemenu'); 
		this.canceledit('newpolylineform');
		this.canceledit('editpolylineform'); 
		this.canceledit('editpolylinecancel');
		this.removeAssistant();
}; 


BitMap.Edit.prototype.editPolylineStyles = function(){
		BitMap.show('editpolylinestylesmenu');
		BitMap.show('editpolylinestyleform');
		BitMap.show('editpolylinestylescancel');

  	//if polylinestyles data exists
  	if ( typeof( this.Map.PolylineStyles ) ) {
  
    	// We assume editPolylineStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<this.Map.PolylineStyles.length; a++) {
    		if ( this.Map.PolylineStyles[a]!= null ){
      			var getElem = "editpolylinestyletable_" + this.Map.PolylineStyles[a].style_id;
        		if ( $(getElem) ) {
            		var extraPolylineStyleForm = $(getElem);
        			$('editpolylinestyleform').removeChild(extraPolylineStyleForm);
        		}
  			}
    	}
  
    	var editPolylineStyleId;
  
    	// for each markerstyle data set clone the form
			var x = 0;
    	for (var b=0; b<this.Map.PolylineStyles.length; b++) {
        	if ( this.Map.PolylineStyles[b]!= null ){  						
					x++;    
        		editPolylineStyleId = this.Map.PolylineStyles[b].style_id;
    
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
        		BitMap.show( 'editpolylinestyletable_'+editPolylineStyleId );
        		BitMap.show( 'polylinestyleform_'+editPolylineStyleId );
    
      			// populate set form values
      			form = $('polylinestyleform_' + editPolylineStyleId );
    
                form.style_array_n.value = b;
                form.style_id.value = this.Map.PolylineStyles[b].style_id;
                form.name.value = this.Map.PolylineStyles[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.polyline_style_type.options[r].value == this.Map.PolylineStyles[b].polyline_style_type){
                   		form.polyline_style_type.options[r].selected=true;
                   }
                };
                form.color.value = this.Map.PolylineStyles[b].color;
                form.weight.value = this.Map.PolylineStyles[b].weight;
                form.opacity.value = this.Map.PolylineStyles[b].opacity;
                form.pattern.value = this.Map.PolylineStyles[b].pattern;
                form.segment_count.value = this.Map.PolylineStyles[b].segment_count;
                form.text_every.value = this.Map.PolylineStyles[b].text_every;
                if (this.Map.PolylineStyles[b].begin_arrow == false){
                	form.begin_arrow.options[0].selected=true;
                }else{
                	form.begin_arrow.options[1].selected=true;
					}
                if (this.Map.PolylineStyles[b].end_arrow == false){
                	form.end_arrow.options[0].selected=true;
                }else{
                	form.end_arrow.options[1].selected=true;
                }
                form.arrows_every.value = this.Map.PolylineStyles[b].arrows_every;
                form.text_fgstyle_color.value = this.Map.PolylineStyles[b].text_fgstyle_color;
                form.text_fgstyle_weight.value = this.Map.PolylineStyles[b].text_fgstyle_weight;
                form.text_fgstyle_opacity.value = this.Map.PolylineStyles[b].text_fgstyle_opacity;
                form.text_fgstyle_zindex.value = this.Map.PolylineStyles[b].text_fgstyle_zindex;
                form.text_bgstyle_color.value = this.Map.PolylineStyles[b].text_bgstyle_color;
                form.text_bgstyle_weight.value = this.Map.PolylineStyles[b].text_bgstyle_weight;
                form.text_bgstyle_opacity.value = this.Map.PolylineStyles[b].text_bgstyle_opacity;
                form.text_bgstyle_zindex.value = this.Map.PolylineStyles[b].text_bgstyle_zindex;
    
      			// just for a pretty button - js sucks it!
           		var mytable = $('polylinestyleformdata_'+editPolylineStyleId);
           		var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   				var myrow = mytablebody.getElementsByTagName("tr").item(0);
           		var mycel = myrow.getElementsByTagName("td").item(5);
					mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storePolylineStyle(document.polylinestyleform_"+editPolylineStyleId+");";
      		}
  		}
  	}
};


BitMap.Edit.prototype.newPolylineStyle = function(){
		var check = false;
  	for (var i=0; i<this.Map.PolylineSets.length; i++){
  		if ( this.Map.PolylineSets[i] != null ){
				check = true;
  		}
  	}
  	for (var i=0; i<this.Map.PolygonSets.length; i++){
  		if ( this.Map.PolygonSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polyline style, there must be a polyline or polygon set associated with this map. Please create a new polyline or polygon set, then you can add your new polyline style!";
			BitMap.show('editerror');
  		Fat.fade_all();
  		//display new polyline set form
      this.newPolylineSet();

		}else{
      // Display the New Polyline Style Div
   		BitMap.show('newpolylinestyleform');

  		// Reset the Form
  		$('polylinestyleform_new').reset();  		  
		};
}





/*******************
 *
 * Polygon FORM FUNCTIONS
 *
 *******************/

BitMap.Edit.prototype.newPolygon = function(){
		var check = false;
  	for (var i=0; i<this.Map.PolygonSets.length; i++){
  		if ( this.Map.PolygonSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polygon, there first must be a polygon set associated with this map. Please create a new polygon set, then you can add your new polygon!";
			BitMap.show('editerror');
  		Fat.fade_all();
  		//display new polygon set form
      this.newPolygonSet();

		}else{
      // Display the New Form Div and Cancel Button
     	BitMap.show('newpolygonform');
  		// Reset the Form
  		$('polygonform_new').reset();
  		
  		// shortcut to the Select Option we are adding to
  		var selectRoot = $('polygonset_id');
  		
  		selectRoot.options.length = 0;
  
  		// add option for each set available
  		if ( typeof(this.Map.PolygonSets) != 'undefined' ){
    			for ( i=0; i<this.Map.PolygonSets.length; i++ ){
  						if ( this.Map.PolygonSets[i] != null ){
                 	selectRoot.options[selectRoot.options.length] = new Option( this.Map.PolygonSets[i].name, this.Map.PolygonSets[i].set_id );
  						}
    			}
  		}
		}
};



BitMap.Edit.prototype.newPolygonSet = function(){
    // Display the New Form Div
   	BitMap.show('newpolygonsetform');
		// Reset the Form
		$('polygonsetform_new').reset();
};





/* @todo needs to support markers in bSLData as well as Map.Polylines */
BitMap.Edit.prototype.editPolygons = function(){
	BitMap.show('editpolygonmenu');
  BitMap.show('editpolygonform');
	BitMap.show('editpolygoncancel');
	
	//if polygon data exists
	if ( typeof(this.Map.Polygons) ) {

  	// We assume editPolygons has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.PolygonSets.length; a++) {
  		if (this.Map.PolygonSets[a]!= null){
    		var getElem = "polygonset_"+this.Map.PolygonSets[a].set_id;
    		if ( $(getElem) ) {
        	var extraPolygonForm = $(getElem);
    			$('editpolygonform').removeChild(extraPolygonForm);
    		}
			}
  	}

  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<this.Map.PolygonSets.length; b++) {
  	if (this.Map.PolygonSets[b]!= null){
		  	
  		newSetId = this.Map.PolygonSets[b].set_id;

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
    		BitMap.show('polygonset_'+newSetId);
				BitMap.show('polygonsetform_'+newSetId);

				//get form data div children and update
           	var mytable = $('polygonsetformdata_' + newSetId);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("b").item(0).innerHTML = this.Map.PolygonSets[b].name;
           	mycel = myrow.getElementsByTagName("td").item(5);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storePolygonSet(document.polygonsetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:BitMap.EditSession.removePolygonSet(document.polygonsetform_"+newSetId+");";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.EditSession.expungePolygonSet(document.polygonsetform_"+newSetId+");";

   			myrow = mytablebody.getElementsByTagName("tr").item(1);
   			mycel = myrow.getElementsByTagName("td").item(0);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.editPolygonSet("+newSetId+");";
  			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";


				//get form and update values
				form = $('polygonsetform_'+newSetId);
				form.set_id.value = newSetId;
				if (this.Map.PolygonSets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (this.Map.PolygonSets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (this.Map.PolygonSets[b].explode == false){ form.explode.options[1].selected=true };
				form.set_array_n.value = b;
				if ( (typeof(this.Map.PolygonStyles) != 'undefined') && (this.Map.PolygonStyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<this.Map.PolygonStyles.length; d++){
						if ( this.Map.PolygonStyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( this.Map.PolygonStyles[d].name, this.Map.PolygonStyles[d].style_id );
							if ( this.Map.PolygonStyles[d].style_id == this.Map.PolygonSets[b].style_id){
								form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
					var OptionO = form.polylinestyle_id.options.length;
  				for (var e=0; e<this.Map.PolylineStyles.length; e++){
						if ( this.Map.PolylineStyles[e] != null ){
							form.polylinestyle_id.options[OptionO + e] = new Option( this.Map.PolylineStyles[e].name, this.Map.PolylineStyles[e].style_id );
							if ( this.Map.PolylineStyles[e].style_id == this.Map.PolygonSets[b].polylinestyle_id){
								form.polylinestyle_id.options[OptionO + e].selected=true;
							}
  					}
  				}
				}
			}
		}			

  	//for length of polygons add form to setelement on matching set_id
		x = 0;
  	for (g=0; g<this.Map.Polygons.length; g++) {
			if (this.Map.Polygons[g]!= null){
				x++;
				//add polygon form...again a little ugly here
				var formCont = $("editpolygontable_"+this.Map.Polygons[g].set_id);

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
    							
        			$('editpolygontable_'+this.Map.Polygons[g].set_id).appendChild(newPolygonForm);
    				BitMap.show('polygonform_'+g);
    			}
    		}
				
				// populate set form values
				form = $('polygonform_'+g);

            form.set_id.value = this.Map.Polygons[g].set_id;
            form.polygon_id.value = this.Map.Polygons[g].polygon_id;
            form.name.value = this.Map.Polygons[g].name;
				if (this.Map.Polygons[g].circle == false){
					form.circle.options[0].selected=true;
				}else{
					form.circle.options[1].selected=true;
				}
            form.points_data.value = this.Map.Polygons[g].points_data;
            form.circle_center.value = this.Map.Polygons[g].circle_center;
            form.radius.value = this.Map.Polygons[g].radius;
            form.border_text.value = this.Map.Polygons[g].border_text;
            form.zindex.value = this.Map.Polygons[g].zindex;
            form.polygon_array_n.value = this.Map.Polygons[g].array_n;
				
				// just for a pretty button - js sucks it!
           	var mytable = $('polygonformdata_'+g);
           	var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   			var myrow = mytablebody.getElementsByTagName("tr").item(0);
           	var mycel = myrow.getElementsByTagName("td").item(2);
				mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.addAssistant('polygon', "+g+");";

				mycel = myrow.getElementsByTagName("td").item(7);
   			mycel.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.storePolygon(document.polygonform_"+g+");";
   			mycel.getElementsByTagName("a").item(1).href = "javascript:alert('feature coming soon');";
   			mycel.getElementsByTagName("a").item(2).href = "javascript:BitMap.EditSession.removePolygon(document.polygonform_"+g+");";
   			mycel.getElementsByTagName("a").item(3).href = "javascript:BitMap.EditSession.expungePolygon(document.polygonform_"+g+");";
			}
		}		
	}
};



BitMap.Edit.prototype.editPolygonSet = function(n){
		BitMap.show('pgsetform_'+n);
}


BitMap.Edit.prototype.cancelPolygonEdit = function(){
		this.canceledit('editpolygonmenu'); 
		this.canceledit('newpolygonform'); 
		this.canceledit('editpolygonform'); 
		this.canceledit('editpolygoncancel');
		this.removeAssistant();
}; 


BitMap.Edit.prototype.editPolygonStyles = function(){
		BitMap.show('editpolygonstylesmenu');
		BitMap.show('editpolygonstyleform');
		BitMap.show('editpolygonstylescancel');

  	//if polygonstyles data exists
  	if ( typeof( this.Map.PolygonStyles ) ) {
  
    	// We assume editPolygonStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<this.Map.PolygonStyles.length; a++) {
    		if ( this.Map.PolygonStyles[a]!= null ){
      			var getElem = "editpolygonstyletable_" + this.Map.PolygonStyles[a].style_id;
        		if ( $(getElem) ) {
            		var extraPolygonStyleForm = $(getElem);
        			$('editpolygonstyleform').removeChild(extraPolygonStyleForm);
        		}
  			}
    	}
  
    	var editPolygonStyleId;
  		var x=0;
    	// for each markerstyle data set clone the form
    	for (var b=0; b<this.Map.PolygonStyles.length; b++) {
        	if ( this.Map.PolygonStyles[b]!= null ){  						
					x++;    
        		editPolygonStyleId = this.Map.PolygonStyles[b].style_id;

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
        		BitMap.show( 'editpolygonstyletable_'+editPolygonStyleId );
        		BitMap.show( 'polygonstyleform_'+editPolygonStyleId );
    
      			// populate set form values
      			form = $('polygonstyleform_' + editPolygonStyleId );
    
                form.style_array_n.value = b;
                form.style_id.value = this.Map.PolygonStyles[b].style_id;
                form.name.value = this.Map.PolygonStyles[b].name;
                form.color.value = this.Map.PolygonStyles[b].color;
                form.weight.value = this.Map.PolygonStyles[b].weight;
                form.opacity.value = this.Map.PolygonStyles[b].opacity;
 
      			// just for a pretty button - js sucks it!
           		var mytable = $('polygonstyleformdata_'+editPolygonStyleId);
           		var mytablebody = mytable.getElementsByTagName("tbody").item(0);
   				var myrow = mytablebody.getElementsByTagName("tr").item(0);
           		var mycel = myrow.getElementsByTagName("td").item(5);
					mycel.getElementsByTagName("a").item(0).href = "javascript:this.storePolygonStyle(document.polygonstyleform_"+editPolygonStyleId+");";
      		}
  		}
  	}
};


BitMap.Edit.prototype.newPolygonStyle = function(){
		var check = false;
  	for (var i=0; i<this.Map.PolygonSets.length; i++){
  		if ( this.Map.PolygonSets[i] != null ){
				check = true;
  		}
  	}

  	if (check == false){
  		//set warning message, show it, fade it
  		$('errortext').innerHTML = "To add a polygon style, there first must be a polygon set associated with this map. Please create a new polygon set, then you can add your new polygon style!";
			BitMap.show('editerror');
  		Fat.fade_all();
  		//display new polygon set form
      this.newPolygonSet();

		}else{
      // Display the New Polygon Style Div
   		BitMap.show('newpolygonstyleform');

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
	 
	 BitMap.Edit.prototype.storeMap = function(f){
			doSimpleXMLHttpRequest("edit.php", f).addCallback(updateMap); 
	 }

	 BitMap.Edit.prototype.storeNewMapType = function(f){
	 		var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
			doSimpleXMLHttpRequest(str).addCallback( addMapType ); 
	 }

	 BitMap.Edit.prototype.storeMapType = function(f){	 
			this.editObjectN = f.array_n.value;
	 		var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
			doSimpleXMLHttpRequest(str).addCallback( updateMapType ); 
	 }
	 
	 BitMap.Edit.prototype.removeMapType = function(f){
			this.editObjectN = f.array_n.value;
			this.editSetId = f.maptype_id.value;
	 		var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&gmap_id=" + this.Map.id + "&remove_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMapType ); 
	 }
	 
	 BitMap.Edit.prototype.expungeMapType = function(f){
			this.editObjectN = f.array_n.value;
			this.editSetId = f.maptype_id.value;
	 		var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&expunge_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMapType ); 
	 }
	 
	 BitMap.Edit.prototype.storeNewMarker = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_marker.php?" + queryString(f) + "&save_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( addMarker ); 
	 }
	 
	 BitMap.Edit.prototype.storeMarker = function(f){
			this.editObjectN = f.marker_array_n.value;
	 		var str = "edit_marker.php?" + queryString(f) + "&save_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateMarker ); 
	 }
	 
	 BitMap.Edit.prototype.removeMarker = function(f){
			this.editSetId = f.set_id.value;
			this.editMarkerId = f.marker_id.value;
	 		var str = "edit_marker.php?set_id=" + this.editSetId + "&marker_id=" + this.editMarkerId + "&remove_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarker ); 
	 }

	 BitMap.Edit.prototype.expungeMarker = function(f){
			this.editSetId = f.set_id.value;
			this.editMarkerId = f.marker_id.value;
	 		var str = "edit_marker.php?marker_id=" + this.editMarkerId + "&expunge_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarker ); 
	 }	 

	 BitMap.Edit.prototype.storeNewMarkerSet = function(f){
			this.canceledit('editerror');
	 		var str = "edit_markerset.php?" + queryString(f) + "&set_type=markers" + "&gmap_id=" + this.Map.id;
			doSimpleXMLHttpRequest(str).addCallback( addMarkerSet ); 
	 }

	 BitMap.Edit.prototype.storeMarkerSet = function(f){
			this.editSetId = f.set_id.value;
			this.editObjectN = f.set_array_n.value;
	 		var str = "edit_markerset.php?" + queryString(f) + "&gmap_id=" + this.Map.id + "&save_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateMarkerSet ); 
	 }

	 BitMap.Edit.prototype.removeMarkerSet = function(f){
			this.editSetId = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarkerSet ); 
	 }

	 BitMap.Edit.prototype.expungeMarkerSet = function(f){
			this.editSetId = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&expunge_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemoveMarkerSet ); 
	 }
	 
	 BitMap.Edit.prototype.storeNewMarkerStyle = function(f){
	 		var str = "edit_markerstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addMarkerStyle ); 
	 }

	 BitMap.Edit.prototype.storeMarkerStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_markerstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updateMarkerStyle ); 
	 }

	 BitMap.Edit.prototype.storeNewIconStyle = function(f){
	 		var str = "edit_iconstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addIconStyle ); 
	 }

	 BitMap.Edit.prototype.storeIconStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_iconstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updateIconStyle ); 
	 }

	 BitMap.Edit.prototype.storeNewPolyline = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polyline.php?" + queryString(f) + "&save_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( addPolyline );
	 }
	 
	 BitMap.Edit.prototype.storePolyline = function(f){
			this.editObjectN = f.polyline_array_n.value;
			doSimpleXMLHttpRequest("edit_polyline.php", f).addCallback( updatePolyline );
	 }
	 
	 BitMap.Edit.prototype.removePolyline = function(f){
			this.editSetId = f.set_id.value;
			this.editPolylineId = f.polyline_id.value;
	 		var str = "edit_polyline.php?set_id=" + this.editSetId + "&polyline_id=" + f.polyline_id.value + "&remove_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolyline );
	 }

	 BitMap.Edit.prototype.expungePolyline = function(f){
			this.editSetId = f.set_id.value;
			this.editPolylineId = f.polyline_id.value;
	 		var str = "edit_polyline.php?polyline_id=" + f.polyline_id.value + "&expunge_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolyline );
	 }	 
	 
	 BitMap.Edit.prototype.storeNewPolylineSet = function(f){
			this.canceledit('editerror');
	 		var str = "edit_polylineset.php?" + queryString(f) + "&set_type=polylines" + "&gmap_id=" + this.Map.id;
			doSimpleXMLHttpRequest(str).addCallback( addPolylineSet );
	 }

	 BitMap.Edit.prototype.storePolylineSet = function(f){
			this.editSetId = f.set_id.value;
			this.editObjectN = f.set_array_n.value;
	 		var str = "edit_polylineset.php?" + queryString(f) + "&gmap_id=" + this.Map.id + "&save_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updatePolylineSet );
	 }

	 BitMap.Edit.prototype.removePolylineSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolylineSet );
	 }
	 
	 BitMap.Edit.prototype.expungePolylineSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&expunge_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolylineSet );
	 }

	 BitMap.Edit.prototype.storeNewPolylineStyle = function(f){
	 		var str = "edit_polylinestyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addPolylineStyle ); 
	 }

	 BitMap.Edit.prototype.storePolylineStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_polylinestyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updatePolylineStyle ); 
	 }
	 
	 BitMap.Edit.prototype.storeNewPolygon = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polygon.php?" + queryString(f) + "&save_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( addPolygon );
	 }
	 
	 BitMap.Edit.prototype.storePolygon = function(f){
			this.editObjectN = f.polygon_array_n.value;
			doSimpleXMLHttpRequest("edit_polygon.php", f).addCallback( updatePolygon );
	 }
	 
	 BitMap.Edit.prototype.removePolygon = function(f){
			this.editSetId = f.set_id.value;
			this.editPolygonId = f.polygon_id.value;
	 		var str = "edit_polygon.php?set_id=" + this.editSetId + "&polygon_id=" + f.polygon_id.value + "&remove_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygon );
	 }

	 BitMap.Edit.prototype.expungePolygon = function(f){
			this.editSetId = f.set_id.value;
			this.editPolygonId = f.polygon_id.value;
	 		var str = "edit_polygon.php?polygon_id=" + f.polygon_id.value + "&expunge_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygon );
	 }	 
	 
	 BitMap.Edit.prototype.storeNewPolygonSet = function(f){
			this.canceledit('editerror');
	 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
			doSimpleXMLHttpRequest(str).addCallback( addPolygonSet );
	 }

	 BitMap.Edit.prototype.storePolygonSet = function(f){
			this.editSetId = f.set_id.value;
			this.editObjectN = f.set_array_n.value;
	 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + this.Map.id + "&save_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( updatePolygonSet );
	 }

	 BitMap.Edit.prototype.removePolygonSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygonSet );
	 }
	 
	 BitMap.Edit.prototype.expungePolygonSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&expunge_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( updateRemovePolygonSet );
	 }

	 BitMap.Edit.prototype.storeNewPolygonStyle = function(f){
	 		var str = "edit_polygonstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( addPolygonStyle ); 
	 }

	 BitMap.Edit.prototype.storePolygonStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_polygonstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( updatePolygonStyle ); 
	 }








	 
	 
	 
	 
	 
	 
	 





	 

/*******************
 *
 * POST XML Map Functions
 *
 *******************/	 
	 
	 BitMap.Edit.prototype.updateMap = function(rslt){
      var xml = rslt.responseXML;
			
	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('gmap_id');
			this.Map.id = id[0].firstChild.nodeValue;			
 			var t = xml.documentElement.getElementsByTagName('title');
			this.Map.title = t[0].firstChild.nodeValue;
			var d = xml.documentElement.getElementsByTagName('desc');
			this.Map.description = d[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('data');
			var data = dt[0].firstChild.nodeValue;
	 		this.Map.data = data;
			var pdt = xml.documentElement.getElementsByTagName('parsed_data');
			var parsed_data = pdt[0].firstChild.nodeValue;
	 		this.Map.parsed_data = parsed_data;
			var w = xml.documentElement.getElementsByTagName('w');
			this.Map.width = w[0].firstChild.nodeValue;
			var h = xml.documentElement.getElementsByTagName('h');
			this.Map.height = h[0].firstChild.nodeValue;			
			var lt = xml.documentElement.getElementsByTagName('lat');
			this.Map.lat = parseFloat(lt[0].firstChild.nodeValue);
			var ln = xml.documentElement.getElementsByTagName('lon');
			this.Map.lng = parseFloat(ln[0].firstChild.nodeValue);
			var z = xml.documentElement.getElementsByTagName('z');
			this.Map.zoom = parseInt(z[0].firstChild.nodeValue);
			var ss = xml.documentElement.getElementsByTagName('scale');
			this.Map.scale = ss[0].firstChild.nodeValue;
			var sc = xml.documentElement.getElementsByTagName('cont');
			this.Map.zoom_control = sc[0].firstChild.nodeValue;
			var sm = xml.documentElement.getElementsByTagName('typecon');
			this.Map.type_control = sm[0].firstChild.nodeValue;
			var oc = xml.documentElement.getElementsByTagName('overviewcont');
			this.Map.overview_control = oc[0].firstChild.nodeValue;
			var mt = xml.documentElement.getElementsByTagName('maptype');
			this.Map.maptype = this.Map.Maptypes[mt[0].firstChild.nodeValue];			

			//replace everything	
      var maptile = $('mymaptitle');
      if (maptile){maptile.innerHTML=this.Map.title;}

      var mapdesc = $('mymapdesc');
      if (mapdesc){mapdesc.innerHTML=this.Map.description;}

      $('mapcontent').innerHTML = this.Map.parsed_data;

      var mapdiv = $('map');
			if (this.Map.width !== '0' && this.Map.width !== 0){
			   var newWidth = this.Map.width + "px";
				}else{
			   var newWidth = 'auto';
				}
			if (this.Map.height !== '0' && this.Map.height !== 0){
			   var newHeight = this.Map.height + "px";
				}else{
			   var newHeight = 'auto';
				}
      if (mapdiv){mapdiv.style.width=newWidth; mapdiv.style.height=newHeight; map.onResize();}
			
			this.Map.map.setMapType(this.Map.maptype);
			
      //Add Map TYPE controls - buttons in the upper right corner
  		if (this.Map.type_control == 'TRUE'){
  		this.Map.map.removeControl(typecontrols);
  		this.Map.map.addControl(typecontrols);
  		}else{
  		this.Map.map.removeControl(typecontrols);
  		}
  		
  		//Add Scale controls
  		if (this.Map.scale == 'TRUE'){
  		this.Map.map.removeControl(scale);
  		this.Map.map.addControl(scale);
  		}else{
  		this.Map.map.removeControl(scale);
  		}
  		
      //Add Navigation controls - buttons in the upper left corner		
  		this.Map.map.removeControl(smallcontrols);
  		this.Map.map.removeControl(largecontrols);
  		this.Map.map.removeControl(zoomcontrols);
  		if (this.Map.zoom_control == 's') {
  		this.Map.map.addControl(smallcontrols);
  		}else if (bMapControl == 'l') {
  		this.Map.map.addControl(largecontrols);		
  		}else if (bMapControl == 'z') {
  		this.Map.map.addControl(zoomcontrols);
  		}
			
			this.Map.map.setCenter(new GLatLng(this.Map.lat, this.Map.lng), this.Map.zoom);
			
			this.editMap();
	 }



	 BitMap.Edit.prototype.addMapType = function(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new maptype in the data array
			var n = this.Map.Maptypes.length;
			this.Map.Maptypes[n] = new Array();
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		this.Map.Maptypes[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		this.Map.Maptypes[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		this.Map.Maptypes[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		this.Map.Maptypes[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		this.Map.Maptypes[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		this.Map.Maptypes[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		this.Map.Maptypes[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		this.Map.Maptypes[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		this.Map.Maptypes[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		this.Map.Maptypes[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		this.Map.Maptypes[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		this.Map.Maptypes[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
			
			this.Map.Maptypes[n].maptype_node = this.Map.map.mapTypes.length;
			
			// attach the new map type to the map
			var baseid = this.Map.Maptypes[n].basetype;
			var typeid = this.Map.Maptypes[n].maptype_id;
			var typename = this.Map.Maptypes[n].name;
			var result = copy_obj( this.Map.map.mapTypes[baseid] );

			result.baseUrls = new Array();
			result.baseUrls[0] = this.Map.Maptypes[n].maptiles_url;
			result.typename = this.Map.Maptypes[n].name;
			result.getLinkText = function() { return this.typename; };
			this.Map.map.mapTypes[this.Map.map.mapTypes.length] = result;
			this.Map.Maptypes[typename] = result;
			
			// set the map type to active
			this.Map.map.setMapType(this.Map.Maptypes[typename]);

			// update the controls
  		this.Map.map.removeControl(typecontrols);
  		this.Map.map.addControl(typecontrols);

			// clear the form
			$('maptypeform_new').reset();
			// update the sets menus
			this.editMapTypes();
	 }



	 
	 BitMap.Edit.prototype.updateMapType = function(rslt){
      var xml = rslt.responseXML;

			var n = this.editObjectN;

			//clear maptype in this location from the Map array of Types
			this.Map.Maptypes[this.Map.Maptypes[n].name] = null;
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		this.Map.Maptypes[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		this.Map.Maptypes[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		this.Map.Maptypes[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		this.Map.Maptypes[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		this.Map.Maptypes[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		this.Map.Maptypes[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		this.Map.Maptypes[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		this.Map.Maptypes[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		this.Map.Maptypes[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		this.Map.Maptypes[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		this.Map.Maptypes[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		this.Map.Maptypes[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
						
			var p = this.Map.Maptypes[n].maptype_node;

			// attach the new map type to the map
			var baseid = this.Map.Maptypes[n].basetype;
			var typeid = this.Map.Maptypes[n].maptype_id;
			var typename = this.Map.Maptypes[n].name;
			var result = copy_obj( this.Map.map.mapTypes[baseid] );
			result.baseUrls = new Array();
			result.baseUrls[0] = this.Map.Maptypes[n].maptiles_url;
			result.typename = this.Map.Maptypes[n].name;
			result.getLinkText = function() { return this.typename; };
			this.Map.map.mapTypes[p] = result;
			this.Map.Maptypes[typename] = result;
			
			// set the map type to active
			this.Map.map.setMapType( this.Map.Maptypes[this.Map.Maptypes[n].name] );
	 }


	 
	 BitMap.Edit.prototype.updateRemoveMapType = function(rslt){
			var n = this.editObjectN;
			
			// get maptype node value
			var p = this.Map.Maptypes[n].maptype_node;
			
			// remove the maptype ref form the map array of types
			this.Map.Maptypes[this.Map.Maptypes[n].name] = null;
			
			// remove the controls
  		this.Map.map.removeControl(typecontrols);
			
			// remove it from the map			
			this.Map.map.mapTypes.splice(p, 1);
			
			// add the controls
  		this.Map.map.addControl(typecontrols);
			
			// @todo we should first check if the map is on display, and then if so flip to street
			// we flip to street mode
			this.Map.map.setMapType(this.Map.map.mapTypes[0]);
			
	 		// remove by id the maptype form
    		for (var j=0; j<this.Map.Maptypes.length; j++){
      			if ( ( this.Map.Maptypes[j] != null ) && ( this.Map.Maptypes[j].maptype_id == this.editSetId ) ){
          		var getElem = "editmaptypetable_" + this.Map.Maptypes[j].maptype_id;
          		if ( $(getElem) ) {
              	var extraMapTypeForm = $(getElem);
          			$('editmaptypeform').removeChild(extraMapTypeForm);
          		}
							this.Map.Maptypes[n].maptype_id = null;
      				this.Map.Maptypes[n] = null;
							
      			}
    		}			

				
	 }
	 
	 
	 
	 
/*******************
 *
 * POST XML Marker Functions
 *
 *******************/	 

BitMap.Edit.prototype.addMarker = function(rslt){
      var xml = rslt.responseXML;

	 		//the marker data we are changing
			var n = this.Map.Markers.length;
			this.Map.Markers[n] = new Array();
			var m = this.Map.Markers[n];

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
			for(a=0; a<this.Map.MarkerSets.length; a++){
				if ( ( this.Map.MarkerSets[a] != null ) && ( this.Map.MarkerSets[a].set_id == this.editSetId ) ){
					s = a;
				}
			};

			m.set_id = this.Map.MarkerSets[s].set_id;
			m.style_id = this.Map.MarkerSets[s].style_id;
			m.icon_id = this.Map.MarkerSets[s].icon_id;
			m.plot_on_load = this.Map.MarkerSets[s].plot_on_load;
			m.side_panel = this.Map.MarkerSets[s].side_panel;
			m.explode = this.Map.MarkerSets[s].explode;
			m.array_n = parseInt(n);

        //make the marker
			this.Map.attachMarker(n, true);
			// clear the form
			$('markerform_new').reset();
			this.removeAssistant();
			// update the sets menus
			this.editMarkers();
			this.editSet(editSetId);
}

	 	 
BitMap.Edit.prototype.updateMarker = function(rslt){
      var xml = rslt.responseXML;
						
	 		//the marker data we are changing
			var n = this.editObjectN;
			var m = this.Map.Markers[n];

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
      this.Map.map.removeOverlay( m.marker );
        //remake the marker
			this.Map.attachMarker(n, true);
			//remove the assistant
			this.removeAssistant();
}


	 

BitMap.Edit.prototype.addMarkerSet = function(rslt){
      var xml = rslt.responseXML;

			//@todo modify this to handle either this.Map.Markers or bSMData sets
			var n = this.Map.MarkerSets.length;
			this.Map.MarkerSets[n] = new Array();
			var s= this.Map.MarkerSets[n];
						
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
			if ( $('newmarkerform').style.display == "block" ){ this.newMarker(); };
			this.editMarkers();
}
	


BitMap.Edit.prototype.updateMarkerSet = function(rslt){
      var xml = rslt.responseXML;

			var s = this.Map.MarkerSets[this.editObjectN];
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
				a = this.Map.Markers;
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
         				this.Map.map.removeOverlay( a[n].marker );
    						//define marker
								this.Map.attachMarker(n);
       					}
       				}
       			}
       		}
			};

			// update the sets menus
			this.editMarkers();
}


//this needs special attention
BitMap.Edit.prototype.updateRemoveMarker = function(){
		for (var n=0; n<this.Map.Markers.length; n++){
			if ( ( this.Map.Markers[n] != null ) && ( this.Map.Markers[n].marker_id == this.editMarkerId ) ){
				this.Map.map.removeOverlay(this.Map.Markers[n].marker);
				this.Map.Markers[n].marker = null;
				this.Map.Markers[n] = null;
			}
		}
		this.editMarkers();
		this.editSet(editSetId);
}



BitMap.Edit.prototype.updateRemoveMarkerSet = function(){
  	for (var n=0; n<this.Map.Markers.length; n++){
  		if ( ( this.Map.Markers[n] != null ) && ( this.Map.Markers[n].set_id == this.editSetId ) && ( this.Map.Markers[n].marker != null ) ){
				this.Map.map.removeOverlay(this.Map.Markers[n].marker); 			
				this.Map.Markers[n].marker = null;
				this.Map.Markers[n] = null;
  		}
  	}
		for (var s=0; s<this.Map.MarkerSets.length; s++){
  		if ( ( this.Map.MarkerSets[s] != null ) && ( this.Map.MarkerSets[s].set_id == this.editSetId ) ){
      		var getElem = "markerset_"+this.Map.MarkerSets[s].set_id;
      		if ( $(getElem) ) {
         		var extraMarkerForm = $(getElem);
      			$('editmarkerform').removeChild(extraMarkerForm);
      		}
				this.Map.MarkerSets[s].set_id = null;
  			this.Map.MarkerSets[s] = null;
  		}
		}
		this.editMarkers();
}
	


BitMap.Edit.prototype.addMarkerStyle = function(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new markerstyle in the data array
			var n = this.Map.MarkerStyles.length;
			this.Map.MarkerStyles[n] = new Array();
			var s = this.Map.MarkerStyles[n];

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
			this.editMarkerStyles();
			this.editMarkers();
}



BitMap.Edit.prototype.updateMarkerStyle = function(rslt){
      var xml = rslt.responseXML;

			//get the style we are updating
			var s = this.Map.MarkerStyles[editObjectN];
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
      	var a = this.Map.Markers;
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null && a[n].marker != null && a[n].style_id == s.style_id && s.marker_style_type != oldtp){
	      			//unload the marker
  					this.map.removeOverlay( a[n].marker );
	      			//define new marker with new styles
						this.attachMarker(n);
					}
				}
			}
			this.editMarkerStyles();
			this.editMarkers();
}

	



BitMap.Edit.prototype.addIconStyle = function(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new iconstyle in the data array
			var n = this.Map.IconStyles.length;
			this.Map.IconStyles[n] = new Array();
			var i = this.Map.IconStyles[n];

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
  			this.Map.defineGIcon(n);
  		}

			// clear the form
			$('iconstyleform_new').reset();
			// update the styles menus
			this.editMarkers();
			this.editIconStyles();
}


	
BitMap.Edit.prototype.updateIconStyle = function(rslt){
      var xml = rslt.responseXML;

			//get the style we are updating
			var i = this.Map.IconStyles[editObjectN];

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
  			this.Map.defineGIcon(editObjectN);
  		}

			//update all markers
      	var a = this.Map.Markers;
    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null && a[n].marker != null && a[n].icon_id == i.icon_id){
	      			//unload the marker
  					this.Map.map.removeOverlay( a[n].marker );
						//define the marker
						this.attachMarker(n);
					}
    		}
			}
}









	
/*******************
 *
 * POST XML Polyline Functions
 *
 *******************/	 

BitMap.Edit.prototype.addPolyline = function(rslt){
      var xml = rslt.responseXML;
	 		var s;

			//this is such a crappy way to get this number
			for(var a=0; a<this.Map.PolylineSets.length; a++){
				if (this.Map.PolylineSets[a] != null && this.Map.PolylineSets[a].set_id == this.editSetId){
					s = a;
				}
			};

  		var n = this.Map.Polylines.length;
  		this.Map.Polylines[n] = new Array();
			var p = this.Map.Polylines[n];
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
			
			p.set_id = this.Map.PolylineSets[s].set_id;
			p.style_id = this.Map.PolylineSets[s].style_id;
			p.plot_on_load = this.Map.PolylineSets[s].plot_on_load;
			p.side_panel = this.Map.PolylineSets[s].side_panel;
			p.explode = this.Map.PolylineSets[s].explode;
			p.array_n = parseInt(n);

			//create polyline
			this.Map.attachPolyline(n);

			// clear the form
			$('polylineform_new').reset();
			// update the sets menus
			this.editPolylines();
			this.editPolylineSet(this.editSetId);
			this.removeAssistant();
}	




BitMap.Edit.prototype.updatePolyline = function(rslt){
			var xml = rslt.responseXML;
			var n = editObjectN;
			var p = this.Map.Polylines[n];
			
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
			this.Map.map.removeOverlay(p.polyline);
			//create polyline
			this.Map.attachPolyline(n);

			this.removeAssistant();
}


	
	 BitMap.Edit.prototype.addPolylineSet = function(rslt){
      var xml = rslt.responseXML;

			//@todo modify this to handle either this.Map.Polylines or bSLData sets
			var n = this.Map.PolylineSets.length;
			this.Map.PolylineSets[n] = new Array();
			var s = this.Map.PolylineSets[n];
 						
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
			if ( $('newpolylineform').style.display == "block" ){ this.newPolyline(); };
			this.editPolylines();
	 }




	BitMap.Edit.prototype.updatePolylineSet = function(rslt){
      var xml = rslt.responseXML;

			var s = this.Map.PolylineSets[editObjectN];
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
				a = this.Map.Polylines;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(n=0; n<a.length; n++){
             		//if the array item is not Null
						if (a[n]!= null && a[n].polyline != null && a[n].set_id == s.set_id){
							a[n].style_id = s.style_id;
							//unload the polyline
         				this.Map.map.removeOverlay( a[n].polyline );
                 		//create polyline
							this.attachPolyline(n);
       				}
       			}
       		}
			};

			// update the sets menus
			this.editPolylines();
	}
	



	 BitMap.Edit.prototype.addPolylineStyle = function(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new polylinestyle in the data array
			var n = this.Map.PolylineStyles.length;
			this.Map.PolylineStyles[n] = new Array();
			var s = this.Map.PolylineStyles[n];

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
			this.editPolylines();
			this.editPolylineStyles();
	 }



	 BitMap.Edit.prototype.updatePolylineStyle = function(rslt){
      var xml = rslt.responseXML;

			//get the style we are updating
			var s = this.Map.PolylineStyles[editObjectN];

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
      	var a = this.Map.Polylines;
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
        		if (a[n]!= null && a[n].polyline != null && a[n].style_id == s.style_id){
						this.Map.map.removeOverlay( a[n].polyline );
        		this.Map.attachPolyline(n);
    			}
    		}
    	}

			//for each polygon
      	var b = this.Map.Polygons;
    	//if the length of the array is > 0
    	if (b.length > 0){
      	//loop through the array
    		for(i=0; i<b.length; i++){
      		//if the array item is not Null
        		if (b[i]!= null && b[i].polygon != null && b[i].style_id == s.style_id){
						this.Map.map.removeOverlay( b[i].polygon );
        			this.Map.attachPolygon(i);
    			}
    		}
    	}

			// update the polyline menus
			this.editPolylineStyles();
			this.editPolylines();
	 }



	
BitMap.Edit.prototype.updateRemovePolyline = function(){
	for (var i=0; i<this.Map.Polylines.length; i++){
		if ( Map.Polylines[i] != null && this.Map.Polylines[n].polyline != null && this.Map.Polylines[i].polyline_id == this.editPolylineId ){
			this.Map.map.removeOverlay(this.Map.Polylines[i].polyline);
			this.Map.Polylines[i].polyline = null;
			this.Map.Polylines[i] = null;
		}
	}
	this.editPolylines();
	this.editPolylineSet(editSetId);
}



//this needs special attention
BitMap.Edit.prototype.updateRemovePolylineSet = function(){
  	for (var n=0; n<this.Map.Polylines.length; n++){
  		if ( ( this.Map.Polylines[n] != null ) && ( this.Map.Polylines[n].set_id == this.editSetId ) && ( this.Map.Polylines[n].polyline != null ) ){
  			this.Map.map.removeOverlay(Map.Polylines[n].polyline);
				this.Map.Polylines[n].polyline = null;
  			this.Map.Polylines[n] = null;
  		}
  	}
		for (var s=0; s<Map.PolylineSets.length; s++){
  		if ( ( this.Map.PolylineSets[s] != null ) && ( this.Map.PolylineSets[s].set_id == this.editSetId ) ){
      		var getElem = "polylineset_"+this.Map.PolylineSets[s].set_id;
      		if ( $(getElem) ) {
          		var extraPolylineForm = $(getElem);
      			$('editpolylineform').removeChild(extraPolylineForm);
      		}
				this.Map.PolylineSets[s].set_id = null;
  			this.Map.PolylineSets[s] = null;
  		}
		}
}






/*******************
 *
 * POST XML Polygon Functions
 *
 *******************/	 

BitMap.Edit.prototype.addPolygon = function(rslt){
      var xml = rslt.responseXML;
	 		var s;

			for(var a=0; a<this.Map.PolygonSets.length; a++){
				if ( this.Map.PolygonSets[a] != null && this.Map.PolygonSets[a].set_id == this.editSetId ){
					s = a;
				}
			};

  		var n = this.Map.Polygons.length;
  		this.Map.Polygons[n] = new Array();
			var p = this.Map.Polygons[n];
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

			p.set_id = this.Map.PolygonSets[s].set_id;
			p.style_id = this.Map.PolygonSets[s].style_id;
			p.polylinestyle_id = this.Map.PolygonSets[s].polylinestyle_id;
			p.plot_on_load = this.Map.PolygonSets[s].plot_on_load;
			p.side_panel = this.Map.PolygonSets[s].side_panel;
			p.explode = this.Map.PolygonSets[s].explode;
			p.array_n = parseInt(n);

			//create polygon
			this.Map.attachPolygon(n);

			// clear the form
			$('polygonform_new').reset();
			// update the sets menus
			this.editPolygons();
			this.editPolygonSet(editSetId);
			this.removeAssistant();
}	



BitMap.Edit.prototype.updatePolygon = function(rslt){
			var xml = rslt.responseXML;
			var n = this.editObjectN;
			var p = this.Map.Polygons[n];
			
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
			this.Map.map.removeOverlay(p.polygon);
			//create polygon
			this.Map.attachPolygon(n);

			this.removeAssistant();
}




BitMap.Edit.prototype.addPolygonSet = function(rslt){
      var xml = rslt.responseXML;

			//@todo modify this to handle either Map.Polylines or bSLData sets
			var n = this.Map.PolygonSets.length;
			this.Map.PolygonSets[n] = new Array();
			var s = this.Map.PolygonSets[n];			
			
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
			if ( $('newpolygonform').style.display == "block" ){ this.newPolygon(); };
			this.editPolygons();
}




BitMap.Edit.prototype.updatePolygonSet = function(rslt){
      var xml = rslt.responseXML;

			var s = this.Map.PolygonSets[this.editObjectN];
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
				a = this.Map.Polygons;
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
         				this.Map.map.removeOverlay( a[n].polygon );
                 		//create polygon
							this.Map.attachPolygon(n);
       				}
       			}
       		}
			};
			// update the sets menus
			this.editPolygons();
}



BitMap.Edit.prototype.addPolygonStyle = function(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new polygonstyle in the data array
			var n = this.Map.PolygonStyles.length;
			this.Map.PolygonStyles[n] = new Array();
			var s = this.Map.PolygonStyles[n];

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
			this.editPolygonStyles();
			this.editPolygons();
}



BitMap.Edit.prototype.updatePolygonStyle = function(rslt){
      var xml = rslt.responseXML;

			//get the style we are updating
			var s = this.Map.PolygonStyles[editObjectN];

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
      	var a = this.Map.Polygons;    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(n=0; n<a.length; n++){
      		//if the array item is not Null
    			if (a[n]!= null && a[n].polygon != null && a[n].style_id == s.style_id){
						this.Map.map.removeOverlay(a[n].polygon);
						this.Map.attachPolygon(n);
    			}
    		}
    	}

			// update the styles menus
			this.editPolygonStyles();
			this.editPolygons();
}



BitMap.Edit.prototype.updateRemovePolygon = function(){
	for (var n=0; n<this.Map.Polygons.length; n++){
		if ( this.Map.Polygons[n] != null && this.Map.Polygons[n].polygon != null && this.Map.Polygons[n].polygon_id == this.editPolygonId ){
			this.Map.map.removeOverlay(this.Map.Polygons[n].polygon);
			this.Map.Polygons[n].polygon = null;
			this.Map.Polygons[n] = null;
		}
	}
	this.editPolygons();
	this.editPolygonSet(this.editSetId);
}


BitMap.Edit.prototype.updateRemovePolygonSet = function(){
	for (var n=0; n<this.Map.Polygons.length; n++){
		if ( this.Map.Polygons[n] != null && this.Map.Polygons[n].polygon != null && this.Map.Polygons[n].set_id == this.editSetId ){
			this.Map.map.removeOverlay(this.Map.Polygons[n].polygon);
			this.Map.Polygons[n].polygon = null;
			this.Map.Polygons[n] = null;
		}
	}
	for (var s=0; s<Map.PolygonSets.length; s++){
		if ( ( this.Map.PolygonSets[s] != null ) && ( this.Map.PolygonSets[s].set_id == this.editSetId ) ){
			var getElem = "polygonset_"+this.Map.PolygonSets[s].set_id;
			if ( $(getElem) ) {
				var extraPolygonForm = $(getElem);
				$('editpolygonform').removeChild(extraPolygonForm);
			}
			this.Map.PolygonSets[s].set_id = null;
			this.Map.PolygonSets[s] = null;
  	}
	}
}





	
/******************
 *
 *  Editing Tools
 *
 ******************/

BitMap.Edit.prototype.addAssistant = function(a, b){
 	this.removeAssistant();
 	if (a == 'polyline'){
		this.bModForm = $('polylineform_'+b);
 		this.bModPData = this.bModForm.points_data; 
		alert ('Polyline drawing assistant activated for '+ this.bModForm.name.value + ' polyline. \n Click to Draw!');
		
		this.bLastpoint = null;
	  this.bTempPoints = [];
  	this.bTP = new GPolyline(this.bTempPoints);
  	this.Map.map.addOverlay(bTP);		//create polyline object from points and add to map
  
  	this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay,point) {
                		if(this.bLastpoint && this.bLastpoint.x==point.x && this.bLastpoint.y==point.y) return;
                		this.bLastpoint = point;
                		
                		this.bTempPoints.push(point);
                		this.Map.map.removeOverlay(bTP);
                		this.bTP = new GPolyline(this.bTempPoints);
                		this.Map.map.addOverlay(bTP);

                		for(var i=0; i<this.bTempPoints.length; i++){
											if (i == 0){
												msg = this.bTempPoints[i].x + ', ' + this.bTempPoints[i].y;
												}else{
                				msg += ', ' + this.bTempPoints[i].x + ', ' + this.bTempPoints[i].y;
											}
                		}
										
                		this.bModPData.value = msg;
              	});
	}

 	if (a == 'polygon'){
		this.bModForm = $('polygonform_'+b);

  	if (this.bModForm.circle.options[this.bModForm.circle.selectedIndex].value == 'true'){
      	this.bModPData = this.bModForm.circle_center;
     	alert ('Circle-Center drawing assistant activated for '+ this.bModForm.name.value + ' polygon. \n Click to marker the center of your circle!');
     
       	this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay, point){
                      if (point) {
                     		this.Map.map.panTo(point);
                     		this.bModPData.value = point.lng() + ", " + point.lat();
                         }
                       });
  	}else{
   		this.bModPData = this.bModForm.points_data; 
  		alert ('Polygon drawing assistant activated for '+ this.bModForm.name.value + ' polygon. \n Click to draw the outline. \n\nThe final connection will automatically be \ncompleted for you, so don\'t worry about that.');
   		this.bLastpoint = null;
   	 	this.bTempPoints = [];
     	this.bTP = new GPolyline(this.bTempPoints);
     	this.Map.map.addOverlay(bTP);		//create polyline object from points and add to map
     
     	this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay,point) {
                		if(this.bLastpoint && this.bLastpoint.x==point.x && this.bLastpoint.y==point.y) return;
                		this.bLastpoint = point;
                		
                		this.bTempPoints.push(point);
                		this.Map.map.removeOverlay(this.bTP);
                		this.bTP = new GPolyline(this.bTempPoints);
                		this.Map.map.addOverlay(this.bTP);

                		for(var i=0; i<this.bTempPoints.length; i++){
								if (i == 0){
									msg = this.bTempPoints[i].x + ', ' + this.bTempPoints[i].y;
								}else{
                				msg += ', ' + this.bTempPoints[i].x + ', ' + this.bTempPoints[i].y;
								}
                		}
										
                		this.bModPData.value = msg;
              	});
		}
	}
	
	if (a == 'marker'){
		this.bModForm = $('markerform_'+b);
 		this.bModMLat = this.bModForm.marker_lat;
 		this.bModMLng = this.bModForm.marker_lng;
		alert ('Marker ploting assistant activated for '+ this.bModForm.title.value + ' marker. \n Click to Position!');
	
  	this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay, point){
      if (point) {
  		if (this.bTP != null) {
        	this.Map.map.removeOverlay(this.bTP);
  		}
  		this.bTP = new GMarker(point);
  		this.Map.map.addOverlay(this.bTP);
  		this.Map.map.panTo(point);
  		this.bModMLat.value = point.lat();
  		this.bModMLng.value = point.lng();
      }
    });
	}

	if (a == 'map'){
		f = $('mapform');
		alert ('Map centering assistant activated. \n Click to get center lat and lon values!');
	
  	this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay, point){
      if (point) {
  		this.Map.map.panTo(point);
  		f.map_lng.value = point.lng();
  		f.map_lat.value = point.lat();
      }
    });
	}

}	

	
BitMap.Edit.prototype.removeAssistant = function(){
   if (this.bAssistant != null){
      this.Map.map.removeOverlay(this.bTP);
   		GEvent.removeListener(this.bAssistant);
  		this.bAssistant = null;
	 }
 } 
