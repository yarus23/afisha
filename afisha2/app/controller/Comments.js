Ext.define('Afisha.controller.Comments', {
    extend: 'Ext.app.Controller',

    config: {
        objectParams:{},
        refs: {
            list:   'commentsview dataview',
            addBtn: 'commentsview button#addComment',
            modal:  'commentsview #sendCommentModel',
        },

        control: {
            list:{
                itemtap:'onFavItemTap'
            },
            addBtn:{
                tap:'onAddCommentBtnTap'
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
    onFavItemTap:function(me,idx,el,record,e){

    },
    onAddCommentBtnTap:function(){
//        this.getModal().show();
this.sendComment();
        return;

    },
    userLogin: function(){
        var OAuthController = Afisha.app.getController('AfishaC.OAuth'),
        callback = function (userdata) {
            options = options || {};
            options.userdata = userdata;
            Afisha.app.fireEvent('showItem', 'events', options);
        };
        OAuthController.getUserData(callback);                
    },
    sendComment: function(){
        var info = this.getObjectParams();
        info.vote = 5;
        info.body = 'test';
        info.sign = 0;
        info.user_data = {"identity":"http://vk.com/mikhelev","provider":"vk.com","prov_name":"\u0412\u043a\u043e\u043d\u0430\u043a\u0442\u0435","first_name":"Andrey","last_name":"Mikhelev","full_name":"AndreyMikhelev","nickname":"Walker","photo":"http://cs9805.vk.me/v9805581/2f/5I5HSe56lzU.jpg","uid":"http://vk.com/mikhelev","dob":"","gender":"","email":""}
        Ext.Ajax.request({
            url: 'http://afisha.mikhelev.ru/app/ulanude/comments',
            method:'POST',
            timeout:10000,
            params: info,
            callback : function(opt, success,response){
                console.log(success);
                console.log(response.responseText);
                var text = response.responseText;
                // process server response here
            }
        });
    }

});
