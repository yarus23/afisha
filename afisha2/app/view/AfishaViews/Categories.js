//Afisha.view.components.TopToolbar
Ext.define('Afisha.view.AfishaViews.Categories',{
    extend:'Ext.Container',
    xtype:'categories',
    requires:['Afisha.view.components.TopToolbar'],
    config:{
        controllerName:'AfishaC.Categories',
        items:[{
            xtype:'toptoolbar',
            style:'background-color: white;'
        },{
            xtype:'list',
            store:'Categories',
            itemTpl: '{name}',
            flex:1,
            disableSelection:true,
            scrollable: {
                direction: 'vertical',
            }
        }],
    layout:'vbox'
    }
});