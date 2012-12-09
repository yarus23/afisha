Ext.define('Afisha.controller.AfishaC.Events', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            toolbar: 'events titlebar',
            backButton: 'events titlebar button',
            tabpanel: 'events tabpanel',
            eventsList: 'events tabpanel #eventsList',
            placesList: 'events tabpanel #placesList',
        },

        control: {
            backButton:{
                tap:'onBackButtonTap'
            }
        }
    },
    launch: function(){
        // вызываем из контроллера категорий
        this.getApplication().on({
            setCatName: this.setupDialog,
            scope: this});
            
    },
    setupDialog: function(name, eventsName, placesName, onlyPlaces) {
        // имя диалога
        this.getToolbar().setTitle(name);
        
        // имена кнопок
        this.getTabpanel().getTabBar().getAt(0).setTitle(eventsName);
        this.getTabpanel().getTabBar().getAt(1).setTitle(placesName);
        
        // переключим на places если нужно
        this.getTabpanel().setActiveItem(onlyPlaces ? 1 : 0)
        
        // скроем тулбар если нужно
        this.getTabpanel().getTabBar().setHidden(onlyPlaces);
        
        // передернем список

        this.getPlacesList().getScrollable().getScroller().scrollTo(0, 0);
        this.getEventsList().getScrollable().getScroller().scrollTo(0, 0);
    },
    onBackButtonTap: function() {
        this.getViewport().animateActiveItem(0, {type: 'slide', direction: 'right'})        
    }
})
