<!-- //@todo wj:how does this value get set? -->
{* Check to see if there is an editing conflict *}
{if $editpageconflict == 'y'}
	<script language="javascript" type="text/javascript">
		<!-- Hide Script
			alert("{tr}This page is being edited by {$semUser}{/tr}. {tr}Proceed at your own peril{/tr}.")
		//End Hide Script-->
	</script>
{/if}

{include file="bitpackage:gmap/gmap_header.tpl"}

<div class="floaticon">{bithelp}</div>

<div class="body">
	<div class="content">
		<div id="map" style="width:{$gContent->mMapData.width}px; height:{$gContent->mMapData.height}px;"></div>
		<div id="editform">{include file="bitpackage:gmap/edit_gmap_form.tpl"}</div>
		<div class="clear"></div>
	</div> <!-- end .content -->
</div> <!-- end .body -->