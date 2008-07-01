/* Dependencies: MochiKit Base Async, BitAjax.j  */
LibertyAttachment.preflightCheck = function( cform ){
        var cid = $(cform).content_id.value;
        if ( MochiKit.Base.isEmpty(cid) ){
			alert( "Please save this item first, then you can upload a file." );
            return false;
        }
		return true;
    };

LibertyAttachment.postflightCheck = function( form, d ){
    };
