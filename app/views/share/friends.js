Afisha.views.ShareFriends = Ext.extend(Afisha.views.SharePanelWithBackButton, {
    id: 'ShareFriends',
    cls: 'shareFriendsPanel',
    fullscreen: true,
    onResult: function (data) {
    //    data == 'ok' ? Ext.Msg.alert(G.app_name, 'Сообщение отправлено.') : '';
    },
    items: [
        {
			cls: 'text texttop',
            html: 'Пригласите друзей в «' + G.app_name + '»! Им понравится!'
        },
        {
            xtype: 'detailsButtonsListForShareFriends', 
            id: 'dblShareFriends',
            hrefs_box: 'hrefs_panel2',
            items: [
            {
                data: {
                    icon_title: 'Sms-blue-36.png', 
                    title: 'SMS'
                },
                style: Ext.is.iOS == true ? 'display: none;' : '',
                link_index: 0,
				not_external: true
            },
            {
                data: {
                    icon_title: 'Mail-blue-36.png', 
                    title: 'E-mail'
                },
                link_index: 1,
				not_external: true
            },
            {
                data: {
                    icon_title: 'vkontakte.png', 
                    title: 'ВКонтакте'
                },
                provider_index: 0,
                index: 0
            },
            {
                data: {
                    icon_title: 'facebook.png', 
                    title: 'Facebook'
                },
                index: 1,
                provider_index: 2
            },
            {
                data: {
                    icon_title: 'twitter.png', 
                    title: 'Twitter'
                },
                provider_index: 5,
                index: 2
            }
            ]
        },
        {
            xtype:'panel',
            cls: 'hrefs_panel',
            height: 0,
            id: 'hrefs_panel2',
            html: '<a class="social-href" href="'+share_links.sms+'"></a><a class="social-href" href="'+share_links.email+'"></a>'
        }
    ],
    initComponent: function() {
        Afisha.views.ShareFriends.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('ShareFriends', Afisha.views.ShareFriends);