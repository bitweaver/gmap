{strip}
<div class="display gmap">
	<div class="header">
		<h1>{if $gBitUser->isAdmin()}{tr}You Have Not Finished Configuring the Gmap Package{/tr}{else}{tr}Sorry!{/tr}{/if}</h1>
	</div><!-- end .header -->
	<div class="body">
		<div class="gmap-content">
		{if $gBitUser->isAdmin()}
			{formfeedback warning="You must get a Google Map API key from Google to use Gmap Package!"}
			{tr}Get and store your Google Maps API in the{/tr} <a href="{$smarty.const.KERNEL_PKG_URL}admin/index.php?page=gmap">{tr}Gmap Package Administration Panel{/tr}</a>
		{else}
			{tr}The Google Maps Package has not been completely configured on this site yet.{/tr}
		{/if}
		</div>
	</div>
</div>
{/strip}