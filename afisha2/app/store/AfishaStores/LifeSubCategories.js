Ext.define('Afisha.store.AfishaStores.LifeSubCategories', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.AfishaModels.Categories',
        autoLoad: true,
        reader: {
            type: 'json',
            rootProperty: 'root'
        },
        data:[
            { id: 'beauty', name: 'Салоны красоты', type: 'beauty',
                left: { name: 'Услуги', store: null,/*Afisha.stores.beautyFilmsStore,*/ id: 'beautyevent' },
                right: {name: 'Салоны красоты', store: null,/*Afisha.stores.beautyPlacesStore,*/ id: 'beauty' }
            },
            { id: 'fitnes', name: 'Спорт', type: 'fitnes', 
                left: { name: 'Услуги', store: null,/*Afisha.stores.fitnesFilmsStore,*/ id: 'fitnesevent' },
                right: {name: 'Спорт', store: null,/*Afisha.stores.fitnesPlacesStore,*/ id: 'fitnes' }
            },
            { id: 'medic', name: 'Медцентры', type: 'medic',
                left: { name: 'Услуги', store: null,/*Afisha.stores.medicFilmsStore,*/ id: 'medicevent' },
                right: {name: 'Медцентры', store: null,/*Afisha.stores.medicPlacesStore,*/ id: 'medic' }
            },
            { id: 'stomotolog', name: 'Стоматология', type: 'stomotolog',
                left: { name: 'Услуги', store: null,/*Afisha.stores.stomotologFilmsStore,*/ id: 'stomotologevent' },
                right: {name: 'Стоматология', store: null,/*Afisha.stores.stomotologPlacesStore,*/ id: 'stomotolog' }
            } 
        ]
        
    },
});
