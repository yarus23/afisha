Ext.define('Afisha.store.News.NewsList', {
    extend: 'Ext.data.Store',
    config: {
        noLeftMsg:'Предыдущие новости отсутствуют. Для просмотра списка новостей нажмите кнопку "Назад"',
        noRightMsg:'Загрузите следующую страницу новостей',
        model: 'Afisha.model.News.NewsList',
        autoLoad: false,
        clearOnPageLoad:false,
        pageSize:20,
        proxy: {
            type: 'scripttag',
            url : 'http://afisha.mikhelev.ru/app/ulanude/data/news',//'http://www.tula.rodgor.ru/incl/export_json.php',//
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
