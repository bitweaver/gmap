
<div>
  <a id="emap" href="javascript:editMap();">Edit Map</a> | 
	<a id="emaptype" href="javascript:editMapTypes();">Edit Map Types</a> |
  <a id="emarker" href="javascript:editMarkers();">Edit Markers</a> | 
  <a id="epolyline" href="javascript:editPolylines();">Edit Polylines</a> | 
  <a id="epolygon" href="javascript:editPolygons();">Edit Polygons</a>
</div>


<!-------------------------
	-   Map Editing Forms
	------------------------->

<!--map editing form -->
<div id="editmapform" style="display:none;">
    <h3>Map Tools</h3>
    <form action="javascript:;" name="mapform" id="mapform">
			<input name="save_map" type="hidden" size="25" value="true">
		   	<input name="gmap_id" id="gmap_id" type="hidden" size="25" value="">
			<table class="data" id="mapdata">
        	<tr><td width="180px">Title</td><td><input name="title" id="map_title" type="text" size="40" value=""></td></tr>
        	<tr><td>Description</td><td><input name="map_desc" id="map_desc" type="text" size="40" value=""></td></tr>
        	<tr>
					<td>Center Latitude</td>
					<td><input name="map_lat" id="map_lat"type="text" size="40" value=""></td>
				</tr>
        	<tr>
					<td>Center Longitude</td>
					<td><input name="map_lon" id="map_lon" type="text" size="40" value=""></td>
				</tr>
				<tr><td></td><td><a name="map_assist_btn" title="click a center!" href="javascript:addAssistant('map');">( Use Locating Assistant )</a></td></tr>
        	<tr><td>Width (use '0' for auto)</td><td><input name="map_w" id="map_w" type="text" size="12" value=""></td></tr>
        	<tr><td>Height</td><td><input name="map_h" id="map_h" type="text" size="12" value=""></td></tr>
        	<tr><td>Zoom Level</td><td><input name="map_z" id="map_z" type="text" size="12" value=""></td></tr>
        	<tr><td>Show Controls</td><td><select name="map_showcont" id="map_showcont">
              <option value="s" >Small</option>
              <option value="l" >Large</option>
              <option value="z" >Zoom Only</option>
              <option value="n" >None</option>
              </select></td></tr>
        	<tr><td>Show Scale</td><td><select name="map_showscale" id="map_showscale">
              <option value="TRUE" >Yes</option>
              <option value="FALSE" >No</option>
              </select></td></tr>
        	<tr><td>Show Map Type Buttons</td><td><select name="map_showtypecont" id="map_showtypecont">
              <option value="TRUE" >Yes</option>
              <option value="FALSE" >No</option>
              </select></td></tr>
        	<tr><td>Default Map Type</td><td><select name="map_type" id="map_type">
              <option value="G_MAP_TYPE" >Street Map</option>
              <option value="G_SATELLITE_TYPE" >Satellite</option>
              <option value="G_HYBRID_TYPE" >Hybrid</option>
       			</select></td></tr>
              <!-- Allow Comments <input name="map_comm" id="map_comm" type="checkbox" value=""><br/> //-->
            <tr><td></td><td><input type="button" name="save_map_btn" value="Submit" onclick="javascript:storeMap(document.mapform);"> 
						<input type="button" name="closemapform" value="Cancel" onclick="javascript:canceledit('editmapform');"></td>
				</tr>
			</table>
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
				<input name="save_maptype" type="hidden" value="true">
    		<table class="data" id="maptypeformdata_new">
  				<tr>
						<td>Name<br/>
							<input name="name" type="text" size="25" value="a name"><br/>
							Description<br/>
							<input name="description" type="text" size="25" value="a description"></td>
  					<td>Base Map Type<br/>
							<select name="basetype">
								<option value="0" >Street Map</option>
								<option value="1" >Satellite</option>
								<option value="2" >Hybrid</option>
							</select><br/>
							Alt Map Type<br/>
							<select name="alttype">
								<option value="0" >Street Map</option>
								<option value="1" >Satellite</option>
								<option value="2" >Hybrid</option>
							</select></td>
						<td>Map Tiles URL<br/>
							<input name="maptiles_url" type="text" size="25" value=""><br/>
							Low Res Map Tiles URL<br/>
							<input name="lowtiles_url" type="text" size="25" value="google"></td>
						<td>Hybrid Tiles URL<br/>
							<input name="hybridtiles_url" type="text" size="25" value="none"><br/>
							Low Res Hybrid Tiles URL<br/>
							<input name="lowhybridtiles_url" type="text" size="25" value="google"></td>
						<td>Copyright<br/>
							<input name="copyright" type="text" size="10" value=""><br/>
							Max Zoom<br/>
							<input name="maxzoom" type="text" size="3" value="0"></td>
						<td>Bounds<br/>
							<textarea name="bounds" style="width:120px" rows="3"></textarea></td>
						<td>ACTIONS<br/>
							<a name="save_maptype_btn" title="save" href="javascript:storeNewMapType(document.maptypeform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
    	</form>
  	</div>
		<div id="newmaptypecancel" style="clear:both;"><input type="button" name="closenewmaptypeform" value="Cancel Adding A New Map Type" onclick="javascript:canceledit('newmaptypeform');"></div>
</div> <!-- end of editmaptypeform -->


<div id="editmaptypeform" class="editform" style="display:none;">
		<h2>Map Types Associated With This Map</h2>		
		<div class="table" id="editmaptypetable_n" style="display:none;">
			<form action="javascript:;" name="maptypeform_n" id="maptypeform_n" style="display:none;">
				<input name="array_n" type="hidden" value="n">
				<input name="save_maptype" type="hidden" value="true">
				<input name="maptype_id" type="hidden" size="3" value="n">
    		<table class="data" id="maptypeformdata_n">
  				<tr>
						<td>Name<br/>
							<input name="name" type="text" size="25" value="a name"><br/>
							Description<br/>
							<input name="description" type="text" size="25" value="a description"></td>
  					<td>Base Map Type<br/>
							<select name="basetype">
								<option value="0" >Street Map</option>
								<option value="1" >Satellite</option>
								<option value="2" >Hybrid</option>
							</select><br/>
							Alt Map Type<br/>
							<select name="alttype">
								<option value="0" >Street Map</option>
								<option value="1" >Satellite</option>
								<option value="2" >Hybrid</option>
							</select></td>
						<td>Map Tiles URL<br/>
							<input name="maptiles_url" type="text" size="25" value=""><br/>
							Low Res Map Tiles URL<br/>
							<input name="lowtiles_url" type="text" size="25" value="google"></td>
						<td>Hybrid Tiles URL<br/>
							<input name="hybridtiles_url" type="text" size="25" value="none"><br/>
							Low Res Hybrid Tiles URL<br/>
							<input name="lowhybridtiles_url" type="text" size="25" value="google"></td>
						<td>Copyright<br/>
							<input name="copyright" type="text" size="10" value=""><br/>
							Max Zoom<br/>
							<input name="maxzoom" type="text" size="3" value="0"></td>
						<td>Bounds<br/>
							<textarea name="bounds" style="width:120px" rows="3"></textarea></td>
						<td>ACTIONS<br/>
							<a name="save_maptype_btn" title="save" href="javascript:storeMapType(document.maptypeform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
							<a name="locate_maptype_btn" title="show on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
							<a name="remove_maptype_btn" title="remove from this map" href="javascript:removeMapType(document.maptypeform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
							<a name="expunge_maptype_btn" title="delete the maptype!" href="javascript:expungeMapType(document.maptypeform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
					</tr>
    		</table>
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
		<a href="javascript:editIconStyles();">Edit Marker Icons</a>
</div>


<div id="newmarkersetform" class="editform" style="display:none;">
		<h2>Add a New Marker Set</h2>
    <div class="table" id="editmarkersettable_new">
    	<form action="javascript:;" name="markersetform_new" id="markersetform_new">
            <input name="save_markerset" type="hidden" value="true">
				<input name="style_id" type="hidden" value="0"><!-- Google (standard) -->
				<input name="icon_id" type="hidden" value="0" ><!-- Google (standard) -->
    		<table class="data">
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th width="160px">Map Display Settings</th>
						<th width="170px">Side Panel Display Settings</th>
						<th width="80px">ACTIONS</th>
					</tr>
					<tr class="gmapeditstrong">
						<td><input name="name" type="text" style="width:90%" value="a name"></td>
						<td><textarea name="description" style="width:90%" rows="2"></textarea></td>
						<td width="160px">Cluster: 
    									<select name="cluster">
                      					<option value="true">Yes</option>
                      					<option value="false" selected>No</option>
                          				</select><br/>
											Plot-On-Load: 
											<select name="plot_on_load">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select>
						<td width="170px">List Set: 
    									<select name="side_panel">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
											List Each Marker: 
											<select name="explode">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td width="80px"><a name="new_markerset_btn" title="save" href="javascript:storeNewMarkerSet(document.markersetform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></td>
					</tr>
				</table>
			</form>
		</div>
		<div id="newmarkersetcancel" style="clear:both;"><input type="button" name="closemarkersetform" value="Cancel New Marker Set" onclick="javascript:canceledit('newmarkersetform'); canceledit('editerror');"></div>
</div>
<!-- end of newmarkersetform -->



<div id="newmarkerform" class="editform" style="display:none;">
		<h2>Add a New Marker</h2>
    <div class="table" id="editmarkertable_new">
    	<form action="javascript:;" name="markerform_new" id="markerform_new">
				<input name="new_marker" type="hidden" value="true">
    		<table class="data">
    			<tr>
    				<th style="width:160px">Title </th>
    				<th style="width:160px">Latitude/Longitude</th>
    				<th style="width:160px">Label Text </th>
    				<th >Window Text </th>
    				<th style="width:80px">zIndex </th>
    				<th>Add to Set </th>
    				<th style="width:80px">ACTIONS </th>
    			</tr>
					<tr class="gmapeditstrong">
						<td width="160px"><input name="title" type="text" style="width:90%" value="a title"></td>
						<td width="160px"><input name="marker_lat" type="text" style="width:90%" value=""><br/>
							<input name="marker_lon" type="text" style="width:90%" value=""><br/>
							<a name="marker_assist_btn" title="click a location!" href="javascript:addAssistant('marker', 'new');">( Use Locating Assistant )</a></td>
						<td width="160px"><textarea name="marker_labeltext" style="width:90%" rows="1"></textarea></td>
						<td><textarea name="edit" style="width:90%" rows="3"></textarea></td>
						<td width="80px"><input name="marker_zi" type="text" size="3" value="0"></td>
						<td><select name="set_id" id="set_id">
								<option value="n">someset</option>
							</select></td>
						<td width="80px"><a name="new_marker_btn" title="save" href="javascript:storeNewMarker(document.markerform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
    	</form>
		</div>
		<div id="newmarkercancel" style="clear:both;"><input type="button" name="closemarkerform" value="Cancel New Marker" onclick="javascript:canceledit('newmarkerform'); removeAssistant(); canceledit('editerror');"></div>
</div> <!-- end of newmarkerform -->




<div id="editiconstylesmenu" style="display:none;">
		<a href="javascript:newIconStyle();">Add a New Icon Style</a>
</div>


<div id="newiconstyleform" class="editform" style="display:none;">
		<h2>Add a New Icon Style</h2>		
    		<div class="table" id="editiconstyletable_new">
    			<form action="javascript:;" name="iconstyleform_new" id="iconstyleform_new">
					<input name="save_iconstyle" type="hidden" value="true">
    			<table class="data" class="gmapeditstrong">
						<tr>
							<td>Name<br/><input name="name" type="text" size="15" value="a name"></td>
							<td>Type<br/><select name="type" onChange="javascript:toggleIconMenu(this.value, 'new');">
                                <option value="0">GIcon</option>
                                <option value="1">XIcon</option>
                             </select></td>
                		<td>Window Anchor X<br/><input name="infowindow_anchor_x" type="text" size="15" value="9"></td>
                		<td>Window Anchor Y<br/><input name="infowindow_anchor_y" type="text" size="15" value="2"></td>
							<td></td>
							<td></td>
                		<td>ACTIONS<br/><a name="new_iconstyle_btn" title="save" href="javascript:storeNewIconStyle(document.iconstyleform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></td>
						</tr>
                	<tr id="gicon_style_head_new">
                		<th colspan="7">GIcon Styles</th>
						</tr>
                	<tr id="gicon_style_menu1_new">
                		<td>Image <br/><input name="image" type="text" size="15" value="icons/flat_color_pins/205.png"></td>
                		<td>Rollover Image <br/><input name="rollover_image" type="text" size="15" value="icons/flat_color_pins/090.png"></td>
                		<td>Icon Width<br/><input name="icon_w" type="text" size="15" value="20"></td>
                		<td>Icon Height<br/><input name="icon_h" type="text" size="15" value="34"></td>
                		<td>Icon Anchor X<br/><input name="icon_anchor_x" type="text" size="15" value="9"></td>
                		<td>Icon Anchor Y<br/><input name="icon_anchor_y" type="text" size="15" value="34"></td>
						</tr>
                	<tr id="gicon_style_menu2_new">
							<td></td>
                		<td>Shadow Image <br/><input name="shadow_image" type="text" size="15" value="http://www.google.com/mapfiles/shadow50.png"></td>
                		<td>Shadow Width <br/><input name="shadow_w" type="text" size="15" value="37"></td>
                		<td>Shadow Height <br/><input name="shadow_h" type="text" size="15" value="34"></td>
                		<td>Shadow Anchor X<br/><input name="shadow_anchor_x" type="text" size="15" value="18"></td>
                		<td>Shadow Anchor Y<br/><input name="shadow_anchor_y" type="text" size="15" value="25"></td>
						</tr>
                	<tr id="xicon_style_head_new" style="display:none">
                		<th colspan="7">XIcon Styles</th>
						</tr>
                	<tr id="xicon_style_menu_new" style="display:none">			
                		<td>Points<br/><input name="points" type="text" size="15" value="0"></td>
                		<td>Scale<br/><input name="scale" type="text" size="15" value="1"></td>
                		<td>Outline Color (HEX)<br/><input name="outline_color" type="text" size="15" value="ffffff"></td>
                		<td>Outline Weight<br/><input name="outline_weight" type="text" size="15" value="2"></td>
                		<td>Fill Color<br/><input name="fill_color" type="text" size="15" value="ff3300"></td>
                		<td>Fill Opacity<br/><input name="fill_opacity" type="text" size="15" value=".5"></td
						</tr>
    			</table>
    			</form>
  		  </div>
		<div id="newiconstylecancel" style="clear:both;"><input type="button" name="closeiconstyleform" value="Cancel New Icon Style" onclick="javascript:canceledit('newiconstyleform'); canceledit('editerror');"></div>
</div>
<!-- end of newiconstyleform -->


<div id="editiconstyleform" class="editform" style="display:none;">
		<h2>Icon Styles Associated with Marker Sets on This Map</h2>		
		<div class="table" id="editiconstyletable_n">
			<form action="javascript:;" name="iconstyleform_n" id="iconstyleform_n" style="display:none;">
				<input name="save_iconstyle" type="hidden" value="true">
				<input name="style_array_n" type="hidden" value="n">
				<input name="icon_id" type="hidden" value="n">
				<table class="data" id="iconstyleformdata_n">
					<tr>
						<td>Name<br/><input name="name" type="text" size="15" value=""></td>
						<td>Type<br/><select name="type" onChange="javascript:toggleIconMenu(this.value, this.form.icon_id.value);">
                                <option value="0">GIcon</option>
                                <option value="1">XIcon</option>
                             </select></td>
                	<td>Window Anchor X<br/><input name="infowindow_anchor_x" type="text" size="15" value="9"></td>
                	<td>Window Anchor Y<br/><input name="infowindow_anchor_y" type="text" size="15" value="2"></td>
						<td></td>
						<td></td>
                	<td>ACTIONS<br/><a style="float:left; padding:0 .4em;" name="save_iconstyle_btn" title="save" href="javascript:storeIconStyle(document.iconstyleform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></td>
					</tr>
                <tr id="gicon_style_head_new">
                	<th colspan="7">GIcon Styles</th>
					</tr>
                <tr id="gicon_style_menu1_new">
                	<td>Image <br/><input name="image" type="text" size="15" value=""></td>
                	<td>Rollover Image <br/><input name="rollover_image" type="text" size="15" value=""></td>
                	<td>Icon Width<br/><input name="icon_w" type="text" size="15" value=""></td>
                	<td>Icon Height<br/><input name="icon_h" type="text" size="15" value=""></td>
                	<td>Icon Anchor X<br/><input name="icon_anchor_x" type="text" size="15" value=""></td>
                	<td>Icon Anchor Y<br/><input name="icon_anchor_y" type="text" size="15" value=""></td>
					</tr>
                <tr id="gicon_style_menu2_new">
						<td></td>
                	<td>Shadow Image <br/><input name="shadow_image" type="text" size="15" value=""></td>
                	<td>Shadow Width <br/><input name="shadow_w" type="text" size="15" value=""></td>
               		<td>Shadow Height <br/><input name="shadow_h" type="text" size="15" value=""></td>
               		<td>Shadow Anchor X<br/><input name="shadow_anchor_x" type="text" size="15" value=""></td>
               		<td>Shadow Anchor Y<br/><input name="shadow_anchor_y" type="text" size="15" value=""></td>
					</tr>
               	<tr id="xicon_style_head_new" style="display:none">
               		<th colspan="7">XIcon Styles</th>
					</tr>
               	<tr id="xicon_style_menu_new" style="display:none">			
               		<td>Points<br/><input name="points" type="text" size="15" value=""></td>
               		<td>Scale<br/><input name="scale" type="text" size="15" value=""></td>
               		<td>Outline Color (HEX)<br/><input name="outline_color" type="text" size="15" value=""></td>
               		<td>Outline Weight<br/><input name="outline_weight" type="text" size="15" value=""></td>
               		<td>Fill Color<br/><input name="fill_color" type="text" size="15" value=""></td>
               		<td>Fill Opacity<br/><input name="fill_opacity" type="text" size="15" value=""></td
					</tr>
				</table>
			</form>
		</div>
</div> <!-- end of editiconstylesform -->

<div id="editiconstylescancel" style="display:none; clear:both;"><input type="button" name="closeiconstylesform" value="Cancel Editing Icon Styles" onclick="javascript:canceledit('editiconstylesmenu'); canceledit('newiconstyleform'); canceledit('editiconstyleform'); canceledit('editiconstylescancel');"></div>
<!--end icon style editing forms -->



<div id="editmarkerstylesmenu" style="display:none;">
		<a href="javascript:newMarkerStyle();">Add a New Marker Style</a>
</div>


<div id="newmarkerstyleform" class="editform" style="display:none;">
		<h2>Add a New Marker Style</h2>		
		<div class="table" id="editmarkerstyletable_new">
			<form action="javascript:;" name="markerstyleform_new" id="markerstyleform_new">
				<input name="save_markerstyle" type="hidden" value="true">
    		<table class="data">
					<tr>
    				<th width="110px">Name </th>
    				<th width="90px">Type </th>
    				<th width="150px">Label Hover Opacity (%)</th>
    				<th width="120px">Label Opacity (%)</th>
    				<th>Label Hover Styles (CSS)</th>
    				<th>Window Styles (CSS)</th>
    				<th width="80px">ACTION </th>
					</tr>
					<tr class="gmapeditstrong">
  					<td width="110px"><input name="name" type="text" style="width:90%" value="a name"></td>
  					<td width="90px"><select name="type">
  							<option value="0">GMarker</option>
  							<option value="1">PdMarker</option>
  							<option value="2">XMarker</option>
  							</select></td>
  					<td width="150px"><input name="label_hover_opacity" type="text" size="5" value="70"></td>
  					<td width="120px"><input name="label_opacity" type="text" size="5" value="100"></td>
  					<td><textarea name="label_hover_styles" style="width:90%" rows="3"></textarea></td>
  					<td><textarea name="window_styles" style="width:90%" rows="3"></textarea></td>
  					<td width="80px"><a name="new_markerstyle_btn" title="save" href="javascript:storeNewMarkerStyle(document.markerstyleform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
			</form>
		</div>
		<div id="newmarkerstylecancel" style="clear:both;"><input type="button" name="closemarkerstyleform" value="Cancel New Marker Style" onclick="javascript:canceledit('newmarkerstyleform'); canceledit('editerror');"></div>
</div>
<!-- end of newmarkerstyleform -->


<div id="editmarkerstyleform" class="editform" style="display:none;">
		<h2>Marker Styles Associated with Marker Sets on This Map</h2>
		<table>
			<tr>
    		<th width="110px">Name </th>
    		<th width="90px">Type </th>
    		<th width="150px">Label Hover Opacity (%)</th>
    		<th width="120px">Label Opacity (%)</th>
    		<th>Label Hover Styles (CSS)</th>
    		<th>Window Styles (CSS)</th>
    		<th width="80px">ACTION </th>
			</tr>
		</table>
		<div class="table" id="editmarkerstyletable_n">
			<form action="javascript:;" name="markerstyleform_n" id="markerstyleform_n" style="display:none;">
  			<input name="save_markerstyle" type="hidden" value="true">
  			<input name="style_array_n" type="hidden" value="true">
  			<input name="style_id" type="hidden" value="n">
    		<table class="data" id="markerstyleformdata_n">
					<tr>
  					<td width="110px"><input name="name" type="text" style="width:90%" value=""></td>
  					<td width="90px"><select name="type">
								<option value="0">GMarker</option>
								<option value="1">PdMarker</option>
								<option value="2">XMarker</option>
								</select></td>
  					<td width="150px"><input name="label_hover_opacity" type="text" size="5" value="70"></td>
  					<td width="120px"><input name="label_opacity" type="text" size="5" value="100"></td>
  					<td><textarea name="label_hover_styles" style="width:90%" rows="3"></textarea></td>
  					<td><textarea name="window_styles" style="width:90%" rows="3"></textarea></td>
  					<td width="80px"><a name="save_markerstyle_btn" title="save" href="javascript:storeMarkerStyle(document.markerstyleform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
			</form>
		</div>
</div> <!-- end of editmarkerstylesform -->

<div id="editmarkerstylescancel" style="display:none; clear:both;"><input type="button" name="closemarkerstylesform" value="Cancel Editing Marker Styles" onclick="javascript:canceledit('editmarkerstylesmenu'); canceledit('newmarkerstyleform'); canceledit('editmarkerstyleform'); canceledit('editmarkerstylescancel');"></div>
<!--end marker style editing forms -->




<div id="editmarkerform" class="editform" style="display:none;">
		<h2>Marker Sets Associated With This Map</h2>
		<table>
			<tr>
				<th style="width:160px">Name</th>
				<th style="width:160px">Style</th>
				<th style="width:160px">Icon</th>
				<th style="width:80px">Custer</th>
				<th style="width:80px">Plot-on-Load</th>
				<th style="width:80px">List Set</th>
				<th style="width:80px">List Markers</th>
				<th style="width:80px">ACTIONS</th>
			</tr>
		</table>
		<div id="markerset_n" style="display:none; clear:both;">
			<form action="javascript:;" name="markersetform_n" id="markersetform_n" style="display:none;">
  			<input name="set_id" type="hidden" value="n">
            <input name="set_array_n" type="hidden" value="n">
    		<table class="data" id="markersetformdata_n">
					<tr class="gmapeditstrong" >
						<td style="width:160px"><b>Set Name:</b> <!-- <span id="setdesc">Description Here</span> --></td>
						<td style="width:160px"><select name="style_id">
                  					<option value="0">Google (standard)</option>
                      				</select></td>
						<td style="width:160px"><select name="icon_id">
                                      <option value="0">Google (standard)</option>
                                   	</select></td>
						<td style="width:80px"><select name="cluster">
                      					<option value="true">Yes</option>
                      					<option value="false" selected>No</option>
                          				</select></td>
						<td style="width:80px"><select name="plot_on_load">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td style="width:80px"><select name="side_panel">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td style="width:80px"><select name="explode">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td style="width:80px">
							<a id="setstore" href="javascript:storeMarkerSet(markersetform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a> 
							<a id="setremove" href="javascript:removeMarkerSet(markersetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a> 
							<a id="setdelete" href="javascript:expungeMarkerSet(markersetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
					</tr>
					<tr>
						<td colspan="5"><a id="seteditmarkers" href="javascript:editSet('n');">Edit The Markers In This Set</a> | 
							<a id="setaddmarkers" href="javascript:alert('feature coming soon');">Add Markers from Archives</a></td>
					</tr>
				</table>
			</form>
			<div id="setform_n" style="display:none;">
				<h3>Markers In This Set</h3>
            <table>
					<tr>
						<th style="width:160px">Title </th>
						<th style="width:160px">Latitude/Longitude</th>
						<th style="width:160px">Label Text </th>
						<th>Window Text </th>
						<th style="width:80px">zIndex </th>
						<th style="width:80px">ACTIONS </th>
					</tr>
        	</table>
				<div class="table" id="editmarkertable_n">
					<form action="javascript:;" name="markerform_n" id="markerform_n" style="display:none;">
						<input name="save_marker" type="hidden" value="true">
						<input name="set_id" type="hidden" size="3" value="n">
						<input name="marker_id" type="hidden" size="3" value="n">
						<input name="marker_array_n" type="hidden" value="">
        			<table class="data" id="formdata_n">
							<tr>
								<td style="width:160px"><input name="title" type="text" style="width:90%" value="a title"></td>
								<td style="width:160px"><input name="marker_lat" type="text" style="width:90%" value=""><br/>
									<input name="marker_lon" type="text" style="width:90%" value=""><br/>
									<a name="marker_assist_btn" title="click a location!" href="javascript:addAssistant('marker', 'n');">( Use Locating Assistant )</a></td>
								<td style="width:160px"><textarea name="marker_labeltext" style="width:90%" rows="3"></textarea></td>
								<td><textarea name="edit" style="width:90%" rows="3"></textarea></td>
								<td style="width:80px"><input name="marker_zi" type="text" size="3" value="0"></td>
								<td style="width:80px">
                				<a name="save_marker_btn" title="save" href="javascript:storeMarker(document.markerform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
                				<a name="locate_marker_btn" title="locate on the map" href="javascript:bMData[marker_array_n].marker.openInfoWindowHtml(bMData[marker_array_n].marker.my_html);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
                				<a name="remove_marker_btn" title="remove from this set" href="javascript:removeMarker(document.markerform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
                				<a name="expunge_marker_btn" title="delete the marker!" href="javascript:expungeMarker(document.markerform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
							</tr>
						</table>
        		</form>
				</div>
      		<div id="allavailmarkers_n" style="display:none; clear:both;">
    			<h3>All Markers Available</h3>
        		<div class="table" id="addmarkertable_n">
        			<form action="javascript:;" name="addmarkerform_n" id="addmarkerform_n">
        			<div class="data">
						<!-- @todo this is just placeholder stuff as a starting point -->
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
		<a href="javascript:editPolylineStyles();">Edit Polyline Styles</a> | 
</div>

<div id="newpolylinesetform" class="editform" style="display:none;">
		<h2>Add a New Polyline Set</h2>		
    	<div class="table" id="editpolylinesettable_new">
    		<form action="javascript:;" name="polylinesetform_new" id="polylinesetform_new">
    			<div class="data">
          			<input name="save_polylineset" type="hidden" value="true">
          			<div style="float:left; padding:0 .4em; width:90px">
							New: <input name="name" type="text" size="15" value="a name">
						</div>
          			<div style="float:left; padding:0 .4em; width:140px">
							Description: <textarea name="description" cols="15" rows="3"></textarea>
						</div>
          			<div style="float:left; padding:0 .4em; width:140px">
							Style: <select name="style_id" id="style_id">
                                    	<option value="0" >Google (standard)</option>
                                      	</select>
						</div>
                	<div style="float:left; padding:0 .4em; width:200px">
    					Plot-On-Load: <select name="plot_on_load">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
    					Side: <select name="side_panel">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
    					List: <select name="explode">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
						</div>
          			<div style="float:left; padding:0 .4em; width:70px">
							ACTION:<br/><a name="new_polylineset_btn" title="save" href="javascript:storeNewPolylineSet(document.polylinesetform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
						</div>
    			</div>
    		</form>
			</div>
		<div id="newpolylinesetcancel" style="clear:both;"><input type="button" name="closepolylinesetform" value="Cancel New Polyline Set" onclick="javascript:canceledit('newpolylinesetform'); canceledit('editerror');"></div>
</div>
<!-- end of newpolylinesetform -->




<div id="editpolylinestylesmenu" style="display:none;">
		<a href="javascript:newPolylineStyle();">Add a New Polyline Style</a>
</div>


<div id="newpolylinestyleform" class="editform" style="display:none;">
		<h2>Add a New Polyline Style</h2>		
    		<div class="table" id="editpolylinestyletable_new">
    			<form action="javascript:;" name="polylinestyleform_new" id="polylinestyleform_new">
    			<div class="data">
                	<div style="float:left; padding:0 .4em; width:10px">
							<input name="save_polylinestyle" type="hidden" value="true">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
							Name <br/><input name="name" type="text" size="15" value="a name"><br/>
							Type <br/><select name="type">
                                <option value="0">Google Default</option>
                                <option value="1">XPolyline</option>
                             </select><br/>
                     	Color <br/><input name="color" type="text" size="15" value="ff3300"><br/>
                     	Weight <br/><input name="weight" type="text" size="15" value="2"><br/>
                     	Opacity <br/><input name="opacity" type="text" size="15" value=".75"><br/>
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
							Pattern <br/><input name="pattern" type="text" size="15" value=""><br/>
                        Segment Count <br/><input name="segment_count" type="text" size="15" value=""><br/>
                		Text Every <br/><input name="text_every" type="text" size="15" value="">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
                		Begin Arrow <br/><select name="begin_arrow">
                        				<option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		End Arrow <br/><select name="end_arrow">
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		Arrow Every <br/><input name="arrows_every" type="text" size="15" value=""><br/>
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
                    	Text FG Color <br/><input name="text_fgstyle_color" type="text" size="15" value="ffffff"><br/>
                    	Text FG Weight <br/><input name="text_fgstyle_weight" type="text" size="15" value="1"><br/>
                    	Text FG Opacity <br/><input name="text_fgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text FG zIndex <br/><input name="text_fgstyle_zindex" type="text" size="15" value="0">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
                    	Text BG Color <br/><input name="text_bgstyle_color" type="text" size="15" value="ff3300"><br/>
                    	Text BG Weight <br/><input name="text_bgstyle_weight" type="text" size="15" value="2"><br/>
                    	Text BG Opacity <br/><input name="text_bgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text BG xIndex <br/><input name="text_bgstyle_zindex" type="text" size="15" value="0">
						</div>
                	<div style="float:left; padding:0 .4em; width:70px">ACTIONS<br/><a name="new_polylinestyle_btn" title="save" href="javascript:storeNewPolylineStyle(document.polylinestyleform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
    			</div>
    			</form>
  		  </div>
		<div id="newpolylinestylecancel" style="clear:both;"><input type="button" name="closepolylinestyleform" value="Cancel New Polyline Style" onclick="javascript:canceledit('newpolylinestyleform'); canceledit('editerror');"></div>
</div>
<!-- end of newpolylinestyleform -->


<div id="editpolylinestyleform" class="editform" style="display:none;">
		<h2>Polyline Styles Associated with Polyline Sets on This Map</h2>		
      		<div class="table" id="editpolylinestyletable_n">
      			<form action="javascript:;" name="polylinestyleform_n" id="polylinestyleform_n" style="display:none;">
      			<div class="data" id="polylinestyleformdata_n">
                	<div style="float:left; padding:0 .4em; width:10px">
							<input name="save_polylinestyle" type="hidden" value="true">
                        <input name="style_array_n" type="hidden" value="n">
                        <input name="style_id" type="hidden" value="n">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
							Name <br/><input name="name" type="text" size="15" value="a name"><br/>
							Type <br/><select name="type">
                                <option value="0">Google Default</option>
                                <option value="1">XPolyline</option>
                             </select><br/>
                     	Color <br/><input name="color" type="text" size="15" value="ff3300"><br/>
                     	Weight <br/><input name="weight" type="text" size="15" value="2"><br/>
                     	Opacity <br/><input name="opacity" type="text" size="15" value=".75"><br/>
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
							Pattern <br/><input name="pattern" type="text" size="15" value=""><br/>
                        Segment Count <br/><input name="segment_count" type="text" size="15" value=""><br/>
                		Text Every <br/><input name="text_every" type="text" size="15" value="">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
                		Begin Arrow <br/><select name="begin_arrow">
                        				<option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		End Arrow <br/><select name="end_arrow">
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		Arrow Every <br/><input name="arrows_every" type="text" size="15" value=""><br/>
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
                    	Text FG Color <br/><input name="text_fgstyle_color" type="text" size="15" value="ffffff"><br/>
                    	Text FG Weight <br/><input name="text_fgstyle_weight" type="text" size="15" value="1"><br/>
                    	Text FG Opacity <br/><input name="text_fgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text FG zIndex <br/><input name="text_fgstyle_zindex" type="text" size="15" value="0">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
                    	Text BG Color <br/><input name="text_bgstyle_color" type="text" size="15" value="ff3300"><br/>
                    	Text BG Weight <br/><input name="text_bgstyle_weight" type="text" size="15" value="2"><br/>
                    	Text BG Opacity <br/><input name="text_bgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text BG xIndex <br/><input name="text_bgstyle_zindex" type="text" size="15" value="0">
						</div>
                	ACTIONS<br/><a style="float:left; padding:0 .4em;" name="save_polylinestyle_btn" title="save" href="javascript:storePolylineStyle(document.polylinestyleform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
      			</div>
      			</form>
    		  </div>
</div> <!-- end of editpolylinestylesform -->

<div id="editpolylinestylescancel" style="display:none; clear:both;"><input type="button" name="closepolylinestylesform" value="Cancel Editing Polyline Styles" onclick="javascript:canceledit('editpolylinestylesmenu'); canceledit('newpolylinestyleform'); canceledit('editpolylinestyleform'); canceledit('editpolylinestylescancel');"></div>
<!--end polyline style editing forms -->




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
          	<div style="float:left; padding:0 .4em; width:70px"><a name="new_polyline_btn" title="save" href="javascript:storeNewPolyline(document.polylineform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
          	<a style="float:left; padding:0 .4em;" name="polyline_assist_btn" title="draw the line!" href="javascript:addAssistant('polyline', 'new');">Use Drawing Assistant</a>
    			</div>
    			</form>
  		  </div>
		<div id="newpolylinecancel" style="clear:both;"><input type="button" name="closepolylineform" value="Cancel New Polyline" onclick="javascript:canceledit('newpolylineform'); removeAssistant(); canceledit('editerror');"></div>
</div> <!-- end of newpolylineform -->





<div id="editpolylineform" class="editform" style="display:none;">
		<h2>Polyline Sets Associated With This Map</h2>
		<div id="polylineset_n" style="display:none; clear:both;">
    	<form action="javascript:;" name="polylinesetform_n" id="polylinesetform_n" style="display:none;">
				<input name="set_id" type="hidden" size="3" value="n">
            <input name="set_array_n" type="hidden" value="n">
  			<div class="data" id="polylinesetformdata_n">
    			<b id="plsetname">Set Name:</b> <span id="plsetdesc">Description Here</span><br/>
  				<a id="plsetedit" href="javascript:editPolylineSet('n');">Edit These Polylines</a> | 
    			<a id="plsetadd" href="javascript:alert('feature coming soon');">Add Polylines from Archives</a> | 
					Style: <select name="style_id">
                  				<option value="0">Google (standard)</option>
                      			</select> | 
					Plot-On-Load: <select name="plot_on_load">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select> | 
					Side: <select name="side_panel">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select> | 
					List: <select name="explode">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select> | 
    			<a id="plsetstore" href="javascript:storePolylineSet(document.polylinesetform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a> 
  				<a id="plsetremove" href="javascript:removePolylineSet(document.polylinesetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a> 
  				<a id="plsetdelete" href="javascript:expungePolylineSet(document.polylinesetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a><br/>
  			</div>
        </form>
			<div id="plsetform_n" style="display:none;">
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
                		<a style="float:left; padding:0 .4em;" name="save_polyline_btn" title="save" href="javascript:storePolyline(document.polylineform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
                		<a style="float:left; padding:0 .4em;" name="locate_polyline_btn" title="locate on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
                		<a style="float:left; padding:0 .4em;" name="remove_polyline_btn" title="remove from this set" href="javascript:removePolyline(document.polylineform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
                		<a style="float:left; padding:0 .4em;" name="expunge_polyline_btn" title="delete the polyline!" href="javascript:expungePolyline(document.polylineform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a>
                		<a style="float:left; padding:0 .4em;" name="polyline_assist_btn" title="draw the line!" href="javascript:addAssistant('polyline', n);">Use Drawing Assistant</a>
        			</div>
    			</form>
  		  </div>
      	<div id="allavailpolylines_n" style="display:none; clear:both;">
    			<h3>All Polylines Available</h3>
        		<div class="table" id="addpolylinetable_n">
            		<form action="javascript:;" name="addpolylineform_n" id="addpolylineform_n">
                		<div class="data">
        						<!-- @todo this is just placeholder for table of polyline data -->
                		</div>
            		</form>	
    			</div>						
				</div>
			</div> <!--end of polylinesetform_n -->			
		</div> <!-- end of polylineset_n -->
</div> <!-- end of editpolylineform -->

<div id="editpolylinecancel" style="display:none; clear:both;"><input type="button" name="closepolylineform" value="Cancel Editing Polylines" onclick="javascript:cancelPolylineEdit(); canceledit('newpolylinesetform'); canceledit('editerror');"></div>
<!--end polyline editing forms -->







<!-------------------------
	-  Polygon Editing Forms
	------------------------->

<!--polygon editing forms -->
<div id="editpolygonmenu" style="display:none;">
		<a href="javascript:newPolygon();">New Polygon</a> | 
		<a href="javascript:newPolygonSet();">New Polygon Set</a> | 
		<a href="javascript:editPolygonStyles();">Edit Polygon Styles</a> | 
</div>

<div id="newpolygonsetform" class="editform" style="display:none;">
		<h2>Add a New Polygon Set</h2>		
    	<div class="table" id="editpolygonsettable_new">
    		<form action="javascript:;" name="polygonsetform_new" id="polygonsetform_new">
    			<div class="data">
          			<input name="save_polygonset" type="hidden" value="true">
          			<div style="float:left; padding:0 .4em; width:90px">
							New: <input name="name" type="text" size="15" value="a name">
						</div>
          			<div style="float:left; padding:0 .4em; width:140px">
							Description: <textarea name="description" cols="15" rows="3"></textarea>
						</div>
          			<div style="float:left; padding:0 .4em; width:140px">
							Fill Style: <select name="style_id" id="style_id">
                                    	<option value="0" >XPolygon (default)</option>
                                      	</select><br/>
							Line Style:	<select name="polylinestyle_id" id="polylinestyle_id">
											<option value="0" >Google (default)</option>
											</select>
						</div>
                	<div style="float:left; padding:0 .4em; width:200px">
    					Plot-On-Load: <select name="plot_on_load">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
    					Side: <select name="side_panel">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
    					List: <select name="explode">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
						</div>
						<div style="float:left; padding:0 .4em; width:70px">
							ACTION: <a name="new_polygonset_btn" title="save" href="javascript:storeNewPolygonSet(document.polygonsetform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
						</div>
    			</div>
    		</form>
			</div>
		<div id="newpolygonsetcancel" style="clear:both;"><input type="button" name="closepolygonsetform" value="Cancel New Polygon Set" onclick="javascript:canceledit('newpolygonsetform'); canceledit('editerror');"></div>
</div>
<!-- end of newpolygonsetform -->




<div id="editpolygonstylesmenu" style="display:none;">
		<a href="javascript:newPolygonStyle();">Add a New Polygon Style</a>
</div>


<div id="newpolygonstyleform" class="editform" style="display:none;">
		<h2>Add a New Polygon Style</h2>		
    		<div class="table" id="editpolygonstyletable_new">
    			<form action="javascript:;" name="polygonstyleform_new" id="polygonstyleform_new">
    			<div class="data">
                	<div style="float:left; padding:0 .4em; width:10px">
							<input name="save_polygonstyle" type="hidden" value="true">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
							Name <br/><input name="name" type="text" size="15" value="a name"><br/>
							Type <br/><select name="type">
                                <option value="0">XPolygon</option>
                             </select><br/>
                     	Color <br/><input name="color" type="text" size="15" value="ff3300"><br/>
                     	Weight <br/><input name="weight" type="text" size="15" value="2"><br/>
                     	Opacity <br/><input name="opacity" type="text" size="15" value=".75"><br/>
						</div>
                	<div style="float:left; padding:0 .4em; width:70px">ACTIONS<br/><a name="new_polygonstyle_btn" title="save" href="javascript:storeNewPolygonStyle(document.polygonstyleform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
    			</div>
    			</form>
  		  </div>
		<div id="newpolygonstylecancel" style="clear:both;"><input type="button" name="closepolygonstyleform" value="Cancel New Polygon Style" onclick="javascript:canceledit('newpolygonstyleform'); canceledit('editerror');"></div>
</div>
<!-- end of newpolygonstyleform -->


<div id="editpolygonstyleform" class="editform" style="display:none;">
		<h2>Polygon Styles Associated with Polygon Sets on This Map</h2>		
      		<div class="table" id="editpolygonstyletable_n">
      			<form action="javascript:;" name="polygonstyleform_n" id="polygonstyleform_n" style="display:none;">
      			<div class="data" id="polygonstyleformdata_n">
                	<div style="float:left; padding:0 .4em; width:10px">
							<input name="save_polygonstyle" type="hidden" value="true">
                        <input name="style_array_n" type="hidden" value="n">
                        <input name="style_id" type="hidden" value="n">
						</div>
                	<div style="float:left; padding:0 .4em; width:120px">
							Name <br/><input name="name" type="text" size="15" value="a name"><br/>
							Type <br/><select name="type">
                                <option value="0">XPolygon</option>
                             </select><br/>
                     	Color <br/><input name="color" type="text" size="15" value="ff3300"><br/>
                     	Weight <br/><input name="weight" type="text" size="15" value="2"><br/>
                     	Opacity <br/><input name="opacity" type="text" size="15" value=".75"><br/>
						</div>
                	ACTIONS<br/><a style="float:left; padding:0 .4em;" name="save_polygonstyle_btn" title="save" href="javascript:storePolygonStyle(document.polygonstyleform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
      			</div>
      			</form>
    		  </div>
</div> <!-- end of editpolygonstylesform -->

<div id="editpolygonstylescancel" style="display:none; clear:both;"><input type="button" name="closepolygonstylesform" value="Cancel Editing Polygon Styles" onclick="javascript:canceledit('editpolygonstylesmenu'); canceledit('newpolygonstyleform'); canceledit('editpolygonstyleform'); canceledit('editpolygonstylescancel');"></div>
<!--end polygon style editing forms -->




<div id="newpolygonform" class="editform" style="display:none;">
		<h2>Add a New Polygon</h2>		
        <div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Shape </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Points Data </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Circle Center </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Radius </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Border Text </div>
    				<div style="float:left; padding:0 .4em; width:50px"> zIndex </div>
    				<div style="float:left; padding:0 .4em; width:50px"> Set </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>						
    		</div>
    		<div class="table" id="editpolygontable_new">
    			<form action="javascript:;" name="polygonform_new" id="polygonform_new">
    			<div class="data">
                	<div style="float:left; padding:0 .4em; width:10px"><input name="new_polygon" type="hidden" value="true"></div>
                	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value="a name"></div>
                	<div style="float:left; padding:0 .4em; width:90px"><select name="circle" >
                                                                        <option value="false" >Polygon </option>
                                                                        <option value="true" >Circle</option>
                                                							   			</select></div>
                	<div style="float:left; padding:0 .4em; width:140px"><textarea name="points_data" cols="15" rows="3"></textarea></div>
                	<div style="float:left; padding:0 .4em; width:90px"><input name="circle_center" type="text" size="15"></div>
                	<div style="float:left; padding:0 .4em; width:90px"><input name="radius" type="text" size="15" value="0"></div>
                	<div style="float:left; padding:0 .4em; width:140px"><input name="border_text" type="text" size="15" value=""></div>
                	<div style="float:left; padding:0 .4em; width:50px"><input name="zindex" type="text" size="3" value="0"></div>
                	<div style="float:left; padding:0 .4em; width:90px"><select name="set_id" id="polygonset_id">
                                                                        <option value="n" >someset</option>
                                                							   			</select></div>
                	<div style="float:left; padding:0 .4em; width:70px"><a name="new_polygon_btn" title="save" href="javascript:storeNewPolygon(document.polygonform_new);">{biticon ipackage=liberty iname="save" iexplain="save"}</a></div>
                	<a style="float:left; padding:0 .4em;" name="polygon_assist_btn" title="draw the line!" href="javascript:addAssistant('polygon', 'new');">Use Drawing Assistant</a>
    			</div>
    			</form>
  		  </div>
		<div id="newpolygoncancel" style="clear:both;"><input type="button" name="closepolygonform" value="Cancel New Polygon" onclick="javascript:canceledit('newpolygonform'); removeAssistant(); canceledit('editerror');"></div>
</div> <!-- end of newpolygonform -->





<div id="editpolygonform" class="editform" style="display:none;">
		<h2>Polygon Sets Associated With This Map</h2>
		<div id="polygonset_n" style="display:none; clear:both;">
    	<form action="javascript:;" name="polygonsetform_n" id="polygonsetform_n" style="display:none;">
  			<div class="data" id="polygonsetformdata_n">
					<input name="set_id" type="hidden" size="3" value="n">
            	<input name="set_array_n" type="hidden" value="n">
    			<b id="pgsetname">Set Name:</b> <span id="pgsetdesc">Description Here</span><br/>
  				<a id="pgsetedit" href="javascript:editPolygonSet('n');">Edit These Polygons</a> | 
    			<a id="pgsetadd" href="javascript:alert('feature coming soon');">Add Polygons from Archives</a> | 
					FillStyle: <select name="style_id">
                  				<option value="0">XPolygon (default)</option>
                      			</select> | 
					LineStyle: <select name="polylinestyle_id">
                  				<option value="0">Google (default)</option>
                      			</select> | 
					Plot-On-Load: <select name="plot_on_load">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select> | 
					Side: <select name="side_panel">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select> | 
					List: <select name="explode">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select> | 
    			<a id="pgsetstore" href="javascript:storePolygonSet(document.polygonsetform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a> 
  				<a id="pgsetremove" href="javascript:removePolygonSet(document.polygonsetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a> 
  				<a id="pgsetdelete" href="javascript:expungePolygonSet(document.polygonsetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a><br/>
  			</div>
        </form>
			<div id="pgsetform_n" style="display:none;">
				<h3>Polygons In This Set</h3>
        	<div class="tableheader">
    				<div style="float:left; padding:0 .4em; width:90px"> Name </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Shape </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Points Data </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Circle Center </div>
    				<div style="float:left; padding:0 .4em; width:90px"> Radius </div>
    				<div style="float:left; padding:0 .4em; width:140px"> Border Text <br/>only for XPolygon type</div>
    				<div style="float:left; padding:0 .4em; width:50px"> zIndex </div>
    				<div style="float:left; padding:0 .4em; width:70px"> ACTION </div>						
    		</div>
    		<div class="table" id="editpolygontable_n">
    			<form action="javascript:;" name="polygonform_n" id="polygonform_n" style="display:none;">
        			<div class="data" id="polygonformdata_n">
      					<div style="float:left; padding:0 .4em; width:90px"><input name="save_polygon" type="hidden" value="true"></div>
                		<div style="float:left; padding:0 .4em; width:30px"><input name="set_id" type="hidden" size="3" value="n"></div>
            			<div style="float:left; padding:0 .4em; width:30px"><input name="polygon_id" type="hidden" size="3" value="n"></div>
                    	<div style="float:left; padding:0 .4em; width:90px"><input name="name" type="text" size="15" value=""></div>
                    	<div style="float:left; padding:0 .4em; width:90px"><select name="circle" >
                                                                            <option value="false" >Polygon </option>
                                                                            <option value="true" >Circle</option>
                                                    							   			</select></div>
                    	<div style="float:left; padding:0 .4em; width:140px"><textarea name="points_data" cols="15" rows="3"></textarea></div>
                    	<div style="float:left; padding:0 .4em; width:140px"><input name="circle_center" type="text" size="15" value="new"></div>
                    	<div style="float:left; padding:0 .4em; width:90px"><input name="radius" type="text" size="15" value="new"></div>
                		<div style="float:left; padding:0 .4em; width:140px"><input name="border_text" type="text" size="15" value=""></div>
                		<div style="float:left; padding:0 .4em; width:50px"><input name="zindex" type="text" size="3" value="0"></div>
                		<div style="float:left; padding:0;"><input name="polygon_array" type="hidden" value=""></div>
                		<div style="float:left; padding:0;"><input name="polygon_array_n" type="hidden" value=""></div>
                		<a style="float:left; padding:0 .4em;" name="save_polygon_btn" title="save" href="javascript:storePolygon(document.polygonform_n);">{biticon ipackage=liberty iname="save" iexplain="save"}</a>
                		<a style="float:left; padding:0 .4em;" name="locate_polygon_btn" title="locate on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
                		<a style="float:left; padding:0 .4em;" name="remove_polygon_btn" title="remove from this set" href="javascript:removePolygon(document.polygonform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
                		<a style="float:left; padding:0 .4em;" name="expunge_polygon_btn" title="delete the polygon!" href="javascript:expungePolygon(document.polygonform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a>
                		<a style="float:left; padding:0 .4em;" name="polygon_assist_btn" title="draw the line!" href="javascript:addAssistant('polygon', n);">Use Drawing Assistant</a>
        			</div>
    			</form>
  		  </div>
      	<div id="allavailpolygons_n" style="display:none; clear:both;">
    			<h3>All Polygons Available</h3>
        		<div class="table" id="addpolygontable_n">
            		<form action="javascript:;" name="addpolygonform_n" id="addpolygonform_n">
                		<div class="data">
        						<!-- @todo this is just placeholder for table of polygon data -->
                		</div>
            		</form>	
    			</div>						
				</div>
			</div> <!--end of polygonsetform_n -->			
		</div> <!-- end of polygonset_n -->
</div> <!-- end of editpolygonform -->

<div id="editpolygoncancel" style="display:none; clear:both;"><input type="button" name="closepolygonform" value="Cancel Editing Polygons" onclick="javascript:cancelPolygonEdit(); canceledit('newpolygonsetform'); canceledit('editerror');"></div>
<!--end polygon editing forms -->

