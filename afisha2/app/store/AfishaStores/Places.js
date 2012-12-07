Ext.define('Afisha.store.AfishaStores.Places', {
    extend: 'Ext.data.Store',
    config: {
        currentType:'',
        model: 'Afisha.model.AfishaModels.Places',
        autoLoad: false,
        reader: {
            type: 'json',
            rootProperty: 'root'
        }        
    }
});
