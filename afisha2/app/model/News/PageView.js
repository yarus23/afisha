Ext.define('Afisha.model.News.PageView', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'int' },
            //{ name: 'rid', type: 'int' },
            { name: 'news_rubric_id', type: 'int' },
            //{ name: 'rub_name', type: 'string' },
            { name: 'datetime', type: Ext.data.Types.CUSTOMDATE },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'body', type: 'string' },
            { name: 'url', type: 'string' },
            //{ name: 'con_rule', type: 'int' },
            { name: 'image', type: 'string' },
            { name: 'images', type: 'auto' }
        ]
    }
});
