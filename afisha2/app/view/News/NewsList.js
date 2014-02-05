Ext.define('Afisha.view.News.NewsList', {
    extend: 'Ext.Panel',
    xtype:'newslist',
    requires:[
        'Afisha.view.components.TopToolbar',
        'Afisha.view.components.NewsListItem',
        'Ext.plugin.PullRefresh',
        'Ext.plugin.ListPaging'
    ],
    config: {
        controllerName:'News.NewsList',
        layout:'vbox',
        style:'background-color:white;',
        items:[{
            xtype:'toptoolbar',
            style:'background-color: white;',
            title:'Новости'
            },{
            xtype:'segmentedbutton',
            id:'catlist',
            hidden:true,
            allowDepress: false,
            allowMultiple: false,
            cls:'categories-list',
            scrollable: {
                direction: 'horizontal',
                indicators: false
            },            
            items:[{
                    xtype:'img',
                    height:'0.35em',
                    src:'resources/catl_i.png',
                    cls:'img-border',
                    //style:'border 1 px solid red; height:1em;',
                    docked:'top'
            },{
                    xtype:'img',
                    height:'0.3em',
                    src:'resources/catl.png',
                    cls:'img-border',
                    style:'margin-bottom: -0.1em;',
                    docked:'bottom'
            },{
                text:'Все',
                pressed:true,
                rub_id:"all"
            }]
        },{
            //defaultType:'newslistitem',
            xtype:'list',
            id:'newslist',
            cls:'newslist',
            style:'background-color:white',
            allowDeselect: false,
            useComponents: false,
            loadingText:' ',
            emptyText: '<div style="position:absolute;left:50%;top:50%;margin-left:-3em;color:gray">Список пуст</div>',
            //emptyText:'Список пуст...',
            //defaultType  : 'newslistitem',
            scrollable: {
                direction: 'vertical',
            },

            itemCls:'newslistitem',// x-docking-horizontal',
            plugins: [
                {
                    xclass: 'Ext.plugin.PullRefresh',
                    pullRefreshText: 'Потяните, чтобы обновить',
                    releaseRefreshText: 'Отпустите, чтобы обновить',
                    loadingText: 'Загрузка...',
                    pullTpl: new Ext.XTemplate(
                        '<div class="x-list-pullrefresh">',
                            '<div class="x-list-pullrefresh-arrow"></div>',
                            '<div class="x-loading-spinner">',
                                '<span class="x-loading-top"></span>',
                                '<span class="x-loading-right"></span>',
                                '<span class="x-loading-bottom"></span>',
                                '<span class="x-loading-left"></span>',
                            '</div>',
                            '<div class="x-list-pullrefresh-wrap">',
                                '<h3 class="x-list-pullrefresh-message">{message}</h3>',
                                '<div class="x-list-pullrefresh-updated">Последнее обновление: <span>{lastUpdated:date("m/d/Y h:iA")}</span></div>',
                            '</div>',
                        '</div>'
                    )
                },
                {
                    type: 'listpaging',
                    autoPaging: true,
                    loadMoreText:'Загрузка...',
                    noMoreRecordsText:'Больше записей нет!'
                }
            ],
            flex:1,
            disableSelection:true,
            store:'NewsList',
            itemTpl:'<div class="avatar x-img"style="width:{[this.newsListImgSize]}px;height:{[this.newsListImgSize]}px;background-size: cover;<tpl if="values && values.image">background-image:url({[Global.img_url + "img/get_image/?path=" + values.image + "&width=" + this.newsListImgSize + "&height=" + this.newsListImgSize]})</tpl>" ></div><div class="list-vertical"><div class="newsListTitle">{title}</div><div class="newsListDescr">{description}</div></div>'
            //type:'news',
//            itemTpl: new Ext.XTemplate(
//                '<div class="x-img x-docked-left newsListImage" style="width: {[this.listImgSize]}px;height: {[this.listImgSize]}px;background-image:url(http://www.tula.rodgor.ru/pictures/news/{rid}/picture-{[this.listImgSize]}h.jpg)"></div>',
//                '<div class="x-body x-inner x-data-item-inner x-layout-vbox" style="webkit-box-align:stretch;">',
//                    '<div class="x-innerhtml  newsListTitle">{title}</div>',
//                    '<div class="x-innerhtml  newsListDescr">{descr}</div>',
//                    '<div class="ListItemInfo">{date:date("j.n.Y H:i")}</div>',
//                '</div>'
//            )
        }]
    }
});


/*
Ext.define('Afisha.view.News.NewsList', {
    extend: 'Ext.Panel',
    xtype:'newslist',
    requires:['Afisha.view.components.TopToolbar'],
    config: {
        controllerName:'News.NewsList',
        layout:'vbox',
        items:[{
            xtype:'toptoolbar',
            title:'Новости'
            },{
            xtype:'segmentedbutton',
            id:'catlist',
            allowDepress: false,
            allowMultiple: false,
            cls:'categories-list',
            scrollable: {
                direction: 'horizontal',
                indicators: false
            },            
            items:[{
                    xtype:'img',
                    height:'0.3em',
                    src:'resources/catl_i.png',
                    cls:'img-border',
                    //style:'border 1 px solid red; height:1em;',
                    docked:'top'
            },{
                    xtype:'img',
                    height:'0.3em',
                    src:'resources/catl.png',
                    cls:'img-border',
                    style:'margin-bottom: -0.1em;',
                    docked:'bottom'
            },{
                text:'Все',
                pressed:true,
                rub_id:0
            },{
                text:'Криминал',
                rub_id:6
            },{
                text:'Транспорт',
                rub_id:35
            },{
                text:'Спорт',
                rub_id:9
            },{
                text:'Политика',
                rub_id:3
            },{
                text:'Народный журналист',
                rub_id:40
            },{
                text:'Новости MySLO.ru',
                rub_id:12
            },{
                text:'Технологии',
                rub_id:37
            },{
                text:'Культура',
                rub_id:8
            },{
                text:'Медицина',
                rub_id:11
            },{
                text:'Мнения',
                rub_id:33
            },{
                text:'Недвижимость',
                rub_id:36
            },{
                text:'Музыка',
                rub_id:24
            }]
        },{
            //defaultType:'newslistitem',
            xtype:'dataview',
            id:'newslist',
            cls:'newslist',
            style:'background-color:white',
            allowDeselect: false,
            useComponents: false,
            loadingText:' ',
            emptyText: '<div style="position:absolute;left:50%;top:50%;margin-left:-3em;color:gray">Список пуст</div>',
            //emptyText:'Список пуст...',
            scrollable: {
                direction: 'vertical',
            },

            itemCls:'newslistitem x-docking-horizontal',
//            plugins: [
//                {
//                    xclass: 'Ext.plugin.PullRefresh',
//                    pullRefreshText: 'Потяните, чтобы обновить',
//                    releaseRefreshText: 'Отпустите, чтобы обновить',
//                    loadingText: 'Загрузка...',
//                    pullTpl: new Ext.XTemplate(
//                        '<div class="x-list-pullrefresh">',
//                            '<div class="x-list-pullrefresh-arrow"></div>',
//                            '<div class="x-loading-spinner">',
//                                '<span class="x-loading-top"></span>',
//                                '<span class="x-loading-right"></span>',
//                                '<span class="x-loading-bottom"></span>',
//                                '<span class="x-loading-left"></span>',
//                            '</div>',
//                            '<div class="x-list-pullrefresh-wrap">',
//                                '<h3 class="x-list-pullrefresh-message">{message}</h3>',
//                                '<div class="x-list-pullrefresh-updated">Последнее обновление: <span>{lastUpdated:date("m/d/Y h:iA")}</span></div>',
//                            '</div>',
//                        '</div>'
//                    )
//                },
//                {
//                    type: 'listpaging',
//                    autoPaging: true,
//                    loadMoreText:'Загрузка...',
//                    noMoreRecordsText:'Больше записей нет!'
//                }
//            ],
            flex:1,
            disableSelection:true,
            store:'NewsList',
            //type:'news',
            itemTpl: new Ext.XTemplate(
                '<div class="x-img x-docked-left newsListImage" style="width: {[this.listImgSize]}px;height: {[this.listImgSize]}px;background-image:url(http://www.tula.rodgor.ru/pictures/news/{rid}/picture-{[this.listImgSize]}h.jpg)"></div>',
                '<div class="x-body x-inner x-data-item-inner x-layout-vbox" style="webkit-box-align:stretch;">',
                    '<div class="x-innerhtml  newsListTitle">{title}</div>',
                    '<div class="x-innerhtml  newsListDescr">{descr}</div>',
                    '<div class="ListItemInfo">{date:date("j.n.Y H:i")}</div>',
                '</div>'
            )
        }]
    }
});
 **/