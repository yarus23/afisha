Ext.ns('Ext.ux');
Ext.ux.backBtn = Ext.extend(Ext.Button, {
    text: 'Назад',
    ui: 'back',
    cls: 'backBtn',
    handler: function(btn){
        Ext.dispatch({      
           controller: 'main',
           action: 'historyBack'
        });
    },
    initComponent: function() {
        Ext.ux.backBtn.superclass.initComponent.apply(this, arguments);
    }
})
Ext.reg('backbtn', Ext.ux.backBtn);