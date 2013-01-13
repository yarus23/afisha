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
            { id: 'cinema', name: 'Кино', type: 'cinema', options:{schSelectDefType:0, schType:'date'},
                left: { name: 'Фильмы',id: 'film' },
                right: {name: 'Кинотеатры', id: 'kino' }
            },
            { id: 'restaurant', name: 'Рестораны', type: 'restaurant', hiddenToolbar:true, 
                filter: { items: [ { id: 'kitchen', name:'Кухня'},
                                   { id: 'genre', name: 'Тип'},
                                   { id: 'district', name: 'Район'}]},
                options:{schType:'none'},
                right: {id: 'restaurant' }
            },
            { id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true, options:{schType:'none'},
                right: {id: 'pool' }
            },      
            { id: 'concert', name: 'Шоу, Концерты', type: 'concert',
                left: { name: 'Шоу, Концерты', id: 'concertevent' },
                right: {name: 'Залы',id: 'concert' }
            },
            /*{ id: 'activerest', name: 'Активный отдых', type: 'activerest', hiddenToolbar:true,
                subcategories: null,/* Afisha.stores.ActiveRestCategories,
                //left: {  },
                right: {  }
            },*/
            // todo: проверить right.id для соцсетей
            { id: 'bath', name: 'Бани, Сауны', type: 'bath', hiddenToolbar:true,options:{schType:'none'},
                right: {name: 'Бани, Сауны', id: 'bath' }
            },
            /*{ id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true,
                right: {store: null,/* Afisha.stores.poolPlacesStore, id: 'pool' }
            },*/
            { id: 'health', name: 'Красота и здоровье', type: 'health', hiddenToolbar:true,
                subcategories: 'LifeSubCategories'
            },
            { id: 'club', name: 'Клубы', type: 'club',options:{schSelectDefType:null, schType:'date'},
                left: { name: 'События',  id: 'clubevent' },
                right: {name: 'Клубы', id: 'club' }
            },
            { id: 'expo', name: 'Выставки', type: 'expo',options:{schSelectDefType:null, schType:'date'},
                left: { name: 'События',  id: 'expoevent' },
                right: {name: 'Места',  id: 'expo' }
            },
            { id: 'theatre', name: 'Театры', type:'theatre',options:{schSelectDefType:'week', schType:'date'},
                left: { name: 'Постановки',  id: 'theatreevent' },
                right: {name: 'Театры',  id: 'theatre' }
            },
            { id: 'taxi', name: 'Такси', type: 'taxi', hiddenToolbar:true,options:{schType:'none'},
                right: {store: null, id: 'taxi' }
            },
            { id: 'shop', name: 'Шопинг', type: 'shop', hiddenToolbar:true,options:{schType:'none'},
                right: {store: null, id: 'shop' }
            }
        ]
        
    },
});
