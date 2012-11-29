// todo: смена вида звездочки

var favStore = new Ext.data.Store({
    model: 'Places',
    storeId: 'favStore2',
    proxy: {
        type: Ext.uf.noLocalStorage ? 'memory' : 'localstorage',
	id: 'favStorage2'
    },
    autoLoad:true
});

Afisha.addToFavorites = function(data, category) {
   var found = favStore.findBy(function(record, id){
      return data.id === record.data.id
   });
   
   data.category = category;

   if( found > -1 )
       favStore.removeAt(found);
   else
       favStore.add(data);
   
   favStore.sync();
   
   return found < 0;
};

Afisha.views.favList = Ext.extend(Afisha.views.commonList, {
    id: 'FavList',
    store: 'favStore2',
    emptyText: '<div style="position:absolute;left:50%;top:50%;margin-left:-8.5em;margin-top:-2em;color:gray;max-width:17em">Для добавления Ваших любимых мест сюда нажмите на \"звездочку\" в диалоге просмотра</div>',
    listeners:{
        itemtap: function(me, index) {
           Ext.dispatch({      
              controller: 'main',
              action: 'showFavorite',
              category: me.store.getAt(index).data.category,
              id: me.store.getAt(index).data.id,
              index:index
           });            
        }
    }
});


Afisha.views.Favorites = Ext.extend(Ext.Panel, {
    id: 'Favorites',
    scroll:'vertical',
    fullscreen:true,
    layout:'fit',
    dockedItems:[{
            xtype:'toolbar',
            ui:g_ui,
            title:Afisha.showButtons?'':'Избранное',
            items: [Afisha.showButtons?{xtype:'backbtn',text:'На главную'}:{xtype:'spacer'},
                {xtype: 'spacer'}
            ],
            height:'2.2em'
           }],
    listeners:{
        activate:function(){
            this.down('#FavList').updateWidth();
        }
    },
    initComponent: function() {
        this.items = [];
        this.items.push(new Afisha.views.favList);
        Afisha.views.Favorites.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('Favorites', Afisha.views.Favorites);