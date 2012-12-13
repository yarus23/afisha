Ext.define('Afisha.view.AfishaViews.EventView',{
    extend:'Ext.Container',
    xtype:'eventview',
    requires:['Afisha.view.components.BackButton','Afisha.view.components.PhotoGallery','Afisha.view.components.ScheduleList'],//,'Afisha.view.components.HrefBtn','Afisha.view.components.UrlBtn','Afisha.view.components.ClickBtn'],
    config:{
        controllerName:'AfishaC.EventView',
        cls:'detailsView',
        layout:'fit',
        items:[{
            xtype:'titlebar',
            docked:'top',
            items: [{
                xtype:'backbutton',
            }]
        },{
            xtype:'panel',
            //flex:1,
            layout: {
                type:'vbox',    
                align:'stretch'
            },
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            items:[{
                xtype:'panel',
                id:'ev_header',
                cls:'detailsHeader',
                items:[{
                    xtype:'img',
                    src:'resources/star-0.png',
                    height:'1em',
                    width:'5em',
                    docked:'right'
                },{
                    xtype:'panel',
                    docked:'right',
                    id:'ev_rate_count',
                    style:'font-size:0.8em'
                },{
                    xtype:'panel',
                    id:'ev_title',
                    style:'font-size: 1.2em; font-weight: bold;padding-left:0.3em;'
                }]
            },{
                xtype:'panel',
                layout:'hbox',
//                items:[{
//                    xtype:'panel',
//                    html:'1 qweqwe qweqwe qweqwe qwe qwe  qweqwe qwe qwe qwe '
//                },{
//                    xtype:'panel',
//                    html:'2',
//                    flex:1
//                }]
            },{
                xtype:'photogallery',
                id:'ev_gallery'
            },{
                xtype:'schedulelist',
                id: 'ev_schedulelist',
                scrollable: {
                    disabled: true
                },
                height:'10em',
                ob_type:'event'
                //layout:'fit'
            },{
                xtype:'panel',
                id:'ev_buttons',
                layout:'vbox',
                style:'margin-top:0.5em; border-top-color: #999;'
            }]
        }] 
    }
});
