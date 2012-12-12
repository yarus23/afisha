Ext.define('Afisha.controller.AfishaC.PlaceView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            header:'aviewport placeview panel#pv_header',
            buttons:'aviewport placeview panel#pv_buttons',
            photogallery: 'aviewport placeview photogallery',
            schList: 'schedulelist'
        },
    },
    initView:function(record){
        console.log(record)
        this.getHeader().setRecord(record);
        this.checkButtonsFields(record);
        this.collectImages(record);
        this.getSchList().bindScheduleData(record.get('id'),null);
        console.log(Afisha.schMethods.getSchedule(null, record.get('id'), false))
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
                    value:address
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
            id:'commentsBtn',
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
