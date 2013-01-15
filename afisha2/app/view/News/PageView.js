Ext.define('Afisha.view.News.PageView', {
    extend: 'Ext.Container',
    xtype:'pageview',
    requires:['Afisha.view.components.TopToolbar'],
    config: {
        controllerName:'News.PageView',
        layout:'vbox',
        cls:'pageview',
        items:[{
            xtype:'toptoolbar',
            title:'Новости'
            },{
            xtype:'container',
            cls:'body-container',
            layout:'card',
            flex:1,
            items:[{
                xtype:'panel',
                id:'body',
                layout:'fit',
                bodyOptions: null,
                masked:false,
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
                ),
                //flex:1,
                scrollable: {
                    direction: 'vertical',
//                    directionLock: true
                },
            },{
                xtype:'panel',
                cls:'body-load',
                scrollable:false,
                masked:{
                    xtype:'loadmask',
                    message:'Загрузка...'
                }
                
            }]
        }]
    }
});