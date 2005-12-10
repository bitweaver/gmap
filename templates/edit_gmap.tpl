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
		<a href="javascript:getEditTools();">Load Edit Tools</a>
		<div id="map" style="width:{$gContent->mInfo.width}px; height:{$gContent->mInfo.height}px;"></div>
		{include file="bitpackage:gmap/edit_marker_form.tpl"}
		{include file="bitpackage:gmap/edit_polyline_form.tpl"}
		<div id="editform">{include file="bitpackage:gmap/edit_gmap_form.tpl"}</div>
	</div> <!-- end .body -->
</div>
