Ext.define('Afisha.view.components.ScheduleList',{
    extend:'Ext.dataview.List',
    xtype:'schedulelist',
    config:{
        ob_type:'',
        grouped : true,
        cls:'myDisclosure scheduleList',
        itemCls:'scheduleItem',
        indexBar: false,
        onItemDisclosure: true,
        disableSelection:true,
        //style:'border:1px solid red',
        itemTpl: new Ext.XTemplate(
            '<div class="list-item-title boldTitle">',
                '<tpl if="ep && ep.data && ep.data.name.length">{ep.data.name}</tpl><tpl if="ep && ep.data && !ep.data.name.length">{ep.data.aka}</tpl>',//list of places
            '</div>',
            '<tpl if="isSchedule">',
                '<div class="list-item-content schedule"><tpl for="schedule">',
                    '{time}<tpl if="price.length"><i>/{price}р.</i></tpl>&nbsp;',
                '</tpl></div>',
            '</tpl>',
            '<tpl if="isService">',
                '<div class="list-item-content schedule"><tpl for="schedule">',
                    '<tpl if="price_min == price_max && price_min &gt; 0">{price_max}р.</tpl>&nbsp;',
                    '<tpl if="price_min != price_max && price_min &gt; 0">{price_min} - {price_max}р.</tpl>&nbsp;',
                '</tpl></div>',
            '</tpl>'       
        ),
        store: Ext.create("Ext.data.Store", {
            model: "Afisha.model.AfishaModels.ScheduleList",
            grouper: {
                groupFn: Afisha.schMethods.getGroupString,
                sortProperty: 'date'
            }
        }),
        listeners:{
            itemtap:function(a,b,s,record,e){
                var ob_type = this.getOb_type();
                //Afisha.app.getController('AfishaC.EventView')
                Afisha.app.fireEvent('showItem', (ob_type == 'place' ? 'event' : 'place') + 'view',record.get('ep'), true);
            },
            show:function(){
                this.addCls('getsize');
            }
        }
    },
    /*
     * @param {String} id идентификатор event\place, для которого показывать расписание
     * @param {Ext.data.Store} store хранилище event\place
     * @param {Date} date дата для показа расписания. чтобы вывести все возможное, нужно передать null
     * 
     **/
    bindScheduleData:function(id, date, isEvent){
        var scheduleData = Afisha.schMethods.getSchedule(null, id, isEvent);
        var byDate = Afisha.schMethods.getScheduleByDate(scheduleData,date);
        if (byDate.length == 1 && byDate[0].date == null){
            this.onlyHeader = true;
        } else {
            this.onlyHeader = false;
        }
        this.getStore().setData(byDate);
        if (this.isHidden())
            this.show();
        //this.doComponentLayout();
        //debugger;
        return scheduleData.length;
    }
});
