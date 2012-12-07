Ext.define('Afisha.store.AfishaStores.Cache', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.AfishaModels.CachedData',
        autoLoad: false,
        proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		}
    }
});
