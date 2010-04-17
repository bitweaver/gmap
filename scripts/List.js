BitMap.MakeCalendar = function(){
	BitMap.Cal = new YAHOO.widget.Calendar('BitMap.Cal', 'gmap-cal');
	BitMap.Cal.render();
	BitMap.Cal.onSelect = BitMap.DateChanged;
}

BitMap.ShowCalendar = function(){
	var pos = MochiKit.Style.getElementPosition('CalLink');
	MochiKit.Style.showElement('gmap-cal-container');
	MochiKit.Style.setElementPosition('gmap-cal-container', {'x':pos.x-80, 'y':pos.y+$('CalLink').offsetHeight+1} ); 
}

BitMap.HideCalendar = function(){
	MochiKit.Style.hideElement('gmap-cal-container');
}

BitMap.DateChanged = function(){
	var f = document['list-query-form'];
	var calendar = BitMap.Cal;
	var selectedDate = new Date(calendar.getSelectedDates()[0]);
	f.from_date.value = Math.floor(selectedDate.getTime()/1000);
	f.hr_date.value = MochiKit.DateTime.toPaddedAmericanDate(selectedDate);
	MochiKit.Style.showElement('gmap-date-range');
	BitMap.SelectDateRange(f.date_range);
}

BitMap.EvalDate = function(){
	var f = document['list-query-form'];
	var date = MochiKit.DateTime.americanDate(f.hr_date.value);	
	if (f.hr_date.value != '' && date != 'Invalid Date'){
			f.from_date.value = Math.floor( date.getTime()/1000);
			BitMap.SelectDateRange(f.date_range);
			MochiKit.Style.showElement('gmap-date-range');
			BitMap.Cal.select(date);
			BitMap.Cal.setMonth(date.getMonth());
			BitMap.Cal.setYear(date.getFullYear());
			BitMap.Cal.render();
	}else{
		f.hr_date.value = (date == 'Invalid Date')?'enter a valid date':'';
		f.from_date.value = null;
		f.until_date.value = null;
		MochiKit.Style.hideElement('gmap-date-range');
		BitMap.Cal.reset();
	}
}

BitMap.SelectDateRange = function(sel){
	var f = document['list-query-form'];
	if(sel.options.selectedIndex == 0){
		f.until_date.value = parseInt(f.from_date.value) + 86399;
	}
	else{
		f.until_date.value = null;
	}
}

/* these are all methods required 
 * for displaying a list of content 
 * on a map as called from map_content.php 
 * they extend BitMap.Map
 */ 

MochiKit.Base.update(BitMap.Map.prototype, {

	"RequestContent": function(f,page){
		page = (typeof(page)!='undefined')?page:1;
		var up_lat = this.map.getBounds().getNorthEast().lat();
		var right_lng = this.map.getBounds().getNorthEast().lng();
		var down_lat = this.map.getBounds().getSouthWest().lat();
		var left_lng = this.map.getBounds().getSouthWest().lng();
		var params = [MochiKit.Base.queryString(f), "&up_lat=",up_lat,"&right_lng=",right_lng,"&down_lat=",down_lat,"&left_lng=",left_lng,"&list_page=",page].join("");
		//account for bug in queryString
		params = params.replace(/liberty_categories%5B%5D=Any/,"");
		params = params.replace(/content_type_guid%5B%5D=Any/,"");

		var str = BitSystem.urls.liberty+"list_content.php?"+params;

		//$('error').innerHTML = str;
		var d = loadJSONDoc(str);
		d.addCallback(bind(this.ReceiveContent, this), params);
		d.addErrback(bind(this.RequestFailure, this));
	},

	"ReceiveContent": function(	query, rslt ){
		if (rslt.Status.code == 200){
			for (n=0; n<this.markers.length; n++){if(this.markers[n].gmarker != 'undefined'){this.map.removeOverlay(this.markers[n].gmarker)}};
			this.markers = rslt.Content;
			var ref = this;
			this.loopOver(ref.markers, function(i){ref.addMarker(i);});
			this.clearSidepanel();
			this.attachSideMarkers();
			this.attachPagination(rslt.ListInfo);
			this.updateViewAsListUrl( query );
		}
		if (rslt.Status.code == 204){
			alert("sorry we couldn't find anything matching your request");
		}
	},

	"RequestFailure": function(err){
		alert("sorry your request failed. Error: " + err);
		//add something here
	},

	"UpdateMarkerList": function(){
		//add to general side panel list
	},

	"addMarker": function(i){
	  if (this.markers[i]!= null){
		var M = this.markers[i];
		M.n = i;
		var p = new GLatLng(parseFloat(M.lat), parseFloat(M.lng));
		// for now we have to assume there is an icon for the content type.
		/* In the future we would like to set the image onerror property something like this, but it needs to be supported by google.
				img.onerror = function () { this.src = "default.jpg"; };
		 */
		var myicon = this.defineContentIcon(M.content_type_guid);
//		var myicon = (M.content_type_guid != null)?new GIcon(G_DEFAULT_ICON, "icons/c_type_pins/" + M.content_type_guid + ".png" ):null;
		var mytip = ["<div class='gmap-tooltip'><div class='tip-content'>", M.title, "</div></div>"].join("");
		M.gmarker = new GxMarker(p, myicon, mytip);
		
		var starsElm = null;
		if (typeof(document.getElementById('iwindow-stars')) != 'undefined' && M.stars_pixels != null){
			starsElm = document.getElementById('iwindow-stars').cloneNode(true);
			var divs = starsElm.getElementsByTagName('div');
				divs.item(0).id = null;
				divs.item(1).style.width = M.stars_pixels + "px";
		}
		var created_date = new Date(M.created * 1000);
		var d = created_date.toString();
		var di = d.lastIndexOf('GMT');
		var ds = d.substring(0, di-10);  
		M.created_date = ds;
		var modified_date = new Date(M.last_modified * 1000);
		var u = modified_date.toString();  
		var ui = u.lastIndexOf('GMT');
		var us = u.substring(0, ui-10);  
		M.modified_date = us;
		var time = (MochiKit.DateTime.toISOTime(modified_date)).substring(0, 5);
		M.short_date = MochiKit.DateTime.toPaddedAmericanDate(modified_date) + " " + time;
		/* @TODO
		 * Need some sort of support for getting an image from fisheye or gallery
		 * For now an empty place holder		 
		 */
		var image = null;
		/* @TODO we should probably check if everything exists first */
		M.gmarker.my_html = MochiKit.DOM.DIV({'class':'gmap-marker'}, 
												H1({'class':'marker-title'}, M.title),
												DIV(null, M.content_name + " created by " + M.creator_real_name + " on " + M.created_date),
												DIV(null, " Last modified by " + M.modifier_real_name + " on " + M.modified_date),
												DIV(null, A({'href':M.display_url}, 'Permalink')),
												starsElm,
												image,
												DIV(null, M.parsed_dull)
											);
		M.gmarker.type = "marker";
		M.gmarker.index = i;
		this.map.addOverlay(M.gmarker);
	  }
	},

	//make side panel of markers
	"attachSideMarkers": function(){
		var center = this.map.getCenter();
		var count = this.markers.length;		
		if (count > 0){
			var s = $('gmap-sidepanel-table');
			$('gmap-map').style.marginRight = '300px';
			$('gmap-sidepanel').style.width = '300px';
			BitMap.show('gmap-sidepanel');
			var markerssorted = MochiKit.Iter.groupby_as_array(this.markers, MochiKit.Base.itemgetter("content_type_guid"));
			forEach(markerssorted, function(leData){
				var rows = map(function(row) {
					return  [ A({"href":"javascript:void(0);","onclick":"BitMap.MapData[0].Map.markers["+row.n+"].gmarker.openInfoWindow(BitMap.MapData[0].Map.markers["+row.n+"].gmarker.my_html);"}, row.title), 
							  row.short_date, 
							  row.stars_rating];
				} ,leData[1]);
		
				row_display = function (row) {
				    return TR(null, map(partial(TD, null), row));
				}
			
				var newTable = TABLE({"class":"data"},
				    THEAD(null, TR(null, 
				    	TD({"class":"data-title"},"title"),
				    	TD({"class":"data-date"},"date"),
				    	TD({"class":"data-rating"},"rating")
						)),
				    TBODY(null, map(row_display, rows))
				    );
			
				var header = DIV({"class":"data-header"}, leData[1][0].content_name + "s");
				s.appendChild(header);
				s.appendChild(newTable);
			});
		}
		this.map.checkResize();
		this.map.setCenter(center);
	},

	"attachPagination": function(ListInfo){
		var tp = ListInfo.total_pages;
		var cp = ListInfo.current_page;
		if (tp > 1){
			var prevLink = (cp > 1)?A ( {'href':'javascript:void(0);', 'onclick':'javascript:BitMap.MapData[0].Map.RequestContent(document["list-query-form"],'+(cp-1)+');'}, "« " ):null;
			var nextLink = (cp < tp)?A ( {'href':'javascript:void(0);', 'onclick':'javascript:BitMap.MapData[0].Map.RequestContent(document["list-query-form"],'+(cp+1)+');'}, " »" ):null;
			
			var d =DIV( {'class':'pagination'}, 
				prevLink,
				SPAN( null, "Page ", STRONG( null, cp ), " of ", STRONG( null, tp ) ),
				nextLink
			);
			$('gmap-sidepanel-table').appendChild( d );
		}
	},

	"clearSidepanel": function(){
		var s = $('gmap-sidepanel-table');
		var count = s.childNodes.length;
		for (n=count; n>0; n--){
		 s.removeChild(s.childNodes[n-1]);
		}
	},

	"defineContentIcon": function( name ){
		if( !this.iconstyles[name] ){
			var I = new GIcon();
			I.image = BitSystem.urls.gmap+"icons/c_type_pins/" + name + ".png";
			I.shadow = "http://www.google.com/mapfiles/shadow50.png";
			I.iconSize = new GSize(21, 24);
			I.shadowSize = new GSize(32, 24);
			I.iconAnchor = new GPoint(9, 24);
			I.infoWindowAnchor = new GPoint(9, 2);
			this.iconstyles[name] = I;
		}
		return this.iconstyles[name];
	},

	"updateViewAsListUrl": function( query ){
		var elm = $('gmap-link-viewaslist');
		var oldhref = elm.href;
		// clean up the query
		query = query.replace( /output=json/, "" );
		query = query.replace( /&&/, "&" );
		elm.href= oldhref.replace( /\?.*/, "?"+query );
		$('gmap-block-viewaslist').style.display = "block";
	}
});
//end of BitMap.Map.prototype update
