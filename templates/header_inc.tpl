{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $smarty.request.view_user || $geo_edit ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}

{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $view_map ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}
