<!-- //@todo wj:how does this value get set? -->
{* Check to see if there is an editing conflict *}
{if $editpageconflict == 'y'}
	<script type="text/javascript">//<![CDATA[
		Hide Script
		alert("{tr}This page is being edited by {$semUser}{/tr}. {tr}Proceed at your own peril{/tr}.")
	//]]></script>
{/if}

<div class="edit gmap">
	<div class="display">
	{include file="bitpackage:gmap/gmap_header.tpl"}
	</div>
	<div class="body">
  	<div id="mapsidepanel" class="hide" style="height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
		<div id="map" style="width:{if $gContent->mInfo.width == 0}auto{else}{$gContent->mInfo.width}px{/if}; height:{if $gContent->mInfo.height == 0}auto{else}{$gContent->mInfo.height}px{/if};"></div>
		<div id="editerror" class="fade-000000 warning" style="display:none"><img src="/bw/liberty/icons/warning.png" alt="warning" title="warning" class="icon" /> <span id="errortext">Warning Placeholder</span></div>
		{include file="bitpackage:gmap/edit_forms.tpl"}
		<div id="mapcontent" class="content">
			{$gContent->mInfo.parsed_data}
		</div>
	</div> <!-- end .body -->
</div>
