Ext.define('Afisha.store.Discount.DiscRubric', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.News.NewsRubric',
        autoLoad: false,
        proxy: {
            type: 'scripttag',
            url : 'http://mobile.afisha-uu.ru/app/ulanude/structure/discountrubrics/',//'http://www.tula.rodgor.ru/incl/export_json.php',//
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        }
    },
});
