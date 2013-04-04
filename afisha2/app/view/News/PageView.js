Ext.define('Afisha.view.News.PageView', {
    extend: 'Ext.Container',
    xtype:'pageview',
    requires:['Afisha.view.components.BackButton'],
    config: {
        controllerName:'News.PageView',
        layout:'vbox',
        cls:'pageview',
        items:[{
            xtype:'titlebar',
            title:'Новости',
            style:'background-color: white;',
            items:[{
                xtype:'backbutton'   
            }]
            },{
                xtype:'panel',
                id:'bodyContainer',
                flex:1,
                style:'background-color:white',
                scrollable: {
                    direction: 'vertical'
                },
                items:[{
                        xtype:'panel',
                        id:'nv_header',
                        //style:'padding-top:0.2em;',
                        cls:'viewer-body fontSized',
                        items:[{
                            xtype:'favbutton',
                            id:'favImgNews',
                            cls:'fav-img'
                        },{
                            xtype:'panel',
                            id:'nv_title',
                            tpl: new Ext.XTemplate('<div class="header"><h1>{title}</h1>')
                            //style:'font-size: 1.2em; font-weight: bold;padding-left:0.3em;'
                        }]
                    },{
                        xtype:'panel',
                        id:'body',
                        
                        //layout:'fit',
                        bodyOptions: null,
                        //masked:false,

                        cls:'viewer-body fontSized',
                        styleHtmlContent:true,
                        tpl: new Ext.XTemplate(
                            //'<div class="header"><h1>{title}</h1>',
                            '<tpl if="image && this.isNews(values.image)"><p align="center"><img style="display:none;" onload="this.style.setProperty(\'display\',\'block\');" class="title-img" src="http://afisha.mikhelev.ru/{image}"></img></p></tpl>',
                            '<div class="date-time">{date:date("j.n.Y H:i")}</div></div>',
                            '<div class="footer">{body}</div>',
                            {
                                isNews:function(image){
                                    if (image.search('gazeta') != -1)
                                        return false;
                                    else
                                        return true;
                                }
                            }
                        )
                }]
            }]
    }
});