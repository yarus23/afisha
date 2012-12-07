Ext.data.Types.CUSTOMDATE = {
    convert: function(value) {
        var dateFormat = this.getDateFormat(),
            parsed;

        if (!value) {
            return null;
        }
        if (Ext.isDate(value)) {
            return value;
        }
        if (dateFormat) {
            if (dateFormat == 'timestamp') {
                return new Date(value*1000);
            }
            if (dateFormat == 'time') {
                return new Date(parseInt(value, 10));
            }
            return Ext.Date.parse(value, dateFormat);
        }

        parsed = new Date(Date.parse(value));
        if (isNaN(parsed)) {
            // Dates with ISO 8601 format are not well supported by mobile devices, this can work around the issue.
			if (!Ext.os.is.iOS) {
				if (Types.iso8601TestRe.test(value)) {
					parsed = value.split(Types.iso8601SplitRe);
					parsed = new Date(parsed[0], parsed[1]-1, parsed[2], parsed[3], parsed[4], parsed[5]);
				}
			}
            if (isNaN(parsed)) {
                // Dates with the format "2012-01-20" fail, but "2012/01/20" work in some browsers. We'll try and
                // get around that.
                parsed = new Date(Date.parse(value.replace(/-/g, "/")));
                //<debug>
                if (isNaN(parsed)) {
                    var arr = value.split(/[- :]/);
                    if(arr.length == 3)
                    parsed = new Date(arr[0], arr[1]-1, arr[2]);
                    else
                    parsed = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
                }
                //</debug>
            }
        }

        return isNaN(parsed) ? null : parsed;
    },
    sortType: Ext.data.SortTypes.asDate,
    type: 'customdate'
};
/*????????????? just copy&paste*/
Ext.uf = {}; //user flags
var g_ui = 'light';
var g_slideAnimation = {
    type:'slide',
    direction:'right'
};
/*=============================*/
Ext.Loader.setConfig({
    enabled: true,
    //disableCaching: false
});
//Ext.Ajax.setDisableCaching(false);
Ext.application({
    name: 'Afisha',
    requires:['Afisha.util.gf'],
    views:['Viewport','AfishaViews.Categories'],
    models:['AfishaModels.CachedData', 'AfishaModels.Categories','AfishaModels.Events','AfishaModels.Places','AfishaModels.Schedule'],
    stores:['AfishaStores.Cache', 'AfishaStores.Categories','AfishaStores.LifeSubCategories','AfishaStores.Events','AfishaStores.Places','AfishaStores.Schedule'],
    controllers:['Navigation','AfishaC.Categories'],
    launch: function() {
        //Ext.fly('splash').destroy();
        //переносим всякий левак из regApplication
        Afisha.useGPS = true;
        Afisha.lastRequest = null;
        Afisha.getDistanceStr = function(data) {
            if (!Afisha.useGPS)
                return '';
            var lat = data.lat?data.lat:data.latitude;
            var lng = data.lng?data.lng:data.longitude;
            if( !Afisha.position || !lat || !lng) return '';
            var d = Geo.dist(lat, lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
            if( d < 1 ) return (d * 1000).toFixed(1) + 'м'
            else return d.toFixed(1) + 'км';
        }
        Afisha.getRatingHtml = function(rate,type,trailer){
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
        }
        Afisha.placesGroupString = function(record) {
            if (!this.showGroups || this.hideGroups)
                return '';
            if (record.get('sort') > 10 )
              {
                return 'Рекомендуем';
              }
            else
              return 'Все'; 
        }
        Afisha.eventsGroupString = function(record) {
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
        }
        Afisha.ckeckByDate = function(event_id, date, end_date, val_field){
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
        }
        Ext.Viewport.add({
			xtype: 'aviewport'
		});
        Afisha.gf.isOnline(true);
    },

});
