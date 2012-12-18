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
            { id: 'beauty', name: 'Салоны красоты', type: 'beauty',options:{schType:'service'},
                left: { name: 'Услуги',  id: 'beautyevent' },
                right: {name: 'Салоны красоты', id: 'beauty' }
            },
            { id: 'fitnes', name: 'Спорт', type: 'fitnes', options:{schType:'service'},
                left: { name: 'Услуги', id: 'fitnesevent' },
                right: {name: 'Спорт',  id: 'fitnes' }
            },
            { id: 'medic', name: 'Медцентры', type: 'medic',options:{schType:'service'},
                left: { name: 'Услуги', id: 'medicevent' },
                right: {name: 'Медцентры', id: 'medic' }
            },
            { id: 'stomotolog', name: 'Стоматология', type: 'stomotolog',options:{schType:'service'},
                left: { name: 'Услуги', id: 'stomotologevent' },
                right: {name: 'Стоматология', id: 'stomotolog' }
            } 
        ]
        
    },
});
