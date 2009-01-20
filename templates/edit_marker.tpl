{strip}
{assign var="formid" value="edit-marker-form"}
{form action="javascript:;" enctype="multipart/form-data" id=$formid}
	{jstabs}
		{jstab title="Marker Properties"}
			<input name="save_marker" type="hidden" value="true" />
			<input name="content_id" type="hidden" value="{$markerInfo.content_id}" />
			<input name="marker_id" type="hidden" value="{$markerInfo.marker_id}" />
			<input name="set_id" type="hidden" value="{$markerInfo.set_id}" />

			<div class="row">
				{formlabel label="Latitutde" for="geo-lat"}
				{forminput}
					<input size="50" name="geo[lat]" id="geo-lat" type="text" value="{$markerInfo.lat}" />
					{formhelp note=""}
				{/forminput}
			</div>

			<div class="row">
				{formlabel label="Longitude" for="geo-lng"}
				{forminput}
					<input size="50" id="geo-lng" name="geo[lng]" type="text" value="{$markerInfo.lng}" />
					{formhelp note=""}
				{/forminput}
			</div>
			<div class="row">
				{forminput}
					<a name="marker_assist_btn" title="click a location!" href="javascript:void(0)" onclick="BitMap.EditSession.addAssistant('marker', 'new');">( Use Locating Assistant )</a>
				{/forminput}
			</div>

			<div class="row">
				{formlabel label="Title" for="title"}
				{forminput}
					<input size="50" name="title" type="text" value="{$markerInfo.title}" />
					{formhelp note=""}
				{/forminput}
			</div>

			<div class="row">
				{formlabel label="Hover Text" for="marker_labeltext"}
				{forminput}
					<textarea name="marker_labeltext" rows="1">{$markerInfo.label_data}</textarea>
					{formhelp note=""}
				{/forminput}
			</div>

			{textarea}{$markerInfo.raw}{/textarea}

			<div class="row">
				{formlabel label="Primary Attachment Image Size" for="primary_attachment_size"}
				{forminput}
					{assign var=size value=$gContent->getPreference('primary_attachment_size')|default:small}
					{html_options values=$imageSizes options=$imageSizes name="primary_attachment_size" selected=$size}
					{formhelp note="Here you can select the size of the primary attachment image. Change this if the default is too small or too big."}
				{/forminput}
			</div>

			{if !$gContent->isValid() || $gContent->hasAdminPermission()}
				<div class="row">
					{formlabel label="Allow Comments" for="allow_comments"}
					{forminput}
						<input type="checkbox" name="allow_comments" value="y" {if $gContent->isCommentable() eq 'y'}checked="checked"{/if} />
						{formhelp note=""}
					{/forminput}
				</div>

				<div class="row">
					{formlabel label="Allow Registered Users To Edit" for="share_update"}
					{forminput}
						<input type="checkbox" name="share_update" value="y" {if $updateShared}checked="checked"{/if} />
						{formhelp note="Checking this box will allow any registered user to edit this marker. This is good if you want this marker to be editable like a wiki page."}
					{/forminput}
				</div>
			{/if}

			{include file="bitpackage:liberty/edit_services_inc.tpl" serviceFile="content_edit_mini_tpl"}

			<div class="row submit">
				<input type="button" name="save_marker_btn" value="Save" onclick="javascript:BitMap.EditSession.storeMarker( this.form );" />
			</div>

			{* include file="bitpackage:liberty/edit_storage_list.tpl" primary_label="Marker Image" *} 
			{* include file="bitpackage:liberty/edit_services_inc.tpl" serviceFile="content_edit_tab_tpl" primary_label="Marker Image" *}
		{/jstab}

		{if $gBitUser->hasPermission('p_liberty_attach_attachments') }
			{jstab title="Attachments"}
				{legend legend="Attachments"}
					{include file="bitpackage:liberty/edit_storage.tpl" formid=$formid}
				{/legend}
			{/jstab}
		{/if}

		{* {include file="bitpackage:liberty/edit_services_inc.tpl" serviceFile="content_edit_tab_tpl"} *}
	{/jstabs}
{/form}
{/strip}
