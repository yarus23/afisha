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
    onCatListItemTap:function(me,idx,target,record){
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
		  debugger;
          if (success){
			//check that fields not undefined
			var data_str = Ext.encode(response.query.results.json.root);
                    
			if( recNo >= 0 )
				cache.getById('type').set('data', data_str);
			else
				cache.insert(0, { id: type, data: data_str });
		      
			this.fillStores(data_str,type)
           } else {
            Ext.Msg.alert('Афиша', 'Не удалось загрузить данные. Проверьте интернет соединение.');
            console.log("Не удалось загрузить данные")                
           }
           Ext.Viewport.setMasked(false);
        }
                    
		var cache = Ext.getStore('Cache');
		var recNo = cache.indexOfId(type);
		if( recNo >= 0 ) {
		  console.log('loading ' + type + ' from cache');
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
        
        // сюда приходят для ресторанов
        // 0 - places
        // 1 - kitchen
        // куда все это девать? при условии что у заказчика набор может быть другой
        
        schStore.setData(data[0].schedule);
        schStore.setCurrentType(type);
        placesStore.setData(data[2].places);
        placesStore.setCurrentType(type);
        eventsStore.setData(data[1].films ? data[1].films : data[1].events);
        eventsStore.setCurrentType(type);
        
        console.log('loaded schedule ' + schStore.getCount());
        console.log('loaded places ' + placesStore.getCount());
        console.log('loaded events ' + eventsStore.getCount());
        //debugger;
        return true;
    }
});
