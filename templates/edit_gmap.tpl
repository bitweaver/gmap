<!-- //@todo wj:how does this value get set? -->
{* Check to see if there is an editing conflict *}
{if $editpageconflict == 'y'}
	<script type="text/javascript">//<![CDATA[
		Hide Script
		alert("{tr}This page is being edited by {$semUser}{/tr}. {tr}Proceed at your own peril{/tr}.")
	//]]></script>
{/if}

<div class="edit gmap">
	  {include file="bitpackage:gmap/gmap_header.tpl"}
	  <div class="body">
  	  <div id="mapsidepanel" class="hide" style="height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
		  {include file="bitpackage:gmap/map_inc.tpl"}
		  <div id="editerror" class="fade-000000 warning" style="display:none"><img src="/bw/liberty/icons/warning.png" alt="warning" title="warning" class="icon" /> <span id="errortext">Warning Placeholder</span></div>
		  {include file="bitpackage:gmap/edit_forms.tpl"}
		  <div id="mapcontent" class="content">
			  {$gContent->mInfo.clean_data}
		  </div>
	  </div> <!-- end .body -->
	  <div id="error"></div>
</div>
