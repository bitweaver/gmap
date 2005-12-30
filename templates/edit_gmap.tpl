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
		<div id="map" style="width:{if $gContent->mInfo.width == 0}auto{else}{$gContent->mInfo.width}px{/if}; height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
		{include file="bitpackage:gmap/edit_forms.tpl"}
	</div> <!-- end .body -->
</div>
