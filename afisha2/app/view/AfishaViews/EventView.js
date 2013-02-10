Ext.define('Afisha.view.AfishaViews.EventView',{
    extend:'Ext.Container',
    xtype:'eventview',
    requires:['Afisha.view.components.BackButton','Afisha.view.components.PhotoGallery','Afisha.view.components.ScheduleList'],//,'Afisha.view.components.HrefBtn','Afisha.view.components.UrlBtn','Afisha.view.components.ClickBtn'],
    config:{
        controllerName:'AfishaC.EventView',
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
                usePicker:false,
                defaultPhonePickerConfig:{
                    cls:'select-picker',
                    height:'13.1em',
                    scrollable: {
                        disabled: true
                    },
                },
                defaultTabletPickerConfig:{
                    cls:'select-picker',
                    height:'13.1em',
                    scrollable: {
                        disabled: true
                    },
                },
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
                id:'ev_genre',
                cls:'smallgraytext'
            },{
                xtype:'photogallery',
                id:'ev_gallery'
            },{
                xtype:'schedulelist',
                id: 'ev_schedulelist',
                scrollable: {
                    disabled: true
                },
                //height:'10em',
                ob_type:'event',
                //layout:'fit'
            },{
                xtype:'panel',
                id:'ev_buttons',
                layout:'vbox',
                style:'margin-top:0.5em; border-top-color: #999 !important;'
            },{
                xtype:'panel',
                id:'ev_footer',
                layout:'fit',
                //baseCls:'x-list',
                cls:'detailsFooter fontSized',
                styleHtmlContent:true,
                tpl:new Ext.XTemplate(
                    '<tpl if="description.length"><div class="description">{description}</div></tpl>',      //event
                    '<tpl if="description.length"><div class="separator"></div></tpl>',      //both
                    '<div class="info"><tpl if="country.length"><b>{country}&nbsp;</b></tpl><tpl if="year.length && year &gt;  &quot;0&quot; "><b>{year}</b></tpl></div>',//event
                    '<tpl if="director.length"><div class="info"><b>Режиссер:</b>&nbsp;{director}</div></tpl>',//event
                    '<tpl if="cast.length"><div class="info"><b>В ролях:</b>&nbsp;{cast}</div></tpl>',       //event
                    '<tpl if="country.length || director.length || cast.length"><div class="separator"></div></tpl>',
                    {
                        getPriceDescription:function(type){
                            return 'Цена билета';
                        },
                        getDataByIdList:function(idList, type){
                            var res = [];
                            this.dict = Ext.getStore('Dictionary');
                            var rec = this.dict.getById(type);
                            if (!rec == null){
                                return "";
                            }
                            var data = rec.get('data');
                            
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
