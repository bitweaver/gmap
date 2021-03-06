
{* setup tabpane manually so we can add onclick event to tabs *}
{jstabs}
	<span style="float:right" id="ecancel-span" {if !$gContent->isValid()}style="display:none"{/if}><a id="ecancel" href="{$gContent->mInfo.display_url}" title="End editing sesssion">View Map</a></span>
	{jstab title="Edit Map" onclick="BitMap.EditSession.editMap(`$mapInfo.gmap_id`);"}
		{*	------------------------
			-   Map Editing Form
			-	we ajax the contents in
			------------------------ *}
		<div id="map-form" style="display:none;"></div>
	{/jstab}


	
	{jstab title="Edit Maptypes" onclick="BitMap.EditSession.editMaptypes();"}
		{* 	------------------------
			-   Maptype Editing Form
			------------------------ *}

		<!-- maptype editing menu -->
		<div id="edit-maptypes-menu" style="display:none;">
				<a href="javascript:void(0)" onclick="BitMap.EditSession.editMaptype();">New Maptype</a>
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
							<a class="opts" href="javascript:void(0)" onclick="BitMap.EditSession.editMaptype(n);">Edit Maptype Options</a> |
							<a class="list" href="javascript:void(0)" onclick="BitMap.EditSession.editMaptypeTilelayers(n);">Edit Tilelayers In This Maptype</a>
						</td>
						<td width="10px" style="text-align:right">
							<a title="close options editing" href="javascript:void(0)" onclick="javascript:BitMap.EditSession.cancelEditMaptype();"><img src="{$smarty.const.GMAP_PKG_URL}icons/close.gif"></a>
							<!-- <input type="button" name="closemaptypeform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditMaptype()" /> -->
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
						<div id="maptype-form" class="edit-form">PUT MAPTYPE FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-maptype-tips">Tips<br />
							Put advice here
						</div>
						<div id="edit-maptype-options-actions">Edit Maptype Actions<br />
							<a id="locate_maptype_btn" title="show on the map" href="javascript:void(0)">show</a><br />
							<a id="remove_maptype_btn" title="remove from this map" href="javascript:void(0)">remove</a><br />
							<a id="expunge_maptype_btn" title="delete the maptype!" href="javascript:void(0)">delete</a><br />
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
					<td width="200px">Tilelayers:<br />
						<ul id="edit-tilelayers-list">
							<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editTilelayer(n);">Tilelayer Name Here</a></li>
							<li id="edit-tilelayerlink-new"><strong><a id="edit-tilelayerlink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.newTilelayer(setindex);">Add A New Tilelayer</a></strong></li>
						</ul>
					</td>
					<td>
						<div id="tilelayer-form" class="edit-form"></div>
					</td>
					<td width="200px">
						<div id="edit-tilelayer-tips">Tips<br />
							Put advice here
						</div>
						<div id="edit-tilelayer-actions">Edit Marker Actions<br />
							<a id="remove_tilelayer_btn" title="remove from this maptype" href="javascript:void(0)">remove</a><br />
							<a id="expunge_tilelayer_btn" title="delete the tilelayer!" href="javascript:void(0)">delete</a><br /><br />
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
									<strong><a id="edit-copyrightlink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.editCopyright(copyrightindex, tilelayerindex);">Add A New Copyright</a></strong>
								</div>
								<div id="edit-copyrightlink" style="display:none;">
									<a href="javascript:void(0)" onclick="BitMap.EditSession.editCopyright(n);">Copyright Notice Here</a>
								</div>
							</div>
						</div>
					</td>
					<td width="200px">
					</td>
				</tr>
			</table>
			<input type="button" name="closetilelayerset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditTilelayers()" />
		</div>
		<!-- edit of edit tilelayers form -->


		<!-- edit copyrights form -->
		<div id="edit-copyright-table" style="display:none;">
			<div id="copyright-form" class="edit-form">PUT COPYRIGHT FORM HERE!</div>
		</div>
		<!-- edit of edit copyrights form -->
	{/jstab}



	<!-------------------------
		-  Markerset and Marker Editing Forms
		------------------------->
	{jstab title="Edit Markers" onclick="BitMap.EditSession.editMarkerSets();"}
		{jstabs}

		{jstab title="Marker Sets" onclick="BitMap.EditSession.editMarkerSets();"}
		<!-- marker editing menu -->
		<div id="edit-markers-menu">
				<a href="javascript:void(0)" onclick="BitMap.EditSession.editMarkerSet();">New Marker Set</a>
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
					<a class="opts" href="javascript:void(0)" onclick="BitMap.EditSession.editMarkerSet(n);">Edit Set Options</a> |
					<a class="list" href="javascript:void(0)" onclick="BitMap.EditSession.editMarkers(n);">Edit Markers In This Set</a>
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
					<td width="200px">
					</td>
					<td>
						<div id="markerset-form" class="edit-form">PUT MARKERSET FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-markerset-options-tips">Tips<br />
						Put advice here
						</div>
						<div id="edit-markerset-options-actions">Edit Marker Actions<br />
						<a id="remove_markerset_btn" title="remove from this set from this map" href="javascript:void(0)">remove</a><br />
						<a id="expunge_markerset_btn" title="delete this marker set!" href="javascript:void(0)">delete</a><br /><br />
						{* uncomment when available <a id="setaddmarkers" href="javascript:void(0)" onclick="">Add Markers from Archives</a> *}
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
						<td width="200px">Markers:<br />
							<ul id="edit-markers-list">
								<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editMarker(n);">Marker Name Here</a></li>
								<li id="edit-markerlink-new"><strong><a id="edit-markerlink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.newMarker(setindex);">Add A New Marker</a></strong></li>
							</ul>
						<td>
							<div id="marker-form">PUT MARKER FORM HERE!</div>
						</td>
						<td width="200px">
							<div id="edit-marker-tips">Tips<br />
							   Put advice here
							</div>
							<div id="edit-marker-actions">Edit Marker Actions<br />
								<a id="locate_marker_btn" title="locate on the map" href="javascript:void(0)">show</a><br />
								<a id="remove_marker_btn" title="remove from this set" href="javascript:void(0)">remove</a><br />
								<a id="expunge_marker_btn" title="delete the marker!" href="javascript:void(0)">delete</a><br />
							</div>
						</td>
					</tr>
				</table>
			<input type="button" name="closemarkerset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditMarkers()" />
		</div>
		<!-- edit of edit markers form -->
		{/jstab}



		{jstab title="Marker Styles" onclick="BitMap.EditSession.editMarkerStyles();"}
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
							<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editMarkerStyle(n);">Marker Style Name Here</a></li>
							<li id="edit-markerstylelink-new"><strong><a id="edit-markerstylelink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.editMarkerStyle();">Add A New Marker Style</a></strong></li>
						</ul>
					</td>
					<td>
						<div id="markerstyle-form" class="edit-form">PUT MARKERSTYLE FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-markerstyle-tips">Tips<br />
							Put advice here
						</div>
						<div id="edit-markerstyle-actions">Edit Marker Style Actions<br />
							Currently no delete or expunge options
						</div>
					</td>
				</tr>
			</table>
		</div> <!-- end of edit markerstyles form -->
		<!-- end markerstyles editing forms -->
		{/jstab}


		{jstab title="Icon Styles" onclick="BitMap.EditSession.editIconStyles();"}
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
							<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editIconStyle(n);">Icon Style Name Here</a></li>
							<li id="edit-iconstylelink-new"><strong><a id="edit-iconstylelink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.editIconStyle(null);">Add A New Icon Style</a></strong></li>
						</ul>
					</td>
					<td>
						<div id="iconstyle-form" class="edit-form">PUT ICONSTYLE FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-iconstyle-tips">Tips<br />
							Put advice here
						</div>
						<div id="edit-iconstyle-actions">Edit Icon Style Actions<br />
							Currently no delete or expunge options
						</div>
					</td>
				</tr>
			</table>
		</div> <!-- end of edit iconstyles form -->
		<!-- end iconstyles editing forms -->
		{/jstab}
		{/jstabs}
	{/jstab}



	<!-------------------------
		-  Polyline Editing Forms
		------------------------->
	{jstab title="Edit Polylines" onclick="BitMap.EditSession.editPolylineSets();"}
		<!--polyline editing forms -->
		<div id="edit-polylines-menu" style="display:none;">
				<a href="javascript:void(0)" onclick="BitMap.EditSession.editPolylineSet();">New Polyline Set</a> |
				<a href="javascript:void(0)" onclick="BitMap.EditSession.editPolylineStyles();">Edit Polyline Styles</a> |
		</div>

		<!-- polylineset editing menu -->
		<div id="edit-polylinesets-table" class="edit-table" style="display:none;">
		  <h2>Polyline Sets Associated With This Map</h2>
		  <div id="edit-polylineset" class="edit-titlebar" style="display:none;">
			<table class="bar">
				<tr>
				<td width="200px"><span class="setname">Set Name Here</span></td>
			  <td>
				<a class="opts" href="javascript:void(0)" onclick="BitMap.EditSession.editPolylineSetOptions(n);">Edit Set Options</a> |
				<a class="list" href="javascript:void(0)" onclick="BitMap.EditSession.editPolylines(n);">Edit Polylines In This Set</a>
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
					<td width="200px">
					</td>
					<td>
						<div id="polylineset-form">PUT POLYLINESET FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-polylineset-options-tips">Tips<br />
						Put advice here
						</div>
						<div id="edit-polylineset-options-actions">Edit Polyline Actions<br />
						<a id="remove_polylineset_btn" title="remove from this set from this map" href="javascript:void(0)">remove</a><br />
						<a id="expunge_polylineset_btn" title="delete this polyline set!" href="javascript:void(0)">delete</a><br /><br />
						{* uncomment when it works <a id="setaddpolylines" href="javascript:void(0)" onclick="alert('feature coming soon');">Add Polylines from Archives</a> *}
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
						<td width="200px">Polylines:<br />
							<ul id="edit-polylines-list">
								<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editPolyline(n);">Polyline Name Here</a></li>
								<li id="edit-polylinelink-new"><strong><a id="edit-polylinelink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.newPolyline(setindex);">Add A New Polyline</a></strong></li>
							</ul>
						</td>
						<td>
							<div id="polyline-form">PUT POLYLINE FORM HERE!</div>
						</td>
						<td width="200px">
							<div id="edit-polyline-tips">Tips<br />
							   Put advice here
							</div>
							<div id="edit-polyline-actions">Edit Polyline Actions<br />
								<a id="remove_polyline_btn" title="remove from this set" href="javascript:void(0)">remove</a><br />
								<a id="expunge_polyline_btn" title="delete the polyline!" href="javascript:void(0)">delete</a><br /><br />
							</div>
						</td>
					</tr>
				</table>
			<input type="button" name="closepolylineset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditPolylines()" />
		</div>
		<!-- edit of edit polylines form -->




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
							<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editPolylineStyle(n);">Polyline Style Name Here</a></li>
							<li id="edit-polylinestylelink-new"><strong><a id="edit-polylinestylelink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.editPolylineStyle();">Add A New Polyline Style</a></strong></li>
						</ul>
					</td>
					<td>
						<div id="polylinestyle-form">PUT POLYLINESTYLE FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-polylinestyle-tips">Tips<br />
							Put advice here
						</div>
						<div id="edit-polylinestyle-actions">Edit Polyline Style Actions<br />
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
	{/jstab}




	<!-------------------------
		-  Polygon Editing Forms
		------------------------->
	{jstab title="Edit Polygons" onclick="BitMap.EditSession.editPolygonSets();"}
		<!--polygon editing forms -->
		<div id="edit-polygons-menu" style="display:none;">
				<a href="javascript:void(0)" onclick="BitMap.EditSession.editPolygonSet();">New Polygon Set</a> |
				<a href="javascript:void(0)" onclick="BitMap.EditSession.editPolygonStyles();">Edit Polygon Styles</a> |
		</div>

		<!-- polygonset editing menu -->
		<div id="edit-polygonsets-table" class="edit-table" style="display:none;">
		  <h2>Polygon Sets Associated With This Map</h2>
		  <div id="edit-polygonset" class="edit-titlebar" style="display:none;">
			<table class="bar">
				<tr>
				<td width="200px"><span class="setname">Set Name Here</span></td>
			  <td>
				<a class="opts" href="javascript:void(0)" onclick="BitMap.EditSession.editPolygonSetOptions(n);">Edit Set Options</a> |
				<a class="list" href="javascript:void(0)" onclick="BitMap.EditSession.editPolygons(n);">Edit Polygons In This Set</a>
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
					<td width="200px">
					</td>
					<td>
						<div id="polygonset-form">PUT POLYGONSET FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-polygonset-options-tips">Tips<br />
						Put advice here
						</div>
						<div id="edit-polygonset-options-actions">Edit Polygon Actions<br />
						<a id="remove_polygonset_btn" title="remove from this set from this map" href="javascript:void(0)">remove</a><br />
						<a id="expunge_polygonset_btn" title="delete this polygon set!" href="javascript:void(0)">delete</a><br /><br />
						{* uncomment when it works <a id="setaddpolygons" href="javascript:void(0)" onclick="alert('feature coming soon');">Add Polygons from Archives</a> *}
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
						<td width="200px">Polygons:<br />
							<ul id="edit-polygons-list">
								<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editPolygon(n);">Polygon Name Here</a></li>
								<li id="edit-polygonlink-new"><strong><a id="edit-polygonlink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.newPolygon(setindex);">Add A New Polygon</a></strong></li>
							</ul>
						</td>
						<td>
							<div id="polygon-form">PUT POLYGON FORM HERE!</div>
						</td>
						<td width="200px">
							<div id="edit-polygon-tips">Tips<br />
							   Put advice here
							</div>
							<div id="edit-polygon-actions">Edit Polygon Actions<br />
								<a id="remove_polygon_btn" title="remove from this set" href="javascript:void(0)">remove</a><br />
								<a id="expunge_polygon_btn" title="delete the polygon!" href="javascript:void(0)">delete</a><br /><br />
							</div>
						</td>
					</tr>
				</table>
			<input type="button" name="closepolygonset" value="Close This Set" onclick="javascript:BitMap.EditSession.cancelEditPolygons()" />
		</div>
		<!--end polygon editing forms -->


		<!--------------------------------
			-  Polygonstyles Editing Forms
			-------------------------------->

		<!-- polygonstyle editing menu -->
		<div id="edit-polygonstyles-table" class="edit-table" style="display:none;">
			<h2>Polygon Styles Associated with Polygon Sets on This Map</h2>
			<div id="edit-polygonstyles" class="edit-selected">
				<table class="bar">
					<tr>
						<td><span class="setname">Polygon Styles:</span></td>
					</tr>
				</table>
			</div>
		</div>
		<!-- end of polygonstyle editing menu -->

		<!-- edit polygonstyles form -->
		<div id="edit-polygonstyle-table" class="edit-datatable" style="display:none;">
			<table>
				<tr>
					<td width="200px"><br />
						<ul>
							<li style="display:none;"><a href="javascript:void(0)" onclick="BitMap.EditSession.editPolygonStyle(n);">Polygon Style Name Here</a></li>
							<li id="edit-polygonstylelink-new"><strong><a id="edit-polygonstylelink-new-a" href="javascript:void(0)" onclick="BitMap.EditSession.editPolygonStyle();">Add A New Polygon Style</a></strong></li>
						</ul>
					</td>
					<td>
						<div id="polygonstyle-form" class="edit-form">PUT POLYLINESTYLE FORM HERE!</div>
					</td>
					<td width="200px">
						<div id="edit-polygonstyle-tips">Tips<br />
							Put advice here
						</div>
						<div id="edit-polygonstyle-actions">Edit Polygon Style Actions<br />
							Currently no delete or expunge options
						</div>
					</td>
				</tr>
			</table>
		</div> <!-- end of edit polygonstyles form -->

		<!-- close all polygonstyles editing -->
		<div id="edit-polygonstyles-cancel" style="display:none;">
		  <input type="button" name="closepolygonstylesform" value="Close Polygon Styles Editing" onclick="javascript:BitMap.EditSession.cancelEditPolygonStyles();" />
		</div>
		<!-- end polygonstyles editing forms -->
	{/jstab}

	{if $gBitUser->isAdmin() && $gmap_debug}
	{jstab title="Errors"}
		<div id="editerror">Javascript errors will print here.</div>
	{/jstab}
	{/if}
{/jstabs}

