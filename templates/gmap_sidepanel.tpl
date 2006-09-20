{strip}
<div id="gmap-sidepanel" class="hide" style="
   height:{if $gContent->mInfo.height == 0}
            auto
          {else}
            {$gContent->mInfo.height}px
          {/if};
">
<div class="boxtitle">Search Results</div>
<div id="marker-table"></div>
</div>
{/strip}
