Ext.require('Afisha.view.components.PopupList');

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
            sortButton: 'events titlebar #sortButton',
            searchEdit: 'events fieldset textfield',
            searchPanel: 'events fieldset'
        },
        control: {
            tabpanel:{
                activeitemchange: 'onSwitch'
            },
            placesList:{
                itemtap:'onPlacesListItemTap'
            },
            eventsList:{
                itemtap:'onEventsListItemTap'
            },
            sortButton:{
                tap: 'onSortButtonPress'
            },
            searchButton:{
                tap: 'onSearchButtonPress'
            },
            searchEdit:{
                keyup: 'onSearchKeyUp',
                clearicontap:'onSearchClear'
            }
        }
    },
    initView:function(opt){
        this.setupDialog(opt.name, opt.eventsName,opt.placesName, opt.onlyPlaces, opt.filter);
    },
    onSwitch: function(){
        var me = this;
        setTimeout(function() { me.onSearchClear(); }, 300);
        this.getSearchPanel().setHidden(true);
    },
    onSearchKeyUp: function(field) {
        var value = field.getValue();
        var store = this.getTabpanel().getActiveItem().getStore();
        if(value){
           var match = '(' + value.replace(/ /g,'|') + ')';
           store.filter('name',new RegExp(match,'gi'));
        } else
           store.clearFilter();
    },
    onSearchClear: function() {
        this.getPlacesList().getStore().clearFilter();
        this.getEventsList().getStore().clearFilter();
        this.getSearchEdit().setValue('');
    },
    onSearchButtonPress: function() {
        var doShow = this.getSearchPanel().getHidden();
        
        if( !doShow ) {
            // сбросить фильтры
            this.onSearchClear();
        } else {
            this.getSearchEdit().setValue('');
            this.getSearchEdit().focus();
        }
        this.getSearchPanel().setHidden(!doShow);
    },
    onSortButtonPress: function() {
        var popoverpanel = Ext.create('widget.popuplist');
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
        
        this.onSearchClear();
        this.getSearchPanel().setHidden(true);
        
    },
    
    goBack: function() {
        return false;
    }
})
