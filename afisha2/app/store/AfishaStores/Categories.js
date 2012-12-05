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
            { id: 'cinema', name: 'Кино', type: 'cinema',
                left: { name: 'Фильмы', store: null,/* Afisha.stores.cinemaFilmsStore,*/id: 'film' },
                right: {name: 'Кинотеатры', store: null,/* Afisha.stores.cinemaPlacesStore,*/ id: 'kino' }
            },
            { id: 'cafe', name: 'Рестораны', type: 'restaurant', hiddenToolbar:true,
                right: {store: null,/* Afisha.stores.restaurantPlacesStore, */id: 'restaurant' }
            },
            { id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true,
                right: {store: null,/* Afisha.stores.poolPlacesStore, */id: 'pool' }
            },      
            { id: 'concert', name: 'Шоу, Концерты', type: 'concert',
                left: { name: 'Шоу, Концерты', store: null,/* Afisha.stores.concertFilmsStore, */id: 'concertevent' },
                right: {name: 'Залы', store: null,/* Afisha.stores.concertPlacesStore,*/ id: 'concert' }
            },
            /*{ id: 'activerest', name: 'Активный отдых', type: 'activerest', hiddenToolbar:true,
                subcategories: null,/* Afisha.stores.ActiveRestCategories,
                //left: {  },
                right: {  }
            },*/
            // todo: проверить right.id для соцсетей
            { id: 'bath', name: 'Бани, Сауны', type: 'bath', hiddenToolbar:true,
                right: {name: 'Бани, Сауны', store: null,/* Afisha.stores.bathPlacesStore,*/ id: 'bath' }
            },
            /*{ id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true,
                right: {store: null,/* Afisha.stores.poolPlacesStore, id: 'pool' }
            },*/
            { id: 'health', name: 'Красота и здоровье', type: 'health', hiddenToolbar:true,
                subcategories: 'LifeSubCategories'
            },
            { id: 'club', name: 'Клубы', type: 'club',
                left: { name: 'События', store: null,/* Afisha.stores.clubFilmsStore,*/ id: 'clubevent' },
                right: {name: 'Клубы', store: null,/* Afisha.stores.clubPlacesStore,*/ id: 'club' }
            },
            { id: 'expo', name: 'Выставки', type: 'expo',
                left: { name: 'События', store: null,/* Afisha.stores.expoFilmsStore,*/ id: 'expoevent' },
                right: {name: 'Места', store: null,/* Afisha.stores.expoPlacesStore,*/ id: 'expo' }
            },
            { id: 'theatre', name: 'Театры', type:'theatre',
                left: { name: 'Постановки', store: null,/* Afisha.stores.theatreFilmsStore,*/ id: 'theatreevent' },
                right: {name: 'Театры', store: null,/* Afisha.stores.theatrePlacesStore,*/ id: 'theatre' }
            },
            { id: 'taxi', name: 'Такси', type: 'taxi', hiddenToolbar:true,
                right: {store: null,/* Afisha.stores.taxiPlacesStore,*/ id: 'taxi' }
            },
            { id: 'shop', name: 'Шопинг', type: 'shop', hiddenToolbar:true,
                right: {store: null,/* Afisha.stores.shopPlacesStore,*/ id: 'shop' }
            }
        ]
        
    },
});
