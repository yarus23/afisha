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
                xtype:'panel',
                id:'pv_buttons',
                layout:'vbox',
                style:'margin-top:0.5em; border-top-color: #999;'
            },{
                xtype:'photogallery',
                id:'pv_gallery'
            },{
                xtype:'schedulelist',
                id: 'pv_schedulelist'
            }]
        }] 
    }
});
