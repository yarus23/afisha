Afisha.views.ShareRegard = Ext.extend(Afisha.views.SharePanelWithBackButton, {
    id: 'ShareRegard',
    cls: 'shareRegardPanel',
    items: [
        {
		cls: 'text texttop',
            html: 'Если вам понравилось приложение - поставьте пять баллов и напишите хороший отзыв на ' + ( Ext.is.iOS == true ? "AppStore" : "Маркете" )
        },
        {
            xtype: 'detailsButtonsListForShareFriends', 
            id: 'dblShareRegard1',
            hrefs_box: 'hrefs_panel1',
            items: [
                {
                    data: {
                        title: Ext.is.iOS == true ? 'Перейти на AppStore' : 'Перейти на Андроид Маркет'
                    },
                    link_index: 0
                }
            ]
        },
        {
		cls: 'text',
            html: 'Нашли ошибку - напишите разработчикам и получите исправленную версию!'
        },
        {
            xtype: 'detailsButtonsListForShareFriends', 
            id: 'dblShareRegard2',
            hrefs_box: 'hrefs_panel1',
            items: [
                {
                    data: {
                        icon_title: 'Mail-blue-36.png',
                        title: 'Отправить письмо'
                    },
                    link_index: 1,
		    not_external: true
                }
            ]
        },
        {
            xtype:'panel',
            cls: 'hrefs_panel',
            height: 0,
            id: 'hrefs_panel1',
            html: '<a class="social-href" href="' + ( link ) + '"></a><a class="social-href" href="mailto:ftech@tula.net,pvk1978@gmail.com?subject=Ошибка в приложении Afisha для Android&body=Привет, я нашел ошибку!"></a>'
        }
    ],
    initComponent: function() {
        Afisha.views.ShareRegard.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('ShareRegard', Afisha.views.ShareRegard);

