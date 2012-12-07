Ext.define('Afisha.store.AfishaStores.Schedule', {
    extend: 'Ext.data.Store',
    config: {
        currentType:'',
        model: 'Afisha.model.AfishaModels.Schedule',
        autoLoad: false,
        reader: {
            type: 'json',
            rootProperty: 'root'
        }        
    }
});
