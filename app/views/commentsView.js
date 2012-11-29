Afisha.views.commentsView = Ext.extend(Ext.Panel, {
    id:'commentsView',
    cls:'aloha',
    defaultText:'<br/><h4>Пока здесь нет комментариев.</h4>',
    scroll:'vertical',
    tpl:new Ext.XTemplate('{comments}'),
    //layout: 'fit',
    fullscreen:true,
    styleHtmlContent:true,
    loadComments:function(records, operation, success){
        this.myMask.hide();
        if (!success || !records.length)
        {
            this.update({comments:'<br/><h4>Ошибка подключения.</h4>'});//clear panel
            this.reload = true;
            Ext.Msg.alert(G.app_name, 'Ошибка подключения.');
            return;
        }
        var record = records[0];
        if (record.data.status != 'ok')
        {
            this.update({comments:'<br/><h4>Ошибка получения данных.</h4>'});//clear panel
            this.reload = true;
            Ext.Msg.alert(G.app_name, 'Ошибка получения данных.');
            return;
        }      
        this.reload = false;
        if (record.data.com_count == '0')
        {
            this.update({comments:this.defaultText});//clear panel
            return;
        }
        this.update(record.data);
        if (this.scrollBottom)
        {
            var el = this.body.dom;
            el.scrollTop = el.scrollHeight - el.offsetHeight;
        }
    },
    bindData:function(params,callBack,scope){
        if ((this.el_type == params.comment) && (this.el_id == params.el_id) && !this.reload)
        {
            this.scroller.scrollTo({x:0, y:0});
            callBack.call(scope,'commentsView',params.direction?params.direction:'left');
            return;
        }
        this.update({comments:''});
        Afisha.stores.CommentsStore.getComments(params.comment,params.el_id,this.loadComments, this);
        this.el_type = params.comment;
        this.el_id = params.el_id;
        this.rName = params.name;
        //this.update(this.comment);
        //this.doLayout();
        //this.scroller.scrollTo({x:0, y:0});
        callBack.call(scope,'commentsView',params.direction?params.direction:'left');
        if (!this.myMask)
            this.myMask = new Ext.LoadMask(this.el.down('.x-panel-body'), {msg:" "});
        this.myMask.show();
    },
    backTap:function(){//stop loading comments
        if (!Afisha.showButtons && Afisha.stores.CommentsStore.isLoading())
        {
            Ext.Ajax.abort(Afisha.stores.CommentsStore.proxy.activeRequest);
            delete Afisha.stores.CommentsStore.proxy.activeRequest;
            Afisha.stores.CommentsStore.loading = false;
            this.reload = true;
            this.update({comments:'<br/><h4>Получение комментарие отменено.</h4>'});
            if (this.myMask)
                this.myMask.hide();
            return true;
        }
            return false;
        
    },
    initComponent: function() {
        this.topToolbar = new Ext.Toolbar({
            ui:g_ui,
            height:'2.2em',
            items: [
                Afisha.showButtons?{xtype:'backbtn'}:{xtype:'spacer'}
            ]          
        });
        this.topToolbar.setTitle('Отзывы');
        this.dockedItems = [this.topToolbar,new Ext.Button({
                dock:'top',
                height:'2.2em',
                scope:this,
                text:'+1: Добавьте отзыв',
                handler:function(){
                    Ext.dispatch({
                        controller: 'main',
                        action: 'sendComment',
                        el_type: this.el_type,
                        el_id: this.el_id,
                        el_name:this.rName
                    });
                }
        })];
        Afisha.views.commentsView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('commentsView', Afisha.views.commentsView);