var quotesSort = new Ext.util.Sorter({
    direction:'ASC',
    sorterFn: function( o1, o2){
        function getPureString(s){
            if( s.length && (s[0] === '\"' || s[0] === '\'' || s.charCodeAt(0) === 171)) {
               return s.replace(/['"\u00BB\u00AB]/g,'').toLowerCase();
            } else return s.toLowerCase();
        };
        if (!o1.data || !o2.data)
            return 0;
        s1 = getPureString(o1.data.name);
        s2 = getPureString(o2.data.name);
        
        if( s1 === s2 ) return 0;
        
        return s1 < s2 ? -1 : 1;
    }
});

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
            viewport:{
                orientationchange: 'onOrientationchange'
            },
            catList:{
                itemtap:'onCatListItemTap'
            }
        }
    },
    onOrientationchange: function() {
        Afisha.initListWidth();
    },
    
    launch: function(){
        this.getApplication().on({
            switchToEvents: this.switchToEvents,
            switchTo: this.switchTo,
            switchToPlaceView:this.switchToPlaceView,
            scope: this});
            
        var catStore = Ext.getStore(this.defaultStore);
        var store = this.showStore = new Ext.data.Store();
        catStore.each(function(record){
            if( !record.get('mainWindow'))
                store.add(record.copy());
        });
        this.getCatList().setStore(this.showStore)
    },
    // методы с возможностью загружать данные торчат наружу
    switchTo: function(id) {
	if (!Afisha.gf.isOnline(true)){
		return false;
	}
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
        if( record.get('type') == 'settings' )
            this.getApplication().fireEvent('showItem', 'mainsettings');
        else
            this.loadCategory(record.get('type'), function() { me.showEventsDialog(record.get('type')) });
    },
    reInitCategoryList:function(){
        this.getCatList().setStore(this.showStore)
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
		var hash;
		
        var callback = function(success,response){
            if (success){
                //check that fields not undefined
                var data_str = Ext.encode(response.root);
                //debugger;
                //var data_str = Ext.encode(response.query.results.json.root);
                if( rec ) {
                    rec.set('data', data_str);
                    rec.set('timestamp', Ext.Date.now());
                    rec.set('hash', hash);
                }
                else
                    cache.add( { name: type, data: data_str, timestamp: Ext.Date.now() });
                cache.sync();
                this.fillStores(data_str,type, user_callback)
            } else {
				if( rec ) { // не загрузили но что-то есть в кеше
					Afisha.gf.alert('Проверьте интернет соединение. Данные могут быть неактуальными.');
					this.fillStores(rec.get('data'),type, user_callback);
				} else {
					Afisha.gf.alert('Не удалось загрузить данные. Проверьте интернет соединение.');
					console.log("Не удалось загрузить данные");
				}               
            }
            Ext.Viewport.setMasked(false);
        }

        var cache = Ext.getStore('Cache');
        if( !this.cacheLoaded ) {
			cache.load();
			this.cacheLoaded = true;
		}
        var rec = cache.findRecord('name', type);
        var me = this;
        
        function loadJsonData() {
			if( rec && (rec.get('hash') == hash)) {
				console.log('loading ' + type + ' from cache');
				me.fillStores(rec.get('data'),type, user_callback);
				rec.set('timestamp', Ext.Date.now());
			}
			else {
				Ext.Viewport.setMasked({xtype:'loadmask',message:'Загрузка данных...'});
				me.loadJsonP(type, callback);
			}
		}
        // Данные в памяти валидны 10 минут
        if( rec && ((Ext.Date.now() - rec.get('timestamp')) < (1000 * 60 * 10))) {
            console.log('loading ' + type + ' from memory');
            if( this.currentCategory == type )
                user_callback();
            else
                this.fillStores(rec.get('data'),type, user_callback);
        } else
		Ext.data.JsonP.request({
            url: Global.server_url,
            params:{
                type: type,
                mode: 'hash'
            },
            callbackKey: 'callback',
            scope:this,
            callback: function(success, response){ 
				if( success ) {
					hash = response.hash;
					loadJsonData();
				}
				else {
					Ext.Viewport.setMasked({xtype:'loadmask',message:'Загрузка данных...'});
					me.loadJsonP(type, callback);
				}				
			}
        })
        		
    },
    
    fillStores:function(data_str, type, user_callback){
		// todo: optimize for cache
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
                        placesStore.sort([{
                            property: 'sort',
                            direction: 'DESC'}, 
                            quotesSort]);
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
