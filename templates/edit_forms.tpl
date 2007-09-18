<div id="editerror" style="display:none">ERROR HERE</div>

<div>
	<a id="emap" href="javascript:BitMap.EditSession.editMap({$mapInfo.gmap_id});">Edit Map</a> | 
	<a id="emaptype" href="javascript:BitMap.EditSession.editMaptypes();">Edit Maptypes</a> |
	<a id="emarker" href="javascript:BitMap.EditSession.editMarkerSets();">Edit Markers</a> | 
	<a id="epolyline" href="javascript:BitMap.EditSession.editPolylineSets();">Edit Polylines</a> | 
	<a id="epolygon" href="javascript:BitMap.EditSession.editPolygonSets();">Edit Polygons</a>
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
			<ul id="edit-tilelayers-list">
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
	<table>
		<tr>
			<td>
				<div id="markerset-form">PUT MARKERSET FORM HERE!</div>
			</td>
			<td width="200px">
				<div id="edit-markerset-options-tips">Tips<br/>
				Put advice here
				</div>
				<div id="edit-markerset-options-actions">Edit Marker Actions<br/>
				<a id="setremove" href="javascript:BitMap.EditSession.removeMarkerSet( this.form );">remove</a> 
				<a id="setdelete" href="javascript:BitMap.EditSession.expungeMarkerSet( this.form );">delete</a><br/><br/>
				<a id="setaddmarkers" href="javascript:alert('feature coming soon');">Add Markers from Archives</a>
				<div>
			</td>
		</tr>
	</table>
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
<div id="edit-polylines-menu" style="display:none;">
		<a href="javascript:BitMap.EditSession.editPolylineSet();">New Polyline Set</a> | 
		<a href="javascript:BitMap.EditSession.editPolylineStyles();">Edit Polyline Styles</a> | 
</div>

<!-- polylineset editing menu -->
<div id="edit-polylinesets-table" class="edit-table" style="display:none;">
  <h2>Polyline Sets Associated With This Map</h2>
  <div id="edit-polylineset" class="edit-titlebar" style="display:none;">
    <table class="bar">
    	<tr>
        <td width="200px"><span class="setname">Set Name Here</span></td>
      <td>
        <a class="opts" href="javascript:BitMap.EditSession.editPolylineSetOptions(n);">Edit Set Options</a> | 
        <a class="list" href="javascript:BitMap.EditSession.editPolylines(n);">Edit Polylines In This Set</a>
      </td>
    </tr>
    </table>
  </div>
</div>
<!-- end of polylineset editing menu -->

<!-- polylineset options form -->
<div id="edit-polylineset-options-table" class="edit-datatable" style="display:none;">
	<table>
		<tr>
			<td>
				<div id="polylineset-form">PUT POLYLINESET FORM HERE!</div>
			</td>
			<td width="200px">
				<div id="edit-polylineset-options-tips">Tips<br/>
				Put advice here
				</div>
				<div id="edit-polylineset-options-actions">Edit Polyline Actions<br/>
				<a id="setremove" href="javascript:BitMap.EditSession.removePolylineSet( this.form );">remove</a> 
				<a id="setdelete" href="javascript:BitMap.EditSession.expungePolylineSet( this.form );">delete</a><br/><br/>
				<a id="setaddpolylines" href="javascript:alert('feature coming soon');">Add Polylines from Archives</a>
				<div>
			</td>
		</tr>
	</table>
</div>
<!-- end of polylineset options form -->

<!-- edit polylines form -->
<div id="edit-polylines-table" class="edit-datatable" style="display:none;">
		<table>
			<tr>
				<td width="200px">Polylines:<br/>
					<ul id="edit-polylines-list">
						<li style="display:none;"><a href="javascript:BitMap.EditSession.editPolyline(n);">Polyline Name Here</a></li>
						<li id="edit-polylinelink-new"><b><a id="edit-polylinelink-new-a" href="javascript:BitMap.EditSession.newPolyline(setindex);">Add A New Polyline</a></b></li>
					</ul>
				</td>
				<td>
					<div id="polyline-form">PUT POLYLINE FORM HERE!</div>
				</td>
				<td width="200px">
					<div id="edit-polyline-tips">Tips<br/>
					   Put advice here
					</div>
					<div id="edit-polyline-actions">Edit Polyline Actions<br/>
						<a name="remove_polyline_btn" title="remove from this set" href="javascript:BitMap.EditSession.removePolyline(document.edit-polyline-form);">remove</a>
						<a name="expunge_polyline_btn" title="delete the polyline!" href="javascript:BitMap.EditSession.expungePolyline(document.edit-polyline-form);">delete</a><br/>
					</div>
				</td>
			</tr>
		</table>
	<input type="button" name="closepolylineset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditPolylines()"></br>
</div> 
<!-- edit of edit polylines form -->

<!-- close all polyline editing -->
<div id="edit-polylinesets-cancel" style="display:none;">
  <input type="button" name="closepolylineform" value="Close Polyline Editing" onclick="javascript:BitMap.EditSession.cancelEditPolylineSets();" />
</div>



<!--------------------------------
	-  Polylinestyles Editing Forms
	-------------------------------->

<!-- polylinestyle editing menu -->
<div id="edit-polylinestyles-table" class="edit-table" style="display:none;">
	<h2>Polyline Styles Associated with Polyline Sets on This Map</h2>
	<div id="edit-polylinestyles" class="edit-selected">
		<table class="bar">
			<tr>
				<td><span class="setname">Polyline Styles:</span></td>
			</tr>
		</table>
	</div>
</div>
<!-- end of polylinestyle editing menu -->

<!-- edit polylinestyles form -->
<div id="edit-polylinestyle-table" class="edit-datatable" style="display:none;">
	<table>
		<tr>
			<td width="200px"><br />
				<ul>
					<li style="display:none;"><a href="javascript:BitMap.EditSession.editPolylineStyle(n);">Polyline Style Name Here</a></li>
					<li id="edit-polylinestylelink-new"><b><a id="edit-polylinestylelink-new-a" href="javascript:BitMap.EditSession.editPolylineStyle();">Add A New Polyline Style</a></b></li>
				</ul>
			</td>
			<td>
				<div id="polylinestyle-form">PUT POLYLINESTYLE FORM HERE!</div>
			</td>
			<td width="200px">
				<div id="edit-polylinestyle-tips">Tips<br/>
					Put advice here
				</div>
				<div id="edit-polylinestyle-actions">Edit Polyline Style Actions<br/>
					Currently no delete or expunge options
				</div>
			</td>
		</tr>
	</table>
</div> <!-- end of edit polylinestyles form -->

<!-- close all polylinestyles editing -->
<div id="edit-polylinestyles-cancel" style="display:none;">
  <input type="button" name="closepolylinestylesform" value="Close Polyline Styles Editing" onclick="javascript:BitMap.EditSession.cancelEditPolylineStyles();" />
</div>
<!-- end polylinestyles editing forms -->




<!-------------------------
	-  Polygon Editing Forms
	------------------------->
<!-------------------------
	-  Polygon Editing Forms
	------------------------->

<!--polygon editing forms -->
<div id="edit-polygons-menu" style="display:none;">
		<a href="javascript:BitMap.EditSession.editPolygonSet();">New Polygon Set</a> | 
		<a href="javascript:BitMap.EditSession.editPolygonStyles();">Edit Polygon Styles</a> | 
</div>

<!-- polygonset editing menu -->
<div id="edit-polygonsets-table" class="edit-table" style="display:none;">
  <h2>Polygon Sets Associated With This Map</h2>
  <div id="edit-polygonset" class="edit-titlebar" style="display:none;">
    <table class="bar">
    	<tr>
        <td width="200px"><span class="setname">Set Name Here</span></td>
      <td>
        <a class="opts" href="javascript:BitMap.EditSession.editPolygonSetOptions(n);">Edit Set Options</a> | 
        <a class="list" href="javascript:BitMap.EditSession.editPolygons(n);">Edit Polygons In This Set</a>
      </td>
    </tr>
    </table>
  </div>
</div>
<!-- end of polygonset editing menu -->

<!-- polygonset options form -->
<div id="edit-polygonset-options-table" class="edit-datatable" style="display:none;">
	<table>
		<tr>
			<td>
				<div id="polygonset-form">PUT POLYGONSET FORM HERE!</div>
			</td>
			<td width="200px">
				<div id="edit-polygonset-options-tips">Tips<br/>
				Put advice here
				</div>
				<div id="edit-polygonset-options-actions">Edit Polygon Actions<br/>
				<a id="setremove" href="javascript:BitMap.EditSession.removePolygonSet( this.form );">remove</a> 
				<a id="setdelete" href="javascript:BitMap.EditSession.expungePolygonSet( this.form );">delete</a><br/><br/>
				<a id="setaddpolygons" href="javascript:alert('feature coming soon');">Add Polygons from Archives</a>
				<div>
			</td>
		</tr>
	</table>
</div>
<!-- end of polygonset options form -->

<!-- edit polygons form -->
<div id="edit-polygons-table" class="edit-datatable" style="display:none;">
		<table>
			<tr>
				<td width="200px">Polygons:<br/>
					<ul id="edit-polygons-list">
						<li style="display:none;"><a href="javascript:BitMap.EditSession.editPolygon(n);">Polygon Name Here</a></li>
						<li id="edit-polygonlink-new"><b><a id="edit-polygonlink-new-a" href="javascript:BitMap.EditSession.newPolygon(setindex);">Add A New Polygon</a></b></li>
					</ul>
				</td>
				<td>
					<div id="polygon-form">PUT POLYGON FORM HERE!</div>
				</td>
				<td width="200px">
					<div id="edit-polygon-tips">Tips<br/>
					   Put advice here
					</div>
					<div id="edit-polygon-actions">Edit Polygon Actions<br/>
						<a name="remove_polygon_btn" title="remove from this set" href="javascript:BitMap.EditSession.removePolygon(document.edit-polygon-form);">remove</a>
						<a name="expunge_polygon_btn" title="delete the polygon!" href="javascript:BitMap.EditSession.expungePolygon(document.edit-polygon-form);">delete</a><br/>
					</div>
				</td>
			</tr>
		</table>
	<input type="button" name="closepolygonset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditPolygons()"></br>
</div> 
<!-- edit of edit polygons form -->

<!-- close all polygon editing -->
<div id="edit-polygonsets-cancel" style="display:none;">
  <input type="button" name="closepolygonform" value="Close Polygon Editing" onclick="javascript:BitMap.EditSession.cancelEditPolygonSets();" />
</div>
<!--end polygon editing forms -->


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



<div id="spinner" style="z-index:1500; position:absolute; top:50%; left:50%; margin-left:-125px; margin-top:-35px; width:250px; line-height:50px; padding:25px 0; border:3px solid #ccc; background:#fff; font-weight:bold; color:#900; text-align:center; display:none;">
	{biticon ipackage=liberty iname=busy iexplain=Loading style="vertical-align:middle;"}&nbsp;&nbsp;&nbsp;&nbsp;<span id="spinner-text">{tr}Sending Request{/tr}&hellip;</span>
</div>