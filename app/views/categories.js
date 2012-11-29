Afisha.views.CategoriesContainer = Ext.extend(Ext.Panel, {
    id: 'Home',
    dockedItems: [{
        xtype: 'toolbar',
        title: G.app_name,
        height:'2.2em',
        ui:g_ui,
        setTitle: function(title){//переопределяем стандартную ф-цию
            if (this.rendered)
            {
                this.down('#rootTitle').update(title);
                this.doComponentLayout();
            }
            this.title = title;
        },
        afterRender : function() {
            Ext.Toolbar.superclass.afterRender.call(this);
            if (this.title) {
                this.down('#rootTitle').update(this.title);
                this.doComponentLayout();
            }
        },
	items:[
		{ui:'back', text:'Выход', handler: Afisha.exit, hidden: !Ext.is.Nokia },
                {xtype: 'panel', id:'rootTitle', layout:'fit', cls:'myToolbar', flex:1},
	]
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: Afisha.stores.CategoriesStore,
        itemTpl: '<div class="list-item-title" style="font-size:' + ( Ext.is.Nokia ? '18' : '12' ) + 'pt">{name}</div>',
        onItemDisclosure: true,
        disableSelection:true,
       // plugins:['listadv'],
        listeners: {
           itemtap: function(list, index, item, e){
                var ds = list.getStore();
                var rec = ds.getAt(index).data;
                Ext.dispatch({     
                  controller: 'main',
                  action: rec.subcategories ? 'showSubCategory' : 'showItems',
                  record: rec,
                  model: ds.getProxy().getModel,
                  list: this
              });
              return true;
           }
       }
    }],
    initComponent: function() {
        Afisha.views.CategoriesContainer.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('CategoriesContainer', Afisha.views.CategoriesContainer);