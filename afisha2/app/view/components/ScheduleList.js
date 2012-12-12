Ext.define('Afisha.view.components.ScheduleList',{
    extend:'Ext.dataview.List',
    xtype:'schedulelist',
    config:{
        scrollable:false,
        grouped : true,
        cls:'myDisclosure scheduleList',
        itemCls:'scheduleItem',
        indexBar: false,
        onItemDisclosure: true,
        disableSelection:true,
        style:'border:1px solid red',
        itemTpl: new Ext.XTemplate(
            '<div class="list-item-title boldTitle">',
                '<tpl if="ep.data.name.length">{ep.data.name}</tpl><tpl if="!ep.data.name.length">{ep.data.aka}</tpl>',//list of places
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
        })
    },
    /*
     * @param {String} id идентификатор event\place, для которого показывать расписание
     * @param {Ext.data.Store} store хранилище event\place
     * @param {Date} date дата для показа расписания. чтобы вывести все возможное, нужно передать null
     * 
     **/
    bindScheduleData:function(id,date){
        var scheduleData = Afisha.schMethods.getSchedule(null, id, date);
        var byDate = Afisha.schMethods.getScheduleByDate(scheduleData,date);
        this.getStore().setData(byDate);
        if (this.isHidden())
            this.show();
        //this.doComponentLayout();
        return scheduleData.length;
    },
});