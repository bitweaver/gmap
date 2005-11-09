
   var http_request = false;
	 
   //makeRequest handles any XMLHttpRequest relaying a url and a string of values
   function makeRequest(url, part) {
      http_request = false;
      if (window.XMLHttpRequest) { // Mozilla, Safari,...
         http_request = new XMLHttpRequest();
         if (http_request.overrideMimeType) {
            http_request.overrideMimeType('text/xml');
         }
      } else if (window.ActiveXObject) { // IE
         try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
         } catch (e) {
            try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
         }
      }
      if (!http_request) {
         alert('Cannot create XMLHTTP instance');
         return false;
      }
			if (part == "mapsubmit"){
			      http_request.onreadystatechange = alertMap;
			}
      http_request.open('GET', url, true);
      http_request.send(null);
   }

   function alertMap() {
      if (http_request.readyState == 4) {
         if (http_request.status == 200) {
				 		//alert(http_request.responseText);
            var result = http_request.responseXML;
						updateMap(result);
         } else {
            alert('There was a problem connecting to the server, please contact the site admin.');
         }
      }
   }


   //get translates the DOM of any FORM into a string of values for php
	 //also relays the url of the php script to makeRequest().
   function get(url, obj) {
      var getstr = "?";
			var part = "";
      for (i=0; i<obj.childNodes.length; i++) {
			
         if (obj.childNodes[i].tagName == "INPUT") {
            if (obj.childNodes[i].type == "text" || "hidden") {
               getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
            }
            if (obj.childNodes[i].type == "checkbox") {
               if (obj.childNodes[i].checked) {
                  getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
               } else {
                  getstr += obj.childNodes[i].name + "=&";
               }
            }
            if (obj.childNodes[i].type == "radio") {
               if (obj.childNodes[i].checked) {
                  getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
               }
            }
            if (obj.childNodes[i].type == "button") {
							 part = obj.childNodes[i].name;
						}
         }   
         if (obj.childNodes[i].tagName == "SELECT") {
            var sel = obj.childNodes[i];
            getstr += sel.name + "=" + sel.options[sel.selectedIndex].value + "&";
         }
         if (obj.childNodes[i].tagName == "TEXTAREA") {
            getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
         }
      }
			getstr = url + getstr;
      makeRequest(getstr, part);
   }


	 
	 function updateMap(xml){
	 		//shorten var names
			var t = xml.documentElement.getElementsByTagName('title');
			var title = t[0].firstChild.nodeValue;

			var d = xml.documentElement.getElementsByTagName('desc');
			var desc = d[0].firstChild.nodeValue;

			var w = xml.documentElement.getElementsByTagName('w');
			var width = w[0].firstChild.nodeValue + "px";

			var h = xml.documentElement.getElementsByTagName('h');
			var height = h[0].firstChild.nodeValue + "px";
			
			var lt = xml.documentElement.getElementsByTagName('lat');
			var lat = parseFloat(lt[0].firstChild.nodeValue);
			
			var ln = xml.documentElement.getElementsByTagName('lon');
			var lon = parseFloat(ln[0].firstChild.nodeValue);

			var z = xml.documentElement.getElementsByTagName('z');
			var zoom = parseInt(z[0].firstChild.nodeValue);

			var mt = xml.documentElement.getElementsByTagName('maptype');
			var maptype = bMapTypes[mt[0].firstChild.nodeValue];

			var sc = xml.documentElement.getElementsByTagName('cont');
			var show_cont = sc[0].firstChild.nodeValue;

			var ss = xml.documentElement.getElementsByTagName('scale');
			var show_scale = ss[0].firstChild.nodeValue;

			var sm = xml.documentElement.getElementsByTagName('typecon');
			var show_typecont = sm[0].firstChild.nodeValue;


			//replace everything	
      var maptile = document.getElementById('mymaptitle');
      if (maptile){maptile.innerHTML=title;}

      var mapdesc = document.getElementById('mymapdesc');
      if (mapdesc){mapdesc.innerHTML=desc;}

      var mapdiv = document.getElementById('map');
      if (mapdiv){mapdiv.style.width=width; mapdiv.style.height=height; map.onResize();}
			
			map.setMapType(maptype);
			
      //Add Map TYPE controls - buttons in the upper right corner
  		if (show_typecont == 1){
  		map.removeControl(typecontrols);
  		map.addControl(typecontrols);
  		}else{
  		map.removeControl(typecontrols);
  		}
  		
  		//Add Scale controls
  		if (show_scale == 1){
  		map.removeControl(scale);
  		map.addControl(scale);
  		}else{
  		map.removeControl(scale);
  		}
  		
      //Add Navigation controls - buttons in the upper left corner		
  		map.removeControl(smallcontrols);
  		map.removeControl(largecontrols);
  		map.removeControl(zoomcontrols);
  		if (show_cont == 's') {
  		map.addControl(smallcontrols);
  		}else if (show_cont == 'l') {
  		map.addControl(largecontrols);		
  		}else if (show_cont == 'z') {
  		map.addControl(zoomcontrols);
  		}
			
			map.centerAndZoom(new GPoint(lon, lat), zoom);		
	 }
