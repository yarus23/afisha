/* 
 * Global functions and variables here
 */
Ext.define('Afisha.util.gf', {
    alternateClassName:'Afisha.gf',
    config: {
        //
    },
    statics: {
        //public
        //использовать так - MT.gf.alert('текст алерта')
        alert:function(message, fn, scope ){
            var title = Global.app_name;
            if (Ext.os.is.Desktop){
                Ext.Msg.alert(title, message);
                return;
            }
            navigator.notification.alert(message, fn ? fn : Ext.emptyFn, title);
            navigator.notification.vibrate(300);
        },
        //public
        //использовать так - MT.gf.isOnline()
        isOnline : function(withAlert){
            var offline;
            if(Ext.os.is.Desktop) {
                return true;
            }
            if( navigator.network.connection )
                offline = navigator.network.connection.type == Connection.NONE; 
            if (offline && withAlert)
               this.alert('Нет интернета! Для работы с приложением подключитесь к сети.');
            return !offline;

        },
        fastPos: function(callback, errCallback)//callBack(obj) 
        {
                navigator.geolocation.getCurrentPosition(callback, errCallback,{ enableHighAccuracy: false, timeout: 10000, maximumAge: 3000000 });
        },

        getCurrentPos: function(callback, errCallback)//callBack(obj) 
        {
                navigator.geolocation.getCurrentPosition(callback, errCallback,{ enableHighAccuracy: true, timeout: 30000, maximumAge: 300000 });
        },
        openUrl: function(link_el, not_external, external) {
            var href;
            if ( ( !Ext.os.is.iOS || not_external) && !external) {
                link_el.mouseClick();
            } else {        	
                href = link_el.getAttribute('href');
                href = encodeURI(href);
                if (window.plugins && window.plugins.childBrowser)
                    window.plugins.childBrowser.showWebPage(href);
                else
                    link_el.mouseClick();
            }
        }
    },
    constructor: function(config) {
        //this.initConfig(config);
    }
});

