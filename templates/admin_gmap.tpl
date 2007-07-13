{strip}
{form}
	{jstabs}
		{jstab title="Google Map API Key"}
			{legend legend="Google Map API Key"}
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

		      <div class="row submit">
			       <input type="submit" name="gmapAdminSubmit" value="{tr}Change Preferences{/tr}" />
		      </div>
			{/legend}
		{/jstab}
	{/jstabs}
{/form}
{/strip}
