if (typeof(BitMap) == 'undefined') {
    BitMap = {};
}
if (typeof(BitMap.Utl) == 'undefined') {
    BitMap.Utl = {};
}
if (typeof(BitMap.Utl.MapResize) == 'undefined') {
    BitMap.Utl.MapResize = {};
}

//array of page elms to offset map height by
BitMap.Utl.MapResize.offsetReg = [];

//register offset elms
BitMap.Utl.MapResize.regOffsetObjs = function(array){
	for (var n in array){
		BitMap.Utl.MapResize.offsetReg.push(array[n]);
	}
}

//some extra value to force things if need be
BitMap.Utl.MapResize.offsetBonus = 0;

BitMap.Utl.MapResize.regOffsetBonus = function(n){
	BitMap.Utl.MapResize.offsetBonus = n;
}

//a minimum size to never map the map less than
BitMap.Utl.MapResize.minSize = 1;

BitMap.Utl.MapResize.regMinSize = function(n){
	BitMap.Utl.MapResize.minSize = n;
}

//reference to map object
BitMap.Utl.MapResize.mapRef;

//register map object
BitMap.Utl.MapResize.regMap = function(map){
	BitMap.Utl.MapResize.mapRef = map;
}

//reference to map div DOM element not the id
BitMap.Utl.MapResize.mapDivRef;

//register map div
BitMap.Utl.MapResize.regMapDiv = function(mapDiv){
	BitMap.Utl.MapResize.mapDivRef = mapDiv;
}

//reference to side panel div DOM element not the id
BitMap.Utl.MapResize.panelDivRef = null;

//register panel div
BitMap.Utl.MapResize.regPanelDiv = function(panelDiv){
	BitMap.Utl.MapResize.panelDivRef = panelDiv;
}

//get size of other elms effecting map size
BitMap.Utl.MapResize.getOffset = function(){
	var sum = 0 + BitMap.Utl.MapResize.offsetBonus;
	var reg = BitMap.Utl.MapResize.offsetReg;
	for (var n=0; n<reg.length; n++){
		sum += MochiKit.Style.getElementDimensions(reg[n]).h;
	}
	return sum;
}

//resizes the map div
BitMap.Utl.MapResize.sizeMapDiv = function(){
	var offset = BitMap.Utl.MapResize.getOffset();
	var w = MochiKit.Style.getViewportDimensions();
	//new height
	var h = w.h - offset;
	if (h < BitMap.Utl.MapResize.minSize){
		h = BitMap.Utl.MapResize.minSize;
	}
	BitMap.Utl.MapResize.mapDivRef.style.height = h + 'px';
	if ( BitMap.Utl.MapResize.panelDivRef != null){
		BitMap.Utl.MapResize.panelDivRef.style.height = (h - 146) + 'px';
	}
}

BitMap.Utl.MapResize.resizingInterval = null;
BitMap.Utl.MapResize.resizingFlag = false;

BitMap.Utl.MapResize.setResizeListener = function(){
    window.onresize = function()
    {
		BitMap.Utl.MapResize.sizeMapDiv();
        BitMap.Utl.MapResize.resizingFlag = true;
		if(BitMap.Utl.MapResize.resizingInterval==null)
			BitMap.Utl.MapResize.resizingInterval = setInterval("BitMap.Utl.MapResize.checkResizeEnd()", 100);
    };
}

BitMap.Utl.MapResize.checkResizeEnd = function(){
	if(!BitMap.Utl.MapResize.resizingFlag)
	{
		BitMap.Utl.MapResize.mapRef.checkResize();
		clearInterval(BitMap.Utl.MapResize.resizingInterval);
		BitMap.Utl.MapResize.resizingInterval = null;
	}
	BitMap.Utl.MapResize.resizingFlag = false;
}