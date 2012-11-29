Afisha.views.galleryView = Ext.extend(Ext.Panel, {
    cls:'galleryView',
    scroll:false,
    layout: {
        type:'hbox',    
        align:'stretch'
    },
    height:'10em',
    items:[{
            xtype:'toolbar',
            width:'0.5em',
            height:'100%',
            cls:'galleryToolbar',
            style:'border-left: #b3b3b3;'
    },{
            xtype    : 'myCarousel',
            itemId:'galCarousel',
            flex:1,
            direction: 'horizontal',
            preview: true
    },{
            xtype:'toolbar',
            width:'0.5em',
            height:'100%',
            cls:'galleryToolbar',
            style:'border-right: #b3b3b3;'
    }],
    lifeCtegories:['beauty','fitnes','medic','stomotolog'],
    bindData:function(record){
        if (!isOnline())
        {
            this.hide();
            return;
        }
        var pictureList = [];
        var cat = record.category?record.category:record.type;
        var urlBody = server_url;
        //films -> event
        if (record.poster && (record.poster instanceof Array) && record.poster.length)
        {
            for (var idx = 0; idx < record.poster.length; idx++)
            {
                pictureList.push(urlBody + record.poster[idx]);
            }
        }
        //logo for restaurant
        /*
        if (record.logo && record.logo.length)
        {
            pictureList.push(urlBody + record.logo);
        }*/
        if (record.screenshot && (record.screenshot instanceof Array) && record.screenshot.length)
        {
            for (var idx = 0; idx < record.screenshot.length; idx++)
            {
                if (record.screenshot[idx].json)
                    pictureList.push(urlBody + record.screenshot[idx].json[0]);
                else
                    pictureList.push(urlBody + record.screenshot[idx][0]);
            }
        }        
        //image
        if (record.image && (record.image instanceof Array) && record.image.length)
        {
            for (var idx = 0; idx < record.image.length; idx++)
            {
                if (record.image[idx].json)                                                   //hello yql
                    pictureList.push(urlBody + record.image[idx].json[0]);
                else
                    pictureList.push(urlBody + record.image[idx][0]);
            }
        }
        
        if (pictureList.length)
        {
            //bind pictures to carousel
            var el = this.down('#galCarousel');
            this.show();
            el.bindData(pictureList);
        }
        else
            this.hide();
    },
    initComponent: function() {
        Afisha.views.galleryView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('galleryView', Afisha.views.galleryView);
/*
    cinema:
    {
        films:
        {
            "poster":["/nafisha/pictures/film/513/kinopoisk.ru-Fright-Night-1560114.jpg"],
            "screenshot":[],
        },
        places:
        {
            "image":"" - not use
        }
    }

    club:
    {
        events:
        {
            "poster":[],
            "screenshot":[]
        }
        places:
        {
            "image":[
                        [
                            "/nafisha/pictures/club/20/kaz1.jpg",
                            "/nafisha/pictures/club/20/pr_kaz1.jpg"
                        ],
                    ]
        }
    }

    concert, theatre:
    {
        events:
        {
            "poster":[],
            "screenshot":[]
        }
        places:
        {
            "image":[]
        }
    }
    
    restaurant:
    {
        places:
        {
            "logo":"/nafisha/pictures/restaurant/221/logo.jpg",
            "image":[]
        }
    }
 **/