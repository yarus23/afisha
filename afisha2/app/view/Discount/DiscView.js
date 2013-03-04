Ext.define('Afisha.view.Discount.DiscView', {
    extend: 'Ext.Container',
    xtype:'discview',
    requires:['Afisha.view.components.BackButton'],
    config: {
        controllerName:'Discount.DiscView',
        layout:'vbox',
        cls:'pageview discountView',
        items:[{
            xtype:'titlebar',
            title:'Скидки',
            items:[{
                xtype:'backbutton'   
            }]
        },{
            xtype:'panel',
            layout:'vbox',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            flex:1,
            style:'background-color:white',
            //cls:'viewer-body fontSized',
            items:[{
                xtype:'panel',
                items:[{
                    xtype:'favbutton',
                    //id:'favImg_disc',
                    cls:'fav-img'
                },{
                    xtype:'panel',
                    id:'disc_title',
                    cls:'viewer-body fontSized',
                    tpl: new Ext.XTemplate('<div class="header"><h1>{title}</h1></div>')
                }]
            },{
                xtype:'panel',
                id:'disc_descr',
                cls:'viewer-body fontSized',
                tpl: new Ext.XTemplate('<div style="padding:0.5em; font-style:bold;" class="short_info">{description}</div>')
            },{
                xtype:'photogallery',
                id:'disc_v_gallery',
                hidden:true
            },{
                xtype:'panel',
                layout:'hbox',
                id:'disc_buttons_cont'
            },{
                xtype:'panel',
                //layout:'vbox',
                id:'disc_price',
                cls:'viewer-body fontSized',
                items:[{
                    xtype:'panel',
                    layoout:'hbox',
                    items:[{
                        xtype:'panel',
                        docked:'left',
                        html: '<div class="discr_rice">Цена:</div>'
                    },{
                        xtype:'img',
                        height:'1em',
                        clas:'discr_dots',
                        src:'resources/dot.png'
                    },{
                        xtype:'panel',
                        id:'disc_price_val',
                        docked:'right',
                        tpl: new Ext.XTemplate('<div class="discr_price">{price}<div>')
                    }]
                }]
            },{
                xtype:'panel',
                //layout:'vbox',
                cls:'viewer-body fontSized',
                id:'disc_disc',
                items:[{
                    xtype:'panel',
                    layoout:'hbox',
                    items:[{
                        xtype:'panel',
                        docked:'left',
                        html: '<div class="discr_rice">Скидка:</div>'
                    },{
                        xtype:'img',
                        height:'1em',
                        clas:'discr_dots',
                        src:'resources/dot.png'
                    },{
                        xtype:'panel',
                        docked:'right',
                        id:'disc_disc_val',
                        tpl: new Ext.XTemplate('<div class="discr_price">{discount}<div>')
                    }]
                }]
            },{
                xtype:'panel',
                //layout:'vbox',
                id:'disc_save',
                style:'margin',
                cls:'viewer-body fontSized',
                items:[{
                    xtype:'panel',
                    layoout:'hbox',
                    items:[{
                        xtype:'panel',
                        docked:'left',
                        html:'<div class="discr_rice">Вы экономите:</div>'
                    },{
                        xtype:'img',
                        height:'1em',
                        clas:'discr_dots',
                        src:'resources/dot.png'
                    },{
                        xtype:'panel',
                        docked:'right',
                        id:'disc_save_val',
                        tpl: new Ext.XTemplate('<div class="discr_price">{save}<div>')
                    }]
                }]
            },{
                xtype:'img',
                src:'resources/Gray-Lenta.png',
                id:'disc_timeout',
                height:'4em',
                tpl: new Ext.XTemplate('<div><b>До конца акции осталось:</b></div><br/><div>{days} дней, {hours} часов, {minutes} минут</div>')
            },{
                xtype:'panel',
                id:'disc_text',
                cls:'viewer-body fontSized',
                tpl: new Ext.XTemplate('<div style="margin:0.5em;">{body}</div>')
            },{
                xtype:'panel',
                style: "margin:0.5em;",
                id:'disc_conditions',
                cls:'viewer-body fontSized',
                tpl: new Ext.XTemplate('<div style="font-size:1.1em; font-weight:bold; color:#606060;">УСЛОВИЯ</div><div >{cond}</div>')
            }]
        },{
            xtype:'actionsheet',
            style:'background-color:transparent; background-image:none; max-height:50%;padding:0;',
            hidden:true
        }]
    }
});