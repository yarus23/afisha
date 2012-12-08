//Afisha.view.components.TopToolbar
Ext.define('Afisha.view.AfishaViews.Events',{
    extend:'Ext.Container',
    xtype:'events',
    config:{
        layout:'fit',
        items:[
        {
            xtype:'titlebar',
            docked:'top',
            items: [{
                height:'2.2em',
                text: 'Назад',
                xtype:'button',
                ui: 'default',
                iconCls: 'arrow_left',
                iconMask: true,
                iconAlign: 'center',
                cls: 'maintoolbar-back-btn',
                align:'left'
            }]
        },        
        {
            xtype: 'tabpanel',
            tabBar : {
               layout : { 
                  pack : 'center' 
               },
               cls:'eventsTabBar',
               height:'2.2em'
            },
            items: [{
                title: 'Places'
            },
            {
                title: 'Events'
            }
            ]}] 
        }
});
