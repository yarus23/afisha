Ext.define('Afisha.store.Favorites', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.Favorites',
        autoLoad: true,
        //autoSync: true,
        /*proxy: {
            type: 'localstorage',
            id  : 'Favorites-proxy'
        }*/
    },
    isRecordInFav: function(type, rid){
        debugger;
    },
    setFav:function(opts){
        debugger;
    }
});
