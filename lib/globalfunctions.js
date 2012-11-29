/*
 * Устанавливает дату в 00:00 следующего дня
 **/
Date.prototype.nextDay = function(){
    var cd = this.getDate();
    this.setHours(0, 0, 0, 0);
    this.setDate(cd + 1);
}

Date.prototype.nextWeek = function(){
    var cd = this.getDate();
    this.setHours(0, 0, 0, 0);
    this.setDate(cd + 7);
}

/*
 * Эмуляция Mouse Click
 **/
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

/**
 * @param {Date} date/null/'week'/'nextweek'
 * @param {String} sDate YYYY-MM-DD - дата начала мероприятия
 * @param {String} fDate YYYY-MM-DD - дата окончания мероприятия
 **/
function compareDates(date, sDate, fDate){
    switch(date)
    {
        case 'week':
        {
            var tDate = new Date();
            var startDate = tDate.format('Y-m-d');
            for (var i = tDate.format('w'); i<7; i++)
            {
                tDate.nextDay();
            }
            if (fDate)
                return ((fDate >= startDate) && (sDate <= tDate.format('Y-m-d')));
            else
                return ((sDate >= startDate) && (sDate <= tDate.format('Y-m-d')));
        }
        case 'nextweek':
        {
            var tDate = new Date();
            var startDate;
            for (var i = tDate.format('w'); i<14; i++)//monday
            {
                if ((i - 1) == 7)
                {
                    startDate = tDate.format('Y-m-d');
                }
                tDate.nextDay();
            }
            if (fDate)
                return ((fDate >= startDate) && (sDate <= tDate.format('Y-m-d')));
            else
                return ((sDate >= startDate) && (sDate <= tDate.format('Y-m-d')));
        }
        default:
            if (fDate)
                return ((date.format('Y-m-d') >= sDate) && (date.format('Y-m-d') <= fDate));
            else
                return (sDate == date.format('Y-m-d'));
    }
}

/*
критерий того что фильм будет скоро - пустое поле price во всех кинотеатрах
     * **/
function isComingSoon(film_id, fn)
{
    var retVal = true;//по умолчанию фильм в категории Скоро
    Afisha.stores.cinemaScheduleStore.each(function(record){
        if ((record.data.film_id === film_id) && record.data.price.length ) {
            retVal = false;
            return false;
        }
        return true;
    });

    //    if( retVal )
    //    console.log(fn);
    return retVal;
}

/**
     *
     * @param {Ext.data.Store} store - store содержащий текстовые имена следующих параметров:
     * - store для расписания. Обращение через поле store.schedule. Пример значения:"scheduleStore"
     * - store для place\event. Обращение через поле store.ep. Пример значения:"placeStore"
     * - имя поля в объекте schedule, для фильтрации по cId. Обращаться через store.key_field. Пример значения: "film_id"
     * - имя поля в объекте schedule, для которого будем отоброжать информацию. Обращаться через store.val_field. Пример значения: "place_id"
     * @param {Integer} cId - Place или Event id, для которого будет показано расписание
     * 
     * @return {Array} Список event или place с расписанием
     * 
     **/
function getSchedule(store, cId)
{
    if (!store.schedule)
        return [];
    var result = {
        data:[],
        cache:[]
    }; //переделать без глобальных переменных
    var cfi = store.key_field;
    var cdf = store.val_field;
    var ep = store.ep;
    var tDate = new Date();
    if (store.isLifeServices)
    {
        Afisha.stores[store.schedule].each(function(record){
            if (record.data[cfi] == this.id)
            {
                var obj = {};
                obj.ep = Afisha.stores[ep].getById(record.data[cdf]);
                if (obj.ep == null)
                    return;
                obj.schedule = [];
                obj.date = store.ob_type;
                if (record.data.price_min > 0 || record.data.price_max > 0)
                    obj.isService = true;
                obj.schedule.push({
                    price_min:record.data.price_min,
                    price_max:record.data.price_max
                });
                result.data.push(obj);
            }
        },{
            id:cId
        });
        if (!result.data.length)
            result.data.push({
                date:null,
                ob_type:store.ob_type
            })
    }
    else
        Afisha.stores[store.schedule].each(function(record){
            if ((record.data[cfi] == this.id) && 
                ((record.data.start_date > tDate.format('Y-m-d')) || 
                    ((record.data.start_date == tDate.format('Y-m-d')) && (record.data.start_time >= tDate.format('H:i')))  || 
                    (record.data.finish_date >= tDate.format('Y-m-d')) ))
                    {
                var idx = result.cache.indexOf(record.data[cdf] + record.data.start_date);
                if (idx == -1)
                {
                    var obj = {};
                    obj.ep = Afisha.stores[ep].getById(record.data[cdf]);
                    if (obj.ep == null)
                        return;
                    obj.isSchedule = true;
                    obj.schedule = [];
                    obj.date = record.data.start_date;
                    if (record.data.finish_date)
                        obj.finish_date = record.data.finish_date;
                    obj.schedule.push({
                        time:record.data.finish_time ? record.data.start_time + ' - ' + record.data.finish_time : record.data.start_time,
                        price:record.data.price
                    });
                    result.data.push(obj);
                    result.cache.push(record.data[cdf] + record.data.start_date);
                }
                else
                {
                    result.data[idx].schedule.push({
                        time:record.data.finish_time ? record.data.start_time + ' - ' + record.data.finish_time : record.data.start_time,
                        price:record.data.price
                    });
                }
            }
        },{
            id:cId
        });
    return result.data;
}

function getScheduleByDate(schedule, cDate)
{
    var result = [];
    if ( !schedule.length )
    {
        result.push({
            date:null
        });
        return result;
    }
    if ((schedule.length == 1) || !cDate)
    {
        return schedule;
    }
    schedule.forEach(function(el){
        if (compareDates(cDate,el.date, el.finish_date))
            result.push(el);
    })
    if (!result.length && cDate && (cDate != 'week') && (cDate != 'nextweek'))
        result.push({
            date:cDate.format('Y-m-d')
        })
    if (!result.length && (!cDate || (cDate == 'week') || (cDate == 'nextweek')))
        result.push({
            date:null
        }) 
    return result;
}

function initMapView()
{
    var mv = Ext.getCmp('mapView');
    if (mv)
        mv.addMap();
}

function getMonthName(num)
{
    switch(num)
    {
        case '01':
            return ' января';
        case '02':
            return ' февраля';
        case '03':
            return ' марта';
        case '04':
            return ' апреля';
        case '05':
            return ' мая';
        case '06':
            return ' июня';
        case '07':
            return ' июля';
        case '08':
            return ' августа';
        case '09':
            return ' сентября';
        case '10':
            return ' октября';
        case '11':
            return ' ноября';
        case '12':
            return ' декабря';
        default:
            return '';
    }
}
function getMonthShortName(num)
{
    switch(num)
    {
        case '01':
            return ' янв';
        case '02':
            return ' фев';
        case '03':
            return ' мар';
        case '04':
            return ' апр';
        case '05':
            return ' мая';
        case '06':
            return ' июн';
        case '07':
            return ' июл';
        case '08':
            return ' авг';
        case '09':
            return ' сен';
        case '10':
            return ' окт';
        case '11':
            return ' ноя';
        case '12':
            return ' дек';
        default:
            return '';
    }
}
function getDayOfWeek(date)
{
    var num = new Date(date).getDay();
    switch(num)
    {
        case 0:
            return ' (воскресенье)';
        case 1:
            return ' (понедельник)';
        case 2:
            return ' (вторник)';
        case 3:
            return ' (среда)';
        case 4:
            return ' (четверг)';
        case 5:
            return ' (пятница)';
        case 6:
            return ' (суббота)';
        default:
            return '';
    }
}

Afisha.openUrl = function(link_el, not_external, external) {
    if (Ext.is.Nokia) {
        GapUtility.openLink(link_el.getAttribute('href'));
    } else if ( ( !Ext.is.iOS || not_external) && !external) {
        if (!Ext.is.iOS && !Ext.is.Android) {
            link_el.setAttribute('target', '_blank');
        }
        Ext.dispatch({
            controller:'main',
            action:'goHref',
            hrefEl:link_el            
        });
    } else {        	
        link_el = link_el.getAttribute('href');
        link_el = encodeURI(link_el);
        window.plugins.childBrowser.showWebPage(link_el);
    }
}

Afisha.exit = function(){
    if(Ext.is.Nokia)
        navigator.utility.exit();
    else
        navigator.app.exitApp();
};


Afisha.Auth = {
    isAuthorized: function (that, callback) {
        var me = this;
        me.callback = {
            that: that, 
            callback: callback
        }
        Ext.is.Desktop ? setTimeout('Afisha.Auth.userdata = false; Afisha.Auth.callback.callback.call(Afisha.Auth.callback.that);', 5000) : Auth.isAuthorized(me, me.onResult);
    },
    getUserData: function () {
        var me = this;
        return me.userdata;
    },
    userdata: undefined,
    onResult: function (data) {
        //alert(data.error);
        var me = this;
        me.userdata = data.error ? false : data.data;
        Ext.is.Desktop ? me.prov_image = 'config/resources/icons/social/iko_6.png' : me.prov_image = data.provider.icon;
        me.callback.callback.call(me.callback.that);
    },
    unAuthorize: function (flag) {
        var me = this;
        me.userdata = flag ? undefined : false;
        me.callback.callback.call(me.callback.that);
        Auth.logout();
    },
    login: function(index) {
        var me = this;
        me.unAuthorize(1);
        Ext.is.Desktop ? setTimeout('Afisha.Auth.onResult({data:{identity: "http://yandex.ru", full_name:"Антон Перякин"}});', 5000) : Auth.login(index, me, me.onResult, me.onResult);
    },
    post: function (index, message, link, that, callback) {
        var me = this;
        if (!me.userdata || me.userdata.prov_name !== Providers.get(index).name) {
            // разлогиниваемся, получаем userdata, на callback вешаем эту же функцию
            me.unAuthorize(1);  
            Auth.login(index, me, 
                function (data) {
                    me.userdata = data.error ? false : data.data;
                    Ext.is.Desktop ? me.prov_image = 'config/resources/icons/social/iko_6.png' : me.prov_image = data.provider.icon;                    
                    me.post(index, message, link, that, callback);
                },
                function (data) {
                    me.userdata = data.error ? false : data.data;
                    Ext.is.Desktop ? me.prov_image = 'config/resources/icons/social/iko_6.png' : me.prov_image = data.provider.icon;                    
                    callback.call(that, 'error');
                });
        } else {
            // отправляем message + link  
            Providers.get(index).sendPost(message, link, that, callback);
            Ext.Msg.alert(G.app_name, 'Сообщение отправлено.')
        }
    }
};


Afisha.secret_key = '14y6ebwqpB';

Afisha.Rating = {
    storage: window.localStorage || window.sessionStorage,
    get: function (id) {
        var me = this;
        var value = me.storage.getItem(me.getId(id));
        value = value === null ? -1 : value;
        return value;
    },
    set: function (id, value) {
        var me = this;
        me.storage.setItem(me.getId(id), value);
    },
    getId: function (id) {
        var me = this;
        return 'rating_' + id;
    },
    send: function (id, value, send_data) {
        var me = this;
        if (me.get(me.getId(id)) !== -1)
            return false;

        if (send_data.type == 'life_org') {
            Ext.Ajax.request({
                url: 'http://life.rodgor.ru/org/voteadd.html',
                method:'POST',
                params: {
                    org_id: send_data.id,
                    vote: value + 1
                },
                success: function () {
                    me.set(me.getId(id), value)
                },
                failure: function () {
                //console.log('comment sending failed')
                }
            });
            return;
        }  
            
        //send_data.type
        var type = send_data.type;
        if (type == 'af_club' || type == 'af_concert' || type == 'af_expo' || type == 'af_theatre') {
            type = 'club';
        } else if (type == 'af_club_event' || type == 'af_concert_event' || type == 'af_expo_event' || type == 'af_theatre_event') {
            type = 'club_event';
        } else if (type == 'af_bath') {
            type = 'bath';
        } else if (type == 'af_restaurant') {
            type = 'rstn';
        } else if (type == 'af_film') {
            type = 'film';
        } else if (type == 'af_kino') {
            type = 'kino';
        } else {
            //console.log('comment sending failed ', type);
            return;
        }   
        
        var params = {
            app: 1, 
            vote_type: type,
            voting: value + 1,
            a: 'lets_afisha_vote'           
        }
        params[type + '_id'] = send_data.id;
        Ext.Ajax.request({
            url: 'http://tula.rodgor.ru/nafisha/index.php',
            method:'POST',
            params: params,
            success: function () {
                me.set(me.getId(id), value);
            },
            failure: function () {
            //console.log('comment sending failed')
            }
        }); 
        
    }
}

var _gaq = _gaq || []; 

var GoogleAnalytics = {
    gaq: _gaq,
    init: function () {
        var me = this;
        me.gaq.push(['_setAccount', G.ga]); 
        me.gaq.push(['_setDomainName', 'none']); 
        me.gaq.push(['_setAllowLinker', true]);        
        me.page('Main');
      
    },
    event: function (category, action, opt_label, opt_value) {
        _gaq.push(['_trackEvent', category, action, opt_label, opt_value]); 
    },
    page: function (page, opt_label) {
        var me = this;
        _gaq.push(['_trackPageview',page]); 
        if(opt_label)
            me.event('Page', page, opt_label);
    },
	advEvent: function (title, action) {
		_gaq.push(['_trackEvent', 'Реклама', title, action]); 
	}
};

GoogleAnalytics.init();
