        Afisha.getDistanceStr = function(data) {
            if (!Afisha.useGPS)
                return '';
            var lat = data.lat?data.lat:data.latitude;
            var lng = data.lng?data.lng:data.longitude;
            if( !Afisha.position || !lat || !lng) return '';
            var d = Geo.dist(lat, lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
            if( d < 1 ) return (d * 1000).toFixed(1) + 'м'
            else return d.toFixed(1) + 'км';
        }
        Afisha.getRatingHtml = function(rate,type,trailer){
            var noRate = ['beauty','stomotolog','medic','fitnes'];
            if (type && trailer !== undefined && (noRate.indexOf(type) != -1))
                return '';
            var rate = parseFloat(rate);
            if (isNaN(rate))
                rate = 0;

            rate = Math.floor(rate + 0.499);
            if (Afisha.oldversion)
            {//star-3
                var s = '<div class="stars-set">';
                for(var i=0; i < 5; i++)
                    if( i < rate )
                        s += '<img class="rating-star" src="config/resources/icons/starfilled.png"></img>';
                    else
                        s += '<img class="rating-star-filled" src="config/resources/icons/star.png"></img>';
                s += '</div>';
                return s;
            }
            else
            {
                if (type)
                    return '<img src="config/resources/icons/star-'+ rate + '.png" class="teststar"></img>';
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

Afisha.placesTpl = new Ext.XTemplate(
              '<tpl if="name">',
                '<div class="list-first-line">',
                   '{[this.vote(values.vote, values.type, values.trailer)]}',
                   '<div class="list-item-title">{name}</div>',
                '</div>',
                '<div class="list-second-line">',
                   '<span class="distance">{[this.getDistanceStr(values)]}</span>',
                   '<div class="list-item-content">{address}</div>',
                '</div>',
              '</tpl>',
             {
                 vote: Afisha.getRatingHtml,
                 getDistanceStr: Afisha.getDistanceStr
             });


Afisha.eventsTpl = new Ext.XTemplate(
              '<tpl if="name">',
                '<div class="list-first-line">',
                   '{[this.vote(values.vote, values.type, values.trailer)]}',
                   '<div class="list-item-title">{name}</div>',
                '</div>',
                '<tpl if="this.ifcast(values)">',
                    '<div class="list-second-line event-description"><div class="list-item-content">{genre} <tpl if="cast">({cast})</tpl></div></div>',
                '</tpl>',
                '<tpl if="start_date">',
                    '<div class="list-second-line event-description schedule-description"><div class="list-item-content">',
                        '<div class="event-where">{place_name}</div>',
                        '<div class="event-when">,&nbsp;{[this.representDate(values.start_date)]}<tpl if="finish_date"> - {[this.representDate(values.finish_date)]}</tpl></div>',
                    '</div></div>',
                '</tpl>',
              '</tpl>',
             {
                 vote: Afisha.getRatingHtml,
                 ifcast: function(val) {return val.cast},
                 representDate:function(dateStr){
                     dateStr = dateStr.split('-');
                     if (dateStr.length <3)
                         return '';
                     return (dateStr[2][0] == '0' ? dateStr[2][1].toString() : dateStr[2]) + getMonthShortName(dateStr[1]);
                 }
             });


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
                title: 'Events',
                xtype:'list',
                id:'eventsList',
                store:'Events',
                disableSelection:true,
                itemTpl: Afisha.eventsTpl
            },
            {
                title: 'Places',
                xtype: 'list',
                store: 'Places',
                id: 'placesList',
                disableSelection:true,
                itemTpl: Afisha.placesTpl
            }
            ]}] 
        }
});
