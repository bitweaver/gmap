{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && $gBitSystem->isFeatureActive('gmap_api_key') && $geo_edit_serv && $smarty.const.ACTIVE_PACKAGE != 'gmap'}	
  {include file='bitpackage:geo/edit_geo.tpl' serviceHash=$userInfo}
	<div class="row">
		{formlabel label="Click on the map to set the location fields above"}
		{forminput}
      {include file='bitpackage:gmap/map_inc.tpl'}
		{/forminput}
	</div>	
{/if}
