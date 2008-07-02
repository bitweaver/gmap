BitMap.BIT_ROOT_URL = '{$smarty.const.BIT_ROOT_URL}';

{* we get different map data depending on if we are editing content, getting a map, or browsing geo-located content *}
BitMap.MapData.push({ldelim}
  browser:"{$browserInfo.browser}",
  {if !$geo_edit_serv && !$map_list}
  id:{if $mapInfo.gmap_id}{$mapInfo.gmap_id}{else}null{/if},
  allow_comments:'{if $gContent && $gContent->getPreference("allow_comments") eq "y"}y{else}n{/if}',
  {/if}
  mapdiv:'{$smarty.const.ACTIVE_PACKAGE}-map',
  width:{if $mapInfo.width}{$mapInfo.width}{elseif $gBitSystem->getConfig("gmap_width")}{$gBitSystem->getConfig("gmap_width")}{else}0{/if},
  height:{if $geo_edit_serv}400{elseif $mapInfo.height}{$mapInfo.height}{elseif $gBitSystem->getConfig("gmap_height")}{$gBitSystem->getConfig("gmap_height")}{else}0{/if},
{if !$simple_map }
  lat:{if $mapInfo.lat}{$mapInfo.lat}{elseif $gBitSystem->getConfig("gmap_lat")}{$gBitSystem->getConfig("gmap_lat")}{else}0{/if},
  lng:{if $mapInfo.lng}{$mapInfo.lng}{elseif $gBitSystem->getConfig("gmap_lng")}{$gBitSystem->getConfig("gmap_lng")}{else}0{/if},
  zoom:{if $mapInfo.zoom}{$mapInfo.zoom}{elseif $gBitSystem->getConfig("gmap_zoom")}{$gBitSystem->getConfig("gmap_zoom")}{else}0{/if},
{else}
  lat:{$listcontent[0].lat},
  lng:{$listcontent[0].lng},
  zoom:{if $mapInfo.zoom}
  			{$mapInfo.zoom+2}
		{elseif $listcontent[0].gmap_zoom != NULL}
			{$listcontent[0].gmap_zoom}
		{elseif $gBitSystem->getConfig("gmap_zoom")}
			{$gBitSystem->getConfig("gmap_zoom")+2}
		{else}2{/if},
{/if}
  scale:{if $mapInfo.scale}{$mapInfo.scale}{elseif $gBitSystem->getConfig("gmap_scale")}{$gBitSystem->getConfig("gmap_scale")}{else}false{/if}, /*true,false*/
  maptype:{if $mapInfo.maptype}{$mapInfo.maptype}{elseif $gBitSystem->getConfig("gmap_maptype")}{$gBitSystem->getConfig("gmap_maptype")}{else}0{/if},
  maptype_control:{if $mapInfo.maptype_control}{$mapInfo.maptype_control}{elseif $gBitSystem->getConfig("gmap_maptype_control")}{$gBitSystem->getConfig("gmap_maptype_control")}{else}true{/if}, /*true,false*/
  zoom_control:'{if $mapInfo.zoom_control}{$mapInfo.zoom_control}{elseif $gBitSystem->getConfig("gmap_zoom_control")}{$gBitSystem->getConfig("gmap_zoom_control")}{else}s{/if}', /*s,l,z,n*/
  overview_control:{if !$simple_map }{if $mapInfo.overview_control}{$mapInfo.overview_control}{elseif $gBitSystem->getConfig("gmap_overview_control")}{$gBitSystem->getConfig("gmap_overview_control")}{else}true{/if}{else}false{/if}, /*true,false*/
  
  Maptypes:[
  {if count($maptypesInfo) > 0}{section name=n loop=$maptypesInfo}
  {ldelim}
		maptype_id:{$maptypesInfo[n].maptype_id},
		name:"{$maptypesInfo[n].name}",
		shortname:"{$maptypesInfo[n].shortname}",
		description:"{$maptypesInfo[n].description}",
		minzoom:{$maptypesInfo[n].minzoom},
		maxzoom:{$maptypesInfo[n].maxzoom},
		errormsg:"{$maptypesInfo[n].errormsg}",
		tilelayer_ids:[{$maptypesInfo[n].tilelayer_ids}]
  {rdelim},
  {/section}{/if}],

  Tilelayers:[
  {if count($tilelayersInfo) > 0}{section name=tilelayers loop=$tilelayersInfo}
  {ldelim}
		tilelayer_id:{$tilelayersInfo[tilelayers].tilelayer_id},
		tiles_name:"{$tilelayersInfo[tilelayers].tiles_name}",
		tiles_minzoom:{$tilelayersInfo[tilelayers].tiles_minzoom},
		tiles_maxzoom:{$tilelayersInfo[tilelayers].tiles_maxzoom},
		ispng:{$tilelayersInfo[tilelayers].ispng},
		tilesurl:"{$tilelayersInfo[tilelayers].tilesurl}",
		opacity:{$tilelayersInfo[tilelayers].opacity}
  {rdelim},
  {/section}{/if}],

  Copyrights:[
  {if count($copyrightsInfo) > 0}{section name=n loop=$copyrightsInfo}
  {ldelim}
		copyright_id:{$copyrightsInfo[n].copyright_id},
		copyright_minzoom:{$copyrightsInfo[n].copyright_minzoom},
		bounds:[{$copyrightsInfo[n].bounds}],
		notice:"{$copyrightsInfo[n].notice}",
		tilelayer_id:{$copyrightsInfo[n].tilelayer_id}
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
		lat:{if $gContent}{$mapInfo.lat}{else if $serviceHash}{$serviceHash.lat}{/if},
		lng:{if $gContent}{$mapInfo.lng}{else if $serviceHash}{$serviceHash.lng}{/if}
	{rdelim},
	{elseif count($markersInfo) > 0}{section name=n loop=$markersInfo}
  {ldelim}
		content_id:{$markersInfo[n].content_id},
		marker_id: {$markersInfo[n].marker_id},
		title: "{$markersInfo[n].title|addslashes}",
		lat: {$markersInfo[n].lat},
		lng: {$markersInfo[n].lng},
		label_data: '{$markersInfo[n].label_data}',
		parsed_label_data: '{$markersInfo[n].parsed_label_data}',
		thumbnail_url:'{$markersInfo[n].thumbnail_url.avatar}',
		set_id: {$markersInfo[n].set_id},
		style_id: {$markersInfo[n].style_id},
		icon_id: {$markersInfo[n].icon_id},
		array_n: {$smarty.section.n.index},
		plot_on_load: {$markersInfo[n].plot_on_load},
		side_panel: {$markersInfo[n].side_panel},
		explode: {$markersInfo[n].explode},
		allow_comments:'{if $markersInfo[n].allow_comments eq "y"}y{else}n{/if}',
		num_comments:{if ($markersInfo[n].allow_comments eq "y" || $gBitUser->isAdmin()) && $markersInfo[n].num_comments }{$markersInfo[n].num_comments}{else}null{/if}
	{rdelim},
	{/section}{/if}],
	
  MarkerSets:[{if count($markersetsInfo) > 0}{section name=n loop=$markersetsInfo}
  {ldelim}
		set_id: {$markersetsInfo[n].set_id},
		name: "{$markersetsInfo[n].title}",
		description: "{$markersetsInfo[n].data}",
		style_id: {$markersetsInfo[n].style_id},
		icon_id: {$markersetsInfo[n].icon_id},
		set_type: "{$markersetsInfo[n].set_type}",
		plot_on_load: {$markersetsInfo[n].plot_on_load},
		side_panel: {$markersetsInfo[n].side_panel},
		explode: {$markersetsInfo[n].explode},
	{rdelim},
	{/section}{/if}],

  MarkerStyles:[{if count($markerstylesInfo) > 0}{section name=n loop=$markerstylesInfo}
  {ldelim}
		style_id: {$markerstylesInfo[n].style_id},
		name: "{$markerstylesInfo[n].name}",
		marker_style_type: {$markerstylesInfo[n].marker_style_type},
		label_hover_opacity: {$markerstylesInfo[n].label_hover_opacity},
		label_opacity: {$markerstylesInfo[n].label_opacity},
		label_hover_styles: "{$markerstylesInfo[n].label_hover_styles}",
		window_styles: "{$markerstylesInfo[n].window_styles}"
	{rdelim},
	{/section}{/if}],

  IconStyles:[{if count($iconstylesInfo) > 0}{section name=n loop=$iconstylesInfo}
  {ldelim}
		icon_id: {$iconstylesInfo[n].icon_id},
		name: "{$iconstylesInfo[n].name}",
		icon_style_type: {$iconstylesInfo[n].icon_style_type},
		image: "{$iconstylesInfo[n].image}",
		rollover_image: "{$iconstylesInfo[n].rollover_image}",
		print_image: "{$iconstylesInfo[n].print_image}",
		moz_print_image: "{$iconstylesInfo[n].moz_print_image}",
		transparent: "{$iconstylesInfo[n].transparent}",
		shadow_image: "{$iconstylesInfo[n].shadow_image}",
		print_shadow: "{$iconstylesInfo[n].print_shadow}",
		icon_w: {$iconstylesInfo[n].icon_w},
		icon_h: {$iconstylesInfo[n].icon_h},
		shadow_w: {$iconstylesInfo[n].shadow_w},
		shadow_h: {$iconstylesInfo[n].shadow_h},
		icon_anchor_x: {$iconstylesInfo[n].icon_anchor_x},
		icon_anchor_y: {$iconstylesInfo[n].icon_anchor_y},
		shadow_anchor_x: {$iconstylesInfo[n].shadow_anchor_x},
		shadow_anchor_y: {$iconstylesInfo[n].shadow_anchor_y},
		infowindow_anchor_x: {$iconstylesInfo[n].infowindow_anchor_x},
		infowindow_anchor_y: {$iconstylesInfo[n].infowindow_anchor_y}
		{* image_map: {$iconstylesInfo[n].image_map}, *}
	{rdelim},
	{/section}{/if}],

  Polylines:[{if count($polylinesInfo) > 0}{section name=n loop=$polylinesInfo}
  {ldelim}
		polyline_id:{$polylinesInfo[n].polyline_id},
		user_id:{$polylinesInfo[n].user_id},
		modifier_user_id:{$polylinesInfo[n].modifier_user_id},
		created:{$polylinesInfo[n].created},
		last_modified:{$polylinesInfo[n].last_modified},
		version:{$polylinesInfo[n].version},
		name:"{$polylinesInfo[n].title}",
		type:"{$polylinesInfo[n].type}",
		{if $polylinesInfo[n].type != 2 }
			points_data:new Array(),
			points_data:[{$polylinesInfo[n].poly_data}],
		{else}
			points_data:"{$polylinesInfo[n].poly_data}",
			levels_data:"{$polylinesInfo[n].levels_data}",
			zoom_factor:{$polylinesInfo[n].zoom_factor}32,
			num_levels:{$polylinesInfo[n].num_levels}4,
		{/if}
		set_id:{$polylinesInfo[n].set_id},
		style_id:{$polylinesInfo[n].style_id},
		array_n:{$smarty.section.n.index},
	{rdelim},
	{/section}{/if}],

  PolylineSets:[{if count($polylinesetsInfo) > 0}{section name=n loop=$polylinesetsInfo}
  {ldelim}
		set_id: {$polylinesetsInfo[n].set_id},
		name: "{$polylinesetsInfo[n].title}",
		description: "{$polylinesetsInfo[n].data}",
		style_id: {$polylinesetsInfo[n].style_id},
	{rdelim},
	{/section}{/if}],

  PolylineStyles:[{if count($polylinestylesInfo) > 0 }{section name=n loop=$polylinestylesInfo}
  {ldelim}
		style_id: {$polylinestylesInfo[n].style_id},
		name: "{$polylinestylesInfo[n].name}",
		color: "{$polylinestylesInfo[n].color}",
		weight: {$polylinestylesInfo[n].weight},
		opacity: {$polylinestylesInfo[n].opacity},
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
		name: "{$gContent->mMapPolygons[polygon_n].title}",
		circle:{if $gContent->mMapPolygons[polygon_n].circle}{$gContent->mMapPolygons[polygon_n].circle}{else}null{/if},
		points_data: new Array(),
		points_data: [{$gContent->mMapPolygons[polygon_n].poly_data}],
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
	{rdelim},
	{/section}{/if}]	
{rdelim});
