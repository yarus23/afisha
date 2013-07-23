Ext.define('Afisha.store.AfishaStores.PlaceComments', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.AfishaModels.PlaceComments',
        autoLoad: false,
        proxy: {
            type: 'scripttag',
            url : 'http://mobile.afisha-uu.ru/app/ulanude/placecomments',//'http://www.tula.rodgor.ru/incl/export_json.php',//
            extraParams:{
                
            },
            reader: {
                type: 'json',
//                rootProperty: 'comments'
            }
        }
    }
});
