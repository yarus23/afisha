Ext.define('Afisha.model.News.NewsView', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'int' },
            { name: 'rid', type: 'int' },
            { name: 'rub_id', type: 'int' },
            { name: 'rub_name', type: 'string' },
            { name: 'date', type: Ext.data.Types.CUSTOMDATE },
            { name: 'title', type: 'string' },
            { name: 'descr', type: 'string' },
            { name: 'body', type: 'string' },
            { name: 'url', type: 'string' },
            { name: 'con_rule', type: 'int' },
            { name: 'image', type: 'string' }
        ]
    }
});
