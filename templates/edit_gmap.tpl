<!-- //@todo wj:how does this value get set? -->
{* Check to see if there is an editing conflict *}
{if $editpageconflict == 'y'}
	<script type="text/javascript">//<![CDATA[
		Hide Script
		alert("{tr}This page is being edited by {$semUser}{/tr}. {tr}Proceed at your own peril{/tr}.")
	//]]></script>
{/if}

{strip}
<div class="edit gmap">
	{include file="bitpackage:gmap/gmap_header.tpl"}
	<div class="body">
		<div class="gmap-content">
			{include file='bitpackage:gmap/gmap_sidepanel.tpl'}
			{include file="bitpackage:gmap/map_inc.tpl"}
		</div>
		{* this is a container for our forms - we ajax them in *}
		<div id="gmap-forms">
			{include file="bitpackage:gmap/edit_forms.tpl"}
		</div>
		<div id="mapcontent" class="content">
			{$gContent->mInfo.clean_data}
		</div>
		<div id="spinner" style="z-index:1500; position:absolute; top:50%; left:50%; margin-left:-125px; margin-top:-35px; width:250px; line-height:50px; padding:25px 0; border:3px solid #ccc; background:#fff; font-weight:bold; color:#900; text-align:center; display:none;">
			{biticon ipackage=liberty iname=busy iexplain=Loading style="vertical-align:middle;"}&nbsp;&nbsp;&nbsp;&nbsp;<span id="spinner-text">{tr}Sending Request{/tr}&hellip;</span>
		</div>
	</div> <!-- end .body -->
</div>
<div id="editerror" class="fade-000000 warning" style="display:none"><img src="/bw/liberty/icons/warning.png" alt="warning" title="warning" class="icon" /> <span id="errortext">Warning Placeholder</span></div>
{/strip}
