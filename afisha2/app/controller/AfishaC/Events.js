
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
        this.sortType = {};
        this.sortType[this.getEventsList().id] = 'alphabet';
        this.sortType[this.getPlacesList().id] = 'alphabet';
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
    onSortMenuItemPress: function(val) {
        this.sortType[this.getTabpanel().getActiveItem().id] = val;
        console.log('pressed ' + val);
    },
    onSortButtonPress: function() {
        if( !this.sortpopup )
            this.sortpopup = Ext.create('widget.popuplist');
        
        var data;
        var activeItem = this.getTabpanel().getActiveItem();
        
        if( activeItem === this.getEventsList() )
            data = [
                    { name:'Алфавиту', value:'alphabet' },
                    { name:'Рейтингу', value:'rating' }

                ]
            else
            data = [
                    { name:'Алфавиту', value:'alphabet' },
                    { name:'Рейтингу', value:'rating' },
                    { name:'Расстоянию', value:'distance' }

                ];
        
        if( this.sortpopup.lastPanel != activeItem ) {
            this.sortpopup.setTitle('Сортировать по');
            this.sortpopup.setFn({ Fn: this.onSortMenuItemPress, scope: this});
            this.sortpopup.setData(data);
            this.sortpopup.lastPanel = activeItem;
            this.sortpopup.select(this.sortType[activeItem.id]);
        }

        this.sortpopup.showBy(this.getSortButton());
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
        //this.getSortButton().setHidden(filter != null);
        
        this.onSearchClear();
        this.getSearchPanel().setHidden(true);
        
    },
    
    goBack: function() {
        if( !this.sortpopup.getHidden() ) {
            this.sortpopup.hide();
            return true;
        }
        if( !this.getSearchPanel().getHidden() ) {
            this.onSearchClear();
            this.getSearchPanel().setHidden(true);  
            return true;          
        }
        return false;
    }
})
