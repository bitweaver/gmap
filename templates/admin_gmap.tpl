{strip}
{form}
	{jstabs}
		{jstab title="Google Map API Key"}
			{legend legend="Google Map API Key"}
				<input type="hidden" name="page" value="{$page}" />
					<div class="row">
            {formlabel label="Google Maps API Key" for=apikey}
            {forminput}
              <input type="text" name="gmap_api_key" size="80" value="{$gBitSystem->getConfig('gmap_api_key')}" />
              {formhelp note='register for a key at <a href="http://www.google.com/apis/maps/signup.html" target="_new" >http://www.google.com/apis/maps/signup.html</a>'}
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
