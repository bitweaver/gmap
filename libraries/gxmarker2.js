/*
 GxMarker version 2.0

 SYNOPSIS
    This version is compatible only with Google Maps API Version 2

    GxMarker is merely an extended marker that allows styled tooltip events.
   
    To setup a tooltip, pass in a third parameter (after the icon) to the
    GxMarker class:
        var marker = new GxMarker(new GPoint(lat,lng),icon,"My Tooltip",?opts?);
        map.addOverlay(marker);
    Or:
        var marker = new GxMarker( new GPoint(lat,lng) );
        marker.setTooltip("My Tooltip", ?opts?);
        map.addOverlay(marker);

    The opts should be a hash (var opts = { "field1": "value" }) that contains
    the configuration for the marker.  This allows a user to specify the
    offset, a "isStatic" boolean flag, and an alternative className to use
    intead of the default "markerTooltip"

    (This is a complete, 100% rewrite of GxMarker Version 1)

    TESTED PLATFORMS:
        Google Maps API V2 with:
        Linux: Firefox
        Windows: Firefox, IE6
        Mac OS X (Panther): Safari

    There is no warranty of functionality of this code, if you wish to use it
    and it does not work for you, I recommend you submit a patch.  This software
    is licensed under the GNU Lesser General Public License (LGPL):
    the full text at: http://opensource.org/licenses/lgpl-license.php
*/

var __singleLabel;
var __singleLabelRefCount = 0;

function GxLabel( content, opts ) {
    if ( typeof opts != "object" ) throw "Invalid GxLabel configuration";

    this.content = content;

    if ( opts.offset && typeof opts.offset.x != "undefined" ) 
        this.offset = opts.offset
    else
        this.offset = new GSize(0,0);

    this.className = opts.className || "markerTooltip";
    if ( opts.marker && typeof opts.marker.getPoint != "undefined" ) {
        this.marker = opts.marker;
        this.anchor = opts.marker.getPoint();
        if ( opts.isStatic ) {
            this.isStatic = true;
        } else {
            __singleLabelRefCount++;

            GEvent.addListener(this.marker, "mouseover",
                this.createSingletonClosure(this.show, this.marker, this.offset, this.content));
            GEvent.addListener(this.marker, "mouseout",
                this.createSingletonClosure(this.hide, this.marker, this.offset, this.content));
            if ( !__singleLabel )
                __singleLabel = this;
            return __singleLabel;
        }
    }
    else if ( opts.anchor && typeof opts.anchor.lat != "undefined" ) {
        this.anchor = opts.anchor
    }

    if ( opts.pane ) this.pane = opts.pane;
    if ( !this.anchor ) throw "Invalid label configuration: no anchor point";
}

GxLabel.prototype = new GOverlay();

GxLabel.prototype.initialize = function(map) {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;
    t.map = map;
    t.pane = map.getPane(t.pane || G_MAP_FLOAT_SHADOW_PANE) ||
        map.getPane(G_MAP_FLOAT_SHADOW_PANE);
    if ( !t.container ) {
        t.container = document.createElement("div");
        t.container.className = t.className;
        t.container.style.position = "absolute";
        t.setContent(t.content);

        t.pane.appendChild(t.container);
    }
}

GxLabel.prototype.setContent = function(content) {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;
    if ( content ) {
        t.content = content;
        if ( t.container )
            t.container.innerHTML = t.content;
    }
}

GxLabel.prototype.setAnchor = function(anchor) {

}

GxLabel.prototype.remove = function() {
    if ( this.isStatic || --__singleLabelRefCount <= 0 )
        this.container.parentNode.removeChild(this.container);
}

GxLabel.prototype.copy = function() {
}

GxLabel.prototype.redraw = function(force) {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;
    var p = t.anchor;
    var o = t.offset || new GSize(0,0);
    var pix = t.map.fromLatLngToDivPixel(t.anchor);
    t.container.style.left = ( pix.x + o.width ) + "px";
    t.container.style.top  = ( pix.y + o.height ) + "px";
}

GxLabel.prototype.createSingletonClosure = function(fn, m, o, c) {
    var _t = this; var obj = fn;
    var _m = m; var _o = o; var _c = c;
    m = null; fn = null; o = null; c = null;
    return function() {
        _t.setContent(_c);
        obj.apply(_t, [ _m.getPoint(), _o ] );
    };
}

GxLabel.prototype.show = function(point, offset) {
try {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;
    var p = point || t.anchor;
    var o = offset || t.offset || new GSize(0,0);
    if ( p && p.lat ) {
        t.anchor = p; t.offset = o;
        var pix = t.map.fromLatLngToDivPixel(p);
        t.container.style.left = ( pix.x + o.width ) + "px";
        t.container.style.top  = ( pix.y + o.height ) + "px";
        t.container.style.display = "";
    }
  } catch(e) { alert('error:GxLabel.show'); }
}

/* Pointless Params! */
GxLabel.prototype.hide = function(point, offset) {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;
    t.container.style.display = "none";
}

function GxMarker(point, icon, tooltip, opts) {
    if ( tooltip ) {  
		var offset = ( typeof(opts) != 'undefined' && typeof(opts.offset) != 'undefined' )?opts.offset:new GSize(22,0);
		var className = ( typeof(opts) != 'undefined' && typeof(opts.className) != 'undefined' )?opts.className:null;
		var l = new GxLabel(tooltip, { "marker": this, "offset": offset, "className":className });
        var oldInit  = this.initialize;
        var _t = this;
        this.initialize = function(map) {
            map.addOverlay(l);
            oldInit.apply(_t, [ map ]);
        }
    }
    GMarker.apply(this, [ point, icon ]);
}

GxMarker.prototype = new GMarker(new GLatLng(1,1));
