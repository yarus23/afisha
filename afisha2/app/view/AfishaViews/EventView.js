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
                tpl:new Ext.XTemplate(
                    '<div class="title" >',
                        '{[this.getRate(values.vote)]}',
                        '<tpl if="name.length">{name}</tpl><tpl if="!name.length">{aka}</tpl>',
                    '</div>',
                    {
                        getRate:function(rate){
                            rate = parseFloat(rate);
                            if (isNaN(rate))
                                rate = 0;

                            rate = Math.floor(rate + 0.499);
                            var s = '';
                            if( rate >= 4.9 )
                                s += '<div class="superstar"></div>';
                            else
                            if( rate == 0 )
                                s += '<div class="superstar empty"></div>';
                            else {
                                s += '<div class="superstars"><div class="superstar" style="width:'+(0.76*rate + 0.05)+'em"></div><div class="superstar empty" style="width:'+0.8 * (5-rate)+'em"></div></div>';
                            }
                            return s;
                        }
                    }
                )
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
