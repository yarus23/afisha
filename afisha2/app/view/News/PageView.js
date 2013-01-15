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
            items:[{
                xtype:'backbutton'   
            },{
                xtype:'favbutton'
            }]
            },{
                xtype:'panel',
                id:'body',
                flex:1,
                //layout:'fit',
                bodyOptions: null,
                //masked:false,
                scrollable: {
                    direction: 'vertical'
                },
                cls:'viewer-body',
                styleHtmlContent:true,
                tpl: new Ext.XTemplate(
                    '<div class="header"><h1>{title}</h1>',
                    '<tpl if="image && this.isNews(values.image)"><p align="center"><img style="display:none;" onload="this.style.setProperty(\'display\',\'block\');" class="title-img" src="http://www.tula.rodgor.ru/pictures/news/{rid}/picture-{[this.bodyWidth]}h.jpg"></img></p></tpl>',
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
    }
});