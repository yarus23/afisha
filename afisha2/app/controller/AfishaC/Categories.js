Ext.define('Afisha.controller.AfishaC.Categories', {
    extend: 'Ext.app.Controller',
    
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
    loadCategory:function(type){
        //totod:search in cache
        Ext.data.JsonP.request({
            url : 'http://query.yahooapis.com/v1/public/yql',
            params: {format:'json', q: 'select * from json where url="' +
                                      'http://www.tula.rodgor.ru/nafisha/export_json.php?type=' + type + '"'},
            callbackKey: 'callback',
            scope:this,
            callback:function(success,response){
                if (!success){
                    //todo alert 
                    console.log("Не удалось загрузить данные")
                    return;
                }
                //check that fields not undefined
                this.fillStores(response.query.results.json.root,type)
            }
        });
    },
    fillStores:function(data,type){
        var schStore = Ext.getStore('Schedule');
        var placesStore = Ext.getStore('Places');
        var eventsStore = Ext.getStore('Events');
        if(!schStore || !placesStore || !eventsStore){
            return false;
        }
        schStore.setData(data[0].schedule);
        schStore.setCurrentType(type);
        placesStore.setData(data[2].places);
        placesStore.setCurrentType(type);
        eventsStore.setData(data[1].films ? data[1].films : data[1].events);
        eventsStore.setCurrentType(type);
        //debugger;
        return true;
    }
});
