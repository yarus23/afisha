Afisha.views.ShareAbout = Ext.extend(Afisha.views.SharePanelWithBackButton, {
    id: 'ShareAbout',
    cls: 'shareAboutPanel',
    items: [
        {
		cls: 'text texttop',
            style:'margin-bottom:1em',
            html: 'Приложение «' + G.app_name + '» разработано по заказу Индустрии отдыха.'
        },
        {
		cls: 'text',
            style:'font-size:smaller',            
            html: 'Если вы хотите разместить или уточнить информацию о своем заведении,'
        },
        {
            xtype: 'detailsButtonsListForShareFriends', 
            id: 'dblShareAbout1',
            hrefs_box: 'hrefs_panel3',
            items: [
                {
                    data: {
                        icon_title: 'Mail-blue-36.png', 
                        title: 'Сообщите нам'
                    },
                    link_index: 0,
		    not_external: true
                }
            ]
        },
        {
		cls: 'text',
            style:'font-size:smaller',
            html: 'Если вы вы хотите запустить Такое же приложение в своем городе,'
        },
        {
            xtype: 'detailsButtonsListForShareFriends', 
            id: 'dblShareAbout2',
            hrefs_box: 'hrefs_panel3',
            items: [
                {
                    data: {
                        icon_title: 'Mail-blue-36.png', 
                        title: 'Мы вам поможем!'
                    },
                    link_index: 1,
		    not_external: true
                }
            ]
        },
        {
		cls: 'text',
            style:'font-size:smaller',
            html: 'Компания разработчик приложения «Здесь и Сейчас» - профессиональная команда программистов. Разработает для вас приложения под iPhone, iPad, Aтdroid, Windows Phone 7, Bada, RIM, Symbian.'
        },
        {
            xtype: 'detailsButtonsListForShareFriends', 
            id: 'dblShareAbout3',
            hrefs_box: 'hrefs_panel3',
            items: [
                {
                    data: {
                        icon_title: 'Mail-blue-36.png', 
                        title: 'Связаться с разработчиками'
                    },
                    link_index: 2,
		    not_external: true
                }
            ]
        },
        {
            xtype:'panel',
            cls: 'hrefs_panel',
            height: 0,
            id: 'hrefs_panel3',
            html: '<a class="social-href" href="mailto:zab2006@mail.ru,ftech@tula.net?subject=Информация о заведении.&body=Здравствуйте,"></a><a class="social-href" href="mailto:pvk1978@gmail.com,ftech@tula.net?subject=Запуск приложения в другом городе.&body=Здравствуйте,"></a><a class="social-href" href="mailto:ftech@tula.net,pvk1978@gmail.com?subject=Разработчикам.&body=Здравствуйте,"></a>'
        }
    ],
    initComponent: function() {
        Afisha.views.ShareAbout.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('ShareAbout', Afisha.views.ShareAbout);