{strip}
<div id="{$smarty.const.ACTIVE_PACKAGE}-map" style="width:{if $gBitSystem->getConfig("gmap_width_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_width_`$smarty.const.ACTIVE_PACKAGE`")}{else}auto{/if}; height:{if $gBitSystem->getConfig("gmap_height_`$smarty.const.ACTIVE_PACKAGE`")}{$gBitSystem->getConfig("gmap_height_`$smarty.const.ACTIVE_PACKAGE`")}{else}400px{/if}; background-color:#ccc;">Google Map Goes Here</div>
{/strip}
