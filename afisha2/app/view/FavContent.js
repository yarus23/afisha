Ext.define('Afisha.view.FavContent', {
    extend: 'Ext.Panel',
    xtype:'favcontent',
    requires:['Afisha.view.components.TopToolbar'],
    config: {
        controllerName:'FavContent',
        layout:'vbox',
        items:[{
                xtype:'toptoolbar',
                title:'Избранное'
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
            emptyText: '<div style="text-align:center; padding-top:50%; color:gray; margin: 0 1.7em;">Добавляйте в этот раздел статьи, к чтению которых вы бы хотели вернуться позже. Для этого достаточно просто нажать на звездочку.</div>',
            plugins: null,
            store: 'Favorites',
            flex: 1,
            itemTpl: new Ext.XTemplate(
                '<div class="x-body x-inner x-data-item-inner x-layout-vbox" style="webkit-box-align:stretch;">',
                    '<div class="x-innerhtml  newsListTitle">{title}</div>',
                    '<div class="x-innerhtml  newsListDescr">{descr}</div>',
                    '<div class="ListItemInfo">{date:date("j.n.Y H:i")} {rub_name}</div>',
                '</div>'
            )
        }]
    }
});