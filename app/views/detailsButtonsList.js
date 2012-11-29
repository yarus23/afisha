Afisha.views.buttonsList = Ext.extend(Ext.Panel,{
    id:'buttonsList',
    baseCls:'x-list',
    cls:'myDisclosure buttonsList',
    defaults:{
        xtype:'button',
        baseCls:'x-list-item',
        pressedCls:'x-item-pressed',
    },
    checkFields:function(id,record,field){
        var el = this.down('#' + id);
        if (!el )
            return false;
        if (!record[field])
        {
            el.hide();
            return false;
        }
        if (el.isHidden())
            el.show();
        return el;
    },
    checkFav:function(record){
        var el = this.checkFields('comments',record,'address');
        if (!el)
            return;
        el.rid = record.id;
    },
    checkAddress:function(record){
        
        var el = this.checkFields('address',record,'address');
        if (!el)
            return;
        el.coords = null;
        var isDisable = (record.lat == "0") || (record.lng == "0");
        el.setDisabled(isDisable);
        var address = '';
        if (record.city && record.city.length)
            address += record.city;
        if (record.address && record.address.length)
            address += ' ' + record.address;
        if (!address.length)
            address = 'Показать на карте';
        el.coords = {
            latitude:record.lat,
            longitude:record.lng
        };
        el.update({
            addr:address,
            coords:record, 
            ico:isDisable?'config/resources/icons/4_disable.png':'config/resources/icons/4.png'
        });
    },
    checkPhone:function(record){
        var el = this.checkFields('phone', record, 'phone');
        if (!el )
            return;
        el.beforeUpdate(record);
        el.update({
            phone: record.phone
        });
    },
    checkUrl:function(record){
        var el = this.checkFields('url', record, 'url');
        if (!el )
            return;
        if (record.url.search('http://') == -1)
            el.update({
                url: 'http://' + record.url
            });
        else
            el.update({
                url: record.url
            });
    },
    bindData:function(cRecord,comments){
        this.checkAddress(cRecord);
        this.checkUrl(cRecord);
        this.checkPhone(cRecord);
        var cf = this.down('#comments');
        if (!comments)
            cf.hide();
        else
        {
            cf.update({
                com_count:cRecord.com_count
            });
            cf.show();
        }
        this.commen_field = comments;
        this.rid = cRecord.id;
        this.rName = cRecord.name || cRecord.aka;
        //this.checkFav(cRecord);
//        this.down('#fullSchedule').params = {record:cRecord,store:cStore}
		this.doComponentLayout();
    },
    initComponent: function() {
        this.items = [];
        this.items.push({
            itemId:'address',
            cls:'map-button',
            tpl:new Ext.XTemplate(
                '<img class="x-icon-mask" src="{ico}"><div class="x-list-item-body" ><div class="list-item-title">{addr}</div></div><tpl if="this.getDist(coords)"><span class="distance">({[Afisha.getDistanceStr(values.coords)]})</span></tpl>',
                {
                    getDist:function(coords){
                        if (Afisha.getDistanceStr(coords).length)
                            return true;
                        else
                            return false;
                            
                    }
                }
                ),
            handler:function(el){
                if (!el.coords)
                    return false;
                Ext.dispatch({      
                    controller: 'main',
                    action: 'showMap',
                    coords: el.coords
                });
            }
        });
        
        // --------------
        this.items.push({
            itemId:'phone',
            cls:'wideButton',
            beforeUpdate: function(data) {
                var me = this;
                var phones = data.phone;
                phones = phones.split(',');
                if (phones.length < 2) {
                    me.phonesList = undefined;
                    me.tpl = new Ext.XTemplate(
                        '<a  class="phonelink" href="tel:{phone}">',
                        '<img class="x-icon-mask" src="config/resources/icons/6.png"><div class="x-list-item-body"><div class="list-item-title"><b>{phone}</b></div></div><div class="x-list-disclosure"></div>',
                        '</a>');
                } else {
                    me.phonesList = phones;
                    me.tpl = new Ext.XTemplate(
                        '<img class="x-icon-mask" src="config/resources/icons/6.png"><div class="x-list-item-body"><div class="list-item-title"><b>{phone}</b></div></div><div class="x-list-disclosure"></div>');
                }
            },
            handler:function(el){
                var me = this;
                if (!me.phonesList)
                    return;
                phonesList.bindData(me.phonesList);
                phonesList.show();
            }
        });
        // --------------
        this.items.push({
            itemId:'url',
            tpl:new Ext.XTemplate(
                '<img class="x-icon-mask" src="config/resources/icons/11.png"><div class="x-list-item-body"><div class="list-item-title">Веб сайт</div></div><div class="x-list-disclosure"></div>',
                '<a class="mylink" href="{url}">&nbsp;</a>'
                ),
            handler:function(el){
                var site = el.el.dom.getElementsByClassName('mylink');
                if (!site || !site.length)
                    return false;
                Afisha.openUrl(site[0]);    
            /*Ext.dispatch({      
                       controller: 'main',
                       action: 'goHref',
                       hrefEl: site[0]
                    });*/
            }
        },{
            itemId:'comments',
            scope:this,
            cls:'commentsButton',
            tpl:new Ext.XTemplate('<img class="x-icon-mask" src="config/resources/icons/2.png"><div class="x-list-item-body"><div class="list-item-title">Добавить/Читать отзывы ({com_count})</div></div><div class="x-list-disclosure"></div>'),
            handler:function(){
                if (isOnline(true))
                    Ext.dispatch({      
                        controller: 'main',
                        action: 'showComments',
                        from:this.ownerCt.ownerCt.id,
                        comment:this.commen_field,
                        el_id:this.rid,
                        name:this.rName
                    });
            }
        }/*,{
            itemId:'fullSchedule',
            html:'<img class="x-icon-mask" src="config/resources/icons/Actions-view-calendar-day-icon.png"><div class="x-list-item-body"><div class="list-item-title">Полное расписание.</div></div>',
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
        }*/);
        Afisha.views.buttonsList.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('buttonsList', Afisha.views.buttonsList);