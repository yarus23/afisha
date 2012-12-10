Ext.define('Afisha.view.Viewport',{
    extend:'Ext.Container',
    xtype:'aviewport',
    config:{
        items:[{
                xtype:'categories'
            }, {
                xtype: 'events'
            },{
                xtype:'placeview'
            }
        ],
        fullscreen:true,
        layout:'card'
    }
});
