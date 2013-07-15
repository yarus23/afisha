
Ext.define('Afisha.view.AfishaViews.TileView',{
    extend:'Ext.Container',
    xtype:'tiles',
    id:'tiles',
    config:{
        controllerName:'AfishaC.TilesView',
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    }
});
