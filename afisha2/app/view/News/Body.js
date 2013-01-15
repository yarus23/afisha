Ext.define('News.view.viewer.Body', {
    extend: 'Ext.Panel',
    xtype:'body',
    config: {
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
        listeners: {
            swipe: {
                element: 'element',
                fn: function(evt, node,ops,eOpts) {
                    //News.app.dispatch({action:'onBodySwipe',controller:'Main',args:[evt.direction]},false)
                }
            },
            tap: {
                element: 'element',
                fn: function(el) {
//                    if (el.target.tagName.toUpperCase() != "A")
//                        News.app.dispatch({action:'onBodyTap',controller:'Main'},false)
                    //else if (el.target.className == 'internalLink')
                    //    News.app.dispatch({action:'onInternalHrefTap',controller:'Main',args:[el.target.getAttribute('type'),el.target.getAttribute('rid')]},false)
                }
            }
        }
    }
});