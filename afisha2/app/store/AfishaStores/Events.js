Ext.define('Afisha.store.AfishaStores.Events', {
    extend: 'Ext.data.Store',
    config: {
        currentType:'',
        model: 'Afisha.model.AfishaModels.Events',
        autoLoad: false,
        reader: {
            type: 'jsonreader',
            rootProperty: 'root'
        }        
    }
});
