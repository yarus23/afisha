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
            rateImg:'aviewport placeview panel#pv_header img',
            buttons:'aviewport placeview panel#pv_buttons',
            photogallery: 'aviewport placeview photogallery',
            schList: 'aviewport placeview schedulelist',
            footer: 'aviewport placeview panel#pv_footer',
            favBtn:' aviewport placeview favbutton'
        },
        control: {
            favBtn:{
                tap:'onFavBtnTap'
            },
            placeview:{
                show:'onPVShov'
            }
        }
    },
    onPVShov:function(){
        //нужны нормальные данные для дебага. пока что у андрея баг с расписанием
        var list = this.getSchList();
        var items = list.element.query('.x-list-item');
        if (items.length == 0){
            var header = list.element.down('.x-list-header');
            if (header)
                list.setHeight(header.getHeight());
//            console.log(list.getHeight())
//            console.log(list.element.getHeight())
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
    checkButtonsFields:function(record){
        var buttonsPanel = this.getButtons();
        buttonsPanel.removeAll();
        var lat = record.get('lat')
        var lng = record.get('lng');
        var address = record.get('address');
        if (lat && lng){
            buttonsPanel.add({
                id:'mapBtn',
                xtype:'clickbutton',
                data:{
                    value:address,
                    latitude:lng,
                    longitude:lat
                },
                handler:function(){
                    Afisha.app.fireEvent('showItem', 'mapview',this.getData());
                }
            })
        }
        var phone = record.get('phone');
        if (phone){
            phone = phone.split(',');
            for(var i = 0; i < phone.length; i++)
                buttonsPanel.add({
                    xtype:'hrefbutton',
                    data:{
                        type:'phone',
                        value:phone[i]
                    }
                })
        }
        var site = record.get('url');
        if (site){
            buttonsPanel.add({
                xtype:'urlbutton',
                data:{
                    value:site
                }
            })
        }
        buttonsPanel.add({
            id:'pv_commentsBtn',
            xtype:'clickbutton',
            style:'border-top:0;',
            data:{
                value:'Добавить/Читать отзывы (' + record.get('com_count') + ')'
            }
        })
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
