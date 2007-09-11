{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-iconstyle-form"}
<input name="icon_id" type="hidden" value="{$iconstyleInfo.icon_id}">
<input name="save_iconstyle" type="hidden" value="true">
	<div>Name<br/>
		<input name="name" type="text" style="width:90%" value="{$iconstyleInfo.name}"></div>
		<!-- GIcon is only type supported right now - in future if other types are available this could be an option -->
		<input name="icon_style_type" type="hidden" value="{if $iconstyleInfo.icon_style_type}{$iconstyleInfo.icon_style_type}{else}0{/if}">
	<p>
		<h4>Icon Image Settings</h4>
		<div>Path to Image <br/>
			<input name="icon_image" type="text" style="width:90%" value="{if $iconstyleInfo.icon_image}{$iconstyleInfo.icon_image}{else}icons/flat_color_pins/205.png{/if}"></div>
		<div>Path to Rollover Image <br/>
			<input name="rollover_image" type="text" style="width:90%" value="{if $iconstyleInfo.rollover_image}{$iconstyleInfo.rollover_image}{else}icons/flat_color_pins/090.png{/if}"></div>
	</p>
	<p>
		<div>Icon Width<br/>
			<input name="icon_w" type="text" size="5" value="{if $iconstyleInfo.icon_w}{$iconstyleInfo.icon_w}{else}20{/if}"></div>
		<div>Icon Height<br/>
			<input name="icon_h" type="text" size="5" value="{if $iconstyleInfo.icon_h}{$iconstyleInfo.icon_h}{else}34{/if}"></div>
	</p>
	<p>
		<div>Icon Anchor X<br/>
			<input name="icon_anchor_x" type="text" size="5" value="{if $iconstyleInfo.icon_anchor_x}{$iconstyleInfo.icon_anchor_x}{else}9{/if}"></div>
		<div>Icon Anchor Y<br/>
			<input name="icon_anchor_y" type="text" size="5" value="{if $iconstyleInfo.icon_anchor_y}{$iconstyleInfo.icon_anchor_y}{else}34{/if}"></div>
	</p>
	<p>
		<h4>Shadow Image Settings</h4>
		<div>Shadow Image <br/>
			<input name="shadow_image" type="text"  style="width:90%" value="{if $iconstyleInfo.shadow_image}{$iconstyleInfo.shadow_image}{else}http://www.google.com/mapfiles/shadow50.png{/if}"></div>
	</p>
	<p>
		<div>Shadow Width <br/>
			<input name="shadow_w" type="text" size="5" value="{if $iconstyleInfo.shadow_w}{$iconstyleInfo.shadow_w}{else}37{/if}"></div>
		<div>Shadow Height <br/>
			<input name="shadow_h" type="text" size="5" value="{if $iconstyleInfo.shadow_h}{$iconstyleInfo.shadow_h}{else}34{/if}"></div>
		<div>Shadow Anchor X<br/>
			<input name="shadow_anchor_x" type="text" size="5" value="{if $iconstyleInfo.shadow_anchor_x}{$iconstyleInfo.shadow_anchor_x}{else}18{/if}"></div>
		<div>Shadow Anchor Y<br/>
			<input name="shadow_anchor_y" type="text" size="5" value="{if $iconstyleInfo.shadow_anchor_y}{$iconstyleInfo.shadow_anchor_y}{else}25{/if}"></div>
	</p>
	<p>
		<h4>InfoWindow Postion Settings</h4>
		<div>Window Anchor X<br/>
			<input name="infowindow_anchor_x" type="text" size="5" value="{if $iconstyleInfo.infowindow_anchor_x}{$iconstyleInfo.infowindow_anchor_x}{else}9{/if}"></div>
		<div>Window Anchor Y<br/>
			<input name="infowindow_anchor_y" type="text" size="5" value="{if $iconstyleInfo.infowindow_anchor_y}{$iconstyleInfo.infowindow_anchor_y}{else}2{/if}"></div>
	</p>
	<div>
		<input type="button" name="save_iconstyle_btn" value="Save" onclick="javascript:BitMap.EditSession.storeIconStyle( this.form );">
	</div>
{/form}
{/strip}