Ext.define("Afisha.util.gf",{alternateClassName:"Afisha.gf",config:{},statics:{share:function(b,a){if(!window.plugins||!window.plugins.share&&!window.plugins.shareKit){return}if(window.plugins.share){window.plugins.share.show({subject:b,text:b+"\n"+a},Ext.emptyFn,Ext.emptyFn)}else{if(window.plugins.shareKit){window.plugins.shareKit.share(b+"\n"+a,a)}}},alert:function(c,b,a){var d=Global.app_name;if(Ext.os.is.Desktop){Ext.Msg.alert(d,c);return}navigator.notification.alert(c,b?b:Ext.emptyFn,d);navigator.notification.vibrate(300)},isOnline:function(b){var a;if(Ext.os.is.Desktop){return true}if(navigator.network.connection){a=navigator.network.connection.type==Connection.NONE}if(a&&b){this.alert("Нет интернета! Для работы с приложением подключитесь к сети.")}return !a},fastPos:function(b,a){navigator.geolocation.getCurrentPosition(b,a,{enableHighAccuracy:false,timeout:10000,maximumAge:3000000})},getCurrentPos:function(b,a){navigator.geolocation.getCurrentPosition(b,a,{enableHighAccuracy:true,timeout:30000,maximumAge:300000})},openUrl:function(b,c,d){var a=b.getAttribute("href");if(a.indexOf("tel:")==-1&&a.indexOf("mailto:")==-1&&a.indexOf("http")==-1){a="http://"+a}window.open(a,"_system","location=yes")},unifySchedule:function(b){for(var a=0;a<b.length;a++){if(b[a].clubevent_id){b[a].event_id=b[a].clubevent_id;delete b[a].clubevent_id}if(b[a].club_id){b[a].place_id=b[a].club_id;delete b[a].club_id}if(b[a].film_id){b[a].event_id=b[a].film_id;delete b[a].film_id}}return b}},constructor:function(a){}});