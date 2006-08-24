{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap')}	
  {include file='bitpackage:geo/edit_geo.tpl' serviceHash=$userInfo}
	<div class="row">
		{formlabel label="Click on the map to set the location fields above"}
		{forminput}
      {include file='bitpackage:gmap/map_inc.tpl'}
		{/forminput}
	</div>	
{/if}
