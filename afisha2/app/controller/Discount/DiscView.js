Ext.define('Afisha.controller.Discount.DiscView', {
    extend: 'Ext.app.Controller',

    config: {
        currentType:'',
        currentRecord:null,
        refs: {
            viewport: 'aviewport',
            disvView:'aviewport discview',
            header:'aviewport discview panel#disc_title',
            descr:'aviewport discview panel#disc_descr',
            price:'aviewport discview panel#disc_price panel#disc_price_val ',
            discount:'aviewport discview panel#disc_disc panel#disc_disc_val',
            save:'aviewport discview panel#disc_save panel#disc_save_val',
            text:'aviewport discview panel#disc_text',//disc_conditions
            conditions:'aviewport discview panel#disc_conditions',
            timeOut:'aviewport discview img#disc_timeout',
            buttons:'aviewport discview panel#disc_buttons_cont',
        },
        control: {

        }
    },

    onPVShow:function(){

    },
    onMapBtnClick:function(){
        var data = this.getData();
        if (!data || data.latitude == 0 || data.longitude == 0){
            return;
        }
        Afisha.app.fireEvent('showItem', 'mapview',data);
    },    
    checkButtons:function(record){
        var buttons_el = this.getButtons();
        buttons_el.removeAll();
        var addr = record.get('address');
        var coords = record.get('coordinates');
        var data = {
            value:addr,
            latitude:0,
            longitude:0
        }
        if (coords && coords.split(',').length == 2){
            data.latitude = coords.split(',')[0];
            data.longitude = coords.split(',')[1];
        }
        var phone = record.get('phone');
        if (addr && addr.length){
            var button = {
                xtype:'button',
                cls:'discount_button',
                iconCls:'map-mask',
                style:'border-right:1px solid #949494',
                iconAlign:'left',
                flex:1,
                text:addr,
                data:data,
                handler:this.onMapBtnClick
            }
            buttons_el.add(button);
        }
        if (phone && phone.length){
            var button = {
                xtype:'button',
                cls:'discount_button',
                iconCls:'phone-mask',
                style:'border-left:1px solid #949494',
                iconAlign:'left',
                flex:1,
                text:phone
            }
            buttons_el.add(button);
        }
    },
    getTimeOutObj:function(){
        var end_date = this.getCurrentRecord().get('end_datetime');
        var now = new Date();
        var res = {
            days:0,
            hours:0,
            minutes:0
        };
        if (end_date <= now)
            return res;
        var additional_days = end_date - now;
        var date = additional_days/(1000 * 60 * 60 * 24);
        res.days = Math.floor(date);
        date -= res.days;
        date *= 24;
        res.hours = Math.floor(date);
        date -= res.hours;
        date *= 60;
        res.minutes = Math.floor(date);
        return res;
        
    },
    initView:function(){
        var record = Ext.getStore('DiscView').getAt(0);
        this.setCurrentRecord(record);
        this.getHeader().setData(record.data);
        this.getDescr().setData(record.data);
        this.getPrice().setData(record.data);
        this.getDiscount().setData(record.data);
        this.getSave().setData(record.data);
        this.checkButtons(record);
        this.getTimeOut().setData(this.getTimeOutObj());
        this.getText().setData(record.data);
        this.getConditions().setData(record.data);
        
//        console.log(record.data)
//        var type = Ext.getStore('Places').getCurrentType();
//        this.setCurrentType(type);
//        this.setCurrentRecord(record);
//        //изврат с обходом подкатегорий, чтобы вытащить опции. пригодится в избранном
//        var options;
//        var filter;
//        var categoriesStore = Ext.getStore('Categories');
//        var catStore = categoriesStore.getById(type);//LifeSubCategories
//        if (!catStore){
//            categoriesStore.findBy(function(rec){
//                var sub = rec.get('subcategories');
//                if (!sub)
//                    return false;
//                var res = Ext.getStore(sub).getById(type);
//                if (res){
//                    options = res.get('options');
//                    filter = res.get('filter')
//                }
//                else
//                    return false;
//            })
//        } else {
//            options = catStore.get('options');
//            filter = catStore.get('filter')
//        } 
//        this.setSelectConfig(record, options);
//        this.setupHeader(record);
//        this.checkButtonsFields(record);
//        this.collectImages(record);
//        record.set('type',type);
//        this.getFooter().setRecord(record);
//        var favStore = Ext.getStore('Favorites');
//        this.getFavBtn().setState(favStore.isRecordInFav(type, record.get('id')));
        //this.getSchList().bindScheduleData(record.get('id'),null,false);
    },
    onFavBtnTap:function(){
        var record = this.getCurrentRecord();
        var params = {};
        var favStore = Ext.getStore('Favorites');
        params.type = this.getCurrentType();
        params.rid = record.get('id');
        params.title = record.get('name');
        params.descr = record.get('address');
        var res = favStore.setFav(params);
        this.getFavBtn().setState(res);
        if (res){
            Afisha.gf.alert("Место добавлено в избранное!");
        }
    },
    goBack: function() {
        return false;
    }
})
