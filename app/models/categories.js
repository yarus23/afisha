
// из cinemaroot
Afisha.models.rootModel = Ext.regModel('Root', {
    fields: [
        {name: 'schedule', type: 'auto'},
        {name: 'films', type: 'auto'},
        {name: 'places', type: 'auto'},
        {name: 'kitchen', type: 'auto'},       
        {name: 'bathtype', type: 'auto'},
        {name: 'bathserv', type: 'auto'},
        {name: 'services', type: 'auto'},
        {name: 'genre', type: 'auto'},
        {name: 'district', type: 'auto'},
        {name: 'events', type: 'auto'},
        {name: 'sporttype', type: 'auto'}
    ]
});
storeFactory('cinema', [
    { // сначала грузим shedule, иначе не сможем отсортировать по группам
      model:'Schedule',
      name_id:'schedule'
    },
    {
      model:'Films',
      ep:'cinemaPlacesStore',
      schedule:'cinemaScheduleStore',
      key_field:'film_id',
      val_field:'place_id',
      name_id:'films',
      ob_type:'event',
      comments:'af_film',
      grouped:true,
      getGroupString: function(record) {
        return isComingSoon(record.data.id, record.data.name) ? 'СКОРО' : 'В ПРОКАТЕ';
      },
      sorters:[groupSort, quotesSort],
      defFilter:'Сортировка',
      filterOptions:Afisha.FilmsListOptions
    },
    {
      model:'Places',
      ep:'cinemaFilmsStore',
      schedule:'cinemaScheduleStore',
      key_field:'place_id',
      val_field:'film_id',
      name_id:'places',
      ob_type:'place',
      comments:'af_kino',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    }
]);


storeFactory('restaurant', [
    {
      model:'Kitchen',
      name_id:'kitchen',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.Kitchen({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Genre',
      name_id:'genre',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.Genre({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Places',
      comments:'af_restaurant',
      name_id:'places',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'filterBtn'
    }
  ]);

storeFactory('club', [
    {
      model:'Films',
      ep:'clubPlacesStore',
      schedule:'clubScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      comments:'af_club_event',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      sorters:[{property: 'start_date', direction: 'ASC'},paySort, quotesSort],
      defFilter:'filterAllDays',
      filterOptions:Afisha.EventsListOptions
    },
    {
      model:'Places',
      ep:'clubFilmsStore',
      schedule:'clubScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'af_club',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    },
    {
      model:'Schedule',
      name_id:'schedule',
      ckeckByDate:Afisha.ckeckByDate
    }
  ]);


/* Театры */


storeFactory('theatre', [
    {
      model:'Films',
      ep:'theatrePlacesStore',
      schedule:'theatreScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      comments:'af_theatre_event',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      sorters:[{property: 'start_date', direction: 'ASC'}, paySort, quotesSort],
      defFilter:'filterAllDays',
      filterOptions:Afisha.EventsListOptions
    },
    {
      model:'Places',
      ep:'theatreFilmsStore',
      schedule:'theatreScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'af_theatre',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    },
    {
      model:'Schedule',
      name_id:'schedule',
      ckeckByDate:Afisha.ckeckByDate
    }
  ]);


/* выставки */

   storeFactory('expo', [
    {
      model:'Films',
      ep:'expoPlacesStore',
      schedule:'expoScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      comments:'af_expo_event',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      sorters:[{property: 'start_date', direction: 'ASC'}, paySort, quotesSort],
      defFilter:'filterAllDays',
      filterOptions:Afisha.EventsListOptions
    },
    {
      model:'Places',
      ep:'expoFilmsStore',
      schedule:'expoScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'af_expo',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    },
    {
      model:'Schedule',
      name_id:'schedule',
      ckeckByDate:Afisha.ckeckByDate
    }
  ]);
  
  /* концерты */

   storeFactory('concert', [
    {
      model:'Films',
      ep:'concertPlacesStore',
      schedule:'concertScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      comments:'af_concert_event',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      sorters:[{property: 'start_date', direction: 'ASC'}, paySort, quotesSort],
      defFilter:'filterAllDays',
      filterOptions:Afisha.EventsListOptions
    },
    {
      model:'Places',
      ep:'concertFilmsStore',
      schedule:'concertScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'af_concert',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    },
    {
      model:'Schedule',
      name_id:'schedule',
      ckeckByDate:Afisha.ckeckByDate
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
	  }
	}
  ]);
  
  /* бани */
  
  storeFactory('bath', [
    {
      model:'Places',
      comments:'af_bath',
      name_id:'places',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'filterBtn'
    },
    {
      model:'Bathserv',
      name_id:'bathserv',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.Bathserv({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Bathtype',
      name_id:'bathtype',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.Bathtype({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    }
  ]);
  
    /* Салоны красоты */
  
  storeFactory('beauty', [
    {
      model:'Films',
      ep:'beautyPlacesStore',
      schedule:'beautyScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      isLifeServices:true,
      sorters:[paySort, quotesSort],
      defFilter:'noFilter'
    },
    {
      model:'Schedule',
      name_id:'schedule'
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Places',
      ep:'beautyFilmsStore',
      schedule:'beautyScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'life_org',
      isLifeServices:true,
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    }
  ]);
  
    /* Фитнес центры */
  
  storeFactory('fitnes', [
    {
      model:'Schedule',
      name_id:'schedule'
    },
    {
      model:'Films',
      ep:'fitnesPlacesStore',
      schedule:'fitnesScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      isLifeServices:true,
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      sorters:[paySort, quotesSort],
      defFilter:'noFilter'
    },
    {
      model:'Sporttype',
      name_id:'sporttype',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Places',
      ep:'fitnesFilmsStore',
      schedule:'fitnesScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'life_org',
      isLifeServices:true,
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'filterBtn',
      filterOptions:Afisha.PlacesListOptions
    }
  ]);
      /* Стоматологические клиники */
  
  storeFactory('stomotolog', [
    {
      model:'Schedule',
      name_id:'schedule'
    },
    {
      model:'Films',
      ep:'stomotologPlacesStore',
      schedule:'stomotologScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      isLifeServices:true,
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      sorters:[paySort, quotesSort],
      defFilter:'noFilter'
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Places',
      ep:'stomotologFilmsStore',
      schedule:'stomotologScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'life_org',
      isLifeServices:true,
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    }
  ]);
    /* Медицинские центры */
  
  storeFactory('medic', [
    {
      model:'Schedule',
      name_id:'schedule'
    },
    {
      model:'Films',
      ep:'medicPlacesStore',
      schedule:'medicScheduleStore',
      key_field:'clubevent_id',
      val_field:'club_id',
      name_id:'events',
      ob_type:'event',
      isLifeServices:true,
      groupField:'sort',
      getGroupString : Afisha.eventsGroupString,
      sorters:[paySort, quotesSort],
      defFilter:'noFilter'
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Places',
      ep:'medicFilmsStore',
      schedule:'medicScheduleStore',
      key_field:'club_id',
      val_field:'clubevent_id',
      name_id:'places',
      ob_type:'place',
      comments:'life_org',
      isLifeServices:true,
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    }
  ]);
  
/* Бильярд и Боулинг */
storeFactory('pool', [
    {
      model:'Kitchen',
      name_id:'kitchen',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.Kitchen({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Genre',
      name_id:'genre',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.Genre({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Places',
      comments:'af_restaurant',
      name_id:'places',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'filterBtn'
    }
  ]);
  
    /* Лыжи */
  
  storeFactory('file_lz', [
    {
      model:'Places',
      //comments:'af_bath',
      name_id:'places',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, quotesSort],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    }
  ]);
  
      /* Коньки */
  
  storeFactory('file_kt', [
    {
      model:'Places',
      //comments:'af_bath',
      name_id:'places',
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, quotesSort],
      defFilter:'Сортировка',
      filterOptions:Afisha.PlacesListOptions
    }
  ]);
storeFactory('taxi', [
    {
      model:'Places',
      comments:'af_taxi',
      name_id:'places',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'Сортировка'
    }
  ]);
storeFactory('shop', [
      {
      model:'District',
      name_id:'district',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.District({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Shoptype',
      name_id:'shoptype',
      listeners: {
          load: function() { this.insert(0, new Afisha.models.Genre({value:-1, text: 'Все'}))}
      }
    },
    {
      model:'Places',
      comments:'af_shop',
      name_id:'places',
      showGroups:true,
      groupField:'sort',
      getGroupString : Afisha.placesGroupString,
      sorters:[paySort, {property: 'vote', direction: 'DESC'}],
      defFilter:'filterBtn'
    }
  ]);

// all categories.js  
  
Afisha.models.Category = Ext.regModel('Category',
{
    fields: [
        {name: 'id', type:'string'},
        {name: 'name', type:'string'},
        {name: 'hiddenToolbar', type: 'auto' },
        {name: 'left', type: 'auto'},
        {name: 'right', type: 'auto'},
        {name: 'type', type: 'string'},
        {name: 'subcategories', type:'auto'} // store
    ]
});

Afisha.models.testModel = Ext.regModel('TestModel', {
    fields: [{name:'name'}]
})
Afisha.stores.testStore = new Ext.data.Store({
    model: 'TestModel',
    autoLoad: 'true',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'root'
        }
    },
    data: {root: [{name: 'Test1'},{name: 'Test2'}]}
});

Afisha.stores.ActiveRestCategories = new Ext.data.Store({
   model: 'Category',
   autoLoad: true,
   proxy: {
       type: 'memory',
        reader: {
            type: 'json',
            root: 'root'
        }       
   },
   data: {
       root: [
        /*{ id: 'snow', name: 'Сноуборд/лыжи/тюбинг', type: 'snow', hiddenToolbar:true,
            right: {store: Afisha.stores.snowPlacesStore, id: 'snow' }
        },
        { id: 'file_kt', name: 'Катки', type: 'file_kt', hiddenToolbar:true,
            right: {store: Afisha.stores.file_ktPlacesStore, id: 'file_kt' }
        },
        { id: 'file_lz', name: 'Лыжи, сноуборд, тюбинг', type: 'file_lz', hiddenToolbar:true,
            right: {store: Afisha.stores.file_lzPlacesStore, id: 'file_lz' }
        },
        { id: 'pool', name: 'Бассейны', type: 'pool', hiddenToolbar:true,
            right: {store: Afisha.stores.poolPlacesStore, id: 'pool' }
        },
        { id: 'bowling', name: 'Боулинг', type: 'bowling', hiddenToolbar:true,
            right: {store: Afisha.stores.bowlingPlacesStore, id: 'bowling' }
        },
        { id: 'carting', name: 'Картинг', type: 'carting', hiddenToolbar:true,
            right: {store: Afisha.stores.cartingPlacesStore, id: 'carting' }
        },
        { id: 'paintball', name: 'Пейнтбол', type: 'paintball', hiddenToolbar:true,
            right: {store: Afisha.stores.paintballPlacesStore, id: 'paintball' }
        },
        { id: 'other', name: 'Прочее', type: 'other', hiddenToolbar:true,
            right: {store: Afisha.stores.otherPlacesStore, id: 'other' }
        }  */
       ]
   }
});

Afisha.stores.LifeCategories = new Ext.data.Store({
   model: 'Category',
   autoLoad: true,
   proxy: {
       type: 'memory',
        reader: {
            type: 'json',
            root: 'root'
        }       
   },
   data: {
       root: [
        { id: 'beauty', name: 'Салоны красоты', type: 'beauty',
            left: { name: 'Услуги', store: Afisha.stores.beautyFilmsStore, id: 'beautyevent' },
            right: {name: 'Салоны красоты', store: Afisha.stores.beautyPlacesStore, id: 'beauty' }
        },
        { id: 'fitnes', name: 'Спорт', type: 'fitnes', 
            left: { name: 'Услуги', store: Afisha.stores.fitnesFilmsStore, id: 'fitnesevent' },
            right: {name: 'Спорт', store: Afisha.stores.fitnesPlacesStore, id: 'fitnes' }
        },
        { id: 'medic', name: 'Медцентры', type: 'medic',
            left: { name: 'Услуги', store: Afisha.stores.medicFilmsStore, id: 'medicevent' },
            right: {name: 'Медцентры', store: Afisha.stores.medicPlacesStore, id: 'medic' }
        },
        { id: 'stomotolog', name: 'Стоматология', type: 'stomotolog',
            left: { name: 'Услуги', store: Afisha.stores.stomotologFilmsStore, id: 'stomotologevent' },
            right: {name: 'Стоматология', store: Afisha.stores.stomotologPlacesStore, id: 'stomotolog' }
        } 
       ]
   }
});

Afisha.stores.CategoriesStore = new Ext.data.Store({
    model: 'Category',
    autoLoad: true,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'root'
        }
    },
    data: { root: [ 
        { id: 'cinema', name: 'Кино', type: 'cinema',
            left: { name: 'Фильмы', store: Afisha.stores.cinemaFilmsStore, id: 'film' },
            right: {name: 'Кинотеатры', store: Afisha.stores.cinemaPlacesStore, id: 'kino' }
        },
        { id: 'cafe', name: 'Рестораны', type: 'restaurant', hiddenToolbar:true,
            right: {store: Afisha.stores.restaurantPlacesStore, id: 'restaurant' }
        },
        { id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true,
            right: {store: Afisha.stores.poolPlacesStore, id: 'pool' }
        },      
        { id: 'concert', name: 'Шоу, Концерты', type: 'concert',
            left: { name: 'Шоу, Концерты', store: Afisha.stores.concertFilmsStore, id: 'concertevent' },
            right: {name: 'Залы', store: Afisha.stores.concertPlacesStore, id: 'concert' }
        },
        /*{ id: 'activerest', name: 'Активный отдых', type: 'activerest', hiddenToolbar:true,
            subcategories: Afisha.stores.ActiveRestCategories,
            //left: {  },
            right: {  }
        },*/
        // todo: проверить right.id для соцсетей
        { id: 'bath', name: 'Бани, Сауны', type: 'bath', hiddenToolbar:true,
            right: {name: 'Бани, Сауны', store: Afisha.stores.bathPlacesStore, id: 'bath' }
        },
        /*{ id: 'pool', name: 'Бильярд, Боулинг', type: 'pool', hiddenToolbar:true,
            right: {store: Afisha.stores.poolPlacesStore, id: 'pool' }
        },*/
        { id: 'health', name: 'Красота и здоровье', type: 'health', hiddenToolbar:true,
            subcategories: Afisha.stores.LifeCategories,
            right: {}
        },
        { id: 'club', name: 'Клубы', type: 'club',
            left: { name: 'События', store: Afisha.stores.clubFilmsStore, id: 'clubevent' },
            right: {name: 'Клубы', store: Afisha.stores.clubPlacesStore, id: 'club' }
        },
        { id: 'expo', name: 'Выставки', type: 'expo',
            left: { name: 'События', store: Afisha.stores.expoFilmsStore, id: 'expoevent' },
            right: {name: 'Места', store: Afisha.stores.expoPlacesStore, id: 'expo' }
        },
        { id: 'theatre', name: 'Театры', type:'theatre',
            left: { name: 'Постановки', store: Afisha.stores.theatreFilmsStore, id: 'theatreevent' },
            right: {name: 'Театры', store: Afisha.stores.theatrePlacesStore, id: 'theatre' }
        },
        { id: 'taxi', name: 'Такси', type: 'taxi', hiddenToolbar:true,
            right: {store: Afisha.stores.taxiPlacesStore, id: 'taxi' }
        },
        { id: 'shop', name: 'Шопинг', type: 'shop', hiddenToolbar:true,
            right: {store: Afisha.stores.shopPlacesStore, id: 'shop' }
        },
    ]}
});

Afisha.filters = {
bath:[{
                       label:'Тип',
                       id:'bathtype',
                       store:'bathBathtypeStore'                                              
               },{
                       label:'Сервис',
                       id:'bathserv',
                       store:'bathBathservStore'         
               },{
                       label:'Район',
                       id:'district',
                       store:'bathDistrictStore'                            
               }],
               cafe:[{
                       label:'Кухня',
                       id:'kitchen',
                       store:'restaurantKitchenStore'                                              
               },{
                       label:'Жанр',
                       id:'genre',
                       store:'restaurantGenreStore'         
               },{
                       label:'Район',
                       id:'district',
                       store:'restaurantDistrictStore'                            
               }],
               pool:[{
                       label:'Район',
                       id:'district',
                       store:'poolDistrictStore'                            
               }],
               shop:[{
                       label:'Тип магазина',
                       id:'shoptype',
                       store:'shopShoptypeStore'         
               },{
                       label:'Район',
                       id:'district',
                       store:'shopDistrictStore'                            
               }],
               fitnes:[{
                       label:'Вид спорта',
                       id:'sporttype',
                       store:'fitnesSporttypeStore'         
               },{
                       label:'Район',
                       id:'district',
                       store:'fitnesDistrictStore'                            
               }]
};