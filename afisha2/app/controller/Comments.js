Ext.define('Afisha.controller.Comments', {
    extend: 'Ext.app.Controller',

    config: {
        objectParams:{},
        userData:null,
        refs: {
            list:   'commentsview dataview',
            addBtn: 'commentsview button#addComment',
            modal:  'commentsview #sendCommentModal',
            textarea:  'commentsview textareafield',
            okButton:'commentsview #sendCommentOk',
            cancelButton:'commentsview #sendCommentCancel',
            authview: 'authview',
        },

        control: {
            addBtn:{
                tap:'onAddCommentBtnTap'
            },
            okButton:{
                tap: 'onOkButtonClick'
            },
            cancelButton:{
                tap: 'onCancelButtonClick'
            }
        }
    },
    initView:function(opt){
        this.setObjectParams(opt);
        var list = this.getList();
        var store = list.getStore();
        store.setData([]);//clear before load
        list.setMasked({xtype:'loadmask', message:"Загрузка"});
        var proxy = store.getProxy();
        proxy.setExtraParam("elem_type",opt.elem_type);
        proxy.setExtraParam("type",opt.type);
        proxy.setExtraParam("elem_id",opt.elem_id);
        store.load(function(records, operation, success) {
            if (!success){
                Afisha.gf.alert("Ошибка загрузки комментариев!")
            }
            
        }, this);
    },

    onAddCommentBtnTap:function(){
        var uData = this.getUserData();
        if (!uData){
            this.userLogin();
            return;
        }
        this.getModal().show();
    },
    
    userLogin: function(){
        var me = this;
        var OAuthController = Afisha.app.getController('AfishaC.OAuth'),
        callback = function (userdata) {
            if (!userdata){
                Afisha.gf.alert('Ошибка авторизации');
                return;
            }
            me.setUserData(userdata);
            me.getModal().show();
        };
        OAuthController.getUserData(callback);                
    },
    sendComment: function(comment){
        var me = this;
        var info = this.getObjectParams();
        var userData = this.getUserData();
        if (!userData){
            Afisha.gh.alert('Необходимо авторизоваться перед отправкой комментария!');
            return;
        }
        info.vote = 0;
        info.body = comment;
        info.sign = 0;
        info.user_data = userData;//{"identity":"http://vk.com/mikhelev","provider":"vk.com","prov_name":"\u0412\u043a\u043e\u043d\u0430\u043a\u0442\u0435","first_name":"Andrey","last_name":"Mikhelev","full_name":"AndreyMikhelev","nickname":"Walker","photo":"http://cs9805.vk.me/v9805581/2f/5I5HSe56lzU.jpg","uid":"http://vk.com/mikhelev","dob":"","gender":"","email":""}
        Ext.Ajax.request({
            url: 'http://afisha-uu.13857.aqq.ru/app/ulanude/comments',
            method:'POST',
            timeout:10000,
            jsonData: info,
            callback : function(opt, success,response){
                if (success){
                    Afisha.gf.alert('Комментарий успешно отправлен!')
                    me.getModal().hide()
                    me.getList().getStore().load();
                    return;
                }
                else {
                    Afisha.gf.alert('Произошла ошибка при отправек комментария.')
                }
//                console.log(success);
//                console.log(response.responseText);
            }
        });
    },
    onCancelButtonClick: function(){
        this.getTextarea().setValue("");
        this.getModal().hide();
    },
    onOkButtonClick:function(){
        var text = this.getTextarea().getValue();
        if (text.length == 0){
            Afisha.gf.alert("Введите текст комментария!");
            return;
        }
        this.sendComment(text);
    },
    goBack:function(){
        var auth = this.getAuthview();
        if (auth && !auth.isHidden()){
            auth.hide();
            return true;
        }
        var modal = this.getModal();
        if (modal && !modal.isHidden()){
            modal.hide();
            return true;
        }
        return false;
    }

});
