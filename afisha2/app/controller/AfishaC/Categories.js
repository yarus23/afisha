Ext.define('Afisha.controller.AfishaC.Categories', {
    extend: 'Ext.app.Controller',
    
    // todo: через models и stores почему то не грузит

    /// Дефолтный Store для отображения корневых категорий
    defaultStore:'Categories',
    defaultTitle:Global.app_name,
    ///текущий отображаемый Store
    currentSubStore:null,
    config: {
        refs: {
			viewport: 'aviewport',
            categoriesView: 'aviewport categories',
            topToolbar: 'aviewport categories toptoolbar',
            catList: 'aviewport categories list'
        },

        control: {
            catList:{
                itemtap:'onCatListItemTap'
            }
        }
    },
    
    launch: function(){
        this.getApplication().on({
            switchToEvents: this.switchToEvents,
            switchTo: this.switchTo,
            switchToPlaceView:this.switchToPlaceView,
            scope: this});
            
    },
    // методы с возможностью загружать данные торчат наружу
    switchTo: function(id) {
       var me = this;
       this.loadCategory(id, function() { me.showEventsDialog(id) });        
    },
    switchToEvents: function() {
        this.switchTo(this.selectedItem.get('id'));
    },
    switchToPlaceView:function(opts){
        this.loadCategory(opts.type, function() {
            var placesStore = Ext.getStore('Places');
            var rec = placesStore.getById(opts.rid);
            if (rec == null){
                //del from favorites
                var favStore = Ext.getStore('Favorites');
                favStore.setFav(opts);
                Afisha.gf.alert("Место больше недоступно и будет удалено из избранного!");
                return;
            }
            Afisha.app.getApplication().fireEvent('showItem', 'placeview',rec, true);
        });        
    },
    // программно переключаемся на какой хотим
    showEventsDialog: function(name) {
         var catStore = Ext.getStore(this.defaultStore);
         var catSubStore = Ext.getStore('LifeSubCategories');
         var res = catStore.find('id', name);
         var subres = catSubStore.find('id', name);
         if (subres >= 0){
            var record = catSubStore.getAt(subres);
            this.getApplication().fireEvent('showItem', 'events',{
                name: record.get('name'),
                eventsName: record.get('left') ? record.get('left').name : '',
                placesName: record.get('right').name,
                onlyPlaces: record.get('hiddenToolbar'),
                filter: record.get('filter'),
                id: name
            });
         } else 
         if( res < 0 )
            alert('Нет такой категории');
         else {
            var record = catStore.getAt(res);
            this.getApplication().fireEvent('showItem', 'events',{
                name: record.get('name'),
                eventsName: record.get('left') ? record.get('left').name : '',
                placesName: record.get('right').name,
                onlyPlaces: record.get('hiddenToolbar'),
                filter: record.get('filter'),
                id: name
            });
        }
    },
    
    onCatListItemTap:function(me,idx,target,record){
        this.selectedItem = record;

        var subCategoriesStore = record.get('subcategories');
        if (subCategoriesStore){
            this.getTopToolbar().setTitle(record.get('name'));
            this.getCatList().setStore(subCategoriesStore);
            this.currentSubStore = subCategoriesStore;
            return;
        }
        var me = this;
        this.loadCategory(record.get('type'), function() { me.showEventsDialog(record.get('id')) });
    },
    reInitCategoryList:function(){
        this.getCatList().setStore(this.defaultStore)
        this.getTopToolbar().setTitle(this.defaultTitle);
        this.currentSubStore = null;
    },
    goBack:function(){
        if (this.currentSubStore){
            this.reInitCategoryList();
            return true;
        }
        return false;
    },
    
    loadJsonP: function(type, callback) {
        // todo: перевести на json можно оптимизировать не делать encode	        
        Ext.data.JsonP.request({
//            url : 'http://query.yahooapis.com/v1/public/yql',
//            params: {format:'json', q: 'select * from json where url="' +
//                                      'www.tula.rodgor.ru/nafisha/export_json.php?type=' + type + '"'},
            url: Global.server_url,
            params:{
                type: type
            },
            callbackKey: 'callback',
            scope:this,
            callback: callback
        });
	},
			
    loadCategory:function(type, user_callback){
        var callback = function(success,response){
            if (success){
                //check that fields not undefined

                var data_str = Ext.encode(response.root);
                //var data_str = Ext.encode(response.query.results.json.root);
                if( recNo >= 0 ) {
                    var rec = cache.getById(type);
                    rec.set('data', data_str);
                    rec.set('timestamp', Ext.Date.now());
                }
                else
                    cache.insert(0, { id: type, data: data_str, timestamp: Ext.Date.now() });
                this.fillStores(data_str,type, user_callback)
            } else {
                Afisha.gf.alert('Не удалось загрузить данные. Проверьте интернет соединение.');
                console.log("Не удалось загрузить данные")                
            }
            Ext.Viewport.setMasked(false);
        }

        var cache = Ext.getStore('Cache');
        var recNo = cache.indexOfId(type);
        
        // Данные в кеше валидны 1 час
        if( recNo >= 0 && (Ext.Date.now() - cache.getAt(recNo).get('timestamp')) < (1000 * 60 * 60)) {
            console.log('loading ' + type + ' from cache');
            if( this.currentCategory == type )
                user_callback();
            else
                this.fillStores(cache.getAt(recNo).get('data'),type, user_callback);
        }
        else {
            Ext.Viewport.setMasked({xtype:'loadmask',message:'Загрузка данных...'});
            this.loadJsonP(type, callback);
        }
    },
    
    fillStores:function(data_str, type, user_callback){
	    var data = Ext.decode(data_str);
        
        var schStore = Ext.getStore('Schedule');
        var placesStore = Ext.getStore('Places');
        var eventsStore = Ext.getStore('Events');
        var dictStore = Ext.getStore('Dictionary');
        if(!schStore || !placesStore || !eventsStore){
            console.log('Ошибка загрузки store!');
            return false;
        }
        schStore.clearData();
        placesStore.clearData();
        eventsStore.clearData();
        
        for (var i in data){
                  switch (i){
                    case 'schedule':{
                        // раньше у разных type были разные поля в schedule, исправляем это, чтобы не лепить еще больше костылей
                        schStore.setData(Afisha.gf.unifySchedule(data[i]));
                        schStore.setCurrentType(type);
                        break;
                    }
                    case 'films':
                    case 'events':{
                        eventsStore.setData(data[i]);
                        eventsStore.setCurrentType(type);   
                        break;
                    }
                    case 'places':{
                        placesStore.setData(data[i]);
                        placesStore.setCurrentType(type);   
                        break;
                    }
                    default:{
                        var idx = dictStore.find('id',i);
                        data[i][0] = 'Не выбрано';
                        if ( idx == -1){
                            dictStore.add({id:i, data:data[i]})
                        }
                        break;
                    }
                }
            }
        console.log('loaded schedule ' + schStore.getCount());
        console.log('loaded places ' + placesStore.getCount());
        console.log('loaded events ' + eventsStore.getCount());
        console.log('loaded dictionaries ' + dictStore.getCount());
        //debugger;
        
        this.currentCategory = type;
        user_callback();
        return true;
    }
}
);
