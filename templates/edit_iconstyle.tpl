{* 		 
	The following are Google icon features not implemented 
	because they are an annoying pain in the ass for most people.
	The database supports them, but the form does not.
	Maybe an "advanced" form is needed for anyone who
	might want to deal with these headaches.
	
	print_image
	moz_print_image
	transparent
	print_shadow
*}
{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-iconstyle-form"}
	<input name="icon_id" type="hidden" value="{$iconstyleInfo.icon_id}" />
	<input name="save_iconstyle" type="hidden" value="true" />
	
	<div class="row">
		{formlabel label="Name" for="name"}
			{forminput}
				<input name="name" type="text" style="width:90%" value="{$iconstyleInfo.name}" />
				{formhelp note=""}
			{/forminput}
	</div>

	<!-- GIcon is only type supported right now - in future if other types are available this could be an option -->
	{* Might remove this
	<input name="icon_style_type" type="hidden" value="{if $iconstyleInfo.icon_style_type}{$iconstyleInfo.icon_style_type}{else}0{/if}" />
	*}

	<h4>Icon Image Settings</h4>
	<div class="row">
		{formlabel label="Path to Image" for="icon_image"}
			{forminput}
				<input name="icon_image" type="text" style="width:90%" value="{if $iconstyleInfo.image}{$iconstyleInfo.image}{else}icons/flat_color_pins/205.png{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Path to Rollover Image" for="rollover_image"}
			{forminput}
				<input name="rollover_image" type="text" style="width:90%" value="{if $iconstyleInfo.rollover_image}{$iconstyleInfo.rollover_image}{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Icon Width" for="icon_w"}
			{forminput}
				<input name="icon_w" type="text" size="5" value="{if $iconstyleInfo.icon_w}{$iconstyleInfo.icon_w}{else}20{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Icon Height" for="icon_h"}
			{forminput}
				<input name="icon_h" type="text" size="5" value="{if $iconstyleInfo.icon_h}{$iconstyleInfo.icon_h}{else}34{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Icon Anchor X" for="icon_anchor_x"}
			{forminput}
				<input name="icon_anchor_x" type="text" size="5" value="{if $iconstyleInfo.icon_anchor_x}{$iconstyleInfo.icon_anchor_x}{else}9{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Icon Anchor Y" for="icon_anchor_y"}
			{forminput}
				<input name="icon_anchor_y" type="text" size="5" value="{if $iconstyleInfo.icon_anchor_y}{$iconstyleInfo.icon_anchor_y}{else}34{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>

	<h4>Shadow Image Settings</h4>
	<div class="row">
		{formlabel label="Shadow Image" for="shadow_image"}
			{forminput}
				<input name="shadow_image" type="text"  style="width:90%" value="{if $iconstyleInfo.shadow_image}{$iconstyleInfo.shadow_image}{else}http://www.google.com/mapfiles/shadow50.png{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Shadow Width" for="shadow_w"}
			{forminput}
				<input name="shadow_w" type="text" size="5" value="{if $shadowstyleInfo.shadow_w}{$shadowstyleInfo.shadow_w}{else}37{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Shadow Height" for="shadow_h"}
			{forminput}
				<input name="shadow_h" type="text" size="5" value="{if $shadowstyleInfo.shadow_h}{$shadowstyleInfo.shadow_h}{else}34{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Shadow Anchor X" for="shadow_anchor_x"}
			{forminput}
				<input name="shadow_anchor_x" type="text" size="5" value="{if $shadowstyleInfo.shadow_anchor_x}{$shadowstyleInfo.shadow_anchor_x}{else}18{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Shadow Anchor Y" for="shadow_anchor_y"}
			{forminput}
				<input name="shadow_anchor_y" type="text" size="5" value="{if $shadowstyleInfo.shadow_anchor_y}{$shadowstyleInfo.shadow_anchor_y}{else}25{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	
	<h4>InfoWindow Postion Settings</h4>
	<div class="row">
		{formlabel label="Window Anchor X" for="infowindow_anchor_x"}
			{forminput}
				<input name="infowindow_anchor_x" type="text" size="5" value="{if $iconstyleInfo.infowindow_anchor_x}{$iconstyleInfo.infowindow_anchor_x}{else}9{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row">
		{formlabel label="Window Anchor Y" for="infowindow_anchor_y"}
			{forminput}
				<input name="infowindow_anchor_y" type="text" size="5" value="{if $iconstyleInfo.infowindow_anchor_y}{$iconstyleInfo.infowindow_anchor_y}{else}2{/if}" />
				{formhelp note=""}
			{/forminput}
	</div>
	<div class="row submit">
		<input type="button" name="save_iconstyle_btn" value="Save" onclick="javascript:BitMap.EditSession.storeIconStyle( this.form );" />
	</div>
{/form}
{/strip}
