if (typeof(BitMap) == 'undefined') {
    BitMap = {};
}
if (typeof(BitMap.Utl) == 'undefined') {
    BitMap.Utl = {};
}
if (typeof(BitMap.Utl.JSCSS) == 'undefined') {
	//for changing elm class properties
	//(action,domelm,class1,class2)
	BitMap.Utl.JSCSS = function (a,o,c1,c2){
	  switch (a){
		case 'swap':
		  o.className=!BitMap.Utl.JSCSS('check',o,c1)?o.className.replace(c2,c1):o.className.replace(c1,c2);
		break;
		case 'add':
		  if(!BitMap.Utl.JSCSS('check',o,c1)){o.className+=o.className?' '+c1:c1;}
		break;
		case 'remove':
		  var rep=o.className.match(' '+c1)?' '+c1:c1;
		  o.className=o.className.replace(rep,'');
		break;
		case 'check':
		  return new RegExp('\\b'+c1+'\\b').test(o.className);
		break;
	  }
	}
}
