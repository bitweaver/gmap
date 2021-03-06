/* these are all methods required 
 * for displaying a map
 * they extend BitMap.Map
 */ 

MochiKit.Base.update(BitMap.Map.prototype, {

	"attachIcons": function(){
		var i = this.iconstyles;
		if (i.length > 0){
  			for (n=0; n<i.length; n++){
  				if (i[n].icon_style_type != null && i[n].icon_style_type == 0){
  					this.defineGIcon(n);
  				}
  			}
		}
	},

	/* @TODO - these image paths may not be universal enough, may need to get the root from kernel */
	"defineGIcon": function(i){
		var I = this.iconstyles[i];
		I.icon = new GIcon();
		I.icon.image = BitSystem.urls.root + I.image;
		I.icon.iconSize = new GSize(I.icon_w, I.icon_h);
		I.icon.iconAnchor = new GPoint(I.icon_anchor_x, I.icon_anchor_y);
		I.icon.shadow = BitSystem.urls.root + I.shadow_image;
		I.icon.shadowSize = new GSize(I.shadow_w, I.shadow_h);
		I.icon.infoShadowAnchor = new GPoint(I.shadow_anchor_x, I.shadow_anchor_y);
		I.icon.infoWindowAnchor = new GPoint(I.infowindow_anchor_x, I.infowindow_anchor_y);
	},

	"addMarker": function(i){
		if (this.markers[i]!= null){
			var M = this.markers[i];
			
			//a variable to set a marker to open on initialization
			//not implemented! script will break if removed    
			var o = false;
			var icon = null;
			if (M.icon_id != 0 && M.icon_id != null){
				var is = this.iconstyles;
				for (var b=0; b<is.length; b++){
					if ( is[b].icon_id == M.icon_id ){
						icon = b;
					}
				}
			}
			if (M.style_id == 0 || typeof( M.style_id ) == 'undefined' || M.style_id == null){
				this.defineGMarker(i, icon);
				// if (o == true) {M.gmarker.openInfoWindowHtml( M.gmarker.my_html );};
			}else{
				var s;
				var MarkerStyles = this.markerstyles; 
				for (var c=0; c<MarkerStyles.length; c++){
					if ( MarkerStyles[c].style_id == M.style_id ){
						s = c;
					}
				}
				if ( MarkerStyles[s].marker_style_type == 0){
					this.defineGxMarker(i, icon, s);
					if (o == true) {M.gmarker.openInfoWindowHtml(M.gmarker.my_html);};
				}else if ( MarkerStyles[s].marker_style_type == 1){
					this.definePdMarker(i, icon, s);
					if (o == true) {
						M.gmarker.showTooltip();
						M.gmarker.hideTooltip();
						M.gmarker.showDetailWin();
					};
				}
			}
		}
	},



	"defineGMarker": function(i, n){
		var M = this.markers[i];
		var p = new GLatLng(parseFloat(M.lat), parseFloat(M.lng));
		var myicon = (n != null)?this.iconstyles[n].icon:null;
		var tip;
		//add marker roll over
		if (typeof(M.label_data) != 'undefined' && M.label_data != null){
			tip = M.label_data;
		}else if (typeof(M.title) != 'undefined' && M.title != null){
			tip = M.title;
		}		
		M.gmarker = new GMarker(p, {icon: myicon, title:tip, draggable:true});
		M.gmarker.disableDragging();
		M.gmarker.index = i;
		M.gmarker.type = 'marker';
		M.gmarker.my_maxurl = BitSystem.urls.gmap + "view_marker.php?marker_id=" + M.marker_id + '&comments_maxComments=999999&ajax_xml=true';
		this.map.addOverlay(M.gmarker);
		M.gmarker.plotted = true;
	},



	"defineGxMarker": function(n, i, s){
		var M = this.markers[n];
		
		var point = new GLatLng(parseFloat(M.lat), parseFloat(M.lng));
		var icon = null;
		if (i != null){
			icon = this.iconstyles[i].icon;
		}
		var tip;
		if (typeof(M.parsed_label_data) != 'undefined' && M.parsed_label_data != null){
			tip = M.parsed_label_data;
		}else if (typeof(M.title) != 'undefined' && M.title != null){
			tip = M.title;
		}		
		var mytip = DIV({'class':'tip-'+this.markerstyles[s].name}, tip);
		M.gmarker = new GxMarker(point, icon, mytip);
		M.gmarker.marker_style_type = 0;
		
		/*
		var imgLink ='';
		var data = DIV(null, "");
		data.innerHTML += ( typeof(M.parsed_data)!= 'undefined' && M.parsed_data != '')?M.parsed_data:'';	
		M.gmarker.my_html = DIV({'style':'white-space: nowrap;', 'class':'win-'+this.markerstyles[s].name}, H1({'class':markertitle}, M.title), imgLink, data);
		*/
		this.map.addOverlay(M.gmarker);
		M.gmarker.plotted = true;
	},



	"definePdMarker": function(n, i, s){
		var M = this.markers[n];
		
		//PdMarker Style
		var point = new GLatLng(parseFloat(M.lat), parseFloat(M.lng));
		var icon = null;
		if (i != null){
			icon = this.iconstyles[i].icon;
		}
		M.gmarker = new PdMarker(point, icon);
		M.gmarker.marker_style_type = 1;
		M.gmarker.setTooltipClass( "tip-"+this.markerstyles[s].name );
		M.gmarker.setDetailWinClass( "win-"+this.markerstyles[s].name );
		M.gmarker.setTooltip( "<div>" + M.label_data + "</div>");
		
		/* DEPRECATED - this should be made to work with new ajax loading of window content
		var imgLink ='';
		M.gmarker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+M.title+"</h1>" + imgLink + "<p>"+M.parsed_data+"</p></div>";
		M.gmarker.setDetailWinHTML( M.marker.my_html );
		*/
		//rollover-icon: M.marker.setHoverImage("http://www.google.com/mapfiles/dd-start.png");
		this.map.addOverlay(M.gmarker);
		M.gmarker.plotted = true;
	},


	"attachPolylines": function(){
		var pl = this.polylines;
		var count = pl.length;
		if (count > 0){
			for(n=0; n<count; n++){
				if ( pl[n] != null ){
					this.addPolyline(n);
				}
			}
		}
	},


	"addPolyline": function(i){
		var p = this.polylines[i];
		if ( p.type != 2 ){
			var s_i = null;
			if (p.style_id != 0){
				var ps = this.polylinestyles;
				var count = ps.length;
				for (var n=0; n<count; n++){
					if ( ps[n].style_id == p.style_id ){
						s_i = n;
					}
				}
			}
			this.defineGPolyline(p, s_i);
		}else{
			this.defineGPolylineEncoded(p, s_i);
		}
		p.polyline.index = i;
	},


	/* @p polyline datahash */
	"defineGPolyline": function(p, s){
		var pointlist = [];
		for (n = 0; n < p.points_data.length; n+=2 ){
			var point = new GLatLng(
				parseFloat(p.points_data[n]),
				parseFloat(p.points_data[n+1])
			);
			pointlist.push(point);
		};
		var c = null;
		var w = null;
		var o = null;		
		if ( s != null ){
			var ps = this.polylinestyles[s];	
			c = "#"+ps.color;
			w = ps.weight;
			o = ps.opacity;
		};
		var opts = (p.type == 1)?{geodesic:true}:null;
		p.polyline = new GPolyline(pointlist, c, w, o, opts);
		this.map.addOverlay(p.polyline);
		p.polyline.type = 'polyline';
		p.polyline.plotted = true;
	},
	
	
	/* @p polyline datahashi */
	"defineGPolylineEncoded": function(p, s){
		if(p.points_data!=null && p.levels_data!=null){
			var c = null;
			var w = null;
			var o = null;		
			if ( s != null ){
				var ps = this.polylinestyles[s];	
				c = "#"+ps.color;
				w = ps.weight;
				o = ps.opacity;
			};
			var z=(p.zoom_factor!=null)?p.zoom_factor:32;
			var n=(p.num_levels!=null)?p.num_levels:4;
			p.polyline = new GPolyline.fromEncoded({
				color:c,
				weight:w,
				opacity:o,
				points:p.points_data,
				levels:p.levels_data,
				zoomFactor:z,
				numLevels:n
			});
			this.map.addOverlay(p.polyline);
			p.polyline.type = 'polyline';
			p.polyline.plotted = true;
		}
	},

	
	"attachPolygons": function(){
		var pg = this.polygons;
		var count = pg.length;
		if (count > 0){
			for(n=0; n<count; n++){
				if ( pg[n] != null ){
					this.addPolygon(n);
				}
			}
		}
	},


	"addPolygon": function(i){
		var p = this.polygons[i];
		if ( p.type != 2 ){
			var s_i = null;
			var p_i = null;
			if (p.style_id != 0){
				var ps = this.polygonstyles;
				var count = ps.length;
				for (var n=0; n<count; n++){
					if ( ps[n].style_id == p.style_id ){
						s_i = n;
					}
				}
			}
			if (p.polylinestyle_id != 0){
				var ps = this.polylinestyles;
				var count = ps.length;
				for (var n=0; n<count; n++){
					if ( ps[n].style_id == p.polylinestyle_id ){
						p_i = n;
					}
				}
			}
			this.defineGPolygon(p, s_i, p_i);
		}else{
			this.defineGPolygonEncoded(p);
		}
		p.polygon.index = i;
	},


	"defineGPolygon": function(p, s, l){
		var pointlist = [];
		for (n = 0; n < p.points_data.length; n+=2 ){
			var point = new GLatLng(
				parseFloat(p.points_data[n]),
				parseFloat(p.points_data[n+1])
			);
			pointlist.push(point);
		};
		var fc = "#0000ff";
		var fo = .5;
		var c = null;
		var w = null;
		var o = null;
		if ( s != null ){
			var ps = this.polygonstyles[s];	
			fc = "#"+ps.color;
			fo = ps.opacity;
		};
		if ( l != null ){
			var ps = this.polylinestyles[l];	
			c = "#"+ps.color;
			w = ps.weight;
			o = ps.opacity;
		};
		p.polygon = new GPolygon(pointlist,c,w,o,fc,fo);
		this.map.addOverlay(p.polygon);
		p.polygon.type = 'polygon';
		p.polygon.plotted = true;
	},

	
	//make side panel of markers
	//works only with one map on a page
	"attachSideMarkers": function(){
		var center = this.map.getCenter();
		var display = false;
		var setscount = this.markersets.length;
		var panel = $('gmap-sidepanel-table');
		MochiKit.DOM.replaceChildNodes(panel, null)
		for (var n=0; n<setscount; n++){
			var set = this.markersets[n];
			if( set != null ){
				//if show set
				if ( set.side_panel == true || set.plot_on_load != true ){
					$('gmap-map').style.marginRight = '300px';
					BitMap.show('gmap-sidepanel');
					display = true;
					//get the set icon style
					var iconSrc = "http://www.google.com/mapfiles/marker.png";
					var iconW = "20";
					var iconH = "34";				
					var is = this.iconstyles;
					for (var x=0; x<is.length; x++){
						var i = is[x];
						if ( i.icon_id == set.icon_id ){
							iconSrc = BitSystem.urls.root + i.image;
							iconW = i.icon_w;
							iconH = i.icon_h;						
						}
					}

					//add set container to side
					var setDiv = DIV({"id":"sideset_" + set.set_id, "class":"sidebox"}, 
										H3({"class":"gmapsidetitle"}, set.title),
										DIV({"class":"gmapsidedesc"}, 
											IMG({"src":iconSrc, "width":iconW + "px", "height":iconH + "px"}), 
											SPAN(null, set.description)
											),
										UL({"id":"listset_" + set.set_id, "class":"boxcontent gmapsidelist"}, null)
									);
		
					panel.appendChild(setDiv);
				}
			}
		}

		if ( display == true ){			
			//go through all markers
			var markercount = this.markers.length;
			for ( var n=0; n<markercount; n++ ){
				//if show set == y and show marker == y
				var M = this.markers[n];
				if ( M != null && ( ( M.side_panel == true && M.explode == true ) || M.plot_on_load != true ) ) {
					var imgLink = ( M.thumbnail_url != null && M.thumbnail_url != '' )?[BR(), IMG({"src":M.thumbnail_url})]:null;
					var newLink = LI( null, A({'href':'javascript:void(0);', 'onclick':'BitMap.MapData[0].Map.openMarkerWindow('+n+');'}, SPAN(null, M.title), imgLink ) );
					var container = $('listset_' + M.set_id);
					container.appendChild(newLink);
				}
			}
		}
		this.map.checkResize();
		this.map.setCenter(center);
	},

	"openMarkerWindow": function(i){
		var M = this.markers[i];
		if ( typeof(M.gmarker) == 'undefined' ){
			this.addMarker(i);
		}
		if ( typeof(M.gmarker.my_html) == 'undefined' ){
			this.TARGET_MARKER_INDEX = i;
			var id = M.content_id;
			doSimpleXMLHttpRequest("view_marker.php", {content_id:id, pre_window:true}).addCallback( bind(this.loadMarkerCallback, this) ); 
		}else{
			var opt = null;
			if (M.allow_comments == 'y' && M.gmarker.my_maxurl){
					var e = DIV(null, "Loading...");
					opt = {maxContent:e};
					var ref = this;
					var url = M.gmarker.my_maxurl;
					var mref = M.gmarker;
					GEvent.addListener(this.map, "infowindowopen", function(){
						var w = ref.map.getInfoWindow();
						GEvent.addListener(w, "maximizeclick", function() {
							GDownloadUrl(url, function(data) {
								mref.my_maxdata = e.innerHTML = data;
								setTimeout("setupAllTabs()", 200); /*thanks safari and ie*/
							});
						});
					});
			}
			M.gmarker.openInfoWindowHtml( M.gmarker.my_html, opt);
		}
	},

	"loadMarkerCallback": function(rslt){
		this.markers[this.TARGET_MARKER_INDEX].gmarker.my_html = rslt.responseText;
		//this.executeJavascript(markercontentdivid);
		this.openMarkerWindow( this.TARGET_MARKER_INDEX );
	},

	"openOverlayWindow": function( type, i, point ){
		var typeInitCap = this.toUpperCaseFirst( type );
		var O = this[type+'s'][i];
		if ( typeof(O[type]) == 'undefined' ){
			this["add"+typeInitCap](i);
		}
		if ( typeof(O[type].my_html) == 'undefined' ){
			var id = O.content_id;
			doSimpleXMLHttpRequest("view_overlay.php", {overlay_type:type, content_id:id, pre_window:true}).addCallback( bind(this.loadOverlayCallback, this), type, i, point ); 
		}else{
			var opt = null;
			if (O.allow_comments == 'y' && O[type].my_maxurl){
					var e = DIV(null, "Loading...");
					opt = {maxContent:e};
					var ref = this;
					var url = O[type].my_maxurl;
					var mref = O[type];
					GEvent.addListener(this.map, "infowindowopen", function(){
						var w = ref.map.getInfoWindow();
						GEvent.addListener(w, "maximizeclick", function() {
							GDownloadUrl(url, function(data) {
								mref.my_maxdata = e.innerHTML = data;
								setTimeout("setupAllTabs()", 200); /*thanks safari and ie*/
							});
						});
					});
			}
			this.map.openInfoWindowHtml( point, O[type].my_html, opt);
		}
	},

	"loadOverlayCallback": function(type, i, point, rslt){
		this[type+"s"][i][type].my_html = rslt.responseText;
		this.openOverlayWindow( type, i, point );
	},

	"clearSidepanel": function(){
		var s = document.getElementById('gmap-sidepanel-table');
		var count = s.childNodes.length;
		for (n=count; n>1; n--){
		   s.removeChild(s.childNodes[n-1]);
	    }
	},

	"getPolyBounds": function(p){
		var bounds = new GLatLngBounds();
		var count = p.getVertexCount(); 
		for (var i=0; i < count; i++) {
			bounds.extend(p.getVertex(i));
		}
		return bounds;
	},

	"centerMapOnPoly": function(p){
		var b = this.getPolyBounds(p);
		// zoom less 1 fits poly nicer - google will fit right to the edge of the window - this leaves a little space
		var z = this.map.getBoundsZoomLevel(b);
		z = z>0?z-1:0;
		this.map.setCenter( b.getCenter(), z );
	}
	
});
