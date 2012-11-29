Afisha.views.SharePanelWithBackButton = Ext.extend(Ext.Panel, {
    scroll: 'vertical',
    fullscreen: true,
    bindData: function(params, callBack, scope) {
        callBack.call(scope, this.id, params.direction ? params.direction: 'left');
    },
    dockedItems: [{
        xtype: 'toolbar',
        ui: g_ui,
        items: [
            !Afisha.showButtons ? { xtype:'spacer' } : { xtype: 'backbtn', text: 'Назад' },
            { xtype: 'spacer' }
        ],
        height:'2.2em'
    }]
});

Ext.reg('SharePanelWithBackButton', Afisha.views.SharePanelWithBackButton);
