// todo: посмотреть как большой список в landscape
// todo: при показанном поиске кнопка назад сначала отключает поиск
// todo: баг с remove и popup окном



// todo: описать все фильтры

// todo: подпинать дизайн
// todo: уважать настройку gps
// todo: кнопки фильтра и сортировки
// todo: менее прозрачная load mask сначала
// todo: все фильмы делить на категории в прокате и скоро
// todo: есть ли смысл во всех показывать прошедшие фильмы сегодня?

// test: в onsize пересчитать ellipsis

// done:
// todo: в горизонтали иконки tileview уезжают
// todo: при слайдинге видна черная полоса внизу
// todo: ellipsis в спискtах
// todo: не включать distance если нет gps
// todo: первоначально сортировать
// todo: выборку по дате
// todo: сортировку в фильтрах

var distanceSort = new Ext.util.Sorter({
 
                sorterFn: function(l1, l2) {
                    if( typeof l1.data.lat !== 'number' || 
                        typeof l1.data.lng !== 'number' ||
                        typeof l2.data.lat !== 'number' ||
                        typeof l2.data.lng !== 'number' ) { return 1; }
                    var d1 = Geo.dist(l1.data.lat, l1.data.lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
                    var d2 = Geo.dist(l2.data.lat, l2.data.lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
                    return d1 > d2 ? 1 : (d1 < d2 ? -1 : 0);
                }
            });
            
Ext.define('Afisha.controller.AfishaC.Events', {
    extend: 'Ext.app.Controller',
    
    config: {
        //чтобы при переходе назад на этот экран был открыт таб с которого пришли
        lastTabNum:0,
        categoryId: '', // текущая выбранная категория
        refs: {
            viewport: 'aviewport',
            view:'events',
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
            view: {
                setFilter: 'onSetFilter',
                sortBy: 'onSortBy'
            },
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
            filterButton:{
                tap: 'onFilterButtonPress'
            }
        }
    },
    init:function() {
        this.control({
            searchEdit: {
                keyup: Ext.Function.createBuffered(this.onSearchKeyUp, 400, this),
                clearicontap:'onSearchClear'
            }
        });
        Afisha.initListWidth();       
    },
    initView:function(opt){
        this.getEventsList().sortConfig = { 
            type: 'filterAllDays', 
            caption: 'Выбрать за',
            fn:this.onFilterByDatePressed,
            getData: function() { return [
                    { name:'Сегодня', value:'filterCurrentDay' },
                    { name:'Завтра', value:'filterNextDay' },
                    { name:'Текущую неделю', value:'filterCurrentWeek' },
                    { name:'Следущую неделю', value:'filterNextWeek' },
                    { name:'Все', value:'filterAllDays' }
                ]} };
        this.getPlacesList().sortConfig = { 
            type: 'alphabet', 
            fn: this.onSortMenuItemPress,
            caption: 'Сортировать по',
            getData: function() { return [
                    { name:'Алфавиту', value:'alphabet' },
                    { name:'Рейтингу', value:'rating' },
                    { name:'Расстоянию', value:'distance', selectable: (Afisha.useGPS && Afisha.position) }

                ] }};
        this.setupDialog(opt.name, opt.eventsName,opt.placesName, opt.onlyPlaces, opt.filter, opt.id);
    },
    onFilterButtonPress:function(){
       var dialog = Ext.create('widget.filterview');
       dialog.show();
       dialog.fireEvent('construct', this.getCategoryId());
    },
    onSortBy: function(type) {
        this.onSortMenuItemPress(type);
    },
    onSetFilter: function(params) {
/*        var f = [];
        for( var i in params ) {
            if( params[i] && params[i] > 0 )
                f.push({ property: i, value: params[i]});
        }*/
        this.getPlacesList().getStore().clearFilter(true);
        this.getPlacesList().getStore().filterBy(function(rec) {
				var pass = true;
				
				for( var i in params ) {
				  if( !pass ) return false;
				  
				  if( params[i] && params[i] > 0 ) {
					  var a = rec.get(i);
					  if( a instanceof Array )
					     pass = pass &&  (a.indexOf(params[i]) > -1 );
					  else pass = pass && (a == params[i]);
				  }
			     }
				 return pass;
			});
    },
    onSwitch: function(){
        var me = this;
        setTimeout(function() { me.onSearchClear(); }, 300);
        this.getSearchPanel().setHidden(true);
    },
    onSearchKeyUp: function() {
        var value = this.getSearchEdit().getValue();
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
    onFilterByDatePressed: function(val) {
        this.getTabpanel().getActiveItem().sortConfig.type = val;
        var store = this.getTabpanel().getActiveItem().getStore();
        
        var date = null;
        switch(val) {
            case 'filterCurrentDay':
                date = new Date();
                break;
            case 'filterNextDay':
                date = new Date();
                date.nextDay();
                break;
            case 'filterCurrentWeek':
                date = 'week';
                break;
            case 'filterNextWeek':
                date = 'nextweek';
                break;
            default:
                store.clearFilter();
                return;
        }
        store.clearFilter();
        store.filterBy(function(rec) {
            // найдем в расписании
            var schStore = Ext.getStore('Schedule');
            var id = rec.data.id;
            var start_date;
            var start_time;
            var end_date;
            schStore.each(function(event){
                if( event.data.event_id == id ) {
                    if( !start_date && !end_date ) {
                        start_date = end_date = event.data.start_date;
                        start_time = event.data.start_time;
                        return;
                    }
                    if( event.data.start_date <= start_date && event.data.start_time < start_time ) {
                        start_date = event.data.start_date;
                        start_time = event.data.start_time;
                    }
                    if( event.data.start_date > end_date )
                        end_date = event.data.start_date; 
                }
            });
            return Afisha.schMethods.compareDates(date, start_date, end_date) && 
                 start_time >= new Date().format('H:i');
        });
    },
    onSortMenuItemPress: function(val) {
        this.getTabpanel().getActiveItem().sortConfig.type = val;
        var store = this.getTabpanel().getActiveItem().getStore();
        
        switch( val ) {
            case 'alphabet':
                store.sort([{
                        property: 'sort',
                        direction: 'DESC'}, 
                        quotesSort]);
                break;
            case 'rating':
                store.sort([{
                        property: 'sort',
                        direction: 'DESC', 
                    }, {
                        property: 'vote',
                        direction: 'ASC'
                    }]);
                break;
            case 'distance':
                store.sort([{
                        property: 'sort',
                        direction: 'DESC', 
                    }, distanceSort])
        }
    },
    onSortButtonPress: function() {
        if( !this.sortpopup )
            this.sortpopup = Ext.create('widget.popuplist', { id: 'sortpopup'} );
        
        var activeItem = this.getTabpanel().getActiveItem();
        
        if( this.sortpopup.lastPanel != activeItem ) {
            this.sortpopup.setTitle(activeItem.sortConfig.caption);
            this.sortpopup.setFn({ Fn: activeItem.sortConfig.fn, scope: this});
            this.sortpopup.setData(activeItem.sortConfig.getData());
            this.sortpopup.lastPanel = activeItem;
            this.sortpopup.select(activeItem.sortConfig.type, false, true);
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
    setupDialog: function(name, eventsName, placesName, onlyPlaces, filter, id) {
        
        this.setCategoryId(id);
        
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
        if( this.sortpopup && !this.sortpopup.getHidden() ) {
            this.sortpopup.hide();
            return true;
        }
        if( !this.getSearchPanel().getHidden() ) {
            this.onSearchClear();
            this.getSearchPanel().setHidden(true);  
            return true;          
        }
        var filterview = Ext.Viewport.down('filterview')
        if (filterview != null){
            Ext.Viewport.remove(filterview);
            return true;
        }
        return false;
    },
    launch: function(){
        //em to pixels for XTemplates
        var em,
            container,
            bodyImageWidth;
        container = this.getViewport().element;
        em = new Ext.Element(document.createElement('div'));
        em.setStyle('height','0em');
        em.setStyle('width','1em');
        container.appendChild(em);
        this.em = em.getWidth();
        Ext.XTemplate.addMember('em',this.em);
        Ext.XTemplate.addMember('eventListImgSize',Math.ceil(this.em*4.3));
        Ext.XTemplate.addMember('newsListImgSize',Math.ceil(this.em*3));
        container.removeChild(em);
    }
})
