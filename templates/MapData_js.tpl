BitMap.MapData.push({ldelim}
  browser:"{$browserInfo.browser}",
  {if !$geo_edit_serv}
  id:{if $gContent->mInfo.gmap_id}{$gContent->mInfo.gmap_id}{else}null{/if},
  title:"{$gContent->mInfo.title}",
  description:"{$gContent->mInfo.description}",
  data:"{$gContent->mInfo.data}",
  parsed_data:"{$gContent->mInfo.parsed_data}",
  {/if}
  mapdiv:'{$smarty.const.ACTIVE_PACKAGE}-map',
  width:'{if $gBitSystem->getConfig("gmap_width_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_width_`$smarty.const.ACTIVE_PACKAGE`")}{else}auto{/if}',
  height:'{if $gBitSystem->getConfig("gmap_height_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_height_`$smarty.const.ACTIVE_PACKAGE`")}{else}300px{/if}',
  lat:{if $gBitSystem->getConfig("gmap_lat_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_lat_`$smarty.const.ACTIVE_PACKAGE`")}{else}40{/if},
  lng:{if $gBitSystem->getConfig("gmap_lng_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_lng_`$smarty.const.ACTIVE_PACKAGE`")}{else}-97{/if},
  zoom:{if $gBitSystem->getConfig("gmap_zoom_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_zoom_`$smarty.const.ACTIVE_PACKAGE`")}{else}3{/if},
  scale:{if $gBitSystem->getConfig("gmap_scale_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_scale_`$smarty.const.ACTIVE_PACKAGE`")}{else}false{/if}, //true,false
  type_control:{if $gBitSystem->getConfig("gmap_type_control_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_type_control_`$smarty.const.ACTIVE_PACKAGE`")}{else}true{/if}, //true,false
  zoom_control:'{if $gBitSystem->getConfig("gmap_zoom_control_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_zoom_control_`$smarty.const.ACTIVE_PACKAGE`")}{else}s{/if}', //s,l,z,n
  overview_control:{if $gBitSystem->getConfig("gmap_overview_control_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_type_control_`$smarty.const.ACTIVE_PACKAGE`")}{else}true{/if}, //true,false 
  maptype:'{if $gBitSystem->getConfig("gmap_maptype_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_maptype_`$smarty.const.ACTIVE_PACKAGE`")}{else}0{/if}',

  Maptypes:[
  {if count($gContent->mMapTypes) > 0}{section name=maptypes loop=$gContent->mMapTypes}
  {ldelim}
		maptype_id: {$gContent->mMapTypes[maptypes].maptype_id},
		name: "{$gContent->mMapTypes[maptypes].name}",
		description: "{$gContent->mMapTypes[maptypes].description}",
		copyright: "{$gContent->mMapTypes[maptypes].copyright}",
		basetype: {$gContent->mMapTypes[maptypes].basetype},
		alttype: {$gContent->mMapTypes[maptypes].alttype},
		minzoom: {$gContent->mMapTypes[maptypes].minzoom},
		maxzoom: {$gContent->mMapTypes[maptypes].maxzoom},
		{if $gContent->mMapTypes[maptypes].maptiles_url != NULL}
			maptiles_url: "{$gContent->mMapTypes[maptypes].maptiles_url}",
		{/if}
		{if $gContent->mMapTypes[maptypes].lowresmaptiles_url != NULL}
			lowresmaptiles_url: "{$gContent->mMapTypes[maptypes].lowresmaptiles_url}",
		{/if}
		{if $gContent->mMapTypes[maptypes].hybridtiles_url != NULL}
			hybridtiles_url: "{$gContent->mMapTypes[maptypes].hybridtiles_url}",
		{/if}
		{if $gContent->mMapTypes[maptypes].lowreshybridtiles_url != NULL}
			lowreshybridtiles_url: "{$gContent->mMapTypes[maptypes].lowreshybridtiles_url}",
		{/if}
		{rdelim},
	{/section}{/if}],
		
  Markers:[{if count($listcontent) > 0}{section name=listcontent_n loop=$listcontent}{if $listcontent[listcontent_n].lat != NULL}
  {ldelim}
		content_id:{$listcontent[listcontent_n].content_id},
		content_type_guid:'{$listcontent[listcontent_n].format_guid}',
		lat:{$listcontent[listcontent_n].lat},
		lng:{$listcontent[listcontent_n].lng},
		title:'{$listcontent[listcontent_n].title}',
{*	description:'{$listcontent[listcontent_n].description}',*}
		creator_real_name:'{$listcontent[listcontent_n].creator_real_name}',
		display_url:'{$listcontent[listcontent_n].display_url}'
		{rdelim},
	{/if}{/section}{elseif $serviceHash && $serviceHash.lat != NULL}
  {ldelim}
		lat:{if $gContent}{$gContent->mInfo.lat}{else if $serviceHash}{$serviceHash.lat}{/if},
		lng:{if $gContent}{$gContent->mInfo.lng}{else if $serviceHash}{$serviceHash.lng}{/if}
	{rdelim},
	{elseif count($gContent->mMapMarkers) > 0}{section name=marker_n loop=$gContent->mMapMarkers}
  {ldelim}
		marker_id: {$gContent->mMapMarkers[marker_n].marker_id},
		marker_type: {$gContent->mMapMarkers[marker_n].marker_type},
		title: "{$gContent->mMapMarkers[marker_n].title}",
		lat: {$gContent->mMapMarkers[marker_n].lat},
		lon: {$gContent->mMapMarkers[marker_n].lon},
		data: '{$gContent->mMapMarkers[marker_n].data}',
		parsed_data: '{$gContent->mMapMarkers[marker_n].parsed_data}',
		label_data: '{$gContent->mMapMarkers[marker_n].label_data}',
		photo_url: '{$gContent->mMapMarkers[marker_n].photo_url}',
		set_id: {$gContent->mMapMarkers[marker_n].set_id},
		style_id: {$gContent->mMapMarkers[marker_n].style_id},
		icon_id: {$gContent->mMapMarkers[marker_n].icon_id},
		array_n: {$smarty.section.marker_n.index},
		plot_on_load: {$gContent->mMapMarkers[marker_n].plot_on_load},
		side_panel: {$gContent->mMapMarkers[marker_n].side_panel},
		explode: {$gContent->mMapMarkers[marker_n].explode},
		cluster: {$gContent->mMapMarkers[marker_n].cluster}
	{rdelim},
	{/section}{/if}],
	
  MarkerSets:[{if count($gContent->mMapMarkerSets) > 0}{section name=markersetdata loop=$gContent->mMapMarkerSets}
  {ldelim}
		set_id: {$gContent->mMapMarkerSets[markersetdata].set_id},
		title: "{$gContent->mMapMarkerSets[markersetdata].title}",
		description: "{$gContent->mMapMarkerSets[markersetdata].description}",
		style_id: {$gContent->mMapMarkerSets[markersetdata].style_id},
		icon_id: {$gContent->mMapMarkerSets[markersetdata].icon_id},
		set_type: "{$gContent->mMapMarkerSets[markersetdata].set_type}",
		plot_on_load: {$gContent->mMapMarkerSets[markersetdata].plot_on_load},
		side_panel: {$gContent->mMapMarkerSets[markersetdata].side_panel},
		explode: {$gContent->mMapMarkerSets[markersetdata].explode},
		cluster: {$gContent->mMapMarkerSets[markersetdata].cluster}
	{rdelim},
	{/section}{/if}],

  MarkerStyles:[{if count($gContent->mMapMarkerStyles) > 0}{section name=markerstyledata loop=$gContent->mMapMarkerStyles}
  {ldelim}
		style_id: {$gContent->mMapMarkerStyles[markerstyledata].style_id},
		name: "{$gContent->mMapMarkerStyles[markerstyledata].name}",
		marker_style_type: {$gContent->mMapMarkerStyles[markerstyledata].marker_style_type},
		label_hover_opacity: {$gContent->mMapMarkerStyles[markerstyledata].label_hover_opacity},
		label_opacity: {$gContent->mMapMarkerStyles[markerstyledata].label_opacity},
		label_hover_styles: "{$gContent->mMapMarkerStyles[markerstyledata].label_hover_styles}",
		window_styles: "{$gContent->mMapMarkerStyles[markerstyledata].window_styles}"
	{rdelim},
	{/section}{/if}],

  IconStyles:[{if count($gContent->mMapIconStyles) > 0}{section name=markericondata loop=$gContent->mMapIconStyles}
  {ldelim}
		icon_id: {$gContent->mMapIconStyles[markericondata].icon_id},
		name: "{$gContent->mMapIconStyles[markericondata].name}",
		icon_style_type: {$gContent->mMapIconStyles[markericondata].icon_style_type},
		image: "{$gContent->mMapIconStyles[markericondata].image}",
		rollover_image: "{$gContent->mMapIconStyles[markericondata].rollover_image}",
		print_image: "{$gContent->mMapIconStyles[markericondata].print_image}",
		moz_print_image: "{$gContent->mMapIconStyles[markericondata].moz_print_image}",
		transparent: "{$gContent->mMapIconStyles[markericondata].transparent}",
		shadow_image: "{$gContent->mMapIconStyles[markericondata].shadow_image}",
		print_shadow: "{$gContent->mMapIconStyles[markericondata].print_shadow}",
		icon_w: {$gContent->mMapIconStyles[markericondata].icon_w},
		icon_h: {$gContent->mMapIconStyles[markericondata].icon_h},
		shadow_w: {$gContent->mMapIconStyles[markericondata].shadow_w},
		shadow_h: {$gContent->mMapIconStyles[markericondata].shadow_h},
		icon_anchor_x: {$gContent->mMapIconStyles[markericondata].icon_anchor_x},
		icon_anchor_y: {$gContent->mMapIconStyles[markericondata].icon_anchor_y},
		shadow_anchor_x: {$gContent->mMapIconStyles[markericondata].shadow_anchor_x},
		shadow_anchor_y: {$gContent->mMapIconStyles[markericondata].shadow_anchor_y},
		infowindow_anchor_x: {$gContent->mMapIconStyles[markericondata].infowindow_anchor_x},
		infowindow_anchor_y: {$gContent->mMapIconStyles[markericondata].infowindow_anchor_y},
		{* image_map: {$gContent->mMapIconStyles[markericondata].image_map}, *}
		points: "{$gContent->mMapIconStyles[markericondata].points}",
		scale: {$gContent->mMapIconStyles[markericondata].scale},
		outline_color: "{$gContent->mMapIconStyles[markericondata].outline_color}",
		outline_weight: {$gContent->mMapIconStyles[markericondata].outline_weight},
		fill_color: "{$gContent->mMapIconStyles[markericondata].fill_color}",
		fill_opacity: {$gContent->mMapIconStyles[markericondata].fill_opacity}
	{rdelim},
	{/section}{/if}],

  Polylines:[{if count($gContent->mMapPolylines) > 0}{section name=polyline_n loop=$gContent->mMapPolylines}
  {ldelim}
		polyline_id: {$gContent->mMapPolylines[polyline_n].polyline_id},
		user_id: {$gContent->mMapPolylines[polyline_n].user_id},
		modifier_user_id: {$gContent->mMapPolylines[polyline_n].modifier_user_id},
		created: {$gContent->mMapPolylines[polyline_n].created},
		last_modified: {$gContent->mMapPolylines[polyline_n].last_modified},
		version: {$gContent->mMapPolylines[polyline_n].version},
		name: "{$gContent->mMapPolylines[polyline_n].name}",
		points_data: new Array(),
		points_data: [{$gContent->mMapPolylines[polyline_n].points_data}],
		border_text: "{$gContent->mMapPolylines[polyline_n].border_text}",
		{if $gContent->mMapPolylines[polyline_n].zindex != NULL}
			zindex: {$gContent->mMapPolylines[polyline_n].zindex},
		{/if}
		set_id: {$gContent->mMapPolylines[polyline_n].set_id},
		style_id: {$gContent->mMapPolylines[polyline_n].style_id},
		array_n: {$smarty.section.polyline_n.index},
		plot_on_load: {$gContent->mMapPolylines[polyline_n].plot_on_load},
		side_panel: {$gContent->mMapPolylines[polyline_n].side_panel},
		explode: {$gContent->mMapPolylines[polyline_n].explode},
	{rdelim},
	{/section}{/if}],

  PolylineSets:[{if count($gContent->mMapPolylineSets) > 0}{section name=set_n loop=$gContent->mMapPolylineSets}
  {ldelim}
		set_id: {$gContent->mMapPolylineSets[set_n].set_id},
		name: "{$gContent->mMapPolylineSets[set_n].name}",
		description: "{$gContent->mMapPolylineSets[set_n].description}",
		style_id: {$gContent->mMapPolylineSets[set_n].style_id},
		plot_on_load: {$gContent->mMapPolylineSets[set_n].plot_on_load},
		side_panel: {$gContent->mMapPolylineSets[set_n].side_panel},
		explode: {$gContent->mMapPolylineSets[set_n].explode},
	{rdelim},
	{/section}{/if}],

  PolylineStyles:[{if count($gContent->mMapPolylineStyles) > 0 }{section name=style_n loop=$gContent->mMapPolylineStyles}
  {ldelim}
		style_id: {$gContent->mMapPolylineStyles[style_n].style_id},
		name: "{$gContent->mMapPolylineStyles[style_n].name}",
		polyline_style_type: {$gContent->mMapPolylineStyles[style_n].polyline_style_type},
		color: "{$gContent->mMapPolylineStyles[style_n].color}",
		weight: {$gContent->mMapPolylineStyles[style_n].weight},
		opacity: {$gContent->mMapPolylineStyles[style_n].opacity},
		pattern: new Array(),
		{if $gContent->mMapPolylineStyles[style_n].pattern != NULL}
			pattern: {$gContent->mMapPolylineStyles[style_n].pattern},
		{/if}
		segment_count: {$gContent->mMapPolylineStyles[style_n].segment_count},
		text_every: {$gContent->mMapPolylineStyles[style_n].text_every},
		begin_arrow: {$gContent->mMapPolylineStyles[style_n].begin_arrow},
		end_arrow: {$gContent->mMapPolylineStyles[style_n].end_arrow},
		arrows_every: {$gContent->mMapPolylineStyles[style_n].arrows_every},
		text_fgstyle_color: "{$gContent->mMapPolylineStyles[style_n].text_fgstyle_color}",
		text_fgstyle_weight: {$gContent->mMapPolylineStyles[style_n].text_fgstyle_weight},
		text_fgstyle_opacity: {$gContent->mMapPolylineStyles[style_n].text_fgstyle_opacity},
		{if $gContent->mMapPolylineStyles[style_n].text_fgstyle_zindex != NULL}
			text_fgstyle_zindex: {$gContent->mMapPolylineStyles[style_n].text_fgstyle_zindex},
		{/if}
		text_bgstyle_color: "{$gContent->mMapPolylineStyles[style_n].text_bgstyle_color}",
		text_bgstyle_weight: {$gContent->mMapPolylineStyles[style_n].text_bgstyle_weight},
		text_bgstyle_opacity: {$gContent->mMapPolylineStyles[style_n].text_bgstyle_opacity},
		{if $gContent->mMapPolylineStyles[style_n].text_bgstyle_zindex != NULL}
			text_bgstyle_zindex: {$gContent->mMapPolylineStyles[style_n].text_bgstyle_zindex},
		{/if}
	{rdelim},
	{/section}{/if}],

  Polygons:[{if count($gContent->mMapPolygons) > 0}{section name=polygon_n loop=$gContent->mMapPolygons}
  {ldelim}
		polygon_id: {$gContent->mMapPolygons[polygon_n].polygon_id},
		user_id: {$gContent->mMapPolygons[polygon_n].user_id},
		modifier_user_id: {$gContent->mMapPolygons[polygon_n].modifier_user_id},
		created: {$gContent->mMapPolygons[polygon_n].created},
		last_modified: {$gContent->mMapPolygons[polygon_n].last_modified},
		version: {$gContent->mMapPolygons[polygon_n].version},
		name: "{$gContent->mMapPolygons[polygon_n].name}",
		circle: {$gContent->mMapPolygons[polygon_n].circle},
		points_data: new Array(),
		points_data: [{$gContent->mMapPolygons[polygon_n].points_data}],
		circle_center: new Array(),
		circle_center: [{$gContent->mMapPolygons[polygon_n].circle_center}],
		{if $gContent->mMapPolygons[polygon_n].radius != NULL}
			radius: {$gContent->mMapPolygons[polygon_n].radius},
		{/if}
		border_text: "{$gContent->mMapPolygons[polygon_n].border_text}",
		{if $gContent->mMapPolygons[polygon_n].zindex != NULL}
			zindex: {$gContent->mMapPolygons[polygon_n].zindex},
		{/if}
		set_id: {$gContent->mMapPolygons[polygon_n].set_id},
		style_id: {$gContent->mMapPolygons[polygon_n].style_id},
		polylinestyle_id: {$gContent->mMapPolygons[polygon_n].polylinestyle_id},
		array_n: {$smarty.section.polygon_n.index},
		plot_on_load: {$gContent->mMapPolygons[polygon_n].plot_on_load},
		side_panel: {$gContent->mMapPolygons[polygon_n].side_panel},
		explode: {$gContent->mMapPolygons[polygon_n].explode},
	{rdelim},
	{/section}{/if}],

  PolygonStyles:[{if count($gContent->mMapPolygonStyles) > 0 }{section name=style_n loop=$gContent->mMapPolygonStyles}
  {ldelim}
		style_id: {$gContent->mMapPolygonStyles[style_n].style_id},
		name: "{$gContent->mMapPolygonStyles[style_n].name}",
		polygon_style_type: {$gContent->mMapPolygonStyles[style_n].polygon_style_type},
		color: "{$gContent->mMapPolygonStyles[style_n].color}",
		weight: {$gContent->mMapPolygonStyles[style_n].weight},
		opacity: {$gContent->mMapPolygonStyles[style_n].opacity},
	{rdelim},
	{/section}{/if}],

  PolygonSets:[{if count($gContent->mMapPolygonSets) > 0}{section name=set_n loop=$gContent->mMapPolygonSets}
  {ldelim}
		set_id: {$gContent->mMapPolygonSets[set_n].set_id},
		name: "{$gContent->mMapPolygonSets[set_n].name}",
		description: "{$gContent->mMapPolygonSets[set_n].description}",
		style_id: {$gContent->mMapPolygonSets[set_n].style_id},
		polylinestyle_id: {$gContent->mMapPolygonSets[set_n].polylinestyle_id},
		plot_on_load: {$gContent->mMapPolygonSets[set_n].plot_on_load},
		side_panel: {$gContent->mMapPolygonSets[set_n].side_panel},
		explode: {$gContent->mMapPolygonSets[set_n].explode},
	{rdelim},
	{/section}{/if}]	
{rdelim});
