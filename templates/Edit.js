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


BitMap.Edit.prototype = {
	// for sorting arrays
	"sortOn": function(a,b){ 
		return a['set_id']-b['set_id']; 
	},
		
	"sortIt": function(pParamHash){
		pParamHash.sort(sortOn); 
	},
	
	"canceledit": function(i){
		$(i).style.display = "none";	
	},
	
	"toggleIconMenu": function(o, n){
		if (o == 0){
			$('gicon_style_head_'+n).style.display = 'table-row';
			$('gicon_style_menu1_'+n).style.display = 'table-row';
			$('gicon_style_menu2_'+n).style.display = 'table-row';
		}else{
			$('gicon_style_head_'+n).style.display = 'none';
			$('gicon_style_menu1_'+n).style.display = 'none';
			$('gicon_style_menu2_'+n).style.display = 'none';
		}
	},
	
	
	
	/*******************
	 *
	 * MAP FORM FUNCTIONS
	 *
	 *******************/
	
	// builds the map editing form
	"editMap": function(){
		
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
	
	  var i;
	  for (i=0; i < 4; i++) {
	    if (form.map_showcont.options[i].value == this.Map.controls.zoom_control){
	      form.map_showcont.options[i].selected=true;
	    }
	  }
	  i=(this.Map.controls.scale == true||this.Map.controls.scale=='true')?1:0;
	  form.map_showscale.options[i].selected=true;
			
	  i=(this.Map.controls.maptype_control==true||this.Map.controls.maptype_control=='true')?1:0;
	  form.map_showtypecont.options[i].selected=true;
	
						
	  var mapTypeRoot = form.maptype;
	
		var mapTypeCount = 3;
		
		if (mapTypeRoot.options.length > 3){
			for (n=mapTypeRoot.options.length; n>3; n--){
				mapTypeRoot.remove(n-1);
			}
		}

		if (this.Map.maptypes.length > 0){
			mapTypeCount += this.Map.maptypes.length;
			var newMaptype = mapTypeRoot.options[0].cloneNode(false);
			for (i=0; i<this.Map.maptypes.length; i++){
			  mapTypeRoot.appendChild(newMaptype);
			  mapTypeRoot.options[i+3].value = this.Map.maptypes[i].maptype_id;
			  mapTypeRoot.options[i+3].text = this.Map.maptypes[i].name;
			}
		}
							
	  for (var i=0; i<mapTypeCount; i++) {
	    if (form.maptype.options[i].value == this.Map.maptype){
	      form.maptype.options[i].selected=true;
	    }
	  }

	  form.allow_comments.checked = (this.Map.allow_comments == "y")?true:false;
	},



	/*******************
	 *
	 * MAPTYPE FORM FUNCTIONS
	 *
	 *******************/	
	
	"editMaptypes": function(){
		BitMap.show('edit-maptypes-menu');
	  //First check if there are any marker sets
	  if (this.Map.maptypes.length > 0){
	    // We assume editMarkers has been called before and remove 
	  	// any previously existing sets from the UI	
	  	for (var n=0; n<this.Map.maptypes.length; n++) {
	  		if (this.Map.maptypes[n]!= null){
	    		var getElem = "edit-maptype-"+n;
	    		if ( $(getElem) ) {
	    			$('edit-maptypes-table').removeChild($(getElem));
	    		}
			}
	  	}
	    //Add a tool bar for each MarkerSet
	    for (var n=0; n<this.Map.maptypes.length; n++) {
	  		var newMaptype = $('edit-maptype').cloneNode(true);
	    	newMaptype.id = "edit-maptype-"+n;
	   		newMaptype.getElementsByTagName("span").item(0).innerHTML = this.Map.maptypes[n].name;
	   		newMaptype.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.editMaptypeOptions("+n+");";
	   		newMaptype.getElementsByTagName("a").item(1).href = "javascript:BitMap.EditSession.editMaptypeTilelayers("+n+");";
	    	$('edit-maptypes-table').appendChild(newMaptype);
	    	BitMap.show('edit-maptype-'+n);
	    }
	  }else{
		//alert you must create a maptype first
	  }
	  BitMap.show('edit-maptypes-table');
	  BitMap.show('edit-maptypes-cancel');	  
	},
	
	
	"newMaptype": function(){
	  this.cancelEditTilelayers();
	  var count = this.Map.maptypes.length;
	  for (n=0; n<count; n++){
	    BitMap.jscss('remove', $('edit-maptype-'+n), 'edit-selected');
	  }
	
	  if( !$('edit-maptype-new') ){
	    var newMaptype = $('edit-maptype').cloneNode(true);
	    newMaptype.id = "edit-maptype-new";
	    newMaptype.getElementsByTagName("span").item(0).innerHTML = "New Maptype";
	    var tdtags = newMaptype.getElementsByTagName("td");
	    tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
	    $('edit-maptypes-menu').appendChild(newMaptype);
	  }
	  
	  BitMap.jscss('add', $('edit-maptype-new'), 'edit-selected');
	  BitMap.hide('edit-maptype-options-actions');
	  $('edit-maptype-new').appendChild( $('edit-maptype-options-table') );
	  BitMap.show('edit-maptype-new');
	  BitMap.show('edit-maptype-options-table');
	  
	  //customize the form values
	  var form = $('edit-maptype-options-form');
	  form.reset();
	  form.maptype_id.value = null;
	  form.array_n.value = null;
	},

	"editMaptypeOptions": function(i){
	  var a;
	  var count = this.Map.maptypes.length;
	  //hilights the right set, unselects the others
	  for (n=0; n<count; n++){
	    a = (n==i)?'add':'remove';
	    BitMap.jscss(a, $('edit-maptype-'+n), 'edit-selected');
	  }
	
	  this.cancelNewMaptype();
	  this.cancelEditTilelayers();
	  var m = this.Map.maptypes[i];
	  var optionsTable = $('edit-maptype-options-table');
	  var target = $('edit-maptype-'+i);
	  target.insertBefore(optionsTable, target.childNodes[2]);  
	  BitMap.show('edit-maptype-options-actions');
	  BitMap.show('edit-maptype-options-table');
	    
	  //customize the form values
	  var form = $('edit-maptype-options-form');
	  form.maptype_id.value = m.maptype_id;
	  form.array_n.value = i;	  
	  form.name.value = m.name;
	  form.shortname.value = m.shortname;
	  form.description.value = m.description;
	  form.minzoom.value = m.minzoom;
	  form.maxzoom.value = m.maxzoom;
	  form.errormsg.value = m.errormsg;
	},
	
	"editMaptypeTilelayers": function(i){
	  this.cancelNewMaptype();
	  var a;
	  var count = this.Map.maptypes.length;
	  for (n=0; n<count; n++){
	    a = (n==i)?'add':'remove';
	    BitMap.jscss(a, $('edit-maptype-'+n), 'edit-selected');
	  }
	
	  this.cancelEditMaptypeOptions();
	  var maptype_id = this.Map.maptypes[i].maptype_id;
	  var tilelayersTable = $('edit-tilelayers-table');
	  //Set the markerset toggle tags to closed
	  //Set the markerset toggle tags to open on our selected set
	  //Move Tilelayers Table to New Maptype
	  $('edit-maptype-'+i).appendChild(tilelayersTable);
	  //set some constants
	  var tilelayersLinksList = tilelayersTable.getElementsByTagName("ul").item(0);
	  var tilelayersLinks = tilelayersTable.getElementsByTagName("li");
	  //Clear all the existing tilelayers listed  
	  //We leave the first two, the first is the model we clone, the second if for a new tilelayer
	  var count = tilelayersLinks.length;
	  for (n=count-1; n>1; n--){
	    tilelayersLinksList.removeChild(tilelayersLinks.item(n));
	  }
	  $('edit-tilelayerlink-new-a').href = "javascript:BitMap.EditSession.newTilelayer("+i+");";
	  //For each tilelayer in our new maptype, add a link
	  var firstselected = false;
	  for (var n=0; n<this.Map.tilelayers.length; n++) {
		var t = this.Map.tilelayers[n];
	    if (t.maptype_id == maptype_id){
	    	var newTilelayerli = tilelayersLinks.item(0).cloneNode(true);
	    	newTilelayerli.id = 'edit-tilelayerlink-'+n;
	  		var newTilelayerLink = newTilelayerli.getElementsByTagName("a").item(0);
	      	newTilelayerLink.href = "javascript:BitMap.EditSession.editTilelayer("+n+")";
	      	newTilelayerLink.innerHTML = t.tiles_name;
	      	tilelayersLinksList.appendChild(newTilelayerli);
	  		newTilelayerli.style.display = "block";
			if (firstselected != true){
			  this.editTilelayer(n);
			  firstselected = true;
			}	        
	  	}
	  }
	  if (firstselected == false){
	    this.newTilelayer(i);
	  }
	  //We assume it is not visible and make it so
	  BitMap.show('edit-tilelayers-table')
	},

	"editTilelayer": function(i){
	  this.cancelEditCopyright();
	  //i is the maptype_index
	  BitMap.jscss('remove', $('edit-tilelayerlink-new'), 'edit-select');
	  var a;
	  var count = this.Map.tilelayers.length;
	  for (n=0; n<count; n++){
	    if($('edit-tilelayerlink-'+n)){
	    a = (n==i)?'add':'remove';
	    BitMap.jscss(a, $('edit-tilelayerlink-'+n), 'edit-select');
	    }
	  }
	  
	  var t = this.Map.tilelayers[i];
	  //change values
	  var form = $('edit-tilelayer-form');
	  form.tilelayer_id.value = t.tilelayer_id;
	  form.array_n.value = i;
	  form.maptype_id.value = this.Map.tilelayers[i].maptype_id;

	  form.tiles_name.value = t.tiles_name;
	  form.tiles_minzoom.value = t.tiles_minzoom;
	  form.tiles_maxzoom.value = t.tiles_maxzoom;
	  form.ispng.value = t.ispng;
	  form.tilesurl.value = t.tilesurl;
	  form.opacity.value = t.opacity;

	  //make menu of copyrights
	  //Clear all the existing copyrights listed  
	  var count = this.Map.copyrights.length;
	  for (n=0; n<count; n++){
	  	if ($("edit-copyrightlink-"+n)){
	    	$('edit-copyright-menu').removeChild($("edit-copyrightlink-"+n));
	    }
	  }
	  $('edit-copyrightlink-new-a').href = "javascript:BitMap.EditSession.newCopyright("+i+");";
	  //for each copyright
	  for (var n=0; n<count; n++) {
		var c = this.Map.copyrights[n];
	    if (c.tilelayer_id == t.tilelayer_id){
		  //get the model menu and clone it
		  newCopyrightMenu = $('edit-copyrightlink').cloneNode(true);
		  //update the values
		  newCopyrightMenu.id = "edit-copyrightlink-"+n;
		  newCopyrightLink = newCopyrightMenu.getElementsByTagName("a").item(0);
		  newCopyrightLink.href = "javascript:BitMap.EditSession.editCopyright("+n+")";
		  newCopyrightLink.innerHTML = c.notice;
		  //add it to the copyrights menu
		  $('edit-copyright-menu').appendChild(newCopyrightMenu);
	  	  newCopyrightMenu.style.display = "block";
		}
	  }
	  BitMap.show('edit-tilelayer-actions');
	},

	"newTilelayer": function(i){
	  //i is the maptype_index
	  var count = this.Map.tilelayers.length;
	  for (n=0; n<count; n++){
	    if($('edit-tilelayerlink-'+n)){
	    BitMap.jscss('remove', $('edit-tilelayerlink-'+n), 'edit-select');
	    }
	  }
	  BitMap.jscss('add', $('edit-tilelayerlink-new'), 'edit-select');
	  var form = $('edit-tilelayer-form');
	  form.tilelayer_id.value = null;
	  form.array_n.value = null;
	  form.maptype_id.value = this.Map.maptypes[i].maptype_id;
	  form.reset();
	  BitMap.hide('edit-tilelayer-actions');  
	},


	"editCopyright": function(i){
	  //i is the tilelayer_index
	  BitMap.jscss('remove', $('edit-copyrightlink-new'), 'edit-select');
	  var a;
	  var count = this.Map.copyrights.length;
	  for (n=0; n<count; n++){
	    if($('edit-copyrightlink-'+n)){
		a = (n==i)?'add':'remove';
	    BitMap.jscss(a, $('edit-copyrightlink-'+n), 'edit-select');
	    }
	  }
	  var c = this.Map.copyrights[i];
	  //move the form to copyright being edited
	  copyrightTable = $('edit-copyright-table');
	  $('edit-copyrightlink-'+i).appendChild(copyrightTable);
	  var form = $('edit-copyright-form');
	  //change values
	  form.copyright_id.value = c.copyright_id;
	  form.array_n.value = i;
	  form.tilelayer_id.value = c.tilelayer_id;
	  form.copyright_minzoom.value = c.copyright_minzoom;
	  form.notice.value = c.notice;
	  form.bounds.value = c.bounds;
	  BitMap.show('edit-copyright-table');
	},

	
	"newCopyright": function(i){
	  //i is the tilelayer_index
	  var count = this.Map.copyrights.length;
	  for (n=0; n<count; n++){
	    if($('edit-copyrightlink-'+n)){
	    BitMap.jscss('remove', $('edit-copyrightlink-'+n), 'edit-select');
	    }
	  }
	  BitMap.jscss('add', $('edit-copyrightlink-new'), 'edit-select');
	  //move the form to copyright being edited
	  copyrightTable = $('edit-copyright-table');
	  $('edit-copyrightlink-new').appendChild(copyrightTable);
	  var form = $('edit-copyright-form');
	  form.copyright_id.value = null;
	  form.array_n.value = null;
	  form.tilelayer_id.value = this.Map.tilelayers[i].tilelayer_id;
	  form.reset();
	  BitMap.show('edit-copyright-table');
	},	



	
	"cancelEditMaptypes": function(){
	  //rescue our form tables lest we destroy them by accident
	  var elm = $('edit-copyright-table');
	  document.body.appendChild(elm);
	  this.canceledit('edit-tilelayers-table');
	  var elm = $('edit-tilelayers-table');
	  document.body.appendChild(elm);
	  this.canceledit('edit-maptype-options-table');
	  var elm = $('edit-maptype-options-table');
	  document.body.appendChild(elm);
	  this.canceledit('edit-maptypes-menu');
	  this.canceledit('edit-maptypes-table');
	  this.canceledit('edit-maptypes-cancel');
	  this.canceledit('editerror');
	},

	"cancelEditMaptypeOptions": function(){
	  this.cancelNewMaptype();
	  this.canceledit('edit-maptype-options-table');
	  this.canceledit('editerror');
	},
	
	"cancelNewMaptype": function(){
	  if( $('edit-maptype-new') ){ BitMap.hide('edit-maptype-new'); }
	},
	
	"cancelNewTilelayer": function(){
	  this.canceledit('edit-tilelayer-new');
	},
		
	"cancelEditTilelayers": function(){
	  BitMap.hide('edit-tilelayers-table');
	},

	"cancelNewCopyright": function(){
	  var elm = $('edit-copyright-table');
	  document.body.appendChild(elm);
	  BitMap.hide('edit-copyright-table');
	},
		
	"cancelEditCopyright": function(){
	  var elm = $('edit-copyright-table');
	  document.body.appendChild(elm);
	  BitMap.hide('edit-copyright-table');
	},





	
	
	/*******************
	 *
	 * MARKER FORM FUNCTIONS
	 *
	 *******************/
	
	"editMarkerSets": function(){
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
	},
	
	
	"cancelEditMarkerSets": function(){
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
	},
	
	
	"newMarkerSet": function(){
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
	},
	
	
	"cancelNewMarkerSet": function(){
	  if( $('edit-markerset-new') ){ BitMap.hide('edit-markerset-new'); }
	},
	
	
	"editMarkerSetOptions": function(i){
	  var a;
	  var count = this.Map.markersets.length;
	  //hilights the right set, unselects the others
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
	  form.description.value = s.description;
	  if (s.plot_on_load == false){ form.plot_on_load.options[0].selected=true; }else{form.plot_on_load.options[1].selected=true;};
	  if (s.side_panel == false){ form.side_panel.options[0].selected=true; }else{form.side_panel.options[1].selected=true;};
	  if (s.explode == false){ form.explode.options[0].selected=true }else{form.explode.options[1].selected=true};
	  if (s.cluster == false){ form.cluster.options[0].selected=true }else{form.cluster.options[1].selected=true};
	  if ( this.Map.markerstyles.length > 0 && form.style_id.options.length < (this.Map.markerstyles.length + 1) ){
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
	  if ( this.Map.iconstyles.length > 0 && form.icon_id.options.length < (this.Map.iconstyles.length + 1) ){
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
	},
	
	
	"cancelEditMarkerSetOptions": function(){
	  this.cancelNewMarkerSet();
	  this.canceledit('edit-markerset-options-table');
	  this.canceledit('editerror');
	},
	
	
	"editMarkers": function(i){
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
	},
	
	
	"newMarker": function(i){
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
	},
	
	
	"editMarker": function(i){
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
	  form.allow_comments.checked = (m.allow_comments == "y")?true:false;
	  
	  //update links
	  var formLinks = $('edit-marker-actions').getElementsByTagName("a");
	  formLinks.item(0).href = "javascript:BitMap.MapData[0].Map.markers["+i+"].gmarker.openInfoWindowHtml(BitMap.MapData[0].Map.markers["+i+"].gmarker.my_html);";
	  
	  BitMap.show('edit-marker-actions');
	},
	
	
	"cancelNewMarker": function(){
	  this.canceledit('edit-marker-new');
	},
	
	
	"cancelEditMarkers": function(){
	  BitMap.hide('edit-markers-table');
	},
	
	
	
	//@todo change this to editMarkerSet(n)
	"editSet": function(n){
					BitMap.show('setform_'+n);
	},
	
	

	/*******************
	 *
	 * MARKER STYLE FORM FUNCTIONS
	 *
	 *******************/

	"newMarkerStyle":function(){
		var count = this.Map.markerstyles.length;
		for (n=0; n<count; n++){
			if($('edit-markerstylelink-'+n)){
				BitMap.jscss('remove', $('edit-markerstylelink-'+n), 'edit-select');
			}
		}
		BitMap.jscss('add', $('edit-markerstylelink-new'), 'edit-select');
		var form = $('edit-markerstyle-form');
		form.style_id.value = null;
		form.style_array_n.value = null;
		form.reset();
	},
	
	"editMarkerStyle":function(i){
		BitMap.jscss('remove', $('edit-markerstylelink-new'), 'edit-select');
		var a;
		var count = this.Map.markerstyles.length;
		for (n=0; n<count; n++){
			if($('edit-markerstylelink-'+n)){
				a = (n==i)?'add':'remove';
				BitMap.jscss(a, $('edit-markerstylelink-'+n), 'edit-select');
			}
		}
		var m = this.Map.markerstyles[i];
		//change values
		var form = $('edit-markerstyle-form');
		form.style_id.value = m.style_id;
		form.style_array_n.value = i;
		form.name.value = m.name;
		form.marker_style_type.options[m.marker_style_type].selected = true;
		form.label_hover_opacity.value = m.label_hover_opacity;
		form.label_opacity.value = m.label_opacity;
		form.label_hover_styles.value = m.label_hover_styles;
		form.window_styles.value = m.window_styles;		
	},

	"editMarkerStyles": function(){
		BitMap.show('edit-markerstyles-table');
		BitMap.show('edit-markerstyles-cancel');
		
		var markerstyleTable = $('edit-markerstyle-table');
		//set some constants
		var linksList = markerstyleTable.getElementsByTagName("ul").item(0);
		var links = markerstyleTable.getElementsByTagName("li");
		//Clear all the existing markerstyles listed
		//We leave the first two, the first is the model we clone, the second is for a new markerstyle
		var count = links.length;
		for (n=count-1; n>1; n--){
			linksList.removeChild(links.item(n));
		}
		
		$('edit-markerstylelink-new-a').href = "javascript:BitMap.EditSession.newMarkerStyle();";
		//For each markerstyle, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.markerstyles.length; n++) {
			var m = this.Map.markerstyles[n];
			var newMarkerstyleli = links.item(0).cloneNode(true);
			newMarkerstyleli.id = 'edit-markerstylelink-'+n;
			var newMarkerstyleLink = newMarkerstyleli.getElementsByTagName("a").item(0);
			newMarkerstyleLink.href = "javascript:BitMap.EditSession.editMarkerStyle("+n+")";
			newMarkerstyleLink.innerHTML = m.name;
			linksList.appendChild(newMarkerstyleli);
			newMarkerstyleli.style.display = "block";
			
			if (firstselected != true){
				this.editMarkerStyle(n);
				firstselected = true;
			}			
		}
		if (firstselected == false){
			this.newMarkerStyle();
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-markerstyle-table');
	},

	"cancelEditMarkerStyles": function(){
	  BitMap.hide('edit-markerstyles-table');
	  BitMap.hide('edit-markerstyle-table');
	  BitMap.hide('edit-markerstyles-cancel');
	},


	/*******************
	 *
	 * ICON STYLE FORM FUNCTIONS
	 *
	 *******************/

	"newIconStyle":function(){
		var count = this.Map.iconstyles.length;
		for (n=0; n<count; n++){
			if($('edit-iconstylelink-'+n)){
				BitMap.jscss('remove', $('edit-iconstylelink-'+n), 'edit-select');
			}
		}
		BitMap.jscss('add', $('edit-iconstylelink-new'), 'edit-select');
		var form = $('edit-iconstyle-form');
		form.icon_id.value = null;
		form.style_array_n.value = null;
		form.reset();
	},
	
	"editIconStyle":function(i){
		BitMap.jscss('remove', $('edit-iconstylelink-new'), 'edit-select');
		var a;
		var count = this.Map.iconstyles.length;
		for (n=0; n<count; n++){
			if($('edit-iconstylelink-'+n)){
				a = (n==i)?'add':'remove';
				BitMap.jscss(a, $('edit-iconstylelink-'+n), 'edit-select');
			}
		}
		var m = this.Map.iconstyles[i];
		//change values
		var form = $('edit-iconstyle-form');
		form.icon_id.value = m.icon_id;
		form.style_array_n.value = i;
		form.name.value = m.name;
		/* form currently does not have a select since there is only one type available
		 * in the future if other icon types become available then this could be used
		 */
		//form.icon_style_type.options[m.icon_style_type].selected = true;		
		form.icon_image.value = m.image;		
		form.rollover_image.value = m.rollover_image;
		form.icon_w.value = m.icon_w;
		form.icon_h.value = m.icon_h;
		form.icon_anchor_x.value = m.icon_anchor_x;
		form.icon_anchor_y.value = m.icon_anchor_y;
		form.shadow_image.value = m.shadow_image;
		form.shadow_w.value = m.shadow_w;
		form.shadow_h.value = m.shadow_h;
		form.shadow_anchor_x.value = m.shadow_anchor_x;
		form.shadow_anchor_y.value = m.shadow_anchor_y;
		form.infowindow_anchor_x.value = m.infowindow_anchor_x;
		form.infowindow_anchor_y.value = m.infowindow_anchor_y;		
		
		/* The following are Google icon features not implemented 
		   because they are an annoying pain in the ass for most people.
		   The database supports them, but the form does not.
		   Maybe an "advanced" form is needed for anyone who
		   might want to deal with these headaches.
		*/
		/*
		form.print_image.value = m.print_image;
		form.moz_print_image.value = m.moz_print_image;
		form.transparent.value = m.transparent;
		form.print_shadow.value = m.print_shadow;
		*/		
	},

	"editIconStyles": function(){
		BitMap.show('edit-iconstyles-table');
		BitMap.show('edit-iconstyles-cancel');
		
		var iconstyleTable = $('edit-iconstyle-table');
		//set some constants
		var linksList = iconstyleTable.getElementsByTagName("ul").item(0);
		var links = iconstyleTable.getElementsByTagName("li");
		//Clear all the existing iconstyles listed
		//We leave the first two, the first is the model we clone, the second is for a new iconstyle
		var count = links.length;
		for (n=count-1; n>1; n--){
			linksList.removeChild(links.item(n));
		}
		
		$('edit-iconstylelink-new-a').href = "javascript:BitMap.EditSession.newIconStyle();";
		//For each iconstyle, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.iconstyles.length; n++) {
			var m = this.Map.iconstyles[n];
			var newIconstyleli = links.item(0).cloneNode(true);
			newIconstyleli.id = 'edit-iconstylelink-'+n;
			var newIconstyleLink = newIconstyleli.getElementsByTagName("a").item(0);
			newIconstyleLink.href = "javascript:BitMap.EditSession.editIconStyle("+n+")";
			newIconstyleLink.innerHTML = m.name;
			linksList.appendChild(newIconstyleli);
			newIconstyleli.style.display = "block";
			
			if (firstselected != true){
				this.editIconStyle(n);
				firstselected = true;
			}			
		}
		if (firstselected == false){
			this.newIconStyle();
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-iconstyle-table');
	},
	
	"cancelEditIconStyles": function(){
	  BitMap.hide('edit-iconstyles-table');
	  BitMap.hide('edit-iconstyle-table');
	  BitMap.hide('edit-iconstyles-cancel');
	},
	
	/*******************
	 *
	 * POLYLINE FORM FUNCTIONS
	 *
	 *******************/
	
	"newPolyline": function(){
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
	},
	
	
	
	"newPolylineSet": function(){
	    // Display the New Form Div
	   	BitMap.show('newpolylinesetform');
			// Reset the Form
			$('polylinesetform_new').reset();
	},
	
	
	
	/* @todo needs to support markers in bSLData as well as Map.Polylines */
	"editPolylines": function(){
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
	},
	
	
	
	"editPolylineSet": function(n){
			BitMap.show('plsetform_'+n);
	},
	
	
	"cancelPolylineEdit": function(){
			this.canceledit('editpolylinemenu'); 
			this.canceledit('newpolylineform');
			this.canceledit('editpolylineform'); 
			this.canceledit('editpolylinecancel');
			this.removeAssistant();
	},
	
	
	"editPolylineStyles": function(){
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
	},
	
	
	"newPolylineStyle": function(){
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
	},
	
	
	
	
	
	/*******************
	 *
	 * Polygon FORM FUNCTIONS
	 *
	 *******************/
	
	"newPolygon": function(){
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
	},
	
	
	
	"newPolygonSet": function(){
	    // Display the New Form Div
	   	BitMap.show('newpolygonsetform');
			// Reset the Form
			$('polygonsetform_new').reset();
	},
	
	
	
	
	
	/* @todo needs to support markers in bSLData as well as Map.Polylines */
	"editPolygons": function(){
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
	},
	
	
	
	"editPolygonSet": function(n){
			BitMap.show('pgsetform_'+n);
	},
	
	
	"cancelPolygonEdit": function(){
			this.canceledit('editpolygonmenu'); 
			this.canceledit('newpolygonform'); 
			this.canceledit('editpolygonform'); 
			this.canceledit('editpolygoncancel');
			this.removeAssistant();
	},
	
	
	"editPolygonStyles": function(){
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
	},
	
	
	"newPolygonStyle": function(){
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
	},
	
	
	
	
	
	
	
	/*******************
	 *
	 *  AJAX FUNCTIONS
	 *
	 *******************/

/*				
				BitMap.show('editerror');
				$('editerror').innerHTML = str;
*/

			 
		 "storeMap": function(f){
				doSimpleXMLHttpRequest("edit.php", f).addCallback( bind(this.updateMap, this) ); 
		 },
	
		 "storeMaptype": function(f){
				this.editObjectN = f.array_n.value;
		 		var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
				var callback = (f.maptype_id.value != "")?this.updateMaptype:this.addMaptype;
				doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeMaptype": function(f){
				this.editObjectN = f.array_n.value;
				this.editSetId = f.maptype_id.value;
		 		var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&gmap_id=" + this.Map.id + "&remove_maptype=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this) ); 
		 },
		 
		 "expungeMaptype": function(f){
				this.editObjectN = f.array_n.value;
				this.editSetId = f.maptype_id.value;
		 		var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&expunge_maptype=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this) ); 
		 },

		 "storeTilelayer": function(f){
		 		var str = "edit_tilelayer.php?" + queryString(f);
				this.editSetId = f.maptype_id.value;
				this.editObjectN = f.array_n.value;
				var callback = (f.tilelayer_id.value != "")?this.updateTilelayer:this.addTilelayer;
			  	doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeTilelayer": function(f){
				this.editSetId = f.set_id.value;
				this.editTilelayerId = f.tilelayer_id.value;
		 		var str = "edit_tilelayer.php?set_id=" + this.editSetId + "&tilelayer_id=" + this.editTilelayerId + "&remove_tilelayer=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveTilelayer, this) ); 
		 },
	
		 "expungeTilelayer": function(f){
				this.editSetId = f.set_id.value;
				this.editTilelayerId = f.tilelayer_id.value;
		 		var str = "edit_tilelayer.php?tilelayer_id=" + this.editTilelayerId + "&expunge_tilelayer=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveTilelayer, this) ); 
		 },

		 "storeCopyright": function(f){
		 		var str = "edit_copyright.php?" + queryString(f);
				this.editSetId = f.tilelayer_id.value;
				this.editObjectN = f.array_n.value;
				var callback = (f.copyright_id.value != "")?this.updateCopyright:this.addCopyright;
			  	doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeCopyright": function(f){
				this.editSetId = f.set_id.value;
				this.editCopyrightId = f.copyright_id.value;
		 		var str = "edit_copyright.php?set_id=" + this.editSetId + "&copyright_id=" + this.editCopyrightId + "&remove_copyright=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveCopyright, this) ); 
		 },
	
		 "expungeCopyright": function(f){
				this.editSetId = f.set_id.value;
				this.editCopyrightId = f.copyright_id.value;
		 		var str = "edit_copyright.php?copyright_id=" + this.editCopyrightId + "&expunge_copyright=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveCopyright, this) ); 
		 },

		 "storeMarker": function(f){
		 		var str = "edit_marker.php?" + queryString(f);
				this.editSetId = f.set_id.value;
				this.editObjectN = f.marker_array_n.value;
				var callback = (f.marker_id.value != "")?this.updateMarker:this.addMarker;
			  	doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeMarker": function(f){
				this.editSetId = f.set_id.value;
				this.editMarkerId = f.marker_id.value;
		 		var str = "edit_marker.php?set_id=" + this.editSetId + "&marker_id=" + this.editMarkerId + "&remove_marker=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) ); 
		 },
	
		 "expungeMarker": function(f){
				this.editSetId = f.set_id.value;
				this.editMarkerId = f.marker_id.value;
		 		var str = "edit_marker.php?marker_id=" + this.editMarkerId + "&expunge_marker=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) ); 
		 },
	
		 "storeMarkerSet": function(f){
		 		var str = "edit_markerset.php?" + queryString(f) + "&set_type=markers" + "&gmap_id=" + this.Map.id;
				this.editSetId = f.set_id.value;
				this.editObjectN = f.set_array_n.value;
				var callback = (f.set_id.value != "")?this.updateMarkerSet:this.addMarkerSet;
				doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
	
		 "removeMarkerSet": function(f){
				this.editSetId = f.set_id.value;
				var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_markerset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) ); 
		 },
	
		 "expungeMarkerSet": function(f){
				this.editSetId = f.set_id.value;
				var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&expunge_markerset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) ); 
		 },

		 "storeMarkerStyle": function(f){
		 		var str = "edit_markerstyle.php?" + queryString(f);
				this.editObjectN = f.style_array_n.value;
				var callback = (f.style_id.value != "")?this.updateMarkerStyle:this.addMarkerStyle;
				doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },

		 "storeIconStyle": function(f){
		 		var str = "edit_iconstyle.php?" + queryString(f);
				this.editObjectN = f.style_array_n.value;
				var callback = (f.icon_id.value != "")?this.updateIconStyle:this.addIconStyle;
				doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
	
		 "storeNewPolyline": function(f){
				this.editSetId = f.set_id.value;
		 		var str = "edit_polyline.php?" + queryString(f) + "&save_polyline=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolyline, this) );
		 },
		 
		 "storePolyline": function(f){
				this.editObjectN = f.polyline_array_n.value;
				doSimpleXMLHttpRequest("edit_polyline.php", f).addCallback( bind(this.updatePolyline, this) );
		 },
		 
		 "removePolyline": function(f){
				this.editSetId = f.set_id.value;
				this.editPolylineId = f.polyline_id.value;
		 		var str = "edit_polyline.php?set_id=" + this.editSetId + "&polyline_id=" + f.polyline_id.value + "&remove_polyline=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolyline, this) );
		 },
	
		 "expungePolyline": function(f){
				this.editSetId = f.set_id.value;
				this.editPolylineId = f.polyline_id.value;
		 		var str = "edit_polyline.php?polyline_id=" + f.polyline_id.value + "&expunge_polyline=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolyline, this) );
		 },
		 
		 "storeNewPolylineSet": function(f){
				this.canceledit('editerror');
		 		var str = "edit_polylineset.php?" + queryString(f) + "&set_type=polylines" + "&gmap_id=" + this.Map.id;
				doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolylineSet, this) );
		 },
	
		 "storePolylineSet": function(f){
				this.editSetId = f.set_id.value;
				this.editObjectN = f.set_array_n.value;
		 		var str = "edit_polylineset.php?" + queryString(f) + "&gmap_id=" + this.Map.id + "&save_polylineset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolylineSet, this) );
		 },
	
		 "removePolylineSet": function(f){
				this.editSetId = f.set_id.value;
		 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polylineset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolylineSet, this) );
		 },
		 
		 "expungePolylineSet": function(f){
				this.editSetId = f.set_id.value;
		 		var str = "edit_polylineset.php?set_id=" + f.set_id.value + "&expunge_polylineset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolylineSet, this) );
		 },
	
		 "storeNewPolylineStyle": function(f){
		 		var str = "edit_polylinestyle.php?" + queryString(f);
				doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolylineStyle, this) ); 
		 },
	
		 "storePolylineStyle": function(f){
				this.editObjectN = f.style_array_n.value;
		 		var str = "edit_polylinestyle.php?" + queryString(f);
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolylineStyle, this) ); 
		 },
		 
		 "storeNewPolygon": function(f){
				this.editSetId = f.set_id.value;
		 		var str = "edit_polygon.php?" + queryString(f) + "&save_polygon=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolygon, this) );
		 },
		 
		 "storePolygon": function(f){
				this.editObjectN = f.polygon_array_n.value;
				doSimpleXMLHttpRequest("edit_polygon.php", f).addCallback( bind(this.updatePolygon, this) );
		 },
		 
		 "removePolygon": function(f){
				this.editSetId = f.set_id.value;
				this.editPolygonId = f.polygon_id.value;
		 		var str = "edit_polygon.php?set_id=" + this.editSetId + "&polygon_id=" + f.polygon_id.value + "&remove_polygon=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygon, this) );
		 },
	
		 "expungePolygon": function(f){
				this.editSetId = f.set_id.value;
				this.editPolygonId = f.polygon_id.value;
		 		var str = "edit_polygon.php?polygon_id=" + f.polygon_id.value + "&expunge_polygon=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygon, this) );
		 },
		 
		 "storeNewPolygonSet": function(f){
				this.canceledit('editerror');
		 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
				doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolygonSet, this) );
		 },
	
		 "storePolygonSet": function(f){
				this.editSetId = f.set_id.value;
				this.editObjectN = f.set_array_n.value;
		 		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + this.Map.id + "&save_polygonset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolygonSet, this) );
		 },
	
		 "removePolygonSet": function(f){
				this.editSetId = f.set_id.value;
		 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polygonset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygonSet, this) );
		 },
		 
		 "expungePolygonSet": function(f){
				this.editSetId = f.set_id.value;
		 		var str = "edit_polygonset.php?set_id=" + f.set_id.value + "&expunge_polygonset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygonSet, this) );
		 },
	
		 "storeNewPolygonStyle": function(f){
		 		var str = "edit_polygonstyle.php?" + queryString(f);
				doSimpleXMLHttpRequest(str).addCallback( bind(this.addPolygonStyle, this) ); 
		 },
	
		 "storePolygonStyle": function(f){
				this.editObjectN = f.style_array_n.value;
		 		var str = "edit_polygonstyle.php?" + queryString(f);
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolygonStyle, this) ); 
		 },
	
	
	
	
	
	
	
	
		 
	
	/*******************
	 *
	 * POST XML Map Functions
	 *
	 *******************/	 
		 
		 "updateMap": function(rslt){
			var xml = rslt.responseXML;
	
			//shorten var names
			var id = xml.documentElement.getElementsByTagName('gmap_id');
			this.Map.id = id[0].firstChild.nodeValue;
			var t = xml.documentElement.getElementsByTagName('title');
			this.Map.title = t[0].firstChild.nodeValue;
			var d = xml.documentElement.getElementsByTagName('description');
			this.Map.description = d[0].firstChild.nodeValue;				
			var dt = xml.documentElement.getElementsByTagName('data');
			if ( dt[0].hasChildNodes() ){
				this.Map.data = dt[0].firstChild.nodeValue;
				var pdt = xml.documentElement.getElementsByTagName('parsed_data');
				this.Map.parsed_data = pdt[0].firstChild.nodeValue;
			}else{
				this.Map.data = "";
				this.Map.parsed_data = "";
			}
			var w = xml.documentElement.getElementsByTagName('width');
			this.Map.width = w[0].firstChild.nodeValue;
			var h = xml.documentElement.getElementsByTagName('height');
			this.Map.height = h[0].firstChild.nodeValue;			
			var lt = xml.documentElement.getElementsByTagName('lat');
			this.Map.center.lat = parseFloat(lt[0].firstChild.nodeValue);
			var ln = xml.documentElement.getElementsByTagName('lng');
			this.Map.center.lng = parseFloat(ln[0].firstChild.nodeValue);
			var z = xml.documentElement.getElementsByTagName('zoom');
			this.Map.zoom = parseInt(z[0].firstChild.nodeValue);
			var mt = xml.documentElement.getElementsByTagName('maptype');
			this.Map.maptype = parseInt(mt[0].firstChild.nodeValue);
			var sc = xml.documentElement.getElementsByTagName('zoom_control');
			this.Map.controls.zoom_control = sc[0].firstChild.nodeValue;
			var sm = xml.documentElement.getElementsByTagName('maptype_control');
			this.Map.controls.maptype_control = sm[0].firstChild.nodeValue;
			var oc = xml.documentElement.getElementsByTagName('overview_control');
			this.Map.controls.overview_control = oc[0].firstChild.nodeValue;
			var ss = xml.documentElement.getElementsByTagName('scale');
			this.Map.controls.scale = ss[0].firstChild.nodeValue;
			var com = xml.documentElement.getElementsByTagName('allow_comments');
			this.Map.allow_comments = com[0].firstChild.nodeValue;
	
			//replace everything	
			var maptile = $('mymaptitle');
			if (maptile){maptile.innerHTML=this.Map.title;}
			
			var mapdesc = $('mymapdesc');
			if (mapdesc){mapdesc.innerHTML=this.Map.description;}
			
			$('mapcontent').innerHTML = this.Map.parsed_data;

			var mapdiv = $(this.Map.mapdiv);
			if (this.Map.width != '0' && this.Map.width != 0){
			   var newWidth = this.Map.width + "px";
			}else{
			   var newWidth = 'auto';
			}
			if (this.Map.height != '0' && this.Map.height != 0){
			   var newHeight = this.Map.height + "px";
			}else{
			   var newHeight = 'auto';
			}

			if (mapdiv){
				mapdiv.style.width = newWidth; 
				mapdiv.style.height = newHeight; 
				this.Map.map.checkResize();
			}

			if (this.Map.maptype < 1){
				switch (this.Map.maptype){
					case 0: 
						this.Map.map.setMapType(G_NORMAL_MAP);
						break;
					case -1: 
						this.Map.map.setMapType(G_SATELLITE_MAP);
						break;
					case -2: 
						this.Map.map.setMapType(G_HYBRID_MAP);
						break;
				}
			}else{
			//insert check for maptype name in maptype array and set map to that
				var count = this.Map.maptypes.length;
				for (n=0; n<count; n++){
					if (this.Map.maptypes[n].maptype_id == this.Map.maptype){
						this.Map.map.setMapType(this.Map.maptypes[n].type);
					}
				}
			}
	
			//Add Map TYPE controls - buttons in the upper right corner
	  		if (this.Map.controls.maptype_control == 'true'){
	  		    this.Map.map.removeControl( this.Map.typeControl );
				this.Map.typeControl = new GMapTypeControl();
				this.Map.map.addControl( this.Map.typeControl );  
	  		}else{
	  		    this.Map.map.removeControl( this.Map.typeControl );
	  		}
	  		
	  		//Add Scale controls
	  		if (this.Map.controls.scale == 'true'){
	  		    this.Map.map.removeControl( this.Map.scaleControl );
				this.Map.scaleControl = new GScaleControl();
	  		    this.Map.map.addControl( this.Map.scaleControl );
	  		}else{
	  		    this.Map.map.removeControl( this.Map.scaleControl );
	  		}
	  		
			//Add Navigation controls
	  		this.Map.map.removeControl( this.Map.navControls );
			switch (this.Map.controls.zoom_control){
				case 's': 
					this.Map.navControls = new GSmallMapControl();
					break;
				case 'l': 
					this.Map.navControls = new GLargeMapControl();
					break;
				case 'z': 
					this.Map.navControls = new GSmallZoomControl();
					break;
				default:
					this.Map.navControls = null;
					break;
			}
			if ( this.Map.navControls != null ){
				this.Map.map.addControl( this.Map.navControls );
			}
	  		
			this.Map.map.setCenter(new GLatLng(this.Map.center.lat, this.Map.center.lng), this.Map.zoom);				
			this.editMap();
		 },
	
	
	
		 "addMaptype": function(rslt){
	     	var xml = rslt.responseXML;	
			// create a spot for a new maptype in the data array
			var n = this.Map.maptypes.length;
			var m = this.Map.maptypes[n] = new Array();
	
			//add the xml data to the marker record
			this.parseMaptypeXML(m, xml);
			m.maptype_node = n;
			
			// attach the new map type to the map
			/*
			this.Map.addMaptype();
			*/

			// set the map type to active
			/*
			this.Map.map.setMaptype(this.Map.maptypes[n].name);
			*/

			// update the controls
			/*
			this.Map.map.removeControl(typecontrols);
			this.Map.map.addControl(typecontrols);
			*/
			
			this.cancelEditMaptypes();
			this.editMaptypes();
			this.editMaptypeTilelayers(n);
		 },
	
		 
		 "updateMaptype": function(rslt){
	      	var xml = rslt.responseXML;
			var n = this.editObjectN;
			//clear maptype in this location from the Map array of Types
			var m = this.Map.maptypes[n] = new Array();
	
			//add the xml data to the marker record
			this.parseMaptypeXML(m, xml);
			m.maptype_node = n;
			
			//@todo remove the maptype from the map
			//@todo re-add the maptype to the map			
			// set the map type to active
			//this.Map.map.setMaptype( this.Map.maptypes[this.Map.maptypes[n].name] );
			
			// update the maptype
			this.editMaptypeTilelayers(n);		
		 },
	
		"parseMaptypeXML": function(m, xml){
			// assign map type values data array				
			var id = xml.documentElement.getElementsByTagName('maptype_id');			
			m.maptype_id = parseInt( id[0].firstChild.nodeValue );
			var nm = xml.documentElement.getElementsByTagName('name');			
			m.name = nm[0].firstChild.nodeValue;
			var snm = xml.documentElement.getElementsByTagName('shortname');			
			m.shortname = snm[0].firstChild.nodeValue;
			var ds = xml.documentElement.getElementsByTagName('description');			
			m.description = ds[0].firstChild.nodeValue;	  		
			var minz = xml.documentElement.getElementsByTagName('minzoom');
			m.minzoom = parseInt( minz[0].firstChild.nodeValue );
			var mz = xml.documentElement.getElementsByTagName('maxzoom');
			m.maxzoom = parseInt( mz[0].firstChild.nodeValue );
			var er = xml.documentElement.getElementsByTagName('errormsg');			
			m.errormsg = er[0].firstChild.nodeValue;
		},
		 
		 "updateRemoveMaptype": function(rslt){
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
		 },
		 
		 

	"addTilelayer": function(rslt){	
	    var xml = rslt.responseXML;

		//the tilelayer data we are changing		
		var n = this.Map.tilelayers.length;		
		var t = this.Map.tilelayers[n] = {};

		//add the xml data to the marker record
		this.parseTilelayerXML(t, xml);
		t.maptype_id = this.editSetId;

		var s;
		var mts = this.Map.maptypes;
		for(a=0; a<mts.length; a++){
			if ( ( mts[a] != null ) && ( mts[a].maptype_id == this.editSetId ) ){
				s = a;
				break;
			}
		};

		//remove the related maptype
		//re-add the maptype
		//add the tilelayer
		/*  *******  */
		// probably needs a ref to parent maptype
		/*  *******  */
		//this.Map.addTilelayer(n);

		// update the maptypes menus
		this.editMaptypeTilelayers(s);
		this.editTilelayer(n);
	},
	
	"updateTilelayer": function(rslt){
	    var xml = rslt.responseXML;
		//the marker data we are changing
		var n = this.editObjectN;
		var t = this.Map.tilelayers[n];

		//add the xml data to the marker record
		this.parseTilelayerXML(t, xml);
		t.maptype_id = this.editSetId;

		var s;
		var mts = this.Map.maptypes;
		for(a=0; a<mts.length; a++){
			if ( ( mts[a] != null ) && ( mts[a].maptype_id == this.editSetId ) ){
				s = a;
				break;
			}
		};
		
		//remove the related maptype
		//re-add the maptype
		/*  *******  */
		// probably needs a ref to parent maptype
		/*  *******  */
		//add the tilelayer
		//this.Map.addTilelayer(n);
		
		// update the maptypes menus
		this.editMaptypeTilelayers(s);
		this.editTilelayer(n);
	},
	
	"parseTilelayerXML": function(tl, xml){
		// assign map type values data array				
		var id = xml.documentElement.getElementsByTagName('tilelayer_id');			
		tl.tilelayer_id = parseInt( id[0].firstChild.nodeValue );
		var nm = xml.documentElement.getElementsByTagName('tiles_name');			
		tl.tiles_name = nm[0].firstChild.nodeValue;
		var minz = xml.documentElement.getElementsByTagName('tiles_minzoom');
		tl.tiles_minzoom = parseInt( minz[0].firstChild.nodeValue );
		var mz = xml.documentElement.getElementsByTagName('tiles_maxzoom');
		tl.tiles_maxzoom = parseInt( mz[0].firstChild.nodeValue );		
		var png = xml.documentElement.getElementsByTagName('ispng');
		tl.ispng = png[0].firstChild.nodeValue;
		var url = xml.documentElement.getElementsByTagName('tilesurl');
		tl.tilesurl = url[0].firstChild.nodeValue;
		var op = xml.documentElement.getElementsByTagName('opacity');
		tl.opacity = parseFloat( op[0].firstChild.nodeValue );
	},

	"updateRemoveTilelayer": function(){
			for (var n=0; n<this.Map.tilelayers.length; n++){
				if ( ( this.Map.tilelayers[n] != null ) && ( this.Map.maptypes[i].tilelayers[n].marker_id == this.editSetId ) ){
					/*  *******  */
					// remove layer from related maptype and update maptype on map
					/*  *******  */
					this.Map.tilelayers[n] = null;
				}
			}
			this.editMaptype(editSetId);
			this.editTilelayers();
	},

	"addCopyright":function(rslt){
	    var xml = rslt.responseXML;
		//the copyright data we are adding
		var n = this.Map.copyrights.length;
		var c = this.Map.copyrights[n] = {};

		//add the xml data to the marker record
		this.parseCopyrightXML(c, xml);
		c.tilelayer_id = this.editSetId;
		var s;
		var tls = this.Map.tilelayers;
		for(a=0; a<tls.length; a++){
			if ( ( tls[a] != null ) && ( tls[a].tilelayer_id == this.editSetId ) ){
				s = a;
				break;
			}
		};
		
		//remove the related maptype
		//re-add the maptype
		
		// update the tilelayers menus
		this.editTilelayer(s);
		this.editCopyright(n);
	},
	
	"updateCopyright":function(rslt){
	    var xml = rslt.responseXML;
		//the copyright data we are changing
		var n = this.editObjectN;
		var c = this.Map.copyrights[n];

		//add the xml data to the marker record
		this.parseCopyrightXML(c, xml);
		c.tilelayer_id = this.editSetId;

		var s;
		var tls = this.Map.tilelayers;
		for(a=0; a<tls.length; a++){
			if ( ( tls[a] != null ) && ( tls[a].tilelayer_id == this.editSetId ) ){
				s = a;
				break;
			}
		};
		
		//remove the related maptype
		//re-add the maptype
		
		// update the tilelayers menus
		this.editTilelayer(s);
		this.editCopyright(n);
	},
	
	"parseCopyrightXML":function(c, xml){
		// assign map type values data array				
		var id = xml.documentElement.getElementsByTagName('copyright_id');			
		c.copyright_id = parseInt( id[0].firstChild.nodeValue );
		var minz = xml.documentElement.getElementsByTagName('copyright_minzoom');
		c.copyright_minzoom = parseInt( minz[0].firstChild.nodeValue );
		var bds = xml.documentElement.getElementsByTagName('bounds');
		c.bounds = bds[0].firstChild.nodeValue;
		var nt = xml.documentElement.getElementsByTagName('notice');
		c.notice = nt[0].firstChild.nodeValue;
	},
	
	"updateRemoveCopyright":function(){
		var n = this.editObjectN;
		this.Map.copyrights[n] = null;

		//remove the related maptype
		//re-add the maptype
	
		this.cancelEditCopyright();
		this.editTilelayer(s);	
	},




		 
	/*******************
	 *
	 * POST XML Marker Functions
	 *
	 *******************/	 
	
	"addMarker": function(rslt){
	    var xml = rslt.responseXML;

		//the marker data we are changing
		var n = this.Map.markers.length;
		
		//this.Map.markers[n] = {};
		var m = this.Map.markers[n] = {};

		//add the xml data to the marker record
		this.parseMarkerXML(m, xml);

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
		this.Map.addMarker(n);

		this.removeAssistant();
		// update the sets menus
		this.editMarkers(s);
		this.editMarker(n);
	},
	
	"updateMarker": function(rslt){
	    var xml = rslt.responseXML;							
		//the marker data we are changing
		var n = this.editObjectN;
		var m = this.Map.markers[n];

		//add the xml data to the marker record
		this.parseMarkerXML(m, xml);

		//unload the marker
		if ( m.gmarker ){ this.Map.map.removeOverlay( m.gmarker ) };
		//remake the marker
		this.Map.addMarker(n);
		//remove the assistant if used
		this.removeAssistant();

		var s;
		for(a=0; a<this.Map.markersets.length; a++){
			if ( ( this.Map.markersets[a] != null ) && ( this.Map.markersets[a].set_id == this.editSetId ) ){
				s = a;
			}
		};
		this.editMarkers(s);
		this.editMarker(n);
	},
	
	"parseMarkerXML": function(m, xml){
		//shorten var names
		var id = xml.documentElement.getElementsByTagName('id');			
		m.marker_id = id[0].firstChild.nodeValue;
		var tl = xml.documentElement.getElementsByTagName('title');
		m.title = tl[0].firstChild.nodeValue;			
		var ty = xml.documentElement.getElementsByTagName('marker_type');			
		m.marker_type = ty[0].firstChild.nodeValue;
		var lt = xml.documentElement.getElementsByTagName('lat');
		m.lat = parseFloat(lt[0].firstChild.nodeValue);
		var ln = xml.documentElement.getElementsByTagName('lng');
		m.lng = parseFloat(ln[0].firstChild.nodeValue);
		var dt = xml.documentElement.getElementsByTagName('data');
		m.data = dt[0].firstChild.nodeValue;			
		var pdt = xml.documentElement.getElementsByTagName('parsed_data');
		m.parsed_data = pdt[0].firstChild.nodeValue;
		var l = xml.documentElement.getElementsByTagName('label');
		m.label_data = ( l[0].firstChild != null )?l[0].firstChild.nodeValue:'';
		var pu = xml.documentElement.getElementsByTagName('photo_url');
		m.photo_url = ( pu[0].firstChild != null )?pu[0].firstChild.nodeValue:'';
		//var z = xml.documentElement.getElementsByTagName('z');
		//m.zindex = parseInt(z[0].firstChild.nodeValue);	
		var com = xml.documentElement.getElementsByTagName('allow_comments');
		m.allow_comments = com[0].firstChild.nodeValue;
	},
		 	 
	
		 
	
	"addMarkerSet": function(rslt){
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
				 BitMap.hide('edit-markerset-new');
				
				// update the sets menus
				this.cancelEditMarkerSets();
				this.editMarkerSets();
				this.editMarkers(n);
	},
		
	
	
	"updateMarkerSet": function(rslt){
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
							this.Map.addMarker(n);
						}
					}
				}
			}
		}
		
		// update the sets menus
		this.editMarkerSetOptions(this.editObjectN);
	},
	
	
	//this needs special attention
	"updateRemoveMarker": function(){
			for (var n=0; n<this.Map.markers.length; n++){
				if ( ( this.Map.markers[n] != null ) && ( this.Map.markers[n].marker_id == this.editMarkerId ) ){
					this.Map.map.removeOverlay(this.Map.markers[n].marker);
					this.Map.markers[n].marker = null;
					this.Map.markers[n] = null;
				}
			}
			this.editMarkers();
			this.editSet(editSetId);
	},
	
	
	
	"updateRemoveMarkerSet": function(){
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
	},
		
	
	
	"addMarkerStyle": function(rslt){
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
				
		// update the styles menus
		this.editMarkerStyles();
	},
	
	
	
	"updateMarkerStyle": function(rslt){
		var xml = rslt.responseXML;
		//get the style we are updating
		var s = this.Map.markerstyles[this.editObjectN];
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

		// update the styles menus
		this.editMarkerStyles();
		
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
					this.addMarker(n);
				}
			}
		}
	},
	
		
	
	
	
	"addIconStyle": function(rslt){
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

		//make the icon available
		if (i.icon_style_type == 0) {
			this.Map.defineGIcon(n);
		}
		
		// update the styles menus
		this.editIconStyles();
	},
	
	
		
	"updateIconStyle": function(rslt){
		var xml = rslt.responseXML;
		
		//get the style we are updating
		var i = this.Map.iconstyles[this.editObjectN];
		
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

		// update the styles menus
		this.editIconStyles();
		
		//update the icon
		if (i.icon_style_type == 0) {
			this.Map.defineGIcon(this.editObjectN);
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
					this.addMarker(n);
				}
			}
		}		
	},
	
	
	
	
	
		
	/*******************
	 *
	 * POST XML Polyline Functions
	 *
	 *******************/	 
	
	"addPolyline": function(rslt){
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
	},
	
	
	
	
	"updatePolyline": function(rslt){
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
	},
	
	
		
		 "addPolylineSet": function(rslt){
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
		 },
	
	
	
	
		"updatePolylineSet": function(rslt){
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
		},
		
	
	
	
		 "addPolylineStyle": function(rslt){
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
		 },
	
	
	
		 "updatePolylineStyle": function(rslt){
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
		 },
	
	
	
		
	"updateRemovePolyline": function(){
		for (var i=0; i<this.Map.polylines.length; i++){
			if ( Map.Polylines[i] != null && this.Map.polylines[n].polyline != null && this.Map.polylines[i].polyline_id == this.editPolylineId ){
				this.Map.map.removeOverlay(this.Map.polylines[i].polyline);
				this.Map.polylines[i].polyline = null;
				this.Map.polylines[i] = null;
			}
		}
		this.editPolylines();
		this.editPolylineSet(editSetId);
	},
	
	
	
	//this needs special attention
	"updateRemovePolylineSet": function(){
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
	},
	
	
	
	
	
	
	/*******************
	 *
	 * POST XML Polygon Functions
	 *
	 *******************/	 
	
	"addPolygon": function(rslt){
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
	},
	
	
	
	"updatePolygon": function(rslt){
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
	},
	
	
	
	
	"addPolygonSet": function(rslt){
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
	},
	
	
	
	
	"updatePolygonSet": function(rslt){
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
	},
	
	
	
	"addPolygonStyle": function(rslt){
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
	},
	
	
	
	"updatePolygonStyle": function(rslt){
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
	},
	
	
	
	"updateRemovePolygon": function(){
		for (var n=0; n<this.Map.polygons.length; n++){
			if ( this.Map.polygons[n] != null && this.Map.polygons[n].polygon != null && this.Map.polygons[n].polygon_id == this.editPolygonId ){
				this.Map.map.removeOverlay(this.Map.polygons[n].polygon);
				this.Map.polygons[n].polygon = null;
				this.Map.polygons[n] = null;
			}
		}
		this.editPolygons();
		this.editPolygonSet(this.editSetId);
	},
	
	
	"updateRemovePolygonSet": function(){
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
	},
	
	
	
	
	
		
	/******************
	 *
	 *  Editing Tools
	 *
	 ******************/
	
	"addAssistant": function(a, b){
	 	this.removeAssistant();
	 	//polyline assistant
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
	
	 	//polygon assistant
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

	 	//marker assistant		
		if (a == 'marker'){
			var f = $('edit-marker-form');
			alert ('Marker ploting assistant activated for '+ f.title.value + ' marker. \n Click to Position!');

			this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay, point){
			  if (point) {
				if (this.TempOverlay != null) {
					this.removeOverlay(this.TempOverlay);
				}
				this.TempOverlay = new GMarker(point);
				this.addOverlay(this.TempOverlay);
				this.panTo(point);
				f['geo[lng]'].value = point.lng();
				f['geo[lat]'].value = point.lat();
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
	},
	
		
	"removeAssistant": function(){
	    if (this.bAssistant != null){
	        this.Map.map.removeOverlay( this.TempOverlay );
	   	    GEvent.removeListener(this.bAssistant);
	  		this.bAssistant = null;
		 }
	 }
}
/* End BitMap.Edit.prototype declaration */
