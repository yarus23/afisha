var isOnline = function(par){
    if(Ext.is.Desktop) {
        return true;
    }
    if(Ext.is.Nokia){
        testNetwork();
        if(navigator.network.lastReachability === true || navigator.network.lastReachability === null)
            return true;
        return false;	
    }
    else if( navigator.network.connection )
        return !(navigator.network.connection.type == Connection.NONE); //show splash screen?
	 	
    return true;
}

// todo: использовать наследование
// todo: использовать контроллеры
// todo: добавить tabbar

Ext.ns('Afisha');
Ext.uf = {}; //user flags
//Ext.uf.noLocalStorage = true;
    
/*Afisha.LoadMask = Ext.extend(Ext.LoadMask, {
    onBeforeLoad : function() {
        if (!this.disabled) {
            this.el.mask(getSplash(), 'splash', false);
            this.fireEvent('show', this, this.el, this.store);
        }
    } 
});
*/
var g_ui = 'light';
var g_slideAnimation = {
    type:'slide',
    direction:'right'
};//!Ext.is.Android;
/*var g_mask = new Afisha.LoadMask(Ext.getBody(), {msg:'', msgCls:'splash'});
g_mask.show();
Ext.get(Ext.query('.x-mask-gray')).setWidth(window.w);
Ext.get(Ext.query('.x-mask-gray')).setHeight(window.h);
Ext.get(Ext.query('.x-mask-gray')).addCls('solid');*/


Ext.regApplication({
    name: "Afisha",
    //    useLoadMask: true, // todo: добавить splashscreen 
    //icon: 'resources/images/kiva.png',
    useGPS:true,
    glossOnIcon: false,
    //    tabletStartupScreen: 'resources/images/tablet_startup.png',
    oldversion:false,
    /*
     *@param showbuttons - set false for Android
     **/
    
    showButtons: !Ext.is.Android,    
    /**
     * This function is automatically called when the document has finished loading.
     */
    mainLaunch:function(){
        this.lastRequest = null;
        /*--start--*/       if (typeof device === undefined ) 
            return;
        if (Ext.is.Android && device.version <='2.1-update1')               //нужно протестировать
            this.oldversion = true;
        if( Ext.is.Nokia ){
            this.oldversion = true;
	    Afisha.lowMemory = true;
	}
        if( !Ext.is.Desktop )
        Ext.override(Ext.MessageBox, {
            alert: function(title,msg,callback,scope) {
                navigator.notification.alert(msg, callback ? callback : function(){}, title);
            }
        });
        isOnline = function(withAlert){
      		if (Ext.is.Desktop) {
		        return true;
      		}

                var offline = true;
		if(Ext.is.Nokia){
			testNetwork();
			if(navigator.network.lastReachability === true || navigator.network.lastReachability === null)
				offline = false;
			else
				offline = true;
		}
		if( navigator.network.connection )
			offline = navigator.network.connection.type == Connection.NONE;
                if (withAlert && offline)
                        Ext.Msg.alert(G.app_name, 'Нет интернета! Для работы с приложением подключитесь к сети.');
            return !offline;
        };
		if(!Ext.is.Nokia) 
			isOnline(true);
		else if(navigator.network.lastReachability !== true)
			testNetwork();	
     
        /*if(Ext.is.iOS)
            ChildBrowser.install();*/ // вылетало при использовании cordova 1.7.0

        if (!this.showButtons)
        {
            document.addEventListener("menubutton", this.onMenuTap, false);
            document.addEventListener("backbutton", this.onBackKeyDown, false);
        }

        Ext.dispatch({
            controller: 'main',
            action    : 'list'
        });
    },
    /*launch: function() {
        this.launched = true;
        this.mainLaunch();
    },*/
    onBackKeyDown:function() {
        Ext.dispatch({
            controller: 'main',
            action    : 'historyBack'
        });
    },
    onMenuTap:function(){
        Ext.dispatch({
            controller: 'main',
            action    : 'menuTap'
        });
    },
    getDistanceStr:function(data)
    {
        if (!Afisha.useGPS)
            return '';
        var lat = data.lat?data.lat:data.latitude;
        var lng = data.lng?data.lng:data.longitude;
        if( !Afisha.position || !lat || !lng) return '';
        var d = Geo.dist(lat, lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
        if( d < 1 ) return (d * 1000).toFixed(1) + 'м'
        else return d.toFixed(1) + 'км';
    },
    getRatingHtml:function(rate,type,trailer){
        var noRate = ['beauty','stomotolog','medic','fitnes'];
        if (type && trailer !== undefined && (noRate.indexOf(type) != -1))
            return '';
        var rate = parseFloat(rate);
        if (isNaN(rate))
            rate = 0;

        rate = Math.floor(rate + 0.499);
        if (Afisha.oldversion)
        {//star-3
            var s = '<div class="stars-set">';
            for(var i=0; i < 5; i++)
                if( i < rate )
                    s += '<img class="rating-star" src="config/resources/icons/starfilled.png"></img>';
                else
                    s += '<img class="rating-star-filled" src="config/resources/icons/star.png"></img>';
            s += '</div>';
            return s;
        }
        else
        {
            if (type)
                return '<img src="config/resources/icons/star-'+ rate + '.png" class="teststar"></img>';
            var s = '';
            if( rate >= 4.9 )
                s += '<div class="superstar"></div>';
            else
            if( rate == 0 )
                s += '<div class="superstar empty"></div>';
            else {
                s += '<div class="superstars"><div class="superstar" style="width:'+(0.76*rate + 0.05)+'em"></div><div class="superstar empty" style="width:'+0.8 * (5-rate)+'em"></div></div>';
            }
            return s;
        }
    },
    placesGroupString: function(record) {
        if (!this.showGroups || this.hideGroups)
            return '';
        if (record.get('sort') > 10 )
          {
            return 'Рекомендуем';
          }
        else
          return 'Все'; 
    },
    eventsGroupString: function(record) {
        if (!this.showGroups)
            return '';
        switch(this.curFilter)
        {
            case 'filterCurrentDay':
                return 'Сегодня';
            case 'filterNextDay':
                return 'Завтра';
            case 'filterCurrentWeek':
                return 'Текущая неделя';
            case 'filterNextWeek':
                return 'Следущая неделя';
            case 'filterAllDays':
                return 'Все';
            default:
                return '';
        }
    },
    resetSort: function(){
        this.curFilter = this.defFilter;
        this.clearFilter();
        if (this.defSorters)
            this.sort(this.defSorters,'ASC');
    },
    /**
     *
     * @param {String} place_id - идентификатор события
     * @param {String} date - Дата в формате 'Y-m-d'
     * @param {Boolean} isStrict - если истина, то сравнивается ==, иначе >=
     * @param {String} val_field - название поля в расписании, содержащего идентификатор события. не обязательное поле
     * 
     * @return {Boolean} результат сравнения
     * 
     **/
    ckeckByDate:function(event_id, date, end_date, val_field){
        if (!val_field)
            val_field = 'clubevent_id';
        if (end_date)
        {
            for (var i = 0; i < this.data.items.length; i++)
            {
                var fDate = this.data.items[i].data.finish_date;
                if ((this.data.items[i].data[val_field] == event_id) && ((fDate && (fDate >= date) && (this.data.items[i].data.start_date <= end_date)) || 
                    (!fDate && (this.data.items[i].data.start_date >= date) && (this.data.items[i].data.start_date <= end_date))))
                    return true;
            }
        }
        else
        {
            for (var i = 0; i < this.data.items.length; i++)
            {
                var fDate = this.data.items[i].data.finish_date;
                if ((this.data.items[i].data[val_field] == event_id) && ((fDate && (date >= this.data.items[i].data.start_date) && (date <= fDate)) || 
                    (!fDate && (this.data.items[i].data.start_date == date))))
                    return true;
            }
        }
        return false;
    },
    FilmsListOptions : [
                            {text: 'По алфавиту', value: 'sortByAsc'},
                            {text: 'По рейтингу', value: 'sortByRating'} 
                          ],
    EventsListOptions : [
                             {text: 'Сегодня', value: 'filterCurrentDay'},
                             {text: 'Завтра', value: 'filterNextDay'},
                             {text: 'Текущая неделя', value: 'filterCurrentWeek'},
                             {text: 'Следущая неделя', value: 'filterNextWeek'},
                             {text: 'Все', value: 'filterAllDays'}
                           ],
    PlacesListOptions : [
                             {text: 'По алфавиту', value: 'sortByAsc'},
                             {text: 'По рейтингу', value: 'sortByRating'},
                             {text: 'По расстоянию', value: 'sortByDistance'}
                           ],
    // флаги. необходимы для передачи параметров в глобальном масштабе, когда другие способы невозможны вследствие архитектуры приложения
    flags: {},
    getFlag: function (name, once) {
        var value = this.flags[name];
        if (once) {
            this.deleteFlag(name);
        }
        return value;

    },
    setFlag: function (name, value) {
        this.flags[name] = value;
    },
    deleteFlag: function (name) {
        this.flags[name] = undefined;
    }    
});