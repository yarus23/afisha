Ext.define('Afisha.view.Discount.DiscList', {
    extend: 'Ext.Panel',
    xtype:'disclist',
    requires:[
        'Afisha.view.components.TopToolbar',
        'Afisha.view.components.DiscListItem',
        'Ext.plugin.PullRefresh',
        'Ext.plugin.ListPaging'
    ],
    config: {
        controllerName:'Discount.DiscList',
        layout:'vbox',
        items:[{
                xtype:'toptoolbar',
                style:'background-color:white;',
                title:'Скидки'
            },{
            xtype:'segmentedbutton',
            id:'disc_catlist',
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
                rub_id:"all"
            }]
        },{
            //defaultType:'newslistitem',
            xtype:'list',
            id:'disclist',
            cls:'newslist',
            style:'background-color:white',
            allowDeselect: false,
            useComponents: false,
            loadingText:' ',
            emptyText: '<div style="position:absolute;left:50%;top:50%;margin-left:-3em;color:gray">Список пуст</div>',
            //emptyText:'Список пуст...',
            //defaultType  : 'disclistitem',
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
            store:'DiscList',
            //<div class="x-img x-docked-left newsListImage" style="width: {[this.listImgSize]}px;height: {[this.listImgSize]}px;background-image:url(http://www.tula.rodgor.ru/pictures/news/{rid}/picture-{[this.listImgSize]}h.jpg)"></div>
            itemTpl:'<div class="avatar x-img"style="width:{[this.newsListImgSize]}px;height:{[this.newsListImgSize]}px;background-size: cover;background-image:url({[Global.img_url + "img/get_image/?path=" + values.image + "&width=" + this.newsListImgSize + "&height=" + this.newsListImgSize]})" ></div><div class="list-vertical"><div class="newsListTitle">{title}</div><div class="newsListDescr">{description}</div></div>'
        }]
    }
});
