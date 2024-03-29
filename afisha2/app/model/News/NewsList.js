Ext.define('Afisha.model.News.NewsList', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'int' },
            { name: 'rid', type: 'int' },
            //{ name: 'rub_id', type: 'int' },
            //{ name: 'rub_name', type: 'string' },
            { name: 'datetime', type: Ext.data.Types.CUSTOMDATE },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'image', type: 'string' },
            //{ name: 'type', type: 'string', defaultValue: 'news' }
        ]
    }
});
