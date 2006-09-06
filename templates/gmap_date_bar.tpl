{strip}
<div class="date">{tr}By{/tr} {displayname user=$gContent->mInfo.creator_user user_id=$gContent->mInfo.user_id real_name=$gContent->mInfo.creator_real_name}, {tr}Last modification on{/tr} {$gContent->mInfo.last_modified|bit_short_datetime} {if $gContent->mInfo.modifier_user_id!=$gContent->mInfo.user_id} {tr}by{/tr} {displayname user=$gContent->mInfo.modifier_user user_id=$gContent->mInfo.modifier_user_id real_name=$gContent->mInfo.modifier_real_name}{/if}</div>
{/strip}
