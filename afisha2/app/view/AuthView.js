Ext.define('Afisha.view.AuthProvidersPanel', {
    extend: 'Ext.Panel',
    xtype: 'authproviderspanel',
    cls: 'auth-providerspanel',
    config: {
        defaults: {
            style: {
                margin: window.innerWidth * 0.05 + 'px',
                marginLeft: '0px',
                height: window.innerWidth * 0.8 / 3 + 'px'
            },
            layout: 'hbox',
            width: '100%',
            defaults: {
                style: {
                    margin: window.innerWidth * 0.025 + 'px',
                    width: window.innerWidth * 0.8 * 0.9 / 3 + 'px',
                    height: window.innerWidth * 0.8 / 3 + 'px'
                },
                listeners: {
                    initialize: function () {
                        var me = this;
                        this.element.on('tap', function () {
                            var authController = me.up('authview').config.controller;
                            authController.prov_image = this.down('img').getAttribute('src'); //fixme
                            authController.onButtonTap(me, me.config.provider_index);
                        });
                    }
                }
            }
        },
        items: [
            {
                items: [
                    {
                        html: '<img src="resources/icons/social/iko_1.png" width="100%"></img>',
                        provider_index: 0
                    },
                    {
                        html: '<img src="resources/icons/social/iko_2.png" width="100%"></img>',
                        provider_index: 2
                    },
//                    {
//                        html: '<img src="resources/icons/social/iko_3.png" width="100%"></img>',
//                        provider_index: 1
//                    }
                ]
            },
            {
                items: [
                    {
                        html: '<img src="resources/icons/social/iko_4.png" width="100%"></img>',
                        provider_index: 5
                    },
//                    {
//                        html: '<img src="resources/icons/social/iko_5.png" width="100%"></img>',
//                        provider_index: 3
//                    },
                    {
                        html: '<img src="resources/icons/social/iko_6.png" width="100%"></img>',
                        provider_index: 4
                    }
                ]
            }
        ]
    }
});

Ext.define('Afisha.view.AuthView', {
    extend: 'Ext.Panel',
    xtype: 'authview',
    cls: 'auth-view',
    config: {
        modal: true,
        centered: true,
        style: {
            padding: '0px',
            backgroundColor: 'white'
        },
        width: '60%',
        items: [
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        flex: 1
                    },
                    {
                        xtype: 'button',
                        iconCls: 'delete',
                        ui: 'decline-round',
                        iconMask: true,
                        handler: function (el) {
                            el.up('authview').hide();
                        }
                    }
                ]
            },
            {
                style: 'text-align: center; font-size: 80%;',
                html: 'Войдите через учетную запись своей социальной сети и получите дополнительные возможности'
            },
            {
                xtype: 'authproviderspanel'
            }
        ]
    }
});