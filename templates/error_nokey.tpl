{strip}
<div class="display gmap">
	<div class="header">
		<h1>{if $gBitUser->isAdmin()}You Have Not Finished Configuring the Gmap Package{else}Sorry!{/if}</h1>
	</div><!-- end .header -->
	<div class="body">
		<div class="gmap-content">
		{if $gBitUser->isAdmin()}
			{formfeedback warning="You must get a Google Map API key from Google to use Gmap Package!"}
			Get and store your Google Maps API in the <a href="{$smarty.const.KERNEL_PKG_URL}admin/index.php?page=gmap">Gmap Package Administration Panel</a>
		{else}
			The Google Maps Package has not been completely configured on this site yet.
		{/if}
		</div>
	</div>
</div>
{/strip}