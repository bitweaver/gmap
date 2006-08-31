{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $geo_edit_serv ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}

{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $view_map ) }
  {include file="bitpackage:gmap/header_base.tpl"}
{/if}

{if $gBitSystem->isPackageActive('geo') && $gBitSystem->isPackageActive('gmap') && ( $edit_map ) }
  {include file="bitpackage:gmap/header_base.tpl"}
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Base.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Iter.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/Async.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}MochiKit/DOM.js" type="text/javascript"></script>
  <script src="{$smarty.const.GMAP_PKG_URL}templates/Edit.js" type="text/javascript"></script>
{/if}
