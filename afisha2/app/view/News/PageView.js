Ext.define('News.view.viewer.PageView', {
    extend: 'Ext.Container',
    xtype:'pageview',
    config: {
        layout:'vbox',
        cls:'pageview',
        items:[{
                xtype:'toolbar',
                dock:'top',
                items:[{
                    ui:'back',
                    cls:'backButton',
                    text:'Назад',
                    handler:function(){
                        News.app.dispatch({action:'onBackTap',controller:'Main'},false)
                    },
                },{
                    xtype: 'spacer'
                },{
                    xtype:'panel',
                    id:'swipeControlPanel',
                    layout:'hbox',
                    items:[{
                        xtype:'panel',
                        id:'recordsCounter',
                        tpl:new Ext.XTemplate('{index}/{count}')
                    },{
                        xtype:'button',
                        iconCls: 'arrow_left',
                        cls:'segmented-left top-toolbar-buttons',
                        iconMask: true,
                        handler:function(){
                            News.app.dispatch({action:'onBodySwipe',controller:'Main',args:['right']},false)
                        }
                    },{
                        xtype:'button',
                        handler:function(){
                            News.app.dispatch({action:'onBodySwipe',controller:'Main',args:['left']},false)
                        },
                        cls:'segmented-right top-toolbar-buttons',
                        iconCls: 'arrow_right',
                        iconMask: true
                    }]
                }]
        },{
            xtype:'container',
            cls:'body-container',
            layout:'card',
            flex:1,
            items:[{
                xtype:'body',
                //flex:1,
                scrollable: 'vertical'
            },{
                xtype:'panel',
                cls:'body-load',
                scrollable:false,
                masked:{
                    xtype:'loadmask',
                    message:'Загрузка...'
                }
                
            }]
        },{
            xtype:'toolbar',
            cls:'page-view-buttons-bar',
            dock:'bottom',
            layout:{
                pack:'center'
            },
            height:'3em',
            items:[{
                id:'addFav',
                cls:'toolbar-button',
                docked:'left',
                iconCls: 'fav-icon',
                iconMask: true
            },{
                id:'plusFont',
                cls:'segmented-left',
                iconCls: 'font-plus-icon',
                iconMask: true
            },{
                id:'minusFont',
                cls:'segmented-right',
                iconCls: 'font-minus-icon',
                iconMask: true
            },{
                id:'share',
                cls:'toolbar-button',
                docked:'right',
                iconCls: 'share',
                iconMask: true
            }]
        }]
    }
});