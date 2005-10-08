<html>

{* submit/XMLHttpRequest functions called from this form are created in js_formsubmit.php *}

<!-- THIS TEMPLATE's STRUCTURE

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
					 input id.map_showtype
 					 input id.map_type

			form name/id.maptypesform
			   table
				   input id.map_typeid[n]
					 input id.map_typelaunch[n]
					 input id.map_typeside[n]

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
					 input id.marker_icontype
					 input id.marker_wintext
					 input id.marker_style
					 input id.marker_labeltext
					 input id.marker_zi					 
					 input id.icon_id
					 input id.icon_name
					 input id.icon_type
					 input id.icon_img
					 input id.icon_imgsize
					 input id.icon_shadow
					 input id.icon_shadowsize
					 input id.icon_anchorx
					 input id.icon_anchory
					 input id.icon_winanchorx
					 input id.icon_winanchory
					 input id.icon_shadowanchorx
					 input id.icon_shadowanchory
					 input id.marker_styid
					 input id.marker_styname
					 input id.marker_stytype
					 input id.icon_hover
					 input id.icon_hoverop
					 input id.icon_labelop
					 input id.icon_hoverstyle
					 input id.icon_winstyle
					 
					 
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

 //-->

<div id="maptoolsbar">
<div id="maptools">
    <h3>Map Tools</h3>
    <form method="POST" action="store_map.php" name="mapform" id="mapform">
    <table>
		  <tr><td>id</td><td><input name="map_id" id="map_id" type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Title</td><td><input name="map_title" id="map_title" type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Description</td><td><input name="map_desc" id="map_desc" type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Allow Comments</td><td><input name="map_comm" id="map_comm" type="checkbox" value="True"></td></tr>
    	<tr><td>Width</td><td><input name="map_w" id="map_w" type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Height</td><td><input name="map_h" id="map_h" type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Latitude</td><td><input name="map_lat" id="map_lat"type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Longitude</td><td><input name="map_lon" id="map_lon" type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Zoom Level</td><td><input name="map_z" id="map_z" type="text" size="25" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Show Controls</td><td><select name="map_showcont" id="map_showcont">
          <!-- //@todo set option from db -->
          <option>Small</option>
          <option>Large</option>
          <option>None</option>
          </select></td></tr>
    	<tr><td>Show Scale</td><td><input name="map_showscale" id="map_showscale" type="checkbox" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Show Map Type Buttons</td><td><input name="map_showtype" id="map_showtype" type="checkbox" value="<!-- //@todo get val from db -->"></td></tr>
    	<tr><td>Default Map Type</td>
    			<td><select name="map_type" id="map_type">
          <!-- //@todo set option from db -->
          <option>Street Map</option>
          <option>Satellite</option>
          <option>Hybrid</option>
    			<!-- //@todo dynamically generate this part of the list -->
    			<option>*Any custom map types*</option></select></td></tr>
    </table>
    <input type="submit" name="mapsubmit" value="Submit">
    </form>

		
    <!-- Additional Map Types Table -->
    <form method="POST" action="store_map.php" name="maptypesform" id="maptypesform">    
    <table>
    	<tr><td><b>Additional Map Types</b></td>
					<td>Type Id</td>
    			<td>Include On Launch</td>
    			<td>Include In Side Pane</td>
    			<td>Edit</td></tr>
    	<tr><td><!--//@todo name from db-->*Sample Map Type 1*</td>
    			<td><input name="map_typeid[n]" id="map_typeid[n]" type="text" value="[n]"></td>
    			<td><input name="map_typelaunch1" id="map_typelaunch1" type="checkbox" value="True"></td>
    			<td><input name="map_typeside1" id="map_typeside1" type="checkbox" value="True"></td>
    			<td>*Link*</td></tr>
    </table>
    <input type="submit" name="maptypessubmit" value="Submit">
    </form>

		
    <!-- Marker Sets Table -->
    <form method="POST" action="store_map.php" name="markersetsform" id="markersetsform">    
    <table>    	
    	<tr><td><b>Marker Sets<b></td>
					<td>Set Id</td>
    			<td>Include On Launch</td>
    			<td>Include In Side Pane</td>
    			<td>Edit</td></tr>
    	<tr><!--//@todo generate markers list -->
    			<td><!--//@todo name from db-->*Sample Marker Set1*</td>
    			<td><input name="map_markersetid[n]" id="map_markersetid[n]" type="text" value="[n]"></td>
    			<td><input name="map_markerlaunch[n]" id="map_markerlaunch[n]" type="checkbox" value="True"></td>
    			<td><input name="map_markerside[n]" id="map_markerside[n]" type="checkbox" value="True"></td>
    			<td>*Link*</td></tr>
    			<td><!--//@todo name from db-->*Sample Marker Set2*</td>
    			<td><input name="map_markersetid[n]" id="map_markersetid[n]" type="text" value="[n]"></td>
    			<td><input name="map_marklaunch" id="map_marklaunch[n]" type="checkbox" value="True"></td>
    			<td><input name="map_markside" id="map_markside[n]" type="checkbox" value="True"></td>
    			<td>*Link*</td></tr>
    			<td><!--//@todo name from db-->*Sample Marker Set3*</td>
    			<td><input name="map_markersetid[n]" id="map_markersetid[n]" type="text" value="[n]"></td>
    			<td><input name="map_marklaunch" id="map_marklaunch[n]" type="checkbox" value="True"></td>
    			<td><input name="map_markside" id="map_markside[n]" type="checkbox" value="True"></td>
    			<td>*Link*</td></tr>
    </table>
    <input type="submit" name="markersetssubmit" value="Submit">
    </form>

    
    <!-- Polyline Sets Table -->
    <form method="POST" action="store_map.php" name="linesetsform" id="linesetsform">    
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
    <input type="submit" name="linesetssubmit" value="Submit">
    </form>


    
    <!-- Polygon Sets Table -->
    <form method="POST" action="store_map.php" name="polysetsform" id="polysetsform">    
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
    <input type="submit" name="polysetssubmit" value="Submit">
    </form>

    </form>
</div>



<!-- //@todo holly cow, gotta do tools for editing sets too?! -->


<div id="markertools">
    <form method="POST" action="submit.php" name="markerform" id="markerform">
    <h3>Marker Tools</h3>
		<table>
    	<tr><td><b>Marker</b></td></tr>				
    	<tr><td>Id</td><td><input name="marker_id" id="marker_id" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="marker_name" id="marker_name" type="text" size="25" value="somenumber"></td></tr>
    	<tr><td>Latitude</td><td><input name="marker_lat" id="marker_lat" type="text" size="25" value="somenumber"></td></tr>
    	<tr><td>Longitude</td><td><input name="marker_lon" id="marker_lon" type="text" size="25" value="somenumber"></td></tr>
    	<tr><td>Icon Type</td><td><select name="marker_icontype" id="marker_icontype" >
    	    	  <option>Default Style</option>
    					<option>Custom Style 1</option>
    					<option>Custom Style 1</option></select></td></tr>
    	<tr><td>Window Text</td><td><textarea name="marker_wintext" id="marker_wintext" cols="30" rows="5"></textarea></td></tr>
    	<tr><td>Marker Style</td><td><select name="marker_style" id="marker_style">
							<option>Default Style</option>
    					<option>Custom Style 1</option>
    					<option>Custom Style 1</option></select></td></tr>
    	<tr><td>Label Text</td><td><textarea name="marker_labeltext" id="marker_labeltext" cols="30" rows="2"></textarea></td></tr>
    	<tr><td>zIndex</td><td><input name="marker_zi" id="marker_zi" type="text" size="25" value="auto"></td></tr>
    	<tr><td>Flickr Image (how to get path? menu?)</td></tr>
		</table>
		
		<table>
    	<tr><td><b>Custom Icon Tools</b></td></tr>
    	<tr><td>Id</td><td><input name="icon_id" id="icon_id" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="icon_name" id="icon_name" type="text" size="25" value="Some Name"></td></tr>
    	<tr><td>Type</td><td><select name="icon_type" id="icon_type" >
     					<option>GIcon</option>
    					<option>XIcon</option></select></td></tr>
    	<tr><td>Icon Image Path</td><td><input name="icon_img" id="icon_img" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Image Size</td><td><input name="icon_imgsize" id="icon_imgsize" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Shadow Image Path</td><td><input name="icon_shadow" id="icon_shadow" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Shadow Size</td><td><input name="icon_shadowsize" id="icon_shadowsize" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Icon Anchor x</td><td><input name="icon_anchorx" id="icon_anchorx" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Icon Anchor y</td><td><input name="icon_anchory" id="icon_anchory" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Info Window Anchor x</td><td><input name="icon_winanchorx" id="icon_winanchorx" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Info Window Anchor y</td><td><input name="icon_winanchory" id="icon_winanchory" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Info Shadow Anchor x</td><td><input name="icon_shadowanchorx" id="icon_shadowanchorx" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Info Shadow Anchor y</td><td><input name="icon_shadowanchory" id="icon_shadowanchory" type="text" size="25" value="Some Value"></td></tr>
		</table>    

    <h4>Custom Marker Styles</h4>    
		<table>
    	<tr><td>Id</td><td><input name="marker_styid" id="marker_styid" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="marker_styname" id="marker_styname" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Type</td><td><select name="marker_stytype" id="marker_stytype">
     					<option>PdMarker</option>
    					<option>XMarker</option></select></td></tr>
    	<tr><td><small>(PdMarker Class Only)</small></td></tr>
    	<tr><td>Icon Hover Image Path</td><td><input name="icon_hover" id="icon_hover" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Label Hover Opacity</td><td><input name="icon_hoverop" id="icon_hoverop" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Label Opacity</td><td><input name="icon_labelop" id="icon_labelop" type="text" size="25" value="A Number"></td></tr>
    	<tr><td>Label Hover Styles</td><td><input name="icon_hoverstyle" id="icon_hoverstyle" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Window Styles</td><td><input name="icon_winstyle" id="icon_winstyle" type="text" size="25" value="Some Value"></td></tr>
		</table>
		
    <input type="submit" name="markersubmit" value="Submit">
    </form>
</div>



<div id="polytools">
    <form method="POST" action="submit.php" name="polyform" id="polyform">
    <h3>Polyline Tools</h3>
		<table>
    	<tr><td><b>Ployline</b></td></tr>
    	<tr><td>Id</td><td><input name="line_id" id="line_id" type="text" value="[n]"></td>
    	<tr><td>Name</td><td><input name="line_name" id="line_name" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>Type</td><td><select name="line_type" id="line_type">
     				  <option>Default</option>
    					<option>XPolyline</option></select></td></tr>
    	<tr><td>Points Data</td><td><textarea name="line_data" id="line_data" cols="30" rows="5"></textarea></td></tr>
    	<tr><td>Style</td><td><select name="line_style" id="line_style" >
    					<option>Default</option>
    					<option>Custom</option></select></td></tr>
    	<tr><td><small>(selects a style by id</small></td></tr>
    	<tr><td>Border Text</td><td><input name="line_bordertext" id="line_bordertext" type="text" size="25" value="Some Value"></td></tr>
    	<tr><td>zIndex</td><td><input name="line_zi" id="line_zi" type="text" size="25" value="A Number"></td></tr>
		</table>
		
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
		
    <input type="submit" name="polysubmit" value="Submit">
    </form>
</div>
</div>