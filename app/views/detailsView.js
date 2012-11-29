Afisha.views.detailsView = Ext.extend(Ext.Panel, {
    cls:'detailsView',
    scroll:{direction:'vertical',threshold:10},
    layout: {
        type:'vbox',    
        align:'stretch'
    },
    noScheduleTypes:['restaurant','bath','pool','file_kt','file_lz'],
    servicesInSchedule:['beauty','fitnes','stomotolog','medic'],
    fullScheduleTypes:['club','concert','expo'],
    weekScheduleTypes:['theatre'],
    fullscreen:true,
    bindSchedule:function(date){
        this.down('#el'+this.id).bindScheduleData(this.scId,this.scStore,date);
    },
    bindData:function(params,callBack,scope){
        this.scId = params.record.id;
        this.scStore = params.store;
//        this.down('#dh'+this.id).bindData(params.record, params.category);
	this.down('#sp'+this.id).bindData(params);
        this.down('#bl'+this.id).bindData(params.record,params.store.comments);
        var select = this.down('customselectfield');
        if (this.noScheduleTypes.indexOf(params.record.type) != -1)
        {
            select.hide();
            this.down('#el'+this.id).hide();
        }
        else
        {
            select.params = {record:params.record,store:params.store};
            var cnt = 0;
            if (this.fullScheduleTypes.indexOf(params.record.type) != -1)//
            {
                cnt = this.down('#el'+this.id).bindScheduleData(params.record.id, params.store,null);
                select.setValue('full');

            }
            else if (this.weekScheduleTypes.indexOf(params.record.type) != -1)
            {
                cnt = this.down('#el'+this.id).bindScheduleData(params.record.id, params.store,'week');
                select.setValue('week');
            }
            else if (this.servicesInSchedule.indexOf(params.record.type) != -1)
            {
                this.down('#el'+this.id).bindScheduleData(params.record.id, params.store,null);
                cnt = 1;
            } else 
            {
                cnt = this.down('#el'+this.id).bindScheduleData(params.record.id, params.store,new Date());
                select.setValue(0);
            }
            if (cnt < 2)
                select.hide()
            else
                select.show();
        }
        this.down('#df'+this.id).bindData(params.record, params.store);
        this.scroller.scrollTo({x:0, y:0});
        callBack.call(scope,'#' + this.id,params.direction?params.direction:'left');
        this.down('#dh'+this.id).bindData(params.record, params.category);
        this.down('#gv'+this.id).bindData(params.record);
    },
    //закрыть selectfield при нажатии аппаратной кн. Назад
    backTap:function(){
        var sf = this.down('customselectfield');
        if (sf.listPanel && !sf.listPanel.isHidden())
        {
            sf.listPanel.hide();
            return true;
        }
        if (answersSheet && !answersSheet.isHidden())
        {
            answersSheet.hide();
            return true;
        }
        if (phonesList && !phonesList.isHidden())
        {
            phonesList.hide();
            return true;
        }        
        return false;
    },
    initComponent: function() {
        if (this.type == 'event')
            this.items = [
                {xtype: 'detailsHeader', id:'dh'+this.id, style:'padding-left:0.6em;'},
                {xtype: 'galleryView',id:'gv'+this.id},
                {xtype: 'epList',id:'el'+this.id,store: Afisha.stores.allsch, style:'margin-top:0.5em;'},
                {xtype: 'buttonsList',id:'bl'+this.id, store:Afisha.stores.buttonsList, componentCls:'eventButtons'},
                {xtype: 'detailsFooter',id:'df'+this.id},
		{xtype: 'socialPanel',id:'sp'+this.id}                
            ];
        else
            this.items = [
                {xtype: 'detailsHeader', id:'dh'+this.id},
                {xtype: 'buttonsList',id:'bl'+this.id, store:Afisha.stores.buttonsList,style:'margin-top:0.5em;',},
                {xtype: 'galleryView',id:'gv'+this.id, style:'margin-top:0.5em; margin-bottom:0.5em;'},
                {xtype: 'epList',id:'el'+this.id,store: Afisha.stores.allsch},
                {xtype: 'detailsFooter',id:'df'+this.id},
		{xtype: 'socialPanel',id:'sp'+this.id}
            ];
        this.topToolbar = new Ext.Toolbar({
            height:'2.2em',
            ui:g_ui,
            items: [
                Afisha.showButtons?{xtype:'backbtn'}:{xtype:'spacer'},
                {xtype:'spacer'},
                {xtype:'customselectfield',options:[
                        {text:'Сегодня',value:0},
                        {text:'Завтра',value:1},
                        {text:'Текущая неделя',value:'week'},
                        {text:'Следующая неделя',value:'nextweek'},
                        {text:'Все дни', value:'full'}],
                    name:'options',
                    width:'60%',
                    itemId:'selectDate',
                    dView:this,
                    plugins:['classiccombo'],
                    listeners :{
                        change:function(el,val){
                            if (val == 'full' && el.params)
                            {
                                Ext.dispatch({      
                                   controller: 'main',
                                   action: 'showFullSchedule',
                                   record: el.params.record,
                                   store: el.params.store,
                                   from:this.dView.id
                                });
                                //el.reset();
                                //this.dView.bindSchedule(new Date());
                                return true;
                            }
                            if ((val == 'week') || (val == 'nextweek'))
                            {
                                this.dView.bindSchedule(val);
                                return true;
                            }
                            var date = new Date();
                            for (var i=0; i<val; i++)
                                date.nextDay();
                            this.dView.bindSchedule(date);
                            return true;
                        }
                    }
                }
            ]          
        });
        this.dockedItems = [this.topToolbar];
        Afisha.views.detailsView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('detailsView', Afisha.views.detailsView);