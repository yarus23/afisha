Ext.define('Afisha.view.CommentsView', {
    extend: 'Ext.Panel',
    xtype:'commentsview',
    requires:['Afisha.view.components.TopToolbar'],
    config: {
        controllerName:'Comments',
        layout:'vbox',
        items:[{
                xtype:'toptoolbar',
                style:'background-color: white;',
                title:'Комментарии'
            },{
            xtype:'dataview',
            style:'background-color: white;',
            cls:'newslist',
            allowDeselect: false,
            useComponents: false,
            loadingText:' ',
            scrollable: {
                direction: 'vertical',
            },
            itemCls:'newslistitem x-docking-horizontal',
            emptyText: '<div style="text-align:center; padding-top:50%; color:gray; margin: 0 1.7em;">Пока здесь нет ни одного комментария.</div>',
            plugins: null,
            store: 'Comments',
            flex: 1,
            itemTpl: new Ext.XTemplate(
                    '<div class="eventlist-item-block eventlist-item-image" style="height:{[this.eventListImgSize]}px;width:{[this.eventListImgSize]}px;background-repeat: no-repeat;background-position:center;background-size:contain;background-image:url(\'{user.photo}\')">',
                    '</div>',
                    '<div class="eventlist-item-block eventlist-textblock">',
                      '<div class="list-first-line">',
                         '<div class="list-item-title" style="width:{[Afisha.titleWidth]}px"><b>{user.full_Name}</b></div>',
                      '</div>',
                          '<div class="list-second-line event-description schedule-description"><div class="list-item-content">',
                              '<div class="event-where">{text}</div>',
                          '</div></div>',
                    '</div>'
//                '<div class="x-body x-inner x-data-item-inner x-layout-vbox" style="webkit-box-align:stretch;">',
//                    '<div class="x-innerhtml  newsListTitle">{user.full_Name}</div>',
//                    '<div class="x-innerhtml  newsListDescr">{text}</div>',
//                '</div>'
            )
        },{
            xtype:'button',
            id:'addComment',
            style:'border-radius:0; height:2.1em;',
            text:'Добавить'
            
        },{
            xtype:'panel',
            id:'sendCommentModal',
            hidden:true,
            modal: true,
            centered: true,
            width:'90%',
//            height:'90%',
            items:[{
                xtype:'fieldset',
                style:'margin:0',
                title:'Введите комментарий',
                items:[{
                    xtype:'textareafield',
                    maxRows:6,
                    id:'commentInput'
                },{
                    xtype:'panel',
                    style:'margin-top:2em',
                    defaults:{
                        xtype:'button',
                        style:'margin 0.5em',
                        flex:1
                    },
                    layout:'hbox',
                    items:[{
                        xtype:'button',
                        ui: 'confirm',
                        id:'sendCommentOk',
                        text:'Отправить'
                    },{
                        xtype:'button',
                        ui: 'decline',
                        id:'sendCommentCancel',
                        text:'Отмена'
                    }]
                }]
            }]
            

        }]
    }
});