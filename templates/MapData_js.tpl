BitMap.BIT_ROOT_URL = '{$smarty.const.BIT_ROOT_URL}';

{* we get different map data depending on if we are editing content, getting a map, or browsing geo-located content *}
BitMap.MapData.push({ldelim}
  browser:"{$browserInfo.browser}",
  {if !$geo_edit_serv && !$map_list}
  id:{if $gContent->mInfo.gmap_id}{$gContent->mInfo.gmap_id}{else}null{/if},
  title:"{$gContent->mInfo.title|addslashes}",
  description:"{$gContent->mInfo.description}",
  data:"{$gContent->mInfo.data}",
  parsed_data:"{$gContent->mInfo.parsed_data}",
  allow_comments:'{if $gContent->getPreference("allow_comments") eq "y"}y{else}n{/if}',
  {/if}
  mapdiv:'{$smarty.const.ACTIVE_PACKAGE}-map',
  width:{if $gContent->mInfo.width}{$gContent->mInfo.width}{elseif $gBitSystem->getConfig("gmap_width")}{$gBitSystem->getConfig("gmap_width")}{else}0{/if},
  height:{if $gContent->mInfo.height}{$gContent->mInfo.height}{elseif $gBitSystem->getConfig("gmap_height")}{$gBitSystem->getConfig("gmap_height")}{else}0{/if},
  lat:{if $gContent->mInfo.lat}{$gContent->mInfo.lat}{elseif $gBitSystem->getConfig("gmap_lat")}{$gBitSystem->getConfig("gmap_lat")}{else}0{/if},
  lng:{if $gContent->mInfo.lng}{$gContent->mInfo.lng}{elseif $gBitSystem->getConfig("gmap_lng")}{$gBitSystem->getConfig("gmap_lng")}{else}0{/if},
  zoom:{if $gContent->mInfo.zoom}{$gContent->mInfo.zoom}{elseif $gBitSystem->getConfig("gmap_zoom")}{$gBitSystem->getConfig("gmap_zoom")}{else}2{/if},
  scale:{if $gContent->mInfo.scale}{$gContent->mInfo.scale}{elseif $gBitSystem->getConfig("gmap_scale")}{$gBitSystem->getConfig("gmap_scale")}{else}false{/if}, /*true,false*/
  maptype:{if $gContent->mInfo.maptype}{$gContent->mInfo.maptype}{elseif $gBitSystem->getConfig("gmap_maptype")}{$gBitSystem->getConfig("gmap_maptype")}{else}0{/if},
  maptype_control:{if $gContent->mInfo.maptype_control}{$gContent->mInfo.maptype_control}{elseif $gBitSystem->getConfig("gmap_maptype_control")}{$gBitSystem->getConfig("gmap_maptype_control")}{else}true{/if}, /*true,false*/
  zoom_control:'{if $gContent->mInfo.zoom_control}{$gContent->mInfo.zoom_control}{elseif $gBitSystem->getConfig("gmap_zoom_control")}{$gBitSystem->getConfig("gmap_zoom_control")}{else}s{/if}', /*s,l,z,n*/
  overview_control:{if $gContent->mInfo.overview_control}{$gContent->mInfo.overview_control}{elseif $gBitSystem->getConfig("gmap_overview_control")}{$gBitSystem->getConfig("gmap_overview_control")}{else}true{/if}, /*true,false*/
  
  Maptypes:[
  {if count($gContent->mMapTypes) > 0}{section name=maptypes loop=$gContent->mMapTypes}
  {ldelim}
		maptype_id:{$gContent->mMapTypes[maptypes].maptype_id},
		name:"{$gContent->mMapTypes[maptypes].name}",
		shortname:"{$gContent->mMapTypes[maptypes].shortname}",
		description:"{$gContent->mMapTypes[maptypes].description}",
		minzoom:{$gContent->mMapTypes[maptypes].minzoom},
		maxzoom:{$gContent->mMapTypes[maptypes].maxzoom},
		errormsg:"{$gContent->mMapTypes[maptypes].errormsg}"
  {rdelim},
  {/section}{/if}],

  Tilelayers:[
  {if count($gContent->mTilelayers) > 0}{section name=tilelayers loop=$gContent->mTilelayers}
  {ldelim}
		tilelayer_id:{$gContent->mTilelayers[tilelayers].tilelayer_id},
		tiles_name:"{$gContent->mTilelayers[tilelayers].tiles_name}",
		tiles_minzoom:{$gContent->mTilelayers[tilelayers].tiles_minzoom},
		tiles_maxzoom:{$gContent->mTilelayers[tilelayers].tiles_maxzoom},
		ispng:{$gContent->mTilelayers[tilelayers].ispng},
		tilesurl:"{$gContent->mTilelayers[tilelayers].tilesurl}",
		opacity:{$gContent->mTilelayers[tilelayers].opacity},
		maptype_id:{$gContent->mTilelayers[tilelayers].maptype_id}
  {rdelim},
  {/section}{/if}],

  Copyrights:[
  {if count($gContent->mCopyrights) > 0}{section name=copyrights loop=$gContent->mCopyrights}
  {ldelim}
		copyright_id:{$gContent->mCopyrights[copyrights].copyright_id},
		copyright_minzoom:{$gContent->mCopyrights[copyrights].copyright_minzoom},
		bounds:[{$gContent->mCopyrights[copyrights].bounds}],
		notice:"{$gContent->mCopyrights[copyrights].notice}",
		tilelayer_id:{$gContent->mCopyrights[copyrights].tilelayer_id}
  {rdelim},
  {/section}{/if}],
	
  Markers:[{if count($listcontent) > 0}{section name=n loop=$listcontent}{if $listcontent[n].lat != NULL}
  {ldelim}		
		content_id:{$listcontent[n].content_id},
		content_type_guid:'{$listcontent[n].content_type_guid}',
		content_description:'{$listcontent[n].content_description}',
		lat:{$listcontent[n].lat},
		lng:{$listcontent[n].lng},
		title:'{$listcontent[n].title|addslashes}',
{*	description:'{$listcontent[n].description}',  *}
		created:{$listcontent[n].created},
		last_modified:{$listcontent[n].last_modified},
		modifier_real_name:'{$listcontent[n].modifier_real_name}',
		modifier_user_id:{$listcontent[n].modifier_user_id},
		creator_real_name:'{$listcontent[n].creator_real_name}',
		creator_user_id:{$listcontent[n].creator_user_id},
		display_url:'{$listcontent[n].display_url}',
		hits:{if $listcontent[n].hits}{$listcontent[n].hits}{else}null{/if},
		stars_rating_count:{if $listcontent[n].stars_rating_count}{$listcontent[n].stars_rating_count}{else}null{/if},
		stars_rating:{if $listcontent[n].stars_rating}{$listcontent[n].stars_rating}{else}null{/if},
		stars_pixels:{if $listcontent[n].stars_pixels}{$listcontent[n].stars_pixels}{else}null{/if},
		stars_user_rating:{if $listcontent[n].stars_user_rating}{$listcontent[n].stars_user_rating}{else}null{/if},
		stars_user_pixels:{if $listcontent[n].stars_user_pixels}{$listcontent[n].stars_user_pixels}{else}null{/if},
		plot_on_load:true
		{rdelim},
	{/if}{/section}{elseif $serviceHash && $serviceHash.lat != NULL}
  {ldelim}
		lat:{if $gContent}{$gContent->mInfo.lat}{else if $serviceHash}{$serviceHash.lat}{/if},
		lng:{if $gContent}{$gContent->mInfo.lng}{else if $serviceHash}{$serviceHash.lng}{/if}
	{rdelim},
	{elseif count($gContent->mMapMarkers) > 0}{section name=marker_n loop=$gContent->mMapMarkers}
  {ldelim}
		content_id:{$gContent->mMapMarkers[marker_n].content_id},
		marker_id: {$gContent->mMapMarkers[marker_n].marker_id},
		marker_type: {$gContent->mMapMarkers[marker_n].marker_type},
		title: "{$gContent->mMapMarkers[marker_n].title|addslashes}",
		lat: {$gContent->mMapMarkers[marker_n].lat},
		lng: {$gContent->mMapMarkers[marker_n].lng},
		data: '{$gContent->mMapMarkers[marker_n].data}',
		parsed_data: '{$gContent->mMapMarkers[marker_n].parsed_data}',
		label_data: '{$gContent->mMapMarkers[marker_n].label_data}',
		photo_url: '{$gContent->mMapMarkers[marker_n].photo_url}',

		created:{$gContent->mMapMarkers[marker_n].created},
		last_modified:{$gContent->mMapMarkers[marker_n].last_modified},
		modifier_real_name:'{$gContent->mMapMarkers[marker_n].modifier_real_name}',
		modifier_user_id:{$gContent->mMapMarkers[marker_n].modifier_user_id},
		creator_real_name:'{$gContent->mMapMarkers[marker_n].creator_real_name}',
		creator_user_id:{$gContent->mMapMarkers[marker_n].user_id},

		set_id: {$gContent->mMapMarkers[marker_n].set_id},
		style_id: {$gContent->mMapMarkers[marker_n].style_id},
		icon_id: {$gContent->mMapMarkers[marker_n].icon_id},
		array_n: {$smarty.section.marker_n.index},
		plot_on_load: {$gContent->mMapMarkers[marker_n].plot_on_load},
		side_panel: {$gContent->mMapMarkers[marker_n].side_panel},
		explode: {$gContent->mMapMarkers[marker_n].explode},
		cluster: {$gContent->mMapMarkers[marker_n].cluster},
		allow_comments:'{if $gContent->mMapMarkers[marker_n].allow_comments eq "y"}y{else}n{/if}',
		num_comments:{if ($gContent->mMapMarkers[marker_n].allow_comments eq "y" || $gBitUser->isAdmin()) && $gContent->mMapMarkers[marker_n].num_comments }{$gContent->mMapMarkers[marker_n].num_comments}{else}null{/if}
	{rdelim},
	{/section}{/if}],
	
  MarkerSets:[{if count($gContent->mMapMarkerSets) > 0}{section name=markersetdata loop=$gContent->mMapMarkerSets}
  {ldelim}
		set_id: {$gContent->mMapMarkerSets[markersetdata].set_id},
		name: "{$gContent->mMapMarkerSets[markersetdata].name}",
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
		infowindow_anchor_y: {$gContent->mMapIconStyles[markericondata].infowindow_anchor_y}
		{* image_map: {$gContent->mMapIconStyles[markericondata].image_map}, *}
		{* DELETE - NOLONGER AVAILABLE FROM XMAPS
		points: "{$gContent->mMapIconStyles[markericondata].points}",
		scale: {$gContent->mMapIconStyles[markericondata].scale},
		outline_color: "{$gContent->mMapIconStyles[markericondata].outline_color}",
		outline_weight: {$gContent->mMapIconStyles[markericondata].outline_weight},
		fill_color: "{$gContent->mMapIconStyles[markericondata].fill_color}",
		fill_opacity: {$gContent->mMapIconStyles[markericondata].fill_opacity}
		*}
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
