Ext.define('Afisha.controller.AfishaC.EventView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            header:'aviewport eventview panel#ev_header',
            buttons:'aviewport eventview panel#ev_buttons',
            photogallery: 'aviewport eventview photogallery',
            schList: 'aviewport eventview schedulelist'
        },
    },
    initView:function(record){
        this.getHeader().setRecord(record);
        this.checkButtonsFields(record);
        this.collectImages(record);
        this.getSchList().bindScheduleData(record.get('id'),null,true);
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
