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

    if ( opts.offset && typeof opts.offset.width != "undefined" ) 
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
                this.createSingletonClosure(this.show, this.anchor, this.offset, this.content));
            GEvent.addListener(this.marker, "mouseout",
                this.createSingletonClosure(this.hide, this.anchor, this.offset, this.content));
            if ( !__singleLabel )
                __singleLabel = this;
            return __singleLabel;
        }
    }
    else if ( opts.anchor && typeof opts.anchor.lat != "undefined" ) {
        if ( opts.isStatic ) {
            this.isStatic = true;
        }
        if ( opts.moveHandle ) {
            this.moveHandle = true;
        }
        if ( opts.deleteHandle ) {
            this.deleteHandle = true;
        }
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
    t.pane = map.getPane(t.pane || G_MAP_MARKER_PANE) ||
        map.getPane(G_MAP_MARKER_PANE);

    if ( !t.container ) {
        t.container = document.createElement("div");
        t.container.className = t.className;
        t.container.style.position = "absolute";
        
        if ( t.moveHandle && !t.moveHandleNode ) {
            t.moveHandlePanel = t.pane;
            t.contentNode    = document.createElement("div");
            t.moveHandleNode = document.createElement("div");
            with ( t.moveHandleNode.style ) {
                background = "#ccc";
                width      = "8px";
                height     = "100%";
                cssFloat   = "left";
                fontWeight = "bold";
                textAlign  = "center";
                borderRight = "1px solid #555";
            }
            t.contentNode.style.marginLeft = "10px";
            t.moveHandleNode.innerHTML = ":";

            t.container.appendChild(t.moveHandleNode);
            t.container.appendChild(t.contentNode);

            t.insertPoint     = t.contentNode;

            GEvent.bindDom(t.moveHandleNode, "mousedown", this, this.mouseDown);
        } else {
            t.insertPoint = t.container;
        }

        t.setContent(t.content);

        t.pane.appendChild(t.container);
        var b = t.container;
        GEvent.addDomListener(b, "click",
            function(e) { stopEvent(e); GEvent.trigger(t, "click", e); });
        GEvent.addDomListener(b, "mouseup", function(e) {
            stopEvent(e); t.mouseUp(e); GEvent.trigger(t, "mouseup", e);
        });
        GEvent.addDomListener(b, "mousedown",
            function(e) { stopEvent(e); GEvent.trigger(t, "mousedown", e); });
    }
}

GxLabel.prototype.setContent = function(content) {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;

    if ( content ) {
        var point = t.insertPoint || t.container;
        point.innerHTML = "";
        if ( typeof content == "object" ) {
            point.appendChild(content);
            t.content = point.innerHTML;
        } else {
            t.content = content;
            point.innerHTML = t.content;
        }
        if ( t.deleteHandle ) {
            var img = document.createElement("img");
            img.src = "/static/images/close.png";
            img.alt = "";
            img.style.padding = "0px 2px";
            GEvent.bindDom(img, "click", this, this.remove);
            point.appendChild(img);

        }
    }
}

GxLabel.prototype.setAnchor = function(anchor) {
    try {
        if ( anchor.lat() && anchor.lng() ) {
            this.anchor = anchor;
            this.redraw();
        }
    } catch(E) {}
}

GxLabel.prototype.remove = function() {
    if ( this.isStatic || --__singleLabelRefCount <= 0 ) {
        this.container.parentNode.removeChild(this.container);
        GEvent.trigger(this, "remove");
    }
}

GxLabel.prototype.copy = function() {
}

GxLabel.prototype.redraw = function(force) {
    if ( this.isStatic ) {
        this.show();
    } else {
        /* Show dynamic tooltips only on events, not on redraws */
        this.hide();
    }
}

GxLabel.prototype.createSingletonClosure = function(fn, p, o, c) {
    var _t = this; var obj = fn;
    var _p = p; var _o = o; var _c = c;
    p = null; fn = null; o = null; c = null;
    return function() {
        _t.setContent(_c);
        obj.apply(_t, [ _p, _o ] );
    };
}

GxLabel.prototype.show = function(point, offset) {
try {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;
    var p = point  || t.anchor;
    var o = offset || t.offset || new GSize(0,0);
    if ( p && p.lat ) {
        t.anchor = p; t.offset = o;
        var pix = t.map.fromLatLngToDivPixel(p);
        t.container.style.left = ( pix.x + o.width ) + "px";
        t.container.style.top  = ( pix.y + o.height ) + "px";
        t.container.style.display = "";
    }
} catch(e) { }
}

/* Pointless Params! */
GxLabel.prototype.hide = function(point, offset) {
    var t = this;
    if ( __singleLabel && !this.isStatic )
        t = __singleLabel;
    t.container.style.display = "none";
}

GxLabel.prototype.mouseUp = function(e) {
    if ( this.mouseUpListener )
        GEvent.removeListener(this.mouseUpListener);
    if ( this.mouseMoveListener )
        GEvent.removeListener(this.mouseMoveListener);
    if ( this.startDrag ) {

    }
    GEvent.trigger(this, "moveend", this.anchor);
    this.startDrag = false;
}

GxLabel.prototype.mouseMove = function(e) {
    if ( !this.startDrag ) {
        if ( this.mouseUpListener )
            GEvent.removeListener(this.mouseUpListener);
        if ( this.mouseMoveListener )
            GEvent.removeListener(this.mouseMoveListener);
        return false;
    }

    var point = new GPoint(
        e.clientX - this.topLeftPoint.x, e.clientY - this.topLeftPoint.y);
    var anchor = this.map.fromDivPixelToLatLng(point);
    this.anchor = anchor;
    this.redraw();
}

GxLabel.prototype.mouseDown = function(e) {
    stopEvent(e);
    this.startDrag = true;
/*
    var mapBounds = this.map.getBounds();
    var topleft = new GLatLng(
        mapBounds.getSouthWest().lat(),
        mapBounds.getNorthEast().lng());
    this.topLeftPoint = this.map.getCurrentMapType().getProjection().fromLatLngToPixel(topleft, this.map.getZoom());
    this.topLeftPoint = this.map.fromLatLngToDivPixel(topleft);
*/
    this.topLeftPoint = new GPoint(
                dojo.html.getAbsoluteX(document.getElementById("map")),
                dojo.html.getAbsoluteY(document.getElementById("map")));
    if ( !this.mouseUpListener ) {
        this.mouseUpListener = GEvent.bindDom(document.getElementById("map"),
            "mouseup", this, this.mouseUp);
    }
    if ( !this.mouseMoveListener ) {
        this.mouseUpListener = GEvent.bindDom(document.getElementById("map"),
            "mousemove", this, this.mouseMove);
    }
}

/* 
 * Kills an event's propagation and default action.  Not sure who the original
 * author of this function is, but I love it.
  */
function stopEvent(eventObject) {
    if (eventObject && eventObject.stopPropagation) {
        eventObject.stopPropagation();
    }
    if (window.event && window.event.cancelBubble ) {
        window.event.cancelBubble = true;
    }
                                      
    if (eventObject && eventObject.preventDefault) {
        eventObject.preventDefault();
    }
    if (window.event) {
        window.event.returnValue = false;
    }
}

/*
 * GxMarker
*/

function GxMarker(point, icon, tooltip, opts) {
    if ( tooltip ) {
        var oldInit  = this.initialize;
        var _t = this;
        var offset   = ( typeof opts == "object" ) ?
            (opts.offset || new GPoint(22,0)) : new GPoint(22,0);
        var isStatic = ( typeof opts == "object" ) ?
            (opts.isStatic || false ) : false;
        this.initialize = function(map) {
            var l = new GxLabel(tooltip, {
                "marker":   _t,
                "offset":   offset,
                "isStatic": isStatic
            });
            map.addOverlay(l);
            oldInit.apply(_t, [ map ]);
        }
    }
    GMarker.apply(this, [ point, icon ]);
}

GxMarker.prototype = new GMarker(new GLatLng(1,1));

function debug(msg) {
    var d = document.getElementById("debug") ?
        document.getElementById("debug") : document.body;
    d.appendChild(document.createTextNode("[" + new Date() + "] "));
    d.appendChild(document.createTextNode(msg));
    d.appendChild(document.createElement("br"));
}

