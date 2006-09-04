<div>
  <a id="emap" href="javascript:BitMap.EditSession.editMap();">Edit Map</a> | 
	<a id="emaptype" href="javascript:BitMap.EditSession.editMaptypes();">Edit Maptypes</a> |
  <a id="emarker" href="javascript:BitMap.EditSession.editMarkerSets();">Edit Markers</a> | 
  <a id="epolyline" href="javascript:BitMap.EditSession.editPolylines();">Edit Polylines</a> | 
  <a id="epolygon" href="javascript:BitMap.EditSession.editPolygons();">Edit Polygons</a>
</div>


<!-------------------------
	-   Map Editing Forms
	------------------------->

<!--map editing form -->
<div id="edit-map-table" style="display:none;">
    <h3>Map Properties</h3>
    <form action="javascript:;" name="edit-map-form" id="edit-map-form">
			<input name="save_map" type="hidden" size="25" value="true">
		  <input name="gmap_id" type="hidden" size="25" value="">
			<table class="data">
        	<tr><td width="180px">Title</td>
					<td><input name="title" type="text" size="40" value=""></td></tr>
        	<tr><td>Description</td><td><input name="map_desc" type="text" size="40" value=""></td></tr>
        	<tr>
					<td>Center Latitude</td>
					<td><input name="geo[lat]" type="text" size="40" value=""></td>
				</tr>
        	<tr>
					<td>Center Longitude</td>
					<td><input name="geo[lng]" type="text" size="40" value=""></td>
				</tr>
				<tr><td></td><td><a name="map_assist_btn" title="click a center!" href="javascript:BitMap.EditSession.addAssistant('map');">( Use Locating Assistant )</a></td></tr>
        	<tr><td>Width (use '0' for auto)</td><td><input name="map_w" type="text" size="12" value=""></td></tr>
        	<tr><td>Height</td><td><input name="map_h" type="text" size="12" value=""></td></tr>
        	<tr><td>Zoom Level</td><td><input name="map_z" type="text" size="12" value=""></td></tr>
        	<tr><td>Show Controls</td><td><select name="map_showcont">
              <option value="s" >Small</option>
              <option value="l" >Large</option>
              <option value="z" >Zoom Only</option>
              <option value="n" >None</option>
              </select></td></tr>
        	<tr><td>Show Scale</td><td><select name="map_showscale">
              <option value="TRUE" >Yes</option>
              <option value="FALSE" >No</option>
              </select></td></tr>
        	<tr><td>Show Map Type Buttons</td><td><select name="map_showtypecont">
              <option value="TRUE" >Yes</option>
              <option value="FALSE" >No</option>
              </select></td></tr>
        	<tr><td>Default Map Type</td><td><select name="map_type">
              <option value="G_MAP_TYPE" >Street Map</option>
              <option value="G_SATELLITE_TYPE" >Satellite</option>
              <option value="G_HYBRID_TYPE" >Hybrid</option>
       			</select></td></tr>
				<tr><td>Page Text</td><td><textarea name="edit" style="width:90%;" rows="20">textbox</textarea></td></tr>

        <!-- Allow Comments <input name="map_comm" type="checkbox" value=""><br/> //-->
        <tr><td></td><td><input type="button" name="save_map_btn" value="Submit" onclick="javascript:BitMap.EditSession.storeMap(document['edit-map-form']);"> 
				<input type="button" name="closemapform" value="Cancel" onclick="javascript:BitMap.EditSession.canceledit('edit-map-table');"></td>
				</tr>
			</table>
    </form>
</div>	
<!--end map editing form -->




<!-- maptypes editing -->
<div id="edit-maptypes-table" class="edit-table" style="display:none;">
  <div id="edit-marptypes" class="edit-titlebar">
    <table class="bar">
    	<tr>
        <td width="200px">
			    <span class="setname">Maptypes Associated With This Map</span>
        </td>
		</tr>
    </table>
  </div>
	<div id="edit-maptype-table" class="edit-optionstable">
	  <form action="javascript:;" name="edit-maptype-form" id="edit-maptype-form">
		<input name="array_n" type="hidden" value="">
		<input name="save_maptype" type="hidden" value="true">
		<input name="maptype_id" type="hidden" size="3" value="">
		<table class="data">
		  <tr>
			<td width="200px">Maptypes:<br/>
				<ul>
				<li style="display:none;"><a href="javascript:BitMap.EditSession.editMaptype(n);">Maptype Name Here</a></li>
				<li><a href="javascript:BitMap.EditSession.newMaptype();">Add New Maptype</a></li>
				</ul>
			</td>
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
			   /select></td>
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
			   <a name="save_maptype_btn" title="save" href="javascript:BitMap.EditSession.storeNewMapType(document.edit-maptype-form);">{biticon ipackage="icons" iname="save" iexplain="save"}</a><br/>
			   <a name="save_maptype_btn" title="save" href="javascript:BitMap.EditSession.storeMapType(document.edit-maptype-form);">{biticon ipackage="icons" iname="save" iexplain="save"}</a>
			   <a name="locate_maptype_btn" title="show on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
			   <a name="remove_maptype_btn" title="remove from this map" href="javascript:BitMap.EditSession.removeMapType(document.edit-maptype-form);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
			   <a name="expunge_maptype_btn" title="delete the maptype!" href="javascript:BitMap.EditSession.expungeMapType(document..edit-maptype-form);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
				<div id="editmaptypecancel" style="display:none;"><input type="button" name="closemaptypeform" value="Cancel Editing Map Types" onclick="javascript:BitMap.EditSession.canceledit('edit-maptypes-menu'); BitMap.EditSession.canceledit('edit-maptypes-table');"></div>
				<!--end maptype editing forms -->
		  </tr>
		</table>
	  </form>
	</div>
</div> <!-- end of editmaptypeform -->




<!-------------------------
	-  Marker Editing Forms
	------------------------->
	
<!-- marker editing menu -->
<div id="edit-markers-menu" style="display:none;">
		<a href="javascript:BitMap.EditSession.newMarkerSet();">New Marker Set</a> | 
		<a href="javascript:BitMap.EditSession.editMarkerStyles();">Edit Marker Styles</a> | 
		<a href="javascript:BitMap.EditSession.editIconStyles();">Edit Marker Icons</a>
</div>
<!-- end of marker editing menu -->


<!-- markerset editing menu -->
<div id="edit-markersets-table" class="edit-table" style="display:none;">
  <h2>Marker Sets Associated With This Map</h2>
  <div id="edit-markerset" class="edit-titlebar" style="display:none;">
    <table class="bar">
    	<tr>
        <td width="200px"><span class="setname">Set Name Here</span></td>
      <td>
        <a class="opts" href="javascript:BitMap.EditSession.editMarkerSetOptions(n);">Edit Set Options</a> | 
        <a class="list" href="javascript:BitMap.EditSession.editMarkers(n);">Edit Markers In This Set</a>
      </td>
    </tr>
    </table>
  </div>
</div>
<!-- end of markerset editing menu -->


<!-- new markerset form -->
<div id="edit-new-markerset-table" class="edit-optionstable" style="display:none;">
    	<form action="javascript:;" name="edit-new-markerset-form" id="edit-new-markerset-form">
        <input name="save_markerset" type="hidden" value="true">
    		<table class="data">
					<tr>
						<td>
              Name:<br/>
              <input size="20" name="name" type="text" value="a name"></td>
						<td>Marker Style:<br/>
                <select name="style_id">
                  					<option value="0">Google (standard)</option>
                      				</select><br/>
						    Icon Style:<br/>
                <select name="icon_id">
                                      <option value="0">Google (standard)</option>
                                   	</select>
						<td>Cluster:<br/>
                <select name="cluster">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select><br/>
						    Plot-On-Load:<br/>
                <select name="plot_on_load">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select></td>
						<td>List Set In Side Panel:<br/>
                <select name="side_panel">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select><br/>
						    List Markers In Side Panel:<br/>
                <select name="explode">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select></td>
						<td style="width:200px">Actions:<br/>
						    <input type="button" name="savenewmarkerset" value="Save" onclick="javascript:BitMap.EditSession.storeNewMarkerSet(edit-new-markerset-form); BitMap.EditSession.removeAssistant(); BitMap.EditSession.canceledit('editerror');"/>
						    <input type="button" name="closemarkersetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelNewMarkerSet()"/></td>
					</tr>
				</table>
			</form>
</div>
<!-- end of new markerset form -->


<!-- markerset options form -->
<div id="edit-markerset-options-table" class="edit-optionstable" style="display:none;">
    	<form action="javascript:;" name="edit-markerset-options-form" id="edit_markerset-options-form">
  		<input name="set_id" type="hidden" value="n">
        <input name="set_array_n" type="hidden" value="n">
        <input name="save_markerset" type="hidden" value="true">
    		<table class="data">
					<tr>
						<td>
              Name:<br/>
              <input size="20" name="name" type="text" value="a name"></td>
						<td>Marker Style:<br/>
                <select name="style_id">
                  					<option value="0">Google (standard)</option>
                      				</select><br/>
						    Icon Style:<br/>
                <select name="icon_id">
                                      <option value="0">Google (standard)</option>
                                   	</select>
						<td>Cluster:<br/>
                <select name="cluster">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select><br/>
						    Plot-On-Load:<br/>
                <select name="plot_on_load">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select></td>
						<td>List Set In Side Panel:<br/>
                <select name="side_panel">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select><br/>
						    List Markers In Side Panel:<br/>
                <select name="explode">
                      					<option value="false">No</option>
                      					<option value="true">Yes</option>
                          				</select></td>
						<td style="width:200px">Actions:<br/>
							<a id="setstore" href="javascript:BitMap.EditSession.storeMarkerSet(edit_markerset-options-form);">{biticon ipackage="icons" iname="save" iexplain="save"}</a> 
							<a id="setremove" href="javascript:BitMap.EditSession.removeMarkerSet(edit_markerset-options-form);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a> 
							<a id="setdelete" href="javascript:BitMap.EditSession.expungeMarkerSet(edit_markerset-options-form);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a><br/>
							<a id="setaddmarkers" href="javascript:alert('feature coming soon');">Add Markers from Archives</a></td>
					</tr>
				</table>
			</form>
		<div id="markersetcancel" >
    <input type="button" name="savenewmarkerset" value="Save" onclick="javascript:BitMap.EditSession.storeNewMarkerSet(edit_markerset-options-form); BitMap.EditSession.removeAssistant(); BitMap.EditSession.canceledit('editerror');"/>
    <input type="button" name="closemarkersetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditMarkerSetOptions()"/></div>
</div>
<!-- end of markerset options form -->


<!-- edit markers form -->
<div id="edit-markers-table" class="edit-datatable" style="display:none;">
    <form action="javascript:;" name="edit-marker-form" id="edit-marker-form" >
    <input name="save_marker" type="hidden" value="true">
    <input name="marker_id" type="hidden" value="marker_id">
    <input name="marker_array_n" type="hidden" value="n">
    <input name="set_id" type="hidden" value="set_id">
    <table>
    	<tr>
        <td width="200px">Markers:<br/>
            <ul>
            <li style="display:none;"><a href="javascript:BitMap.EditSession.editMarker(n);">Marker Name Here</a></li>
            <li id="edit-markerlink-new"><b><a id="edit-markerlink-new-a" href="javascript:BitMap.EditSession.newMarker(setindex);">Add A New Marker</a></b></li>
            </ul>
        </td>
    	  <td>
          <div class="markerform">
            <div>Type <select name="marker_type">
											<option value="0" >Normal</option>
											<option value="1" >Auto-Photo</option>
											</select></div>
            <div>Latitutde &nbsp;<input size="50" name="geo[lat]" type="text" value=""><br/>
                 Longitude <input size="50" name="geo[lng]" type="text" value=""><br/>
                 <a name="marker_assist_btn" title="click a location!" href="javascript:BitMap.EditSession.addAssistant('marker', 'new');">( Use Locating Assistant )</a></div>
            <div>Title<br/>
                 <input size="50" name="title" type="text" value="a title"></div>
            <div>Label Title<br/>
                 <textarea name="marker_labeltext" rows="1"></textarea></div>
            <div>Window Text<br/>
                 <textarea name="edit" rows="10"></textarea></div>
            <div>Photo URL<br/>
                 <input size="50" name="photo_url" type="text" value=""></div>
            <div id="new-marker-actions">
                <input type="button" name="save_marker_btn" value="Save" onclick="javascript:BitMap.EditSession.storeMarker(document['edit-marker-form']);">
          </div>
        </td>
        <td width="200px">
          <div id="edit-marker-tips">Tips<br/>
               Put advice here
          </div>
          <div id="edit-marker-actions">Edit Marker Actions<br/>
            <a name="locate_marker_btn" title="locate on the map" href="javascript:BitMap.MapData[0].Map.markers[n].marker.openInfoWindowHtml(BitMap.MapData[0].Map.markers[n].marker.my_html);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
            <a name="remove_marker_btn" title="remove from this set" href="javascript:BitMap.EditSession.removeMarker(document.edit-marker-form);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
            <a name="expunge_marker_btn" title="delete the marker!" href="javascript:BitMap.EditSession.expungeMarker(document.edit-marker-form);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a><br/>
          </div>
        </td>
     	</tr>
    </table>
    <input type="button" name="closemarkerset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditMarkers()"></br></div>
    </form>
</div> 
<!-- edit of edit markers form -->


<!-- close all marker editing -->
<div id="edit-markersets-cancel" style="display:none;">
  <input type="button" name="closemarkerform" value="Close Marker Editing" onclick="javascript:BitMap.EditSession.cancelEditMarkerSets();" />
</div>








<div id="editiconstylesmenu" style="display:none;">
		<a href="javascript:BitMap.EditSession.newIconStyle();">Add a New Icon Style</a>
</div>


<div id="newiconstyleform" class="editform" style="display:none;">
		<h2>Add a New Icon Style</h2>		
    		<div class="table" id="editiconstyletable_new">
    			<form action="javascript:;" name="iconstyleform_new" id="iconstyleform_new">
					<input name="save_iconstyle" type="hidden" value="true">
    			<table class="data gmapeditstrong">
						<tr>
							<td>Name<br/><input name="name" type="text" size="15" value="a name"></td>
							<td>Type<br/><select name="icon_style_type" onChange="javascript:BitMap.EditSession.toggleIconMenu(this.value, 'new');">
                                <option value="0">GIcon</option>
                                <option value="1">XIcon</option>
                             </select></td>
                		<td>Window Anchor X<br/><input name="infowindow_anchor_x" type="text" size="15" value="9"></td>
                		<td>Window Anchor Y<br/><input name="infowindow_anchor_y" type="text" size="15" value="2"></td>
							<td></td>
							<td></td>
                		<td>ACTIONS<br/><a name="new_iconstyle_btn" title="save" href="javascript:BitMap.EditSession.storeNewIconStyle(document.iconstyleform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
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
		<div id="newiconstylecancel" ><input type="button" name="closeiconstyleform" value="Cancel New Icon Style" onclick="javascript:BitMap.EditSession.canceledit('newiconstyleform'); BitMap.EditSession.canceledit('editerror');"></div>
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
						<td>Type<br/><select name="icon_style_type" onChange="javascript:BitMap.EditSession.toggleIconMenu(this.value, this.form.icon_id.value);">
                                <option value="0">GIcon</option>
                                <option value="1">XIcon</option>
                             </select></td>
                	<td>Window Anchor X<br/><input name="infowindow_anchor_x" type="text" size="15" value="9"></td>
                	<td>Window Anchor Y<br/><input name="infowindow_anchor_y" type="text" size="15" value="2"></td>
						<td></td>
						<td></td>
                	<td>ACTIONS<br/><a style="float:left; padding:0 .4em;" name="save_iconstyle_btn" title="save" href="javascript:BitMap.EditSession.storeIconStyle(document.iconstyleform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
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

<div id="editiconstylescancel" style="display:none;"><input type="button" name="closeiconstylesform" value="Cancel Editing Icon Styles" onclick="javascript:BitMap.EditSession.canceledit('editiconstylesmenu'); BitMap.EditSession.canceledit('newiconstyleform'); BitMap.EditSession.canceledit('editiconstyleform'); BitMap.EditSession.canceledit('editiconstylescancel');"></div>
<!--end icon style editing forms -->



<div id="editmarkerstylesmenu" style="display:none;">
		<a href="javascript:BitMap.EditSession.newMarkerStyle();">Add a New Marker Style</a>
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
  					<td width="90px"><select name="marker_style_type">
  							<option value="0">GMarker</option>
  							<option value="1">PdMarker</option>
  							<option value="2">XMarker</option>
  							</select></td>
  					<td width="150px"><input name="label_hover_opacity" type="text" size="5" value="70"></td>
  					<td width="120px"><input name="label_opacity" type="text" size="5" value="100"></td>
  					<td><textarea name="label_hover_styles" style="width:90%" rows="3"></textarea></td>
  					<td><textarea name="window_styles" style="width:90%" rows="3"></textarea></td>
  					<td width="80px"><a name="new_markerstyle_btn" title="save" href="javascript:BitMap.EditSession.storeNewMarkerStyle(document.markerstyleform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
			</form>
		</div>
		<div id="newmarkerstylecancel" ><input type="button" name="closemarkerstyleform" value="Cancel New Marker Style" onclick="javascript:BitMap.EditSession.canceledit('newmarkerstyleform'); BitMap.EditSession.canceledit('editerror');"></div>
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
  					<td width="90px"><select name="marker_style_type">
								<option value="0">GMarker</option>
								<option value="1">PdMarker</option>
								<option value="2">XMarker</option>
								</select></td>
  					<td width="150px"><input name="label_hover_opacity" type="text" size="5" value="70"></td>
  					<td width="120px"><input name="label_opacity" type="text" size="5" value="100"></td>
  					<td><textarea name="label_hover_styles" style="width:90%" rows="3"></textarea></td>
  					<td><textarea name="window_styles" style="width:90%" rows="3"></textarea></td>
  					<td width="80px"><a name="save_markerstyle_btn" title="save" href="javascript:BitMap.EditSession.storeMarkerStyle(document.markerstyleform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
			</form>
		</div>
</div> <!-- end of editmarkerstylesform -->

<div id="editmarkerstylescancel" style="display:none;"><input type="button" name="closemarkerstylesform" value="Cancel Editing Marker Styles" onclick="javascript:BitMap.EditSession.canceledit('editmarkerstylesmenu'); BitMap.EditSession.canceledit('newmarkerstyleform'); BitMap.EditSession.canceledit('editmarkerstyleform'); BitMap.EditSession.canceledit('editmarkerstylescancel');"></div>
<!--end marker style editing forms -->










<!-------------------------
	-  Polyline Editing Forms
	------------------------->

<!--polyline editing forms -->
<div id="editpolylinemenu" style="display:none;">
		<a href="javascript:BitMap.EditSession.newPolyline();">New Polyline</a> | 
		<a href="javascript:BitMap.EditSession.newPolylineSet();">New Polyline Set</a> | 
		<a href="javascript:BitMap.EditSession.editPolylineStyles();">Edit Polyline Styles</a> | 
</div>

<div id="newpolylinesetform" class="editform" style="display:none;">
		<h2>Add a New Polyline Set</h2>
    <div class="table" id="editpolylinesettable_new">
    	<form action="javascript:;" name="polylinesetform_new" id="polylinesetform_new">
				<input name="save_polylineset" type="hidden" value="true">
    		<table class="data">
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Style</th>
						<th>Map Display Settings</th>
						<th>Side Panel Display Settings</th>
						<th style="width:80px">ACTIONS</th>
					</tr>
					<tr class="gmapeditstrong">
						<td><input name="name" type="text" style="width:90%" value="a name"></td>
						<td><textarea name="description" style="width:90%" rows="2"></textarea></td>
						<td><select name="style_id" id="style_id">
                                    	<option value="0" >Google (standard)</option>
                                      	</select></td>
						<td>Plot-On-Load: <select name="plot_on_load">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td>Side: <select name="side_panel">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
    					List: <select name="explode">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td style="width:80px"><a name="new_polylineset_btn" title="save" href="javascript:BitMap.EditSession.storeNewPolylineSet(document.polylinesetform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
					</tr>
				</table>
    	</form>
		</div>
		<div id="newpolylinesetcancel" ><input type="button" name="closepolylinesetform" value="Cancel New Polyline Set" onclick="javascript:BitMap.EditSession.canceledit('newpolylinesetform'); BitMap.EditSession.canceledit('editerror');"></div>
</div>
<!-- end of newpolylinesetform -->




<div id="editpolylinestylesmenu" style="display:none;">
		<a href="javascript:BitMap.EditSession.newPolylineStyle();">Add a New Polyline Style</a>
</div>


<div id="newpolylinestyleform" class="editform" style="display:none;">
		<h2>Add a New Polyline Style</h2>		
    <div class="table" id="editpolylinestyletable_new">
    	<form action="javascript:;" name="polylinestyleform_new" id="polylinestyleform_new">
				<input name="save_polylinestyle" type="hidden" value="true">
    		<table class="data gmapeditstrong">
					<tr>
                	<td>
							Name <br/><input name="name" type="text" size="15" value="a name"><br/>
							Type <br/><select name="polyline_style_type">
                                <option value="0">Google Default</option>
                                <option value="1">XPolyline</option>
                             </select><br/>
                     	Color <br/><input name="color" type="text" size="15" value="ff3300"><br/>
                     	Weight <br/><input name="weight" type="text" size="15" value="2"><br/>
                     	Opacity <br/><input name="opacity" type="text" size="15" value=".75"><br/>
						</td>
                	<td>
							Pattern <br/><input name="pattern" type="text" size="15" value=""><br/>
                        Segment Count <br/><input name="segment_count" type="text" size="15" value=""><br/>
                		Text Every <br/><input name="text_every" type="text" size="15" value="">
						</td>
                	<td>
                		Begin Arrow <br/><select name="begin_arrow">
                        				<option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		End Arrow <br/><select name="end_arrow">
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		Arrow Every <br/><input name="arrows_every" type="text" size="15" value=""><br/>
						</td>
                	<td>
                    	Text FG Color <br/><input name="text_fgstyle_color" type="text" size="15" value="ffffff"><br/>
                    	Text FG Weight <br/><input name="text_fgstyle_weight" type="text" size="15" value="1"><br/>
                    	Text FG Opacity <br/><input name="text_fgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text FG zIndex <br/><input name="text_fgstyle_zindex" type="text" size="15" value="0">
						</td>
                	<td>
                    	Text BG Color <br/><input name="text_bgstyle_color" type="text" size="15" value="ff3300"><br/>
                    	Text BG Weight <br/><input name="text_bgstyle_weight" type="text" size="15" value="2"><br/>
                    	Text BG Opacity <br/><input name="text_bgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text BG xIndex <br/><input name="text_bgstyle_zindex" type="text" size="15" value="0">
						</td>
                	<td>ACTIONS<br/><a name="new_polylinestyle_btn" title="save" href="javascript:BitMap.EditSession.storeNewPolylineStyle(document.polylinestyleform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
						</tr>
    		</table>
    	</form>
  	</div>
		<div id="newpolylinestylecancel" ><input type="button" name="closepolylinestyleform" value="Cancel New Polyline Style" onclick="javascript:BitMap.EditSession.canceledit('newpolylinestyleform'); BitMap.EditSession.canceledit('editerror');"></div>
</div>
<!-- end of newpolylinestyleform -->


<div id="editpolylinestyleform" class="editform" style="display:none;">
		<h2>Polyline Styles Associated with Polyline Sets on This Map</h2>		
		<div class="table" id="editpolylinestyletable_n">
			<form action="javascript:;" name="polylinestyleform_n" id="polylinestyleform_n" style="display:none;">
				<input name="save_polylinestyle" type="hidden" value="true">
				<input name="style_array_n" type="hidden" value="n">
				<input name="style_id" type="hidden" value="n">
				<table class="data" id="polylinestyleformdata_n">
					<tr>
                	<td>
							Name <br/><input name="name" type="text" size="15" value="a name"><br/>
							Type <br/><select name="polyline_style_type">
                                <option value="0">Google Default</option>
                                <option value="1">XPolyline</option>
                             </select><br/>
                     	Color <br/><input name="color" type="text" size="15" value="ff3300"><br/>
                     	Weight <br/><input name="weight" type="text" size="15" value="2"><br/>
                     	Opacity <br/><input name="opacity" type="text" size="15" value=".75"><br/>
						</td>
                	<td>
							Pattern <br/><input name="pattern" type="text" size="15" value=""><br/>
                        Segment Count <br/><input name="segment_count" type="text" size="15" value=""><br/>
                		Text Every <br/><input name="text_every" type="text" size="15" value="">
						</td>
                	<td>
                		Begin Arrow <br/><select name="begin_arrow">
                        				<option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		End Arrow <br/><select name="end_arrow">
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select><br/>
                		Arrow Every <br/><input name="arrows_every" type="text" size="15" value=""><br/>
						</td>
                	<td>
                    	Text FG Color <br/><input name="text_fgstyle_color" type="text" size="15" value="ffffff"><br/>
                    	Text FG Weight <br/><input name="text_fgstyle_weight" type="text" size="15" value="1"><br/>
                    	Text FG Opacity <br/><input name="text_fgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text FG zIndex <br/><input name="text_fgstyle_zindex" type="text" size="15" value="0">
						</td>
                	<td>
                    	Text BG Color <br/><input name="text_bgstyle_color" type="text" size="15" value="ff3300"><br/>
                    	Text BG Weight <br/><input name="text_bgstyle_weight" type="text" size="15" value="2"><br/>
                    	Text BG Opacity <br/><input name="text_bgstyle_opacity" type="text" size="15" value="1"><br/>
                    	Text BG xIndex <br/><input name="text_bgstyle_zindex" type="text" size="15" value="0">
						</td>
						<td>
							ACTIONS<br/><a style="float:left; padding:0 .4em;" name="save_polylinestyle_btn" title="save" href="javascript:BitMap.EditSession.storePolylineStyle(document.polylinestyleform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a>
      				</td>
					</tr>
				</table>
      	</form>
		</div>
</div> <!-- end of editpolylinestylesform -->

<div id="editpolylinestylescancel" style="display:none;"><input type="button" name="closepolylinestylesform" value="Cancel Editing Polyline Styles" onclick="javascript:BitMap.EditSession.canceledit('editpolylinestylesmenu'); BitMap.EditSession.canceledit('newpolylinestyleform'); BitMap.EditSession.canceledit('editpolylinestyleform'); BitMap.EditSession.canceledit('editpolylinestylescancel');"></div>
<!--end polyline style editing forms -->




<div id="newpolylineform" class="editform" style="display:none;">
		<h2>Add a New Polyline</h2>
    <div class="table" id="editpolylinetable_new">
    	<form action="javascript:;" name="polylineform_new" id="polylineform_new">
				<input name="new_polyline" type="hidden" value="true">
    		<table class="data">
					<tr>
    				<th>Name </th>
    				<th>Points Data </th>
    				<th>Border Text <br/>only for XPolyline type</th>
    				<th>zIndex </th>
    				<th>Set </th>
    				<th style="width:80px">ACTION </th>
					</tr>
					<tr class="gmapeditstrong">
						<td><input name="name" type="text" style="width:90%" value="new"></td>
						<td><textarea name="points_data" style="width:90%" rows="3"></textarea><br/>
							<a name="polyline_assist_btn" title="draw the line!" href="javascript:BitMap.EditSession.addAssistant('polyline', 'new');">Use Drawing Assistant</a></td>
						<td><input name="border_text" type="text" style="width:90%" value=""></td>
						<td><input name="zindex" type="text" size="3" value="0"></td>
						<td><select name="set_id" id="polylineset_id">
								<option value="n" >someset</option>
								</select></td>
						<td style="width:80px"><a name="new_polyline_btn" title="save" href="javascript:BitMap.EditSession.storeNewPolyline(document.polylineform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
    	</form>
  	</div>
		<div id="newpolylinecancel" ><input type="button" name="closepolylineform" value="Cancel New Polyline" onclick="javascript:BitMap.EditSession.canceledit('newpolylineform'); removeAssistant(); BitMap.EditSession.canceledit('editerror');"></div>
</div> <!-- end of newpolylineform -->





<div id="editpolylineform" class="editform" style="display:none;">
		<h2>Polyline Sets Associated With This Map</h2>
		<table>
			<tr>
				<th style="width:240px">Name</th>
				<th>Style</th>
				<th style="width:100px">Plot-on-Load</th>
				<th style="width:80px">List Set</th>
				<th style="width:100px">List Markers</th>
				<th style="width:80px">ACTIONS</th>
			</tr>
		</table>
		<div id="polylineset_n" style="display:none;">
    	<form action="javascript:;" name="polylinesetform_n" id="polylinesetform_n" style="display:none;">
				<input name="set_id" type="hidden" size="3" value="n">
            <input name="set_array_n" type="hidden" value="n">
  			<table class="data" id="polylinesetformdata_n">
					<tr class="gmapeditstrong">
    				<td style="width:240px"><b>Set Name:</b> <!-- <span id="plsetdesc">Description Here</span><br/> --></td>
						<td><select name="style_id">
                  				<option value="0">Google (standard)</option>
                      			</select></td> 
						<td style="width:100px"><select name="plot_on_load">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select></td>
						<td style="width:80px"><select name="side_panel">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select></td>
						<td style="width:100px"><select name="explode">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select></td>
    				<td style="width:80px">
							<a id="plsetstore" href="javascript:BitMap.EditSession.storePolylineSet(document.polylinesetform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a> 
  						<a id="plsetremove" href="javascript:BitMap.EditSession.removePolylineSet(document.polylinesetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a> 
  						<a id="plsetdelete" href="javascript:BitMap.EditSession.expungePolylineSet(document.polylinesetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
					</tr>
					<tr>
  					<td colspan="5"><a id="plsetedit" href="javascript:BitMap.EditSession.editPolylineSet('n');">Edit These Polylines</a> | 
    					<a id="plsetadd" href="javascript:alert('feature coming soon');">Add Polylines from Archives</a></td>
					</tr>
  			</table>
        </form>
			<div id="plsetform_n" style="display:none;">
				<h3>Polylines In This Set</h3>
        	<table>
					<tr>
    				<th style="width:160px">Name </th>
    				<th style="width:160px">Points Data </th>
    				<th>Border Text <br/>only for XPolyline type</th>
    				<th style="width:80px">zIndex </th>
    				<th style="width:80px">ACTION </th>
					</tr>
    		</table>
    		<div class="table" id="editpolylinetable_n">
    			<form action="javascript:;" name="polylineform_n" id="polylineform_n" style="display:none;">
      				<input name="save_polyline" type="hidden" value="true">
                	<input name="set_id" type="hidden" size="3" value="n">
            		<input name="polyline_id" type="hidden" size="3" value="n">
						<input name="polyline_array_n" type="hidden" value="n">
        			<table class="data" id="polylineformdata_n">
							<tr>
								<td style="width:160px"><input name="name" type="text" style="width:90%" value="a name"></td>
								<td style="width:160px"><textarea name="points_data" style="width:90%" rows="3"></textarea><br/>
									<a name="polyline_assist_btn" title="draw the line!" href="javascript:BitMap.EditSession.addAssistant('polyline', n);">Use Drawing Assistant</a></td>
								<td><input name="border_text" type="text" style="width:90%" value=""></td>
								<td style="width:80px"><input name="zindex" type="text" size="3" value="0"></td>
								<td style="width:80px">
									<a name="save_polyline_btn" title="save" href="javascript:BitMap.EditSession.storePolyline(document.polylineform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a>
									<a name="locate_polyline_btn" title="locate on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
									<a name="remove_polyline_btn" title="remove from this set" href="javascript:BitMap.EditSession.removePolyline(document.polylineform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
									<a name="expunge_polyline_btn" title="delete the polyline!" href="javascript:BitMap.EditSession.expungePolyline(document.polylineform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
							</tr>
        			</table>
    			</form>
  		  </div>
      	<div id="allavailpolylines_n" style="display:none;">
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

<div id="editpolylinecancel" style="display:none;"><input type="button" name="closepolylineform" value="Cancel Editing Polylines" onclick="javascript:BitMap.EditSession.cancelPolylineEdit(); BitMap.EditSession.canceledit('newpolylinesetform'); BitMap.EditSession.canceledit('editerror');"></div>
<!--end polyline editing forms -->







<!-------------------------
	-  Polygon Editing Forms
	------------------------->

<!--polygon editing forms -->
<div id="editpolygonmenu" style="display:none;">
		<a href="javascript:BitMap.EditSession.newPolygon();">New Polygon</a> | 
		<a href="javascript:BitMap.EditSession.newPolygonSet();">New Polygon Set</a> | 
		<a href="javascript:BitMap.EditSession.editPolygonStyles();">Edit Polygon Styles</a> | 
</div>

<div id="newpolygonsetform" class="editform" style="display:none;">
		<h2>Add a New Polygon Set</h2>		
    <div class="table" id="editpolygonsettable_new">
    	<form action="javascript:;" name="polygonsetform_new" id="polygonsetform_new">
				<input name="save_polygonset" type="hidden" value="true">
    		<table class="data">
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Style</th>
						<th>Map Display Settings</th>
						<th>Side Panel Display Settings</th>
						<th style="width:80px">ACTIONS</th>
					</tr>
					<tr class="gmapeditstrong">
						<td><input name="name" type="text" style="width:90%" value="a name"></td>
						<td><textarea name="description" style="width:90%" rows="3"></textarea></td>
						<td>Fill Style: <select name="style_id" id="style_id">
                                    	<option value="0" >XPolygon (default)</option>
                                      	</select><br/>
							Line Style:	<select name="polylinestyle_id" id="polylinestyle_id">
											<option value="0" >Google (default)</option>
											</select></td>
						<td>Plot-On-Load: <select name="plot_on_load">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td>Side: <select name="side_panel">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select><br/>
    					List: <select name="explode">
                      					<option value="true">Yes</option>
                      					<option value="false">No</option>
                          				</select></td>
						<td style="width:80px"><a name="new_polygonset_btn" title="save" href="javascript:BitMap.EditSession.storeNewPolygonSet(document.polygonsetform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
					</tr>
    		</table>
    	</form>
		</div>
		<div id="newpolygonsetcancel" ><input type="button" name="closepolygonsetform" value="Cancel New Polygon Set" onclick="javascript:BitMap.EditSession.canceledit('newpolygonsetform'); BitMap.EditSession.canceledit('editerror');"></div>
</div>
<!-- end of newpolygonsetform -->




<div id="editpolygonstylesmenu" style="display:none;">
		<a href="javascript:BitMap.EditSession.newPolygonStyle();">Add a New Polygon Style</a>
</div>


<div id="newpolygonstyleform" class="editform" style="display:none;">
		<h2>Add a New Polygon Style</h2>
		<div class="table" id="editpolygonstyletable_new">
			<form action="javascript:;" name="polygonstyleform_new" id="polygonstyleform_new">
				<input name="save_polygonstyle" type="hidden" value="true">
				<table class="data">
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Color</th>
						<th>Weight</th>
						<th>Opacity</th>
						<th style="width:80px">ACTIONS</th>
					</tr>
					<tr class="gmapeditstrong">
						<td><input name="name" type="text" style="width:90%" value="a name"></td>
						<td><select name="polygon_style_type">
                                <option value="0">XPolygon</option>
                             </select></td>
						<td><input name="color" type="text" size="15" value="ff3300"></td>
						<td><input name="weight" type="text" size="15" value="2"></td>
						<td><input name="opacity" type="text" size="15" value=".75"></td>
						<td style="width:80px"><a name="new_polygonstyle_btn" title="save" href="javascript:BitMap.EditSession.storeNewPolygonStyle(document.polygonstyleform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
					</tr>
				</table>
			</form>
		</div>
		<div id="newpolygonstylecancel" ><input type="button" name="closepolygonstyleform" value="Cancel New Polygon Style" onclick="javascript:BitMap.EditSession.canceledit('newpolygonstyleform'); BitMap.EditSession.canceledit('editerror');"></div>
</div>
<!-- end of newpolygonstyleform -->


<div id="editpolygonstyleform" class="editform" style="display:none;">
		<h2>Polygon Styles Associated with Polygon Sets on This Map</h2>
		<table>
			<tr>
				<th>Name</th>
				<th style="width:120px">Type</th>
				<th style="width:120px">Color</th>
				<th style="width:120px">Weight</th>
				<th style="width:120px">Opacity</th>
				<th style="width:80px">ACTIONS</th>
			</tr>
		</table>
		<div class="table" id="editpolygonstyletable_n">
			<form action="javascript:;" name="polygonstyleform_n" id="polygonstyleform_n" style="display:none;">
				<input name="save_polygonstyle" type="hidden" value="true">
				<input name="style_array_n" type="hidden" value="n">
				<input name="style_id" type="hidden" value="n">
				<table class="data" id="polygonstyleformdata_n">
					<tr>
						<td><input name="name" type="text" style="width:90%" value="a name"></td>
						<td style="width:120px"><select name="polygon_style_type">
                                <option value="0">XPolygon</option>
                             </select></td>
						<td style="width:120px"><input name="color" type="text" size="15" value="ff3300"></td>
						<td style="width:120px"><input name="weight" type="text" size="15" value="2"></td>
						<td style="width:120px"><input name="opacity" type="text" size="15" value=".75"></td>
						<td style="width:80px"><a style="float:left; padding:0 .4em;" name="save_polygonstyle_btn" title="save" href="javascript:BitMap.EditSession.storePolygonStyle(document.polygonstyleform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
      			</tr>
				</table>
			</form>
		</div>
</div> <!-- end of editpolygonstylesform -->

<div id="editpolygonstylescancel" style="display:none;"><input type="button" name="closepolygonstylesform" value="Cancel Editing Polygon Styles" onclick="javascript:BitMap.EditSession.canceledit('editpolygonstylesmenu'); BitMap.EditSession.canceledit('newpolygonstyleform'); BitMap.EditSession.canceledit('editpolygonstyleform'); BitMap.EditSession.canceledit('editpolygonstylescancel');"></div>
<!--end polygon style editing forms -->




<div id="newpolygonform" class="editform" style="display:none;">
		<h2>Add a New Polygon</h2>
    <div class="table" id="editpolygontable_new">
			<form action="javascript:;" name="polygonform_new" id="polygonform_new">
				<input name="new_polygon" type="hidden" value="true">
				<table class="data">
					<tr>
						<th>Name</th>
						<th>Shape</th>
						<th>Points Data</th>
						<th>Circle Center</th>
						<th>Radius</th>
						<th>Border Text</th>
						<th>zIndex</th>
						<th>Set</th>
						<th style="width:80px">ACTION</th>						
					</tr>
					<tr class="gmapeditstrong">
						<td><input name="name" type="text" style="width:90%" value="a name"></td>
						<td><select name="circle" >
								<option value="false" >Polygon </option>
								<option value="true" >Circle</option>
								</select></td>
						<td><textarea name="points_data" style="width:90%" rows="3"></textarea><br/>
							<a name="polygon_assist_btn" title="draw the line!" href="javascript:BitMap.EditSession.addAssistant('polygon', 'new');">Use Drawing Assistant</a></td>
						<td><input name="circle_center" type="text" style="width:90%" ></td>
						<td><input name="radius" type="text" size="8" value="0"></td>
						<td><input name="border_text" type="text" style="width:90%" value=""></td>
						<td><input name="zindex" type="text" size="3" value="0"></td>
						<td><select name="set_id" id="polygonset_id">
								<option value="n" >someset</option>
								</select></td>
						<td style="width:80px"><a name="new_polygon_btn" title="save" href="javascript:BitMap.EditSession.storeNewPolygon(document.polygonform_new);">{biticon ipackage="icons" iname="save" iexplain="save"}</a></td>
					</tr>
				</table>
			</form>
		</div>
		<div id="newpolygoncancel" ><input type="button" name="closepolygonform" value="Cancel New Polygon" onclick="javascript:BitMap.EditSession.canceledit('newpolygonform'); removeAssistant(); BitMap.EditSession.canceledit('editerror');"></div>
</div> <!-- end of newpolygonform -->





<div id="editpolygonform" class="editform" style="display:none;">
		<h2>Polygon Sets Associated With This Map</h2>
		<table>
			<tr>
				<th style="width:160px">Name</th>
				<th>Styles</th>
				<th style="width:100px">Plot-on-Load</th>
				<th style="width:90px">List Set</th>
				<th style="width:100px">List Polygon</th>
				<th style="width:80px">ACTIONS</th>
			</tr>
		</table>
		<div id="polygonset_n" style="display:none;">
    	<form action="javascript:;" name="polygonsetform_n" id="polygonsetform_n" style="display:none;">
				<input name="set_id" type="hidden" size="3" value="n">
            <input name="set_array_n" type="hidden" value="n">
  			<table class="data" id="polygonsetformdata_n">
					<tr class="gmapeditstrong">
						<td style="width:160px"><b>Set Name</b> <!-- <span id="pgsetdesc">Description Here</span><br/> --></td>
						<td>Fill Style: <select name="style_id">
                  				<option value="0">XPolygon (default)</option>
                      			</select><br/>
							Line Style: <select name="polylinestyle_id">
                  				<option value="0">Google (default)</option>
                      			</select></td>
						<td style="width:100px"><select name="plot_on_load">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select></td>
						<td style="width:90px"><select name="side_panel">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select></td>
						<td style="width:100px"><select name="explode">
                  				<option value="true">Yes</option>
                  				<option value="false">No</option>
                      			</select></td>
						<td style="width:80px">
							<a id="pgsetstore" href="javascript:BitMap.EditSession.storePolygonSet(document.polygonsetform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a> 
							<a id="pgsetremove" href="javascript:BitMap.EditSession.removePolygonSet(document.polygonsetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a> 
							<a id="pgsetdelete" href="javascript:BitMap.EditSession.expungePolygonSet(document.polygonsetform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
					</tr>
					<tr>
						<td colspan="5"><a id="pgsetedit" href="javascript:BitMap.EditSession.editPolygonSet('n');">Edit These Polygons</a> | 
							<a id="pgsetadd" href="javascript:alert('feature coming soon');">Add Polygons from Archives</a></td>
					</tr>
  			</table>
        </form>
			<div id="pgsetform_n" style="display:none;">
				<h3>Polygons In This Set</h3>
				<table>
					<tr>
						<th style="width:160px">Name</th>
						<th style="width:80px">Shape</th>
						<th style="width:160px">Points Data</th>
						<th style="width:80px">Circle Center</th>
						<th style="width:80px">Radius</th>
						<th>Border Text</th>
						<th style="width:80px">zIndex</th>
						<th style="width:80px">ACTION</th>						
					</tr>
				</table>
    		<div class="table" id="editpolygontable_n">
    			<form action="javascript:;" name="polygonform_n" id="polygonform_n" style="display:none;">
						<input name="save_polygon" type="hidden" value="true">
						<input name="set_id" type="hidden" size="3" value="n">
						<input name="polygon_id" type="hidden" size="3" value="n">
						<input name="polygon_array_n" type="hidden" value="n">
        			<table class="data" id="polygonformdata_n">
							<tr>
								<td style="width:160px"><input name="name" type="text" style="width:90%" value=""></td>
								<td style="width:80px"><select name="circle" >
										<option value="false" >Polygon </option>
										<option value="true" >Circle</option>
										</select></td>
								<td style="width:160px"><textarea name="points_data" style="width:90%" rows="3"></textarea><br/>
									<a name="polygon_assist_btn" title="draw the line!" href="javascript:BitMap.EditSession.addAssistant('polygon', n);">Use Drawing Assistant</a></td>
								<td style="width:80px"><input name="circle_center" type="text" style="width:90%" value="new"></td>
								<td style="width:80px"><input name="radius" type="text" size="8" value="new"></td>
								<td><input name="border_text" type="text" style="width:90%" value=""></td>
								<td style="width:80px"><input name="zindex" type="text" size="3" value="0"></td>
								<td style="width:80px">
									<a name="save_polygon_btn" title="save" href="javascript:BitMap.EditSession.storePolygon(document.polygonform_n);">{biticon ipackage="icons" iname="save" iexplain="save"}</a>
									<a name="locate_polygon_btn" title="locate on the map" href="javascript:alert('feature coming soon');"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/find.png" alt="find" class="icon" /></a>
									<a name="remove_polygon_btn" title="remove from this set" href="javascript:BitMap.EditSession.removePolygon(document.polygonform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/detach.png" alt="find" class="icon" /></a>
									<a name="expunge_polygon_btn" title="delete the polygon!" href="javascript:BitMap.EditSession.expungePolygon(document.polygonform_n);"><img src="{$smarty.const.LIBERTY_PKG_URL}icons/delete.png" alt="find" class="icon" /></a></td>
							</tr>
        			</table>
    			</form>
  		  </div>
      	<div id="allavailpolygons_n" style="display:none;">
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

<div id="editpolygoncancel" style="display:none;"><input type="button" name="closepolygonform" value="Cancel Editing Polygons" onclick="javascript:BitMap.EditSession.cancelPolygonEdit(); BitMap.EditSession.canceledit('newpolygonsetform'); BitMap.EditSession.canceledit('editerror');"></div>
<!--end polygon editing forms -->

