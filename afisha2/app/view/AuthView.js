Ext.define('Afisha.view.AuthView', {
    extend: 'Ext.Panel',
    xtype: 'authview',
    cls: 'auth-socialpanel',
    defaults: {
        modal: true,
        cls: 'auth-socialpanel-hbox',
        style: 'margin: ' + window.innerWidth * 0.05 + 'px;',
        layout: 'hbox',
        width: '100%',
        height: window.innerWidth * 0.8 / 3 + 'px',
        defaults: {
            cls: 'auth-socialpanel-button',
            style: 'margin: ' + window.innerWidth * 0.025 + 'px;',
            width: window.innerWidth * 0.8 * 0.9 / 3 + 'px',
            height: window.innerWidth * 0.8 / 3 + 'px',
            listeners: {
                click: {
                    element: 'el',
                    fn: function () {
                        var me = this;
                        var provider_index = Ext.ComponentMgr.get(me.id).provider_index;
                        Afisha.Auth.prov_image = me.down('img').getAttribute('src'); // it's not good
                        Afisha.Auth.login(provider_index);
                    }
                }
            }
        }
    },
    items: [
        {
            items: [
                {
                    html: '<img src="config/resources/icons/social/iko_1.png" width="100%"></img>',
                    provider_index: 0
                },
                {
                    html: '<img src="config/resources/icons/social/iko_2.png" width="100%"></img>',
                    provider_index: 2
                },
                {
                    html: '<img src="config/resources/icons/social/iko_3.png" width="100%"></img>',
                    provider_index: 1
                }
            ]
        },
        {
            items: [
                {
                    html: '<img src="config/resources/icons/social/iko_4.png" width="100%"></img>',
                    provider_index: 5
                },
                {
                    html: '<img src="config/resources/icons/social/iko_5.png" width="100%"></img>',
                    provider_index: 3
                },
                {
                    html: '<img src="config/resources/icons/social/iko_6.png" width="100%"></img>',
                    provider_index: 4
                }
            ]
        }
    ]
});