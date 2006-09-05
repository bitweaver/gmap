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

//DELETE THIS SHIT WHEN DONE TESTING

  this.Map.markersets[0]={name:"steve", set_id:1};
  this.Map.markers[0]={title:"some shit", set_id:1, marker_type:0, marker_id:1, lat: 40.90234, lng:-32.0345345, data:"soma oms da body text", label_data:"my lable", photo_url:"no photo, thanks"};
  this.Map.markers[1]={title:"other stuff", set_id:1, marker_type:0, marker_id:2, lat: 41.22234, lng:-42.0345345, data:"aslkjd lkj body text", label_data:"my lable", photo_url:"no photo, thanks"};
  this.Map.markers[2]={title:"bla bla bl", set_id:1, marker_type:1, marker_id:3, lat: 22.90234, lng:-52.0345345, data:"helol helool o asd text", label_data:"my lable", photo_url:"no photo, thanks"};

  this.Map.markersets[1]={name:"chris", set_id:2};
  this.Map.markers[3]={title:"cookies", set_id:2, marker_type:0, marker_id:4, lat: 68.90234, lng:-35.0345345, data:"some body text", label_data:"my lable", photo_url:"no photo, thanks"};
  this.Map.markers[4]={title:"milk", set_id:2, marker_type:1, marker_id:5, lat: 44.22234, lng:-46.0345345, data:"milky milky body text", label_data:"my lable", photo_url:"no photo, thanks"};
  this.Map.markers[5]={title:"napkin", set_id:2, marker_type:0, marker_id:6, lat: 23.90234, lng:-55.0345345, data:"napskin flk asd text", label_data:"my lable", photo_url:"no photo, thanks"};
  
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
	
  var form = $('edit-map-form');
	form.reset();
	BitMap.show('edit-map-table');

  form.gmap_id.value = this.Map.id? this.Map.id:"";
  form.title.value = this.Map.title?this.Map.title:"";
  form.map_desc.value = this.Map.description?this.Map.description:"";
  form.map_w.value = this.Map.width;
  form.map_h.value = this.Map.height;
  form['geo[lat]'].value = this.Map.center.lat;
  form['geo[lng]'].value = this.Map.center.lng;
  form.map_z.value = this.Map.zoom;
	form.edit.value = this.Map.data?this.Map.data:"";

  for (var i=0; i < 4; i++) {
    if (form.map_showcont.options[i].value == this.Map.zoom_control){
      form.map_showcont.options[i].selected=true;
    }
  }

  for (var i=0; i < 2; i++) {
    if (form.map_showscale.options[i].value == this.Map.scale){
      form.map_showscale.options[i].selected=true;
    }
  }
					
  for (var i=0; i < 2; i++) {
    if (form.map_showtypecont.options[i].value == this.Map.type_control){
       form.map_showtypecont.options[i].selected=true;
    }
  }
					
  var mapTypeRoot = form.map_type;

	var mapTypeCount = 2;

	if (typeof(this.Map.maptypes) != 'undefined'){
		mapTypeCount += this.Map.maptypes.length;
		var newMaptype = mapTypeRoot.options[0].cloneNode(false);
		for (i=0; i<this.Map.maptypes.length; i++){
      mapTypeRoot.appendChild(newMaptype);
      mapTypeRoot.options[i+3].value = this.Map.maptypes[i].maptype_id;
      mapTypeRoot.options[i+3].text = this.Map.maptypes[i].name;
		}
	}
						
  for (var i=0; i<mapTypeCount; i++) {
    if (form.map_type.options[i].value == this.Map.maptype){
      form.map_type.options[i].selected=true;
    }
  }
									
  /*@todo create value for comments
	  form.map_comm.value = ?; for type="checkbox
	*/
};

BitMap.Edit.prototype.editMaptypes = function(){
  var table = $('edit-maptypes-table');
  var linksList = table.getElementsByTagName("ul").item(0);
  var links = table.getElementsByTagName("li");
  //Clear all the existing maptypes listed  
  //We leave the first two, the first is the model we clone, the second if for a new maptype
  var count = links.length;
  for (n=count-1; n>1; n--){
    linksList.removeChild(links.item(n));
  }  
  //For each maptype add a link
  count = this.Map.maptypes.length;
  if (count > 0){
    var firstselected = false;
    for (var n=0; n<count; n++) {
      var m = this.Map.maptypes[n];
  		  var newLI = links.item(0).cloneNode(true);
        newLI.id = 'edit-maptypelink-'+n;
  		  var newLink = newLI.getElementsByTagName("a").item(0);
        newLink.href = "javascript:BitMap.EditSession.editMaptype("+n+")";
        newLink.innerHTML = m.title;
        linksList.appendChild(newMarkerLI);
  		  newLI.style.display = "block";
  			
  			if (firstselected != true){
  			  this.editMaptype(n);
  			  firstselected = true;
  			}
    }
  }else{
    this.newMaptype();
  }
  //We assume it is not visible and make it so
  BitMap.show('edit-maptypes-table')
};


BitMap.Edit.prototype.newMaptype = function(){
  var count = this.Map.maptypes.length;
  for (n=0; n<count; n++){
    if($('edit-maptypelink-'+n)){
    BitMap.jscss('remove', $('edit-maptypelink-'+n), 'edit-select');
    }
  }
  BitMap.jscss('add', $('edit-maptypelink-new'), 'edit-select');
  var form = $('edit-maptype-form');
  form.maptype_id.value = null;
  form.array_n.value = null;
  form.reset();
  BitMap.hide('edit-maptype-actions');  
};


BitMap.Edit.prototype.editMaptype = function(){
  BitMap.jscss('remove', $('edit-maptypelink-new'), 'edit-select');
  var a;
  var count = this.Map.markers.length;
  for (n=0; n<count; n++){
    if($('edit-maptypelink-'+n)){
    a = (n==i)?'add':'remove';
    BitMap.jscss(a, $('edit-maptypelink-'+n), 'edit-select');
    }
  }
  
  var m = this.Map.maptypes[i];
  //change values
  var form = $('edit-maptype-form');
  form.array_n.value = i;
  form.maptype_id.value = m.maptype_id;
  form.name.value = m.name;
  form.description.value = m.description;
  var count = form.basetype.options.length;  
  for (n=0; n<count; n++){
   var option = form.style_id.options[n];
   if (option.value == m.basetype){ option.selected=true; }
  }
  count = form.alttype.options.length;  
  for (n=0; n<count; n++){
   var option = form.alttype.options[n];
   if (option.value == m.basetype){ option.selected=true; }
  }
  form.maptiles_url.value = m.maptiles_url;
  form.lowtiles_url.value = m.lowtiles_url;
  form.copyright.value = m.copyright;
  form.minzoom.value = m.minzoom;
  form.maxzoom.value = m.maxzoom;
  form.bounds.value = m.bounds; 
  
  //update links
  var formLinks = $('edit-maptype-actions').getElementsByTagName("a");
  formLinks.item(0).href = "javascript:alert('feature coming soon')";
  
  BitMap.show('edit-maptype-actions');
};



/*******************
 *
 * MARKER FORM FUNCTIONS
 *
 *******************/

BitMap.Edit.prototype.editMarkerSets = function(){    
	BitMap.show('edit-markers-menu');
  //First check if there are any marker sets
  if (this.Map.markersets.length > 0){
    // We assume editMarkers has been called before and remove 
  	// any previously existing sets from the UI	
  	for (var n=0; n<this.Map.markersets.length; n++) {
  		if (this.Map.markersets[n]!= null){
    		var getElem = "edit-markerset-"+n;
    		if ( $(getElem) ) {
    			$('edit-markersets-table').removeChild($(getElem));
    		}
		}
  	}
    //Add a tool bar for each MarkerSet
    for (var n=0; n<this.Map.markersets.length; n++) {
  		var newMarkerSet = $('edit-markerset').cloneNode(true);
    	newMarkerSet.id = "edit-markerset-"+n;
   		newMarkerSet.getElementsByTagName("span").item(0).innerHTML = this.Map.markersets[n].name;
   		newMarkerSet.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.editMarkerSetOptions("+n+");";
   		newMarkerSet.getElementsByTagName("a").item(1).href = "javascript:BitMap.EditSession.editMarkers("+n+");";
    	$('edit-markersets-table').appendChild(newMarkerSet);
    	BitMap.show('edit-markerset-'+n);
    }
  }else{
	//alert you must create a marker set first
  }
  BitMap.show('edit-markersets-table');
  BitMap.show('edit-markersets-cancel');
}


BitMap.Edit.prototype.cancelEditMarkerSets = function(){
  //rescue our form tables lest we destroy them by accident
  this.canceledit('edit-markers-table');
  var elm = $('edit-markers-table');
  document.body.appendChild(elm);
  this.canceledit('edit-markerset-options-table');
  var elm = $('edit-markerset-options-table');
  document.body.appendChild(elm);
  
  this.canceledit('edit-markers-menu');
  this.canceledit('edit-markersets-table');
  this.canceledit('edit-markersets-cancel');
/*
  this.canceledit('newmarkersetform'); 
  this.canceledit('editmarkerstylesmenu'); 
  this.canceledit('newmarkerstyleform'); 
  this.canceledit('editmarkerstylesform'); 
  this.canceledit('editmarkerstylescancel');
*/
  this.removeAssistant(); 
  this.canceledit('editerror');
}


BitMap.Edit.prototype.newMarkerSet = function(){
  this.cancelEditMarkers();
  var count = this.Map.markersets.length;
  for (n=0; n<count; n++){
    BitMap.jscss('remove', $('edit-markerset-'+n), 'edit-selected');
  }

  if( !$('edit-markerset-new') ){
    var newMarkerSet = $('edit-markerset').cloneNode(true);
    newMarkerSet.id = "edit-markerset-new";
    newMarkerSet.getElementsByTagName("span").item(0).innerHTML = "New Marker Set";
    var tdtags = newMarkerSet.getElementsByTagName("td");
    tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
    $('edit-markers-menu').appendChild(newMarkerSet);
  }
  
  BitMap.jscss('add', $('edit-markerset-new'), 'edit-selected');
  BitMap.hide('edit-markerset-options-actions');
  $('edit-markerset-new').appendChild( $('edit-markerset-options-table') );
  BitMap.show('edit-markerset-new');
  BitMap.show('edit-markerset-options-table');
  
  //customize the form values
  var form = $('edit-markerset-options-form');
  form.reset();
  form.set_id.value = null;
  form.set_array_n.value = null;
  if ( this.Map.markerstyles.length > 0 ){
    var OptionN = form.style_id.options.length;
    for (var d=0; d<this.Map.markerstyles.length; d++){
      if ( this.Map.markerstyles[d] != null ){
	    form.style_id.options[OptionN + d] = new Option( this.Map.markerstyles[d].name, this.Map.markerstyles[d].style_id );
	    if ( this.Map.markerstyles[d].style_id == s.style_id){
	      form.style_id.options[OptionN + d].selected=true;
	    }
      }
  	}
  }
  if ( this.Map.iconstyles.length > 0 ){
    var IconN = form.icon_id.options.length;
  	for (var e=0; e<this.Map.iconstyles.length; e++){
      if ( this.Map.iconstyles[e] != null ){
	    form.icon_id.options[IconN+e] = new Option( this.Map.iconstyles[e].name, this.Map.iconstyles[e].icon_id );
	    if ( this.Map.iconstyles[e].icon_id == s.icon_id){
	      form.icon_id.options[IconN+e].selected=true;
	    }
      }
  	}
  }
}


BitMap.Edit.prototype.cancelNewMarkerSet = function(){
  if( $('edit-markerset-new') ){ BitMap.hide('edit-markerset-new'); }
}


BitMap.Edit.prototype.editMarkerSetOptions = function(i){
  var a;
  var count = this.Map.markersets.length;
  for (n=0; n<count; n++){
    a = (n==i)?'add':'remove';
    BitMap.jscss(a, $('edit-markerset-'+n), 'edit-selected');
  }

  this.cancelNewMarkerSet();
  this.cancelEditMarkers();
  var s = this.Map.markersets[i];
  var optionsTable = $('edit-markerset-options-table');
  var target = $('edit-markerset-'+i);
  target.insertBefore(optionsTable, target.childNodes[2]);  
  BitMap.show('edit-markerset-options-actions');
  BitMap.show('edit-markerset-options-table');
    
  //customize the form values
  var form = $('edit-markerset-options-form');
  form.set_id.value = s.set_id;
  form.set_array_n.value = i;
  form.name.value = s.name;
  if (s.plot_on_load == false){ form.plot_on_load.options[0].selected=true; }else{form.plot_on_load.options[1].selected=true;};
  if (s.side_panel == false){ form.side_panel.options[0].selected=true; }else{form.side_panel.options[1].selected=true;};
  if (s.explode == false){ form.explode.options[0].selected=true }else{form.explode.options[1].selected=true};
  if (s.cluster == false){ form.cluster.options[0].selected=true }else{form.cluster.options[1].selected=true};
  if ( this.Map.markerstyles.length > 0 ){
	var OptionN = form.style_id.options.length;
  	for (var d=0; d<this.Map.markerstyles.length; d++){
      if ( this.Map.markerstyles[d] != null ){
	    form.style_id.options[OptionN + d] = new Option( this.Map.markerstyles[d].name, this.Map.markerstyles[d].style_id );
	    if ( this.Map.markerstyles[d].style_id == s.style_id){
	        form.style_id.options[OptionN + d].selected=true;
	    }
  	  }
  	}
  }
  if ( this.Map.iconstyles.length > 0 ){
    var IconN = form.icon_id.options.length;
  	for (var e=0; e<this.Map.iconstyles.length; e++){
      if ( this.Map.iconstyles[e] != null ){
	    form.icon_id.options[IconN+e] = new Option( this.Map.iconstyles[e].name, this.Map.iconstyles[e].icon_id );
	    if ( this.Map.iconstyles[e].icon_id == s.icon_id){
	      form.icon_id.options[IconN+e].selected=true;
	    }
  	  }
  	}
  }
}


BitMap.Edit.prototype.cancelEditMarkerSetOptions = function(){
  this.cancelNewMarkerSet();
  this.canceledit('edit-markerset-options-table');
  this.canceledit('editerror');
}


BitMap.Edit.prototype.editMarkers = function(i){
  this.cancelNewMarkerSet();
  var a;
  var count = this.Map.markersets.length;
  for (n=0; n<count; n++){
    a = (n==i)?'add':'remove';
    BitMap.jscss(a, $('edit-markerset-'+n), 'edit-selected');
  }

  this.cancelEditMarkerSetOptions();
  var set_id = this.Map.markersets[i].set_id;    
  var markerTable = $('edit-markers-table');
  //Set the markerset toggle tags to closed
  //Set the markerset toggle tags to open on our selected set
  //Move Marker Table to New Set
  $('edit-markerset-'+i).appendChild(markerTable);
  //set some constants
  var markerLinksList = markerTable.getElementsByTagName("ul").item(0);
  var markerLinks = markerTable.getElementsByTagName("li");
  //Clear all the existing markers listed  
  //We leave the first two, the first is the model we clone, the second if for a new marker
  var count = markerLinks.length;
  for (n=count-1; n>1; n--){
    markerLinksList.removeChild(markerLinks.item(n));
  }
  
  $('edit-markerlink-new-a').href = "javascript:BitMap.EditSession.newMarker("+i+");";
  //For each marker in our new set, add a link
  var firstselected = false;
  for (var n=0; n<this.Map.markers.length; n++) {
    var m = this.Map.markers[n];
    if (m.set_id == set_id){
  		var newMarkerli = markerLinks.item(0).cloneNode(true);
      newMarkerli.id = 'edit-markerlink-'+n;
  		var newMarkerLink = newMarkerli.getElementsByTagName("a").item(0);
      newMarkerLink.href = "javascript:BitMap.EditSession.editMarker("+n+")";
      newMarkerLink.innerHTML = m.title;
      markerLinksList.appendChild(newMarkerli);
  		newMarkerli.style.display = "block";
  			
  			if (firstselected != true){
  			  this.editMarker(n);
  			  firstselected = true;
  			}
        
  	}
  }
  if (firstselected == false){
    this.newMarker(i);
  }
  //We assume it is not visible and make it so
  BitMap.show('edit-markers-table')
}


BitMap.Edit.prototype.newMarker = function(i){
  //i is the set_index
  var count = this.Map.markers.length;
  for (n=0; n<count; n++){
    if($('edit-markerlink-'+n)){
    BitMap.jscss('remove', $('edit-markerlink-'+n), 'edit-select');
    }
  }
  BitMap.jscss('add', $('edit-markerlink-new'), 'edit-select');
  var form = $('edit-marker-form');
  form.marker_id.value = null;
  form.marker_array_n.value = null;
  form.set_id.value = this.Map.markersets[i].set_id;
  form.reset();
  BitMap.hide('edit-marker-actions');  
}


BitMap.Edit.prototype.editMarker = function(i){
  BitMap.jscss('remove', $('edit-markerlink-new'), 'edit-select');
  var a;
  var count = this.Map.markers.length;
  for (n=0; n<count; n++){
    if($('edit-markerlink-'+n)){
    a = (n==i)?'add':'remove';
    BitMap.jscss(a, $('edit-markerlink-'+n), 'edit-select');
    }
  }
  
  var m = this.Map.markers[i];
  //change values
  var form = $('edit-marker-form');
  form.marker_id.value = m.marker_id;
  form.marker_array_n.value = i;
  form.set_id.value = m.set_id;
  form.marker_type.options[m.marker_type].selected = true;
  form.title.value = m.title;
  form['geo[lat]'].value = m.lat;
  form['geo[lng]'].value = m.lng;
  form.edit.value = m.data;
  form.marker_labeltext.value = m.label_data;
  form.photo_url.value = m.photo_url;
  
  //update links
  var formLinks = $('edit-marker-actions').getElementsByTagName("a");
  formLinks.item(0).href = "javascript:BitMap.MapData[0].Map.markers["+n+"].gmarker.openInfoWindowHtml(BitMap.MapData[0].Map.markers["+n+"].gmarker.my_html);";
  
  BitMap.show('edit-marker-actions');
}


BitMap.Edit.prototype.cancelNewMarker = function(){
  this.canceledit('edit-marker-new');
}


BitMap.Edit.prototype.cancelEditMarkers = function(){
  BitMap.hide('edit-markers-table');
}



//@todo change this to editMarkerSet(n)
BitMap.Edit.prototype.editSet = function(n){
				BitMap.show('setform_'+n);
};


BitMap.Edit.prototype.newIconStyle = function(){
		var check = false;
  	for (var i=0; i<this.Map.markersets.length; i++){
  		if ( this.Map.markersets[i] != null ){
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
  	if ( typeof( this.Map.iconstyles ) ) {
  
    	// We assume editIconStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<this.Map.iconstyles.length; a++) {
    		if ( this.Map.iconstyles[a]!= null ){
      			var getElem = "editiconstyletable_" + this.Map.iconstyles[a].icon_id;
        		if ( $(getElem) ) {
            		var extraIconStyleForm = $(getElem);
        			$('editiconstyleform').removeChild(extraIconStyleForm);
        		}
  			}
    	}
  
    	var editIconStyleId;
			var x = 0;
    	// for each iconstyle data set clone the form
    	for (var b=0; b<this.Map.iconstyles.length; b++) {
        	if ( this.Map.iconstyles[b]!= null ){  						
					x++;    
        		editIconStyleId = this.Map.iconstyles[b].icon_id;
    
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
                form.icon_id.value = this.Map.iconstyles[b].icon_id;
                form.name.value = this.Map.iconstyles[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.icon_style_type.options[r].value == this.Map.iconstyles[b].icon_style_type){
                   		form.icon_style_type.options[r].selected=true;
                   }
                };
                form.image.value = this.Map.iconstyles[b].image;
                form.rollover_image.value = this.Map.iconstyles[b].rollover_image;
                form.icon_w.value = this.Map.iconstyles[b].icon_w;
                form.icon_h.value = this.Map.iconstyles[b].icon_h;

				 /* not sure want to both supporting these, 
			 	  * probably more complex than people want to be bothered with
				  * they are NOT in the edit_form.tpl
					----------------------------------------------------------	
					form.print_image.value = this.Map.iconstyles[b].print_image;
                form.moz_print_image.value = this.Map.iconstyles[b].moz_print_image;
                form.transparent.value = this.Map.iconstyles[b].transparent;
                form.print_shadow.value = this.Map.iconstyles[b].print_shadow;
                form.image_map.value = this.Map.iconstyles[b].image_map;
				  */

                form.shadow_image.value = this.Map.iconstyles[b].shadow_image;
                form.shadow_w.value = this.Map.iconstyles[b].shadow_w;
                form.shadow_h.value = this.Map.iconstyles[b].shadow_h;
                form.icon_anchor_x.value = this.Map.iconstyles[b].icon_anchor_x;
                form.icon_anchor_y.value = this.Map.iconstyles[b].icon_anchor_y;
                form.shadow_anchor_x.value = this.Map.iconstyles[b].shadow_anchor_x;
                form.shadow_anchor_y.value = this.Map.iconstyles[b].shadow_anchor_y;
                form.infowindow_anchor_x.value = this.Map.iconstyles[b].infowindow_anchor_x;
                form.infowindow_anchor_y.value = this.Map.iconstyles[b].infowindow_anchor_y;
                form.points.value = this.Map.iconstyles[b].points;
                form.scale.value = this.Map.iconstyles[b].scale;
                form.outline_color.value = this.Map.iconstyles[b].outline_color;
                form.outline_weight.value = this.Map.iconstyles[b].outline_weight;
                form.fill_color.value = this.Map.iconstyles[b].fill_color;
                form.fill_opacity.value = this.Map.iconstyles[b].fill_opacity;
    
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
  	for (var i=0; i<this.Map.markersets.length; i++){
  		if ( this.Map.markersets[i] != null ){
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
		if ( typeof( this.Map.markerstyles ) ) {

  	// We assume editMarkerStyles has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.markerstyles.length; a++) {
  		if ( this.Map.markerstyles[a]!= null ){
    		var getElem = "editmarkerstyletable_" + this.Map.markerstyles[a].style_id;
    		if ( $(getElem) ) {
        	var extraMarkerStyleForm = $(getElem);
    			$('editmarkerstyleform').removeChild(extraMarkerStyleForm);
    		}
			}
  	}

  	var editMarkerStyleId;

		var x = 0;
  	// for each markerstyle data set clone the form
  	for (var b=0; b<this.Map.markerstyles.length; b++) {
    	if ( this.Map.markerstyles[b]!= null ){  						
				x++
    		editMarkerStyleId = this.Map.markerstyles[b].style_id;

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

            form.style_id.value = this.Map.markerstyles[b].style_id;
            form.style_array_n.value = b;
            form.name.value = this.Map.markerstyles[b].name;
            for (var r=0; r < 3; r++) {
               if (form.marker_style_type.options[r].value == this.Map.markerstyles[b].marker_style_type){
               		form.marker_style_type.options[r].selected=true;
               }
            };
            form.label_hover_opacity.value = this.Map.markerstyles[b].label_hover_opacity;
            form.label_opacity.value = this.Map.markerstyles[b].label_opacity;
            form.label_hover_styles.value = this.Map.markerstyles[b].label_hover_styles;
            form.window_styles.value = this.Map.markerstyles[b].window_styles;

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
  	for (var i=0; i<this.Map.polylinesets.length; i++){
  		if ( this.Map.polylinesets[i] != null ){
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
  		if ( typeof(this.Map.polylinesets) != 'undefined' ){
    			for ( i=0; i<this.Map.polylinesets.length; i++ ){
  						if ( this.Map.polylinesets[i] != null ){
                 	selectRoot.options[selectRoot.options.length] = new Option( this.Map.polylinesets[i].name, this.Map.polylinesets[i].set_id );
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
	if ( typeof(this.Map.polylines) ) {
	
  	// We assume editPolylines has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.polylinesets.length; a++) {
  		if (this.Map.polylinesets[a]!= null){
    		var getElem = "polylineset_"+this.Map.polylinesets[a].set_id;
    		if ( $(getElem) ) {
        	var extraPolylineForm = $(getElem);
    			$('editpolylineform').removeChild(extraPolylineForm);
    		}
			}
  	}
  
  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<this.Map.polylinesets.length; b++) {
  	if (this.Map.polylinesets[b]!= null){
		  	
  		newSetId = this.Map.polylinesets[b].set_id;
  	
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
   			mycel.getElementsByTagName("b").item(0).innerHTML = this.Map.polylinesets[b].name;
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
				if (this.Map.polylinesets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (this.Map.polylinesets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (this.Map.polylinesets[b].explode == false){ form.explode.options[1].selected=true };
				form.set_array_n.value = b;
				if ( (typeof(this.Map.polylinestyles) != 'undefined') && (this.Map.polylinestyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<this.Map.polylinestyles.length; d++){
						if ( this.Map.polylinestyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( this.Map.polylinestyles[d].name, this.Map.polylinestyles[d].style_id );
							if ( this.Map.polylinestyles[d].style_id == this.Map.polylinesets[b].style_id){
							form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
				}
			}
		}			

  	//for length of polylines add form to setelement on matching set_id
		var x = 0;
  	for (g=0; g<this.Map.polylines.length; g++) {
			if (this.Map.polylines[g]!= null){
				x++;
				//add polyline form...again a little ugly here
				var formCont = $("editpolylinetable_"+this.Map.polylines[g].set_id);
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
    							
        			$('editpolylinetable_'+this.Map.polylines[g].set_id).appendChild(newPolylineForm);
    				BitMap.show('polylineform_'+g);
    			}
    		}

				// populate set form values
				form = $('polylineform_'+g);

            form.set_id.value = this.Map.polylines[g].set_id;
            form.polyline_id.value = this.Map.polylines[g].polyline_id;
            form.name.value = this.Map.polylines[g].name;
            form.points_data.value = this.Map.polylines[g].points_data;
            form.border_text.value = this.Map.polylines[g].border_text;
            form.zindex.value = this.Map.polylines[g].zindex;
            form.polyline_array_n.value = this.Map.polylines[g].array_n;
				
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
  	if ( typeof( this.Map.polylinestyles ) ) {
  
    	// We assume editPolylineStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<this.Map.polylinestyles.length; a++) {
    		if ( this.Map.polylinestyles[a]!= null ){
      			var getElem = "editpolylinestyletable_" + this.Map.polylinestyles[a].style_id;
        		if ( $(getElem) ) {
            		var extraPolylineStyleForm = $(getElem);
        			$('editpolylinestyleform').removeChild(extraPolylineStyleForm);
        		}
  			}
    	}
  
    	var editPolylineStyleId;
  
    	// for each markerstyle data set clone the form
			var x = 0;
    	for (var b=0; b<this.Map.polylinestyles.length; b++) {
        	if ( this.Map.polylinestyles[b]!= null ){  						
					x++;    
        		editPolylineStyleId = this.Map.polylinestyles[b].style_id;
    
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
                form.style_id.value = this.Map.polylinestyles[b].style_id;
                form.name.value = this.Map.polylinestyles[b].name;
                for (var r=0; r < 2; r++) {
                   if (form.polyline_style_type.options[r].value == this.Map.polylinestyles[b].polyline_style_type){
                   		form.polyline_style_type.options[r].selected=true;
                   }
                };
                form.color.value = this.Map.polylinestyles[b].color;
                form.weight.value = this.Map.polylinestyles[b].weight;
                form.opacity.value = this.Map.polylinestyles[b].opacity;
                form.pattern.value = this.Map.polylinestyles[b].pattern;
                form.segment_count.value = this.Map.polylinestyles[b].segment_count;
                form.text_every.value = this.Map.polylinestyles[b].text_every;
                if (this.Map.polylinestyles[b].begin_arrow == false){
                	form.begin_arrow.options[0].selected=true;
                }else{
                	form.begin_arrow.options[1].selected=true;
					}
                if (this.Map.polylinestyles[b].end_arrow == false){
                	form.end_arrow.options[0].selected=true;
                }else{
                	form.end_arrow.options[1].selected=true;
                }
                form.arrows_every.value = this.Map.polylinestyles[b].arrows_every;
                form.text_fgstyle_color.value = this.Map.polylinestyles[b].text_fgstyle_color;
                form.text_fgstyle_weight.value = this.Map.polylinestyles[b].text_fgstyle_weight;
                form.text_fgstyle_opacity.value = this.Map.polylinestyles[b].text_fgstyle_opacity;
                form.text_fgstyle_zindex.value = this.Map.polylinestyles[b].text_fgstyle_zindex;
                form.text_bgstyle_color.value = this.Map.polylinestyles[b].text_bgstyle_color;
                form.text_bgstyle_weight.value = this.Map.polylinestyles[b].text_bgstyle_weight;
                form.text_bgstyle_opacity.value = this.Map.polylinestyles[b].text_bgstyle_opacity;
                form.text_bgstyle_zindex.value = this.Map.polylinestyles[b].text_bgstyle_zindex;
    
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
  	for (var i=0; i<this.Map.polylinesets.length; i++){
  		if ( this.Map.polylinesets[i] != null ){
				check = true;
  		}
  	}
  	for (var i=0; i<this.Map.polygonsets.length; i++){
  		if ( this.Map.polygonsets[i] != null ){
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
  	for (var i=0; i<this.Map.polygonsets.length; i++){
  		if ( this.Map.polygonsets[i] != null ){
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
  		if ( typeof(this.Map.polygonsets) != 'undefined' ){
    			for ( i=0; i<this.Map.polygonsets.length; i++ ){
  						if ( this.Map.polygonsets[i] != null ){
                 	selectRoot.options[selectRoot.options.length] = new Option( this.Map.polygonsets[i].name, this.Map.polygonsets[i].set_id );
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
	if ( typeof(this.Map.polygons) ) {

  	// We assume editPolygons has been called before and remove 
  	// any previously existing sets from the UI
  	for (var a=0; a<this.Map.polygonsets.length; a++) {
  		if (this.Map.polygonsets[a]!= null){
    		var getElem = "polygonset_"+this.Map.polygonsets[a].set_id;
    		if ( $(getElem) ) {
        	var extraPolygonForm = $(getElem);
    			$('editpolygonform').removeChild(extraPolygonForm);
    		}
			}
  	}

  	var newSetId;
  	  	
  	// add a new set UI for each marker set
  	for (var b=0; b<this.Map.polygonsets.length; b++) {
  	if (this.Map.polygonsets[b]!= null){
		  	
  		newSetId = this.Map.polygonsets[b].set_id;

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
   			mycel.getElementsByTagName("b").item(0).innerHTML = this.Map.polygonsets[b].name;
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
				if (this.Map.polygonsets[b].plot_on_load == false){ form.plot_on_load.options[1].selected=true; };
				if (this.Map.polygonsets[b].side_panel == false){ form.side_panel.options[1].selected=true; };
				if (this.Map.polygonsets[b].explode == false){ form.explode.options[1].selected=true };
				form.set_array_n.value = b;
				if ( (typeof(this.Map.polygonstyles) != 'undefined') && (this.Map.polygonstyles.length > 0) ){
					var OptionN = form.style_id.options.length;
  				for (var d=0; d<this.Map.polygonstyles.length; d++){
						if ( this.Map.polygonstyles[d] != null ){
							form.style_id.options[OptionN + d] = new Option( this.Map.polygonstyles[d].name, this.Map.polygonstyles[d].style_id );
							if ( this.Map.polygonstyles[d].style_id == this.Map.polygonsets[b].style_id){
								form.style_id.options[OptionN + d].selected=true;
							}
  					}
  				}
					var OptionO = form.polylinestyle_id.options.length;
  				for (var e=0; e<this.Map.polylinestyles.length; e++){
						if ( this.Map.polylinestyles[e] != null ){
							form.polylinestyle_id.options[OptionO + e] = new Option( this.Map.polylinestyles[e].name, this.Map.polylinestyles[e].style_id );
							if ( this.Map.polylinestyles[e].style_id == this.Map.polygonsets[b].polylinestyle_id){
								form.polylinestyle_id.options[OptionO + e].selected=true;
							}
  					}
  				}
				}
			}
		}			

  	//for length of polygons add form to setelement on matching set_id
		x = 0;
  	for (g=0; g<this.Map.polygons.length; g++) {
			if (this.Map.polygons[g]!= null){
				x++;
				//add polygon form...again a little ugly here
				var formCont = $("editpolygontable_"+this.Map.polygons[g].set_id);

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
    							
        			$('editpolygontable_'+this.Map.polygons[g].set_id).appendChild(newPolygonForm);
    				BitMap.show('polygonform_'+g);
    			}
    		}
				
				// populate set form values
				form = $('polygonform_'+g);

            form.set_id.value = this.Map.polygons[g].set_id;
            form.polygon_id.value = this.Map.polygons[g].polygon_id;
            form.name.value = this.Map.polygons[g].name;
				if (this.Map.polygons[g].circle == false){
					form.circle.options[0].selected=true;
				}else{
					form.circle.options[1].selected=true;
				}
            form.points_data.value = this.Map.polygons[g].points_data;
            form.circle_center.value = this.Map.polygons[g].circle_center;
            form.radius.value = this.Map.polygons[g].radius;
            form.border_text.value = this.Map.polygons[g].border_text;
            form.zindex.value = this.Map.polygons[g].zindex;
            form.polygon_array_n.value = this.Map.polygons[g].array_n;
				
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
  	if ( typeof( this.Map.polygonstyles ) ) {
  
    	// We assume editPolygonStyles has been called before and remove 
    	// any previously existing sets from the UI
    	for (var a=0; a<this.Map.polygonstyles.length; a++) {
    		if ( this.Map.polygonstyles[a]!= null ){
      			var getElem = "editpolygonstyletable_" + this.Map.polygonstyles[a].style_id;
        		if ( $(getElem) ) {
            		var extraPolygonStyleForm = $(getElem);
        			$('editpolygonstyleform').removeChild(extraPolygonStyleForm);
        		}
  			}
    	}
  
    	var editPolygonStyleId;
  		var x=0;
    	// for each markerstyle data set clone the form
    	for (var b=0; b<this.Map.polygonstyles.length; b++) {
        	if ( this.Map.polygonstyles[b]!= null ){  						
					x++;    
        		editPolygonStyleId = this.Map.polygonstyles[b].style_id;

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
                form.style_id.value = this.Map.polygonstyles[b].style_id;
                form.name.value = this.Map.polygonstyles[b].name;
                form.color.value = this.Map.polygonstyles[b].color;
                form.weight.value = this.Map.polygonstyles[b].weight;
                form.opacity.value = this.Map.polygonstyles[b].opacity;
 
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
  	for (var i=0; i<this.Map.polygonsets.length; i++){
  		if ( this.Map.polygonsets[i] != null ){
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
			doSimpleXMLHttpRequest("edit.php", f).addCallback( bind(this.updateMap, this) ); 
	 }

	 BitMap.Edit.prototype.storeMaptype = function(f){
			this.editObjectN = f.array_n.value;
	 		var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
			var callback = (f.maptype_id.value != "")?this.updateMaptype:this.addMaptype;
			doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
	 }
	 
	 BitMap.Edit.prototype.removeMaptype = function(f){
			this.editObjectN = f.array_n.value;
			this.editSetId = f.maptype_id.value;
	 		var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&gmap_id=" + this.Map.id + "&remove_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this) ); 
	 }
	 
	 BitMap.Edit.prototype.expungeMaptype = function(f){
			this.editObjectN = f.array_n.value;
			this.editSetId = f.maptype_id.value;
	 		var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&expunge_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this) ); 
	 }

	 BitMap.Edit.prototype.storeMarker = function(f){
	 		var str = "edit_marker.php?" + queryString(f);
			this.editSetId = f.set_id.value;
			this.editObjectN = f.marker_array_n.value;
			var callback = (f.marker_id.value != "")?this.updateMarker:this.addMarker;
		  doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
	 }
	 
	 BitMap.Edit.prototype.removeMarker = function(f){
			this.editSetId = f.set_id.value;
			this.editMarkerId = f.marker_id.value;
	 		var str = "edit_marker.php?set_id=" + this.editSetId + "&marker_id=" + this.editMarkerId + "&remove_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) ); 
	 }

	 BitMap.Edit.prototype.expungeMarker = function(f){
			this.editSetId = f.set_id.value;
			this.editMarkerId = f.marker_id.value;
	 		var str = "edit_marker.php?marker_id=" + this.editMarkerId + "&expunge_marker=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) ); 
	 }	 

	 BitMap.Edit.prototype.storeMarkerSet = function(f){
	 		var str = "edit_markerset.php?" + queryString(f) + "&set_type=markers" + "&gmap_id=" + this.Map.id;
			this.canceledit('editerror');			
			this.editSetId = f.set_id.value;
			this.editObjectN = f.set_array_n.value;
			var callback = (f.set_id.value != "")?this.updateMarkerSet:this.addMarkerSet;
			doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
	 }

	 BitMap.Edit.prototype.removeMarkerSet = function(f){
			this.editSetId = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) ); 
	 }

	 BitMap.Edit.prototype.expungeMarkerSet = function(f){
			this.editSetId = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&expunge_markerset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) ); 
	 }
	 
	 BitMap.Edit.prototype.storeNewMarkerStyle = function(f){
	 		var str = "edit_markerstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addMarkerStyle, this) ); 
	 }

	 BitMap.Edit.prototype.storeMarkerStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_markerstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateMarkerStyle, this) ); 
	 }

	 BitMap.Edit.prototype.storeNewIconStyle = function(f){
	 		var str = "edit_iconstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addIconStyle, this) ); 
	 }

	 BitMap.Edit.prototype.storeIconStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_iconstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateIconStyle, this) ); 
	 }

	 BitMap.Edit.prototype.storeNewPolyline = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polyline.php?" + queryString(f) + "&save_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolyline, this) );
	 }
	 
	 BitMap.Edit.prototype.storePolyline = function(f){
			this.editObjectN = f.polyline_array_n.value;
			doSimpleXMLHttpRequest("edit_polyline.php", f).addCallback( bind(this.updatePolyline, this) );
	 }
	 
	 BitMap.Edit.prototype.removePolyline = function(f){
			this.editSetId = f.set_id.value;
			this.editPolylineId = f.polyline_id.value;
	 		var str = "edit_polyline.php?set_id=" + this.editSetId + "&polyline_id=" + f.polyline_id.value + "&remove_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolyline, this) );
	 }

	 BitMap.Edit.prototype.expungePolyline = function(f){
			this.editSetId = f.set_id.value;
			this.editPolylineId = f.polyline_id.value;
	 		var str = "edit_polyline.php?polyline_id=" + f.polyline_id.value + "&expunge_polyline=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolyline, this) );
	 }	 
	 
	 BitMap.Edit.prototype.storeNewPolylineSet = function(f){
			this.canceledit('editerror');
	 		var str = "edit_polylineset.php?" + queryString(f) + "&set_type=polylines" + "&gmap_id=" + this.Map.id;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolylineSet, this) );
	 }

	 BitMap.Edit.prototype.storePolylineSet = function(f){
			this.editSetId = f.set_id.value;
			this.editObjectN = f.set_array_n.value;
	 		var str = "edit_polylineset.php?" + queryString(f) + "&gmap_id=" + this.Map.id + "&save_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolylineSet, this) );
	 }

	 BitMap.Edit.prototype.removePolylineSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolylineSet, this) );
	 }
	 
	 BitMap.Edit.prototype.expungePolylineSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&expunge_polylineset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolylineSet, this) );
	 }

	 BitMap.Edit.prototype.storeNewPolylineStyle = function(f){
	 		var str = "edit_polylinestyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolylineStyle, this) ); 
	 }

	 BitMap.Edit.prototype.storePolylineStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_polylinestyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolylineStyle, this) ); 
	 }
	 
	 BitMap.Edit.prototype.storeNewPolygon = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polygon.php?" + queryString(f) + "&save_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolygon, this) );
	 }
	 
	 BitMap.Edit.prototype.storePolygon = function(f){
			this.editObjectN = f.polygon_array_n.value;
			doSimpleXMLHttpRequest("edit_polygon.php", f).addCallback( bind(this.updatePolygon, this) );
	 }
	 
	 BitMap.Edit.prototype.removePolygon = function(f){
			this.editSetId = f.set_id.value;
			this.editPolygonId = f.polygon_id.value;
	 		var str = "edit_polygon.php?set_id=" + this.editSetId + "&polygon_id=" + f.polygon_id.value + "&remove_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygon, this) );
	 }

	 BitMap.Edit.prototype.expungePolygon = function(f){
			this.editSetId = f.set_id.value;
			this.editPolygonId = f.polygon_id.value;
	 		var str = "edit_polygon.php?polygon_id=" + f.polygon_id.value + "&expunge_polygon=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygon, this) );
	 }	 
	 
	 BitMap.Edit.prototype.storeNewPolygonSet = function(f){
			this.canceledit('editerror');
	 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolygonSet, this) );
	 }

	 BitMap.Edit.prototype.storePolygonSet = function(f){
			this.editSetId = f.set_id.value;
			this.editObjectN = f.set_array_n.value;
	 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + this.Map.id + "&save_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolygonSet, this) );
	 }

	 BitMap.Edit.prototype.removePolygonSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygonSet, this) );
	 }
	 
	 BitMap.Edit.prototype.expungePolygonSet = function(f){
			this.editSetId = f.set_id.value;
	 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&expunge_polygonset=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygonSet, this) );
	 }

	 BitMap.Edit.prototype.storeNewPolygonStyle = function(f){
	 		var str = "edit_polygonstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolygonStyle, this) ); 
	 }

	 BitMap.Edit.prototype.storePolygonStyle = function(f){
			this.editObjectN = f.style_array_n.value;
	 		var str = "edit_polygonstyle.php?" + queryString(f);
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolygonStyle, this) ); 
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
			var d = xml.documentElement.getElementsByTagName('description');
			this.Map.description = d[0].firstChild.nodeValue;
			var dt = xml.documentElement.getElementsByTagName('data');
			this.Map.data = dt[0].firstChild.nodeValue;
			var pdt = xml.documentElement.getElementsByTagName('parsed_data');
			this.Map.parsed_data = pdt[0].firstChild.nodeValue;
			var w = xml.documentElement.getElementsByTagName('width');
			this.Map.width = w[0].firstChild.nodeValue;
			var h = xml.documentElement.getElementsByTagName('height');
			this.Map.height = h[0].firstChild.nodeValue;			
			var lt = xml.documentElement.getElementsByTagName('lat');
			this.Map.lat = parseFloat(lt[0].firstChild.nodeValue);
			var ln = xml.documentElement.getElementsByTagName('lng');
			this.Map.lng = parseFloat(ln[0].firstChild.nodeValue);
			var z = xml.documentElement.getElementsByTagName('zoom');
			this.Map.zoom = parseInt(z[0].firstChild.nodeValue);
//			var mt = xml.documentElement.getElementsByTagName('maptype');
//			this.Map.maptype = this.Map.maptypes[mt[0].firstChild.nodeValue];			
			var sc = xml.documentElement.getElementsByTagName('zoom_control');
			this.Map.zoom_control = sc[0].firstChild.nodeValue;
			var sm = xml.documentElement.getElementsByTagName('type_control');
			this.Map.type_control = sm[0].firstChild.nodeValue;
			var oc = xml.documentElement.getElementsByTagName('overview_control');
			this.Map.overview_control = oc[0].firstChild.nodeValue;
			var ss = xml.documentElement.getElementsByTagName('scale');
			this.Map.scale = ss[0].firstChild.nodeValue;

			//replace everything	
      var maptile = $('mymaptitle');
      if (maptile){maptile.innerHTML=this.Map.title;}

      var mapdesc = $('mymapdesc');
      if (mapdesc){mapdesc.innerHTML=this.Map.description;}

      $('mapcontent').innerHTML = this.Map.parsed_data;

      var mapdiv = $(this.Map.mapdiv);
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
			
//			this.Map.map.setMaptype(this.Map.maptype);
			
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



	 BitMap.Edit.prototype.addMaptype = function(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new maptype in the data array
			var n = this.Map.maptypes.length;
			this.Map.maptypes[n] = new Array();
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		this.Map.maptypes[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		this.Map.maptypes[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		this.Map.maptypes[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		this.Map.maptypes[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		this.Map.maptypes[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		this.Map.maptypes[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		this.Map.maptypes[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		this.Map.maptypes[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		this.Map.maptypes[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		this.Map.maptypes[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		this.Map.maptypes[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		this.Map.maptypes[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
			
			this.Map.maptypes[n].maptype_node = this.Map.map.mapTypes.length;
			
			// attach the new map type to the map
			var baseid = this.Map.maptypes[n].basetype;
			var typeid = this.Map.maptypes[n].maptype_id;
			var typename = this.Map.maptypes[n].name;
			var result = copy_obj( this.Map.map.mapTypes[baseid] );

			result.baseUrls = new Array();
			result.baseUrls[0] = this.Map.maptypes[n].maptiles_url;
			result.typename = this.Map.maptypes[n].name;
			result.getLinkText = function() { return this.typename; };
			this.Map.map.mapTypes[this.Map.map.mapTypes.length] = result;
			this.Map.maptypes[typename] = result;
			
			// set the map type to active
			this.Map.map.setMaptype(this.Map.maptypes[typename]);

			// update the controls
  		this.Map.map.removeControl(typecontrols);
  		this.Map.map.addControl(typecontrols);

			// clear the form
			$('maptypeform_new').reset();
			// update the sets menus
			this.editMaptypes();
	 }



	 
	 BitMap.Edit.prototype.updateMaptype = function(rslt){
      var xml = rslt.responseXML;

			var n = this.editObjectN;

			//clear maptype in this location from the Map array of Types
			this.Map.maptypes[this.Map.maptypes[n].name] = null;
			//@todo there are several more values to add, update when updated maptype stuff globally
			// assign map type values data array
			
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
  		this.Map.maptypes[n].maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
  		this.Map.maptypes[n].name = nm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
  		this.Map.maptypes[n].description = ds[0].firstChild.nodeValue;
			var cr = xml.documentElement.getElementsByTagName('copyright');			
  		this.Map.maptypes[n].copyright = cr[0].firstChild.nodeValue;
			var bt = xml.documentElement.getElementsByTagName('basetype');
  		this.Map.maptypes[n].basetype = parseInt( bt[0].firstChild.nodeValue );
			var at = xml.documentElement.getElementsByTagName('alttype');
  		this.Map.maptypes[n].alttype = parseInt( at[0].firstChild.nodeValue );
			var bd = xml.documentElement.getElementsByTagName('bounds');			
  		this.Map.maptypes[n].bounds = bd[0].firstChild.nodeValue;
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
  		this.Map.maptypes[n].maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var mt = xml.documentElement.getElementsByTagName('maptiles_url');			
  		this.Map.maptypes[n].maptiles_url = mt[0].firstChild.nodeValue;
			var lrmt = xml.documentElement.getElementsByTagName('lowresmaptiles_url');			
  		this.Map.maptypes[n].lowresmaptiles_url = lrmt[0].firstChild.nodeValue;
			var ht = xml.documentElement.getElementsByTagName('hybridtiles_url');			
  		this.Map.maptypes[n].hybridtiles_url = ht[0].firstChild.nodeValue;
			var lrht = xml.documentElement.getElementsByTagName('lowreshybridtiles_url');			
  		this.Map.maptypes[n].lowreshybridtiles_url = lrht[0].firstChild.nodeValue;
						
			var p = this.Map.maptypes[n].maptype_node;

			// attach the new map type to the map
			var baseid = this.Map.maptypes[n].basetype;
			var typeid = this.Map.maptypes[n].maptype_id;
			var typename = this.Map.maptypes[n].name;
			var result = copy_obj( this.Map.map.mapTypes[baseid] );
			result.baseUrls = new Array();
			result.baseUrls[0] = this.Map.maptypes[n].maptiles_url;
			result.typename = this.Map.maptypes[n].name;
			result.getLinkText = function() { return this.typename; };
			this.Map.map.mapTypes[p] = result;
			this.Map.maptypes[typename] = result;
			
			// set the map type to active
			this.Map.map.setMaptype( this.Map.maptypes[this.Map.maptypes[n].name] );
	 }


	 
	 BitMap.Edit.prototype.updateRemoveMaptype = function(rslt){
			var n = this.editObjectN;
			
			// get maptype node value
			var p = this.Map.maptypes[n].maptype_node;
			
			// remove the maptype ref form the map array of types
			this.Map.maptypes[this.Map.maptypes[n].name] = null;
			
			// remove the controls
  		this.Map.map.removeControl(typecontrols);
			
			// remove it from the map			
			this.Map.map.mapTypes.splice(p, 1);
			
			// add the controls
  		this.Map.map.addControl(typecontrols);
			
			// @todo we should first check if the map is on display, and then if so flip to street
			// we flip to street mode
			this.Map.map.setMaptype(this.Map.map.mapTypes[0]);
			
	 		// remove by id the maptype form
    		for (var j=0; j<this.Map.maptypes.length; j++){
      			if ( ( this.Map.maptypes[j] != null ) && ( this.Map.maptypes[j].maptype_id == this.editSetId ) ){
          		var getElem = "editmaptypetable_" + this.Map.maptypes[j].maptype_id;
          		if ( $(getElem) ) {
              	var extraMaptypeForm = $(getElem);
          			$('editmaptypeform').removeChild(extraMaptypeForm);
          		}
							this.Map.maptypes[n].maptype_id = null;
      				this.Map.maptypes[n] = null;
							
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
			var n = this.Map.markers.length;
			this.Map.markers[n] = new Array();
			var m = this.Map.markers[n];

	 		//shorten var names
			var id = xml.documentElement.getElementsByTagName('id');			
			m.marker_id = id[0].firstChild.nodeValue;
			var ty = xml.documentElement.getElementsByTagName('marker_type');			
			m.marker_type = ty[0].firstChild.nodeValue;
			var tl = xml.documentElement.getElementsByTagName('title');
			m.title = tl[0].firstChild.nodeValue;
			var lt = xml.documentElement.getElementsByTagName('lat');
			m.lat = parseFloat(lt[0].firstChild.nodeValue);
			var ln = xml.documentElement.getElementsByTagName('lng');
			m.lng = parseFloat(ln[0].firstChild.nodeValue);
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
			for(a=0; a<this.Map.markersets.length; a++){
				if ( ( this.Map.markersets[a] != null ) && ( this.Map.markersets[a].set_id == this.editSetId ) ){
					s = a;
				}
			};

			m.set_id = this.Map.markersets[s].set_id;
			m.style_id = this.Map.markersets[s].style_id;
			m.icon_id = this.Map.markersets[s].icon_id;
			m.plot_on_load = this.Map.markersets[s].plot_on_load;
			m.side_panel = this.Map.markersets[s].side_panel;
			m.explode = this.Map.markersets[s].explode;
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
			var m = this.Map.markers[n];

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
			var ln = xml.documentElement.getElementsByTagName('lng');
			var lng = parseFloat(ln[0].firstChild.nodeValue);
	 		m.lng = lng;
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

			//@todo modify this to handle either this.Map.markers or bSMData sets
			var n = this.Map.markersets.length;
			this.Map.markersets[n] = new Array();
			var s= this.Map.markersets[n];
						
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

			var s = this.Map.markersets[this.editObjectN];
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
				a = this.Map.markers;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(var n=0; n<a.length; n++){
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
		for (var n=0; n<this.Map.markers.length; n++){
			if ( ( this.Map.markers[n] != null ) && ( this.Map.markers[n].marker_id == this.editMarkerId ) ){
				this.Map.map.removeOverlay(this.Map.markers[n].marker);
				this.Map.markers[n].marker = null;
				this.Map.markers[n] = null;
			}
		}
		this.editMarkers();
		this.editSet(editSetId);
}



BitMap.Edit.prototype.updateRemoveMarkerSet = function(){
  	for (var n=0; n<this.Map.markers.length; n++){
  		if ( ( this.Map.markers[n] != null ) && ( this.Map.markers[n].set_id == this.editSetId ) && ( this.Map.markers[n].marker != null ) ){
				this.Map.map.removeOverlay(this.Map.markers[n].marker); 			
				this.Map.markers[n].marker = null;
				this.Map.markers[n] = null;
  		}
  	}
		for (var s=0; s<this.Map.markersets.length; s++){
  		if ( ( this.Map.markersets[s] != null ) && ( this.Map.markersets[s].set_id == this.editSetId ) ){
      		var getElem = "markerset_"+this.Map.markersets[s].set_id;
      		if ( $(getElem) ) {
         		var extraMarkerForm = $(getElem);
      			$('editmarkerform').removeChild(extraMarkerForm);
      		}
				this.Map.markersets[s].set_id = null;
  			this.Map.markersets[s] = null;
  		}
		}
		this.editMarkers();
}
	


BitMap.Edit.prototype.addMarkerStyle = function(rslt){
      var xml = rslt.responseXML;

			// create a spot for a new markerstyle in the data array
			var n = this.Map.markerstyles.length;
			this.Map.markerstyles[n] = new Array();
			var s = this.Map.markerstyles[n];

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
			var s = this.Map.markerstyles[editObjectN];
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
      	var a = this.Map.markers;
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(var n=0; n<a.length; n++){
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
			var n = this.Map.iconstyles.length;
			this.Map.iconstyles[n] = new Array();
			var i = this.Map.iconstyles[n];

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
			var i = this.Map.iconstyles[editObjectN];

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
      	var a = this.Map.markers;
    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(var n=0; n<a.length; n++){
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
			for(var a=0; a<this.Map.polylinesets.length; a++){
				if (this.Map.polylinesets[a] != null && this.Map.polylinesets[a].set_id == this.editSetId){
					s = a;
				}
			};

  		var n = this.Map.polylines.length;
  		this.Map.polylines[n] = new Array();
			var p = this.Map.polylines[n];
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
			
			p.set_id = this.Map.polylinesets[s].set_id;
			p.style_id = this.Map.polylinesets[s].style_id;
			p.plot_on_load = this.Map.polylinesets[s].plot_on_load;
			p.side_panel = this.Map.polylinesets[s].side_panel;
			p.explode = this.Map.polylinesets[s].explode;
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
			var p = this.Map.polylines[n];
			
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

			//@todo modify this to handle either this.Map.polylines or bSLData sets
			var n = this.Map.polylinesets.length;
			this.Map.polylinesets[n] = new Array();
			var s = this.Map.polylinesets[n];
 						
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

			var s = this.Map.polylinesets[editObjectN];
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
				a = this.Map.polylines;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(var n=0; n<a.length; n++){
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
			var n = this.Map.polylinestyles.length;
			this.Map.polylinestyles[n] = new Array();
			var s = this.Map.polylinestyles[n];

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
			var s = this.Map.polylinestyles[editObjectN];

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
      	var a = this.Map.polylines;
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(var n=0; n<a.length; n++){
      		//if the array item is not Null
        		if (a[n]!= null && a[n].polyline != null && a[n].style_id == s.style_id){
						this.Map.map.removeOverlay( a[n].polyline );
        		this.Map.attachPolyline(n);
    			}
    		}
    	}

			//for each polygon
      	var b = this.Map.polygons;
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
	for (var i=0; i<this.Map.polylines.length; i++){
		if ( Map.Polylines[i] != null && this.Map.polylines[n].polyline != null && this.Map.polylines[i].polyline_id == this.editPolylineId ){
			this.Map.map.removeOverlay(this.Map.polylines[i].polyline);
			this.Map.polylines[i].polyline = null;
			this.Map.polylines[i] = null;
		}
	}
	this.editPolylines();
	this.editPolylineSet(editSetId);
}



//this needs special attention
BitMap.Edit.prototype.updateRemovePolylineSet = function(){
  	for (var n=0; n<this.Map.polylines.length; n++){
  		if ( ( this.Map.polylines[n] != null ) && ( this.Map.polylines[n].set_id == this.editSetId ) && ( this.Map.polylines[n].polyline != null ) ){
  			this.Map.map.removeOverlay(Map.Polylines[n].polyline);
				this.Map.polylines[n].polyline = null;
  			this.Map.polylines[n] = null;
  		}
  	}
		for (var s=0; s<Map.PolylineSets.length; s++){
  		if ( ( this.Map.polylinesets[s] != null ) && ( this.Map.polylinesets[s].set_id == this.editSetId ) ){
      		var getElem = "polylineset_"+this.Map.polylinesets[s].set_id;
      		if ( $(getElem) ) {
          		var extraPolylineForm = $(getElem);
      			$('editpolylineform').removeChild(extraPolylineForm);
      		}
				this.Map.polylinesets[s].set_id = null;
  			this.Map.polylinesets[s] = null;
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

			for(var a=0; a<this.Map.polygonsets.length; a++){
				if ( this.Map.polygonsets[a] != null && this.Map.polygonsets[a].set_id == this.editSetId ){
					s = a;
				}
			};

  		var n = this.Map.polygons.length;
  		this.Map.polygons[n] = new Array();
			var p = this.Map.polygons[n];
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

			p.set_id = this.Map.polygonsets[s].set_id;
			p.style_id = this.Map.polygonsets[s].style_id;
			p.polylinestyle_id = this.Map.polygonsets[s].polylinestyle_id;
			p.plot_on_load = this.Map.polygonsets[s].plot_on_load;
			p.side_panel = this.Map.polygonsets[s].side_panel;
			p.explode = this.Map.polygonsets[s].explode;
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
			var p = this.Map.polygons[n];
			
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
			var n = this.Map.polygonsets.length;
			this.Map.polygonsets[n] = new Array();
			var s = this.Map.polygonsets[n];			
			
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

			var s = this.Map.polygonsets[this.editObjectN];
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
				a = this.Map.polygons;
           	//if the length of the array is > 0
           	if (a.length > 0){
             	//loop through the array
           		for(var n=0; n<a.length; n++){
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
			var n = this.Map.polygonstyles.length;
			this.Map.polygonstyles[n] = new Array();
			var s = this.Map.polygonstyles[n];

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
			var s = this.Map.polygonstyles[editObjectN];

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
      	var a = this.Map.polygons;    
    	//if the length of the array is > 0
    	if (a.length > 0){
      	//loop through the array
    		for(var n=0; n<a.length; n++){
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
	for (var n=0; n<this.Map.polygons.length; n++){
		if ( this.Map.polygons[n] != null && this.Map.polygons[n].polygon != null && this.Map.polygons[n].polygon_id == this.editPolygonId ){
			this.Map.map.removeOverlay(this.Map.polygons[n].polygon);
			this.Map.polygons[n].polygon = null;
			this.Map.polygons[n] = null;
		}
	}
	this.editPolygons();
	this.editPolygonSet(this.editSetId);
}


BitMap.Edit.prototype.updateRemovePolygonSet = function(){
	for (var n=0; n<this.Map.polygons.length; n++){
		if ( this.Map.polygons[n] != null && this.Map.polygons[n].polygon != null && this.Map.polygons[n].set_id == this.editSetId ){
			this.Map.map.removeOverlay(this.Map.polygons[n].polygon);
			this.Map.polygons[n].polygon = null;
			this.Map.polygons[n] = null;
		}
	}
	for (var s=0; s<Map.PolygonSets.length; s++){
		if ( ( this.Map.polygonsets[s] != null ) && ( this.Map.polygonsets[s].set_id == this.editSetId ) ){
			var getElem = "polygonset_"+this.Map.polygonsets[s].set_id;
			if ( $(getElem) ) {
				var extraPolygonForm = $(getElem);
				$('editpolygonform').removeChild(extraPolygonForm);
			}
			this.Map.polygonsets[s].set_id = null;
			this.Map.polygonsets[s] = null;
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
		f = $('edit-map-form');
		alert ('Map centering assistant activated. \n Click to get center lat and lng values!');
	
  	this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay, point){
      if (point) {
  		this.panTo(point);
  		f['geo[lng]'].value = point.lng();
  		f['geo[lat]'].value = point.lat();
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
