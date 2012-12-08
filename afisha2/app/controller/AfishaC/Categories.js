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
            scope: this});
            
    },
    
    switchToEvents: function() {
        this.getViewport().animateActiveItem(1, {type: 'slide', direction: 'left'})
        this.getApplication().fireEvent('setCatName', this.selectedItem.get('name'));
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
        this.loadCategory(record.get('type'));
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
        Ext.data.JsonP.request({
            url : 'http://query.yahooapis.com/v1/public/yql',
            params: {format:'json', q: 'select * from json where url="' +
                                      'http://www.tula.rodgor.ru/nafisha/export_json.php?type=' + type + '"'},
            callbackKey: 'callback',
            scope:this,
            callback: callback
        });
	},
			
    loadCategory:function(type){
        var callback = function(success,response){
            if (success){
                //check that fields not undefined
                var data_str = Ext.encode(response.query.results.json.root);
                if( recNo >= 0 ) {
                    var rec = cache.getById(type);
                    rec.set('data', data_str);
                    rec.set('timestamp', Ext.Date.now());
                }
                else
                    cache.insert(0, { id: type, data: data_str, timestamp: Ext.Date.now() });
                this.fillStores(data_str,type)
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
                this.getApplication().fireEvent('switchToEvents');
            else
                this.fillStores(cache.getAt(recNo).get('data'),type);
        }
        else {
            Ext.Viewport.setMasked({xtype:'loadmask',message:'Загрузка данных...'});
            this.loadJsonP(type, callback);
        }
    },
    
    fillStores:function(data_str, type){
	    var data = Ext.decode(data_str);
        
        var schStore = Ext.getStore('Schedule');
        var placesStore = Ext.getStore('Places');
        var eventsStore = Ext.getStore('Events');
        if(!schStore || !placesStore || !eventsStore){
			console.log('Ошибка загрузки store!');
            return false;
        }
        
        // из ниоткуда новые типы данных не появятся, так что можно свитчем запилить все случаи, то-же самое с китченами и пр.
        //конечно то еще решение, но думаю больше времени потратим на адаптирование оригинального синемарута
        //от костыля в виде конфига каждого сторе как это есть сейчас для в сторефактори мы не уйдем
        //но тут нам придется не дергать строгоименованные store для каждой сущности
        //а работать с одними и теми-же источниками данных, просто какие-то используя в конкретной ситуации
        //а какие-то нет
        
        for (var i = 0; i < data.length; i++){
            for (var name in data[i]){
                if (!name)
                    continue;
                switch (name){
                    case 'schedule':{
                        schStore.setData(data[i][name]);
                        schStore.setCurrentType(type);
                        break;
                    }
                    case 'films':
                    case 'events':{
                        eventsStore.setData(data[i][name]);
                        eventsStore.setCurrentType(type);   
                    }
                    case 'places':{
                        placesStore.setData(data[i][name]);
                        placesStore.setCurrentType(type);   
                    }
                }
            }
        }
        console.log('loaded schedule ' + schStore.getCount());
        console.log('loaded places ' + placesStore.getCount());
        console.log('loaded events ' + eventsStore.getCount());
        //debugger;
        
        this.currentCategory = type;
        this.getApplication().fireEvent('switchToEvents');
        return true;
    }
});
