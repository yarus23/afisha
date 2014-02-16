/* 
 * Global functions and variables here
 */
Ext.define('Afisha.util.gf', {
    alternateClassName:'Afisha.gf',
    config: {
        em : 0
    },
    statics: {
        //public
        getEmToPxHeight:function(inEm){
            if (this.em){
                return Math.ceil(this.em*inEm);
            }
            var em,
            container,
            bodyImageWidth;
            container = Ext.getBody();
            em = new Ext.Element(document.createElement('div'));
            em.setStyle('height','0em');
            em.setStyle('width','1em');
            container.appendChild(em);
            this.em = em.getWidth();
            container.removeChild(em);
            return Math.ceil(this.em*inEm);
        },
        share:function(title,url){
            if (!window.plugins || !window.plugins.share && !window.plugins.shareKit)
                    return;

            //try EXTRA_TITLE
            if (window.plugins.share) { //Android
                    window.plugins.share.show({
                                    subject: title,
                                    text:    title + '\n' + url
                            },
                            Ext.emptyFn, // Success function
                            Ext.emptyFn // Failure function
                    );
            } else if (window.plugins.shareKit) { //iOS
                    window.plugins.shareKit.share(title + '\n' + url, url);
            }
        },
        //использовать так - MT.gf.alert('текст алерта')
        alert:function(message, fn, scope ){
            var title = Global.app_name;
//            if (Ext.os.is.Desktop){
                Ext.Msg.alert(title, message);
                return;
//            }
//            navigator.notification.alert(message, fn ? fn : Ext.emptyFn, title);
//            navigator.notification.vibrate(300);
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
            var href = link_el.getAttribute('href');
            if (href.indexOf("tel:") == -1 && href.indexOf("mailto:") == -1 && href.indexOf("http") == -1){
                href = "http://" + href;
            }
            window.open(href, '_system', 'location=yes');
//            return;
//            var href;
//            if ( ( !Ext.os.is.iOS || not_external) && !external) {
//                link_el.mouseClick();
//            } else {        	
//                href = link_el.getAttribute('href');
//                href = encodeURI(href);
//                if (window.plugins && window.plugins.childBrowser)
//                    window.plugins.childBrowser.showWebPage(href);
//                else
//                    link_el.mouseClick();
//            }
        },
        ///приводим все объекты к одному виду, чтобы убрать film_id у фильмов, clubevent_id у всего остального, а чтобы у всех было event_id  итд
        unifySchedule: function(data){
            for (var i = 0; i< data.length; i++){
                if (data[i].clubevent_id){
                    data[i].event_id = data[i].clubevent_id;
                    delete data[i].clubevent_id;
                }
                if (data[i].club_id){
                    data[i].place_id = data[i].club_id;
                    delete data[i].club_id;
                }
                if (data[i].film_id){
                    data[i].event_id = data[i].film_id;
                    delete data[i].film_id;
                }
            }
            return data;
        }
    },
    constructor: function(config) {
//        this.initConfig(config);
    }
});

