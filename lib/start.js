var G = Global;
var db_name = !G.debug ? Global.db_name : 'test';var server_url = !G.debug ? G.server_url : 'http://localhost:8080/server/afisha/'; 
db_name = db_name || window.location.toString().split('?')[1].split('=')[1]; // для тестовых версий афиши

var server_script_folder = server_url + 'appfiles/' + db_name + '/config/';
var server_script_url  = server_url + 'app/' + db_name;
var server_script_comments_url = server_script_url + '/comments';
var server = true;

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
    {
        property: 'platform', 
        regex: /iPhone/i, 
        identity: 'iPhone'
    },

    {
        property: 'platform', 
        regex: /iPod/i, 
        identity: 'iPod'
    },

    {
        property: 'userAgent', 
        regex: /iPad/i, 
        identity: 'iPad'
    },

    {
        property: 'userAgent', 
        regex: /Blackberry/i, 
        identity: 'Blackberry'
    },

    {
        property: 'userAgent', 
        regex: /Android/i, 
        identity: 'Android'
    },

    {
        property: 'platform', 
        regex: /Mac/i, 
        identity: 'Mac'
    },

    {
        property: 'platform', 
        regex: /Win/i, 
        identity: 'Windows'
    },

    {
        property: 'platform', 
        regex: /Linux/i, 
        identity: 'Linux'
    },

    {
        property: 'platform', 
        regex: /Symbian/i, 
        identity: 'Nokia'
    },
    ]
};
platform.init();

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
    if( platform.Nokia ){
        document.body.style.webkitUserSelect = "none";
    }	
    window.bodyloaded = true;
    start();
    if( platform.Nokia )
        deviceready();
}

function testNetwork() {
    navigator.network.isReachable('http://google.com', function (res) { 
        if (res == 1) {
            navigator.network.lastReachability = true;
        } else {
            navigator.network.lastReachability = false;
        }
    });	
}

function deviceready(){
    if( platform.Nokia )
        testNetwork();
    window.phonegaploaded = true;
    start();	
};

document.addEventListener("deviceready", deviceready, false);

/*=======вставить урл площадки для сплэша===========*/
/*
 *структура xml
 *<root>
 *<AdImage>http://localhost/tst/</AdImage>
 *<AdImageExp>png</AdImageExp>
 *</root>
 **/
var splashXmlUrl = G.banner_adv;//'http://ads.adfox.ru/200121/getCode?p1=biorg&p2=eoxv&pfc=a&pfb=a&plp=a&pli=a&pop=a';//"http://localhost/tst/startup.php";
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
              splash_adv_path = data.AdImage;
          if (!splash_adv_exp)
              splash_adv_exp = data.AdImageExp;
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
    xmlhttp.send(null);
}
var start = function() {
        var tmp; 
	if( !window.bodyloaded || ( !window.phonegaploaded && !platform.Desktop ) )
		return;
        getSplashUrl();
        document.getElementById('splash').style.display = "block";
        //get url from localstorage
        if (!splash_adv_path){
            tmp = localStorage.getItem('splash_adv_path');
            splash_adv_path = tmp ? tmp : '';
        }
        if (!splash_adv_exp){
            tmp = localStorage.getItem('splash_adv_exp');
            splash_adv_exp = tmp ? tmp : '';
        }
	//var splash_adv_path = 'http://img.rodgor.ru/afisha/splashes/';
	var splash_common_path = 'config/resources/icons/';
	
    if (window.innerWidth != 0 && platform.Nokia) {
        document.getElementById('splash').style.height = (window.innerHeight - 5) + 'px';
        document.getElementById('splash').style.width = (window.innerWidth - 5) + 'px';	
    } else if (window.innerWidth != 0) {
        document.getElementById('splash').style.height = (window.innerHeight) + 'px';
        document.getElementById('splash').style.width = (window.innerWidth) + 'px';	
    } else {
        document.getElementById('splash').style.height = '100%';
        document.getElementById('splash').style.width = '100%';
    }
	
    var splash_common = new Image();
    var splash_adv = new Image();
    splash_adv.onload = function() {
        document.getElementById('splash').getElementsByTagName("img")[1].style.display = "none"; // изменить логику
        document.getElementById('splash').appendChild(this);	
        document.getElementById('adv_close').onclick = function () {
            adv.event('close');
        }
        //adv.started = true;
        //setTimeout('adv.close("timer");', 5000);
        adv.event('adv_loaded');
        load_scripts.start();
    }	
    splash_common.onload = function() {
        document.getElementById('splash').appendChild(this);	

        setTimeout('load_scripts.start();', 1000);
		
		if (platform.Android)
			splash_adv.src = splash_adv_path + '/splash-480-760.' + splash_adv_exp;
		else if (platform.iPhone)
			splash_adv.src = splash_adv_path + '/splash-640-920.' + splash_adv_exp;
		else if (platform.iPad)
			splash_adv.src = splash_adv_path + '/splash-768-1004.' + splash_adv_exp;
		else
			splash_adv.src = splash_adv_path + '/splash-480-760.' + splash_adv_exp;
	}	
	if (platform.Android)
		splash_common.src = splash_common_path + '320-480.png';
	else if (platform.iPhone)
		splash_common.src = splash_common_path + '640-960.png';
	else if (platform.iPad)
		splash_common.src = splash_common_path + '768-1004.png';
	else
		splash_common.src = splash_common_path + '320-480.png';
};

/*var adv  = {
	close: function (what) {
            var me = this;
                what == 'app' ? 
                    (function () {
                        me.app_loaded = true;
                        document.getElementById('close_adv').style.display = 'block';
                        document.getElementById('close_adv').onclick = function () {
                            me.close.call(me)
                        };
                    })() : me.timer = true;
                if (!me.started)
			me.timer = true;
		if (me.app_loaded && 	me.timer) {
			document.getElementById('splash').style.display = "none";
                        me.timer = false; me.started = false;
                }
	},
	timer: false,
	app_loaded: false,
	started: false
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
// sencha
{
    js: "lib/sencha-touch.js", 
    onload: "Ext.is.Nokia = platform.Nokia; if(Ext.is.Nokia) window.localStorage = navigator.storage;"
},
{
    js: "lib/sencha-touch-overloading.js"
},
// sencha-app
//	{ js: "lib/adv.js", },
{
    js: "app/app.js"
},
{
    js: "lib/TitledPicker.js"
},
{
    js: "lib/Carousel.js",
},
{
    js: "lib/backBtn.js",
},
{
    js: "lib/customSelectField.js",
},
{
    js: "lib/globalfunctions.js",
},
{
    js: "lib/geolib.js",
},
{
    js: "lib/options.js",
},
{
    js: "lib/UxBufList.js",
},
{
    js: "lib/dictreader.js",
},
{
    js: "lib/classiccombo.js",
},
{
    js: "lib/social.js",
},
{
    js:'lib/Ext.ux.touch.Rating/Ext.ux.touch.Rating.js'
},
{
    js:'lib/Ext.ux.PanelAction/Ext.ux.PanelAction.js'
},
// OAuth 
{
    js: "lib/md5.js",
},
{
    js: "lib/jsOAuth-1.3.3.js",
},
{
    js: "lib/oauth.js",
},
// sencha-models
{
    js: "app/models/kitchen.js",
},
{
    js: "app/models/schedulelist.js",
},
{
    js: "app/models/films.js",
},
{
    js: "app/models/places.js",
},
{
    js: "app/models/schedule.js",
},
{
    js: "app/models/cinemaroot.js",
},
{
	external: server_script_folder + 'categories.js',
	internal: "app/models/categories.js"
},
/*{
	js: server_script_folder + 'categories.js', onerror: "app/models/categories.js"
},
{
    js: "app/models/categories.js",
},*/
{
    js: "app/models/comments.js"
},
{
    js: "app/models/options.js"
},
// sencha-controllers
{
    js: "app/controllers/categories.js",
},
// sencha-views
{
    js: "app/views/detailsButtonsList.js",
},
{
    js: "app/views/detailsScheduleList.js",
},
{
    js: "app/views/detailsFooter.js",
},
{
    js: "app/views/detailsHeader.js",
},
{
    js: "app/views/galleryView.js",
},
{
    js: "app/views/detailsView.js",
},
{
    js: "app/views/socialPanel.js",
},
{
    js: "app/views/fullScheduleView.js",
},
{
    js: "app/views/phonesList.js",
},
{
    js: "app/views/mapView.js",
},
{
    js: "app/views/commentsView.js",
},
{
    js: "app/views/sendnews.js",
}, 
{
    js: "app/views/share/sharePanelWithBackButton.js",
},
{
    js: "app/views/share/detailsButtonsList.js",
},
{
    js: "app/views/share/main.js",
},
{
    js: "app/views/share/auth.js",
},
{
    js: "app/views/share/license.js",
},
{
    js: "app/views/share/friends.js",
}, 
{
    js: "app/views/share/about.js",
}, 
{
    js: "app/views/share/regard.js",
}, 
{
    js: "app/views/share/share.js",
}, 
{
    js: "app/views/optionsView.js",
}, 
{
    js: "app/views/adv.js",
}, 
{
    js: "app/views/viewport.js",
},
{
    js: "app/views/categories.js",
},     
{
    js: "app/views/events.js"
},     
{
    js: "lib/ga.js"
},      
{
    js: "app/views/favorites.js", 
    onload: "Afisha.mainLaunch();"
}
];            

function w_loadScript(external, internal) {
	Ext.Ajax.request({
		url: external,
		success: function(response, opts) {
			var javascript = response.responseText;
			window.localStorage.setItem('categories_js', javascript);
			eval(javascript);
			loadNextScriptFile();
		},
		failure: function(response, opts) {
			var javascript = window.localStorage.getItem('categories_js');
			if (!javascript) {
				loadNextScriptFile(internal);
			}
			else {
				eval(javascript);
				loadNextScriptFile();			
			}			
		}
	});
}

function loadNextScriptFile(script_obj) {
	if( !script_obj && js_files.length == 0 ){
        return false;
    }
    if(!script_obj)
		script_obj = js_files.shift();	

	if (script_obj.external != undefined ) {
		w_loadScript(script_obj.external, script_obj.internal);
		return;
	}	
		
	if(typeof script_obj != 'object') {
		script_obj = {js: script_obj};
	}
	
    var script = document.createElement("script");
    script.type = "text/javascript";
    // for develop
    var now = new Date();
    if (platform.Desktop) {
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
	if (script_obj.onerror) 
		script.setAttribute( 'onerror', 'loadNextScriptFile("' + script_obj.onerror + '");' );
    document.getElementsByTagName('head')[0].appendChild( script );
    return true;
}

document.addEventListener("resume", onResume, false);

function onResume() {
    adv.event('app_resume');
}

document.addEventListener("pause", onPause, false);

function onPause() {
    adv.event('app_pause');
}

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


