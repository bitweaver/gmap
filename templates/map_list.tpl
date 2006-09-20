<div class="list gmap display">
  {include file="bitpackage:gmap/gmap_header.tpl"}
  {include file="bitpackage:gmap/list_form.tpl"}
  {include file="bitpackage:gmap/gmap_display.tpl"}
  {* if stars is active we include a model stars div
   * the container div has the id of 'stars-rating-1'
   *}   
  {if $gBitSystem->isPackageActive('stars') }
  <div id="iwindow-stars" style="display:none">
	  {include file="bitpackage:stars/stars_list_service.tpl" serviceHash=$GeoStars}
	</div>
	{/if}
</div>
<div id="error"></div>
