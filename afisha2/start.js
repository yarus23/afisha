window.onerror = function(message, url, linenumber) {
    alert("JavaScript error: " + message + " on line" + linenumber + " for " + url);
}

var platform = {
	init: function(navigator) {
		var me = this,
			platforms = me.platforms,
			ln = platforms.length,
			i, platform;
		navigator = navigator || window.navigator;
		for (i = 0; i < ln; i++) {
			platform = platforms[i];
			me[platform.identity] = platform.regex.test(navigator[platform.property]);
		}
		me.Desktop = me.Mac || me.Windows || (me.Linux && !me.Android);
		me.iOS = me.iPhone || me.iPad || me.iPod;
		me.Standalone = !!navigator.standalone;
		i = me.Android && (/Android\s(\d+\.\d+)/.exec(navigator.userAgent));
		if (i) {
			me.AndroidVersion = i[1];
			me.AndroidMajorVersion = parseInt(i[1], 10);
		}
		me.Tablet = me.iPad || (me.Android && me.AndroidMajorVersion === 3);
		me.Phone = !me.Desktop && !me.Tablet;
		me.MultiTouch = !me.Blackberry && !me.Desktop && !(me.Android && me.AndroidVersion < 3);
	},
	platforms : [
		{property: 'platform', regex: /iPhone/i, identity: 'iPhone'},
		{property: 'platform', regex: /iPod/i, identity: 'iPod'},
		{property: 'userAgent', regex: /iPad/i, identity: 'iPad'},
		{property: 'userAgent', regex: /Blackberry/i, identity: 'Blackberry'},
		{property: 'userAgent', regex: /Android/i, identity: 'Android'},
		{property: 'platform', regex: /Mac/i, identity: 'Mac'},
		{property: 'platform', regex: /Win/i, identity: 'Windows'},
		{property: 'platform', regex: /Linux/i, identity: 'Linux'},
		{property: 'platform', regex: /Symbian/i, identity: 'Nokia'},
	]
};
platform.init();

Element.prototype.mouseClick = function()
{
    if( document.createEvent ) 
    {
        var evObj = document.createEvent('MouseEvents');
        evObj.initEvent( 'click', true, false );
        this.dispatchEvent(evObj);
    } else if( document.createEventObject ) 
{
        this.fireEvent('onclick');
    }
}

var xml2obj = function(xml) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            return null;
         return o;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   return X.toObj(X.removeWhite(xml));
};

window.onload = function() {
	start();
}

/*=======вставить урл площадки для сплэша===========*/
/*
 *структура xml
 *<root>
 *<AdImage>http://localhost/tst/</AdImage>
 *<AdImageExp>png</AdImageExp>
 *</root>
 **/
var splashXmlUrl = 'http://ads.adfox.ru/210050/getCode?p1=bkuwg&p2=etee&pfc=a&pfb=a&plp=a&pli=a&pop=a';//"http://localhost/tst/startup.php";
var splash_adv_path = '';
var splash_adv_exp = '';

var getSplashUrl = function(){

    var xmlhttp = new XMLHttpRequest();
    if (!xmlhttp)
        return;
    xmlhttp.open("POST", encodeURI(splashXmlUrl), true);
    xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState != 4) 
          return;
      
      clearTimeout(timeout) // очистить таймаут при наступлении readyState 4
      if (xmlhttp.status == 200 && xmlhttp.responseXML) {
          var data = xml2obj(xmlhttp.responseXML);
          if (!data || !data.AdImage || !data.AdImageExp){
              //конец рекламной компании, защищаем пути
              localStorage.setItem('splash_adv_path','');
              localStorage.setItem('splash_adv_exp','');
              return;
          }
          if (!splash_adv_path)
              splash_adv_path = data.AdImage.replace("\n","");
          if (!splash_adv_exp)
              splash_adv_exp = data.AdImageExp.replace("\n","");
          localStorage.setItem('splash_adv_path',data.AdImage);
          localStorage.setItem('splash_adv_exp',data.AdImageExp);
          
      }
      else{
          //конец рекламной компании, защищаем пути
          localStorage.setItem('splash_adv_path','');
          localStorage.setItem('splash_adv_exp','');
      }
    }
    var timeout = setTimeout( function(){ xmlhttp.abort();}, 5000);
	try{
		xmlhttp.send(null);
	} catch(e){return;}
}
var start = function() {
        var tmp;
        getSplashUrl();
        //document.getElementById('splash').style.display = "block";
        //get url from localstorage
        if (!splash_adv_path){
            tmp = localStorage.getItem('splash_adv_path');
            splash_adv_path = tmp ? tmp : '';
        }
        if (!splash_adv_exp){
            tmp = localStorage.getItem('splash_adv_exp');
            splash_adv_exp = tmp ? tmp : '';
        }

	var splash_adv = new Image();
	splash_adv.onload = function() {
                document.getElementById('adv_splash').style.display = "block"; // изменить логику
		document.getElementById('adv_splash').appendChild(this);	
		document.getElementById('adv_close').onclick = function () {
			adv.event('close');
		}
		//adv.started = true;
		//setTimeout('adv.close("timer");', 5000);
		adv.event('adv_loaded');
                document.getElementById('splash').style.display = "none"; // изменить логику
		load_scripts.start();
	}	
	
        setTimeout('load_scripts.start();', 1000);

        if (platform.Android)
                splash_adv.src = splash_adv_path + '/splash-480-760.' + splash_adv_exp;
        else if (platform.iPhone)
                splash_adv.src = splash_adv_path + '/splash-640-920.' + splash_adv_exp;
        else if (platform.iPad)
                splash_adv.src = splash_adv_path + '/splash-768-1004.' + splash_adv_exp;
        else
                splash_adv.src = splash_adv_path + '/splash-480-760.' + splash_adv_exp;


};
var adv = {
	event: function (evt) {
		var me = this;
		// close app_loaded adv_loaded app_pause app_resume
		if (evt == 'app_loaded') {
			me.flags.app_loaded = true;
			document.getElementById('adv_close').style.display = 'block';
			if (!me.flags.adv_loaded || (me.flags.adv_loaded && me.timer == -1)) {
				me.stop();
			}
		}
		
		if (evt == 'adv_loaded') {
			me.flags.adv_loaded = true;
			if (!me.flags.app_loaded) { // если приложение еще не загружено
				me.start();
			}
		}
		
		if (evt == 'close') {
			me.stop();
		}
		
		if (evt == 'app_resume') {
			if (me.flags.adv_loaded) {
				me.start();
			}
		}
	},
	// data
	flags: {
		app_loaded: false,
		adv_loaded: false
	},
	timer: -1,
	// methods
	startTimer: function () {
		var me = this;
		me.stopTimer();
		me.timer = setTimeout('adv.stop();', 5000);
	},
	stopTimer: function () {
		var me = this;
		if (me.timer != -1) {
			clearTimeout(me.timer);
		}
		me.timer = -1;
	},
	start: function () {
		var me = this;
		document.getElementById('splash').style.display = 'block';
		me.startTimer();
	},
	stop: function () {
		var me = this;
		me.stopTimer();
		if (!me.flags.app_loaded) {
			return;
		}
			document.getElementById('splash').style.display = 'none';
	}
};
/*var start = function() {
    var splash_el = document.getElementById('splash');
	var splash_path = 'resources/images/';
	var splash_ext = 'png';
	
    if (window.innerWidth != 0) {
		splash_el.style.height = (window.innerHeight) + 'px';
		splash_el.style.width = (window.innerWidth) + 'px';	
	} else {
		splash_el.style.height = '100%';
		splash_el.style.width = '100%';
	}

	if (platform.iPhone) {
        splash_el.src = splash_path + '640-920.' + splash_ext;
	}
    else if (platform.iPad) {
        splash_el.src = splash_path + '768-1004.' + splash_ext;
	}
    else if (platform.Android) {
	    splash_el.src = splash_path + '480-760.' + splash_ext;
	}
	else {
		splash_el.src = splash_path + '768-1004.' + splash_ext;
    }
	load_scripts.start();
};*/

var load_scripts = {
	start : function() {
		var me = this;
		if( !me.started )
			loadNextScriptFile();
		me.started = true;
	},
	started : false
};

var js_files = [
        {js: "lib/cordova.js", onlyphone:true },
	{js: "lib/sencha/sencha-touch-all.js"},
	{js: "app/util/geolib.js"},
	{js: "config/config.js"},
	{js: "lib/jsOAuth-1.3.3.js"},
        {js: "app/util/oauth.js"},
        //{js: "http://maps.google.com/maps/api/js?sensor=true"},
        {js: "app.js"}
        
];     

var ios_js_files = [
    {js: "lib/cordova_ios.js"},
	{js: "lib/sencha/sencha-touch-all.js"},
	{js: "app/util/geolib.js"},
	{js: "config/config.js"},
	{js: "lib/jsOAuth-1.3.3.js"},
    {js: "app/util/oauth.js"},
    //{js: "http://maps.google.com/maps/api/js?sensor=true"},
    {js: "app.js"}
];

function loadNextScriptFile() {
	var files = platform.iOS ? ios_js_files  : js_files;
	if( files.length == 0 ){
		return false;
	}
	var script_obj = files.shift();
        if( platform.Desktop && script_obj.onlyphone ) script_obj = files.shift();
	var script = document.createElement("script");
	script.type = "text/javascript";
	// for develop
        if (platform.Desktop) {
            var now = new Date();
            script_obj.js = script_obj.js + '?' + now.getTime();
        }
        // ---
        script.src = script_obj.js;
	if( !script_obj.pause && !script_obj.onload )
		script.setAttribute( 'onload', 'loadNextScriptFile();' );
	else if( !script_obj.pause && script_obj.onload )
		script.setAttribute( 'onload', script_obj.onload + 'loadNextScriptFile();');
	else if( script_obj.pause != true )
	 	script.setAttribute( 'onload', script_obj.onload );
	document.getElementsByTagName('head')[0].appendChild( script );
	return true;
}
