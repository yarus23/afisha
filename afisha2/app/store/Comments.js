Ext.define('Afisha.store.Comments', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.Comments',
        autoLoad: true,
        proxy: {
            type: 'scripttag',
            url : 'http://afisha-uu.13857.aqq.ru/app/ulanude/comments',//'http://www.tula.rodgor.ru/incl/export_json.php',//
            extraParams:{
            },
            reader: {
                type: 'json',
                rootProperty: 'comments'
            }
        }
    }
});
