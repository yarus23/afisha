Ext.define('Afisha.model.Favorites', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'int' },
            { name: 'rid', type: 'int' },
//            { name: 'rub_id', type: 'int' },
//            { name: 'rub_name', type: 'string' },
//            { name: 'date', type: 'date' },
            { name: 'title', type: 'string' },
            { name: 'descr', type: 'string' },
//            { name: 'image', type: 'string' },
            { name: 'type', type: 'string' }
        ],
        proxy: {
            type: 'localstorage',
            id  : 'fav-proxy'
        }
    }
});
