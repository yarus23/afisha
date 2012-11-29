Afisha.views.Share = Ext.extend(Ext.form.FormPanel, {
    id: 'Share',
    cls:'sharePanel',
    scroll:'vertical',
    items:[
            {
                html: 'Расскажите об Афише друзьям:'
            },
            {
                xtype: 'socialPanel',id:'sp_share_eml', sms: true, email: true
            },
            {
                xtype: 'socialPanel',id:'sp_share'
            },
            {
                xtype:'panel',
                id: 'hrefs_panel',
                html: '<a class="social-href" href="'+share_links.vkontakte+'"></a><a class="social-href" href="'+share_links.facebook+'"></a><a class="social-href" href="'+share_links.twitter+'"></a><a class="social-href" href="'+share_links.sms+'"></a><a class="social-href" href="'+share_links.email+'"></a>'
            },
            {
                html: 'Мы в интернете: <a href="http://i.MySlo.ru">http://i.MySlo.ru</a>'
            }
    ],
   dockedItems:[{
            xtype:'toolbar',
            ui:g_ui,
            title:Afisha.showButtons?'':'Расшарить',
            items: [!Afisha.showButtons?{xtype:'spacer'}:{xtype:'backbtn',text:'На главную'},
                { xtype: 'spacer' }
            ],
            height:'2.2em'
           }],

    initComponent: function() {
        Afisha.views.SendNews.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('Share', Afisha.views.Share);
