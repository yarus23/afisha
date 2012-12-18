Ext.define('Afisha.view.AfishaViews.PlaceView',{
    extend:'Ext.Container',
    xtype:'placeview',
    requires:['Afisha.view.components.BackButton','Afisha.view.components.PhotoGallery','Afisha.view.components.ScheduleList'],//,'Afisha.view.components.HrefBtn','Afisha.view.components.UrlBtn','Afisha.view.components.ClickBtn'],
    config:{
        controllerName:'AfishaC.PlaceView',
        cls:'detailsView',
        layout:'fit',
        items:[{
            xtype:'toolbar',
            docked:'top',
            items: [{
                xtype:'backbutton',
            },{
                xtype:'spacer'
            },{
                xtype:'selectfield',
                options:[
                    {text:'Сегодня',value:0},
                    {text:'Завтра',value:1},
                    {text:'Текущая неделя',value:'week'},
                    {text:'Следующая неделя',value:'nextweek'},
                    {text:'Все дни', value:'full'}],
                name:'options',
                width:'60%',
                itemId:'selectDate',
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
            },{
                xtype:'panel',
                id:'pv_footer',
                layout:'fit',
                //baseCls:'x-list',
                cls:'detailsFooter',
                tpl:new Ext.XTemplate(
                    '<tpl if="time_start.length"><div class="info"><b>Время работы: </b>{time_start} - {time_end}</div></tpl>',      //place
                    '<tpl if="price.length"><div class="info"><b>{[this.getPriceDescription(values.type)]}: </b>{price}</div></tpl>',    //place

                    '<tpl if="bathtype.length"><div class="info"><b>Тип: </b>{[this.getDataByIdList(values.bathtype, "bathtype")]}</div></tpl>',    //bath
                    '<tpl if="bathserv.length && address"><div class="info"><b>Сервис: </b>{[this.getDataByIdList(values.bathserv, "bathserv")]}</div></tpl>',    //bath
                    '<tpl if="sporttype.length"><div class="info"><b>Виды спорта: </b>{[this.getDataByIdList(values.sporttype, "sporttype")]}</div></tpl>',    //sporttype
                    '<tpl if="shoptype.length"><div class="info"><b>Тип: </b>{[this.getDataByIdList(values.shoptype, "shoptype")]}</div></tpl>',    //sporttype
                    '<tpl if="kitchen.length"><div class="info"><b>Кухня: </b>{[this.getDataByIdList(values.kitchen,"kitchen")]}</div></tpl>',    //restaurant
                    '<tpl if="genre.length && address"><div class="info"><b>Жанр: </b>{[this.getDataByIdList(values.genre, "genre")]}</div></tpl>',    //restaurant
                    '<tpl if="district.length"><div class="info"><b>Район: </b>{[this.getDataByIdList(values.district, "district")]}</div></tpl>',    //all places

                    '<tpl if="price.length || time.length"><div class="separator"></div></tpl>',            //place
                    '<tpl if="text.length"><div class="description">{text}</div></tpl>',                    //place
                    '<tpl if="description.length"><div class="separator"></div></tpl>',      //both
                    '<tpl if="text.length"><div class="separator"></div></tpl>',      //both
                    {
                        getPriceDescription:function(type){
                            if ((type == 'club') || (type == 'restaurant') || (type == 'pool'))
                                return 'Средний счет';
                            else
                                return 'Цена билета';
                        },
                        getDataByIdList:function(idList, type){
                            var res = [];
                            var dict = Ext.getStore('Dictionary');
                            var idx = dict.find('type',type);
                            var data = dict.getAt(idx).get('data');
                            for (var i = 0; i< idList.length; i++){
                                res.push(data[idList[i]])
                            }
                            return res.join(', ');
                        }
                    }
                )
            }]
        }] 
    }
});
