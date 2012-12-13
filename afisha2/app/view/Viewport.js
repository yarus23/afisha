Ext.define('Afisha.view.Viewport',{
    extend:'Ext.Container',
    xtype:'aviewport',
    config:{
        items:[{
                xtype:'categories'
            }, {
                xtype: 'events'
            },{
                xtype:'imgfullview'
            },{
                xtype:'placeview'
            },{
                xtype:'eventview'
            }
        ],
        fullscreen:true,
        layout:'card'
    }
});
