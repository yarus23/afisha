Ext.define('Afisha.controller.AfishaC.Events', {
    extend: 'Ext.app.Controller',

    config: {
        //чтобы при переходе назад на этот экран был открыт таб с которого пришли
        lastTabNum:0,
        
        refs: {
            viewport: 'aviewport',
            toolbar: 'events titlebar',
            tabpanel: 'events tabpanel',
            eventsList: 'events tabpanel #eventsList',
            placesList: 'events tabpanel #placesList',
            filterButton: 'events titlebar #filterButton',
            searchButton: 'events titlebar #searchButton',
            sortButton: 'events titlebar #sortButton'
        },
        control: {
            placesList:{
                itemtap:'onPlacesListItemTap'
            },
            eventsList:{
                itemtap:'onEventsListItemTap'
            },
            sortButton:{
                tap: 'onSortButtonPress'
            }
        }
    },
    initView:function(opt){
        this.setupDialog(opt.name, opt.eventsName,opt.placesName, opt.onlyPlaces, opt.filter);
    },
    onSortButtonPress: function() {
        var popoverpanel = new Ext.Panel({
            modal:true,
            left:'10%',
            top:'10%',
            width:'80%',
            height:'80%',
            hideOnMaskTap: true,
            scroll: 'vertical',
            items:[{
                xtype: 'list',
                itemTpl: '{name}',
                flex: 1
            }]
    });
    Ext.Viewport.add(popoverpanel);
    popoverpanel.showBy(this.getSortButton());
    },
    onPlacesListItemTap:function(me,idx,target,record){
        this.setLastTabNum(1);
        this.getApplication().fireEvent('showItem', 'placeview',record, true);
    },
    onEventsListItemTap:function(me,idx,target,record){
        this.setLastTabNum(0);
        this.getApplication().fireEvent('showItem', 'eventview',record, true);
    },
    setupDialog: function(name, eventsName, placesName, onlyPlaces, filter) {
        var tabPanel = this.getTabpanel();
        // имя диалога
        this.getToolbar().setTitle(name);
        // имена кнопок
        tabPanel.getTabBar().getAt(0).setTitle(eventsName);
        tabPanel.getTabBar().getAt(1).setTitle(placesName);
        
        // переключим на places если нужно
       tabPanel.setActiveItem(onlyPlaces ? 1 : 0)
        
        // скроем тулбар если нужно
        tabPanel.getTabBar().setHidden(onlyPlaces);
        
        // передернем список
        this.getPlacesList().getScrollable().getScroller().scrollTo(0, 0);
        this.getEventsList().getScrollable().getScroller().scrollTo(0, 0);
        
        // спрячем ненужное
        this.getFilterButton().setHidden(filter == null);
        this.getSortButton().setHidden(filter != null);
    },
    
    goBack: function() {
        return false;
    }
})
