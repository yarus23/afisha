var answersSheet = new Ext.ActionSheet({
    id: 'answersSheet',
    stretchX: true,
    hideOnMaskTap: true,
    tpl: '',
    onResult: function (data) {
        data == 'ok' ? Ext.Msg.alert(Global.app_name, 'Сообщение отправлено.') : '';
    },
    defaults: {
        xtype:'button',
        height: '4em',
        
        handler: function(b,e) {
            var me = this.ownerCt;
            var social_reviews_data = me.social_reviews[b.index];
            me.hide();
            Afisha.Auth.post(social_reviews_data.provider_index, social_reviews_data.message, social_reviews_data.link, me, me.onResult);
        //var link = b.ownerCt.getComponent('hrefs_panel').el.query('a')[b.index];
        //Afisha.openUrl(link);
        }
    },  
    social_reviews: [
        
    ],
    bindData: function(provider_index, record, site, type){
        var me = this;
        var social_reviews_type  = social_reviews[typeOfData(type)];
        me.removeAll();
        me.social_reviews = [];
        var button_height = window.innerHeight * 2 / 3 / social_reviews_type.length - 10;
        me.defaults.height = button_height + 'px';
        
        for(var i = 0; i < social_reviews_type.length; i++){
            // life: beauty, fitnes, medic, stomotolog
            if(type.substr(0, 5) === 'file_' ||
                type === 'beauty' ||
                type === 'fitnes' ||
                type === 'medic' ||
                type === 'stomotolog' ) {
                record.ex_type = undefined;
            } else {
                record.ex_type = type;
            }
            if(record.ex_type == 'pool') {
                record.ex_type = 'restaurant';
            }
            var social_reviews_type_date = {};
            var ex_title = social_reviews_type[i].ex_title.apply(record);
            //var link = social_reviews_type[i].link.apply(record);
            var message = social_reviews_type[i].message.apply(record);
            social_reviews_type_date = {
                ex_title: ex_title,
                link: link,
                message: message,
                provider_index: provider_index
            };
            me.social_reviews.push(social_reviews_type_date);
            this.add({
                text: ex_title,
                index: i,
                cls: 'social-site-button'
            });
        }
    /*this.add({
            xtype:'panel',
            id:'hrefs_panel',
            html: html,
            height: '0em'
        })*/
    }
});

Afisha.views.socialPanel = Ext.extend(Ext.Panel, {
    cls:'social-panel',
    defaults: {
        xtype:'button',
        cls:'social-button',
        handler: function(b,e) {
            if(b.ownerCt.data) { // DEBUG
                var record = b.ownerCt.data.record;
                var site = b.site;
				var type = b.ownerCt.data.type;
                answersSheet.bindData(b.provider_index, record, site, type);
                answersSheet.show();
            //answersSheet.showBy(b.ownerCt.down('.start'));
            }
            else {
                var link = b.ownerCt.ownerCt.getComponent('hrefs_panel').el.query('a')[b.index];
            //console.log(link)
            /*Ext.dispatch({      
                    controller: 'main',
                    action: 'goHref',
                    hrefEl: link
                });*/     
            }
        }
    },
    layout: 'hbox',
    bindData:function(data) {
        this.data = data;
    },
    initComponent: function() {
        if (this.sms || this.email)
        {
            this.items = [{
                xtype:'panel',
                cls:'start'
            },{
                icon:'config/resources/icons/Sms-blue-36.png',
                site:'sms',
                index:-1
            },{
                icon:'config/resources/icons/Mail-blue-36.png',
                site:'email',
                index:-2
            }];
        }
        else
            this.items = [{
                xtype: 'panel',
                cls: 'start'
            },
            {
                icon: 'config/resources/icons/vkontakte.png',
                site: 'vkontakte',
                provider_index: 0,
                index: 0
                
            },
            {
                icon: 'config/resources/icons/facebook.png',
                site: 'facebook',
                index: 1,
                provider_index: 2
            },
            {
                icon: 'config/resources/icons/twitter.png',
                site: 'twitter',
                provider_index: 5,
                index: 2
            },{
                xtype:'button',
                flex:1,
                cls:'sendErrorButton',
                //'mailto:?subject=Попробуй приложение Афиша Тулы!&body=Мне '
                tpl:new Ext.XTemplate('<span class="x-button-label">Сообщить об ошибке</span><a class="mylink" href="mailto:' + G.email + '?subject=' + Global.app_name + '. Сообщение об ошибке в описании!&body=Название:{name}; Тип:{type}; ID:{id};"></a>'),
                text:'Сообщить об ошибке',
                handler:function(b,e){
                    var d = b.ownerCt.data;
                    if (!d || !d.record)
                        return;
                    this.update(d.record);
                    var site = b.el.dom.getElementsByClassName('mylink');
                    if (!site || !site.length)
                        return;
                    Afisha.openUrl(site[0]);    
                }
            }];
        Afisha.views.socialPanel.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('socialPanel', Afisha.views.socialPanel);


