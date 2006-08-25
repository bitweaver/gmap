BitMap.MapData.push({ldelim}
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
  map_type:'{if $gBitSystem->getConfig("gmap_map_type_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_map_type_`$smarty.const.ACTIVE_PACKAGE`")}{else}Street{/if}',
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
	{/if}{/section}
  {else if $serviceHash || $gContent->mInfo.lat}{if $serviceHash.lat != NULL || $gContent->mInfo.lat != NULL}
  {ldelim}
		lat:{if $gContent}{$gContent->mInfo.lat}{else if $serviceHash}{$serviceHash.lat}{/if},
		lng:{if $gContent}{$gContent->mInfo.lng}{else if $serviceHash}{$serviceHash.lng}{/if}
	{rdelim},
  {/if}{/if}]
{rdelim});
