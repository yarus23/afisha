Ext.define('Afisha.view.AfishaViews.PlaceView',{
    extend:'Ext.Container',
    xtype:'placeview',
    requires:['Afisha.view.components.BackButton','Afisha.view.components.PhotoGallery','Afisha.view.components.ScheduleList'],//,'Afisha.view.components.HrefBtn','Afisha.view.components.UrlBtn','Afisha.view.components.ClickBtn'],
    config:{
        controllerName:'AfishaC.PlaceView',
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
                id:'pv_header',
                style:'padding-top:0.2em;',
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
                    id:'pv_rate_count',
                    style:'font-size:0.8em'
                },{
                    xtype:'panel',
                    id:'pv_title',
                    style:'font-size: 1.2em; font-weight: bold;padding-left:0.3em;'
                }]
            },{
                xtype:'panel',
                id:'pv_buttons',
                layout:'vbox',
                style:'margin-top:0.5em; border-top-color: #999;'
            },{
                xtype:'photogallery',
                id:'pv_gallery'
            },{
                xtype:'schedulelist',
                id: 'pv_schedulelist',
                scrollable: {
                    disabled: true
                },
                height:'10em',
                ob_type:'place'
                //layout:'fit'
            }]
        }] 
    }
});
