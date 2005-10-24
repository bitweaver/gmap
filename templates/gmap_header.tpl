<div class="header">
	{if $gBitSystem->isFeatureActive( 'feature_bitmap_title' )}
		<h1>{$bitmapInfo.title}</h1>
		{if $cached_bitmap eq 'y'}<span class="cached">(cached)</span>{/if}
	{/if}

	{if $gBitSystem->isFeatureActive( 'feature_bitmap_description' ) and $description}
		<h2>{$description}</h2>
	{/if}

	{include file="bitpackage:bitmap/bitmap_date_bar.tpl"}
</div><!-- end .header -->
