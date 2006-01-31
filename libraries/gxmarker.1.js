/*
 GxMarker version 0.10

 SYNOPSIS
   A more full-featured marker that supports tooltips and hover events.  The
   first iteration just supports triggering of mouse over events, and tooltips.

   To setup a tooltip, pass in a third parameter (after the icon) to the
   GxMarker class:
        var marker = new GxMarker( new GPoint(lat,lng), icon, "My Tooltip" );

   Or,
        var marker = new GxMarker( new GPoint(lat,lng) );
        marker.setTooltip("My Tooltip");
        map.addOverlay(marker);

    How to style the tooltip:
        div.markerToolTip {
            text-align: center;
            opacity: .70;
            -moz-opacity: .70;
            filter: alpha(opacity=70);
        }

        span.markerTooltip {
            display: block;
            padding: 2px;
            font-weight: bold;
            border: 1px solid #555;
            background: #fff;
        }
    
    TESTED PLATFORMS:
        Linux: Firefox
        Windows: Firefox, IE6
        Mac OS X (Panther): Safari

    * There is no warranty of functionality of this code, if you wish to use it
    and it does not work for you, I recommend you submit a patch.
*/

function GxMarkerNamespace() {

var n4=(document.layers);
var n6=(document.getElementById&&!document.all);
var ie=(document.all);
var o6=(navigator.appName.indexOf("Opera") != -1);
var safari=(navigator.userAgent.indexOf("Safari") != -1);

function GxMarker( a, b, tooltip ) {
    this.inheritFrom = GMarker;
    this.inheritFrom(a,b);
    if ( typeof tooltip != "undefined" ) {
        this.setTooltip( tooltip );
    }
}

GxMarker.prototype = new GMarker;

GxMarker.prototype.setTooltip = function( string ) {
    this.tooltip = new Object();
    this.tooltip.opacity  = 70;
    this.tooltip.contents = string;
};

GxMarker.prototype.initialize = function( a ) {
    try {
        GMarker.prototype.initialize.call(this, a);
        var c = this.iconImage;
        // Use the image map for Firefox/Mozilla browsers
        if ( n6 && this.icon.imageMap && !safari) {
            c = this.imageMap;
        }
        // If we have a transparent icon, use that instead of the main image
        else if ( this.transparentIcon && typeof this.transparentIcon != "undefined" ) {
            c = this.transparentIcon;
        }

        // Setup the mouse over/out events
        GEvent.bindDom(c, "mouseover", this, this.onMouseOver);
        GEvent.bindDom(c, "mouseout",  this, this.onMouseOut);
    } catch(e) {
    }
}

GxMarker.prototype.remove = function( a ) {
    GMarker.prototype.remove.call(this);
    if ( this.tooltipObject )
        this.map.div.removeChild(this.tooltipObject);
}

GxMarker.prototype.onInfoWindowOpen = function() {
    this.hideMouseOver();
    GMarker.prototype.onInfoWindowOpen.call(this);
}

GxMarker.prototype.onMouseOver = function() {
    this.showMouseOver();
    GEvent.trigger(this, "mouseover");
};

GxMarker.prototype.onMouseOut = function() {
    this.hideMouseOver();
    GEvent.trigger(this, "mouseout");
};

GxMarker.prototype.showMouseOver = function() {
    if ( this.tooltip ) {
        if ( typeof this.tooltipObject == "undefined" ) {
            var opacity = this.tooltip.opacity / 100;
            this.tooltipObject = document.createElement("div");
            this.tooltipObject.style.display    = "none";
            this.tooltipObject.style.position   = "absolute";
            this.tooltipObject.style.background = "#fff";
            this.tooltipObject.style.padding    = "0";
            this.tooltipObject.style.margin     = "0";
            this.tooltipObject.style.MozOpacity = opacity;
            this.tooltipObject.style.filter     = "alpha(opacity=" + this.tooltip.opacity + ")";
            this.tooltipObject.style.opacity    = opacity;
            this.tooltipObject.style.zIndex     = 50000;
            this.tooltipObject.innerHTML        = "<div class=\"markerTooltip\">" + this.tooltip.contents + "</div>";
            this.map.div.appendChild(this.tooltipObject);
        }

        var b=this.map.spec.getBitmapCoordinate(this.point.y,this.point.x,this.map.zoomLevel);
        var c=this.map.getDivCoordinate(b.x,b.y);
        this.tooltipObject.style.top  = c.y - ( this.icon.iconAnchor.y + 5 ) + "px";
        this.tooltipObject.style.left = c.x + ( this.icon.iconAnchor.x + 5 ) + "px";
        this.tooltipObject.style.display = "block";
    }
}

GxMarker.prototype.hideMouseOver = function() {
    if ( typeof this.tooltipObject != "undefined" ) {
        this.tooltipObject.style.display = "none";
    }
}

function makeInterface(a) {
    var b = a || window;
    b.GxMarker = GxMarker;
}

makeInterface();
}

GxMarkerNamespace();
