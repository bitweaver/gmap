{strip}
<div id="view_polylinestyles">
	<div class="row">
		<a href="javascript:void(0);" onclick="BitMap.hide('polyline_styles');" style="float:right">{biticon iname=window-close iexplain="Close"}</a>
	</div>

	<ul>
		{if $polytype == 'polygon'}
		<li><a href="javascript:void(0);" onclick="BitMap.EditSession.setPolyStyle('{$polytype}',null,'None');">None</a></li>
		{/if}

		<li><a href="javascript:void(0);" onclick="BitMap.EditSession.setPolyStyle('{$polytype}',0,'Default (blue)');">Default (blue)</a></li>

		{foreach from=$styles item=style name=styles}
		<li>
			<a href="javascript:void(0);" onclick="BitMap.EditSession.setPolyStyle('{$polytype}',{$style.style_id},'{$style.name}');">
				{$style.name}
			</a>
		</li>
		{/foreach}
	</ul>
	{include file="bitpackage:gmap/jspagination.tpl" ajaxHandler="BitMap.EditSession.getPolyStyles" ajaxInputId="`$polytype`styleid"}
</div>
{/strip}
