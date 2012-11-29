var splash = 'http://img.rodgor.ru/afisha/splashes/';

function now(){
	return (new Date).getTime();
}
var getSplash = function(){
	if(!window.w) window.w = window.screen.width; if(!window.h) window.h = window.screen.height;
	window.main_splash_start = now();
	//style="width:'+window.w+'px; height:'+window.h+'px;"
	if(Ext.is.Android)
		return '<img onload="loadAdvSplash();" style="width:100%; height:100%;" src="config/resources/icons/splash_android.png"/>';
	if(Ext.is.iPad)
		return '<img onload="loadAdvSplash();" style="width:100%; height:100%;" src="config/resources/icons/768-1004.png"/>';
	if(Ext.is.iPhone)
		return '<img onload="loadAdvSplash();" style="width:100%; height:100%;" src="config/resources/icons/640-960.png"/>';
	return '<img onload="loadAdvSplash();" style="width:100%; height:100%;" src="config/resources/icons/splash.png"/>';
}

function loadAdvSplash(){
	setTimeout('_continue();', 1000);
	var adv_splash = new Image();
	/*adv_splash.style.width = window.w;
	adv_splash.style.height = window.h;*/
	adv_splash.style.width = "100%";
	adv_splash.style.height = "100%";
	var start;
	adv_splash.onload = function(){
		if( document.getElementsByClassName("splash").length != 0 ){
			document.getElementsByClassName("splash")[0].getElementsByTagName("img")[0].style.display = "none";
			document.getElementsByClassName("splash")[0].appendChild(this);
		}	
		_continue();
	};
	start = now();
	if(Ext.is.Android)
		adv_splash.src = splash + 'splash-409-665.png';
	else if(Ext.is.iPhone)
		adv_splash.src = splash + 'splash-640-960.png';
	else if(Ext.is.iPad)
		adv_splash.src = splash + 'splash-768-1004.png';
	else	
		adv_splash.src = splash + 'splash-409-665.png';
}

var c = false;
function _continue(){ 
	if(c == true)
		return;
	c = true;	
	loadNextScriptFile();
}