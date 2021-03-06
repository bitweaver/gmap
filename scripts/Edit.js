//NOTE: We use Mochikit library for AJAX and substitute getElementById with '$()'

/*	
BitMap.show('editerror');
$('editerror').innerHTML = rslt.responseText;
*/

if (typeof(BitMap) == 'undefined') {
	BitMap = {};
}

BitMap.dumpProps = function(obj, parent) {
	for (var i in obj) {
		if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
		if (!confirm(msg)) { return; }
		if (typeof obj[i] == "object") {
			if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
		}
	}
}

BitMap.EditMap = function(){
	BitMap.Initialize();
	BitMap.EditSession = new BitMap.Edit();
	BitMap.MapData[0].Map.addOverlayListener();
	BitMap.MapData[0].Map.attachSideMarkers();
	BitMap.EditSession.editMap();
}

// MAP EDITING PROTOTYPE and METHODS
BitMap.Edit = function(){
	this.SPINNER = $('spinner');
//	this.SPINNER_TEXT = $('spinner-text');
//	this.SPINNER_TEXT_ORG = this.SPINNER_TEXT.innerHTML;
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
	this.TempOverlay = null; 		//temporary overlay
	this.bModForm;
	this.bModPData; 
	this.bModMLat;
	this.bModMLng;
	//for convenience
	this.LS = {};
	this.LS.aep = LibertyServices.ajax_edit_params;
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
		// this.SPINNER_TEXT.innerHTML = (str!=null)?str:this.SPINNER_TEXT_ORG;
		this.positionSpinner();
		this.SPINNER.style.display="block";
	},
	
	"hideSpinner": function(str){
		// this.SPINNER_TEXT.innerHTML = (str!=null)?str:this.SPINNER_TEXT.innerHTML;
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

	// virtual function
	"getXMLTagValue": function( xml, tag ){
		return this.Map.getXMLTagValue( xml, tag );
	},
	
	// virtual function
	"getNodeValue": function( node ){
		return this.Map.getNodeValue( node );
	},
	
	// for sorting arrays
	"sortOn": function(a,b){ 
		return a['set_id']-b['set_id']; 
	},
		
	"sortIt": function(pParamHash){
		pParamHash.sort(sortOn); 
	},
	
	"canceledit": function(i){
		if( $(i) != null ){ $(i).style.display = "none" };
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

	"toggleMenuOptsStyles": function( menuType, count, addIndex, style ){
		for (n=0; n<count; n++){
			var menuId = "edit-"+menuType+"-"+n;
			if($(menuId)){
				var a = (n==addIndex)?'add':'remove';
				BitMap.Utl.JSCSS(a, $(menuId), style);
			}
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
	
	"handleEvent": function (name, n,i){
		var func = bind( this[name], this );
		return function(){ func(n,i) };
	},
	
	"verifyRslt": function(rslt){
        var xml = rslt.responseXML;
        var status = xml.documentElement.getElementsByTagName('code')[0].firstChild.nodeValue;
		if (status != '200'){
			var msg = xml.documentElement.getElementsByTagName('content')[0].firstChild.nodeValue;
			alert(msg);
			this.hideSpinner("DONE!");
			return false;
		}else{
			return true;
		}
	},
	
	/*******************
	 *
	 * MAP FORM FUNCTIONS
	 *
	 *******************/
	
	"editMap": function(id){
		if ( (id == null || typeof(id) == undefined ) && this.Map.id ){
			id = this.Map.id;
		}
		doSimpleXMLHttpRequest("edit_map.php", merge({gmap_id:id}, this.LS.aep) ).addCallback( bind(this.editMapCallback, this) ); 
	},

	"editMapCallback": function(rslt){
		var f = $('map-form');
	    f.innerHTML = rslt.responseText;
	    this.executeJavascript(f);
		BitMap.show('map-form');
	},
	

	
	/*******************
	 *
	 * MARKER FORM FUNCTIONS
	 *
	 *******************/
	
	"editMarkerSets": function(){
		this.cancelEditMarkerSets();
		//First check if there are any marker sets
		if (this.Map.markersets.length > 0){
			// We assume editMarkerSets has been called before and remove 
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
				var i = n;
				var ref = this;
				var ms = $('edit-markerset').cloneNode(true);
				ms.id = "edit-markerset-"+i;
				ms.getElementsByTagName("span").item(0).innerHTML = this.Map.markersets[i].title;
				ms.getElementsByTagName("a").item(0).onclick = this.handleEvent('editMarkerSet',i);
				ms.getElementsByTagName("a").item(1).onclick = this.handleEvent('editMarkers',i);
				$('edit-markersets-table').appendChild(ms);
				BitMap.show('edit-markerset-'+i);
			}
		}
		BitMap.show('edit-markersets-table');
	},
	
	
	"cancelEditMarkerSets": function(){
		//rescue our form tables lest we destroy them by accident
		this.canceledit('edit-markers-table');
		var elm = $('edit-markers-table');
		document.body.appendChild(elm);
		this.canceledit('edit-markerset-options-table');
		var elm = $('edit-markerset-options-table');
		document.body.appendChild(elm);
		
		this.canceledit('edit-markersets-table');
		
		this.removeAssistant(); 
		this.canceledit('editerror');
	},

	
	"editMarkerSet": function(i){
		this.cancelEditMarkers();
		//null is a new set
		if ( i == null ){
			this._setIdRef = null;
			this.editObjectN = null;
			if( !$('edit-markerset-new') ){
				var ms = $('edit-markerset').cloneNode(true);
				ms.id = "edit-markerset-new";
				ms.getElementsByTagName("span").item(0).innerHTML = "New Marker Set";
				var tdtags = ms.getElementsByTagName("td");
				tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
				$('edit-markers-menu').appendChild(ms);
				
				$('edit-markerset-new').appendChild( $('edit-markerset-options-table') );
				BitMap.show('edit-markerset-new');
				BitMap.show('edit-markerset-options-table');
			}
		}else{
			this.editObjectN = this._setIndexRef = i;
			this.cancelNewMarkerSet();
			this._setIdRef = this.Map.markersets[i].set_id;

			var f2 = bind(this.removeMarkerSet, this);
			$('remove_markerset_btn').onclick = function(){ f2($('edit-markerset-options-form')); };
			var f3 = bind(this.expungeMarkerSet, this);
			$('expunge_markerset_btn').onclick = function(){ f3($('edit-markerset-options-form')); };

			var optionsTable = $('edit-markerset-options-table');
			var target = $('edit-markerset-'+i);
			target.insertBefore(optionsTable, target.childNodes[2]);  
		}

		//set set menu highlighting
		var a = (i != null)?'remove':'add';
		if($('edit-markerset-new')){
			BitMap.Utl.JSCSS(a, $('edit-markerset-new'), 'edit-selected');
		}
		this.toggleMenuOptsStyles( "markerset", this.Map.markersets.length, i, 'edit-selected' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_markerset.php", merge({set_id:this._setIdRef, gmap_id:this.Map.id},this.LS.aep)).addCallback( bind(this.editMarkerSetCallback, this) );
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
		this.toggleMenuOptsStyles( "markerset", this.Map.markersets.length, null, 'edit-selected' );
	},
	
	
	"cancelNewMarkerSet": function(){
		if( $('edit-markerset-new') ){ BitMap.hide('edit-markerset-new'); }
	},
	
	"editMarkers": function(i){
		//make sure the new marker set form is closed
		this.cancelNewMarkerSet();
		
		this.toggleMenuOptsStyles( "markerset", this.Map.markersets.length, i, 'edit-selected' );
		
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
		var ref = this;
		$('edit-markerlink-new-a').onclick = this.handleEvent('editMarker',null, i);
		
		//For each marker in our set, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.markers.length; n++) {
			var m = this.Map.markers[n];
			if (this.Map.markers[n] != null && m.set_id == set_id){
				var li = markerLinks.item(0).cloneNode(true);
				li.id = 'edit-markerlink-'+n;
				var link = li.getElementsByTagName("a").item(0);
				var nn = n;
				link.onclick = this.handleEvent('editMarker',n,i);
				link.innerHTML = m.title;
				markerLinksList.appendChild(li);
				li.style.display = "block";
				/* @TODO this isn't totally adequate. sometimes we want to edit one that is not first in the list - and this is a little wasteful */
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

		if ( m_i != null ){
			var m = this.Map.markers[m_i];
			this._markerIdRef = id = m.marker_id;
	
			//update action links with marker specific ref
			var f1 = bind(this.Map.openMarkerWindow, this.Map);
			$('locate_marker_btn').onclick = function(){ f1(m_i); };
			var f2 = bind(this.removeMarker, this);
			$('remove_marker_btn').onclick = function(){ f2($('edit-marker-form')); };
			var f3 = bind(this.expungeMarker, this);
			$('expunge_marker_btn').onclick = function(){ f3($('edit-marker-form')); };
			
			BitMap.show('edit-marker-actions');
		}
		var markersTable = $('edit-markers-table');
		$('edit-markerset-'+s_i).appendChild(markersTable);

		//hilight selected marker link - unhilight others
		var a = (m_i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-markerlink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "markerlink", this.Map.markers.length, m_i, 'edit-select' );
		this.toggleMenuOptsStyles( "markerset", this.Map.markersets.length, s_i, 'edit-selected' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_marker.php", merge({marker_id:id, set_id:this._setIdRef},this.LS.aep)).addCallback( bind(this.editMarkerCallback, this) );
	},
	
	"editMarkerCallback": function(rslt){
		var f = $('marker-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		setupAllTabs();
		BitMap.show('edit-markers-table');		
 	},
	
	"cancelNewMarker": function(){
		this.canceledit('edit-marker-new');
	},
	
	"cancelEditMarkers": function(){
		BitMap.hide('edit-markers-table');
		this.cancelEditMarkerSet();
	},
	

	/*******************
	 *
	 * MARKER STYLE FORM FUNCTIONS
	 *
	 *******************/

	"editMarkerStyle":function(i){	
		var style_id = ( i != null )?this.Map.markerstyles[i].style_id:null;
		this.editObjectN = i;
	
		//highlight selected marker link - unhighlight others
		var a = (i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-markerstylelink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "markerstylelink", this.Map.markerstyles.length, i, 'edit-select' );
		
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
		//$('edit-markerstylelink-new-a').onclick = this.handleEvent('editMarkerStyle();";
		
		//For each markerstyle, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.markerstyles.length; n++) {
			var i = n;
			var ref = this;
			var m = this.Map.markerstyles[n];
			var li = links.item(0).cloneNode(true);
			li.id = 'edit-markerstylelink-'+n;
			var a = li.getElementsByTagName("a").item(0);
			a.onclick = this.handleEvent('editMarkerStyle',i);
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

	"editIconStyle":function(i){	
		var icon_id = ( i != null )?this.Map.iconstyles[i].icon_id:null;
		this.editObjectN = i;
	
		//hilight selected icon link - unhilight others
		var a = (i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-iconstylelink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "iconstylelink", this.Map.iconstyles.length, i, 'edit-select' );
		
		doSimpleXMLHttpRequest("edit_iconstyle.php", {icon_id:icon_id}).addCallback( bind(this.editIconStyleCallback, this) );
	},
	
	"editIconStyleCallback": function(rslt){
		var f = $('iconstyle-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		BitMap.show('edit-iconstyle-table');		
	},

	"editIconStyles": function(){
		BitMap.show('edit-iconstyles-table');
		
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
		
		//$('edit-iconstylelink-new-a').onclick = this.handleEvent('editIconStyle(null);";
		//For each iconstyle, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.iconstyles.length; n++) {
			var i = n;
			var ref = this;
			var m = this.Map.iconstyles[n];
			var newIconstyleli = links.item(0).cloneNode(true);
			newIconstyleli.id = 'edit-iconstylelink-'+n;
			var newIconstyleLink = newIconstyleli.getElementsByTagName("a").item(0);
			newIconstyleLink.onclick = this.handleEvent('editIconStyle',i);
			newIconstyleLink.innerHTML = m.name;
			linksList.appendChild(newIconstyleli);
			newIconstyleli.style.display = "block";
			
			if (firstselected != true){
				this.editIconStyle(n);
				firstselected = true;
			}			
		}
		if (firstselected == false){
			this.editIconStyle();
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-iconstyle-table');
	},
	
	"cancelEditIconStyles": function(){
		BitMap.hide('edit-iconstyles-table');
		BitMap.hide('edit-iconstyle-table');
		BitMap.hide('edit-iconstyles-cancel');
	},

	"getIconStyles": function(e,s){
		opts = {};
		// e = $('theme_id');
		if ( e != null ){
			opts.theme_id = e.options[e.selectedIndex].value;
		}
		s += '&'+queryString(opts); 
		doSimpleXMLHttpRequest("view_icons_inc.php?"+s).addCallback( bind(this.getIconStylesCallback, this) ); 
	},

	"getIconStylesCallback": function(rslt){
		$('icon_styles').innerHTML = rslt.responseText;
		BitMap.show('icon_styles');
	},

	"setIconStyle": function(n, url){
		$('icon_id').value = n;
		$('icon_img').src = url;
	},


	"getIconStyle": function(icon_id){
		doSimpleXMLHttpRequest("view_icons_inc.php", {icon_id:icon_id}).addCallback( bind(this.updateIconStyle, this), icon_id, false );
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
				var i = n;
				var ref = this;
				var newMaptype = $('edit-maptype').cloneNode(true);
				newMaptype.id = "edit-maptype-"+i;
				newMaptype.getElementsByTagName("span").item(0).innerHTML = this.Map.maptypes[i].name;
				newMaptype.getElementsByTagName("a").item(0).onclick = this.handleEvent('editMaptype',i);
				newMaptype.getElementsByTagName("a").item(1).onclick = this.handleEvent('editMaptypeTilelayers',i);
				$('edit-maptypes-table').appendChild(newMaptype);
				BitMap.show('edit-maptype-'+i);
			}
		}else{
			//alert you must create a maptype first
		}
		BitMap.show('edit-maptypes-table');
	},

	
	"editMaptype": function(i){
		this.cancelEditTilelayers();
		//null is a new maptype
		if ( i == null ){
			this.editObjectN = null;
			this._setIdRef = null;
			if( !$('edit-maptype-new') ){
				var newMaptype = $('edit-maptype').cloneNode(true);
				newMaptype.id = "edit-maptype-new";
				newMaptype.getElementsByTagName("span").item(0).innerHTML = "New Maptype";
				var tdtags = newMaptype.getElementsByTagName("td");
				tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
				$('edit-maptypes-menu').appendChild(newMaptype);
				$('edit-maptype-new').appendChild( $('edit-maptype-options-table') );
				BitMap.show('edit-maptype-new');
				BitMap.show('edit-maptype-options-table');
			}
		}else{
			this.editObjectN = this._setIndexRef = i;
			this.cancelNewMaptype();
			this._setIdRef = this.Map.maptypes[i].maptype_id;
			
			//update action links with maptype specific ref
			var f1 = bind(this.Map.map.setMapType, this.Map.map);
			var ref = this;
			$('locate_maptype_btn').onclick = function(){ f1(ref.Map.maptypes[i].type); };
			var f2 = bind(this.removeMaptype, this);
			$('remove_maptype_btn').onclick = function(){ f2($('edit-maptype-options-form')); };
			var f3 = bind(this.expungeMaptype, this);
			$('expunge_maptype_btn').onclick = function(){ f3($('edit-maptype-options-form')); };
			
			var optionsTable = $('edit-maptype-options-table');
			var target = $('edit-maptype-'+i);
			target.insertBefore(optionsTable, target.childNodes[2]);  
		}

		//set maptype menu highlighting
		var a = (i != null)?'remove':'add';
		if($('edit-maptype-new')){
			BitMap.Utl.JSCSS(a, $('edit-maptype-new'), 'edit-selected');
		}
		this.toggleMenuOptsStyles( "maptype", this.Map.maptypes.length, i, 'edit-selected' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_maptype.php", {maptype_id:this._setIdRef}).addCallback( bind(this.editMaptypeCallback, this) );
	},
	
	"editMaptypeCallback": function(rslt){
		var f = $('maptype-form');
		f.innerHTML = rslt.responseText;
		//this.executeJavascript(f);
		if (this._setIdRef == null) { BitMap.hide('edit-maptype-options-actions'); }else{ BitMap.show('edit-maptype-options-actions'); }
		BitMap.show('edit-maptypes-table');
		BitMap.show('edit-maptype-options-table');
	},

	"editMaptypeTilelayers": function(i){
		this.cancelNewMaptype();
		this.toggleMenuOptsStyles( "maptype", this.Map.maptypes.length, i, 'edit-selected' );
		
		this.cancelEditMaptype();
		var M = this.Map.maptypes[i];
		var m_id = M.maptype_id;
		//set some constants
		var tilelayersTable = $('edit-tilelayers-table');
		var tilelayersLinksList = $('edit-tilelayers-list');
		var tilelayersLinks = tilelayersLinksList.getElementsByTagName("li");

		//Clear all the existing tilelayers listed  
		//We leave the first two, the first is the model we clone, the second if for a new tilelayer
		var count = tilelayersLinks.length;
		for (n=count-1; n>1; n--){
			tilelayersLinksList.removeChild(tilelayersLinks.item(n));
		}
		$('edit-tilelayerlink-new-a').onclick = this.handleEvent('editTilelayer',null, i);

		//For each tilelayer in our new maptype, add a link
		var firstselected = false;
		
		var ref = this;
		for (var m=0; m<M.tilelayer_ids.length; m++) {
			for (var n=0; n<this.Map.tilelayers.length; n++) {
				if (M.tilelayer_ids[m] == this.Map.tilelayers[n].tilelayer_id){					
					var T = this.Map.tilelayers[n];
					var li = tilelayersLinks.item(0).cloneNode(true);
					li.id = 'edit-tilelayerlink-'+n;
					var link = li.getElementsByTagName("a").item(0);
					link.onclick = this.handleEvent('editTilelayer',n,i);
					link.innerHTML = T.tiles_name;
					tilelayersLinksList.appendChild(li);
					li.style.display = "block";
					if (firstselected != true){
						this.editTilelayer(n, i);
						firstselected = true;
					}
				}
			}
		}
		if (firstselected == false){
			this.editTilelayer(null, i);
		}
	},
	
	"editTilelayer": function(t_i, m_i){
		var ref = this;
		this.cancelEditCopyright();
		var t_id = ( t_i != null )?this.Map.tilelayers[t_i].tilelayer_id:null;
		var m_id = this._setIdRef = ( m_i != null )?this.Map.maptypes[m_i].maptype_id:null;
		this.editObjectN = t_i;
		this._setIndexRef = m_i;

		//make menu of copyrights
		//Clear all the existing copyrights listed  
		var count = this.Map.copyrights.length;
		for (n=0; n<count; n++){
			if ($("edit-copyrightlink-"+n)){
				$('edit-copyright-menu').removeChild($("edit-copyrightlink-"+n));
			}
		}
		$('edit-copyrightlink-new-a').onclick = this.handleEvent('editCopyright',null, t_i);
		//for each copyright
		for (var n=0; n<count; n++) {
			var c = this.Map.copyrights[n];
			if (c.tilelayer_id == t_id){
				//get the model menu and clone it
				newCopyrightMenu = $('edit-copyrightlink').cloneNode(true);
				//update the values
				newCopyrightMenu.id = "edit-copyrightlink-"+n;
				newCopyrightLink = newCopyrightMenu.getElementsByTagName("a").item(0);
				newCopyrightLink.onclick = this.handleEvent('editCopyright',n,t_i);
				newCopyrightLink.innerHTML = c.notice;
				//add it to the copyrights menu
				$('edit-copyright-menu').appendChild(newCopyrightMenu);
				newCopyrightMenu.style.display = "block";
			}
		}
		
		if (t_i != null){
			var f2 = bind(this.removeTilelayer, this);
			$('remove_tilelayer_btn').onclick = function(){ f2($('edit-tilelayer-form')); };
			var f3 = bind(this.expungeTilelayer, this);
			$('expunge_tilelayer_btn').onclick = function(){ f3($('edit-tilelayer-form')); };
			BitMap.show('edit-tilelayer-actions');
		}else{
			BitMap.hide('edit-tilelayer-actions');
		}

		var table = $('edit-tilelayers-table');
		$('edit-maptype-'+m_i).appendChild(table);
	
		var a = (t_i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-tilelayerlink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "tilelayerlink", this.Map.tilelayers.length, t_i, 'edit-select' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_tilelayer.php", {tilelayer_id:t_id, maptype_id:m_id}).addCallback( bind(this.editTilelayerCallback, this) );
	},
	
	"editTilelayerCallback": function(rslt){
		var f = $('tilelayer-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		BitMap.show('edit-tilelayers-table');		
	},


	"editCopyright": function(c_i, t_i){
		var c_id = ( c_i != null )?this.Map.copyrights[c_i].copyright_id:null;
		var t_id = this._setIdRef = this.Map.tilelayers[t_i].tilelayer_id;
		this.editObjectN = c_i;
		this._setIndexRef = t_i;

		//hilight selected marker link - unhilight others
		var a = (c_i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-copyrightlink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "copyrightlink", this.Map.copyrights.length, c_i, 'edit-select' );
		
		c_i = ( c_i != null )?c_i:'new';
		//move the form container to copyright being edited
		copyrightTable = $('edit-copyright-table');
		$('edit-copyrightlink-'+c_i).appendChild(copyrightTable);
	  
		doSimpleXMLHttpRequest("edit_copyright.php", {copyright_id:c_id, tilelayer_id:t_id}).addCallback( bind(this.editCopyrightCallback, this) );
	},
	
	
	"editCopyrightCallback": function(rslt){
		var f = $('copyright-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
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

	"cancelEditMaptype": function(){
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
	 * POLYLINE FORM FUNCTIONS
	 *
	 *******************/

	"editPolylineSets": function(){
		BitMap.show('edit-polylines-menu');
		
		if (this.Map.polylinesets.length > 0){
			// We assume editPolylineSets has been called before and remove 
			// any previously existing sets from the UI
			for (var n=0; n<this.Map.polylinesets.length; n++) {
				if (this.Map.polylinesets[n]!= null){
					var getElem = "edit-polylineset-"+n;
					if ( $(getElem) ) {
						$('edit-polylinesets-table').removeChild($(getElem));
					}
				}
			}
			//Add a tool bar for each PolylineSet
			for (var n=0; n<this.Map.polylinesets.length; n++) {
				var set = $('edit-polylineset').cloneNode(true);
				set.id = "edit-polylineset-"+n;
				set.getElementsByTagName("span").item(0).innerHTML = this.Map.polylinesets[n].title;
				var i = n;
				var ref = this;
				set.getElementsByTagName("a").item(0).onclick = this.handleEvent('editPolylineSet',i);
				set.getElementsByTagName("a").item(1).onclick = this.handleEvent('editPolylines',i);
				$('edit-polylinesets-table').appendChild(set);
				BitMap.show('edit-polylineset-'+n);
			}
		}
		BitMap.show('edit-polylinesets-table');
	},
		
	"cancelEditPolylineSets": function(){
		//rescue our form tables lest we destroy them by accident
		this.canceledit('edit-polylines-table');
		var elm = $('edit-polylines-table');
		document.body.appendChild(elm);
		this.canceledit('edit-polylineset-options-table');
		var elm = $('edit-polylineset-options-table');
		document.body.appendChild(elm);
		
		this.canceledit('edit-polylines-menu');
		this.canceledit('edit-polylinesets-table');
		
		this.removeAssistant(); 
		this.canceledit('editerror');
	},
	  
	"editPolylineSet": function(i){
		this.cancelEditPolylines();
		//null is a new set
		if ( i == null ){
			this._setIdRef = null;
			this.editObjectN = null;
			if( !$('edit-polylineset-new') ){
				var ps = $('edit-polylineset').cloneNode(true);
				ps.id = "edit-polylineset-new";
				ps.getElementsByTagName("span").item(0).innerHTML = "New Polyline Set";
				var tdtags = ps.getElementsByTagName("td");
				tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
				$('edit-polylines-menu').appendChild(ps);
				
				$('edit-polylineset-new').appendChild( $('edit-polylineset-options-table') );
				BitMap.show('edit-polylineset-new');
				BitMap.show('edit-polylineset-options-table');
			}
		}else{
			this.editObjectN = this._setIndexRef = i;
			this.cancelNewPolylineSet();
			this._setIdRef = this.Map.polylinesets[i].set_id;

			var f2 = bind(this.removePolylineSet, this);
			$('remove_polylineset_btn').onclick = function(){ f2($('edit-polylineset-options-form')); };
			var f3 = bind(this.expungePolylineSet, this);
			$('expunge_polylineset_btn').onclick = function(){ f3($('edit-polylineset-options-form')); };

			var optionsTable = $('edit-polylineset-options-table');
			var target = $('edit-polylineset-'+i);
			target.insertBefore(optionsTable, target.childNodes[2]);  
		}

		//set set menu highlighting
		var a = (i != null)?'remove':'add';
		if($('edit-polylineset-new')){
			BitMap.Utl.JSCSS(a, $('edit-polylineset-new'), 'edit-selected');
		}
		this.toggleMenuOptsStyles( "polylineset", this.Map.polylinesets.length, i, 'edit-selected' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_polylineset.php", merge({set_id:this._setIdRef},this.LS.aep)).addCallback( bind(this.editPolylineSetCallback, this) );
	},

	"editPolylineSetCallback": function(rslt){
		var f = $('polylineset-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		if (this._setIdRef == null) { BitMap.hide('edit-polylineset-options-actions'); }else{ BitMap.show('edit-polylineset-options-actions'); }
		BitMap.show('edit-polylinesets-table');
		BitMap.show('edit-polylineset-options-table');
	},
	
	
	"cancelEditPolylineSet": function(){
		this.cancelNewPolylineSet();
		this.canceledit('edit-polylineset-options-table');
		this.canceledit('editerror');
		this.toggleMenuOptsStyles( "polylineset", this.Map.polylinesets.length, null, 'edit-selected' );
	},
	
	
	"cancelNewPolylineSet": function(){
	  if( $('edit-polylineset-new') ){ BitMap.hide('edit-polylineset-new'); }
	},
	
	"editPolylines": function(i){
		var ref = this;
		//make sure the new polyline set form is closed
		this.cancelNewPolylineSet();
		
		this.toggleMenuOptsStyles( "polylineset", this.Map.polylinesets.length, i, 'edit-selected' );
		
		//make sure the polyline set options form is closed
		this.cancelEditPolylineSet();

		//get the set id of polylines we are editing		
		var set_id = this.Map.polylinesets[i].set_id;    

		//set some constants
		var polylineTable = $('edit-polylines-table');
		var polylineLinksList = $('edit-polylines-list');
		var polylineLinks = polylineLinksList.getElementsByTagName("li");
		
		//Clear all the existing polylines listed  
		//We leave the first two, the first is the model we clone, the second if for a new polyline
		var count = polylineLinks.length;
		for (n=count-1; n>1; n--){
			polylineLinksList.removeChild(polylineLinks.item(n));
		}
		$('edit-polylinelink-new-a').onclick = this.handleEvent('editPolyline',null, i);
		
		//For each polyline in our set, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.polylines.length; n++) {
			var p = this.Map.polylines[n];
			if (p.set_id == set_id){
				var li = polylineLinks.item(0).cloneNode(true);
				li.id = 'edit-polylinelink-'+n;
				var link = li.getElementsByTagName("a").item(0);
				var nn = n;
				link.onclick = this.handleEvent('editPolyline',n,i);
				link.innerHTML = p.title;
				polylineLinksList.appendChild(li);
				li.style.display = "block";
				if (firstselected != true){
					//else ajax up a form with the info from the first polyline in the list
					this.editPolyline(n, i);
					firstselected = true;
				}
			}
		}		
		if (firstselected == false){
			//if the list is 0 - ajax up an empty form
			this.editPolyline(null, i);
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-polylines-table');
	},
	
	
	"editPolyline": function(m_i, s_i){
		var id = null
		this._setIndexRef = s_i;
		this._setIdRef = this.Map.polylinesets[s_i].set_id;
		this._polylineIndexRef = m_i;

		//move the form container to the correct set div
		if ( m_i != null ){
			var m = this.Map.polylines[m_i];
			this._polylineIdRef = id = m.polyline_id;
			//update action links with marker specific ref
			
			var f2 = bind(this.removePolyline, this);
			$('remove_polyline_btn').onclick = function(){ f2($('edit-polyline-form')); };
			var f3 = bind(this.expungePolyline, this);
			$('expunge_polyline_btn').onclick = function(){ f3($('edit-polyline-form')); };
			
			BitMap.show('edit-polyline-actions');
		}
		
		var polylinesTable = $('edit-polylines-table');
		$('edit-polylineset-'+s_i).appendChild(polylinesTable);

		//hilight selected polyline link - unhilight others
		var a = (m_i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-polylinelink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "polylinelink", this.Map.polylines.length, m_i, 'edit-select' );
		this.toggleMenuOptsStyles( "polylineset", this.Map.polylinesets.length, s_i, 'edit-selected' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_polyline.php", merge({polyline_id:id, set_id:this._setIdRef},this.LS.aep)).addCallback( bind(this.editPolylineCallback, this) );
	},
	
	"editPolylineCallback": function(rslt){
		var f = $('polyline-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		setupAllTabs();
		BitMap.show('edit-polylines-table');		
 	},
	
	"cancelNewPolyline": function(){
		this.canceledit('edit-polyline-new');
	},
	
	"cancelEditPolylines": function(){
		BitMap.hide('edit-polylines-table');
	},



	/*******************
	 *
	 * POLYLINE STYLE FORM FUNCTIONS
	 *
	 *******************/

	"editPolylineStyle":function(i){	
		var style_id = ( i != null )?this.Map.polylinestyles[i].style_id:null;
		this.editObjectN = i;
	
		//highlight selected polyline link - unhighlight others
		var a = (i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-polylinestylelink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "polylinestylelink", this.Map.polylinestyles.length, i, 'edit-select' );
		
		doSimpleXMLHttpRequest("edit_polylinestyle.php", {style_id:style_id}).addCallback( bind(this.editPolylineStyleCallback, this) );
	},
	
	"editPolylineStyleCallback": function(rslt){
		var f = $('polylinestyle-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		BitMap.show('edit-polylinestyle-table');		
	},

	"editPolylineStyles": function(){
		BitMap.show('edit-polylinestyles-table');
		BitMap.show('edit-polylinestyles-cancel');
		
		var polylinestyleTable = $('edit-polylinestyle-table');
		//set some constants
		var linksList = polylinestyleTable.getElementsByTagName("ul").item(0);
		var links = polylinestyleTable.getElementsByTagName("li");
		//Clear all the existing polylinestyles listed
		//We leave the first two, the first is the model we clone, the second is for a new polylinestyle
		var count = links.length;
		for (n=count-1; n>1; n--){
			linksList.removeChild(links.item(n));
		}
		
		/* I THINK THIS CAN BE DELETED -wjames5 */
		//$('edit-polylinestylelink-new-a').onclick = this.handleEvent('editPolylineStyle();";
		
		//For each polylinestyle, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.polylinestyles.length; n++) {
			var m = this.Map.polylinestyles[n];
			var li = links.item(0).cloneNode(true);
			li.id = 'edit-polylinestylelink-'+n;
			var a = li.getElementsByTagName("a").item(0);
			var i = n;
			var ref = this;
			a.onclick = this.handleEvent('editPolylineStyle',i);
			a.innerHTML = m.name;
			linksList.appendChild(li);
			li.style.display = "block";
			
			if (firstselected != true){
				this.editPolylineStyle(n);
				firstselected = true;
			}			
		}
		if (firstselected == false){
			this.editPolylineStyle();
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-polylinestyle-table');
	},

	"cancelEditPolylineStyles": function(){
	  BitMap.hide('edit-polylinestyles-table');
	  BitMap.hide('edit-polylinestyle-table');
	  BitMap.hide('edit-polylinestyles-cancel');
	},
	

	/*******************
	 *
	 * POLYGON FORM FUNCTIONS
	 *
	 *******************/

	"editPolygonSets": function(){
		BitMap.show('edit-polygons-menu');
		
		if (this.Map.polygonsets.length > 0){
			// We assume editPolygonSets has been called before and remove 
			// any previously existing sets from the UI
			for (var n=0; n<this.Map.polygonsets.length; n++) {
				if (this.Map.polygonsets[n]!= null){
					var getElem = "edit-polygonset_"+n;
					if ( $(getElem) ) {
						$('edit-polygonsets-table').removeChild($(getElem));
					}
				}
			}
			//Add a tool bar for each PolygonSet
			for (var n=0; n<this.Map.polygonsets.length; n++) {
				var i = n;
				var ref = this;
				var set = $('edit-polygonset').cloneNode(true);
				set.id = "edit-polygonset-"+i;
				set.getElementsByTagName("span").item(0).innerHTML = this.Map.polygonsets[i].title;
				set.getElementsByTagName("a").item(0).onclick = this.handleEvent('editPolygonSet',i);
				set.getElementsByTagName("a").item(1).onclick = this.handleEvent('editPolygons',i);
				$('edit-polygonsets-table').appendChild(set);
				BitMap.show('edit-polygonset-'+n);
			}
		}
		BitMap.show('edit-polygonsets-table');
	},
		
	"cancelEditPolygonSets": function(){
		//rescue our form tables lest we destroy them by accident
		this.canceledit('edit-polygons-table');
		var elm = $('edit-polygons-table');
		document.body.appendChild(elm);
		this.canceledit('edit-polygonset-options-table');
		var elm = $('edit-polygonset-options-table');
		document.body.appendChild(elm);
		
		this.canceledit('edit-polygons-menu');
		this.canceledit('edit-polygonsets-table');
		
		this.removeAssistant(); 
		this.canceledit('editerror');
	},
	  
	"editPolygonSet": function(i){
		this.cancelEditPolygons();
		//null is a new set
		if ( i == null ){
			this._setIdRef = null;
			this.editObjectN = null;
			if( !$('edit-polygonset-new') ){
				var ps = $('edit-polygonset').cloneNode(true);
				ps.id = "edit-polygonset-new";
				ps.getElementsByTagName("span").item(0).innerHTML = "New Polygon Set";
				var tdtags = ps.getElementsByTagName("td");
				tdtags.item(1).parentNode.removeChild(tdtags.item(1));  
				$('edit-polygons-menu').appendChild(ps);
				
				$('edit-polygonset-new').appendChild( $('edit-polygonset-options-table') );
				BitMap.show('edit-polygonset-new');
				BitMap.show('edit-polygonset-options-table');
			}
		}else{
			this.editObjectN = this._setIndexRef = i;
			this.cancelNewPolygonSet();
			this._setIdRef = this.Map.polygonsets[i].set_id;

			var f2 = bind(this.removePolygonSet, this);
			$('remove_polygonset_btn').onclick = function(){ f2($('edit-polygonset-options-form')); };
			var f3 = bind(this.expungePolygonSet, this);
			$('expunge_polygonset_btn').onclick = function(){ f3($('edit-polygonset-options-form')); };

			var optionsTable = $('edit-polygonset-options-table');
			var target = $('edit-polygonset-'+i);
			target.insertBefore(optionsTable, target.childNodes[2]);  
		}

		//set set menu highlighting
		var a = (i != null)?'remove':'add';
		if($('edit-polygonset-new')){
			BitMap.Utl.JSCSS(a, $('edit-polygonset-new'), 'edit-selected');
		}
		this.toggleMenuOptsStyles( "polygonset", this.Map.polygonsets.length, i, 'edit-selected' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_polygonset.php", merge({set_id:this._setIdRef},this.LS.aep)).addCallback( bind(this.editPolygonSetCallback, this) );
	},

	"editPolygonSetCallback": function(rslt){
		var f = $('polygonset-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		if (this._setIdRef == null) { BitMap.hide('edit-polygonset-options-actions'); }else{ BitMap.show('edit-polygonset-options-actions'); }
		BitMap.show('edit-polygonsets-table');
		BitMap.show('edit-polygonset-options-table');
	},
	
	
	"cancelEditPolygonSet": function(){
		this.cancelNewPolygonSet();
		this.canceledit('edit-polygonset-options-table');
		this.canceledit('editerror');
		this.toggleMenuOptsStyles( "polygonset", this.Map.polygonsets.length, null, 'edit-selected' );
	},
	
	
	"cancelNewPolygonSet": function(){
	  if( $('edit-polygonset-new') ){ BitMap.hide('edit-polygonset-new'); }
	},
	
	"editPolygons": function(i){
		var ref = this;
		//make sure the new polygon set form is closed
		this.cancelNewPolygonSet();
		
		this.toggleMenuOptsStyles( "polygonset", this.Map.polygonsets.length, i, 'edit-selected' );
		
		//make sure the polygon set options form is closed
		this.cancelEditPolygonSet();

		//get the set id of polygons we are editing
		var set_id = this.Map.polygonsets[i].set_id;

		//set some constants
		var polygonTable = $('edit-polygons-table');
		var polygonLinksList = $('edit-polygons-list');
		var polygonLinks = polygonLinksList.getElementsByTagName("li");
		
		//Clear all the existing polygons listed  
		//We leave the first two, the first is the model we clone, the second if for a new polygon
		var count = polygonLinks.length;
		for (n=count-1; n>1; n--){
			polygonLinksList.removeChild(polygonLinks.item(n));
		}
		$('edit-polygonlink-new-a').onclick = this.handleEvent('editPolygon',null, i);
		
		//For each polygon in our set, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.polygons.length; n++) {
			var p = this.Map.polygons[n];
			if (p.set_id == set_id){
				var li = polygonLinks.item(0).cloneNode(true);
				li.id = 'edit-polygonlink-'+n;
				var link = li.getElementsByTagName("a").item(0);
				link.onclick = this.handleEvent('editPolygon',n,i);
				link.innerHTML = p.title;
				polygonLinksList.appendChild(li);
				li.style.display = "block";
				if (firstselected != true){
					//else ajax up a form with the info from the first polygon in the list
					this.editPolygon(n, i);
					firstselected = true;
				}
			}
		}		
		if (firstselected == false){
			//if the list is 0 - ajax up an empty form
			this.editPolygon(null, i);
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-polygons-table');
	},
	
	
	"editPolygon": function(m_i, s_i){
		var id = null
		this._setIndexRef = s_i;
		this._setIdRef = this.Map.polygonsets[s_i].set_id;
		this._polygonIndexRef = m_i;

		//move the form container to the correct set div
		if ( m_i != null ){
			var m = this.Map.polygons[m_i];
			this._polygonIdRef = id = m.polygon_id;
			
			var f2 = bind(this.removePolygon, this);
			$('remove_polygon_btn').onclick = function(){ f2($('edit-polygon-form')); };
			var f3 = bind(this.expungePolygon, this);
			$('expunge_polygon_btn').onclick = function(){ f3($('edit-polygon-form')); };
						
			BitMap.show('edit-polygon-actions');
		}
		var polygonsTable = $('edit-polygons-table');
		$('edit-polygonset-'+s_i).appendChild(polygonsTable);

		//hilight selected polygon link - unhilight others
		var a = (m_i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-polygonlink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "polygonlink", this.Map.polygons.length, m_i, 'edit-select' );
		this.toggleMenuOptsStyles( "polygonset", this.Map.polygonsets.length, s_i, 'edit-selected' );
		
		//get the edit form
		doSimpleXMLHttpRequest("edit_polygon.php", merge({polygon_id:id, set_id:this._setIdRef},this.LS.aep)).addCallback( bind(this.editPolygonCallback, this) );
	},
	
	"editPolygonCallback": function(rslt){
		var f = $('polygon-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		setupAllTabs();
		BitMap.show('edit-polygons-table');		
 	},
	
	"cancelNewPolygon": function(){
		this.canceledit('edit-polygon-new');
	},
	
	"cancelEditPolygons": function(){
		BitMap.hide('edit-polygons-table');
	},
	
	
	"editPolygonStyle":function(i){	
		var style_id = ( i != null )?this.Map.polygonstyles[i].style_id:null;
		this.editObjectN = i;
	
		//highlight selected polygon link - unhighlight others
		var a = (i != null)?'remove':'add';
		BitMap.Utl.JSCSS(a, $('edit-polygonstylelink-new'), 'edit-select');
		this.toggleMenuOptsStyles( "polygonstylelink", this.Map.polygonstyles.length, i, 'edit-select' );
		
		doSimpleXMLHttpRequest("edit_polygonstyle.php", {style_id:style_id}).addCallback( bind(this.editPolygonStyleCallback, this) );
	},
	
	"editPolygonStyleCallback": function(rslt){
		var f = $('polygonstyle-form');
		f.innerHTML = rslt.responseText;
		this.executeJavascript(f);
		BitMap.show('edit-polygonstyle-table');		
	},

	"editPolygonStyles": function(){
		BitMap.show('edit-polygonstyles-table');
		BitMap.show('edit-polygonstyles-cancel');
		
		var polygonstyleTable = $('edit-polygonstyle-table');
		//set some constants
		var linksList = polygonstyleTable.getElementsByTagName("ul").item(0);
		var links = polygonstyleTable.getElementsByTagName("li");
		//Clear all the existing polygonstyles listed
		//We leave the first two, the first is the model we clone, the second is for a new polygonstyle
		var count = links.length;
		for (n=count-1; n>1; n--){
			linksList.removeChild(links.item(n));
		}
		
		/* I THINK THIS CAN BE DELETED -wjames5 */
		//$('edit-polygonstylelink-new-a').onclick = this.handleEvent('editPolygonStyle();";
		
		//For each polygonstyle, add a link
		var firstselected = false;
		for (var n=0; n<this.Map.polygonstyles.length; n++) {
			var m = this.Map.polygonstyles[n];
			var li = links.item(0).cloneNode(true);
			li.id = 'edit-polygonstylelink-'+n;
			var a = li.getElementsByTagName("a").item(0);
			var i = n;
			var ref = this;
			a.onclick = this.handleEvent('editPolygonStyle',i);
			a.innerHTML = m.name;
			linksList.appendChild(li);
			li.style.display = "block";
			
			if (firstselected != true){
				this.editPolygonStyle(n);
				firstselected = true;
			}			
		}
		if (firstselected == false){
			this.editPolygonStyle();
		}
		//We assume it is not visible and make it so
		BitMap.show('edit-polygonstyle-table');
	},

	"cancelEditPolygonStyles": function(){
	  BitMap.hide('edit-polygonstyles-table');
	  BitMap.hide('edit-polygonstyle-table');
	  BitMap.hide('edit-polygonstyles-cancel');
	},
	
	/*******************
	 *
	 *  AJAX FUNCTIONS
	 *
	 *******************/

			 
	 "storeMap": function(f){
		this.showSpinner("Saving Map...");
		doSimpleXMLHttpRequest("edit_map.php", f).addCallback( bind(this.updateMap, this) ); 
	 },

	 "storeMarker": function(f){
		this.showSpinner("Saving Marker...");
		var str = "edit_marker.php?" + queryString(f);
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updateMarker, this), f.set_id.value, f.marker_id.value ); 
	 },
	 
	 "removeMarker": function(f){
	 	if (confirm("Are you sure you want to remove \nthe marker \""+f.title.value+"\" from this marker set?")){
			this.showSpinner("Removing Marker...");
			this._setIdRef = f.set_id.value;
			this.editMarkerId = f.marker_id.value;
			var str = "edit_marker.php?set_id=" + this._setIdRef + "&marker_id=" + this.editMarkerId + "&remove_marker=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) );
		}
	 },

	 "expungeMarker": function(f){
	 	if (confirm("Are you sure you want to delete \nthe marker \""+f.title.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Marker...");
			this._setIdRef = f.set_id.value;
			this.editMarkerId = f.marker_id.value;
			var str = "edit_marker.php?marker_id=" + this.editMarkerId + "&expunge_marker=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarker, this) ); 
		}
	 },

	 "storeMarkerSet": function(f){
		this.showSpinner("Saving Markerset...");
		var str = "edit_markerset.php?" + queryString(f) + "&set_type=markers" + "&gmap_id=" + this.Map.id;
		this._setIdRef = f.set_id.value;
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updateMarkerSet, this) ); 
	 },

	 "removeMarkerSet": function(f){
	 	if (confirm("Are you sure you want to remove \nthe markerset \""+f.title.value+"\" from this map?")){
			this.showSpinner("Removing Markerset...");
			this._setIdRef = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_markerset=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) );
		}
	 },

	 "expungeMarkerSet": function(f){
	 	if (confirm("Are you sure you want to delete \nthe markerset \""+f.title.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Markerset...");
			this._setIdRef = f.set_id.value;
			var str = "edit_markerset.php?" + "set_id=" + f.set_id.value + "&expunge_markerset=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMarkerSet, this) );
		}
	 },
	 
	 "storeMarkerStyle": function(f){
		this.showSpinner("Saving Markerstyle...");
		var str = "edit_markerstyle.php?" + queryString(f);
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updateMarkerStyle, this) ); 
	 },

	 "storeIconStyle": function(f){
		this.showSpinner("Saving Iconstyle...");
		var str = "edit_iconstyle.php?" + queryString(f);
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updateIconStyle, this), f.icon_id.value, true ); 
	 },

	 "storeMaptype": function(f){
		this.showSpinner("Saving Map...");
		var str = "edit_maptype.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updateMaptype, this), f.maptype_id.value ); 
	 },
	 
	 "removeMaptype": function(f){
	 	if (confirm("Are you sure you want to remove \nthe maptype \""+f.name.value+"\" from this map?")){
			this.showSpinner("Removing Maptype...");
			this.editObjectN = f.array_n.value;
			this.editSetId = f.maptype_id.value;
			var str = "edit_maptype.php?" + "maptype_id=" + this.editSetId + "&gmap_id=" + this.Map.id + "&remove_maptype=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this) );
		}
	 },
	 
	 "expungeMaptype": function(f){
	 	if (confirm("Are you sure you want to delete \nthe maptype \""+f.name.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Maptype...");
	//		this.editObjectN = f.array_n.value;
//			this.editSetId = f.maptype_id.value;
			var mid = f.maptype_id.value;
			var str = "edit_maptype.php?" + "maptype_id=" + mid + "&expunge_maptype=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveMaptype, this), mid );
		}
	 },

	 "storeTilelayer": function(f){
		this.showSpinner("Saving Tilelayer...");
		var str = "edit_tilelayer.php?" + queryString(f);
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updateTilelayer, this) ); 
	 },
	 
	 "removeTilelayer": function(f){
	 	if (confirm("Are you sure you want to remove \nthe tilelayer \""+f.tiles_name.value+"\" from this maptype?")){
			this.showSpinner("Removing Tilelayer...");
			var tid = f.tilelayer_id.value;
			var mid = f.maptype_id.value;
			var str = "edit_tilelayer.php?maptype_id=" + mid + "&tilelayer_id=" + f.tid + "&remove_tilelayer=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveTilelayer, this), tid, mid );
		}
	 },

	 "expungeTilelayer": function(f){
	 	if (confirm("Are you sure you want to delete \nthe tilelayer \""+f.tiles_name.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Tilelayer...");
			var tid = f.tilelayer_id.value;
			var str = "edit_tilelayer.php?tilelayer_id=" + tid + "&expunge_tilelayer=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveTilelayer, this), tid, null );
		}
	 },

	 "storeCopyright": function(f){
		this.showSpinner("Saving Copyright...");
		var str = "edit_copyright.php?" + queryString(f);
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updateCopyright, this) ); 
	 },
	 
	 "removeCopyright": function(f){
	 	if (confirm("Are you sure you want to remove \nthe copyright from this tilelayer?")){
			this.showSpinner("Removing Copyright...");
			this.editSetId = f.set_id.value;
			this.editCopyrightId = f.copyright_id.value;
			var str = "edit_copyright.php?set_id=" + this.editSetId + "&copyright_id=" + this.editCopyrightId + "&remove_copyright=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveCopyright, this) );
		}
	 },

	 "expungeCopyright": function(f){
	 	if (confirm("Are you sure you want to delete \nthe copyright? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Copyright...");
			this.editSetId = f.set_id.value;
			this.editCopyrightId = f.copyright_id.value;
			var str = "edit_copyright.php?copyright_id=" + this.editCopyrightId + "&expunge_copyright=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemoveCopyright, this) );
		}
	 },
		 
	 "storePolyline": function(f){
		this.showSpinner("Saving Polyline...");
		var str = "edit_polyline.php?" + queryString(f);
		this._setIdRef = f.set_id.value;
		this.editObjectN = this._polylineIndexRef;
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolyline, this) ); 
	 },
	 
	 "removePolyline": function(f){
	 	if (confirm("Are you sure you want to remove \nthe polyline \""+f.title.value+"\" from this polyline set?")){
			this.showSpinner("Removing Polyline...");
			this._setIdRef = f.set_id.value;
			this.editPolylineId = f.polyline_id.value;
			var str = "edit_polyline.php?set_id=" + this._setIdRef + "&polyline_id=" + this.editPolylineId + "&remove_polyline=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolyline, this) ); 
		}
	 },

	 "expungePolyline": function(f){
	 	if (confirm("Are you sure you want to delete \nthe polylineset \""+f.title.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Polyline...");
			this._setIdRef = f.set_id.value;
			this.editPolylineId = f.polyline_id.value;
			var str = "edit_polyline.php?polyline_id=" + this.editPolylineId + "&expunge_polyline=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolyline, this) );
		}
	 },

	 "storePolylineSet": function(f){
		this.showSpinner("Saving Polylineset...");
		var str = "edit_polylineset.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
		//this._setIdRef = f.set_id.value;
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolylineSet, this) ); 
	 },

	 "removePolylineSet": function(f){
	 	if (confirm("Are you sure you want to remove \nthe polylineset \""+f.title.value+"\" from this map?")){
			this.showSpinner("Removing Polylineset...");
			this._setIdRef = f.set_id.value;
			var str = "edit_polylineset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polylineset=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolylineSet, this) );
		}
	 },

	 "expungePolylineSet": function(f){
	 	if (confirm("Are you sure you want to delete \nthe polylineset \""+f.title.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Polylineset...");
			this._setIdRef = f.set_id.value;
			var str = "edit_polylineset.php?" + "set_id=" + f.set_id.value + "&expunge_polylineset=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolylineSet, this) ); 
		}
	 },
	 
	 "storePolylineStyle": function(f){
		this.showSpinner("Saving Polylinestyle...");
		var str = "edit_polylinestyle.php?" + queryString(f);
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolylineStyle, this) ); 
	 },
		 
	 "storePolygon": function(f){
		this.showSpinner("Saving Polygon...");
		var str = "edit_polygon.php?" + queryString(f);
		this._setIdRef = f.set_id.value;
		this.editObjectN = this._polygonIndexRef;
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolygon, this) ); 
	 },
	 
	 "removePolygon": function(f){
	 	if (confirm("Are you sure you want to remove \nthe polygon \""+f.title.value+"\" from this polygon set?")){
			this.showSpinner("Removing Polygon...");
			this._setIdRef = f.set_id.value;
			this.editPolygonId = f.polygon_id.value;
			var str = "edit_polygon.php?set_id=" + this._setIdRef + "&polygon_id=" + this.editPolygonId + "&remove_polygon=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygon, this) ); 
		}
	 },

	 "expungePolygon": function(f){
	 	if (confirm("Are you sure you want to delete \nthe polygon \""+f.title.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Polygon...");
			this._setIdRef = f.set_id.value;
			this.editPolygonId = f.polygon_id.value;
			var str = "edit_polygon.php?polygon_id=" + this.editPolygonId + "&expunge_polygon=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygon, this) ); 
		}
	 },

	 "storePolygonSet": function(f){
		this.showSpinner("Saving Polygonset...");
		var str = "edit_polygonset.php?" + queryString(f) + "&gmap_id=" + this.Map.id;
		//this._setIdRef = f.set_id.value;
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolygonSet, this) ); 
	 },

	 "removePolygonSet": function(f){
	 	if (confirm("Are you sure you want to remove \nthe polygonset \""+f.title.value+"\" from this map?")){
			this.showSpinner("Removing Polygonset...");
			this._setIdRef = f.set_id.value;
			var str = "edit_polygonset.php?" + "set_id=" + f.set_id.value + "&gmap_id=" + this.Map.id + "&remove_polygonset=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygonSet, this) ); 
		}
	 },

	 "expungePolygonSet": function(f){
	 	if (confirm("Are you sure you want to delete \nthe polygonset \""+f.title.value+"\"? \n\nThis can not be undone!")){
			this.showSpinner("Deleting Polygonset...");
			this._setIdRef = f.set_id.value;
			var str = "edit_polygonset.php?" + "set_id=" + f.set_id.value + "&expunge_polygonset=true"+"&tk="+bitTk;
			doSimpleXMLHttpRequest(str).addCallback( bind(this.updateRemovePolygonSet, this) ); 
		}
	 },

	 "storePolygonStyle": function(f){
		this.showSpinner("Saving Polygonstyle...");
		var str = "edit_polygonstyle.php?" + queryString(f);
		doSimpleXMLHttpRequest(str).addCallback( bind(this.updatePolygonStyle, this) ); 
	 },
	 	
	/*******************
	 *
	 * POST Edit Callbacks
	 *
	 *******************/	 
		 
	 "updateMap": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		// convenience
		var $s = partial( bind(this.getXMLTagValue, this), xml );
		var $i = function( s ){ return parseInt( $s( s ) )};
		var $f = function( s ){ return parseFloat( $s( s ) )};
		var m = this.Map;

		m.id = $i('gmap_id');
		m.title = $s('title');
		m.description = $s('description');
		m.data = $s('data')!=null?$s('data'):"";
		m.parsed_data = $s('parsed_data')!=null?$s('parsed_data'):"";
		m.width = $i('width');
		m.height = $i('height');
		m.center.lat = $f('lat');
		m.center.lng = $f('lng');
		m.zoom = $i('zoom');
		m.maptype = $i('maptype');
		m.controls.zoom_control = $s('zoom_control');
		m.controls.maptype_control = $s('maptype_control');
		m.controls.overview_control = $s('overview_control');
		m.controls.scale = $s('scale');
		m.allow_comments = $s('allow_comments');

		//replace everything	
		var maptile = $('map_title');
		if (maptile){maptile.innerHTML=this.Map.title;}
		
		var mapdesc = $('map_desc');
		if (mapdesc){mapdesc.innerHTML=this.Map.description;}
		
		$('mapcontent').innerHTML = this.Map.parsed_data;

		var mapdiv = $(this.Map.mapdiv);
		if (this.Map.width != '0' && this.Map.width != 0){
		   var newWidth = this.Map.width + "px";
		}else{
		   var newWidth = 'auto';
		}
		mapdiv.style.width = newWidth; 
		if (this.Map.height != '0' && this.Map.height != 0){
			window.onresize = null;
			var newHeight = this.Map.height + "px";
			mapdiv.style.height = newHeight; 
			if ( $('gmap-sidepanel') != null){
				$('gmap-sidepanel').style.height = newHeight;
			}
		}else{
			//auto resize stuff
			this.Map.MR = BitMap.Utl.MapResize;
			//set these variables to customize
			this.Map.MR.regOffsetObjs([$('gmap-header'),$('footer')]);
			this.Map.MR.regOffsetBonus(0);
			this.Map.MR.regMinSize(400);
			//these are constants dont mess with them
			this.Map.MR.regMap(this.Map.map);
			this.Map.MR.regMapDiv(mapdiv);
			this.Map.MR.regPanelDiv($('gmap-sidepanel'));
			this.Map.MR.sizeMapDiv();
			this.Map.MR.setResizeListener();
		}

		if (mapdiv){
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
		this.editMap(this.Map.id);	
		$('ecancel').href = BitSystem.urls.gmap+"index.php?gmap_id="+this.Map.id;
		$('ecancel-span').style.display = 'inline';
		}
	 },


		 
	/*******************
	 *
	 * POST XML Marker Functions
	 *
	 *******************/
	
	"updateMarker": function(set_id, marker_id, rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		var m = null;
		var s = null;
		var ms = this.Map.markers;
		var ss = this.Map.markersets;
		for (var x=0; x<ss.length; x++){
			if ( ss[x].set_id == set_id ){
				s = ss[x];
				break;
			}
		}
		if( marker_id != null && marker_id != ''){
			for (var n=0; n<ms.length; n++){
				if ( ms[n].marker_id == marker_id ){
					m = ms[n];
					break;
				}
			}
		}
	    if ( m == null){
			n = ms.length;
			m = ms[n] = {};
			m.set_id = s.set_id;
			m.style_id = s.style_id;
			m.icon_id = s.icon_id;
			m.plot_on_load = s.plot_on_load;
			m.side_panel = s.side_panel;
			m.explode = s.explode;
			m.array_n = parseInt(n);
	    }

		//add the xml data to the marker record
		this.parseMarkerXML(m, xml);

		//unload the marker if it exists
		if ( m.gmarker ){ this.Map.map.removeOverlay( m.gmarker ) };
		
		//make the marker
		this.editMarkers(x);
		this.Map.addMarker(n);
		this.removeAssistant();
		this.hideSpinner("DONE!");
		this.Map.attachSideMarkers();
		this.editMarker(n,x);
		}
	},


	"parseMarkerXML": function(m, xml){
		// convenience
		var $s = partial( bind(this.getXMLTagValue, this), xml );
		var $i = function( s ){ return parseInt( $s( s ) )};
		var $f = function( s ){ return parseFloat( $s( s ) )};

		//shorten var names
		m.marker_id = $i('marker_id');
		m.content_id = $i('content_id');
		m.title = $s('title');			
		m.lat = $f('lat');
		m.lng = $f('lng');
		m.parsed_data = $s('parsed_data');
		m.label_data = $s('label')?$s('label'):'';
		m.parsed_label_data = $s('parsed_label')?$s('parsed_label'):'';
		m.allow_comments = $s('allow_comments');
	},		 	 
	
	
	"updateMarkerSet": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		var n_i = this.editObjectN;
		var s;
	    if ( n_i == null){
			n_i = this.Map.markersets.length;
			this.Map.markersets[n_i] = [];
			s= this.Map.markersets[n_i];
		}else{
			s = this.Map.markersets[n_i];
			var oldStyle = s.style_id;
			var oldIcon = s.icon_id;
		}

		// convenience
		var $s = partial( bind(this.getXMLTagValue, this), xml );
		var $i = function( s ){ return parseInt( $s( s ) )};

		s.set_id = $i('set_id');
		s.title = $s('title');
		s.description = $s('description');
		s.style_id = $i('style_id');
		s.icon_id = $i('icon_id');
		s.plot_on_load = $s('plot_on_load')=='true'?true:false;
		s.side_panel = $s('side_panel')=='true'?true:false;
		s.explode = $s('explode')=='true'?true:false;
		
		this.hideSpinner("DONE!");

		if (this.editObjectN == null){
			BitMap.hide('edit-markerset-new');
			// if we have a new set we assume our session knows nothing about it's icon
			if( s.icon_id ){
				this.getIconStyle( s.icon_id );
			}
			// update the sets menus
			this.cancelEditMarkerSets();
			this.editMarkerSets();
			this.editMarkers(n_i);		
		}else{
			// update effected markers in the set
			if ( ( oldStyle != s.style_id ) || ( oldIcon != s.icon_id ) ) {
				a = this.Map.markers;
				for(n in a){
					if (a[n] != null && a[n].set_id == s.set_id ){
						a[n].style_id = s.style_id;
						a[n].icon_id = s.icon_id;
						//unload the marker
						this.Map.map.removeOverlay( a[n].gmarker );
						//define marker
						this.Map.addMarker(n);
					}
				}
				// if we have a new icon style we assume our session knows nothing about it
				if( oldIcon != s.icon_id ){
					this.getIconStyle( s.icon_id );
				}
			}
			// update the sets menus and side panel
			this.Map.attachSideMarkers();
			this.editMarkerSet(this.editObjectN);
		}
		}
	},
	
	
	//this needs special attention
	"updateRemoveMarker": function(rslt){
		if ( this.verifyRslt(rslt) ){
			var ref = this.Map;
			for (var n=0; n<ref.markers.length; n++){
				var M = ref.markers[n];
				if ( ( M != null ) && ( M.marker_id == this.editMarkerId ) ){
					if ( typeof( M.gmarker ) != 'undefined' && M.gmarker.plotted == true ){
						ref.map.removeOverlay(M.gmarker);
					}
					ref.markers[n].gmarker = null;
					ref.markers[n] = null;
				}
			}
			ref.attachSideMarkers();
			var S = ref.markersets;
			for (n=0;n<S.length;n++){
				if (S[n].set_id == this._setIdRef){
					this.editMarkers(n);
					break;
				}
			}
			this.hideSpinner("DONE!");
		}
	},


	"updateRemoveMarkerSet": function(){
		if ( this.verifyRslt(rslt) ){
			for (var n=0; n<this.Map.markers.length; n++){
				if ( ( this.Map.markers[n] != null ) && ( this.Map.markers[n].set_id == this._setIdRef ) ){
					if ( typeof( this.Map.markers[n].gmarker != 'undefined' ) ){
						this.Map.map.removeOverlay(this.Map.markers[n].gmarker);
					}
					this.Map.markers[n].gmarker = null;
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
			this.editMarkers();
			this.hideSpinner("DONE!");
		}
	},
	
	
	"updateMarkerStyle": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;

		//the style data we are changing
		var n_i = this.editObjectN;
	    if ( n_i != null){
			var n_i = this.Map.markerstyles.length;
			this.Map.markerstyles[n_i] = [];
			var s = this.Map.markerstyles[n_i];
	    }else{
			var s = this.Map.markerstyles[n_i];
			var oldtp = s.marker_style_type;
		}

		// assign markerstyle values data array			
		var id = xml.getElementsByTagName('style_id');			
		s.style_id = parseInt( id[0].firstChild.nodeValue );
		var nm = xml.getElementsByTagName('name');			
		s.name = this.getNodeValue( nm[0].firstChild );
		var tp = xml.getElementsByTagName('marker_style_type');
		s.marker_style_type = parseInt( tp[0].firstChild.nodeValue );
		var lho = xml.getElementsByTagName('label_hover_opacity');			
		s.label_hover_opacity = parseInt( lho[0].firstChild.nodeValue );
		var lo = xml.getElementsByTagName('label_opacity');			
		s.label_opacity = parseInt( lo[0].firstChild.nodeValue );
		var lhs = xml.getElementsByTagName('label_hover_styles');			
		s.label_hover_styles = lhs[0].firstChild.nodeValue;
		var ws = xml.getElementsByTagName('window_styles');			
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
		this.editMarkerStyle(n_i);
		
		if ( this.editObjectN != null){
			//update all markers
			var a = this.Map.markers;
			//if the length of the array is > 0
			if (a.length > 0){
			//loop through the array
			for(var n=0; n<a.length; n++){
				//if the array item is not Null
				if (a[n]!= null && a[n].gmarker != null && a[n].style_id == s.style_id && s.marker_style_type != oldtp){
					//unload the marker
					this.map.removeOverlay( a[n].gmarker );
					//define new marker with new styles
						this.Map.addMarker(n);
					}
				}
			}
		}
		}
	},

	
	"updateIconStyle": function(icon_id, refr, rslt){
		if ( this.verifyRslt(rslt) ){
	    var xml = rslt.responseXML.documentElement;
		var i = null;
		var is = this.Map.iconstyles;
		for (var n=0; n<is.length; n++){
			if ( is[n].icon_id == icon_id ){
				i = is[n];
				break;
			}
		}
	    if ( i == null){
			n = is.length;
			i = is[n] = [];
	    }
	    
		// convenience
		var $s = partial( bind(this.getXMLTagValue, this), xml );
		var $i = function( s ){ return parseInt( $s( s ) )};

		// assign iconsstyle values to data array
		i.icon_id = $i('icon_id');
		i.name = $s('name');
		i.icon_style_type = $i('icon_style_type');
		i.image = $s('image');
		i.rollover_image = $s('rollover_image');
		i.icon_w = $i('icon_w');
		i.icon_h = $i('icon_h');
		i.shadow_image = $s('shadow_image');
		i.shadow_w = $i('shadow_w');
		i.shadow_h = $i('shadow_h');
		i.icon_anchor_x = $i('icon_anchor_x');
		i.icon_anchor_y = $i('icon_anchor_y');
		i.shadow_anchor_x = $i('shadow_anchor_x');
		i.shadow_anchor_y = $i('shadow_anchor_y');
		i.infowindow_anchor_x = $i('infowindow_anchor_x');
		i.infowindow_anchor_y = $i('infowindow_anchor_y');

		//update the icon
		if (i.icon_style_type == 0) {
			this.Map.defineGIcon(n);
		}

		//update all markers
		var a = this.Map.markers;
		if (a.length > 0){
			for(var n=0; n<a.length; n++){
				if (a[n]!= null && a[n].gmarker != null && a[n].icon_id == i.icon_id){
					//unload the marker
					this.Map.map.removeOverlay( a[n].gmarker );
					//define the marker
					this.Map.addMarker(n);
				}
			}
		}
		
		this.Map.attachSideMarkers();

		this.hideSpinner("DONE!");
		if( refr ){
			// update the styles menus
			this.editIconStyles();
		}
		}
	},



	"updateMaptype": function(mid, rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		var m = null;
		var mt = this.Map.maptypes;
		for (var n=0; n<mt.length; n++){
			if ( mt[n].maptype_id == mid ){
				m = mt[n];
				break;
			}
		}
	    if ( m == null){
			n = mt.length;
			m = mt[n] = [];
			m.tilelayer_ids = [];
	    }

		// var n = ( this.editObjectN != null )?this.editObjectN:this.Map.maptypes.length;
		// var m = this.Map.maptypes[n] = [];
		
		//add the xml data to the marker record
		this.parseMaptypeXML(m, xml);
		m.maptype_node = n;
		
		/*
		@TODO if this.editObjectN != null remove the maptype from the map
		@TODO add the maptype to the map			
		@TODO set the map type to active
		//this.Map.map.setMaptype( this.Map.maptypes[this.Map.maptypes[n].name] );
		@TODO update the controls
		//this.Map.map.removeControl(typecontrols);
		//this.Map.map.addControl(typecontrols);
		*/
		
		// update the maptype
		this.hideSpinner("DONE!");
		this.cancelEditMaptypes();
		this.editMaptypes();
		if ( this.editObjectN == null ){
		//if its a new maptype push the user to the tilelayer
			this.editMaptypeTilelayers(n);
		}else{
			this.editMaptype(n);
		}
		}
	},
	
	"parseMaptypeXML": function(m, xml){
		// assign map type values data array				
		var id = xml.getElementsByTagName('maptype_id');			
		m.maptype_id = parseInt( id[0].firstChild.nodeValue );
		var nm = xml.getElementsByTagName('name');			
		m.name = this.getNodeValue( nm[0].firstChild );
		var snm = xml.getElementsByTagName('shortname');			
		m.shortname = this.getNodeValue( snm[0].firstChild );
		var ds = xml.getElementsByTagName('description');			
		m.description = this.getNodeValue( ds[0].firstChild );	  		
		var minz = xml.getElementsByTagName('minzoom');
		m.minzoom = parseInt( minz[0].firstChild.nodeValue );
		var mz = xml.getElementsByTagName('maxzoom');
		m.maxzoom = parseInt( mz[0].firstChild.nodeValue );
		var er = xml.getElementsByTagName('errormsg');			
		m.errormsg = this.getNodeValue( er[0].firstChild );
	},
	 
	"updateRemoveMaptype": function(mid, rslt){
		if ( this.verifyRslt(rslt) ){
			var m = null;
			var mt = this.Map.maptypes;
			for (var n=0; n<mt.length; n++){
				if ( mt[n].maptype_id == mid ){
					m = mt[n];
					break;
				}
			}
			
			// get maptype node value
			var p = m.maptype_node;
			// remove the maptype ref form the map array of types
			this.Map.maptypes[m.name] = null;
			// remove the controls
			this.Map.map.removeControl(typecontrols);
			// remove it from the map			
			this.Map.map.mapTypes.splice(p, 1);
			// add the controls
			this.Map.map.addControl(typecontrols);
			
			/* @todo we should first check if the map is on display, and then if so flip to street */
			// we flip to street mode
			this.Map.map.setMaptype(this.Map.map.mapTypes[0]);
			
			// remove by id the maptype form
			for (var j=0; j<this.Map.maptypes.length; j++){
				if ( ( this.Map.maptypes[j] != null ) && ( this.Map.maptypes[j].maptype_id == mid ) ){
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
		}
	},

	"updateTilelayer": function(rslt){
		if ( this.verifyRslt(rslt) ){
	    var xml = rslt.responseXML.documentElement;
		//the marker data we are changing
		var n_i = this.editObjectN;
	    var s_i = this._setIndexRef;
	    if ( n_i != null){
			//the copyright data we are changing
			t = this.Map.tilelayers[n_i];
	    }else{
			n_i = this.Map.tilelayers.length;		
			t = this.Map.tilelayers[n_i] = {};
	    }

		//add the xml data to the tilelayer record
		this.parseTilelayerXML(t, xml);
		t.maptype_id = this._setIdRef;
		
		//remove the related maptype
		//re-add the maptype
		/*  *******  */
		// probably needs a ref to parent maptype
		/*  *******  */
		//add the tilelayer
		//this.Map.addTilelayer(n);
		
		this.hideSpinner("DONE!");
		// update the maptypes menus
		this.editMaptypeTilelayers(s_i);
		this.editTilelayer(n_i,s_i);
		}
	},
	
	"parseTilelayerXML": function(tl, xml){
		// convenience
		var $s = partial( bind(this.getXMLTagValue, this), xml );
		var $i = function( s ){ return parseInt( $s( s ) )};
		var $f = function( s ){ return parseFloat( $s( s ) )};

		// assign maptype values to data array	
		tl.tilelayer_id = $i('tilelayer_id');
		tl.tiles_name = $s('tiles_name');
		tl.tiles_minzoom = $i('tiles_minzoom');
		tl.tiles_maxzoom = $i('tiles_maxzoom');		
		tl.ispng = $s('ispng');
		tl.tilesurl = $s('tilesurl');
		tl.opacity = $f('opacity');
	},

	"updateRemoveTilelayer": function( tid, mid, rslt ){
		if ( this.verifyRslt(rslt) ){
			// we only need to remove the reference from affected maptypes we ignore the tilelayers array
			var a = this.Map.maptypes;
			for (n in a){
				// if maptype_id == null we delete the tilelayer from all else remove on match
				if ( (mid == null || a[n].maptype_id == mid) && ( (x=MochiKit.Base.findIdentical( a[n].tilelayer_ids, tid )) > -1 ) ){
					/* @TODO remove layer from related maptype and update maptype on map */
					a[n].tilelayer_ids[x] = null;
				}

			}
			/* @todo update the map */
			if( mid != null ){
				this.editMaptype(mid);
				this.editTilelayers();
			}else{
				/* @todo put a confirmation message in the tilelayer edit window */
				this.cancelEditMaptypes();
				this.editMaptypes();
			}
			this.hideSpinner("DONE!");
		}	
	},

	"updateCopyright":function(rslt){
		if ( this.verifyRslt(rslt) ){
	    var xml = rslt.responseXML.documentElement;
	    var s = this._setIndexRef;
		var n = this.editObjectN;
		var c;
	    if ( n != null){
			//the copyright data we are changing
			c = this.Map.copyrights[n];
	    }else{
			n = this.Map.copyrights.length;
			c = this.Map.copyrights[n] = {};
	    }
		//add the xml data to the copyright record
		this.parseCopyrightXML(c, xml);
		c.tilelayer_id = this._setIdRef;

		/*
		@TODO remove the related maptype
		@TODO re-add the maptype
		*/
		
		this.hideSpinner("DONE!");
		// update the tilelayers menus
		this.editTilelayer(s);
		this.editCopyright(n, s);
		}
	},
	
	"parseCopyrightXML":function(c, xml){
		// assign map type values data array				
		var id = xml.getElementsByTagName('copyright_id');			
		c.copyright_id = parseInt( id[0].firstChild.nodeValue );
		var minz = xml.getElementsByTagName('copyright_minzoom');
		c.copyright_minzoom = parseInt( minz[0].firstChild.nodeValue );
		var bds = xml.getElementsByTagName('bounds');
		c.bounds = this.getNodeValue( bds[0].firstChild );
		var nt = xml.getElementsByTagName('notice');
		c.notice = this.getNodeValue( nt[0].firstChild );
	},
	
	"updateRemoveCopyright":function(){
		if ( this.verifyRslt(rslt) ){
			var n = this.editObjectN;
			this.Map.copyrights[n] = null;
	
			/*
			@TODO remove the related maptype
			@TODO re-add the maptype
			*/
		
			this.hideSpinner("DONE!");
			this.cancelEditCopyright();
			this.editTilelayer(s);	
		}
	},

	"updatePolyline": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;							
		var n_i = this.editObjectN;
		var s_i = this._setIndexRef;
		var p;
		if ( n_i == null){
			var n_i = this.Map.polylines.length;
			p = this.Map.polylines[n_i] = [];
			p.array_n = n_i;
		}else{
			p = this.Map.polylines[n_i];
		}
		//shorten var names
		var id = xml.getElementsByTagName('polyline_id');
		p.polyline_id = id[0].firstChild.nodeValue;
		var nm = xml.getElementsByTagName('title');
		p.title = nm[0].firstChild.nodeValue;
		var dt = xml.getElementsByTagName('points_data');
		var points_data = dt[0].firstChild.nodeValue;
		p.points_data = points_data.split(",");
		if ( this.editObjectN == null){
			var s = this.Map.polylinesets[s_i];
			p.set_id = s.set_id;
			p.style_id = s.style_id;
			p.plot_on_load = s.plot_on_load;
			p.side_panel = s.side_panel;
			p.explode = s.explode;
			p.array_n = parseInt(n_i);
		}else{
			this.Map.map.removeOverlay(p.polyline);
		}
		//create polyline
		this.Map.addPolyline(n_i);
		this.removeAssistant();
		this.hideSpinner("DONE!");
		this.editPolylines(s_i);
		this.editPolyline(n_i);
		}
	},

	"updatePolylineSet": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		var n_i = this.editObjectN;
		var s;
	    if ( n_i == null){
			n_i = this.Map.polylinesets.length;
			this.Map.polylinesets[n_i] = [];
			s = this.Map.polylinesets[n_i];
		}else{
			s = this.Map.polylinesets[n_i];
			var oldStyle = s.style_id;
		}

		//shorten var names
		var id = xml.getElementsByTagName('set_id');			
		s.set_id = parseInt(id[0].firstChild.nodeValue);
		var nm = xml.getElementsByTagName('title');
		s.title = nm[0].firstChild.nodeValue;
		var dc = xml.getElementsByTagName('description');
		s.description = this.getNodeValue( dc[0].firstChild );
		var sy = xml.getElementsByTagName('style_id');
		s.style_id = parseInt(sy[0].firstChild.nodeValue);			

		this.hideSpinner("DONE!");

		if (this.editObjectN == null){
			BitMap.hide('edit-polylineset-new');
			// update the sets menus
			this.cancelEditPolylineSets();
			this.editPolylineSets();
			this.editPolylines(n_i);
		}else{
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
			}
			// update the sets menus
			this.editPolylineSet(this.editObjectN);
		}
		}
	},
	
	"updatePolylineStyle": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		
		//the style data we are changing
		var n_i = this.editObjectN;
	    if ( n_i != null){
			var n_i = this.Map.polylinestyles.length;
			this.Map.polylinestyles[n_i] = [];
			var s = this.Map.polylinestyles[n_i];
	    }else{
			var s = this.Map.polylinestyles[n_i];
		}

		// assign polylinestyle values data array			
		var id = xml.getElementsByTagName('style_id');			
		s.style_id = parseInt( id[0].firstChild.nodeValue );
		var nm = xml.getElementsByTagName('name');			
		s.name = nm[0].firstChild.nodeValue;
		var cl = xml.getElementsByTagName('color');			
		s.color = cl[0].firstChild.nodeValue;
		var wt = xml.getElementsByTagName('weight');			
		s.weight = parseInt( wt[0].firstChild.nodeValue );
		var op = xml.getElementsByTagName('opacity');			
		s.opacity = op[0].firstChild.nodeValue;

		this.hideSpinner("DONE!");
		// update the styles menus
		this.editPolylineStyles();
		this.editPolylineStyle(n_i);
		
		if ( this.editObjectN != null){
			//for each polyline
			var a = this.Map.polylines;
			//if the length of the array is > 0
			if (a.length > 0){
			//loop through the array
				for(var n=0; n<a.length; n++){
				//if the array item is not Null
					if (a[n]!= null && a[n].polyline != null && a[n].style_id == s.style_id){
							this.Map.map.removeOverlay( a[n].polyline );
					this.Map.addPolyline(n);
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
						this.Map.addPolygon(i);
					}
				}
			}
		}
		}
	 },	

	"updateRemovePolyline": function(){
		if ( this.verifyRslt(rslt) ){
        var xml = rslt.responseXML;
        var status = xml.documentElement.getElementsByTagName('code')[0].firstChild.nodeValue;
		if (status == '200'){
			for (var i=0; i<this.Map.polylines.length; i++){
				if ( Map.Polylines[i] != null && this.Map.polylines[i].polyline_id == this.editPolylineId ){
					if( typeof( this.Map.polylines[n].polyline ) != 'undefined' ){
						this.Map.map.removeOverlay(this.Map.polylines[i].polyline);
					}
					this.Map.polylines[i].polyline = null;
					this.Map.polylines[i] = null;
				}
			}
			this.hideSpinner("DONE!");
			this.editPolylines();
			this.editPolylineSet(this._setIdRef);
		}else{
			var msg = xml.documentElement.getElementsByTagName('content')[0].firstChild.nodeValue;
			alert(msg);
		}		
		}
	},

	//this needs special attention
	"updateRemovePolylineSet": function(){
		if ( this.verifyRslt(rslt) ){
			for (var n=0; n<this.Map.polylines.length; n++){
				if ( ( this.Map.polylines[n] != null ) && ( this.Map.polylines[n].set_id == this.editSetId ) ){
					if( typeof( this.Map.polylines[n].polyline != null ) ){
						this.Map.map.removeOverlay(Map.Polylines[n].polyline);
					}
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
			this.editPolylines();
			this.hideSpinner("DONE!");
		}
	},

	"updatePolygon": function(rslt){
		if ( this.verifyRslt(rslt) ){
	    var xml = rslt.responseXML.documentElement;							
		var n_i = this.editObjectN;
		var s_i = this._setIndexRef;
		var p;
		if ( n_i == null){
			var n_i = this.Map.polygons.length;
			p = this.Map.polygons[n_i] = [];
			p.array_n = n_i;
		}else{
			p = this.Map.polygons[n_i];
		}
		
		//shorten var names
		var id = xml.documentElement.getElementsByTagName('polygon_id');			
		p.polygon_id = parseInt(id[0].firstChild.nodeValue);
		var nm = xml.documentElement.getElementsByTagName('title');
		p.title = nm[0].firstChild.nodeValue;
		var dt = xml.documentElement.getElementsByTagName('points_data');
		var points_data = dt[0].firstChild.nodeValue;
		p.points_data = points_data.split(",");
		var cc = xml.documentElement.getElementsByTagName('circle_center');
		var circle_center = cc[0].firstChild.nodeValue;
		p.circle_center = circle_center.split(",");
		var rd = xml.documentElement.getElementsByTagName('radius');
		p.radius = rd[0].firstChild.nodeValue;
		
		if ( this.editObjectN == null){
			var s = this.Map.polygonsets[s_i];
			p.set_id = s.set_id;
			p.style_id = s.style_id;
			p.plot_on_load = s.plot_on_load;
			p.side_panel = s.side_panel;
			p.explode = s.explode;
			p.array_n = parseInt(n_i);
		}else{
			this.Map.map.removeOverlay(p.polygon);
		}
		
		//create polygon
		this.Map.addPolygon(n_i);
		this.removeAssistant();
		this.hideSpinner("DONE!");
		this.editPolygons(s_i);
		this.editPolygon(n_i);
		}
	},

	"updatePolygonSet": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		var n_i = this.editObjectN;
		var s;
	    if ( n_i == null){
			n_i = this.Map.polygonsets.length;
			this.Map.polygonsets[n_i] = [];
			s = this.Map.polygonsets[n_i];
		}else{
			s = this.Map.polygonsets[n_i];
			var oldStyle = s.style_id;
		}

		//shorten var names
		var id = xml.getElementsByTagName('set_id');			
		s.set_id = parseInt(id[0].firstChild.nodeValue);
		var nm = xml.getElementsByTagName('title');
		s.title = nm[0].firstChild.nodeValue;
		var dc = xml.getElementsByTagName('description');
		s.description = this.getNodeValue( dc[0].firstChild );
		var sy = xml.getElementsByTagName('style_id');
		s.style_id = parseInt(sy[0].firstChild.nodeValue);			
		var plsy = xml.getElementsByTagName('polylinestyle_id');
		s.polylinestyle_id = parseInt(plsy[0].firstChild.nodeValue);			

		this.hideSpinner("DONE!");

		if (this.editObjectN == null){
			BitMap.hide('edit-polygonset-new');
			// update the sets menus
			this.cancelEditPolygonSets();
			this.editPolygonSets();
			this.editPolygons(n_i);
		}else{
			if ( oldStyle != s.style_id ) {
				a = this.Map.polygons;
				//if the length of the array is > 0
				if (a.length > 0){
					//loop through the array
					for(var n=0; n<a.length; n++){
						//if the array item is not Null
						if (a[n]!= null && a[n].polygon != null && a[n].set_id == s.set_id){
							a[n].style_id = s.style_id;
							//unload the polygon
							this.Map.map.removeOverlay( a[n].polygon );
							//create polygon
							this.addPolygon(n);
						}
					}
				}
			}
			// update the sets menus
			this.editPolygonSet(this.editObjectN);
		}
		}
	},
	
	"updatePolygonStyle": function(rslt){
		if ( this.verifyRslt(rslt) ){
		var xml = rslt.responseXML.documentElement;
		
		//the style data we are changing
		var n_i = this.editObjectN;
	    if ( n_i != null){
			var n_i = this.Map.polygonstyles.length;
			this.Map.polygonstyles[n_i] = [];
			var s = this.Map.polygonstyles[n_i];
	    }else{
			var s = this.Map.polygonstyles[n_i];
		}

		// assign polygonstyle values data array			
		var id = xml.getElementsByTagName('style_id');			
		s.style_id = parseInt( id[0].firstChild.nodeValue );
		var nm = xml.getElementsByTagName('name');			
		s.name = nm[0].firstChild.nodeValue;
		var cl = xml.getElementsByTagName('color');			
		s.color = cl[0].firstChild.nodeValue;
		var op = xml.getElementsByTagName('opacity');			
		s.opacity = op[0].firstChild.nodeValue;

		this.hideSpinner("DONE!");
		// update the styles menus
		this.editPolygonStyles();
		this.editPolygonStyle(n_i);
		
		if ( this.editObjectN != null){
			//for each polygon
			var a = this.Map.polygons;
			//if the length of the array is > 0
			if (a.length > 0){
			//loop through the array
				for(var n=0; n<a.length; n++){
				//if the array item is not Null
					if (a[n]!= null && a[n].polygon != null && a[n].style_id == s.style_id){
							this.Map.map.removeOverlay( a[n].polygon );
					this.Map.addPolygon(n);
					}
				}
			}
		}
		}
	 },	

	"updateRemovePolygon": function(){
		if ( this.verifyRslt(rslt) ){
			for (var i=0; i<this.Map.polygons.length; i++){
				if ( Map.Polygons[i] != null && this.Map.polygons[n].polygon != null && this.Map.polygons[i].polygon_id == this.editPolygonId ){
					this.Map.map.removeOverlay(this.Map.polygons[i].polygon);
					this.Map.polygons[i].polygon = null;
					this.Map.polygons[i] = null;
				}
			}
			this.editPolygons();
			this.editPolygonSet(this._setIdRef);
			this.hideSpinner("DONE!");
		}		
	},

	//this needs special attention
	"updateRemovePolygonSet": function(){
		if ( this.verifyRslt(rslt) ){
			for (var n=0; n<this.Map.polygons.length; n++){
				if ( ( this.Map.polygons[n] != null ) && ( this.Map.polygons[n].set_id == this.editSetId ) && ( this.Map.polygons[n].polygon != null ) ){
					this.Map.map.removeOverlay(Map.Polygons[n].polygon);
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
			this.editPolygons();
			this.hideSpinner("DONE!");
		}
	},		

	
	/******************
	 *
	 *  Editing Tools
	 *
	 ******************/
	
	"addAssistant": function(a, b){
		this.removeAssistant();
		//marker assistant		
		if (a == 'marker'){
			var f = $('edit-marker-form');
			alert ('Marker ploting assistant activated for '+ f.title.value + ' marker. \n Click to Position!');
			
			var ref = this;
			
			this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay, point){
				if (point) {
					if (ref.TempOverlay != null) {
						this.removeOverlay(ref.TempOverlay);
					}
					ref.TempOverlay = new GMarker(point);
					this.addOverlay(ref.TempOverlay);
					this.panTo(point);
					f['geo[lng]'].value = point.lng();
					f['geo[lat]'].value = point.lat();
				}
			});
		}
		
		//map assistant
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
		//polyline assistant
		if (a == 'polyline'){
			var f = $('edit-polyline-form');
			alert ('Polyline drawing assistant activated for '+ f.title.value + ' polyline. \n Click to Draw!');
			
			this.bModPData = f.poly_data; 
			this.bLastpoint = null;
			this.bTempPoints = [];
			this.TempOverlay = false;
			ref = this;
			
			this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay,point) {
				if (point) {
					if(ref.bLastpoint && ref.bLastpoint.x == point.x && ref.bLastpoint.y == point.y) return;
					ref.bLastpoint = point;
					ref.bTempPoints.push(point);
					if (ref.TempOverlay){
						this.removeOverlay( ref.TempOverlay );
					}
					if (ref.bTempPoints.length){
						var opts = (f.type.options[1].selected)?{geodesic:true}:null;
						ref.TempOverlay = new GPolyline(ref.bTempPoints,"#0000FF", 2, 1, opts)
						this.addOverlay( ref.TempOverlay );
					}
					for(var i=0; i<ref.bTempPoints.length; i++){
						if (i == 0){
							msg = ref.bTempPoints[i].y + ', ' + ref.bTempPoints[i].x;
						}else{
							msg += ', ' + ref.bTempPoints[i].y + ', ' + ref.bTempPoints[i].x;
						}
					}
					f.poly_data.value = msg;
				}
			});
		}
		
		//polygon assistant
		if (a == 'polygon'){
			var f = $('edit-polygon-form');
			ref = this;
			
			if (f.type.options[f.type.selectedIndex].value == 1){
				alert ('Circle-Center drawing assistant activated for '+ f.title.value + ' polygon. \n Click to marker the center of your circle!');
				
				this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay, point){
					if (point) {
						this.panTo(point);
						f.circle_center.value = point.lng() + ", " + point.lat();
					}
				});
			}else{
				alert ('Polygon drawing assistant activated for '+ f.title.value + ' polygon. \n Click to draw the outline. \n\nThe final connection will automatically be \ncompleted for you, so don\'t worry about that.');
				this.bModPData = f.poly_data; 
				this.bLastpoint = null;
				this.bTempPoints = [];
				this.TempOverlay = false;
				
				this.bAssistant = GEvent.addListener(this.Map.map, "click", function(overlay,point) {
					if (point) {
						if(ref.bLastpoint && ref.bLastpoint.x == point.x && ref.bLastpoint.y == point.y) return;
						ref.bLastpoint = point;
						ref.bTempPoints.push(point);
						if (ref.TempOverlay){
							this.removeOverlay( ref.TempOverlay );
						}
						if (ref.bTempPoints.length){
							var opts = (f.type.options[1].selected)?{geodesic:true}:null;
							ref.TempOverlay = new GPolyline(ref.bTempPoints,"#0000FF", 2, 1, opts)
							this.addOverlay( ref.TempOverlay );
						}
						for(var i=0; i<ref.bTempPoints.length; i++){
							if (i == 0){
								msg = ref.bTempPoints[i].y + ', ' + ref.bTempPoints[i].x;
							}else{
								msg += ', ' + ref.bTempPoints[i].y + ', ' + ref.bTempPoints[i].x;
							}
						}
						f.poly_data.value = msg;
					}
				});
			}
		}
	},
	
		
	"removeAssistant": function(){
		if( this.TempOverlay != null ){
	        this.Map.map.removeOverlay( this.TempOverlay );
			this.TempOverlay = null;
		}
	    if (this.bAssistant != null){
	   	    GEvent.removeListener(this.bAssistant);
	  		this.bAssistant = null;
		 }
	 }
}
/* End BitMap.Edit.prototype declaration */
