Afisha.views.detailsFooter = Ext.extend(Ext.Panel, {
    id:'detailsFooter',
    layout:'fit',
    //baseCls:'x-list',
    cls:'detailsFooter',
    tpl:new Ext.XTemplate(
        //'<tpl if="type == &quot;restaurant&quot;"><div class="separator"></div></tpl>',          //all
        '<tpl if="time_start.length"><div class="info"><b>Время работы: </b>{time_start} - {time_end}</div></tpl>',      //place
        '<tpl if="price.length"><div class="info"><b>{[this.getPriceDescription(values)]}: </b>{price}</div></tpl>',    //place
        
        '<tpl if="bathtype.length"><div class="info"><b>Тип: </b>{[this.getDataByIdList(values.bathtype, "BathtypeStore", values.category, values.type)]}</div></tpl>',    //bath
        '<tpl if="bathserv.length && address"><div class="info"><b>Сервис: </b>{[this.getDataByIdList(values.bathserv, "BathservStore", values.category, values.type)]}</div></tpl>',    //bath
        '<tpl if="sporttype.length"><div class="info"><b>Виды спорта: </b>{[this.getDataByIdList(values.sporttype, "SporttypeStore", values.category, values.type)]}</div></tpl>',    //sporttype
        '<tpl if="shoptype.length"><div class="info"><b>Тип: </b>{[this.getDataByIdList(values.shoptype, "ShoptypeStore", values.category, values.type)]}</div></tpl>',    //sporttype
        '<tpl if="kitchen.length"><div class="info"><b>Кухня: </b>{[this.getDataByIdList(values.kitchen,"KitchenStore", values.category, values.type)]}</div></tpl>',    //restaurant
        '<tpl if="genre.length && address"><div class="info"><b>Жанр: </b>{[this.getDataByIdList(values.genre, "GenreStore", values.category, values.type)]}</div></tpl>',    //restaurant
        '<tpl if="district.length"><div class="info"><b>Район: </b>{[this.getDistrict(values.district, values.category, values.type)]}</div></tpl>',    //all places
        
        '<tpl if="price.length || time.length"><div class="separator"></div></tpl>',            //place
        '<tpl if="description.length"><div class="description">{description}</div></tpl>',      //event
        '<tpl if="text.length"><div class="description">{text}</div></tpl>',                    //place
        '<tpl if="description.length"><div class="separator"></div></tpl>',      //both
        '<tpl if="text.length"><div class="separator"></div></tpl>',      //both
        '<div class="info"><tpl if="country.length"><b>{country}&nbsp;</b></tpl><tpl if="year.length && year &gt;  &quot;0&quot; "><b>{year}</b></tpl></div>',//event
        '<tpl if="director.length"><div class="info"><b>Режиссер:</b>&nbsp;{director}</div></tpl>',//event
        '<tpl if="cast.length"><div class="info"><b>В ролях:</b>&nbsp;{cast}</div></tpl>',       //event
        '<tpl if="country.length || director.length || cast.length"><div class="separator"></div></tpl>',
        {
            getPriceDescription:function(record){
                if (((record.type == 'club') && record.address) || (record.type == 'restaurant') || (record.type == 'pool'))
                    return 'Средний счет';
                else
                    return 'Цена билета';
            },
            getDistrict:function(distr, cat, type)
            {
                var res = [];
                var category = cat?cat:type;
                var analyze = function(record){
                    if (distr.indexOf(record.data.value.toString()) != -1)
                        res.push(record.data.text);
                }
                Afisha.stores[category + 'DistrictStore'].each(analyze);
                return res.join(', ');
            },
            getDataByIdList:function(idList, storeName, category, type){
                var res = [];
                var cat = category?category:type;
                Afisha.stores[cat + storeName].each(function(record){
                    if (idList.indexOf(record.data.value.toString()) != -1)
                        res.push(record.data.text);
                });
                return res.join(', ');
            }
        }
    ),
    bindData:function(data,cStore){
        this.update(data);
        //this.down('#fullSchedule').params = {record:data,store:cStore};
    },
    initComponent: function() {
        /*this.dockedItems = [new Ext.Button({
            baseCls:'x-list-item',
            pressedCls:'x-item-pressed',
            itemId:'fullSchedule',
            html:'<img class="x-icon-mask" src="config/resources/icons/Actions-view-calendar-day-icon.png"><div class="x-list-item-body"><div class="list-item-title"><b>Расписание на другие дни.</b></div></div><div class="x-list-disclosure"></div>',
            handler:function(el){
                if (!el.params)
                    return false;
                Ext.dispatch({      
                   controller: 'main',
                   action: 'showFullSchedule',
                   record: el.params.record,
                   store: el.params.store
                });
            }
        })]*/
        Afisha.views.detailsFooter.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('detailsFooter', Afisha.views.detailsFooter);