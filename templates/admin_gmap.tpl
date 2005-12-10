{strip}
{form}
	<input type="hidden" name="page" value="{$page}" />
	{legend legend="Gmap Features"}
		<div class="row">
			{formlabel label="Google Maps API Key" for=apikey}
			{forminput}
				<input type="text" name="gmaps_api_key" size="80" value="{$gBitSystem->getPreference('gmaps_api_key')}" />
				{formhelp note='register for a key at <a href="http://www.google.com/apis/maps/" target="_new" >http://www.google.com/apis/maps/</a>'}
			{/forminput}
		</div>

		{foreach from=$formGmapFeatures key=item item=output}
			<div class="row">
				{formlabel label=`$output.label` for=$item}
				{forminput}
					{html_checkboxes name="$item" values="y" checked=`$gBitSystemPrefs.$item` labels=false id=$item}
					{formhelp note=`$output.note` page=`$output.page`}
				{/forminput}
			</div>
		{/foreach}
		<div class="row submit">
			<input type="submit" name="homeTabSubmit" value="{tr}Change preferences{/tr}" />
		</div>
	{/legend}
{/form}
{/strip}
