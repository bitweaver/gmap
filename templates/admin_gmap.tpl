{strip}
{form}
	{jstabs}
		{jstab title="General Settings"}
			{legend legend="API Settings"}
				<input type="hidden" name="page" value="{$page}" />
				<div class="row">
					{formlabel label="Google Maps API Key" for=apikey}
					{forminput}
					  <input type="text" name="gmap_api_key" size="50" value="{if $gBitSystem->getConfig('gmap_api_key')}{$gBitSystem->getConfig('gmap_api_key')}{/if}" />
					  {if !$gBitSystem->getConfig('gmap_api_key')}
						{formfeedback warning="You must get a key from Google to use Gmap Package!"}
					  {/if}
					  {formhelp note='Register for a key at <a href="http://www.google.com/apis/maps/signup.html" target="_new" >http://www.google.com/apis/maps/signup.html</a>'}
					{/forminput}
				</div>
			{/legend}			
			{legend legend="Default Geo Values"}
				<div class="row">
					{formlabel label="Center Latitude" for="gmap_lat"}
					{forminput}
						<input size="30" type="text" name="gmap_lat" id="gmap_lat" value="{$gBitSystem->getConfig('gmap_lat')|default:0}" />
						{formhelp note=""}
					{/forminput}
				</div>				
				<div class="row">
					{formlabel label="Center Longitude" for="gmap_lng"}
					{forminput}
						<input size="30" type="text" name="gmap_lng" id="gmap_lng" value="{$gBitSystem->getConfig('gmap_lng')|default:0}" />
						{formhelp note=""}
					{/forminput}
				</div>				
				<div class="row">
					{formlabel label="Zoom Level" for="gmap_zoom"}
					{forminput}
						<input size="5" type="text" name="gmap_zoom" id="gmap_zoom" value="{$gBitSystem->getConfig('gmap_zoom')|default:0}" />
						{formhelp note=""}
					{/forminput}
				</div>				
			{/legend}			
		{/jstab}
		{jstab title="Service Settings"}
			{legend legend="Mappable Content"}
				<div class="row">
					{formlabel label="Mappable Content Types"}
					{forminput}
						{html_checkboxes options=$formMappable.guids value=y name=mappable_content separator="<br />" checked=$formMappable.checked}
						{formhelp note="Here you can select what additional content types can be mapped. A map and geo-spacial data fields are automatically added to selected content edit forms. Located content will show up in the searchable mapped-content feature of this package."}
					{/forminput}
				</div>
			{/legend}
				
			{legend legend="Display Options"}
				<p>
				{tr}Geo-located content can be viewed on a Google Map on the mapped-content page. Choose any one or more of the following to display permalinks to the map page on each mapped content's native page.{/tr}
				</p>
				{foreach from=$formGmapServiceDisplayOptions key=item item=output}
					<div class="row">
						{formlabel label=`$output.label` for=$item}
						{forminput}
							{if $output.type == 'numeric'}
								{html_options name="$item" values=$numbers output=$numbers selected=$gBitSystem->getConfig($item) labels=false id=$item}
							{elseif $output.type == 'input'}
								<input type='text' name="{$item}" id="{$item}" value="{$gBitSystem->getConfig($item)}" />
							{else}
								{html_checkboxes name="$item" values="y" checked=$gBitSystem->getConfig($item) labels=false id=$item}
							{/if}
							{formhelp note=`$output.note` page=`$output.page`}
						{/forminput}
					</div>
				{/foreach}
			{/legend}
		{/jstab}
	{/jstabs}
	<div class="row submit">
		<input type="submit" name="gmap_preferences" value="{tr}Change Preferences{/tr}" />
	</div>
{/form}
{/strip}
