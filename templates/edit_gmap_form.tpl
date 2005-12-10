{* submit/XMLHttpRequest functions called from this form are created in formsubmit.js *}

{* THIS TEMPLATE's STRUCTURE

div id.maptoolsbar
  div id.maptools
			form name/id.mapform
				 table
					 input id.map_id
					 input id.map_title
					 input id.map_desc
					 input id.map_comm
					 input id.map_w
					 input id.map_h
					 input id.map_lat
					 input id.map_lon
					 input id.map_z //zoom level
					 input id.map_showcont
					 input id.map_showscale
					 input id.map_showtypecont
 					 input id.map_type

			form name/id.maptypesform
			   table
            input id.map_typeid[id]
            input id.map_typename[id]
            input id.map_typebase[id]
            input id.map_typetileurl[id]
            input id.map_typeoverurl[id]
            input id.map_typeinclude[id]

			form name/id.markersetsform
			   table
				   input id.map_markersetid[n]
					 input id.map_markerlaunch[n]
					 input id.map_markerside[n]

			form name/id.linesetsform
			   table
				   input id.map_linesetid[n]
					 input id.map_linelaunch[n]
					 input id.map_lineside[n]

			form name/id.polysetsform
			   table
				   input id.map_polysetid[n]
					 input id.map_polylaunch[n]
					 input id.map_polyside[n]


  div id.markertools
			form name/id.markerform
				  table
					 input id.marker_id
					 input id.marker_name
					 input id.marker_lat
					 input id.marker_lon
//@todo wj: marker_incotype should be iconname and it needs to be selected as a part of the set styles...it is not assigneed individually
					 input id.marker_icontype
					 input id.marker_wintext
					 input id.marker_style
					 input id.marker_labeltext
					 input id.marker_zi
					 input id.icon_id
					 input id.icon_name
					 input id.icon_type
					 input id.icon_img
					 input id.icon_w
					 input id.icon_h
					 input id.icon_shadow
					 input id.icon_shadoww
					 input id.icon_shadowh
					 input id.icon_anchorx
					 input id.icon_anchory
					 input id.icon_winanchorx
					 input id.icon_winanchory
					 input id.marker_styid
					 input id.marker_styname
					 input id.marker_stytype
					 input id.icon_hoverimg
					 input id.icon_hoverop
					 input id.icon_labelop
					 input id.icon_hoverstyle
					 input id.marker_winstyle


  div id.polytools
			form name/id.polyform
			   table
					 input id.line_id
					 input id.line_name
					 input id.line_type
					 input id.line_data
					 input id.line_style
					 input id.line_bordertext
					 input id.line_zi

		     table
					 input id.line_styid
					 input id.line_styname
					 input id.line_color
					 input id.line_weight
					 input id.line_op
					 input id.line_pattern
					 input id.line_seg
					 input id.line_beginarrow
					 input id.line_endarrow
					 input id.line_arrowint
					 input id.line_font
					 input id.line_textint
					 input id.line_txtfgcolor
					 input id.line_txtfgweight
					 input id.line_txtfgop
					 input id.line_txtfgzi
					 input id.line_txtbgcolor
					 input id.line_txtbgweight
					 input id.line_txtbgop
					 input id.line_txtbgzi

		     table
					 input id.poly_id
					 input id.poly_name
					 input id.poly_type
					 input id.poly_data
					 input id.poly_center
					 input id.poly_radius
					 input id.poly_borderstyle
					 input id.poly_style
					 input id.poly_bordertext
					 input id.poly_zi

		     table
					 input id.poly_styid
					 input id.poly_styname
					 input id.poly_color
					 input id.poly_weight
					 input id.poly_op

//end of id tree *}



<div id="maptoolsbar">
<div id="maptools">
    <h3>Map Tools</h3>
    <FORM action="javascript:;" name="mapform" id="mapform">
		   Map Id {$gContent->mInfo.gmap_id}<INPUT name="map_id" id="map_id" type="hidden" size="25" value="{$gContent->mInfo.gmap_id}"><br/>
    	 Title <INPUT name="map_title" id="map_title" type="text" size="25" value="{$gContent->mInfo.title}"><br/>
    	 Description <INPUT name="map_desc" id="map_desc" type="text" size="25" value="{$gContent->mInfo.description}"><br/>
    	 Width <INPUT name="map_w" id="map_w" type="text" size="25" value="{$gContent->mInfo.width}"><br/>
    	 Height <INPUT name="map_h" id="map_h" type="text" size="25" value="{$gContent->mInfo.height}"><br/>
    	 Latitude <INPUT name="map_lat" id="map_lat"type="text" size="25" value="{$gContent->mInfo.lat}"><br/>
    	 Longitude <INPUT name="map_lon" id="map_lon" type="text" size="25" value="{$gContent->mInfo.lon}"><br/>
    	 Zoom Level <INPUT name="map_z" id="map_z" type="text" size="25" value="{$gContent->mInfo.zoom_level}"><br/>
    	 Show Controls <SELECT name="map_showcont" id="map_showcont">
          <OPTION value="s" {if $gContent->mInfo.show_controls == "s"}SELECTED{/if}>Small</OPTION>
          <OPTION value="l" {if $gContent->mInfo.show_controls == "l"}SELECTED{/if}>Large</OPTION>
          <OPTION value="z" {if $gContent->mInfo.show_controls == "z"}SELECTED{/if}>Zoom Only</OPTION>
          <OPTION value="n" {if $gContent->mInfo.show_controls == "n"}SELECTED{/if}>None</OPTION>
          </SELECT><br/>
    	 Show Scale <SELECT name="map_showscale" id="map_showscale">
          <OPTION value="1" {if $gContent->mInfo.show_scale == 1}SELECTED{/if}>Yes</OPTION>
          <OPTION value="0" {if $gContent->mInfo.show_scale == 0}SELECTED{/if}>No</OPTION>
          </SELECT><br/>
    	 Show Map Type Buttons <SELECT name="map_showtypecont" id="map_showtypecont">
          <OPTION value="1" {if $gContent->mInfo.show_typecontrols == 1}SELECTED{/if}>Yes</OPTION>
          <OPTION value="0" {if $gContent->mInfo.show_typecontrols == 0}SELECTED{/if}>No</OPTION>
          </SELECT><br/>
    	 Default Map Type
    			 <SELECT name="map_type" id="map_type">
          <OPTION value="G_MAP_TYPE" {if $gContent->mInfo.map_type == "G_MAP_TYPE"}SELECTED{/if}>Street Map</OPTION>
          <OPTION value="G_SATELLITE_TYPE" {if $gContent->mInfo.map_type == "G_SATELLITE_TYPE"}SELECTED{/if}>Satellite</OPTION>
          <OPTION value="G_HYBRID_TYPE" {if $gContent->mInfo.map_type == "G_HYBRID_TYPE"}SELECTED{/if}>Hybrid</OPTION>
    			<!-- //add additional maptypes attached to this map -->
          {if count($gContent->mMapTypes) > 0}
          {section name=addonmt loop=$gContent->mMapTypes}
					{$typeid = $gContent->mMapTypes[addonmt].maptype_id}
          <OPTION value="{$gContent->mMapTypes[addonmt].name}" {if $gContent->mInfo.map_type == $gContent->mMapTypes[addonmt].name}SELECTED{/if}>{$gContent->mMapTypes[addonmt].name}</OPTION>
          {/section}
					{/if}
    			</SELECT><br/>
    	 Allow Comments <INPUT name="map_comm" id="map_comm" type="checkbox" value="True"><br/>
    <INPUT type="button" name="mapsubmit" value="Submit" onclick="javascript:get('store_gmap.php', this.parentNode);"><br/>
    </FORM><br/><br/>



    <!-- Additional Map Types Table -->
		<h3>Additional Map Types</h3>
    <form action="javascript:;" name="maptypesform" id="maptypesform">
          {if count($gContent->mMapTypes) > 0}
          {section name=mtype loop=$gContent->mMapTypes}
    			Type Id <input name="map_typeid_{$gContent->mMapTypes[mtype].maptype_id}" id="map_typeid_{$gContent->mMapTypes[mtype].maptype_id}" type="hidden" value="{$gContent->mMapTypes[mtype].maptype_id}"><br/>
					Name <input name="map_typename_{$gContent->mMapTypes[mtype].maptype_id}" id="map_typename_{$gContent->mMapTypes[mtype].maptype_id}" type="text" value="{$gContent->mMapTypes[mtype].name}"><br/>
					Base Type <select name="map_typebase_{$gContent->mMapTypes[mtype].maptype_id}" id="map_typebase_{$gContent->mMapTypes[mtype].maptype_id}">
              <option value="0" {if $gContent->mMapTypes[mtype].basetype == "0"}SELECTED{/if}>Street</option>
              <option value="1" {if $gContent->mMapTypes[mtype].basetype == "1"}SELECTED{/if}>Satellite</option>
              <option value="1" {if $gContent->mMapTypes[mtype].basetype == "2"}SELECTED{/if}>Hybrid</option>
							</select><br/>
    			Base Tiles Url <input name="map_typetileurl_{$gContent->mMapTypes[mtype].maptype_id}" id="map_typetileurl_{$gContent->mMapTypes[mtype].maptype_id}" type="text" value="{$gContent->mMapTypes[mtype].maptiles_url}"><br/>
    			Overlay Tiles Url <input name="map_typeoverurl_{$gContent->mMapTypes[mtype].maptype_id}" id="map_typeoverurl_{$gContent->mMapTypes[mtype].maptype_id}" type="text" value="{$gContent->mMapTypes[mtype].hybridtiles_url}"><br/>
    			Include With This Map <input name="map_typeinclude_{$gContent->mMapTypes[mtype].maptype_id}" id="map_typeinclude_{$gContent->mMapTypes[mtype].maptype_id}" type="checkbox" value="{$gContent->mInfo.gmap_id}"><br/>
          {/section}
					{/if}
    <input type="button" name="maptypessubmit" value="Submit" onclick="javascript:get('store_maptype.php', this.parentNode);">
    </form><br/>


    <!-- Marker Sets Table -->
		<h3>Marker Sets</h3>
    <form action="javascript:;" name="markersetsform" id="markersetsform">
					Marker Sets<b></td>
					Set Id <input name="map_markersetid[n]" id="map_markersetid[n]" type="text" value="[n]">
					Set Name <input name="map_markersetname[n]" id="map_markersetname[n]" type="text" value="[n]">
    			Include On Launch <input name="map_markerlaunch[n]" id="map_markerlaunch[n]" type="checkbox" value="True">
    			Include In Side Pane <input name="map_markerside[n]" id="map_markerside[n]" type="checkbox" value="True">
    <input type="button" name="markersetssubmit" value="Submit" onclick="javascript:get('store_markersets.php', this.parentNode);">
    </form>


    <!-- Polyline Sets Table -->
    <form action="javascript:;" name="linesetsform" id="linesetsform">
    <table>
    	<tr><td><b>Polylines Sets<b></td>
					<td>Set Id</td>
    			<td>Include On Launch</td>
    			<td>Include In Side Pane</td>
    			<td>Edit</td></tr>
    	<tr><td><!--//@todo name from db-->*Sample Polyline Set1*</td>
    			<td><input name="map_linesetid[n]" id="map_linesetid[n]" type="text" value="[n]"></td>
    			<td><input name="map_linelaunch1" id="map_linelaunch1" type="checkbox" value="True"></td>
    			<td><input name="map_lineside1" id="map_lineside1" type="checkbox" value="True"></td>
    			<td>*Link*</td></tr>
    </table>
    <input type="button" name="linesetssubmit" value="Submit" onclick="javascript:get(this.parentNode);">
    </form>



    <!-- Polygon Sets Table -->
    <form action="javascript:;" name="polysetsform" id="polysetsform">
    <table>
    	<tr><td><b>Polygon Sets<b></td>
					<td>Set Id</td>
    			<td>Include On Launch</td>
    			<td>Include In Side Pane</td>
    			<td>Edit</td></tr>
    	<tr><td><!--//@todo name from db-->*Sample Polygon Set1*</td>
    			<td><input name="map_polysetid[n]" id="map_polysetid[n]" type="text" value="[n]"></td>
    			<td><input name="map_polylaunch1" id="map_polylaunch1" type="checkbox" value="True"></td>
    			<td><input name="map_polyside1" id="map_polyside1" type="checkbox" value="True"></td>
    			<td>*Link*</td></tr>
    </table>
    <input type="button" name="polysetssubmit" value="Submit" onclick="javascript:get(this.parentNode);">
    </form>

    </form>
</div>








<div id="markertools">



		<table>
    	<tr><td><b>Custom Icon Tools</b></td></tr>
    	<tr><td>Id</td><td><input name="icon_id" id="icon_id" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="icon_name" id="icon_name" type="text" size="25" value="Some Name"></td></tr>
    	<tr><td>Type</td><td><select name="icon_type" id="icon_type" >
     					<option>GIcon</option>
    					<option>XIcon</option></select></td></tr>
    	<tr><td>Icon Image Path</td><td><input name="icon_img" id="icon_img" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Image Width Size</td><td><input name="icon_w" id="icon_w" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Image Height Size</td><td><input name="icon_h" id="icon_h" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Shadow Image Path</td><td><input name="icon_shadow" id="icon_shadow" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Shadow Width Size</td><td><input name="icon_shadoww" id="icon_shadoww" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Shadow Height Size</td><td><input name="icon_shadowh" id="icon_shadowh" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Icon Anchor x</td><td><input name="icon_anchorx" id="icon_anchorx" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Icon Anchor y</td><td><input name="icon_anchory" id="icon_anchory" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Info Window Anchor x</td><td><input name="icon_winanchorx" id="icon_winanchorx" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Info Window Anchor y</td><td><input name="icon_winanchory" id="icon_winanchory" type="text" size="25" value="Some Value"></td></tr>
		</table>

    <h4>Custom Marker Styles</h4>
		<table>
    	<tr><td>Id</td><td><input name="marker_styid" id="marker_styid" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="marker_styname" id="marker_styname" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Type</td><td><select name="marker_stytype" id="marker_stytype">
     					<option>PdMarker</option>
    					<option>XMarker</option></select></td></tr>
    	<tr><td><small>(PdMarker Class Only)</small></td></tr>
    	<tr><td>Icon Hover Image Path</td><td><input name="icon_hoverimg" id="icon_hoverimg" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Label Hover Opacity</td><td><input name="icon_hoverop" id="icon_hoverop" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Label Opacity</td><td><input name="icon_labelop" id="icon_labelop" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Label Hover Styles</td><td><input name="icon_hoverstyle" id="icon_hoverstyle" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Window Styles</td><td><input name="marker_winstyle" id="marker_winstyle" type="text" size="25" value="Some Value"></td></tr>
		</table>
</div>



<div id="polytools">

    <h4>Polyline Styles</h4>
		<table>
    	<tr><td>Id</td><td><input name="line_styid" id="line_styid" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="line_styname" id="line_styname" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Color</td><td><input name="line_color" id="line_color" type="text" size="25" value="Hex Value"></td></tr>
    	<tr><td>Weight</td><td><input name="line_weight" id="line_weight" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Opacity</td><td><input name="line_op" id="line_op" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Pattern</td><td><input name="line_pattern" id="line_patter" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Segment_count</td><td><input name="line_seg" id="line_seg" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Begin Arrow</td><td><input name="line_beginarrow" id="line_beginarrow" type="checkbox" value="True"></td></tr>
    	<tr><td>End Arrow</td><td><input name="line_endarrow" id="line_endarrow" type="checkbox" value="True"></td></tr>
    	<tr><td>Arrows Every</td><td><input name="line_arrowint" id="line_arrowint" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Font (CSS)</td><td><input name="line_font" id="line_font" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Text Every</td><td><input name="line_textint" id="line_textint" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Text fgstyle_color</td><td><input name="line_txtfgcolor" id="line_txtfgcolor" type="Text" size="25" value="Hex Value"></td></tr>
    	<tr><td>Text fgstyle_weight</td><td><input name="line_txtfgweight" id="line_txtfgweight" type="Text" size="25" value="A Number"></td></tr>
    	<tr><td>Text fgstyle_opacity</td><td><input name="line_txtfgop" id="line_txtfgop" type="Text" size="25" value="A Number"></td></tr>
    	<tr><td>Text fgstyle_zindex</td><td><input name="line_txtfgzi" id="line_txtfgzi" type="Text" size="25" value="A Number"></td></tr>
    	<tr><td>Text bgstyle_color</td><td><input name="line_txtbgcolor" id="line_txtbgcolor" type="Text" size="25" value="Hex Value"></td></tr>
    	<tr><td>Text bgstyle_weight</td><td><input name="line_txtbgweight" id="line_txtbgweight" type="Text" size="25" value="A Number"></td></tr>
    	<tr><td>Text bgstyle_opacity</td><td><input name="line_txtbgop" id="line_txtbgop" type="Text" size="25" value="A Number"></td></tr>
    	<tr><td>Text bgstyle_zindex</td><td><input name="line_txtbgzi" id="line_txtbgzi" type="Text" size="25" value="A Number"></td></tr>
		</table>

    <h3>Polygon Tools</h3>
		<table>
    	<tr><td><b>Polygon</b></td></tr>
    	<tr><td>Id</td><td><input name="poly_id" id="poly_id" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="poly_name" id="poly_name" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Type</td><td><select name="poly_type" id="poly_type">
    					<option>Polygon</option>
    					<option>Circle</option></select></td></tr>
    	<tr><td>Points Data</td><td><textarea name="poly_data" id="poly_data" cols="30" rows="2">An Array</textarea></td></tr>
    	<tr><td>Center</td><td><input name="poly_center" id="poly_center" type="Text" size="25" value="A Lat/Lon Array"></td></tr>
    	<tr><td>Radius</td><td><input name="poly_radius" id="poly_radius" type="Text" size="25" value="A Number"></td></tr>
    	<tr><td>Border Style</td><td><select name="poly_borderstyle" id="poly_borderstyle">
    					<option>Custom 1</option>
    					<option>Custom 2</option></select></td></tr>
    	<tr><td>(this is a polyline style)</td></tr>
    	<tr><td>Style</td><td><select name="poly_style" id="poly_style">
     					<option>Custom 1</option>
    					<option>Custom 2</option></select></td></tr>
    	<tr><td>(this is a polygon style)</td></tr>
    	<tr><td>Border Text</td><td><input name="poly_bordertext" id="poly_bordertext" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>zIndex</td><td><input name="poly_zi" id="poly_zi" type="text" size="25" value="A Number"></td></tr>
    </table>

    <h4>Polygon Style</h4>
		<table>
    	<tr><td>Id</td><td><input name="poly_styid" id="poly_styid" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="poly_styname" id="poly_styname" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Color</td><td><input name="poly_color" id="poly_color" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Weight</td><td><input name="poly_weight" id="poly_weight" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Opacity</td><td><input name="poly_op" id="poly_op" type="text" size="25" value="A Number"></td></tr>
		</table>

</div>
</div>