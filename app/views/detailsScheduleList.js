Afisha.views.epList = Ext.extend(Ext.List,{
    layout:'fit',
    scroll:false,
    grouped : true,
    cls:'myDisclosure scheduleList',
    itemCls:'scheduleItem',
    indexBar: false,
    onItemDisclosure: true,
    disableSelection:true,
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
    /*
     * @param {String} id идентификатор event\place, для которого показывать расписание
     * @param {Ext.data.Store} store хранилище event\place
     * @param {Date} date дата для показа расписания. чтобы вывести все возможное, нужно передать null
     * 
     **/
    bindScheduleData:function(id,store,date){
        var scheduleData = getSchedule(store, id, date);
        var byDate = getScheduleByDate(scheduleData,date);
        this.getStore().loadData(byDate);
        if (this.isHidden())
            this.show();
        this.doComponentLayout();
        return scheduleData.length;
    },
    listeners:{
       itemtap: function(list, index, item, e){
           var info = list.getStore().getAt(index);
           var config = {
                controller: 'main',
                record: info.data.ep.data,
                store: info.data.ep.store
           };
           switch (info.data.ep.store.ob_type)
           {
               case 'event':{
                       config.action = 'showEventDetails';
                       break;
               }
               case 'place':{
                       config.action = 'showPlaceDetails';
                       break;
               }
               default:
                   config.action = 'backToList';
           }
           Ext.dispatch(config);
       }
    },
    initComponent: function() {
        Afisha.views.epList.superclass.initComponent.apply(this, arguments);
        this.listItemTpl = new Ext.XTemplate('<tpl if="this.isShow(values)">' + this.listItemTpl.html + '</tpl>',{
                isShow:function(param){
                    if (param.length && param[0].schedule.length)
                        return true;
                    else
                        return false;
                }
            });
    }
});
Ext.reg('epList', Afisha.views.epList);