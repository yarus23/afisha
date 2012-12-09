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
Afisha = {};
Afisha.useGPS = true;
Afisha.lastRequest = null;

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
 
//Ext.Ajax.setDisableCaching(false);
Ext.application({
    name: 'Afisha',
    requires:['Afisha.util.gf'],
    views:['Viewport','AfishaViews.Categories', 'AfishaViews.Events'],
    models:['AfishaModels.CachedData', 'AfishaModels.Categories','AfishaModels.Events','AfishaModels.Places','AfishaModels.Schedule'],
    stores:['AfishaStores.Cache', 'AfishaStores.Categories','AfishaStores.LifeSubCategories','AfishaStores.Events','AfishaStores.Places','AfishaStores.Schedule'],
    controllers:['Navigation','AfishaC.Categories', 'AfishaC.Events'],
    launch: function() {
        //Ext.fly('splash').destroy();
        //переносим всякий левак из regApplication
        Ext.Viewport.add({
			xtype: 'aviewport'
		});
        Afisha.gf.isOnline(true);
    },

});
