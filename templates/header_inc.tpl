{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $geo_edit_serv ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}

{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $view_map ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}
