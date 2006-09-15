/* these are all methods required 
 * for displaying a list of content 
 * on a map as called from map_content.php 
 * they extend BitMap.Map
 */ 

MochiKit.Base.update(BitMap.Map.prototype, {

	"RequestContent": function(f){
		var up_lat = this.map.getBounds().getNorthEast().lat();
		var right_lng = this.map.getBounds().getNorthEast().lng();
		var down_lat = this.map.getBounds().getSouthWest().lat();
		var left_lng = this.map.getBounds().getSouthWest().lng();
		var str = [BitMap.BIT_ROOT_URL, "liberty/list_content.php?", queryString(f), "&up_lat=",up_lat,"&right_lng=",right_lng,"&down_lat=",down_lat,"&left_lng=",left_lng].join("");
		var d = loadJSONDoc(str);
		d.addCallbacks(bind(this.ReceiveContent, this), bind(this.RequestFailure, this));
	},

	"ReceiveContent": function(rslt){
		if (rslt.Status.code == 200){
			for (n=0; n<this.markers.length; n++){if(this.markers[n].gmarker != 'undefined'){this.map.removeOverlay(this.markers[n].gmarker)}};
			this.markers = rslt.Content;
			//annoying hack
			for (n=0; n<this.markers.length; n++){this.markers[n].n = n};
			var ref = this;
			this.loopOver(ref.markers, function(i){ref.addMarker(i);});
			this.clearSidepanel();
			this.attachSideMarkers();
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
		var p = new GLatLng(parseFloat(M.lat), parseFloat(M.lng));
		// for now we have to assume there is an icon for the content type.
		/* In the future we would like to set the image onerror property something like this, but it needs to be supported by google.
				img.onerror = function () { this.src = "default.jpg"; };
		 */
		var myicon = (M.content_type_guid != null)?new GIcon(G_DEFAULT_ICON, "icons/c_type_pins/" + M.content_type_guid + ".png" ):null;
		var mytip = ["<div class='tip-content'>", M.title, "</div>"].join("");
		M.gmarker = new GxMarker(p, myicon, mytip, {'className':'gmap-tooltip'});
		
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
		// @TODO we should probably check if everything exists first
		M.gmarker.my_html = MochiKit.DOM.DIV({'class':'gmap-marker'}, 
												H1({'class':'marker-title'}, M.title),
												DIV(null, M.content_description + "created by " + M.creator_real_name + " on " + M.created_date),
												DIV(null, A({'href':M.display_url}, 'Permalink')),
												starsElm,
												image,
												DIV(null, M.parsed_dull)
											);
		this.map.addOverlay(M.gmarker);
	  }
	},

	//make side panel of markers
	"attachSideMarkers": function(){
		var center = this.map.getCenter();
		var s = document.getElementById('gmap-sidepanel');
		var count = this.markers.length;
		if (count > 0){
			document.getElementById('gmap-map').style.marginRight = '300px';
			BitMap.show('gmap-sidepanel');
			// @TODO sort the markers on content_type_guid and break into sub arrays/obj			
			
			var rows = map(function(row) {
				return  [ A({"href":"javascript: BitMap.MapData[0].Map.markers["+row.n+"].gmarker.openInfoWindow(BitMap.MapData[0].Map.markers["+row.n+"].gmarker.my_html);"}, row.title), 
						  row.short_date, 
						  row.stars_rating];
			} ,this.markers);
	
			row_display = function (row) {
			    return TR(null, map(partial(TD, null), row));
			}
		
			var newTable = TABLE({'class': 'marker-table'},
			    THEAD(null,
			        row_display(["title", "date", "rating"])),
			    TBODY(null,
			        map(row_display, rows)));
		
			s.appendChild(newTable);
		}
//		this.map.checkResize();
		this.map.setCenter(center);
	},

	"clearSidepanel": function(){
		var s = document.getElementById('gmap-sidepanel');
		var count = s.childNodes.length;
		for (n=count; n>1; n--){
		 s.removeChild(s.childNodes[n-1]);
		}
	}
});
//end of BitMap.Map.prototype update
