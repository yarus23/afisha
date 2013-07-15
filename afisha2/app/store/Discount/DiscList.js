Ext.define('Afisha.store.Discount.DiscList', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.Discount.DiscList',
        autoLoad: false,
        clearOnPageLoad:false,
        pageSize:20,
        proxy: {
            type: 'scripttag',
            url : 'http://mobile.afisha-uu.ru/app/ulanude/data/discounts/',//'http://www.tula.rodgor.ru/incl/export_json.php',//
            startParam:'offset',
            extraParams:{
                type:'news',
                rub_id:0,
                offset:0,
                limit:20,
            },
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        }
    },
});
