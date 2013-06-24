Ext.define('Afisha.controller.AfishaC.PlaceView', {
    extend: 'Ext.app.Controller',

    config: {
        currentType:'',
        currentRecord:null,
        refs: {
            viewport: 'aviewport',
            selectfield:'aviewport placeview toolbar selectfield',
            title:'aviewport placeview panel#pv_header panel#pv_title',
            rateCount:'aviewport placeview panel#pv_header panel#pv_rate_count',
            rateImg:'aviewport placeview panel#pv_header img#rateImg',
            buttons:'aviewport placeview panel#pv_buttons',
            mapBtn:'aviewport placeview mapbutton button',
            mapEl:'aviewport placeview mapbutton',
            photogallery: 'aviewport placeview photogallery',
            schList: 'aviewport placeview schedulelist',
            footer: 'aviewport placeview panel#pv_footer',
            favBtn:' aviewport placeview favbutton',
            comBtn:'aviewport placeview #pv_commentsBtn'
        },
        control: {
            selectfield:{
                change:'onSelectChange'
            },
            favBtn:{
                tap:'onFavBtnTap'
            },
            placeview:{
                show:'onPVShowTimeOut'
            },
            mapBtn:{
                tap:'onMapButtonTap'
            },
            comBtn: {
                tap: 'onComButtonTap'
            }
        }
    },
    onSelectChange:function(me, newVal,oldVal){
        var date;
        switch (newVal){
            case 0:{
                date = new Date();
                break;
            }
            case 1:{
                    date = new Date();
                    date.nextDay();
                    break;
            }
            case 'full':{
                    date = null;
                    break;
            }
            default:{
                    date = newVal;
                    break;
            }
        }
        this.getSchList().bindScheduleData(this.getCurrentRecord().get('id'),date,false);
        this.onPVShow();
    },
    onPVShowTimeOut:function(){
        var me = this;
        setTimeout(function(){
            me.onPVShow();
        },200)
    },
    onPVShow:function(){
        //нужны нормальные данные для дебага. пока что у андрея баг с расписанием
        var list = this.getSchList();
        var items = list.element.query('.scheduleItem');
        var height = 0;
        if (items.length == 0 || list.onlyHeader){
            var header = list.element.down('.x-list-header');//.x-list-header
            if (header)
                list.setHeight(header.getHeight());
//            console.log(list.getHeight())
//            console.log(list.element.getHeight())
        } else {
            for (var i = 0; i < items.length; i++){
                var css = items[i].style["-webkit-transform"];
                if ((items[i].textContent.trim() != "") && (!css || (css && css.indexOf("-10000px") == -1))){//костыль
                    height += items[i].offsetHeight;
                    //debugger;
                    //console.log(items[i].textContent)
                }
            }
            list.setHeight(height);
        }
//        debugger;
        list.removeCls('getsize');//x-list-item
    },
    initView:function(record){
//        console.log(record.data)
        var type = Ext.getStore('Places').getCurrentType();
        this.setCurrentType(type);
        this.setCurrentRecord(record);
        //изврат с обходом подкатегорий, чтобы вытащить опции. пригодится в избранном
        var options;
        var filter;
        var categoriesStore = Ext.getStore('Categories');
        var catStore = categoriesStore.getById(type);//LifeSubCategories
        if (!catStore){
            categoriesStore.findBy(function(rec){
                var sub = rec.get('subcategories');
                if (!sub)
                    return false;
                var res = Ext.getStore(sub).getById(type);
                if (res){
                    options = res.get('options');
                    filter = res.get('filter')
                }
                else
                    return false;
            })
        } else {
            options = catStore.get('options');
            filter = catStore.get('filter')
        } 
        this.setSelectConfig(record, options);
        this.setupHeader(record);
        this.checkButtonsFields(record);
        this.collectImages(record);
        record.set('type',type);
        this.getFooter().setRecord(record);
        var favStore = Ext.getStore('Favorites');
        this.getFavBtn().setState(favStore.isRecordInFav(type, record.get('id')));
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
    setSelectConfig:function(record, options){
        var select = this.getSelectfield();
        var schList = this.getSchList();
        if (!options || options.schType == 'none'){
            select.hide();
            schList.hide();
            return;
        }
        else{
            schList.show()
        }
        var cnt = 0;
        if (options.schType == 'service'){
            this.getSchList().bindScheduleData(record.get('id'),null,false);
            cnt = 1;
        } else if (options.schSelectDefType == null){
            cnt = this.getSchList().bindScheduleData(record.get('id'),null,false);
            select.setValue('full')
        } else if (options.schSelectDefType == 'week'){
            cnt = this.getSchList().bindScheduleData(record.get('id'),'week',false);
            select.setValue('week')
        } else {
            cnt = this.getSchList().bindScheduleData(record.get('id'),new Date(),false);
            select.setValue(0)
        }
        if (cnt < 2)
            select.hide()
        else
            select.show();
        //this.getSchList().bindScheduleData(record.get('id'),null,true);
        //debugger;
    },
    setupHeader:function(record){
        var name = record.get('name');
        this.getTitle().setHtml(name ? name : record.get('aka'));
        var rate = parseFloat(record.get('vote'));
        if (isNaN(rate))
            rate = 0;
        rate = Math.floor(rate + 0.499);
        this.getRateImg().setSrc('resources/star-' + rate + '.png');
        this.getRateCount().setHtml(record.get('num_votes'))
    },
    onMapButtonTap:function(){
        Afisha.app.fireEvent('showItem', 'mapview',this.getMapBtn().getData());
    },
    onComButtonTap: function () {
        var config = {};
        config.type = 'place',
        config.elem_type = this.getCurrentType();
        config.elem_id = this.getCurrentRecord().get('id');
        this.getApplication().fireEvent('showItem', 'commentsview',config);
//        var OAuthController = Afisha.app.getController('AfishaC.OAuth'),
//            callback = function (userdata) {
//                Afisha.app.fireEvent('showItem', 'addcomview');
//            };
//        OAuthController.getUserData(callback);
    },
    checkButtonsFields:function(record){
        var buttonsPanel = this.getButtons();
        buttonsPanel.removeAll();
        var lat = record.get('lat')
        var lng = record.get('lng');
        var address = record.get('address');
        if (lat && lng){
            this.getMapBtn().setData({
                    value:address,
                    latitude:lng,
                    longitude:lat
                });
            this.getMapEl().show();
        } else{
            this.getMapEl().hide();
        }
        var el_cache = [];
        var phone = record.get('phone');
        if (phone){
            phone = phone.split(',');
            for(var i = 0; i < phone.length; i++)
                el_cache.push({
                    xtype:'hrefbutton',
                    data:{
                        type:'phone',
                        value:phone[i]
                    }
                })
        }
        var site = record.get('url');
        if (site){
            el_cache.push({
                xtype:'urlbutton',
                data:{
                    value:site
                }
            })
        }
        el_cache.push({
            id:'pv_commentsBtn',
            xtype:'clickbutton',
            style:'border-top:0;',
            data:{
                value:'Добавить/Читать отзывы (' + record.get('com_count') + ')'
            }
        })
        for (var idx = 0; idx < el_cache.length; idx++){
            buttonsPanel.add(el_cache[idx]);
            if (idx != el_cache.length - 1){
                buttonsPanel.add({
                    xtype:'img',
                    height:'0.21em',
                    src:'resources/wave.png',
                    cls:'img-border'
                })
            }
        }
        //buttonsPanel.add
    },
    collectImages:function(record){
        var pictureList = [];
        //var cat = record.category?record.category:record.type;
        var urlBody = Global.img_url;
        //image
        var tmp = record.get('image');
        //old version?
        if (tmp && (tmp.image instanceof Array) && tmp.length)
        {
            for (var idx = 0; idx < tmp.length; idx++)
            {
                if (tmp[idx].json)                                                   //hello yql
                    pictureList.push(urlBody + tmp[idx].json[0]);
                else
                    pictureList.push(urlBody + tmp[idx][0]);
            }
        } else
        //new version
        for (var i = 0; i< tmp.length; i++){
            pictureList.push(urlBody + tmp[i][0]);
        }
    //console.log(pictureList);
        ///////////debug!!!!
        //pictureList.push("http://img.lenta.ru/news/2012/12/12/recognize/picture.jpg","http://img.lenta.ru/news/2012/11/13/backs/picture.jpg");
        ///////////////
        var pg = this.getPhotogallery();
        pg.loadPictureList(pictureList);

    },
    goBack: function() {
        return false;
    }
})
