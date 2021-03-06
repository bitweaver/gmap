{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-polygonset-options-form"}
	<input name="set_id" type="hidden" value="{$polygonsetInfo.set_id}" />
	<input name="gmap_id" type="hidden" value="{$polygonsetInfo.gmap_id}" />
	<input name="save_polygonset" type="hidden" value="true" />
	<div class="form-group">
		{formlabel label="Name" for="name"}
			{forminput}
				<input size="40" name="title" type="text" value="{$polygonsetInfo.title}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Description" for="description"}
			{forminput}
				<input size="40" id="editliberty" name="edit" type="text" value="{$polygonsetInfo.data}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Line Style" for="polylinestyle_id"}
			{forminput}
				<select name="polylinestyle_id" id="polylinestyle_id">
					<option value="0" {if $polygonsetInfo.polylinestyle_id == 0 }selected="selected"{/if}>Default (blue)</option>
					{if count($polylineStyles) > 0}{section name=ix loop=$polylineStyles}
						<option value="{$polylineStyles[ix].style_id}" {if $polygonsetInfo.polylinestyle_id == $polylineStyles[ix].style_id}selected="selected"{else}{/if}>{$polylineStyles[ix].name}</option>
					{/section}{/if}
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="form-group">
		{formlabel label="Fill Style" for="style_id"}
			{forminput}
				<select name="style_id" id="style_id">
					<option value="0" {if $polygonsetInfo.style_id == 0 }selected="selected"{/if}>Default (blue)</option>
					{if count($polygonStyles) > 0}{section name=ix loop=$polygonStyles}
						<option value="{$polygonStyles[ix].style_id}" {if $polygonsetInfo.style_id == $polygonStyles[ix].style_id}selected="selected"{else}{/if}>{$polygonStyles[ix].name}</option>
					{/section}{/if}
				</select>
				{formhelp note=""}
			{/forminput}
	</div>
	
	{if !$gContent->isValid() || $gContent->hasAdminPermission()}
	<div class="form-group">
		{forminput label="checkbox"}
				<input type="checkbox" name="allow_children" value="y" {if $childrenAllowed}checked="checked"{/if} />Allow Registered Users to Add Polygons To This Set
				{formhelp note="Checking this box will allow any registered user to add polygons to this set."}
			{/forminput}
	</div>
	
	<div class="form-group">
		{forminput label="checkbox"}
				<input type="checkbox" name="share_update" value="y" {if $updateShared}checked="checked"{/if} />Allow Registered Users To Edit
				{formhelp note="Checking this box will allow any registered user to edit the parameters of this set - this does not effect if they can add polygons to this set."}
			{/forminput}
	</div>
	{/if}
	
	<div class="form-group submit">
		<input type="button" name="savenewpolygonset" value="Save" onclick="javascript:BitMap.EditSession.storePolygonSet( this.form );" />
		<input type="button" name="closepolygonsetform" value="Close Options Editing" onclick="javascript:BitMap.EditSession.cancelEditPolygonSet()" />
	</div>
{/form}
{/strip}
