{strip}
{form action="javascript:;" enctype="multipart/form-data" id="edit-copyright-form"}
    <input name="save_copyright" type="hidden" value="true">
    <input name="copyright_id" type="hidden" value="{$copyrightInfo.copyright_id}">
    <input name="tilelayer_id" type="hidden" value="{$copyrightInfo.tilelayer_id}">
	<div>
		Notice<br/>
		<input name="notice" type="text" size="50" value="{$copyrightInfo.notice}"><br/>
		
		MinZoom<br/>
		<input name="copyright_minzoom" type="text" size="5" value="{$copyrightInfo.copyright_minzoom}"><br/>
						
		Bounds<br/>
		<textarea name="bounds" rows="10">{$copyrightInfo.bounds}</textarea>
	</div>
	<input type="button" name="save_copyright_btn" value="Save" onclick="javascript:BitMap.EditSession.storeCopyright( this.form );">
	<input type="button" name="closecopyrightset" value="Close This Copyright" onclick="javascript:BitMap.EditSession.cancelEditCopyright()"></br>
	<a name="remove_copyright_btn" title="remove from this tilelayer" href="javascript:BitMap.EditSession.removeCopyright( this.form );">Remove</a> | 
	<a name="expunge_copyright_btn" title="delete this copyright!" href="javascript:BitMap.EditSession.expungeCopyright( this.form );">Delete</a>
{/form}
{/strip}