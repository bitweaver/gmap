/* @todo these loops need an extra level of nesting.  
 * They need to be markers within sets within the containing array.
 * The references to the array coming from the BitGmap class is also wrong, they are nested. 
 * Should also simplfy the way the class constructs the holding array
 */
 
{if count($gContent->mMapSets.init_markers) > 0}
var bIMData = new Array();
{section name=initmarkers loop=$gContent->mMapSets.init_markers}

bIMDatat[{$smarty.section.initmarkers.index}] = new Array();
bIMDatat[{$smarty.section.initmarkers.index}].marker_id = {$gContent->mMapSets.init_markers[initmarkers].marker_id};
bIMDatat[{$smarty.section.initmarkers.index}].name = {$gContent->mMapSets.init_markers[initmarkers].name};
bIMDatat[{$smarty.section.initmarkers.index}].lat = {$gContent->mMapSets.init_markers[initmarkers].lat};
bIMDatat[{$smarty.section.initmarkers.index}].lon = {$gContent->mMapSets.init_markers[initmarkers].lon};
bIMDatat[{$smarty.section.initmarkers.index}].window_data = {$gContent->mMapSets.init_markers[initmarkers].window_data};
bIMDatat[{$smarty.section.initmarkers.index}].label_data = {$gContent->mMapSets.init_markers[initmarkers].label_data};
bIMDatat[{$smarty.section.initmarkers.index}].zindex = {$gContent->mMapSets.init_markers[initmarkers].zindex};

{/section}



{if count($gContent->mMapSets.set_markers) > 0}
var bSMData = new Array();
{section name=setmarkers loop=$gContent->mMapSets.set_markers}

bSMData[{$smarty.section.setmarkers.index}] = new Array();
bSMData[{$smarty.section.setmarkers.index}].marker_id = {$gContent->mMapSets.set_markers[setmarkers].marker_id};
bSMData[{$smarty.section.setmarkers.index}].name = {$gContent->mMapSets.set_markers[setmarkers].name};
bSMData[{$smarty.section.setmarkers.index}].lat = {$gContent->mMapSets.set_markers[setmarkers].lat};
bSMData[{$smarty.section.setmarkers.index}].lon = {$gContent->mMapSets.set_markers[setmarkers].lon};
bSMData[{$smarty.section.setmarkers.index}].window_data = {$gContent->mMapSets.set_markers[setmarkers].window_data};
bSMData[{$smarty.section.setmarkers.index}].label_data = {$gContent->mMapSets.set_markers[setmarkers].label_data};
bSMData[{$smarty.section.setmarkers.index}].zindex = {$gContent->mMapSets.set_markers[setmarkers].zindex};

{/section}

