Ext.define('Afisha.controller.AfishaC.EventView', {
    extend: 'Ext.app.Controller',

    config: {
        currentType:'',
        currentRecord:null,
        refs: {
            viewport: 'aviewport',
            selectfield:'aviewport eventview toolbar selectfield',
            title:'aviewport eventview panel#ev_header panel#ev_title',
            genre:'aviewport eventview panel#ev_genre',
            rateCount:'aviewport eventview panel#ev_header panel#ev_rate_count',
            rateImg:'aviewport eventview panel#ev_header img',
            buttons:'aviewport eventview panel#ev_buttons',
            photogallery: 'aviewport eventview photogallery',
            schList: 'aviewport eventview schedulelist',
            footer: 'aviewport eventview panel#ev_footer'
        },
        control:{
            selectfield:{
                change:'onSelectChange'
            },
            eventview:{
                show:'onEVShowTimeOut'
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
        this.getSchList().bindScheduleData(this.getCurrentRecord().get('id'),date,true);
        this.onEVShow();
    },
    onEVShowTimeOut:function(){
        var me = this;
        setTimeout(function(){
            me.onEVShow();
        },200)
    },
    onEVShow:function(){
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
        //Ext.getStore('Settings').load();
//        console.log(record);
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
        //this.checkButtonsFields(record);
        this.collectImages(record);
        record.set('type',type);
        this.getFooter().setRecord(record);
        
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
            this.getSchList().bindScheduleData(record.get('id'),null,true);
            cnt = 1;
        } else if (options.schSelectDefType == null){
            cnt = this.getSchList().bindScheduleData(record.get('id'),null,true);
            select.setValue('full')
        } else if (options.schSelectDefType == 'week'){
            cnt = this.getSchList().bindScheduleData(record.get('id'),'week',true);
            select.setValue('week')
        } else {
            cnt = this.getSchList().bindScheduleData(record.get('id'),new Date(),true);
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
        //genre
        var genre_el = this.getGenre();
        genre_el.setHtml('');
        var genre = record.get('genre');
        var runtime = record.get('runtime');
        var res = genre ? genre : '';
        res += runtime ? (' (' + runtime + ' мин.)') : '';
        genre_el.setHtml(res);
    },
    checkButtonsFields:function(record){
        var buttonsPanel = this.getButtons();
        buttonsPanel.removeAll();
        buttonsPanel.add({
            id:'ev_commentsBtn',
            xtype:'clickbutton',
            style:'border-top:0;',
            data:{
                value:'Добавить/Читать отзывы (' + record.get('com_count') + ')'
            }
        })
    },
    collectImages:function(record){
        var previewList = [];
        var pictureList = [];
        //var cat = record.category?record.category:record.type;
        var urlBody = Global.img_url;
        var previewBody = "http://mobile.afisha-uu.ru/img/get_image/?path=";
        var heightParam = "&height=" + Afisha.gf.getEmToPxHeight(10);
        //image
        var tmp = record.get('poster');
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
            previewList.push(previewBody + tmp[i][0] + heightParam);
        }
        var pg = this.getPhotogallery();
        pg.loadPictureList(pictureList,previewList);
    },
    goBack: function() {
        return false;
    }
})
