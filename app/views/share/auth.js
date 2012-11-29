Afisha.views.ShareAuthProvidersPanel = Ext.extend(Ext.Panel, {
    cls:'auth-socialpanel',
    defaults: {
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
                    fn: function(){ 
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
})
Ext.reg('ShareAuthProvidersPanel', Afisha.views.ShareAuthProvidersPanel);

Afisha.views.ShareAuth = Ext.extend(Afisha.views.SharePanelWithBackButton, {
    dockedItems: [],
    /* dockedItems: [{
        xtype:'toolbar',
        ui:g_ui,
        title:!Afisha.showButtons?'Авторизация':'',
        items: [
        !Afisha.showButtons?{
            xtype:'spacer'
        }:{
            xtype: 'backbtn',
            id: 'shareAuthBackButton'/*,
            handler: function () {
                Ext.dispatch({      
                    controller: 'main',
                    action: 'hideAuthView'
                });                
                Ext.dispatch({      
                    controller: 'main',
                    action: 'historyBack'
                });
            }*/
    /*},
        {
            xtype: 'spacer'
        }
        ],
        height:'2.2em'
    }],*/
    items: [{
        id: 'auth_text',
        style:'margin: 2em; text-align: center; font-size: 80%;',
        html: 'Войдите через учетную запись своей социальной сети и получите дополнительные возможности'
    },
    {
        xtype: 'ShareAuthProvidersPanel'
    }],
    onResult: function () {
        var me = this;
        if(me.mask) {
            me.mask.hide();
        }
        if (typeof Afisha.Auth.userdata == 'object') {
            var send_panel = Afisha.getFlag('send_panel');
            if (send_panel) {
                send_panel.showUserData();
                me.hide();
            }
            Afisha.deleteFlag('send_panel');			
        } else if (Afisha.Auth.userdata == false) {
        } else {
            if(me.mask) {
                me.mask.show();
            }   
        }             
    },
    initialize: function () {
            var me = this;
            if (!Ext.is.Desktop) {
                window.plugins.childBrowser.onClose = function (flag) {
                    if(flag === undefined) {
                        Afisha.Auth.userdata = false;
                        me.mask.hide();
                    }
                };
            }
            Afisha.Auth.isAuthorized(me, me.onResult);      
    },
    listeners: {
        beforerender: function () {
        },
        render: function () {
        },
        show: function () {
            var me = this;
            if(me.down('#auth_text')) {
                var send_panel = Afisha.getFlag('send_panel');
                var text = '';
                if (send_panel) {
                    send_panel.onlyComment ? text = 'комментария и оценки' : text = 'новости';                        
                }      
                me.down('#auth_text').el.setHTML('Для отправки ' + text + ' войдите через учетную запись своей социальной сети.');
            }
            // if(me.down('#shareAuthBackButton'))
            //    me.down('#shareAuthBackButton').getEl('.x-button-label').dom.getElementsByTagName('span')[0].innerHTML = Afisha.getFlag('send_panel').onlyComment?'Назад':'На главную';
            me.mask = new Ext.LoadMask(this.body, {
                msg:" "
            });
            me.onResult();
        },
        beforehide: function () {
            var me = this;
            if(me.mask)
                me.mask.hide();
        }
    }
});

Ext.reg('ShareAuth', Afisha.views.ShareAuth);

Afisha.views.ShareUserInfoPanel = Ext.extend(Ext.Panel, {
    cls:'auth-userinfopanel',
    style:'padding: 0em; text-align: center; border-bottom: 1px solid #D9D9D9;',
    id: 'userinfo',
    bodyPadding: 0,
    tpl:new Ext.XTemplate(
        '<div id="inner_userinfo"><tpl><div id="inner_userinfo_img">',
        '<tpl if="photo"><img height="100%" width="100%" src="{photo}"></img></tpl>',
        '</div>','<div id="inner_userinfo_data">',
        '<img height="30px" width="30px" style="margin: 0 10px;" src="{prov_image}"></img><div style="width: {text_width}px; ">{fullname}</div>',
        '</div></tpl></div>'),
    bindData: function () {
        var me = this;
        var userdata = Afisha.Auth.userdata;
        userdata.fullname = userdata.full_name || userdata.nickname;
        userdata.prov_image = Afisha.Auth.prov_image;
        userdata.text_width = window.innerWidth - 100 - 32;
        me.update(userdata);
    }
})
Ext.reg('ShareUserInfoPanel', Afisha.views.ShareUserInfoPanel);

/*



Afisha.views.ShareAuth = Ext.extend(Afisha.views.SharePanelWithBackButton, {
    id: 'ShareAuth',
    cls: 'shareAuthPanel',
    
    items: [

    {
        fullscreen: true,
        id: 'nonauth',
        items: [
        {
            style:'margin: 2em; text-align: center; font-size: 80%;',
            html: 'Войдите через учетную запись своей социальной сети и получите дополнительные возможности'
        },
        {
            xtype: 'ShareAuthProvidersPanel'
        }
        ]	
    },
    {
        fullscreen: true,
        id: 'auth',
        items: [
        {
            xtype: 'ShareUserInfoPanel'
        },
        {
            html: 'Выйти',
            height: '30px',
            listeners: {
                click: {
                    element: 'el', 
                    fn: function(){ 
                        var me = this;
                        Afisha.Auth.unAuthorize();
                    }
                }
            },
            style:'text-align: center; border-bottom: 1px solid #D9D9D9; line-height: 30px;',
        },
        {
            items: [
            {
                style:'margin: 1em; text-align: center; font-size: 80%;',
                html: 'Войти под другой учетной записью'
            },
            {
                xtype: 'ShareAuthProvidersPanel'
            }
            ]
        }
        ]
    }
    ],
    onResult: function () {
        var me = this;
        if(me.mask) {
            me.mask.hide();
        }
        if (typeof Afisha.Auth.userdata == 'object') {
            me.down('#auth').down('#userinfo').bindData();
            me.down('#auth').setVisible(true);
            me.down('#nonauth').setVisible(false);
        } else if (Afisha.Auth.userdata == false) {
            me.down('#auth').setVisible(false);
            me.down('#nonauth').setVisible(true);			
        } else {
            if(me.mask) {
                me.mask.show();
            }   
            me.down('#auth').setVisible(false);
            me.down('#nonauth').setVisible(true);
        }        
    },
    listeners: {
        beforerender: function () {
            var me = this;
            if (!Ext.is.Desktop) {
                window.plugins.childBrowser.onClose = function (flag) {
                    if(flag === undefined) {
                        me.mask.hide();
                    }
                };
            }
            Afisha.Auth.isAuthorized(me, me.onResult);
        },
        beforeactivate: function () {
            var me = this;
            me.mask = new Ext.LoadMask(Ext.getBody(), {
                msg:"Загрузка..."
            });
            me.onResult();
        },
        beforehide: function () {
            var me = this;
            if(me.mask)
                me.mask.hide();
        }
    },
    initComponent: function() {
        Afisha.views.ShareAuth.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('ShareAuth', Afisha.views.ShareAuth);*/