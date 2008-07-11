{strip}
<div id="view_icons">
	<div class="row">
		<h1>dropdown or links here...</h1>
		{formlabel label="Icon Theme" for="icon_theme"}
		{forminput}
			<select name="theme_id">
				<option>{tr}All Icons{/tr}</option>
				{foreach from=$themes key=theme_id item=theme}
					<option value="{$theme_id}" {if $theme_id == $smarty.request.theme_id}selected="selected"{/if}>{$theme|replace:"_":" "|capitalize}</option>
				{/foreach}
			</select>
			<ul>
				<li><a href="{$smarty.const.GMAP_PKG_URL}view_icons_inc.php">{tr}All Icons{/tr}</a></li>
				{foreach from=$themes key=theme_id item=theme}
					<li><a href="{$smarty.const.GMAP_PKG_URL}view_icons_inc.php?theme_id={$theme_id}">{$theme|replace:"_":" "|capitalize}</a> {if $theme_id == $smarty.request.theme_id}{biticon iname=dialog-ok iexplain="Selected"}{/if}</li>
				{/foreach}
			</ul>
		{/forminput}
	</div>

	{foreach from=$icons item=icon name=icons}
		{if !(( $smarty.foreach.icons.iteration - 1 ) % $gBitSystem->getConfig('max_records')) && !$smarty.foreach.icons.first}<br />{/if}
		<a href="#"><img src="{$icon.image}" title="{$icon.name}" alt="{$icon.name}" width="{$icon.icon_w}" height="{$icon.icon_h}" /></a>
	{/foreach}
	{pagination theme_id=$smarty.request.theme_id}
</div>
{/strip}
