function getPicture(sourceType){
    var onFail = function() {
        Ext.Msg.alert(G.app_name, 'Не удается получить изображение с камеры.');
    };
    var onPhotoURISuccess = function(imageURI) {
        var el = Ext.getCmp('SendNews');
        el.uploadImage = imageURI;		   
        var largeImage = document.getElementById('largeImage');
        largeImage.src = imageURI;
    }
    if( navigator.camera ) {
        var destinationType=navigator.camera.DestinationType;
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
        navigator.camera.getPicture(onPhotoURISuccess, onFail, {
            quality: 45, 
            destinationType: destinationType.FILE_URI, 
            sourceType: sourceType
        }); 
    } else
        onFail();
}

Afisha.views.SendNews = Ext.extend(Ext.form.FormPanel, {
    id: 'SendNews',
    scroll:'vertical',
    fullscreen:true,
    showUserData: function () {
        var me = this;
        var userinfo_panel = me.down('#share_user_info_panel_' + (me.onlyComment ? 'comments' : 'news'));
        typeof Afisha.Auth.getUserData() == 'object' ? userinfo_panel.show() : userinfo_panel.hide();
        if(typeof Afisha.Auth.getUserData() == 'object')
            userinfo_panel.bindData();
    },
    showRating: function () {
        var me = this;       
        if (!me.onlyComment) {
            return;
        }
        var rating_panel = me.down('#rating');
        var rating_header = me.down('#rating_header');
        var id = me.commentId.type + me.commentId.id;
        var value = Afisha.Rating.get(id);
        value = parseInt(value) - 1;
        	if (value > -1) {
            me.old_rating = true;
            rating_panel.setValue(value);
            rating_panel.disabled = true;
            rating_header.update('Ваша оценка:');
        }
        else {
            rating_header.update('Поставьте свою оценку:');
        }
    },
    backTap:function(){
        if (Afisha.getFlag('send_panel')) {
                Ext.dispatch({      
                    controller: 'main',
                    action: 'hideAuthView'
                });    
        }
        return false;
    },
    listeners:{
        beforeactivate: function () {
            var me = this;
			if(!isOnline(true)) {
				return false;	
			}			
            me.showUserData();   
            me.showRating();            
        },
        activate: function () {
            var me = this;
            if (typeof Afisha.Auth.getUserData() !== 'object') {
				/*if (me.onlyComment) {
					Ext.Msg.alert(G.app_name, 'Чтобы оставлять комментарии и оценки, пожалуйста, авторизуйтесь через социальную сеть.');
				}
				else {
					Ext.Msg.alert(G.app_name, 'Чтобы отправить новость, пожалуйста, авторизуйтесь через социальную сеть.');	
				}*/
			    Afisha.setFlag('send_panel', me);
                Ext.dispatch({
                    controller: 'main',
                    action: 'showAuthView'
                });
            }
        },
        show: function() {
            if (!this.onlyComment  && !Ext.is.Nokia)
            {
                this.uploadImage = null;
                var largeImage = document.getElementById('largeImage');
                largeImage.src = this.defaultImage;
            }
          /* var uname = Afisha.options.get('uname')
			if (uname)
            {
                this.down('textfield').setValue(uname);
            }
            else
                this.down('textfield').setValue('');*/
            this.down('textareafield').setValue('');
            if (this.commentId)
                this.down('textareafield').labelEl.update("Хочу рассказать о " + this.commentId.el_name);
            this.doComponentLayout();
        }
    },

    initComponent: function() {
        this.uploadImage = null;
        this.defaultImage = 'config/resources/icons/missing_image_ru.jpg';
        var titleText = this.onlyComment ? 'Отправить отзыв' : 'Отправить новость';
        this.dockedItems = [{
            xtype:'toolbar',
            ui:g_ui,
            title:!Afisha.showButtons? titleText :'',
            items: [
            !Afisha.showButtons?{
                xtype:'spacer'
            }:{
                xtype: 'backbtn',
                text:this.onlyComment?'Назад':'На главную'
            },

            {
                xtype: 'spacer'
            }
            ],
            height:'2.2em'
        }];
        this.items = [/*{
                            xtype: 'textfield',
            //placeHolder:'Не забудьте написать свое имя!',
            //required:true,
            name : 'name',
            label: 'Ваше имя:',
            labelAlign: 'left',
            labelWidth:'40%',
            listeners:{
                change:function( me, newValue, oldValue ){
                    Afisha.options.set('uname',newValue)
                    }
                   }
        },*/
        {
            xtype: 'ShareUserInfoPanel',
            id: 'share_user_info_panel_' + (this.onlyComment ? 'comments' : 'news')
        }
        ];
        if (this.onlyComment)
        {
            this.items.push({
                xtype:'component', 
                id: 'rating_header',
                html:'',
                componentCls:'sortTitle'
            });
            this.items.push(new Ext.ux.touch.Rating({
                itemsCount : 5,
                id: 'rating',
                minValue: -1,
                inputCls : 'x-rating-star-input',
                itemCls : 'x-rating-star',
                itemHoverCls : 'x-rating-star-hover',
                showClear: false
            }));
        }
        this.items.push({
            xtype: 'textareafield',
            //required:true,
            //placeHolder:'Не забудьте написать свое имя!',
            name : 'news',
            label: 'Хочу рассказать о...',
            labelAlign: 'top',
            labelWidth:'100%'
        });
        if (!this.onlyComment && !Ext.is.Nokia)
        {
            this.items.push({
                xtype:'component', 
                html:'Прикрепить фотографию:',
                componentCls:'sortTitle'
            });
            this.items.push({
                xtype:'segmentedbutton',
                style:'margin-top:0.5em; font-size:smaller',
                layout:'hbox',
                items:[
                {
                    flex:1,
                    text:'Из камеры',
                    handler:function(){
                        if( navigator.camera )
                            getPicture(navigator.camera.PictureSourceType.CAMERA);
                        else
                            Ext.Msg.alert(Global.app_name, 'Невозможно получить изображение с камеры.');
                        this.ownerCt.setPressed(0, false);
                    }
                },
                {
                    text:'Из галереи',
                    flex:1,
                    handler:function(){
                        if( navigator.camera )                   
                            getPicture(navigator.camera.PictureSourceType.PHOTOLIBRARY);
                        else
                            Ext.Msg.alert(Global.app_name, 'Невозможно получить изображение с камеры.');
                        this.ownerCt.setPressed(1, false);
                    }
                }]
            });
        }
        this.items.push({
            xtype:'button', 
            itemId:'sendButton',
            text:'Отправить', 
            scope:this,
            style:'margin-top:0.5em; font-size:smaller',
            listeners: {
                'tap': function () {
                    if (!isOnline(true))
                        return;
                    var Text = this.ownerCt.down('textareafield').getValue();
                    /*var userName = this.ownerCt.down('textfield').getValue();
                    if (!userName.length)
                    {
                        Ext.Msg.alert(G.app_name, 'Введите свое имя!');
                        return;
                    }*/
                    if(!Text.length)
                    {
                        Ext.Msg.alert(G.app_name, 'Введите текст.');
                        return;
                    }
                    var me = this.ownerCt;
                    if(me.onlyComment)
                    {
                        var rating_el = me.down('#rating');
                        var rating = rating_el.getValue();
                        var id = me.commentId.type + '_' + me.commentId.id;
                        if(rating == -1 ) {
                            Ext.Msg.alert(G.app_name, 'Поставьте рейтинг.');
                            return;
                        }
                        rating = me.old_rating ?  undefined : rating + 1;
                        //else
                        //    Afisha.Rating.send(id, rating, me.commentId);
                    }
                    if (!this.myMask)
                        this.myMask = new Ext.LoadMask(this.ownerCt.el, {
                            msg:"Отправка..."
                        });
                    this.myMask.show();
                    Ext.dispatch({
                        controller: 'main',
                        action: 'sendNews',
                        newsText:Text,
                        userdata: Afisha.Auth.getUserData(),
                        /*uName: userName,*/
                        mask:this.myMask,
                        vote: rating,
                        uploadImage:this.ownerCt.uploadImage?this.ownerCt.uploadImage:null,
                        elem_type:this.ownerCt.commentId?this.ownerCt.commentId.type:null,
                        elem_id:this.ownerCt.commentId?this.ownerCt.commentId.id:null,
                        name:this.ownerCt.commentId?this.ownerCt.commentId.el_name:null,
                        msg: this.ownerCt.onlyComment?'Ваш комментарий и оценки добавлены.':'Спасибо за вашу новость! Она будет опубликована после проверки модератором.',
                        failMsg:this.ownerCt.onlyComment?'Упс! Не могу добавить комментарий и оценку из-за проблем с Интернетом. Проверьте подключение.':'Новость не отправлена.Требуется подключение к интернету.'
                    });
                }
            }
        });
        if (!this.onlyComment && !Ext.is.Nokia)
        {
            this.items.push({
                html: '\
                <img id="largeImage" style="width:auto; max-width:100%; height:auto;  margin:0 auto;display:block" src="config/resources/icons/missing_image_ru.jpg" />\n\
                '
            });
        }

        Afisha.views.SendNews.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('SendNews', Afisha.views.SendNews);