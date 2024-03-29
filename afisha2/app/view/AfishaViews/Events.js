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
    // todo: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
        //if (type)
        //    return '<img src="config/resources/icons/star-'+ rate + '.png" class="teststar"></img>';
        var s = '';
        if( rate >= 4.9 )
            s += '<div class="superstar"></div>';
        else
        if( rate == 0 )
            return s;//s += '<div class="superstar empty"></div>';
        else {
//            s += '<div class="superstars"><div class="superstar" style="width:'+(0.76*rate + 0.05)+'em"></div><div class="superstar empty" style="width:'+0.8 * (5-rate)+'em"></div></div>';
            s += '<div class="superstars"><div class="superstar" style="width:'+(0.76*rate + 0.05)+'em"></div></div>';

        }
        return s;
    }
}

Afisha.placesTpl = new Ext.XTemplate(
  '<tpl if="name">',
  '<tpl if="sort &gt; 0">', 
    '<div class="list-first-line" style="color:DarkBlue">',
   '<tpl else>', 
    '<div class="list-first-line">',
  '</tpl>',    
       '{[this.vote(values.vote, values.type, values.trailer)]}',
       '<div class="list-item-title" style="width:{[Afisha.titleWidth]}px">{name}</div>',
    '</div>',
    '<div class="list-second-line">',
//       '<span class="distance">{[this.getDistanceStr(values)]}</span>',
       '<div class="list-item-content" style="width:{[Afisha.titleWidth]}px">{address}</div>',
    '</div>',
  '</tpl>',
 {
     vote: Afisha.getRatingHtml,
     //getDistanceStr: Afisha.getDistanceStr
 });

// {[Global.img_url + values.main_image]}
Afisha.eventsTpl = new Ext.XTemplate(
  '<tpl if="name">',
    '<div class="eventlist-item-block eventlist-item-image" style="height:{[this.eventListImgSize]}px;background-repeat: no-repeat;background-position:center;background-size:contain;background-image:url(\'{[Global.img_url + "img/get_image/?path=" + values.main_image + "&width=" + this.eventListImgSize + "&height=" + this.eventListImgSize]}\')">',
    '</div>',
    '<div class="eventlist-item-block eventlist-textblock">',
      '<div class="list-first-line">',
         '<div class="list-item-title" style="width:{[Afisha.titleWidth]}px">{name}</div>',
      '</div>',
      '<tpl if="this.ifcast(values)">',
          '<div class="list-second-line event-description"><div class="list-item-content">{genre} <tpl if="cast">({cast})</tpl></div>',
          '</div>',
      '</tpl>',
      '<tpl if="start_date">',
          '<div class="list-second-line event-description schedule-description"><div class="list-item-content">',
              '<div class="event-where">{place_name}</div>',
              '<div class="event-when">,&nbsp;{[this.representDate(values.start_date)]}<tpl if="finish_date"> - {[this.representDate(values.finish_date)]}</tpl></div>',
          '</div></div>',
      '</tpl>',
      '{[this.vote(values.vote, values.type, values.trailer)]}',
    '</div>',
  '</tpl>',
 {
     vote: Afisha.getRatingHtml,
     ifcast: function(val) {return val.cast},
     representDate:function(dateStr){
         dateStr = dateStr.split('-');
         if (dateStr.length <3)
             return '';
         return (dateStr[2][0] == '0' ? dateStr[2][1].toString() : dateStr[2]) + getMonthShortName(dateStr[1]);
     },
     getimg:function(){
         //debugger;
     }
     
 });


Ext.define('Afisha.view.AfishaViews.Events',{
    extend:'Ext.Container',
    xtype:'events',
    requires:['Afisha.view.components.BackButton', 'Afisha.view.components.PopupList'],
    config:{
        controllerName:'AfishaC.Events',
        layout:'fit',
        items:[
        {
            xtype:'titlebar',
            cls:'toolbar_wa',
            docked:'top',
            items: [{
                xtype:'backbutton'
            }, {
                xtype:'toolbutton',
                align:'right',
                id:'searchButton'
            }, {
                xtype:'toolbutton',
                align:'right',
                id:'sortButton'
            }, {
                xtype:'toolbutton',
                align:'right',
                id:'filterButton'
            }]
        },{
            xtype:'fieldset',
            docked:'top',
            id:'sortPanel',
            items:[{
                    xtype: 'textfield',
                    label: 'Поиск',
                    name: 'searchVal'
                }
            ],
            margin:0,
            hidden:true
        },  
        {
            xtype: 'tabpanel',
            layout: { animation: false },
            tabBar : {
               layout : { 
                  pack : 'center'
               },
               cls:'eventsTabBar',
               baseCls:'eventsTabBar', // чтобы не цеплять стили сенчи
               height:'2.2em'
            },
            items: [{
                title: 'Events',
                xtype:'list',
                id:'eventsList',
                emptyText:'<div class="emptyText">Информация отсутствует</div>',
                store:'Events',
                disableSelection:true,
                itemTpl: Afisha.eventsTpl,
                itemHeight:100,
                scrollToTopOnRefresh: false
            },
            {
                title: 'Places',
                xtype: 'list',
                store: 'Places',
                emptyText:'<div class="emptyText">Информация отсутствует</div>',
                id: 'placesList',
                disableSelection:true,
                itemTpl: Afisha.placesTpl,
                itemHeight:80,
                scrollToTopOnRefresh: false,
                //infinite:true // для ресторанов//будем устанавливать флаг программно
            }
            ]}] 
        }
});
