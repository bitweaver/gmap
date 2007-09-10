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

// We use Mochikit library for AJAX and substitute getElementById with '$()'
// MAP EDITING FUNCTIONS

BitMap.Edit = function(){
	this.SPINNER = $('spinner');
	this.SPINNER_TEXT = $('spinner-text');
	this.SPINNER_TEXT_ORG = this.SPINNER_TEXT.innerHTML;
	this.Map = BitMap.MapData[0].Map;
	// for tracking which object we are updating
	this.editArray;
	this.editObjectN;
	this._setIndexRef;				//a reference to the array index of a set being edited - used in ajax callbacks
	this._setIdRef;					//a reference to the id of a set being edited - used in ajax callbacks
	this._markerIndexRef;			//a reference to the array index of a marker being edited - used in ajax callbacks
	this._markerIdRef;				//a reference to the id of a marker being edited - used in ajax callbacks
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
	"positionSpinner": function(){
		var pageDimensions = MochiKit.Style.getViewportDimensions();
		var arrayPageScroll = this.getPageScrollTop();
		var spinnerDimensions = MochiKit.Style.getElementDimensions(this.SPINNER);
		MochiKit.Style.setStyle("spinner", {"top":((arrayPageScroll[1] + (pageDimensions.h-spinnerDimensions.h)/2)+"px")});
	},
	
	"getPageScrollTop": function(){
		var yScrolltop;
		var xScrollleft;
		if (self.pageYOffset || self.pageXOffset) {
			yScrolltop = self.pageYOffset;
			xScrollleft = self.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop || document.documentElement.scrollLeft ){	 // Explorer 6 Strict
			yScrolltop = document.documentElement.scrollTop;
			xScrollleft = document.documentElement.scrollLeft;
		} else if (document.body) {// all other Explorers
			yScrolltop = document.body.scrollTop;
			xScrollleft = document.body.scrollLeft;
		}
		arrayPageScroll = new Array(xScrollleft,yScrolltop) 
		return arrayPageScroll;
	},

	"showSpinner": function(str){
		this.SPINNER_TEXT.innerHTML = (str!=null)?str:this.SPINNER_TEXT_ORG;
		this.positionSpinner();
		this.SPINNER.style.display="block";
	},
	
	"hideSpinner": function(str){
		this.SPINNER_TEXT.innerHTML = (str!=null)?str:this.SPINNER_TEXT.innerHTML;
		/*	this would be useful but 
			regeneration of the edit 
			forms is pushing the 
			spinner div to the bottom 
			of the page when we leave it 
			visible for an extra second
		*/
		//setTimeout("this.SPINNER.style.display='none'", 1000);
		this.SPINNER.style.display="none";
	},
	
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
	
	"executeJavascript": function(element) {
		//var element = MochiKit.DOM.getElement(element);
		if (element) {
		  var st = element.getElementsByTagName("SCRIPT");
		  var string_to_execute;
		  for (var i=0;i<st.length; i++) {
			string_to_execute = st[i].innerHTML;
			try {
			  eval(string_to_execute.split("<!--").join("").split("-->").join(""));
			} catch(e) {
			  MochiKit.Logging.log(e);
			} // end try
		  } // end for
		} // end if
	},
	
	
	
	/*******************
	 *
	 * MAP FORM FUNCTIONS
	 *
	 *******************/
	
	"editMap": function(id){
		doSimpleXMLHttpRequest("edit_map.php", {gmap_id:id}).addCallback( bind(this.editMapCallback, this) ); 
	},

	"editMapCallback": function(rslt){
		var mapForm = $('map-form');
	    mapForm.innerHTML = rslt.responseText;
	    this.executeJavascript(mapForm);
		BitMap.show('map-form');
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
	    BitMap.Utl.JSCSS('remove', $('edit-markerset-'+n), 'edit-selected');
	  }
	
	  if( !$('edit-markerset-new') ){
	    var newMarkerSet = $('edit-markerset').cloneNode(true);
	    newMarkerSet.id = "edit-markerset-new";
	    newMarkerSet.getElementsByTagName("span").item(0).innerHTML = "New Marker Set";
	    var tdtags = newMarkerSet.getElementsByTagName("td");
	    tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
	    $('edit-markers-menu').appendChild(newMarkerSet);
	  }
	  
	  BitMap.Utl.JSCSS('add', $('edit-markerset-new'), 'edit-selected');
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
	    BitMap.Utl.JSCSS(a, $('edit-markerset-'+n), 'edit-selected');
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
		//build a list of markers
		
		//make sure the new marker set form is closed
		this.cancelNewMarkerSet();
		var a;
		var count = this.Map.markersets.length;
		for (n=0; n<count; n++){
			a = (n==i)?'add':'remove';
			BitMap.Utl.JSCSS(a, $('edit-markerset-'+n), 'edit-selected');
		}
		//make sure the marker set options form is closed
		this.cancelEditMarkerSetOptions();

		//get the set id of markers we are editing		
		var set_id = this.Map.markersets[i].set_id;    

		

		//@TODO eventually replace building the markers list with an ajax call to a tpl - not a priority now		
		//set some constants
		var markerTable = $('edit-markers-table');
		var markerLinksList = markerTable.getElementsByTagName("ul").item(0);
		var markerLinks = markerTable.getElementsByTagName("li");
		//Clear all the existing markers listed  
		//We leave the first two, the first is the model we clone, the second if for a new marker
		var count = markerLinks.length;
			for (n=count-1; n>1; n--){
				markerLinksList.removeChild(markerLinks.item(n));
			}
		
			$('edit-markerlink-new-a').href = "javascript:BitMap.EditSession.editMarker(null, "+i+");";
			//For each marker in our new set, add a link
			var firstselected = false;
			for (var n=0; n<this.Map.markers.length; n++) {
			var m = this.Map.markers[n];
			if (m.set_id == set_id){
				var newMarkerli = markerLinks.item(0).cloneNode(true);
				newMarkerli.id = 'edit-markerlink-'+n;
				var newMarkerLink = newMarkerli.getElementsByTagName("a").item(0);
				newMarkerLink.href = "javascript:BitMap.EditSession.editMarker("+n+","+i+")";
				newMarkerLink.innerHTML = m.title;
				markerLinksList.appendChild(newMarkerli);
				newMarkerli.style.display = "block";
			
				if (firstselected != true){
					//else ajax up a form with the info from the first marker in the list
					this.editMarker(n, i);
					firstselected = true;
				}
			}
		}
		
		if (firstselected == false){
			//if the list is 0 - ajax up an empty form
			this.editMarker(null, i);
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-markers-table')
	},
	

/* DEPRECATED	
	"newMarker": function(i){
	  //i is the set_index
	  var count = this.Map.markers.length;
	  for (n=0; n<count; n++){
	    if($('edit-markerlink-'+n)){
	    BitMap.Utl.JSCSS('remove', $('edit-markerlink-'+n), 'edit-select');
	    }
	  }
	  BitMap.Utl.JSCSS('add', $('edit-markerlink-new'), 'edit-select');
	  var form = $('edit-marker-form');
	  form.marker_id.value = null;
	  form.marker_array_n.value = null;
	  form.set_id.value = this.Map.markersets[i].set_id;
	  form.reset();
	  BitMap.hide('edit-marker-actions');  
	},
*/	
	
	"editMarker": function(m_i, s_i){
		var id = null
		this._setIndexRef = s_i;
		this._setIdRef = this.Map.markersets[s_i].set_id;
		this._markerIndexRef = m_i;

		//move the form container to the correct set div
		if ( m_i != null ){
			var m = this.Map.markers[m_i];
			this._markerIdRef = id = m.marker_id;
	
			//update action links with marker specific ref
			var formLinks = $('edit-marker-actions').getElementsByTagName("a");
			formLinks.item(0).href = "javascript:BitMap.MapData[0].Map.markers["+m_i+"].gmarker.openInfoWindowHtml(BitMap.MapData[0].Map.markers["+m_i+"].gmarker.my_html);";
			BitMap.show('edit-marker-actions');
		}
		
		var markersTable = $('edit-markers-table');
		$('edit-markerset-'+s_i).appendChild(markersTable);
		
		//hilight selected marker link - unhilight others
		var a = (m_i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-markerlink-new'), 'edit-select');
		
		var count = this.Map.markers.length;
		for (n=0; n<count; n++){
			if($('edit-markerlink-'+n)){
				a = (n==m_i)?'add':'remove';
				BitMap.Utl.JSCSS(a, $('edit-markerlink-'+n), 'edit-select');
			}
		}
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_marker.php", {marker_id:id, set_id:this._setIdRef}).addCallback( bind(this.editMarkerCallback, this) );
	},
	
	"editMarkerCallback": function(rslt){
		var markerForm = $('marker-form');
		markerForm.innerHTML = rslt.responseText;
		this.executeJavascript($('markerForm'));
		setupAllTabs();
		BitMap.show('edit-markers-table');		
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
	 *  AJAX FUNCTIONS
	 *
	 *******************/

/*				
				BitMap.show('editerror');
				$('editerror').innerHTML = str;
*/

			 
		 "storeMap": function(f){
		 		this.showSpinner("Saving Map...");
				doSimpleXMLHttpRequest("edit.php", f).addCallback( bind(this.updateMap, this) ); 
		 },

		 "storeMarker": function(f){
		 		this.showSpinner("Saving Marker...");
		 		var str = "edit_marker.php?" + queryString(f);
				this._setIdRef = f.set_id.value;
				this.editObjectN = this._markerIndexRef; //f.marker_array_n.value;
				var callback = (f.marker_id.value != "")?this.updateMarker:this.addMarker;
			  	doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeMarker": function(f){
		 		this.showSpinner("Removing Marker...");
				this._setIdRef = f.set_id.value;
				this.editMarkerId = f.marker_id.value;
		 		var str = "edit_marker.php?set_id=" + this._setIdRef + "&marker_id=" + this.editMarkerId + "&remove_marker=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) ); 
		 },
	
		 "expungeMarker": function(f){
		 		this.showSpinner("Deleting Marker...");
				this._setIdRef = f.set_id.value;
				this.editMarkerId = f.marker_id.value;
		 		var str = "edit_marker.php?marker_id=" + this.editMarkerId + "&expunge_marker=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) ); 
		 },
	
		 "storeMarkerSet": function(f){
		 		this.showSpinner("Saving Markerset...");
		 		var str = "edit_markerset.php?" + queryString(f) + "&set_type=markers" + "&gmap_id=" + this.Map.id;
				this._setIdRef = f.set_id.value;
				this.editObjectN = f.set_array_n.value;
				var callback = (f.set_id.value != "")?this.updateMarkerSet:this.addMarkerSet;
				doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
	
		 "removeMarkerSet": function(f){
		 		this.showSpinner("Removing Markerset...");
				this._setIdRef = f.set_id.value;
				var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_markerset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) ); 
		 },
	
		 "expungeMarkerSet": function(f){
		 		this.showSpinner("Deleting Markerset...");
				this._setIdRef = f.set_id.value;
				var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&expunge_markerset=true";
				doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) ); 
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
			this.hideSpinner("DONE!");
			this.editMap();			
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
			if ( ( this.Map.markersets[a] != null ) && ( this.Map.markersets[a].set_id == this._setIdRef ) ){
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
		this.hideSpinner("DONE!");
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
			if ( ( this.Map.markersets[a] != null ) && ( this.Map.markersets[a].set_id == this._setIdRef ) ){
				s = a;
			}
		};
		this.hideSpinner("DONE!");
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
		
		this.hideSpinner("DONE!");
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
		
		this.hideSpinner("DONE!");
		// update the sets menus
		this.editMarkerSetOptions(this.editObjectN);
	},
	
	
	//this needs special attention
	"updateRemoveMarker": function(rslt){
		for (var n=0; n<this.Map.markers.length; n++){
			if ( ( this.Map.markers[n] != null ) && ( this.Map.markers[n].marker_id == this.editMarkerId ) ){
				this.Map.map.removeOverlay(this.Map.markers[n].marker);
				this.Map.markers[n].marker = null;
				this.Map.markers[n] = null;
			}
		}
		this.hideSpinner("DONE!");
		this.editMarkers();
		this.editSet(this._setIdRef);
	},
	
	
	
	"updateRemoveMarkerSet": function(){
	  	for (var n=0; n<this.Map.markers.length; n++){
	  		if ( ( this.Map.markers[n] != null ) && ( this.Map.markers[n].set_id == this._setIdRef ) && ( this.Map.markers[n].marker != null ) ){
					this.Map.map.removeOverlay(this.Map.markers[n].marker); 			
					this.Map.markers[n].marker = null;
					this.Map.markers[n] = null;
	  		}
	  	}
		for (var s=0; s<this.Map.markersets.length; s++){
	  		if ( ( this.Map.markersets[s] != null ) && ( this.Map.markersets[s].set_id == this._setIdRef ) ){
	      		var getElem = "markerset_"+this.Map.markersets[s].set_id;
	      		if ( $(getElem) ) {
	         		var extraMarkerForm = $(getElem);
	      			$('editmarkerform').removeChild(extraMarkerForm);
	      		}
					this.Map.markersets[s].set_id = null;
	  			this.Map.markersets[s] = null;
	  		}
		}
		this.hideSpinner("DONE!");
		this.editMarkers();
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
