Afisha.views.fullScheduleView = Ext.extend(Ext.Panel, {
    id:'fullScheduleView',
    scroll:'vertical',
    //layout: 'fit',
    fullscreen:true,
    bindData:function(params,callBack,scope){
        this.from = params.from;
        this.down('#caption').setTitle(params.record.name.length ? params.record.name : params.record.aka);
        var shLength = this.down('epList').bindScheduleData(params.record.id, params.store,null);
        if (!shLength)
            this.down('#noSchedule').show();
        else
            this.down('#noSchedule').hide();
        this.scroller.scrollTo({x:0, y:0});
        callBack.call(scope,'fullScheduleView',params.direction?params.direction:'left');
    },
    initComponent: function() {
        this.items = [{
                    xtype: 'toolbar',
                    cls:'fullScheduleToolbar',
                    itemId:'caption', 
                    titleCls:'x-toolbar-title fullScheduleTitle', 
                    title: 'Афиша'},
            {xtype:'epList',store: Afisha.stores.fullsch, id:'epFullList'},{xtype:'panel', itemId:'noSchedule', layout:'auto',styleHtmlContent:true,hidden:true, html:'<h4>Сеансов нет.</h4>'}];
        this.topToolbar = new Ext.Toolbar({
            ui:g_ui,
            height:'2.2em',
            title:Afisha.showButtons?'':'Расписание',
            items: [
                Afisha.showButtons?{xtype:'backbtn'}:{xtype:'spacer'}
            ]          
        });
        this.dockedItems = [this.topToolbar];
        Afisha.views.fullScheduleView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('fullScheduleView', Afisha.views.fullScheduleView);