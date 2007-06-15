{strip}
<div id="{$smarty.const.ACTIVE_PACKAGE}-map" 
     style="
       width:{if $gBitSystem->getConfig("gmap_width") && $gBitSystem->getConfig("gmap_width") > 0}
               {$gBitSystem->getConfig("gmap_width")}px
            {else}
              auto
            {/if}; 
       height:800px{* {if $gBitSystem->getConfig("gmap_height")}
               {if $gBitSystem->getConfig("gmap_height") > 0}
                 {$gBitSystem->getConfig("gmap_height")}px
               {else}
                 auto
               {/if}
            {else}
              400px
            {/if}*};
       background-color:#ccc;">
  Google Map Goes Here
</div>
{/strip}