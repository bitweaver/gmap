/*
 PdMarker

 Purpose: extends Google Map API GMap and GMarker (hover effects, image swapping, moving)
 Details: http://wwww.pixeldevelopment.com/pdmarker.asp
 Updated: [see getPdMarkerRevisionInfo]
 Author:  Peter Jones
 Notes:   Relies on undocumented features of the Google Map API which may change.
	    Based on my own PJToolTip and ideas from GxMarker, TLabel and the Google Maps API forum.

 Contact www.pixeldevelopment.com for your custom Google Map needs
*/

/*
 Notes: This is a limited version of the PdMarker code
        some methods have been trimmed for the Bitweaver Gmap Package
*/


var pdMarkerOpenList = [];

function PdMarkerAddDetailWinOpen(marker) {
	pdMarkerOpenList.push(marker);
}

function PdMarkerClose(id) {
	for (var i=0; i<pdMarkerOpenList.length; i++)
		if (pdMarkerOpenList[i].internalId == id)
			{
				pdMarkerOpenList[i].closeDetailWin();
				pdMarkerOpenList.slice(i,i);
			}
}

function latLongToPixel(map,coord,zoom) {
	var bmCoord = map.spec.getBitmapCoordinate(coord.y,coord.x,zoom);
	return map.getDivCoordinate(bmCoord.x,bmCoord.y);
}


// PdMarker code
function PdMarkerNamespace() {

var userAgent = navigator.userAgent.toLowerCase();
var n4=(document.layers);
var n6=(document.getElementById&&!document.all);
var ie=(document.all);
var o6=(userAgent.indexOf("opera") != -1);
var safari=(userAgent.indexOf("safari") != -1);
var msie  = (userAgent.indexOf("msie") != -1) && (userAgent.indexOf("opera") == -1);

var nextMarkerId = 10;
var permitLeft = true;

// Globals - careful of multiple maps

function PdMarker(a, b, tooltip) {
	this.inheritFrom = GMarker;
	this.inheritFrom(a,b);
	if (typeof tooltip != "undefined")
		this.pendingTitle = tooltip;
	else
		this.pendingTitle = "";
	this.internalId = nextMarkerId;
	nextMarkerId += 1;
	this.zIndexSaved = false;
	this.oldImagePath = "";
	this.pendingCursor = "";
	this.percentOpacity = 70;
	this.mouseOutEnabled = true;
	this.setImageOn = true;
	this.hidingEnabled = true;
	this.showDetailOnClick = true;
	this.detailOpen = false;
}

PdMarker.prototype = new GMarker;

PdMarker.prototype.initialize = function(a) {
	try
	{
		GMarker.prototype.initialize.call(this, a);
		this.isMarker = true;
		if (this.pendingTitle.length > 0)
			this.setTitle(this.pendingTitle);
		if (this.pendingCursor.length > 0)
			this.setCursor(this.pendingCursor);

		var c = this.iconImage;
		if (n6 && this.icon.imageMap && !safari)
			c = this.imageMap;
		else if (this.transparentIcon && typeof this.transparentIcon != "undefined")
			c = this.transparentIcon;
		// c = this.images[2]; // pmj debug firefox maps.23, but explorer no change, err on click

		GEvent.bindDom(c, "mouseover", this, this.onMouseOver);
		GEvent.bindDom(c, "mouseout",  this, this.onMouseOut);
		GEvent.bindDom(c, "click",  this, this.onClick);
		GEvent.bind(this.map, "zoom", this, this.reZoom);
	}
	catch(e) {}
}

PdMarker.prototype.allowLeftTooltips = function(a){
	permitLeft = a;
}

PdMarker.prototype.reZoom = function(){
	var didSet = false;
	if (this.tooltipObject)
		if (this.tooltipObject.style.display == "block")
		{
			setTTPosition(this);
			didSet = true;
		}
	if (this.detailObject)
	{
		if (!didSet)
			setTTPosition(this);
		this.detailObject.style.top  = this.ttTop + "px";
		this.detailObject.style.left  = this.ttLeft + "px";
	}
}

PdMarker.prototype.setId = function(id) {
	this.internalId = id;
}

PdMarker.prototype.getId = function() {
	return this.internalId;
}

PdMarker.prototype.setName = function(a) {
	this.name = a;
}

PdMarker.prototype.getName = function() {
	if (this.name)
		return this.name;
	else
		return null;
}

PdMarker.prototype.setUserData = function(a) {
	this.userData = a;
}

PdMarker.prototype.getUserData = function() {
	if (this.userData)
		return this.userData;
	else
		return null;
}

PdMarker.prototype.setUserData2 = function(a) {
	this.userData2 = a;
}

PdMarker.prototype.getUserData2 = function() {
	if (this.userData2)
		return this.userData2;
	else
		return null;
}


PdMarker.prototype.setPoint = function(newPoint) {
	this.display(false);
	this.point.y = newPoint.y;
	this.point.x = newPoint.x;
	this.redraw(true);
	this.display(true);
}

PdMarker.prototype.getPoint = function() {
	return this.point;
}

PdMarker.prototype.setImageEnabled = function(a) {
	this.setImageOn = a;
}

PdMarker.prototype.setImage = function(a) {
	if (this.mouseOutEnabled && this.setImageOn)
	{
		if (this.oldImagePath.length == 0)
			this.oldImagePath = this.images[0].src;
		if (msie)
			this.images[0].style.filter = 
				'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + a + '")';
		else
			this.images[0].src = a;
	}
}

PdMarker.prototype.restoreImage = function() {
	if (this.mouseOutEnabled && this.setImageOn && this.oldImagePath.length > 0)
	{
		var a = this.oldImagePath;
		this.setImage(a);
		this.oldImagePath = "";
	}
}

PdMarker.prototype.setIcon = function(a) {
	this.remove();
	this.icon = a;
	this.initialize(this.map);
	this.redraw(true); 
}

PdMarker.prototype.setMarkerZIndex = function(a) {
	if (!this.zIndexSaved)
	{
		this.zIndexSaved = true;
		this.oldZIndex = this.images[0].style.zIndex;
	}
	this.images[0].style.zIndex = a;
	this.redraw(true);
}

PdMarker.prototype.topMarkerZIndex = function() {
	this.setMarkerZIndex (600000);
}

PdMarker.prototype.restoreMarkerZIndex = function() {
	if (this.zIndexSaved)
	{
		this.zIndexSaved = false;
		this.images[0].style.zIndex = this.oldZIndex;
		this.redraw(true);
	}
}

PdMarker.prototype.onInfoWindowOpen = function() {
	this.hideTooltip();
	GMarker.prototype.onInfoWindowOpen.call(this);
}

PdMarker.prototype.setHoverImage = function(a) {
	this.hoverImage = a;
}

PdMarker.prototype.onMouseOver = function() {
	if (this.hoverImage)
		this.setImage(this.hoverImage);
	if (!this.detailOpen)
	{
		GEvent.trigger(this, "mouseover");
		this.showTooltip();
	}
}

PdMarker.prototype.onMouseOut = function() {
	if (this.hoverImage)
		this.restoreImage();
	if (!this.detailOpen)
	{
		if (this.mouseOutEnabled)
			this.hideTooltip();
		GEvent.trigger(this, "mouseout");
	}
}

PdMarker.prototype.setMouseOutEnabled = function(a) {
	this.mouseOutEnabled = a;
}

PdMarker.prototype.getMouseOutEnabled = function() {
	return this.mouseOutEnabled;
}

PdMarker.prototype.setTooltipHiding = function(a) {
	this.hidingEnabled = a;
}

PdMarker.prototype.getTooltipHiding = function() {
	return this.hidingEnabled;
}

PdMarker.prototype.setTitle = function(a) {
	this.tooltipText = "";
	if (this.images)
		this.images[0].title = a;
	else
		this.pendingTitle = a;
}

PdMarker.prototype.setCursor = function(a) {
	if (this.images)
		this.images[0].style.cursor = a;
	else
		this.pendingCursor = a;
}

PdMarker.prototype.setTooltipClass = function(a) {
	this.pendingClassName = a;
	if (this.tooltipObject)
	{
/*
		if (this.tooltipRaw)
			this.setTooltipNoResize(this.tooltipRaw);
*/

		var showing = (this.tooltipObject.style.display != "none");
		this.deleteObjects();
		if (this.tooltipRaw)
			this.setTooltipNoResize(this.tooltipRaw);
		if (showing)
			this.showTooltip();

	}
	else
		if (this.tooltipRaw)
			this.setTooltipNoResize(this.tooltipRaw);
}

PdMarker.prototype.resetTooltipClass = function() {
	this.setTooltipClass("markerTooltip");
}

PdMarker.prototype.setTooltipNoResize = function(a) {
	this.setTitle("");
	var ttClass = "markerTooltip";
	if (this.pendingClassName)
		ttClass = this.pendingClassName;
	this.tooltipRaw = a;
	this.tooltipText = "<div class='" + ttClass + "'>" + a + "</div>";
	if (this.tooltipObject)
		this.tooltipObject.innerHTML = this.tooltipText;
}

PdMarker.prototype.setTooltip = function(a) {
	this.setTooltipNoResize(a);
	this.deleteObjects();
}

PdMarker.prototype.showTooltip = function() {
	if (this.tooltipText)
	{
		if (!this.tooltipObject)
			initTooltip(this);
		setTTPosition(this);
		this.tooltipObject.style.display = "block";
	}
}

PdMarker.prototype.hideTooltip = function() {
	if (this.tooltipObject)
		if (this.hidingEnabled)
			this.tooltipObject.style.display = "none";
}

PdMarker.prototype.onClick = function(a) {
	if (this.showDetailOnClick && this.detailWinHTML)
		this.showDetailWin();
}

PdMarker.prototype.setShowDetailOnClick = function(a) {
	this.showDetailOnClick = a;
}

PdMarker.prototype.setDetailWinHTML = function(a) {
	this.detailWinHTML = a;
}

PdMarker.prototype.setDetailWinClass = function(a) {
	this.pendingWinClassName = a;
}

PdMarker.prototype.showDetailWin = function() {
	if (this.detailOpen)
	{
		this.closeDetailWin();
		return;
	}

	this.hideTooltip();
	this.setMouseOutEnabled(false);

	var winClass = "markerDetail";
	if (this.pendingWinClassName)
	{
		winClass = this.pendingWinClassName;
	}

	var html = "<table><tr><td>" + this.detailWinHTML + "<\/td><td valign='top'><a class='markerDetailClose' href='javascript:PdMarkerClose(" + this.internalId + ")'><img src='http://www.google.com/mapfiles/close.gif' width='14' height='13'><\/a><\/td><\/tr><\/table>";
	html = "<div class='" + winClass + "'>" + html + "</div>";

	this.detailOpen = true;

	if (!this.tooltipText)
	{
		this.ttWidth = 150;
		this.ttHeight = 30;
		setTTPosition(this); // compute ttTop, ttLeft
	}

	initDetailWin(this, this.ttTop, this.ttLeft, html);

	PdMarkerAddDetailWinOpen(this);
}


PdMarker.prototype.closeDetailWin = function() {
	this.detailOpen = false;
	if (this.detailObject)
	{
		this.setMouseOutEnabled(true);

		this.onMouseOut();
		// GEvent.trigger(this, "mouseout");
		this.map.div.removeChild(this.detailObject);
		this.detailObject = null;
	}
}


PdMarker.prototype.deleteObjects = function() {
	if (this.tooltipObject)
	{
		this.map.div.removeChild(this.tooltipObject);
		this.tooltipObject = null;
	}
	if (this.detailObject)
	{
		this.map.div.removeChild(this.detailObject);
		this.detailObject = null;
	}
}

PdMarker.prototype.remove = function(a) {
	GMarker.prototype.remove.call(this);
	this.deleteObjects();
}

PdMarker.prototype.setOpacity = function(b) {
	if (b < 0)
		b=0;
	if (b >= 100)
		b=100;
	var c = b / 100;
	this.percentOpacity = b;
	var d = document.getElementById(this.objId);
	if (d)
	{
		if(typeof(d.style.filter)=='string'){d.style.filter='alpha(opacity:'+b+')';}
		if(typeof(d.style.KHTMLOpacity)=='string'){d.style.KHTMLOpacity=c;}
		if(typeof(d.style.MozOpacity)=='string'){d.style.MozOpacity=c;}
		if(typeof(d.style.opacity)=='string'){d.style.opacity=c;}
	}
}

PdMarker.prototype.setOpacityNew = function(b) {
	setObjOpacity(this.objId);
	this.percentOpacity = b;
}

// ***** Private routines *****

function setObjOpacity(objId, b) {
	if (b < 0)
		b=0;
	if (b >= 100)
		b=100;
	var c = b / 100;
	var d = document.getElementById(objId);
	if (d)
	{
		if(typeof(d.style.filter)=='string'){d.style.filter='alpha(opacity:'+b+')';}
		if(typeof(d.style.KHTMLOpacity)=='string'){d.style.KHTMLOpacity=c;}
		if(typeof(d.style.MozOpacity)=='string'){d.style.MozOpacity=c;}
		if(typeof(d.style.opacity)=='string'){d.style.opacity=c;}
	}
}

function idToElemId(id) {
	return "ttobj" + id;
}

function initTooltip(theObj) {
	theObj.objId = idToElemId(theObj.internalId);
	theObj.anchorLatLng = theObj.point;

	var b = theObj.map.ownerDocument.createElement('span');
	theObj.tooltipObject = b;
	b.setAttribute('id',theObj.objId);
	b.innerHTML = theObj.tooltipText;

	// append to body for size calculations
	var c = document.body;
	var d = document.getElementById("pdmarkerwork");
	if (d)
		c = d;
	c.appendChild(b);
	// theObj.map.div.appendChild(b);
	b.style.position = "absolute";
	b.style.bottom = "5px";
	b.style.left = "5px";
	b.style.zIndex = 1;
	if (theObj.percentOpacity)
		theObj.setOpacity(theObj.percentOpacity);
	var tempObj = document.getElementById(theObj.objId);
	theObj.ttWidth  = tempObj.offsetWidth;
	theObj.ttHeight = tempObj.offsetHeight;
	c.removeChild(b);

	b.style.zIndex = 600000;
	b.style.bottom = "";
	b.style.left = "";
	theObj.map.div.appendChild(b);
}

function initDetailWin(theObj, top, left, html) {
	theObj.detailId = "detail" + theObj.internalId;
	var b = theObj.map.ownerDocument.createElement('span');
	theObj.detailObject = b;
	b.setAttribute('id',theObj.detailId);
	b.innerHTML = html;
	b.style.display = "block";
	b.style.position = "absolute";
	b.style.top  = top + "px";
	b.style.left = left + "px";
	b.style.zIndex = 600001;
	theObj.map.div.appendChild(b);
}

function setTTPosition(theObj) {
	var ttPos = latLongToPixel(theObj.map,theObj.point,theObj.map.getZoomLevel());
	ttPos.x += Math.floor(theObj.icon.iconAnchor.x/2);
	ttPos.y -= Math.floor(theObj.icon.iconAnchor.y/2);

	var rightSide = true;
	var bounds	= theObj.map.getBoundsLatLng();
	var longSpan = bounds.maxX - bounds.minX;
	// var mapWidth = parseInt(theObj.map.container.style.width);
	var mapWidth = theObj.map.container.offsetWidth;
	var tooltipWidthInDeg = (theObj.ttWidth + theObj.icon.iconSize.width + 6) / mapWidth * longSpan;
	if (theObj.point.x + tooltipWidthInDeg > bounds.maxX && permitLeft)
		rightSide = false;
	if (rightSide)
	{
		ttPos.y -= Math.floor(theObj.ttHeight/2);
		ttPos.x += theObj.icon.iconSize.width;
	}
	else
	{
		ttPos.y -= Math.floor(theObj.ttHeight/2);
		ttPos.x -= (theObj.icon.iconSize.width + theObj.ttWidth);
	}
	theObj.ttLeft = ttPos.x;
	theObj.ttTop  = ttPos.y;
	if (theObj.tooltipObject)
	{
		theObj.tooltipObject.style.left = ttPos.x + "px";
		theObj.tooltipObject.style.top  = ttPos.y + "px";
	}
}

function getClientWidth()
{
	if (self.innerWidth)
		return self.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth)
		return document.documentElement.clientWidth;
	else if (document.body)
		return document.body.clientWidth;
}

function makeInterface(a) {
	var b = a || window;
	b.PdMarker = PdMarker;
}

makeInterface();
}


PdMarkerNamespace();
