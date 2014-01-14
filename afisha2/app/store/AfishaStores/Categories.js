Ext.define('Afisha.store.AfishaStores.Categories', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.AfishaModels.Categories',
        autoLoad: true,
        reader: {
            type: 'json',
            rootProperty: 'root'
        },
        data:[
            { id: 'expo', name: 'Выставки', type: 'expo',options:{schSelectDefType:null, schType:'date'},/////////////////////////
                left: { name: 'События',  id: 'expoevent' },
                right: {name: 'Места',  id: 'expo' }
            },
            { id: 'hotel', name: 'Отели', type: 'hotel', hiddenToolbar:true, ////////////////////////////
                filter: { items: [ { id: 'district', name: 'Район'}]},
                options:{schType:'none'},
                right: {id: 'hotel' }
            },
            { id: 'bath', name: 'Бани, Сауны', type: 'bath', hiddenToolbar:true,options:{schType:'none'},////////////////
                right: {name: 'Бани, Сауны', id: 'bath' }
            },
            { id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true, options:{schType:'none'},/////////////////
                right: {id: 'pool' }
            },      
            { id: 'health', name: 'Красота и здоровье', type: 'health', hiddenToolbar:true,
                subcategories: 'LifeSubCategories',
                mainWindow: true
            },
            { id: 'taxi', name: 'Активный отдых', type: 'active_rest', hiddenToolbar:true,options:{schType:'none'},
                right: {store: null, id: 'active_rest' }
            },
            { id: 'cinema', name: 'Кино', type: 'cinema', options:{schSelectDefType:0, schType:'date'},//////////////////////////////
                left: { name: 'Фильмы',id: 'film' },
                right: {name: 'Кинотеатры', id: 'kino' },
                mainWindow: true
            },
            { id: 'restaurant', name: 'Рестораны', type: 'restaurant', hiddenToolbar:true, ////////////////////////////
                filter: { items: [ { id: 'kitchen', name:'Кухня'},
                                   { id: 'genre', name: 'Тип'},
                                   { id: 'district', name: 'Район'}]},
                options:{schType:'none'},
                right: {id: 'restaurant' },
                mainWindow: true
            },
            { id: 'concert', name: 'Шоу, Концерты', type: 'concert',//////////////////////////////
                left: { name: 'Шоу, Концерты', id: 'concertevent' },
                right: {name: 'Залы',id: 'concert' }
            },
            /*{ id: 'activerest', name: 'Активный отдых', type: 'activerest', hiddenToolbar:true,
                subcategories: null,/* Afisha.stores.ActiveRestCategories,
                //left: {  },
                right: {  }
            },*/
            // todo: проверить right.id для соцсетей
            /*{ id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true,
                right: {store: null,/* Afisha.stores.poolPlacesStore, id: 'pool' }
            },*/
            { id: 'club', name: 'Клубы', type: 'club',options:{schSelectDefType:null, schType:'date'},//////////////////////////
                left: { name: 'События',  id: 'clubevent' },
                right: {name: 'Клубы', id: 'club' },
                mainWindow: true
            },
            { id: 'theatre', name: 'Театры', type:'theatre',options:{schSelectDefType:'week', schType:'date'},//////////////////
                left: { name: 'Постановки',  id: 'theatreevent' },
                right: {name: 'Театры',  id: 'theatre' },
                mainWindow: false
            },
            { id: 'shop', name: 'Доставка на дом', type: 'shop', hiddenToolbar:true,options:{schType:'none'},
                right: {store: null, id: 'shop' },
                mainWindow: true
            },
            { id: 'settings', name: 'Настройки', type: 'settings' }
        ]
        
    },
});
