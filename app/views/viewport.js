Afisha.views.Viewport = Ext.extend(Ext.TabPanel, {
    id: 'Viewport',
    fullscreen:true,
    items: [
    {
        id:'MainView',
        iconCls: 'home-icon',
        title: 'Главная',
        iconMask: true,
        layout: 'card',     
        cardAnimation : 'slide', 
        items:[
        {
            xtype: 'CategoriesContainer'
        },
        {
            xtype: 'EventsViewport'
        },
        {
            xtype: 'detailsView', 
            id:'detailsPlaces',
            type:'place'
        },

        {
            xtype: 'detailsView', 
            id:'detailsEvents',
            type:'event'
        },

        {
            xtype: 'fullScheduleView'
        },
        {
            xtype: 'mapView'
        },

        {
            xtype: 'commentsView'
        },

        {
            xtype: 'SendNews', 
            id:'SendComment', 
            onlyComment:true
        }
        ]
    },
    /*{
        title: 'Отправить новость',
        iconMask: true,
        iconCls: 'podcast-icon',
        xtype: 'SendNews'
    },*/
    {
        title: 'Избранное',
        iconMask: true,
        iconCls: 'fav-icon',
        xtype: 'Favorites',
        id: 'Favorites'
    },
    {
        title: 'Информация',
        iconMask: true,
        iconCls: 'share-icon', //settings
        xtype: 'Share'
    }
    ],
    backTap:function(){
        if (!this.tabBar.isHidden() && !Afisha.showButtons)
        {
            this.tabBar.hide();
            this.componentLayout.childrenChanged = true;//sencha-bugs?
            this.doComponentLayout();
            return true;
        }
    },
    tabBar: {
        dock: 'bottom',
        hidden:!Afisha.showButtons,
        modal:!Afisha.showButtons,
        //ui: g_ui,
        layout: {
            pack: 'center'
        },
        listeners:{
            change:function(me,tab,card){
                if (card.id == 'MainView')
                    Ext.dispatch({      
                        controller: 'main',
                        action: 'home'
                    });
                if (card.id == 'Share') {
                    Ext.dispatch({
                        controller: 'main',
                        action: 'showSharePage',
                        toView:'ShareMain',
                        from: 'viewport'
                    });
                }
                if (!Afisha.showButtons)
                {
                    me.hide();
                    me.ownerCt.componentLayout.childrenChanged = true;//sencha-bugs?
                    me.ownerCt.doComponentLayout();
                }
            }
        }
    },

    listeners: {
        afterrender: function() {
            adv.event('app_loaded');
        } ,
        beforecardswitch: function(me) {
            if( Ext.is.Android )
                this.el.addCls('nobackface');          
        }
    },
    
    initComponent: function() {
        Afisha.views.Viewport.superclass.initComponent.apply(this, arguments);
        this.addDocked({
            xtype: 'Adv', 
            dock:'bottom'
        });
        if( Ext.uf.noLocalStorage ) {
            this.remove('Favorites');
        }

    }
});

Ext.reg('AfishaMain', Afisha.views.Viewport);