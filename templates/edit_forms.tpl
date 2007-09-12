<div>
	<a id="emap" href="javascript:BitMap.EditSession.editMap({$mapInfo.gmap_id});">Edit Map</a> | 
	<a id="emaptype" href="javascript:BitMap.EditSession.editMaptypes();">Edit Maptypes</a> |
	<a id="emarker" href="javascript:BitMap.EditSession.editMarkerSets();">Edit Markers</a> | 
	<a id="epolyline" href="javascript:BitMap.EditSession.editPolylines();">Edit Polylines</a> | 
	<a id="epolygon" href="javascript:BitMap.EditSession.editPolygons();">Edit Polygons</a>
</div>


{*	------------------------
	-   Map Editing Form
	-	we ajax the contents in
	------------------------ *}
<div id="map-form" style="display:none;"></div>


{* 	------------------------
	-   Maptype Editing Form
	------------------------ *}

<!-- maptype editing menu -->
<div id="edit-maptypes-menu" style="display:none;">
		<a href="javascript:BitMap.EditSession.editMaptype();">New Maptype</a>
</div>
<!-- end of maptype editing menu -->


<!-- maptype editing menu -->
<div id="edit-maptypes-table" class="edit-table" style="display:none;">
  <h2>MapTypes Associated With This Map</h2>
  <div id="edit-maptype" class="edit-titlebar" style="display:none;">
    <table class="bar">
    	<tr>
			<td width="200px"><span class="setname">MapType Name Here</span></td>
			<td>
				<a class="opts" href="javascript:BitMap.EditSession.editMaptype(n);">Edit Maptype Options</a> | 
				<a class="list" href="javascript:BitMap.EditSession.editMaptypeTilelayers(n);">Edit Tilelayers In This Maptype</a>
			</td>
			<td width="10px" style="text-align:right">
				<a title="close options editing" href="javascript:void(0);" onclick="javascript:BitMap.EditSession.cancelEditMaptype();"><img src="{$smarty.const.GMAP_PKG_URL}icons/close.gif"></a>
				<!-- <input type="button" name="closemaptypeform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditMaptype()"/> -->
			</td>
		</tr>
    </table>
  </div>
</div>
<!-- end of maptype editing menu -->


<!-- maptype options form -->
<div id="edit-maptype-options-table" class="edit-datatable" style="display:none;">
	<table>
		<tr>
			<td width="200px">
			</td>
			<td>
				<div id="maptype-form">PUT MAPTYPE FORM HERE!</div>
			</td>
			<td width="200px">
				<div id="edit-maptype-tips">Tips<br/>
					Put advice here
				</div>
				<div id="edit-maptype-options-actions">Edit Maptype Actions<br/>
					<a name="locate_maptype_btn" title="show on the map" href="javascript:alert('feature coming soon');">show</a>
					<a name="remove_maptype_btn" title="remove from this map" href="javascript:BitMap.EditSession.removeMaptype(document['edit-maptype-options-form']);">remove</a>
					<a name="expunge_maptype_btn" title="delete the maptype!" href="javascript:BitMap.EditSession.expungeMaptype(document['edit-maptype-options-form']);">delete</a>
				</div>
			</td>
		</tr>
	</table>
</div>
<!-- end of maptype options form -->


<!-- edit tilelayers form -->
<div id="edit-tilelayers-table" class="edit-datatable" style="display:none;">
    <table>
    	<tr>
        <td width="200px">Tilelayers:<br/>
            <ul>
            <li style="display:none;"><a href="javascript:BitMap.EditSession.editTilelayer(n);">Tilelayer Name Here</a></li>
            <li id="edit-tilelayerlink-new"><b><a id="edit-tilelayerlink-new-a" href="javascript:BitMap.EditSession.newTilelayer(setindex);">Add A New Tilelayer</a></b></li>
            </ul>
        </td>
    	<td>
			<div id="tilelayer-form"></div>
        </td>
        <td width="200px">
          <div id="edit-tilelayer-tips">Tips<br/>
               Put advice here
          </div>
          <div id="edit-tilelayer-actions">Edit Marker Actions<br/>
            <a name="remove_tilelayer_btn" title="remove from this maptype" href="javascript:BitMap.EditSession.removeTilelayer(document.edit-tilelayer-form);">remove</a>
            <a name="expunge_tilelayer_btn" title="delete the tilelayer!" href="javascript:BitMap.EditSession.expungeTilelayer(document.edit-tilelayer-form);">delete</a><br/>
          </div>
        </td>
     	</tr>
    </table>
    <table>
    	<tr>
        <td width="200px">
        </td>
    	<td>
          <div class="tplform">
            <div id="edit-copyright-menu">
            	Copyright Notices for this Tilelayer
				<div id="edit-copyrightlink-new">
					<b><a id="edit-copyrightlink-new-a" href="javascript:BitMap.EditSession.editCopyright(copyrightindex, tilelayerindex);">Add A New Copyright</a></b>
				</div>
				<div id="edit-copyrightlink" style="display:none;">
					<a href="javascript:BitMap.EditSession.editCopyright(n);">Copyright Notice Here</a>
				</div>
            </div>
          </div>
        </td>
        <td width="200px">
        </td>
     	</tr>
    </table>
	<input type="button" name="closetilelayerset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditTilelayers()"></br>
</div> 
<!-- edit of edit tilelayers form -->


<!-- edit copyrights form -->
<div id="edit-copyright-table" style="display:none;">
	<div id="copyright-form">PUT COPYRIGHT FORM HERE!</div>
</div> 
<!-- edit of edit copyrights form -->

<!-- close all maptype editing -->
<div id="edit-maptypes-cancel" style="display:none;">
  <input type="button" name="closemaptypeform" value="Close Maptype Editing" onclick="javascript:BitMap.EditSession.cancelEditMaptypes();" />
</div>




<!-------------------------
	-  Markerset and Marker Editing Forms
	------------------------->
	
<!-- marker editing menu -->
<div id="edit-markers-menu" style="display:none;">
		<a href="javascript:BitMap.EditSession.editMarkerSet();">New Marker Set</a> | 
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


<!-- markerset options form -->
<div id="edit-markerset-options-table" class="edit-datatable" style="display:none;">
	<div id="markerset-form">PUT MARKERSET FORM HERE!</div>
</div>
<!-- end of markerset options form -->


<!-- edit markers form -->
<div id="edit-markers-table" class="edit-datatable" style="display:none;">
		<table>
			<tr>
				<td width="200px">Markers:<br/>
					<ul id="edit-markers-list">
						<li style="display:none;"><a href="javascript:BitMap.EditSession.editMarker(n);">Marker Name Here</a></li>
						<li id="edit-markerlink-new"><b><a id="edit-markerlink-new-a" href="javascript:BitMap.EditSession.newMarker(setindex);">Add A New Marker</a></b></li>
					</ul>
				</td>
				<td>
					<div id="marker-form">PUT MARKER FORM HERE!</div>
				</td>
				<td width="200px">
					<div id="edit-marker-tips">Tips<br/>
					   Put advice here
					</div>
					<div id="edit-marker-actions">Edit Marker Actions<br/>
						<a name="locate_marker_btn" title="locate on the map" href="javascript:BitMap.MapData[0].Map.markers[n].marker.openInfoWindowHtml(BitMap.MapData[0].Map.markers[n].marker.my_html);">show</a>
						<a name="remove_marker_btn" title="remove from this set" href="javascript:BitMap.EditSession.removeMarker(document.edit-marker-form);">remove</a>
						<a name="expunge_marker_btn" title="delete the marker!" href="javascript:BitMap.EditSession.expungeMarker(document.edit-marker-form);">delete</a><br/>
					</div>
				</td>
			</tr>
		</table>
	<input type="button" name="closemarkerset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditMarkers()"></br>
</div> 
<!-- edit of edit markers form -->


<!-- close all marker editing -->
<div id="edit-markersets-cancel" style="display:none;">
  <input type="button" name="closemarkerform" value="Close Marker Editing" onclick="javascript:BitMap.EditSession.cancelEditMarkerSets();" />
</div>



<!--------------------------------
	-  Markerstyles Editing Forms
	-------------------------------->

<!-- markerstyle editing menu -->
<div id="edit-markerstyles-table" class="edit-table" style="display:none;">
	<h2>Marker Styles Associated with Marker Sets on This Map</h2>
	<div id="edit-markerstyles" class="edit-selected">
		<table class="bar">
			<tr>
				<td><span class="setname">Marker Styles:</span></td>
			</tr>
		</table>
	</div>
</div>
<!-- end of markerstyle editing menu -->

<!-- edit markerstyles form -->
<div id="edit-markerstyle-table" class="edit-datatable" style="display:none;">
	<table>
		<tr>
			<td width="200px"><br />
				<ul>
					<li style="display:none;"><a href="javascript:BitMap.EditSession.editMarkerStyle(n);">Marker Style Name Here</a></li>
					<li id="edit-markerstylelink-new"><b><a id="edit-markerstylelink-new-a" href="javascript:BitMap.EditSession.editMarkerStyle();">Add A New Marker Style</a></b></li>
				</ul>
			</td>
			<td>
				<div id="markerstyle-form">PUT MARKERSTYLE FORM HERE!</div>
			</td>
			<td width="200px">
				<div id="edit-markerstyle-tips">Tips<br/>
					Put advice here
				</div>
				<div id="edit-markerstyle-actions">Edit Marker Style Actions<br/>
					Currently no delete or expunge options
				</div>
			</td>
		</tr>
	</table>
</div> <!-- end of edit markerstyles form -->

<!-- close all markerstyles editing -->
<div id="edit-markerstyles-cancel" style="display:none;">
  <input type="button" name="closemarkerstylesform" value="Close Marker Styles Editing" onclick="javascript:BitMap.EditSession.cancelEditMarkerStyles();" />
</div>
<!-- end markerstyles editing forms -->




<!--------------------------------
	-  Iconstyles Editing Forms
	-------------------------------->

<!-- iconstyle editing menu -->
<div id="edit-iconstyles-table" class="edit-table" style="display:none;">
	<h2>Icon Styles Associated with Icon Sets on This Map</h2>
	<div id="edit-iconstyles" class="edit-selected">
		<table class="bar">
			<tr>
				<td><span class="setname">Icon Styles:</span></td>
			</tr>
		</table>
	</div>
</div>
<!-- end of iconstyle editing menu -->

<!-- edit iconstyles form -->
<div id="edit-iconstyle-table" class="edit-datatable" style="display:none;">
	<table>
		<tr>
			<td width="200px"><br />
				<ul>
					<li style="display:none;"><a href="javascript:BitMap.EditSession.editIconStyle(n);">Icon Style Name Here</a></li>
					<li id="edit-iconstylelink-new"><b><a id="edit-iconstylelink-new-a" href="javascript:BitMap.EditSession.editIconStyle(null);">Add A New Icon Style</a></b></li>
				</ul>
			</td>
			<td>
				<div id="iconstyle-form">PUT ICONSTYLE FORM HERE!</div>
			</td>
			<td width="200px">
				<div id="edit-iconstyle-tips">Tips<br/>
					Put advice here
				</div>
				<div id="edit-iconstyle-actions">Edit Icon Style Actions<br/>
					Currently no delete or expunge options
				</div>
			</td>
		</tr>
	</table>
</div> <!-- end of edit iconstyles form -->

<!-- close all iconstyles editing -->
<div id="edit-iconstyles-cancel" style="display:none;">
  <input type="button" name="closeiconstylesform" value="Close Icon Styles Editing" onclick="javascript:BitMap.EditSession.cancelEditIconStyles();" />
</div>
<!-- end iconstyles editing forms -->




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
  						<a id="plsetremove" href="javascript:BitMap.EditSession.removePolylineSet(document.polylinesetform_n);">remove</a> 
  						<a id="plsetdelete" href="javascript:BitMap.EditSession.expungePolylineSet(document.polylinesetform_n);">delete</a></td>
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
									<a name="locate_polyline_btn" title="locate on the map" href="javascript:alert('feature coming soon');">show</a>
									<a name="remove_polyline_btn" title="remove from this set" href="javascript:BitMap.EditSession.removePolyline(document.polylineform_n);">remove</a>
									<a name="expunge_polyline_btn" title="delete the polyline!" href="javascript:BitMap.EditSession.expungePolyline(document.polylineform_n);">delete</a></td>
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
							<a id="pgsetremove" href="javascript:BitMap.EditSession.removePolygonSet(document.polygonsetform_n);">remove</a> 
							<a id="pgsetdelete" href="javascript:BitMap.EditSession.expungePolygonSet(document.polygonsetform_n);">delete</a></td>
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
									<a name="locate_polygon_btn" title="locate on the map" href="javascript:alert('feature coming soon');">show</a>
									<a name="remove_polygon_btn" title="remove from this set" href="javascript:BitMap.EditSession.removePolygon(document.polygonform_n);">remove</a>
									<a name="expunge_polygon_btn" title="delete the polygon!" href="javascript:BitMap.EditSession.expungePolygon(document.polygonform_n);">delete</a></td>
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


<div id="spinner" style="z-index:1500; position:absolute; top:50%; left:50%; margin-left:-125px; margin-top:-35px; width:250px; line-height:50px; padding:25px 0; border:3px solid #ccc; background:#fff; font-weight:bold; color:#900; text-align:center; display:none;">
	{biticon ipackage=liberty iname=busy iexplain=Loading style="vertical-align:middle;"}&nbsp;&nbsp;&nbsp;&nbsp;<span id="spinner-text">{tr}Sending Request{/tr}&hellip;</span>
</div>