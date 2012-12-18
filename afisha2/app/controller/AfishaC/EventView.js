Ext.define('Afisha.controller.AfishaC.EventView', {
    extend: 'Ext.app.Controller',

    config: {
        currentType:'',
        refs: {
            viewport: 'aviewport',
            selectfield:'aviewport eventview toolbar selectfield',
            title:'aviewport eventview panel#ev_header panel#ev_title',
            rateCount:'aviewport eventview panel#ev_header panel#ev_rate_count',
            rateImg:'aviewport eventview panel#ev_header img',
            buttons:'aviewport eventview panel#ev_buttons',
            photogallery: 'aviewport eventview photogallery',
            schList: 'aviewport eventview schedulelist',
            footer: 'aviewport eventview panel#ev_footer'
        },
    },
    initView:function(record){
        var type = Ext.getStore('Places').getCurrentType();
        this.setCurrentType(type);
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
        var pictureList = [];
        //var cat = record.category?record.category:record.type;
        var urlBody = Global.server_url;
        //image
        var tmp = record.get('image');
        if (tmp && (tmp.image instanceof Array) && tmp.length)
        {
            for (var idx = 0; idx < tmp.length; idx++)
            {
                if (tmp[idx].json)                                                   //hello yql
                    pictureList.push(urlBody + tmp[idx].json[0]);
                else
                    pictureList.push(urlBody + tmp[idx][0]);
            }
        }
        ///////////debug!!!!
        pictureList.push("http://img.lenta.ru/news/2012/12/12/recognize/picture.jpg","http://img.lenta.ru/news/2012/11/13/backs/picture.jpg");
        ///////////////
        var pg = this.getPhotogallery();
        pg.loadPictureList(pictureList);

    },
    goBack: function() {
        return false;
    }
})
