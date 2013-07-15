Ext.define('Afisha.store.News.PageView', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.News.PageView',
        //autoLoad: true,
        proxy: {
            type: 'scripttag',
            url : 'http://mobile.afisha-uu.ru/app/ulanude/data/news/getone/',//http://www.tula.rodgor.ru/incl/export_json.php',
            //callbackKey: 'callback',
            reader: {
                type: 'json',
                //rootProperty: 'root'
            }
        }
    },
});
