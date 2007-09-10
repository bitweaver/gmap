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
				newMarkerSet.getElementsByTagName("a").item(0).href = "javascript:BitMap.EditSession.editMarkerSet("+n+");";
				newMarkerSet.getElementsByTagName("a").item(1).href = "javascript:BitMap.EditSession.editMarkers("+n+");";
				$('edit-markersets-table').appendChild(newMarkerSet);
				BitMap.show('edit-markerset-'+n);
			}
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

	  this.removeAssistant(); 
	  this.canceledit('editerror');
	},

	
	"editMarkerSet": function(i){
		this.cancelEditMarkers();
		
		this._setIdRef = null;
		
		//set set menu highlighting
		var a = (i != null)?'remove':'add';
		if($('edit-markerset-new')){
			BitMap.Utl.JSCSS(a, $('edit-markerset-new'), 'edit-selected');
		}
		
		var count = this.Map.markersets.length;
		for (n=0; n<count; n++){
			if($('edit-markerset-'+n)){
				a = (n==i)?'add':'remove';
				BitMap.Utl.JSCSS(a, $('edit-markerset-'+n), 'edit-selected');
			}
		}

		//null is a new set
		if ( i == null ){
			i = "new";
			this.editObjectN = null;
			
			if( !$('edit-markerset-new') ){
				var newMarkerSet = $('edit-markerset').cloneNode(true);
				newMarkerSet.id = "edit-markerset-new";
				newMarkerSet.getElementsByTagName("span").item(0).innerHTML = "New Marker Set";
				var tdtags = newMarkerSet.getElementsByTagName("td");
				tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
				$('edit-markers-menu').appendChild(newMarkerSet);
				
				$('edit-markerset-new').appendChild( $('edit-markerset-options-table') );
				BitMap.show('edit-markerset-new');
				BitMap.show('edit-markerset-options-table');
			}
		}else{
			this.editObjectN = this._setIndexRef = i;
			this.cancelNewMarkerSet();
			this._setIdRef = this.Map.markersets[i].set_id;
			var optionsTable = $('edit-markerset-options-table');
			var target = $('edit-markerset-'+i);
			target.insertBefore(optionsTable, target.childNodes[2]);  
		}
	
		//get the edit form
		doSimpleXMLHttpRequest("edit_markerset.php", {set_id:this._setIdRef}).addCallback( bind(this.editMarkerSetCallback, this) );
	},
	
	
	"editMarkerSetCallback": function(rslt){
		var f = $('markerset-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		if (this._setIdRef == null) { BitMap.hide('edit-markerset-options-actions'); }else{ BitMap.show('edit-markerset-options-actions'); }
		BitMap.show('edit-markersets-table');
		BitMap.show('edit-markerset-options-table');
	},
	
	
	"cancelEditMarkerSet": function(){
		this.cancelNewMarkerSet();
		this.canceledit('edit-markerset-options-table');
		this.canceledit('editerror');
		var count = this.Map.markersets.length;
		for (n=0; n<count; n++){
			if($('edit-markerset-'+n)){
				BitMap.Utl.JSCSS('remove', $('edit-markerset-'+n), 'edit-selected');
			}
		}
	},
	
	
	"cancelNewMarkerSet": function(){
	  if( $('edit-markerset-new') ){ BitMap.hide('edit-markerset-new'); }
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
		this.cancelEditMarkerSet();

		//get the set id of markers we are editing		
		var set_id = this.Map.markersets[i].set_id;    

		//set some constants
		var markerTable = $('edit-markers-table');
		var markerLinksList = $('edit-markers-list');
		var markerLinks = markerLinksList.getElementsByTagName("li");
		
		//Clear all the existing markers listed  
		//We leave the first two, the first is the model we clone, the second if for a new marker
		var count = markerLinks.length;
		for (n=count-1; n>1; n--){
			markerLinksList.removeChild(markerLinks.item(n));
		}
		$('edit-markerlink-new-a').href = "javascript:BitMap.EditSession.editMarker(null, "+i+");";
		
		//For each marker in our set, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.markers.length; n++) {
			var m = this.Map.markers[n];
			if (m.set_id == set_id){
				var li = markerLinks.item(0).cloneNode(true);
				li.id = 'edit-markerlink-'+n;
				var link = li.getElementsByTagName("a").item(0);
				link.href = "javascript:BitMap.EditSession.editMarker("+n+","+i+")";
				link.innerHTML = m.title;
				markerLinksList.appendChild(li);
				li.style.display = "block";
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
		BitMap.show('edit-markers-table');
	},
	
	
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
	

	//@TODO - I think this can be deleted -wjames5
	/*
	"editSet": function(n){
		BitMap.show('setform_'+n);
	},
	*/	
	

	/*******************
	 *
	 * MARKER STYLE FORM FUNCTIONS
	 *
	 *******************/

	"editMarkerStyle":function(i){	
		var style_id = ( i != null )?this.Map.markerstyles[i].style_id:null;

		this.editObjectN = i;
	
		//hilight selected marker link - unhilight others
		var a = (i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-markerstylelink-new'), 'edit-select');
		
		var count = this.Map.markers.length;
		for (n=0; n<count; n++){
			if($('edit-markerstylelink-'+n)){
				a = (n==m_i)?'add':'remove';
				BitMap.Utl.JSCSS(a, $('edit-markerstylelink-'+n), 'edit-select');
			}
		}

		
		doSimpleXMLHttpRequest("edit_markerstyle.php", {style_id:style_id}).addCallback( bind(this.editMarkerStyleCallback, this) );
	},
	
	"editMarkerStyleCallback": function(rslt){
		var f = $('markerstyle-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		BitMap.show('edit-markerstyle-table');		
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
		
		/* I THINK THIS CAN BE DELETED -wjames5 */
		//$('edit-markerstylelink-new-a').href = "javascript:BitMap.EditSession.editMarkerStyle();";
		
		//For each markerstyle, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.markerstyles.length; n++) {
			var m = this.Map.markerstyles[n];
			var li = links.item(0).cloneNode(true);
			li.id = 'edit-markerstylelink-'+n;
			var a = li.getElementsByTagName("a").item(0);
			a.href = "javascript:BitMap.EditSession.editMarkerStyle("+n+")";
			a.innerHTML = m.name;
			linksList.appendChild(li);
			li.style.display = "block";
			
			if (firstselected != true){
				this.editMarkerStyle(n);
				firstselected = true;
			}			
		}
		if (firstselected == false){
			this.editMarkerStyle();
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
				BitMap.Utl.JSCSS('remove', $('edit-iconstylelink-'+n), 'edit-select');
			}
		}
		BitMap.Utl.JSCSS('add', $('edit-iconstylelink-new'), 'edit-select');
		var form = $('edit-iconstyle-form');
		form.icon_id.value = null;
		form.style_array_n.value = null;
		form.reset();
	},
	
	"editIconStyle":function(i){
		BitMap.Utl.JSCSS('remove', $('edit-iconstylelink-new'), 'edit-select');
		var a;
		var count = this.Map.iconstyles.length;
		for (n=0; n<count; n++){
			if($('edit-iconstylelink-'+n)){
				a = (n==i)?'add':'remove';
				BitMap.Utl.JSCSS(a, $('edit-iconstylelink-'+n), 'edit-select');
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
	    BitMap.Utl.JSCSS('remove', $('edit-maptype-'+n), 'edit-selected');
	  }
	
	  if( !$('edit-maptype-new') ){
	    var newMaptype = $('edit-maptype').cloneNode(true);
	    newMaptype.id = "edit-maptype-new";
	    newMaptype.getElementsByTagName("span").item(0).innerHTML = "New Maptype";
	    var tdtags = newMaptype.getElementsByTagName("td");
	    tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
	    $('edit-maptypes-menu').appendChild(newMaptype);
	  }
	  
	  BitMap.Utl.JSCSS('add', $('edit-maptype-new'), 'edit-selected');
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
	    BitMap.Utl.JSCSS(a, $('edit-maptype-'+n), 'edit-selected');
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
	    BitMap.Utl.JSCSS(a, $('edit-maptype-'+n), 'edit-selected');
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
	  BitMap.Utl.JSCSS('remove', $('edit-tilelayerlink-new'), 'edit-select');
	  var a;
	  var count = this.Map.tilelayers.length;
	  for (n=0; n<count; n++){
	    if($('edit-tilelayerlink-'+n)){
	    a = (n==i)?'add':'remove';
	    BitMap.Utl.JSCSS(a, $('edit-tilelayerlink-'+n), 'edit-select');
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
	    BitMap.Utl.JSCSS('remove', $('edit-tilelayerlink-'+n), 'edit-select');
	    }
	  }
	  BitMap.Utl.JSCSS('add', $('edit-tilelayerlink-new'), 'edit-select');
	  var form = $('edit-tilelayer-form');
	  form.tilelayer_id.value = null;
	  form.array_n.value = null;
	  form.maptype_id.value = this.Map.maptypes[i].maptype_id;
	  form.reset();
	  BitMap.hide('edit-tilelayer-actions');  
	},


	"editCopyright": function(i){
	  //i is the tilelayer_index
	  BitMap.Utl.JSCSS('remove', $('edit-copyrightlink-new'), 'edit-select');
	  var a;
	  var count = this.Map.copyrights.length;
	  for (n=0; n<count; n++){
	    if($('edit-copyrightlink-'+n)){
		a = (n==i)?'add':'remove';
	    BitMap.Utl.JSCSS(a, $('edit-copyrightlink-'+n), 'edit-select');
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
	    BitMap.Utl.JSCSS('remove', $('edit-copyrightlink-'+n), 'edit-select');
	    }
	  }
	  BitMap.Utl.JSCSS('add', $('edit-copyrightlink-new'), 'edit-select');
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
	 *  AJAX FUNCTIONS
	 *
	 *******************/

/*				
				BitMap.show('editerror');
				$('editerror').innerHTML = str;
*/

			 
		 "storeMap": function(f){
			this.showSpinner("Saving Map...");
			doSimpleXMLHttpRequest("edit_map.php", f).addCallback( bind(this.updateMap, this) ); 
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
		 
		 "storeMarkerStyle": function(f){
			this.showSpinner("Saving Markerstyle...");
			var str = "edit_markerstyle.php?" + queryString(f);
			var callback = (f.style_id.value != "")?this.updateMarkerStyle:this.addMarkerStyle;
			doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },

		 "storeIconStyle": function(f){
			this.showSpinner("Saving Iconstyle...");
			var str = "edit_iconstyle.php?" + queryString(f);
			this.editObjectN = f.style_array_n.value;
			var callback = (f.icon_id.value != "")?this.updateIconStyle:this.addIconStyle;
			doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
	
		 "storeMaptype": function(f){
			this.showSpinner("Saving Map...");
			this.editObjectN = f.array_n.value;
			var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
			var callback = (f.maptype_id.value != "")?this.updateMaptype:this.addMaptype;
			doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeMaptype": function(f){
			this.showSpinner("Removing Maptype...");
			this.editObjectN = f.array_n.value;
			this.editSetId = f.maptype_id.value;
			var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&gmap_id=" + this.Map.id + "&remove_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this) ); 
		 },
		 
		 "expungeMaptype": function(f){
			this.showSpinner("Deleting Maptype...");
			this.editObjectN = f.array_n.value;
			this.editSetId = f.maptype_id.value;
			var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&expunge_maptype=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this) ); 
		 },

		 "storeTilelayer": function(f){
			this.showSpinner("Saving Tilelayer...");
			var str = "edit_tilelayer.php?" + queryString(f);
			this.editSetId = f.maptype_id.value;
			this.editObjectN = f.array_n.value;
			var callback = (f.tilelayer_id.value != "")?this.updateTilelayer:this.addTilelayer;
			doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeTilelayer": function(f){
			this.showSpinner("Removing Tilelayer...");
			this.editSetId = f.set_id.value;
			this.editTilelayerId = f.tilelayer_id.value;
			var str = "edit_tilelayer.php?set_id=" + this.editSetId + "&tilelayer_id=" + this.editTilelayerId + "&remove_tilelayer=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveTilelayer, this) ); 
		 },
	
		 "expungeTilelayer": function(f){
			this.showSpinner("Deleting Tilelayer...");
			this.editSetId = f.set_id.value;
			this.editTilelayerId = f.tilelayer_id.value;
			var str = "edit_tilelayer.php?tilelayer_id=" + this.editTilelayerId + "&expunge_tilelayer=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveTilelayer, this) ); 
		 },

		 "storeCopyright": function(f){
			this.showSpinner("Saving Copyright...");
			var str = "edit_copyright.php?" + queryString(f);
			this.editSetId = f.tilelayer_id.value;
			this.editObjectN = f.array_n.value;
			var callback = (f.copyright_id.value != "")?this.updateCopyright:this.addCopyright;
			doSimpleXMLHttpRequest(str).addCallback( bind(callback, this) ); 
		 },
		 
		 "removeCopyright": function(f){
			this.showSpinner("Removing Copyright...");
			this.editSetId = f.set_id.value;
			this.editCopyrightId = f.copyright_id.value;
			var str = "edit_copyright.php?set_id=" + this.editSetId + "&copyright_id=" + this.editCopyrightId + "&remove_copyright=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveCopyright, this) ); 
		 },
	
		 "expungeCopyright": function(f){
			this.showSpinner("Deleting Copyright...");
			this.editSetId = f.set_id.value;
			this.editCopyrightId = f.copyright_id.value;
			var str = "edit_copyright.php?copyright_id=" + this.editCopyrightId + "&expunge_copyright=true";
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveCopyright, this) ); 
		 },
		 
		 
	
	/*******************
	 *
	 * POST Edit Callbacks
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
		this.editMarkerSet(this.editObjectN);
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
		this.hideSpinner("DONE!");
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

		this.hideSpinner("DONE!");
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
		
		this.hideSpinner("DONE!");
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

		this.hideSpinner("DONE!");
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
			
			this.hideSpinner("DONE!");
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
			this.hideSpinner("DONE!");
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
			this.hideSpinner("DONE!");
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

		this.hideSpinner("DONE!");
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
		
		this.hideSpinner("DONE!");
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
		this.hideSpinner("DONE!");
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
		
		this.hideSpinner("DONE!");
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
		
		this.hideSpinner("DONE!");
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
	
		this.hideSpinner("DONE!");
		this.cancelEditCopyright();
		this.editTilelayer(s);	
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
