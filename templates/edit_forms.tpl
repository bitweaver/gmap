
<div>
  <a id="emap" href="javascript:editMap();">Edit Map</a> | 
	<a id="emaptype" href="javascript:editMapTypes();">Edit Map Types</a> |
  <a id="emarker" href="javascript:editMarkers();">Edit Markers</a> | 
  <a id="epolyline" href="javascript:editPolylines();">Edit Polylines</a> 
  <!-- <a href="javascript:show('editpolygonsrform');">Edit Polygons</a> //-->
</div>


<!-------------------------
	-   Map Editing Forms
	------------------------->

<!--map editing form -->
<div id="editmapform" style="display:none;">
    <h3>Map Tools</h3>
    <form action="javascript:;" name="mapform" id="mapform">
		   <input name="save_map" type="hidden" size="25" value="true">
		   <!-- Map Id --> <input name="gmap_id" id="gmap_id" type="hidden" size="25" value="">
    	 Title <input name="title" id="map_title" type="text" size="25" value=""><br/>
    	 Description <input name="map_desc" id="map_desc" type="text" size="25" value=""><br/>
    	 Width <input name="map_w" id="map_w" type="text" size="25" value=""><br/>
    	 Height <input name="map_h" id="map_h" type="text" size="25" value=""><br/>
    	 Latitude <input name="map_lat" id="map_lat"type="text" size="25" value=""><br/>
    	 Longitude <input name="map_lon" id="map_lon" type="text" size="25" value=""><br/>
    	 Zoom Level <input name="map_z" id="map_z" type="text" size="25" value=""><br/>		
    	 Show Controls <select name="map_showcont" id="map_showcont">
          <option value="s" >Small</option>
          <option value="l" >Large</option>
          <option value="z" >Zoom Only</option>
          <option value="n" >None</option>
          </select><br/>
    	 Show Scale <select name="map_showscale" id="map_showscale">
          <option value="TRUE" >Yes</option>
          <option value="FALSE" >No</option>
          </select><br/>
    	 Show Map Type Buttons <select name="map_showtypecont" id="map_showtypecont">
          <option value="TRUE" >Yes</option>
          <option value="FALSE" >No</option>
          </select><br/>
    	 Default Map Type
    			<select name="map_type" id="map_type">
          <option value="G_MAP_TYPE" >Street Map</option>
          <option value="G_SATELLITE_TYPE" >Satellite</option>
          <option value="G_HYBRID_TYPE" >Hybrid</option>
   			</select><br/>
    <!-- Allow Comments <input name="map_comm" id="map_comm" type="checkbox" value=""><br/> //-->
    <input type="button" name="save_map_btn" value="Submit" onclick="javascript:storeMap('edit.php', this.parentNode);"><br/>
   	<input type="button" name="closemapform" value="Cancel" onclick="javascript:canceledit('editmapform');">
    </form>
</div>	
<!--end map editing form -->

<div id="editmaptypemenu" style="display:none;">
		<a href="javascript:newMapType();">Add New Map Type</a>
</div>

<div id="newmaptypeform" class="editform" style="display:none;">
		<h2>Add A New Map Type</h2>
    		<div class="table" id="editmaptypetable_new">
    			<form action="javascript:;" name="maptypeform_new" id="maptypeform_new">
    			<div class="data" id="maptypeformdata_new">
          	<div style="float:left; padding:0 .4em; width:10px"><input name="save_maptype" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:140px">Name<br/><input name="name" type="text" size="25" value="a name">
          			 																					 <br/>Description<br/><input name="description" type="text" size="25" value="a name"></div>
          	<div style="float:left; padding:0 .4em; width:60px">Copyright<br/><input name="copyright" type="text" size="10" value="">
          			 																					 <br/>Max Zoom<br/><input name="maxzoom" type="text" size="3" value="0"></div>
          	<div style="float:left; padding:0 .4em; width:90px">Base Map Type<br/><select name="basetype">
                                                                  <option value="0" >Street Map</option>
                                                                  <option value="1" >Satellite</option>
                                                                  <option value="2" >Hybrid</option>
                                          							   			</select><br/>
          																											Alt Map Type<br/><select name="alttype">
                                                                  <option value="0" >Street Map</option>
                                                                  <option value="1" >Satellite</option>
                                                                  <option value="2" >Hybrid</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:140px">Bounds<br/><textarea name="bounds" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px">Map Tiles URL<br/><input name="maptiles_url" type="text" size="25" value="">
          			 																					 <br/>Low Res Map Tiles URL<br/><input name="lowtiles_url" type="text" size="25" value="google"></div>
          	<div style="float:left; padding:0 .4em; width:140px">Hybrid Tiles URL<br/><input name="hybridtiles_url" type="text" size="25" value="none">
          			 																					 <br/>Low Res Hybrid Tiles URL<br/><input name="lowhybridtiles_url" type="text" size="25" value="google"></div>
          	 ACTIONS<br/><a style="float:left; padding:0 .4em;" name="save_maptype_btn" title="save" href="javascript:storeNewMapType('edit_maptype.php', document.maptypeform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
    			</div>
    			</form>
  		  </div>
			<div id="newmaptypecancel" style="clear:both;"><input type="button" name="closenewmaptypeform" value="Cancel Adding A New Map Type" onclick="javascript:canceledit('newmaptypeform');"></div>
</div> <!-- end of editmaptypeform -->


<div id="editmaptypeform" class="editform" style="display:none;">
		<h2>Map Types Associated With This Map</h2>		
    		<div class="table" id="editmaptypetable_n" style="display:none;">
    			<form action="javascript:;" name="maptypeform_n" id="maptypeform_n" style="display:none;">
    			<div class="data" id="maptypeformdata_n">
          	<div style="float:left; padding:0 .4em; width:10px"><input name="array_n" type="hidden" value="n"></div>
          	<div style="float:left; padding:0 .4em; width:10px"><input name="save_maptype" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:10px"><input name="maptype_id" type="hidden" size="3" value="n"></div>
          	<div style="float:left; padding:0 .4em; width:140px">Name<br/><input name="name" type="text" size="25" value="a name">
          			 																					 <br/>Description<br/><input name="description" type="text" size="25" value="a name"></div>
          	<div style="float:left; padding:0 .4em; width:60px">Copyright<br/><input name="copyright" type="text" size="10" value="">
          			 																					 <br/>Max Zoom<br/><input name="maxzoom" type="text" size="3" value="0"></div>
          	<div style="float:left; padding:0 .4em; width:90px">Base Map Type<br/><select name="basetype">
                                                                  <option value="0" >Street Map</option>
                                                                  <option value="1" >Satellite</option>
                                                                  <option value="2" >Hybrid</option>
                                          							   			</select><br/>
          																											Alt Map Type<br/><select name="alttype">
                                                                  <option value="0" >Street Map</option>
                                                                  <option value="1" >Satellite</option>
                                                                  <option value="2" >Hybrid</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:140px">Bounds<br/><textarea name="bounds" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px">Map Tiles URL<br/><input name="maptiles_url" type="text" size="25" value="">
          			 																					 <br/>Low Res Map Tiles URL<br/><input name="lowtiles_url" type="text" size="25" value="google"></div>
          	<div style="float:left; padding:0 .4em; width:140px">Hybrid Tiles URL<br/><input name="hybridtiles_url" type="text" size="25" value="none">
          			 																					 <br/>Low Res Hybrid Tiles URL<br/><input name="lowhybridtiles_url" type="text" size="25" value="google"></div>
          	 ACTIONS<br/><a style="float:left; padding:0 .4em;" name="save_maptype_btn" title="save" href="javascript:storeMapType('edit_maptype.php', document.maptypeform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
          	<a style="float:left; padding:0 .4em;" name="locate_maptype_btn" title="show on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="remove_maptype_btn" title="remove from this map" href="javascript:removeMapType('edit_maptype.php', document.maptypeform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="expunge_maptype_btn" title="delete the maptype!" href="javascript:expungeMapType('edit_maptype.php', document.maptypeform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a>
    			</div>
    			</form>
  		  </div>
</div> <!-- end of editmaptypeform -->

<div id="editmaptypecancel" style="display:none; clear:both;"><input type="button" name="closemaptypeform" value="Cancel Editing Map Types" onclick="javascript:canceledit('editmaptypemenu'); canceledit('editmaptypeform'); canceledit('editmaptypecancel'); canceledit('newmaptypeform')"></div>
<!--end maptype editing forms -->





<!-------------------------
	-  Marker Editing Forms
	------------------------->
	
<!--marker editing forms -->
<div id="editmarkermenu" style="display:none;">
		<a href="javascript:newMarker();">New Marker</a> | 
		<a href="javascript:newMarkerSet();">New Marker Set</a> | 
		<a href="javascript:editMarkerStyles();">Edit Marker Styles</a> | 
		<a href="javascript:alert('this feature is coming soon');">Edit Marker Icons</a>
</div>


<div id="newmarkersetform" class="editform" style="display:none;">
		<h2>Add a New Marker Set</h2>		
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Description </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Style </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Icon </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Load Option </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>
    		</div>
    		<div class="table" id="editmarkersettable_new">
    			<form action="javascript:;" name="markersetform_new" id="markersetform_new">
    			<div class="data">
          	<div style="float:left; padding:0 .4em; width:10px"><input name="save_markerset" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="a name"></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="description" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px"><select name="style_id" id="style_id">
                                                                  <option value="0" >Google (standard)</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:140px"><select name="icon_id" id="icon_id">
                                                                  <option value="0" >Google (standard)</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:140px"><select name="set_type" id="set_type">
                                                                  <option value="init_markers" >On Page Load</option>
                                                                  <option value="set_markers" >Side Panel Only</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:70px"><a name="new_markerset_btn" title="save" href="javascript:storeNewMarkerSet('edit_markerset.php', document.markersetform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
    			</div>
    			</form>
  		  </div>
		<div id="newmarkersetcancel" style="clear:both;"><input type="button" name="closemarkersetform" value="Cancel New Marker Set" onclick="javascript:canceledit('newmarkersetform'); canceledit('editerror');"></div>
</div>
<!-- end of newmarkersetform -->



<div id="newmarkerform" class="editform" style="display:none;">
		<h2>Add a New Marker</h2>		
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Title </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Latitude </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Longitude </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Window Text </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Label Text </div>
    				<div style="float:left; padding:0 .4em; width:50px"> zIndex </div>
    				<div style="float:left; padding:0 .4em; width:50px"> Set </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>
    		</div>
    		<div class="table" id="editmarkertable_new">
    			<form action="javascript:;" name="markerform_new" id="markerform_new">
    			<div class="data">
          	<div style="float:left; padding:0 .4em; width:90px"><input name="new_marker" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="title" type="text" size="15" value="a title"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="marker_lat" type="text" size="15" value=""></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="marker_lon" type="text" size="15" value=""></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="edit" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="marker_labeltext" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:50px"><input name="marker_zi" type="text" size="3" value="0"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><select name="set_id" id="set_id">
                                                                  <option value="n" >someset</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:70px"><a name="new_marker_btn" title="save" href="javascript:storeNewMarker('edit_marker.php', document.markerform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
          	<a style="float:left; padding:0 .4em;" name="marker_assist_btn" title="click a location!" href="javascript:addAssistant('marker', 'new');">Use Locating Assistant</a>
    			</div>
    			</form>
  		  </div>
		<div id="newmarkercancel" style="clear:both;"><input type="button" name="closemarkerform" value="Cancel New Marker" onclick="javascript:canceledit('newmarkerform'); removeAssistant(); canceledit('editerror');"></div>
</div> <!-- end of newmarkerform -->



<div id="editmarkerstylesmenu" style="display:none;">
		<a href="javascript:newMarkerStyle();">Add a New Marker Style</a>
</div>


<div id="newmarkerstyleform" class="editform" style="display:none;">
		<h2>Add a New Marker Style</h2>		
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Type </div>
    				<div style="float:left; padding:0 .4em; width:70px"> Label Hover Opacity (%)</div>
    				<div style="float:left; padding:0 .4em; width:70px"> Label Opacity (%)</div>
    				<div style="float:left; padding:0 .4em; width:140px"> Label Hover Styles (CSS)</div>
    				<div style="float:left; padding:0 .4em; width:140px"> Window Styles (CSS)</div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>
    		</div>
    		<div class="table" id="editmarkerstyletable_new">
    			<form action="javascript:;" name="markerstyleform_new" id="markerstyleform_new">
    			<div class="data">
                	<div style="float:left; padding:0 .4em; width:10px"><input name="save_markerstyle" type="hidden" value="true"></div>
                	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="a name"></div>
                	<div style="float:left; padding:0 .4em; width:90px"><select name="type">
                                                                        <option value="0">GMarker</option>
                                                                        <option value="1">PdMarker</option>
                                                                        <option value="2">XMarker</option>
                                                							   			</select></div>
                	<div style="float:left; padding:0 .4em; width:70px"><input name="label_hover_opacity" type="text" size="5" value="70"></div>
                	<div style="float:left; padding:0 .4em; width:70px"><input name="label_opacity" type="text" size="5" value="100"></div>
                	<div style="float:left; padding:0 .4em; width:140px"><textarea name="label_hover_styles" cols="15" rows="3"></textarea></div>
                	<div style="float:left; padding:0 .4em; width:140px"><textarea name="window_styles" cols="15" rows="3"></textarea></div>
                	<div style="float:left; padding:0 .4em; width:70px"><a name="new_markerstyle_btn" title="save" href="javascript:storeNewMarkerStyle('edit_markerstyle.php', document.markerstyleform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
    			</div>
    			</form>
  		  </div>
		<div id="newmarkerstylecancel" style="clear:both;"><input type="button" name="closemarkerstyleform" value="Cancel New Marker Style" onclick="javascript:canceledit('newmarkerstyleform'); canceledit('editerror');"></div>
</div>
<!-- end of newmarkerstyleform -->


<div id="editmarkerstyleform" class="editform" style="display:none;">
		<h2>Marker Styles Associated with Marker Sets on This Map</h2>		
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Type </div>
    				<div style="float:left; padding:0 .4em; width:70px"> Label Hover Opacity (%)</div>
    				<div style="float:left; padding:0 .4em; width:70px"> Label Opacity (%)</div>
    				<div style="float:left; padding:0 .4em; width:140px"> Label Hover Styles (CSS)</div>
    				<div style="float:left; padding:0 .4em; width:140px"> Window Styles (CSS)</div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>
    		</div>
      		<div class="table" id="editmarkerstyletable_n">
      			<form action="javascript:;" name="markerstyleform_n" id="markerstyleform_n" style="display:none;">
      			<div class="data" id="markerstyleformdata_n">
            	<div style="float:left; padding:0 .4em; width:10px"><input name="save_markerstyle" type="hidden" value="true"></div>
            	<div style="float:left; padding:0 .4em; width:10px"><input name="style_array_n" type="hidden" value="true"></div>
            	<div style="float:left; padding:0 .4em; width:10px"><input name="style_id" type="hidden" value="n"></div>
            	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="a name"></div>
            	<div style="float:left; padding:0 .4em; width:90px"><select name="type">
                                                                    <option value="0">GMarker</option>
                                                                    <option value="1">PdMarker</option>
                                                                    <option value="2">XMarker</option>
                                            							   			</select></div>
            	<div style="float:left; padding:0 .4em; width:70px"><input name="label_hover_opacity" type="text" size="5" value="70"></div>
            	<div style="float:left; padding:0 .4em; width:70px"><input name="label_opacity" type="text" size="5" value="100"></div>
            	<div style="float:left; padding:0 .4em; width:140px"><textarea name="label_hover_styles" cols="15" rows="3"></textarea></div>
            	<div style="float:left; padding:0 .4em; width:140px"><textarea name="window_styles" cols="15" rows="3"></textarea></div>
            	<a style="float:left; padding:0 .4em;" name="save_markerstyle_btn" title="save" href="javascript:storeMarkerStyle('edit_markerstyle.php', document.markerstyleform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
      			</div>
      			</form>
    		  </div>
</div> <!-- end of editmarkerstylesform -->

<div id="editmarkerstylescancel" style="display:none; clear:both;"><input type="button" name="closemarkerstylesform" value="Cancel Editing Marker Styles" onclick="javascript:canceledit('editmarkerstylesmenu'); canceledit('newmarkerstyleform'); canceledit('editmarkerstyleform'); canceledit('editmarkerstylescancel');"></div>
<!--end marker style editing forms -->




<div id="editmarkerform" class="editform" style="display:none;">
		<h2>Marker Sets Associated With This Map</h2>		
		<div id="markerset_n" style="display:none; clear:both;">
			<div id="editsetmenu_n">
				 <b id="setid">Set Name</b> | 
				 <span id="setstyle">Style</span> | 
				 <span id="seticon">Icon</span> | 
				 <a id="seteditmarkers" href="javascript:editSet('n');">Edit These Markers</a> | 
				 <a id="setaddmarkers" href="javascript:editSet('n'); show('allavailmarkers_n');">Add Markers to This Set</a> | 
				 <a id="seteditstyle" href="javascript:alert('this feature is coming soon');">Edit Set Style</a> | 
				 <a id="setediticon" href="javascript:alert('this feature is coming soon');">Edit Icon Style</a> | 				 
				 <a id="setremove" href="javascript:removeMarkerSet('edit_markerset.php', set_id, set_type);">Remove Set From Map</a> | 
				 <a id="setdelete" href="javascript:expungeMarkerSet('edit_markerset.php', set_id);">Delete Set</a>
		  	 <br/><span id="setdesc">Description Here</span>
			</div>
			<div id="setform_n" style="display:none;">
				<h3>Markers In This Set</h3>
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Title </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Latitude </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Longitude </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Window Text </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Label Text </div>
    				<div style="float:left; padding:0 .4em; width:50px"> zIndex </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTIONS </div>
    		</div>
    		<div class="table" id="editmarkertable_n">
    			<form action="javascript:;" name="markerform_n" id="markerform_n" style="display:none;">
    			<div class="data" id="formdata_n">
          	<div style="float:left; padding:0 .4em; width:90px"><input name="save_marker" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:30px"><input name="set_id" type="hidden" size="3" value="n"></div>
      			<div style="float:left; padding:0 .4em; width:30px"><input name="marker_id" type="hidden" size="3" value="n"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="title" type="text" size="15" value="a title"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="marker_lat" type="text" size="15" value=""></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="marker_lon" type="text" size="15" value=""></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="edit" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="marker_labeltext" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:50px"><input name="marker_zi" type="text" size="3" value="0"></div>
          	<div style="float:left; padding:0;"><input name="marker_array" type="hidden" value=""></div>
          	<div style="float:left; padding:0;"><input name="marker_array_n" type="hidden" value=""></div>
          	<a style="float:left; padding:0 .4em;" name="save_marker_btn" title="save" href="javascript:storeMarker('edit_marker.php', document.markerform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
          	<a style="float:left; padding:0 .4em;" name="locate_marker_btn" title="locate on the map" href="javascript:bIMData[marker_array_n].marker.openInfoWindowHtml(bIMData[marker_array_n].marker.my_html);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="remove_marker_btn" title="remove from this set" href="javascript:removeMarker('edit_marker.php', document.markerform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="expunge_marker_btn" title="delete the marker!" href="javascript:expungeMarker('edit_marker.php', document.markerform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="marker_assist_btn" title="click a location!" href="javascript:addAssistant('marker', 'n');">Use Locating Assistant</a>
    			</div>
    			</form>
  		  </div>
      	<div id="allavailmarkers_n" style="display:none; clear:both;">
    			<h3>All Markers Available</h3>
        	<div class="table" id="addmarkertable_n">
        		<form action="javascript:;" name="addmarkerform_n" id="addmarkerform_n">
        		<div class="data">
						<!-- @todo this is just placeholder stuff as a starting point -->
						<!--
          		<div style="float:left; padding:0 .4em; width:30px"><input name="marker_id" type="text" size="3" value="a number"></div>
              <div style="float:left; padding:0 .4em; width:90px"><input name="title" type="text" size="15" value="a title"></div>
              <div style="float:left; padding:0 .4em; width:90px"><input name="marker_lat" type="text" size="15" value=""></div>
              <div style="float:left; padding:0 .4em; width:90px"><input name="marker_lon" type="text" size="15" value=""></div>
              <div style="float:left; padding:0 .4em; width:140px"><textarea name="edit" cols="15" rows="3"></textarea></div>
              <div style="float:left; padding:0 .4em; width:140px"><textarea name="marker_labeltext" cols="15" rows="3"></textarea></div>
              <div style="float:left; padding:0 .4em; width:50px"><input name="marker_zi" type="text" size="3" value="undefined"></div>
              <div style="float:left; padding:0;"><input name="marker_array" type="hidden" size="3" value=""></div>
              <div style="float:left; padding:0;"><input name="marker_array_n" type="hidden" size="3" value=""></div>
              <div style="float:left; padding:0 .4em; width:70px"><input type="button" name="save_marker" value="Submit" onclick="javascript:get('edit_marker.php', this.form, this.form.marker_array.value, this.form.marker_array_n.value);"></div>
              <div style="float:left; padding:0 .4em; width:70px"><input type="button" name="locate" value="Locate" onclick="javascript:bIMData[this.form.marker_array_n.value].marker.openInfoWindowHtml(bIMData[this.form.marker_array_n.value].marker.my_html);"></div>
							-->
        		</div>
        		</form>	
    			</div>						
				</div>
			</div> <!--end of setform_n -->			
		</div> <!-- end of markerset_n -->
</div> <!-- end of editmarkerform -->


<div id="editmarkercancel" style="display:none; clear:both;"><input type="button" name="closemarkerform" value="Cancel Editing Markers" onclick="javascript:canceledit('editmarkermenu'); canceledit('newmarkerform'); canceledit('editmarkerform'); canceledit('newmarkersetform'); canceledit('editmarkercancel'); canceledit('editmarkerstylesmenu'); canceledit('newmarkerstyleform'); canceledit('editmarkerstylesform'); canceledit('editmarkerstylescancel'); removeAssistant();  canceledit('editerror');"></div>
<!--end marker editing forms -->






<!-------------------------
	-  Polyline Editing Forms
	------------------------->

<!--polyline editing forms -->
<div id="editpolylinemenu" style="display:none;">
		<a href="javascript:newPolyline();">New Polyline</a> | 
		<a href="javascript:newPolylineSet();">New Polyline Set</a> | 
		<a href="javascript:alert('this feature is coming soon');">Edit Polyline Styles</a>
</div>

<div id="newpolylinesetform" class="editform" style="display:none;">
		<h2>Add a New Polyline Set</h2>		
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Description </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Style </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Load Option </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>
    		</div>
    		<div class="table" id="editpolylinesettable_new">
    			<form action="javascript:;" name="polylinesetform_new" id="polylinesetform_new">
    			<div class="data">
          	<div style="float:left; padding:0 .4em; width:10px"><input name="save_polylineset" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="a name"></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="description" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px"><select name="style_id" id="style_id">
                                                                  <option value="0" >Google (standard)</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:140px"><select name="set_type" id="set_type">
                                                                  <option value="init_polylines" >On Page Load</option>
                                                                  <option value="set_polylines" >Side Panel Only</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:70px"><a name="new_polylineset_btn" title="save" href="javascript:storeNewPolylineSet('edit_polylineset.php', document.polylinesetform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
    			</div>
    			</form>
  		  </div>
		<div id="newpolylinesetcancel" style="clear:both;"><input type="button" name="closepolylinesetform" value="Cancel New Polyline Set" onclick="javascript:canceledit('newpolylinesetform'); canceledit('editerror');"></div>
</div>
<!-- end of newpolylinesetform -->


<div id="newpolylineform" class="editform" style="display:none;">
		<h2>Add a New Polyline</h2>		
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Points Data </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Border Text <br/>only for XPolyline type</div>
    				<div style="float:left; padding:0 .4em; width:50px"> zIndex </div>
    				<div style="float:left; padding:0 .4em; width:50px"> Set </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>						
    		</div>
    		<div class="table" id="editpolylinetable_new">
    			<form action="javascript:;" name="polylineform_new" id="polylineform_new">
    			<div class="data">
          	<div style="float:left; padding:0 .4em; width:10px"><input name="new_polyline" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="new"></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="points_data" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px"><input name="border_text" type="text" size="15" value=""></div>
          	<div style="float:left; padding:0 .4em; width:50px"><input name="zindex" type="text" size="3" value="0"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><select name="set_id" id="polylineset_id">
                                                                  <option value="n" >someset</option>
                                          							   			</select></div>
          	<div style="float:left; padding:0 .4em; width:70px"><a name="new_polyline_btn" title="save" href="javascript:storeNewPolyline('edit_polyline.php', document.polylineform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
          	<a style="float:left; padding:0 .4em;" name="polyline_assist_btn" title="draw the line!" href="javascript:addAssistant('polyline', 'new');">Use Drawing Assistant</a>
    			</div>
    			</form>
  		  </div>
		<div id="newpolylinecancel" style="clear:both;"><input type="button" name="closepolylineform" value="Cancel New Polyline" onclick="javascript:canceledit('newpolylineform'); removeAssistant(); canceledit('editerror');"></div>
</div> <!-- end of newpolylineform -->

<div id="editpolylineform" class="editform" style="display:none;">
		<h2>Polyline Sets Associated With This Map</h2>		
		<div id="polylineset_n" style="display:none; clear:both;">
			<div id="editpolylinesetmenu_n">
				 <b id="polylinesetid">Set Name</b> | 
				 <span id="polylinesetstyle">Style</span> | 
				 <a id="seteditpolylines" href="javascript:editPolylineSet('n');">Edit These Polylines</a> | 
				 <a id="setaddpolylines" href="javascript:editSet('n'); show('allavailmarkers_n');">Add Polylines to This Set</a> | 
				 <a id="seteditstyle" href="javascript:alert('this feature is coming soon');">Edit Set Style</a> | 
				 <a id="setremove" href="javascript:removePolylineSet('edit_polylineset.php', set_id, set_type);">Remove Set From Map</a> | 
				 <a id="setdelete" href="javascript:expungePolylineSet('edit_polylineset.php', set_id);">Delete Set</a>
		  	 <br/><span id="setdesc">Description Here</span>
			</div>
			<div id="polylinesetform_n" style="display:none;">
				<h3>Polylines In This Set</h3>
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Points Data </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Border Text <br/>only for XPolyline type</div>
    				<div style="float:left; padding:0 .4em; width:50px"> zIndex </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>						
    		</div>
    		<div class="table" id="editpolylinetable_n">
    			<form action="javascript:;" name="polylineform_n" id="polylineform_n" style="display:none;">
    			<div class="data" id="polylineformdata_n">
          	<div style="float:left; padding:0 .4em; width:90px"><input name="save_polyline" type="hidden" value="true"></div>
          	<div style="float:left; padding:0 .4em; width:30px"><input name="set_id" type="hidden" size="3" value="n"></div>
      			<div style="float:left; padding:0 .4em; width:30px"><input name="polyline_id" type="hidden" size="3" value="n"></div>
          	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="a name"></div>
          	<div style="float:left; padding:0 .4em; width:140px"><textarea name="points_data" cols="15" rows="3"></textarea></div>
          	<div style="float:left; padding:0 .4em; width:140px"><input name="border_text" type="text" size="15" value=""></div>
          	<div style="float:left; padding:0 .4em; width:50px"><input name="zindex" type="text" size="3" value="0"></div>						
          	<div style="float:left; padding:0;"><input name="polyline_array" type="hidden" value=""></div>
          	<div style="float:left; padding:0;"><input name="polyline_array_n" type="hidden" value=""></div>
          	<a style="float:left; padding:0 .4em;" name="save_polyline_btn" title="save" href="javascript:storePolyline('edit_polyline.php', document.polylineform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
          	<a style="float:left; padding:0 .4em;" name="locate_polyline_btn" title="locate on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="remove_polyline_btn" title="remove from this set" href="javascript:removePolyline('edit_polyline.php', document.polylineform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="expunge_polyline_btn" title="delete the polyline!" href="javascript:expungePolyline('edit_polyline.php', document.polylineform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a>
          	<a style="float:left; padding:0 .4em;" name="polyline_assist_btn" title="draw the line!" href="javascript:addAssistant('polyline', n);">Use Drawing Assistant</a>
    			</div>
    			</form>
  		  </div>
      	<div id="allavailpolylines_n" style="display:none; clear:both;">
    			<h3>All Markers Available</h3>
        	<div class="table" id="addpolylinetable_n">
        		<form action="javascript:;" name="addpolylineform_n" id="addpolylineform_n">
        		<div class="data">
						<!-- @todo this is just placeholder stuff from the marker version as a starting point -->
						<!--
          		<div style="float:left; padding:0 .4em; width:30px"><input name="polyline_id" type="text" size="3" value="a number"></div>
              <div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="a name"></div>
              <div style="float:left; padding:0 .4em; width:90px"><input name="marker_lat" type="text" size="15" value=""></div>
              <div style="float:left; padding:0 .4em; width:90px"><input name="marker_lon" type="text" size="15" value=""></div>
              <div style="float:left; padding:0 .4em; width:140px"><textarea name="edit" cols="15" rows="3"></textarea></div>
              <div style="float:left; padding:0 .4em; width:140px"><textarea name="marker_labeltext" cols="15" rows="3"></textarea></div>
              <div style="float:left; padding:0 .4em; width:50px"><input name="marker_zi" type="text" size="3" value="undefined"></div>
              <div style="float:left; padding:0;"><input name="marker_array" type="hidden" size="3" value=""></div>
              <div style="float:left; padding:0;"><input name="marker_array_n" type="hidden" size="3" value=""></div>
              <div style="float:left; padding:0 .4em; width:70px"><input type="button" name="save_marker" value="Submit" onclick="javascript:get('edit_marker.php', this.form, this.form.marker_array.value, this.form.marker_array_n.value);"></div>
              <div style="float:left; padding:0 .4em; width:70px"><input type="button" name="locate" value="Locate" onclick="javascript:bIMData[this.form.marker_array_n.value].marker.openInfoWindowHtml(bIMData[this.form.marker_array_n.value].marker.my_html);"></div>
							-->
        		</div>
        		</form>	
    			</div>						
				</div>
			</div> <!--end of polylinesetform_n -->			
		</div> <!-- end of polylineset_n -->
</div> <!-- end of editpolylineform -->

<div id="editpolylinecancel" style="display:none; clear:both;"><input type="button" name="closepolylineform" value="Cancel Editing Polylines" onclick="javascript:cancelPolylineEdit(); canceledit('newpolylinesetform'); canceledit('editerror');"></div>
<!--end polyline editing forms -->

