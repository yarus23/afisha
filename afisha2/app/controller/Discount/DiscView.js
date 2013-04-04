Ext.define('Afisha.controller.Discount.DiscView', {
    extend: 'Ext.app.Controller',

    config: {
        currentType:'',
        currentRecord:null,
        refs: {
            viewport: 'aviewport',
            disvView:'aviewport discview',
            photogallery: 'aviewport discview photogallery',
            header:'aviewport discview panel#disc_title',
            descr:'aviewport discview panel#disc_descr',
            price:'aviewport discview panel#disc_price panel#disc_price_val ',
            discount:'aviewport discview panel#disc_disc panel#disc_disc_val',
            save:'aviewport discview panel#disc_save panel#disc_save_val',
            text:'aviewport discview panel#disc_text',//disc_conditions
            conditions:'aviewport discview panel#disc_conditions',
            timeOut:'aviewport discview img#disc_timeout',
            buttons:'aviewport discview panel#disc_buttons_cont',
            favBtn:'aviewport discview favbutton',
            as:'aviewport discview actionsheet'
        },
        control: {
            favBtn:{
                tap:'onFavBtnTap'
            }
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
                text:phone,
                handler:this.showPhoneList,
                scope:this
            }
            buttons_el.add(button);
        }
    },
    showPhoneList:function(){
        var phone = this.getCurrentRecord().get('phone');
        var list = phone.split(',');
        var buttons = [];
        for (var i = 0; i< list.length; i++){
            buttons.push({
                style: 'padding: 0em; margin:1em; height:3em;',
                handler: null,
                html: '<a class="x-button-label" style="color:black; text-decoration: none; padding: .8em .6em;" href="tel:' + list[i] + '">' + list[i] + '</a>'
            })
        }
        buttons.push({text:'Отмена', action:'cancel', params:null,ui:'decline',handler:this.closeAS, scope:this, style:'margin:1em;'});
        var as = this.getAs();
        as.removeAll();
        as.add(buttons);
        if(buttons.length)
            as.show();
    },
    closeAS:function(){
        this.getAs().hide();
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
    initView:function(opt){
        var store = Ext.getStore('DiscView');
        this.getDisvView().setMasked({
            xtype:'loadmask',
            message:'Загрузка',
            style:'background-color:gray;'
        });
        store.getProxy().setExtraParam('id',opt.rec_id);
        var favStore = Ext.getStore('Favorites');
        this.getFavBtn().setState(favStore.isRecordInFav('discount', opt.rec_id));
        //body.setBodyOptions(opt);
        //body.parent.setActiveItem(1);
        //bodyContainer.setMasked({});
        if (!store.isLoaded){//first-time load. 
            var me = this;
            setTimeout(function(){
                store.load(me.bindData, me);
            },500);
        } else
            store.load(this.bindData, this);
    },
    onFavBtnTap:function(){
        var params = {};
        var store = Ext.getStore('DiscView');
        var favStore = Ext.getStore('Favorites');
        params.type = 'discount';
        var record = this.getCurrentRecord();
        params.rid = record.get('id');
        params.title = record.get('title');
        params.descr = record.get('description');
        //params.type = 'news';
        this.getFavBtn().setState(favStore.setFav(params));
    },
    bindData:function(records){
        if (!records.length){
            Afisha.gf.alert('Невозможно загрузить статью.');
            return;
        }
        var record = records[0];
        this.setCurrentRecord(record);
        this.getHeader().setData(record.data);
        this.getDescr().setData(record.data);
        this.updateGallery(record);
        this.getPrice().setData(record.data);
        this.getDiscount().setData(record.data);
        this.getSave().setData(record.data);
        this.checkButtons(record);
        this.getTimeOut().setData(this.getTimeOutObj());
        this.getText().setData(record.data);
        this.getConditions().setData(record.data);
        this.getDisvView().setMasked(null);
    },
    updateGallery:function(record){
        var pictureList = [];
        ///////////debug!!!!
        //pictureList.push("http://img.lenta.ru/news/2012/12/12/recognize/picture.jpg","http://img.lenta.ru/news/2012/11/13/backs/picture.jpg");
        ///////////////
        var urlBody = Global.img_url;
        //image
        var tmp = record.get('image');
        if (tmp && tmp.length){
            pictureList.push(urlBody + tmp);
        }
        //new version
        tmp = record.get('images');
        for (var i = 0; i< tmp.length; i++){
            pictureList.push(urlBody + tmp[i][0]);
        }
        var pg = this.getPhotogallery();
        pg.loadPictureList(pictureList);
    },
    goBack: function() {
        return false;
    }
})
