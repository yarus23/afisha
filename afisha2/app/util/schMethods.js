Ext.define('Afisha.util.schMethods', {
    alternateClassName:'Afisha.schMethods',
    config: {
        //
    },
    statics: {
        /**
         * @param {Date} date/null/'week'/'nextweek'
         * @param {String} sDate YYYY-MM-DD - дата начала мероприятия
         * @param {String} fDate YYYY-MM-DD - дата окончания мероприятия
         **/
        compareDates:function(date, sDate, fDate){
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
        },
        /*
        критерий того что фильм будет скоро - пустое поле price во всех кинотеатрах
             * **/
        isComingSoon:function (film_id, fn) {
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
        },
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
        getSchedule:function (store, cId, isEvent) {
            var schStore = Ext.getStore('Schedule');
            var placesStore = Ext.getStore('Places');
            var eventsStore = Ext.getStore('Events');
            //if (!store.schedule)
            //    return [];
            var result = {
                data:[],
                cache:[]
            }; //переделать без глобальных переменных
            var ob_type = isEvent ? 'event' : 'place';
            var cfi = !isEvent ? 'place_id' : 'event_id';//store.key_field;
            var cdf = isEvent ? 'place_id' : 'event_id';//store.val_field;
            var ep = isEvent ? placesStore : eventsStore;
            //store = !isEvent ? placesStore : eventsStore;
            var tDate = new Date();
            //don't touch
//            if (store.isLifeServices)
//            {
//                schStore.each(function(record){
//                    if (record.data[cfi] == this.id)
//                    {
//                        var obj = {};
//                        obj.ep = ep.getById(record.data[cdf]);
//                        if (obj.ep == null)
//                            return;
//                        obj.schedule = [];
//                        obj.date = ob_type;
//                        if (record.data.price_min > 0 || record.data.price_max > 0)
//                            obj.isService = true;
//                        obj.schedule.push({
//                            price_min:record.data.price_min,
//                            price_max:record.data.price_max
//                        });
//                        result.data.push(obj);
//                    }
//                },{
//                    id:cId
//                });
//                if (!result.data.length)
//                    result.data.push({
//                        date:null,
//                        ob_type:ob_type
//                    })
//            }
//            else
                schStore.each(function(record){
                    //console.log(record)
                    if ((record.data[cfi] == this.id) && 
                        ((record.data.start_date > tDate.format('Y-m-d')) || 
                            ((record.data.start_date == tDate.format('Y-m-d')) && (record.data.start_time >= tDate.format('H:i')))  || 
                            (record.data.finish_date >= tDate.format('Y-m-d')) ))
                            {
                        var idx = result.cache.indexOf(record.data[cdf] + record.data.start_date);
                        if (idx == -1)
                        {
                            var obj = {};
                            obj.ep = ep.getById(record.data[cdf]);
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
        },
        getScheduleByDate: function (schedule, cDate) {
            var result = [];
            //debugger;
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
                if (Afisha.schMethods.compareDates(cDate,el.date, el.finish_date))
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
        },
        getMonthName: function(num)
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
        },
        getMonthShortName: function (num)
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
        },
        getDayOfWeek: function(date)
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
        },
        getGroupString: function(record) {
            var date = record.get('date');
            var startDayOfWeek = '';
                //finishDayOfWeek = '';//dayOfWeek
            if (!date) 
            {
                var o_type = record.get('ob_type');
                if (o_type == 'place')
                    return 'Услуги не заданы'
                if (o_type == 'event')
                    return 'Места не заданы'
                return 'Событий нет';
            }

            if (date == 'place')
                return 'Услуги'
            if (date == 'event')
                return 'Места'
            var fdate = record.get('finish_date');
            startDayOfWeek = Afisha.schMethods.getDayOfWeek(date);
            //finishDayOfWeek = getDayOfWeek(fdate);
            date = date.split('-');
            if (fdate)
                fdate = fdate.split('-')
            if (date.length != 3)
                return '';
//            debugger;
            if (!record.data.schedule || !record.data.schedule.length)
                return (date[2][0]=='0'?date[2][1]:date[2]) + Afisha.schMethods.getMonthName(date[1]) + ' событий нет';
            else
                return fdate?
                    'Расписание на ' + (date[2][0]=='0'?date[2][1]:date[2]) + Afisha.schMethods.getMonthName(date[1]) + ' - ' + (fdate[2][0]=='0'?fdate[2][1]:fdate[2]) + Afisha.schMethods.getMonthName(fdate[1]):
                    'Расписание на ' + (date[2][0]=='0'?date[2][1]:date[2]) + Afisha.schMethods.getMonthName(date[1]) + startDayOfWeek;
        }
    },
    constructor: function(config) {
        //this.initConfig(config);
    }
});

