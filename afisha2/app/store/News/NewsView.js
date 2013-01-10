Ext.define('Afisha.store.News.NewsView', {
    extend: 'Ext.data.Store',
    config: {
        model: 'News.model.NewsView',
        //autoLoad: true,
        proxy: {
            type: 'scripttag',
            url : 'http://www.tula.rodgor.ru/incl/export_json.php',
            //callbackKey: 'callback',
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        }
    },
});
