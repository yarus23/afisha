Ext.define('Afisha.view.Viewport',{
    extend:'Ext.Container',
    xtype:'aviewport',
    config:{
        items:[{
                xtype:'categories'
            }, {
                xtype: 'events'
            }
        ],
        fullscreen:true,
        layout:'card'
    }
});
