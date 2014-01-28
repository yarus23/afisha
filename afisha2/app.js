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
} **/
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
};


Afisha.initListWidth = function() {
        var allWidth = Ext.Viewport.getWindowWidth();
        var emWidth = Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        Afisha.titleWidth = allWidth - 5 * emWidth; 
};

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
Afisha.getDistanceStr = function(data)
{
	if (!Afisha.useGPS)
		return '';
	var lat = data.lat?data.lat:data.latitude;
	var lng = data.lng?data.lng:data.longitude;
	if( !Afisha.position || !lat || !lng) return '';
	var d = Geo.dist(lat, lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
	if( d < 1 ) return (d * 1000).toFixed(1) + 'м'
	else return d.toFixed(1) + 'км';
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
    requires:['Ext.DateExtras', 'Afisha.util.gf','Afisha.util.schMethods','Afisha.util.Settings'],
    views:['Viewport','FavContent','CommentsView','Adv','ImgFullView','MapView','Discount.DiscView','Discount.DiscList','AfishaViews.Categories', 'AfishaViews.Events','AfishaViews.PlaceView','AfishaViews.EventView', 'AfishaViews.TileView','News.NewsList', 'AfishaViews.FilterView','News.PageView','Settings', 'AuthView'],
    models:['Settings','Favorites','Comments','AfishaModels.PlaceComments','AfishaModels.CachedData', 'AfishaModels.Categories','AfishaModels.Events','AfishaModels.Places','AfishaModels.Schedule','AfishaModels.Dictionary','AfishaModels.ScheduleList','News.NewsList','News.PageView','Discount.DiscView','Discount.DiscList','News.NewsRubric'],
    stores:['Settings','Favorites','Comments','AfishaStores.PlaceComments','AfishaStores.Cache', 'AfishaStores.Categories','AfishaStores.LifeSubCategories','AfishaStores.Events','AfishaStores.Places','AfishaStores.Schedule','AfishaStores.Dictionary','News.NewsList','News.PageView','Discount.DiscView','Discount.DiscList','News.NewsRubric','Discount.DiscRubric'],
    controllers:['Navigation','Comments','Adv','Discount.DiscView','Discount.DiscList','AfishaC.Categories', 'AfishaC.Events','AfishaC.PlaceView','AfishaC.EventView','ImgFullView','MapView', 'AfishaC.TilesView','News.NewsList', 'AfishaC.FilterView','News.PageView','FavContent','Settings','AfishaC.OAuth'],
    launch: function() {
        this.Settings = Ext.create('Afisha.util.Settings',{});
        var splash = window.document.getElementById('splash');
        splash.style.display = "none";
        var adv_splash = window.document.getElementById('adv_splash');
        adv_splash.style.display = "none";
        //компенсируем изменения сенчи
        Date.prototype.format = function(format){
            return Ext.DateExtras.format(this, format);
        }
        //Ext.fly('splash').destroy();
        //переносим всякий левак из regApplication
        Ext.Viewport.add([{
                xtype: 'aviewport'
        },{
            xtype:'adv'
        },{
            xtype:'actionsheet',
            id:'advAS',
            hidden: true
        }]);

       document.addEventListener("deviceready", function(){
            if (parseFloat(window.device.version) === 7.0) {
               //console.log('iOS7 is the official OS of SATAN!');
               document.body.style.marginTop = "20px";
               document.body.style.backgroundColor = "#e96f37";
               Ext.Viewport.setHeight(Ext.Viewport.getWindowHeight() - 20);
            }
        Afisha.gf.isOnline(true);
        // включаем watch
        Afisha.geo = new Geo();
        Afisha.geo.startFastWatch(function(position){
            Afisha.position = position;
        // если активна сортировка по расстоянию то сортируем
        // todo:
        }, function(err){
            //debugger;
            //alert('geo err')
            });
       }, false);

        

    },

});
