Ext.define('Afisha.store.News.NewsRubric', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.News.NewsRubric',
        autoLoad: false,
        proxy: {
            type: 'scripttag',
            url : 'http://mobile.afisha-uu.ru/app/ulanude/structure/newrubrics',//'http://www.tula.rodgor.ru/incl/export_json.php',//
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        }
    },
});
