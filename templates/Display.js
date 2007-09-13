/* these are all methods required 
 * for displaying a map
 * they extend BitMap.Map
 */ 

MochiKit.Base.update(BitMap.Map.prototype, {

	// legacy code from R1/V1
	/*
	"addMapType": function(pParamHash){
		var Maptypes = this.maptypes;
		var count = Maptypes.length;
		for (var n=0; n < count; n++) {
			//must insert some sort of check for the Maptypes[n].basetype and special provisions for hybrids 
			var copyright = new GCopyright(1,
                              new GLatLngBounds(new GLatLng(-90, -180),
                                                new GLatLng(90, 180)),
                              Maptypes[n].minzoom,
                              Maptypes[n].copyright);                              
			var copyrightCollection = new GCopyrightCollection(Maptypes[n].name);
			copyrightCollection.addCopyright(copyright);        
			var tilelayers = [new GTileLayer(copyrightCollection, Maptypes[n].minzoom, Maptypes[n].maxzoom)];    
			tilelayers[0].getTileUrl = CustomGetTileUrl;
			function CustomGetTileUrl(a,b) {
				var z = 17 - b;
				var f = "/maps/?x="+a.x+"&y="+a.y+"&zoom="+z;
				return f;
			}
			var custommap = new GMapType(tilelayers, new GMercatorProjection(Maptypes[n].maxzoom+1), "Maptypes[n].name", {errorMessage:"Sorry we do not have imagery available for this area"});
			this.map.addMapType(custommap);
		}
	},
	*/

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

	//@TODO - these image paths may not be universal enough, may need to get the root from kernel
	"defineGIcon": function(i){
		var IconStyle = this.iconstyles[i];
		IconStyle.icon = new GIcon();
		IconStyle.icon.image = IconStyle.image;
		IconStyle.icon.iconSize = new GSize(IconStyle.icon_w, IconStyle.icon_h);
		IconStyle.icon.iconAnchor = new GPoint(IconStyle.icon_anchor_x, IconStyle.icon_anchor_y);
		IconStyle.icon.shadow = IconStyle.shadow_image;
		IconStyle.icon.shadowSize = new GSize(IconStyle.shadow_w, IconStyle.shadow_h);
		IconStyle.icon.infoShadowAnchor = new GPoint(IconStyle.shadow_anchor_x, IconStyle.shadow_anchor_y);
		IconStyle.icon.infoWindowAnchor = new GPoint(IconStyle.infowindow_anchor_x, IconStyle.infowindow_anchor_y);
	},



	"addMarker": function(i){
		if (this.markers[i]!= null && this.markers[i].plot_on_load == true){
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
	  var mytitle;
	  //add marker roll over
	  if (typeof(M.label_data) != 'undefined' && M.label_date != null){
	    mytitle = M.label_data;
	  }else if (typeof(M.title) != 'undefined' && M.title != null){
	    mytitle = M.title;
	  }
	  
	  M.gmarker = new GMarker(p, {icon: myicon, title:mytitle});
	  
	  var mytitle = H1( {'class':'marker-title'}, M.title );
	  var stars = '';
	  if (typeof(document.getElementById('iwindow-stars')) != 'undefined' && M.stars_pixels != null){
	    var starsElm = document.getElementById('iwindow-stars').cloneNode(true);
	    var divs = starsElm.getElementsByTagName('div');
	    divs.item(0).id = null;
	    divs.item(1).style.width = M.stars_pixels + "px";
	    stars = starsElm.innerHTML;
	  }
	  var image = '';
	  /* DEPRECATED - marker_type is no longer used - when Primary Attachments are available those will be used for creating photo markers
	  if (M.marker_type == 1){
			var urlSrc = Marker.photo_url;
			var pos = urlSrc.lastIndexOf('.');
			var str_1 = urlSrc.substring(0, pos);
			var str_2 = urlSrc.substring(pos, urlSrc.length);
			var medUrl = str_1 + "_medium" + str_2;
			var targImg = urlSrc; // @TODO: add PathToRoot here
			image = P(null, A({'onClick':'javascript:window.open('+targImg+')'}, IMG({'src':medUrl})));
	  }
	  */
	  var d = (new Date(M.created * 1000)).toString();  
	  var di = d.lastIndexOf('GMT');
	  var ds = d.substring(0, di-10);  

	  var creator = (M.creator_real_name != '')?DIV(null, "Created by ", M.creator_real_name, " on ", ds):null;
	  
	  M.created_date = ds;
	  
	  var u = (new Date(M.last_modified * 1000)).toString();  
	  var ui = d.lastIndexOf('GMT');
	  var us = d.substring(0, di-10);  
	  M.modified_date = us;

	  var modifier = (M.modifier_real_name != '')?DIV(null, "Last modification by ", M.modifier_real_name, " on ", us):null;
	  
	  var data = DIV(null, "");
	  data.innerHTML += ( typeof(M.parsed_data)!= 'undefined' && M.parsed_data != '')?M.parsed_data:'';
	  var comments = ( M.allow_comments == 'y' )?DIV(null, DIV({'id':'comment_'+M.content_id}, null), A({'href':'javascript:void(0);', 'onclick':'BitMap.MapData[0].Map.map.getInfoWindow().maximize()'}, (M.num_comments != null)?M.num_comments:"0", " Comment(s)"), DIV({'id':'comment_'+M.content_id+'_footer'}, null)):null;
	  //var comments = ( M.allow_comments == 'y' )?DIV(null, DIV({'id':'comment_'+M.content_id}, null), A({'href':'javascript:void(0);', 'onclick':'LibertyComment.attachForm("comment_'+M.content_id+'", "'+M.content_id+'")'}, (M.num_comments != null)?M.num_comments:"0", " Comment(s)"), DIV({'id':'comment_'+M.content_id+'_footer'}, null)):null;
	  M.gmarker.my_html = DIV( {'style':'white-space: nowrap;'}, mytitle, creator, modifier, stars, image, data, comments);
	  M.gmarker.my_maxurl = BitMap.BIT_ROOT_URL + "gmap/view_marker.php?marker_id=" + M.marker_id + '&comments_maxComments=999999';
	  this.map.addOverlay(M.gmarker);
	},



	"defineGxMarker": function(n, i, s){
		var M = this.markers[n];
	
	  var point = new GLatLng(parseFloat(M.lat), parseFloat(M.lng));
		var icon = null;
		if (i != null){
			icon = this.iconstyles[i].icon;
		}
		var mytip = DIV({'class':'tip-'+this.markerstyles[s].name}, M.label_data);
	  M.gmarker = new GxMarker(point, icon, mytip);
	  M.gmarker.marker_style_type = 0;
	
		var imgLink ='';
		
		/* DEPRECATED - marker_type is no longer used - when Primary Attachments are available those will be used for creating photo markers
		if (M.marker_type == 1){
			var urlSrc = M.photo_url;
			var pos = urlSrc.lastIndexOf('.');
			var str_1 = urlSrc.substring(0, pos);
			var str_2 = urlSrc.substring(pos, urlSrc.length); 
			var medUrl = str_1 + "_medium" + str_2;
			var imgLink = P(null, IMG({'src':medUrl}));
		}
		*/
		
	  var data = DIV(null, "");
	  data.innerHTML += ( typeof(M.parsed_data)!= 'undefined' && M.parsed_data != '')?M.parsed_data:'';	
	  M.gmarker.my_html = DIV({'style':'white-space: nowrap;', 'class':'win-'+this.markerstyles[s].name}, H1({'class':markertitle}, M.title), imgLink, data);
	  this.map.addOverlay(M.gmarker);
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
	
		var imgLink ='';
		/* DEPRECATED - marker_type is no longer used - when Primary Attachments are available those will be used for creating photo markers
		if (M.marker_type == 1){
			var urlSrc = M.photo_url;
			var pos = urlSrc.lastIndexOf('.');
			var str_1 = urlSrc.substring(0, pos);
			var str_2 = urlSrc.substring(pos, urlSrc.length); 
			var medUrl = str_1 + "_medium" + str_2;
			var imgLink = "<p><img src='"+medUrl+"'></p>"
		}
		*/	
	  M.gmarker.my_html = "<div style='white-space: nowrap;'><h1 class='markertitle'>"+M.title+"</h1>" + imgLink + "<p>"+M.parsed_data+"</p></div>";
	  M.gmarker.setDetailWinHTML( M.marker.my_html );
	  //rollover-icon: M.marker.setHoverImage("http://www.google.com/mapfiles/dd-start.png");
	  this.map.addOverlay(M.gmarker);
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
			this.defineGPolyline(i, s_i);			
		}
	},



	"defineGPolyline": function(i, s){
		var p = this.polylines[i];
		var pointlist = [];
		for (n = 0; n < p.points_data.length; n+=2 ){
			var point = new GLatLng(
				parseFloat(p.points_data[n]),
				parseFloat(p.points_data[n+1])
			);
			pointlist.push(point);
		};
		var linecolor = null;
		var lineweight = null;
		var lineopacity = null;		
		if ( s != null ){
			var PolylineStyle = this.polylinestyles[s];	
			linecolor = "#"+PolylineStyle.color;
			lineweight = PolylineStyle.weight;
			lineopacity = PolylineStyle.opacity;
		};
		p.polyline = new GPolyline(pointlist, linecolor, lineweight, lineopacity);
		this.map.addOverlay(p.polyline);
	},
	
	
	/*@TODO all Polygon constructors below might have to change to use gmap polygon */  
	"attachPolygons": function(){
		//get the array we are working on
		var a = this.polygons;
	
		//if the length of the array is > 0
		if (a.length > 0){
	  	//loop through the array
			for(n=0; n<a.length; n++){
	  		//if the array item is not Null
				if (a[n]!= null){
					this.attachPolygon(n);
				}
			}
		}
	},


	"attachPolygon": function(n){
		var s;
		var p;
		var Polygon = this.polygons[n];
		var PolylineStyles = this.polylinestyles;
		var PolygonStyles = this.polygonstyles;
		for (var b=0; b<PolylineStyles.length; b++){
			if ( PolylineStyles[b].style_id == Polygon.polylinestyle_id ){
				s = b;
			}
		}
		for (var c=0; c<PolygonStyles.length; c++){
			if ( PolygonStyles[c].style_id == Polygon.style_id ){
				p = c;
			}
		}
		this.defineGPolygon(n, s, p);
	},


	"defineGPolygon": function(n){
		/*@TODO define this */
	},

	
	//make side panel of markers
	//works only with one map on a page
	"attachSideMarkers": function(){
		var center = this.map.getCenter();
		var display = false;
		var setscount = this.markersets.length;		
		var panel = $('gmap-sidepanel');
		for (var n=0; n<setscount; n++){
			var set = this.markersets[n];
			//if show set
			if ( set.side_panel == true ){
				$('gmap-map').style.marginRight = '300px';
				BitMap.show('gmap-sidepanel');
				display = true;
				//get the set icon style
				var iconSrc = "http://www.google.com/mapfiles/marker.png";
				var iconW = "20";
				var iconH = "34";				
				for (var i=0; i<this.iconstyles.length; i++){
					if ( this.iconstyles[i].icon_id == set.icon_id ){
						iconSrc = this.iconstyles[i].image;
						iconW = this.iconstyles[i].icon_w;
						iconH = this.iconstyles[i].icon_h;						
					}
				}

				//add set container to side
				var setDiv = DIV({"id":"sideset_" + set.set_id, "class":"module box"}, 
									H3({"class":"gmapsidetitle"}, set.name),
									DIV({"class":"gmapsidedesc"}, 
										IMG({"src":iconSrc, "width":iconW + "px", "height":iconH + "px"}), 
										SPAN(null, set.description),
										DIV({"id":"listset_" + set.set_id, "class":"boxcontent gmapsidelist", "clear":"both"}, null)
										)
								);
	
				panel.appendChild(setDiv);
			}
		}

		if ( display == true ){			
			//go through all markers
			var markercount = this.markers.length;
			for ( var n=0; n<markercount; n++ ){
				//if show set == y and show marker == y
				var Marker = this.markers[n];
				if ( Marker.side_panel == true && Marker.explode == true ) {
					var imgLink = null;
					/* DEPRECATED - marker_type is no longer used - when Primary Attachments are available those will be used for creating photo markers
					if (Marker.marker_type == 1){
						var urlSrc = Marker.photo_url;
						var pos = urlSrc.lastIndexOf('.');
						var str_1 = urlSrc.substring(0, pos);
						var str_2 = urlSrc.substring(pos, urlSrc.length); 
						var thumbUrl = str_1 + "_thumb" + str_2;
						var imgLink = SPAN( null, BR(), IMG({"src":thumbUrl}) );
					}
					*/

					//add marker to side list
					if (Marker.allow_comments == 'y'){
						var newLink = A({"href":"javascript:BitMap.MapData[0].Map.markers["+n+"].gmarker.openInfoWindow(BitMap.MapData[0].Map.markers["+n+"].gmarker.my_html, {maxUrl:BitMap.MapData[0].Map.markers["+n+"].gmarker.my_maxurl});"}, SPAN(null, Marker.title), imgLink );
					}else{
						var newLink = A({"href":"javascript:BitMap.MapData[0].Map.markers["+n+"].gmarker.openInfoWindow(BitMap.MapData[0].Map.markers["+n+"].gmarker.my_html);"}, SPAN(null, Marker.title), imgLink );
					}
					var container = $('listset_' + Marker.set_id);
					container.appendChild(newLink);
					container.appendChild( BR() );

	  				//if marker is set to init
					if ( Marker.plot_on_load == true ) {
						//set loaded to true
					}else{
						//set loaded to false
					}
				}
			}
		}
		this.map.checkResize();
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
