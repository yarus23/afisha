Ext.define('Afisha.view.CommentsView', {
    extend: 'Ext.Panel',
    xtype:'commentsview',
    requires:['Afisha.view.components.TopToolbar'],
    config: {
        controllerName:'Comments',
        layout:'vbox',
        items:[{
                xtype:'toptoolbar',
                style:'background-color: white;',
                title:'Комментарии'
            },{
            xtype:'dataview',
            style:'background-color: white;',
            cls:'newslist',
            allowDeselect: false,
            useComponents: false,
            loadingText:' ',
            scrollable: {
                direction: 'vertical',
            },
            itemCls:'newslistitem x-docking-horizontal',
            emptyText: '<div style="text-align:center; padding-top:50%; color:gray; margin: 0 1.7em;">Пока здесь нет ни одного комментария.</div>',
            plugins: null,
            store: 'Comments',
            flex: 1,
            itemTpl: new Ext.XTemplate(
                '<div class="x-body x-inner x-data-item-inner x-layout-vbox" style="webkit-box-align:stretch;">',
                    '<div class="x-innerhtml  newsListTitle">{user.first_Name}</div>',
                    '<div class="x-innerhtml  newsListDescr">{text}</div>',
                '</div>'
            )
        },{
            xtype:'button',
            id:'addComment',
            text:'Добавить'
            
        },{
            xtype:'panel',
            id:'sendCommentModel',
            hidden:true,
            modal: true,
            centered: true,
            width:'90%',
            height:'90%',
            items:[{
                xtype:'button',
                text:'Отправить'
            },{
                xtype:'button',
                text:'Отмена'
            }]
        }]
    }
});