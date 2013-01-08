// todo: убрать aviewport поместить все в Ext.Viewport
Ext.define('Afisha.view.Viewport',{
    extend:'Ext.Container',
    xtype:'aviewport',
    config:{
        items:[{
                xtype:'tiles'
            },{
                xtype:'categories'
            }, {
                xtype: 'events'
            },{
                xtype:'imgfullview'
            },{
                xtype:'placeview'
            },{
                xtype:'eventview'
            },{
                xtype:'mapview'
            }
        ],
        fullscreen:true,
        layout:'card'
    }
});
