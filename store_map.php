<?php
/**
 *
 * @package bitmap
 *
 * created 2005/10/07
 */

/**
 * The post values here come directly from the values in js_formsubmit.tpl 
 * The functions here processes them to create a new map or update an existing one.
 *
 * Updates are broken into parts Map, Marker, Icon, Polyline etc.
 * All the parts are not saved at once.
 */

/**
 	 Map Updates Contain the following Post Values:
	 ----------------------------------------------
 */
 
	 		$_REQUEST['map_id'] 
	 		$_REQUEST['map_title']
	 		$_REQUEST['map_desc']
	 		$_REQUEST['map_comm']
	 		$_REQUEST['map_w']
	 		$_REQUEST['map_h']
	 		$_REQUEST['map_lat']
	 		$_REQUEST['map_lon']
	 		$_REQUEST['map_z //zoom level']
	 		$_REQUEST['map_showcont']
	 		$_REQUEST['map_showscale']
	 		$_REQUEST['map_showtype']
 	 		$_REQUEST['map_type']
 


 
/**
 	 MapSets Updates Contain the following Post Values:
	 -------------------------------------------------------
 */
 	 		$_REQUEST['map_id']
 	 		$_REQUEST['map_typeid[n]']
 	 		$_REQUEST['map_typelaunch[n]']
 	 		$_REQUEST['map_typeside[n]']



 
/**			
 	 MarkerSets Updates Contain the following Post Values:
	 -------------------------------------------------------
 */
  	 	$_REQUEST['map_id']
 	 		$_REQUEST['map_markersetid[n]']
 	 		$_REQUEST['map_markerlaunch[n]']
 	 		$_REQUEST['map_markerside[n]']



 
/**
 	 PolylineSets Updates Contain the following Post Values:
	 -------------------------------------------------------
 */
  	 	$_REQUEST['map_id']
  	 	$_REQUEST['map_linesetid[n]']
  	 	$_REQUEST['map_linelaunch[n]']
  	 	$_REQUEST['map_lineside[n]']
 
 

 
/**		
 	 PolygonSets Updates Contain the following Post Values:
	 -------------------------------------------------------
 */	 
  	 	$_REQUEST['map_id']
  	 	$_REQUEST['map_polysetid[n]']
  	 	$_REQUEST['map_polylaunch[n]']
  	 	$_REQUEST['map_polyside[n]']
 */

 
/** 
 	 Marker/Icon/Styles Updates Contain the following Post Values:
	 -------------------------------------------------------
 */
  	 	$_REQUEST['marker_id']
  	 	$_REQUEST['marker_name']
  	 	$_REQUEST['marker_lat']
  	 	$_REQUEST['marker_lon']
  	 	$_REQUEST['marker_icontype']
  	 	$_REQUEST['marker_wintext']
  	 	$_REQUEST['marker_style']
  	 	$_REQUEST['marker_labeltext']
  	 	$_REQUEST['marker_zi'] 
  	 	$_REQUEST['icon_id']
  	 	$_REQUEST['icon_name']
  	 	$_REQUEST['icon_type']
  	 	$_REQUEST['icon_img']
  	 	$_REQUEST['icon_imgsize']
  	 	$_REQUEST['icon_shadow']
  	 	$_REQUEST['icon_shadowsize']
  	 	$_REQUEST['icon_anchorx']
  	 	$_REQUEST['icon_anchory']
  	 	$_REQUEST['icon_winanchorx']
  	 	$_REQUEST['icon_winanchory']
  	 	$_REQUEST['icon_shadowanchorx']
  	 	$_REQUEST['icon_shadowanchory']
  	 	$_REQUEST['marker_styid']		
  	 	$_REQUEST['marker_styname']
  	 	$_REQUEST['marker_stytype']
  	 	$_REQUEST['icon_hover']
  	 	$_REQUEST['icon_hoverop']
  	 	$_REQUEST['icon_labelop']
  	 	$_REQUEST['icon_hoverstyle']
  	 	$_REQUEST['icon_winstyle']
			 

			
/** 
 	 Polyline/Polygon Updates Contain the following Post Values:
	 -------------------------------------------------------
 */

  	 	$_REQUEST['line_id']
  	 	$_REQUEST['line_name']
  	 	$_REQUEST['line_type']
  	 	$_REQUEST['line_data']
  	 	$_REQUEST['line_style']
  	 	$_REQUEST['line_bordertext']
  	 	$_REQUEST['line_zi']
		
  	 	$_REQUEST['line_styid']
  	 	$_REQUEST['line_styname']
  	 	$_REQUEST['line_color']
  	 	$_REQUEST['line_weight']
  	 	$_REQUEST['line_op']
  	 	$_REQUEST['line_pattern']
  	 	$_REQUEST['line_seg']
  	 	$_REQUEST['line_beginarrow']
  	 	$_REQUEST['line_endarrow']
  	 	$_REQUEST['line_arrowint']
  	 	$_REQUEST['line_font']
  	 	$_REQUEST['line_textint']
  	 	$_REQUEST['line_txtfgcolor']
  	 	$_REQUEST['line_txtfgweight']
  	 	$_REQUEST['line_txtfgop']
  	 	$_REQUEST['line_txtfgzi']
  	 	$_REQUEST['line_txtbgcolor']
  	 	$_REQUEST['line_txtbgweight']
  	 	$_REQUEST['line_txtbgop']
  	 	$_REQUEST['line_txtbgzi']

  	 	$_REQUEST['poly_id']
  	 	$_REQUEST['poly_name']
  	 	$_REQUEST['poly_type']
  	 	$_REQUEST['poly_data']
  	 	$_REQUEST['poly_center']
  	 	$_REQUEST['poly_radius']
  	 	$_REQUEST['poly_borderstyle']
  	 	$_REQUEST['poly_style']
  	 	$_REQUEST['poly_bordertext']
  	 	$_REQUEST['poly_zi']

  	 	$_REQUEST['poly_styid']
  	 	$_REQUEST['poly_styname']
  	 	$_REQUEST['poly_color']
  	 	$_REQUEST['poly_weight']
  	 	$_REQUEST['poly_op']
			
?>
