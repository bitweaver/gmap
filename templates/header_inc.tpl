{if $smarty.const.ACTIVE_PACKAGE eq 'gmap'}
  <style type="text/css">  
  			 v\:* {ldelim}behavior:url(#default#VML);{rdelim}  
  </style>
  <script src="templates/formsubmit.js" type="text/javascript"></script>
  <script src="http://maps.google.com/maps?file=api&v=1&key=ABQIAAAAJT4kmuivSci-89GstnJC4RRV7odDxfA85MipS2v9JDjAeFIreRRYsCjfEBwLpjtr82dna0JJNT2Vvw" type="text/javascript"></script>
  {include file="bitpackage:gmap/js_makemarkers.tpl"}
  {include file="bitpackage:gmap/js_makepolylines.tpl"}
  {include file="bitpackage:gmap/js_makegmap.tpl"}
{/if}
