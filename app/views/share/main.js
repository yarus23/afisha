Afisha.views.ShareMain = Ext.extend(Ext.Panel, {
    id: 'ShareMain',
    cls: 'shareMainPanel',
    scroll: 'vertical',
    fullscreen: true,
    items: [
        {
            xtype: 'detailsButtonsListForShareMain', 
            id: 'dblShareMain',
	    cls: 'main-list',
            fullscreen:true,
            items: [
                {
                    data: { title: 'Поделиться с друзьями' }, 
                    toView: 'ShareFriends'
                },
                {
                    data: { title: 'Оценить афишу' }, 
                    toView: 'ShareRegard'
                },
                {
                    data: { title: 'О разработчике' }, 
                    toView: 'ShareAbout'
                },
                {
                    data: { title: 'Лицензионное соглашение' }, 
                    toView: 'ShareLicense'
                },
                {
                    data: { title: 'Настройки' }, 
                    toView: 'optionsView'
                }/*,
                {
                    data: { title: 'Вход' }, 
                    toView: 'ShareAuth'
                }*/
            ]
        }        
    ],
    bindData: function(params, callBack, scope) {
        callBack.call(scope, this.id, params.direction ? params.direction: 'left');
    },
    dockedItems: [{
        xtype: 'toolbar',
        ui: g_ui,
        title: Afisha.showButtons? '' : 'Информация',
        items: [
            !Afisha.showButtons ? { xtype:'spacer' } : { xtype: 'backbtn', text: 'На главную' },
            { xtype: 'spacer' }
        ],
        height:'2.2em'
    }],
    initComponent: function() {
        Afisha.views.ShareMain.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('ShareMain', Afisha.views.ShareMain);
