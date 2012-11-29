// todo: laizy instantiation?
// todo: enter:top exit:bottom не работает exit
// todo: не удается отключить анимацию по желанию
// todo: при смене с Places to events и оновременное показе eventsviewport видим старую анимацию
// todo: при onOrientationChange пересчитать жанр

Afisha.SortButton = Ext.extend( Ext.Button, {
     cls:'sortbtn',
     width:'4em',
     id:'sortbtn',
     text: 'Фильтр',
//     iconCls: 'sortIcon',
//     iconMask:true,
     valueField: 'value',
     displayField: 'text',
     filterCatigories:['cafe','bath','pool','shop','fitnes'],
     hideCategories:['beauty'],
     //iconCls: 'sortIcon',
     //iconMask:true,
     //hidden:true,
     //handler: this.sortButtonTap,
    checkIcon:function(type)
    {
        return;
        if (!type)
            return;
        if (this.hideCategories.indexOf(type) != -1)
        {
            this.hide();
        }
        else
            if (this.isHidden())
                this.show();
        //console.log('CI')
        if (this.filterCatigories.indexOf(type) != -1)
        {
            this.setIconClass('');
            this.setWidth('4em');
            this.setText('Фильтр');
            this.ownerCt.doComponentLayout();
        }
        else
        {
            this.setText('');
            this.setWidth('4em');//('2.2em');
            this.setIconClass('sortIcon x-icon-mask');
            this.ownerCt.doComponentLayout();
        }
    },
    getListPanel: function() {
        if (true || !this.listPanel) {
            this.listPanel = new Ext.Panel({
                floating         : true,
                stopMaskTapEvent : true,
                hideOnMaskTap    : true,
                cls              : 'x-select-overlay',
                scroll           : 'vertical',
                items: {
                    xtype: 'list',
                    store: this.store,
                    itemId: 'list',
                    scroll: false,
                    itemTpl : [
                        '<span class="x-list-label">{' + this.displayField + '}</span>',
                        '<span class="x-list-selected"></span>'
                    ],
                    listeners: {
                        itemtap: this.onListItemTap,
                        select : this.onListSelect,
                        scope  : this
                    }
                }
            });
        }

        return this.listPanel;
    },
    onListItemTap: function(list, index, item, e){
        if (this.store.findExact(this.valueField, this.value) == index)
            this.listPanel.hide({
                type: 'fade',
                out: true,
                scope: this
            });
        else 
            return;
    },
    onListSelect: function(selModel, selected) {
        if (selected) {
            this.setValue(selected.get(this.valueField));
            this.fireEvent('change', this, this.getValue());

            var viewport = this.up('EventsViewport');
            var activeItem = viewport.tabs.getActiveItem();
            activeItem.sortType = this.value;
            activeItem.store.curFilter = this.value;
        }
        
        this.listPanel.hide({
            type: 'fade',
            out: true,
            scope: this
        });
        Ext.dispatch({      
          controller: 'main',
          action: this.value
        });
        //if (Ext.is.iPad && this.value == 'sortByDistance')
        //    Ext.Msg.alert(G.app_name, 'Для более точного определения местоположения нужен GPS');
    },
    setValue: function(value){
      this.value = value;
      return this;
    },
    getValue: function() {
      return this.value;
    },
    setOptions: function(options, append) {
      if (!options) {
            this.store.clearData();
            this.setValue(null);
      }
      else {
          this.store.loadData(options, append);
      }
    },
    reset: function() {
       this.setValue(this.originalValue);
    },   
     initComponent: function() {
        var options = this.options;

        if (this.store) {
            this.store = Ext.StoreMgr.lookup(this.store);
        }
        else {
            this.store = new Ext.data.Store({
                fields: [this.valueField, this.displayField]
            });

            if (options && Ext.isArray(options) && options.length > 0) {
                this.setOptions(this.options);
            }
        }

        Ext.Button.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event change
             * Fires when an option selection has changed
             * @param {Ext.form.Select} this
             * @param {Mixed} value
             */
            'change'
        );
    },
    showList: function() {
        // текущий список
        var viewport = this.up('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        switch( activeItem.getId() ) {
            case 'FilmsList':this.options = [
                                 {text: 'По алфавиту', value: 'sortByAsc'},
                                 {text: 'По рейтингу', value: 'sortByRating'} ];
                              break;
            case 'EventsList':this.options = [
                                 {text: 'Сегодня', value: 'filterCurrentDay'},
                                 {text: 'Завтра', value: 'filterNextDay'},
                                 {text: 'Текущая неделя', value: 'filterCurrentWeek'},
                                 {text: 'Следущая неделя', value: 'filterNextWeek'},
                                 {text: 'Все', value: 'filterAllDays'},
                             ];//,
                                 //{ text: 'По дате', value: 'sortByDate'}];
                              break;
            case 'PlacesList':this.options = [
                                 {text: 'По алфавиту', value: 'sortByAsc'},
                                 {text: 'По рейтингу', value: 'sortByRating'},
                                 {text: 'По расстоянию', value: 'sortByDistance'}];
        }  
       this.setOptions(this.options, false);
       
         this.value = activeItem.sortType;

         if( !this.value )
         {
             var listPanel = this.getListPanel();
             listPanel.showBy(this.el, 'fade', false);
             return;
         }
             //this.value = 'sortByAsc';
         
         var listPanel = this.getListPanel(),
             index = this.store.findExact(this.valueField, this.value);

         listPanel.showBy(this.el, 'fade', false);
         listPanel.down('#list').getSelectionModel().select(index != -1 ? index: 0, false, true);      
    },
    handler: function(btn) {
              var parent = btn.up('EventsViewport');
              if (this.filterCatigories.indexOf(parent.comeFrom) != -1)
              {
                    if( !parent.picker )
                    parent.picker = new Afisha.picker({
                       callback: function(data) {parent.refilter(data)},
                       scope: parent
                    });
                    parent.picker.show();
              }
              else
                   this.showList();
                //console.log(parent.comeFrom);

          }
        });


Afisha.picker = Ext.extend( Ext.Panel, {
           //todo: перенести описание фильтров в store
           filters: Afisha.filters,
           listeners: {
               beforeshow: function(el) {
                   var eventList = Ext.getCmp('EventsViewport');
                   var tab = eventList.tabs.getActiveItem();
                   if( tab.xtype == 'EventsList' || tab.xtype == 'FilmsList')
                      this.down('#byDistance').hide();
                   else
                      this.down('#byDistance').show();
                  
                   if( this.filters[eventList.comeFrom] ) {
                       el.query('#resetBtn, #cafeTitle').forEach(function(el) {el.show()});
                       var adv = el.query('.Adv')[0];
                       if (adv)
                           adv.hide()
                       el.query('#filterBtn')[0].show();
                       el.down('.fieldset').updateFields(this.filters[eventList.comeFrom],eventList.comeFrom);
                   } else {
                       el.query('.fieldset, #resetBtn, #cafeTitle').forEach(function(el) {el.hide()});
                       var adv = el.query('.Adv')[0];
                       if (adv)
                           adv.show()
                       el.query('#filterBtn')[0].hide();
                   }
               }
           },
           fullscreen:true,
           modal:true,
           floating:true,
           scroll:'vertical',
           style:'padding:0;border-radius:0px',
           hideOnMaskTap:false,
           cls: 'sortPicker',
            layout: {
                type: 'auto'
            },
           dockedItems:[{
            title: 'Выбор',
            xtype:'toolbar',
            ui:g_ui,
            
            items: [
                {
                   text: 'Назад',
                   ui: 'back',
                   id: 'backBtn',
                   handler: function(btn){
                       var panel = btn.up('.panel');
                       panel.hide()
                   },
                   scope: this
                },
                {xtype: 'spacer'}
            ],
            height:'2.2em'
           }],
           items:[      {
                           xtype:'component', 
                           html:'Сортировать по:',
                           componentCls:'sortTitle'
                        },
                        {
                            xtype: 'segmentedbutton',
                            allowDepress: false,
                            cls:'small-font',
                            margin:'10 0',
                            layout: {type: 'hbox', pack: 'center', align: 'stretch'},
                            items:[{
                                    text: 'Алфавиту',
                                    //pressed: true,
                                    handler:function(btn){
                                       Ext.dispatch({      
                                       controller: 'main',
                                       action: 'sortByAsc'
                                       });
                                       btn.up('.panel').hide();
                                    }
                                },
                                {
                                    id: 'byDistance',
                                    text: 'Расстоянию',
                                    handler:function(btn){
                                       Ext.dispatch({      
                                       controller: 'main',
                                       action: 'sortByDistance'
                                       });
                                       btn.up('.panel').hide();
                                       //if (Ext.is.iPad)
                                       //    Ext.Msg.alert(G.app_name, 'Для более точного определения местоположения нужен GPS');
                                    }
                                },
                                {
                                    text: 'Рейтингу',
                                    handler:function(btn){
                                       Ext.dispatch({      
                                       controller: 'main',
                                       action: 'sortByRating'
                                       });
                                       btn.up('.panel').hide();
                                    }
                         }]
                        },
                        /*{
                           xtype:'component', 
                           html:'Выбор ресторана:',
                           componentCls:'sortTitle',
                           id:'cafeTitle'
                        },*/
                        {
                            xtype:'fieldset',
                            //title:'Выбор ресторана:',
                            updateFields:function(fields,category){
                                if (this.cat == category)
                                {
                                    this.show();
                                    return;
                                }
                                this.removeAll();
                                for (var i = 0; i < fields.length; i++)
                                {
                                    this.add({
                                        label:fields[i].label,
                                        name:fields[i].id,
                                        id:fields[i].id,
                                        store:Afisha.stores[fields[i].store]
                                    })
                                }
                                this.cat = category;
                                this.show();
                                this.doComponentLayout();
                            },
                            defaults: {
                               //labelAlign: 'right',
                               labelWidth: '35%',
                               plugins:['classiccombo'],
                               xtype:'customselectfield',
                               customPos:true
                            },
                        },{
                            xtype:'container',
                            layout: {type: 'hbox', pack: 'center', align: 'stretch'},
                            defaults:{style: 'font-size:smaller;margin:0 0.5em;width:35%'},
                            items:[
                                 {
                                   xtype:'button', id:'resetBtn',
                                   //style:'margin:0 auto; width:10em;font-size:smaller',
                                   text:'Сбросить',
                                   handler: function(btn) {
                                      var parent = btn.up('.panel');
                                      parent.query('.customselectfield').forEach(function(el){
                                      el.reset();
                                   });
                                   }
                            }, {
                               xtype: 'button', id: 'filterBtn',
                               text: 'Выбрать',
                               scope:this,
                               handler: function(btn) {
                                   var panel = btn.up('.panel');
                                   var fieldset = panel.down('fieldset');
                                   var ret = {};
                                   fieldset.query('customselectfield').forEach(function(el){ret[el.id] = el.getValue();})
                                   panel.callback.call(panel.scope, ret);
                                   panel.hide();
                               }
                            }
                        ]}/*,
                        {
                            xtype:'Adv',
                            width:'100%'
                        }*/

           ],
           backTap:function(){
               
               var fs = this.down('fieldset');
               if (fs.isHidden())
                   return false;
               var retVal = false;
               fs.query('customselectfield').forEach(function(el) {
                   if(el.listPanel && !el.listPanel.isHidden())
                   {
                        retVal = true;
                        el.listPanel.hide();
                   }
               });
               return retVal;
           },
          initComponent: function() {
             Afisha.picker.superclass.initComponent.apply(this, arguments);

          }
        });

Afisha.listTpl = new Ext.XTemplate(
              '<tpl if="name">',
                '<div class="list-first-line">',
                   '{[this.vote(values.vote, values.type, values.trailer)]}',
                   '<div class="list-item-title">{name}</div>',
                '</div>',
                '<tpl if="address.length">',
                    '<div class="list-second-line">',
                       '<span class="distance">{[this.getDistanceStr(values)]}</span>',
                       '<div class="list-item-content">{address}</div>',
                    '</div>',
                '</tpl>',
                '<tpl if="cast || this.ifaddr(values)">',
                    '<div class="list-second-line event-description"><div class="list-item-content">{genre} <tpl if="cast">({cast})</tpl></div></div>',
                '</tpl>',
                '<tpl if="place_name || start_date || finish_date">',
                    '<div class="list-second-line event-description schedule-description"><div class="list-item-content">',
                        '<div class="event-where">{place_name}</div>',
                        '<div class="event-when">,&nbsp;{[this.representDate(values.start_date)]}<tpl if="finish_date"> - {[this.representDate(values.finish_date)]}</tpl></div>',
                    '</div></div>',
                '</tpl>',
              '</tpl>',
             {
                 compiled:true,
                 vote: Afisha.getRatingHtml,
                 getDistanceStr: Afisha.getDistanceStr,
                 ifaddr: function(val) {return val.genre && !val.address},
                 representDate:function(dateStr){
                     dateStr = dateStr.split('-');
                     if (dateStr.length <3)
                         return '';
                     return (dateStr[2][0] == '0' ? dateStr[2][1].toString() : dateStr[2]) + getMonthShortName(dateStr[1]);
                 }
             });


Afisha.views.commonList = Ext.extend(Ext.ux.BufferedList, {
    itemTpl: Afisha.listTpl,
    scroll:'vertical',
    flex:1,
    store:'',
    height:'2.7em',
    disableSelection:true,
    minimumItems: Ext.is.Tablet ? 25 : 15,
    batchSize:5,
    cleanupBoundary: Ext.is.Tablet ? 35 : 20,
    maxItemHeight:48,
    removeWhileScroll: Ext.is.Android && !Ext.is.Tablet,
    emptyText: '<div style="position:absolute;left:50%;top:50%;margin-left:-3em;color:gray">Список пуст</div>',
    deferEmptyText:false,
    
    updateWidth: function () {
        
       if( !this.scroller ) return; 
       if( this.scroller.isScrolling  ) return;
       
       this.getVisibleItems().forEach(function(node){
           node = Ext.fly(node);

// todo: первый раз делать updateWidth before show
           var stars = node.down('img.teststar')//('div.superstars,div.superstar');
           stars = stars?stars:node.down('div.stars-set');
           if( !stars ) return;
           if( !this.titleWidth )
               this.titleWidth = node.getWidth() 
                - node.getPadding('lr') 
                - node.getBorderWidth('lr') - 
                stars.getWidth();
           var title = node.down('.list-item-title');
           if( title ) title.setWidth(this.titleWidth);

           var distance = node.down('.distance');
           if( distance ) {
              var addressWidth = node.getWidth() 
                 - distance.getWidth()
                 - node.getPadding('lr')
                 - node.getBorderWidth('lr');
              node.down('.list-item-content').setWidth(addressWidth);
           }
        });
    },
    itemCleanup: function() {
        Afisha.views.commonList.superclass.itemCleanup.apply(this, arguments);
        if( this.isVisible() )
            this.updateWidth();        
    },
    listeners: {
       
       show: function() {
           this.resetScroll();
           this.updateWidth();
       },

       beforeactivate: function(list) {
         if( this.store != this.applyStore ) {
            if (this.applyStore && this.applyStore.resetSort)
                this.applyStore.resetSort();
            this.bindStore(this.applyStore);
         }
         if (this.store)
            this.up('EventsViewport').topToolbar.checkFilterBtn(this.store);
         this.resetScroll();
         //this.updateWidth();
       },
       itemtap: function(list, index, item, e){
           
           // WTF???!!!
           if( !this.start )
             this.start = new Date().getTime();
           else {
              var elapsed = new Date().getTime() - this.start;
           
              if( elapsed < 500 ) return;
              
              // новый цикл
              this.start = new Date().getTime();
           }
           
           var ds = list.getStore();
           //alert(1);
           //debugger;

           Ext.dispatch({      
              controller: 'main',
              action: this.action,
              data:ds.getAt(index),
              record: ds.getAt(index).data,
              model: ds.getProxy().getModel(),
              store: this.store,
              type: this.type,
              category: this.storeName
          });
          
          return false;
       }
    },
    initComponent: function(){
       this.updateWidthTask = new Ext.util.DelayedTask(this.updateWidth, this);
       Afisha.views.commonList.superclass.initComponent.apply(this, arguments);
    }
}
);

Afisha.views.eventsList = Ext.extend(Afisha.views.commonList, {
    grouped:true,
    id: 'EventsList',
    action: 'showEventDetails',
    cls: Ext.is.Android ? 'nobackface' : ''
});

Afisha.views.filmsList = Ext.extend(Afisha.views.commonList, {
    grouped:true,
    id: 'FilmsList',
    action: 'showEventDetails',
    cls: Ext.is.Android ? 'nobackface' : ''
});

Afisha.views.placesList = Ext.extend(Afisha.views.commonList, {
    id: 'PlacesList',
    grouped:true,
    cls: Ext.is.Android ? 'nobackface' : '',
    action: 'showPlaceDetails'
});

Afisha.views.EventsViewport = Ext.extend(Ext.Panel, {
    id: 'EventsViewport',
    layout: 'card',
    picker:null,
    cls: Ext.is.Android ? 'nobackface' : '',
    listeners: {
      beforeactivate: function(){
          if( !this.fromCategories ) return;
          
          var el;
          if( this.comeFrom == 'cinema')
             el = this.down('#FilmsList');
          else el = this.down('#EventsList');
          //if(this.comeFrom == 'cafe')
          
          //this.sortButton.checkIcon(this.comeFrom);

          if( el.applyStore && el.store != el.applyStore )
          {
            el.bindStore(el.applyStore);
          }
          if (el.store && el.store.resetSort)
            el.store.resetSort();
          if(el.store)
            this.isLife = el.store.isLifeServices;
          if( this.hiddenLeft || this.isLife)
          {
             var tab = this.down('#PlacesList');
             if( tab.store != tab.applyStore ) {
               tab.bindStore(tab.applyStore);
               tab.updateWidthTask.delay(50);
             }
             if (tab.store && tab.store.resetSort)
             {
                tab.store.resetSort();
                this.topToolbar.checkFilterBtn(tab.store);
             }
          }
          //this.topToolbar.checkFilterBtn();
          this.resetSort();
      },
      show: function() {
         Ext.getCmp('Viewport').setLoading(false);

         if( !this.fromCategories ) {
             return;
         }
         this.fromCategories = false;

         var eventsId = 0;
         var filmsId = 1;

         if( this.comeFrom == 'cinema' ) {
            this.tabs.getTabBar().items.getAt(eventsId).hide();
            this.tabs.getTabBar().items.getAt(filmsId).show();
            
            this.tabs.items.getAt(eventsId).hide();
            this.tabs.items.getAt(filmsId).show();
            
        } else {
            this.tabs.getTabBar().items.getAt(filmsId).hide();
            this.tabs.getTabBar().items.getAt(eventsId).show();

            this.tabs.items.getAt(filmsId).hide();
            this.tabs.items.getAt(eventsId).show();
        }
        if( this.hiddenLeft   || this.isLife)
        {
          this.tabs.setActiveItem('PlacesList');
          
        }
        else {
          var tabName = this.comeFrom === 'cinema' ? 'FilmsList' : 'EventsList';
          this.tabs.setActiveItem(tabName);    
          this.tabs.getActiveItem().onScrollStop();
        }

        this.tabs.getActiveItem().resetScroll();

        // без этого blank list  
       this.tabs.doComponentLayout();
       this.doComponentLayout();
       this.ownerCt.doComponentLayout();
       //this.doLayout();
      }
    },
    resetSort: function(){
//       Afisha.stores.restaurantPlacesStore.clearFilter();
//       Afisha.stores.restaurantPlacesStore.sort('name', 'ASC');
//return;
//        var ai = this.getActiveItem()
//
 //      Afisha.stores.restaurantPlacesStore.clearFilter();
  //     Afisha.stores.restaurantPlacesStore.sort([paySort, quotesSort], 'ASC');

       var tab = this.down('#PlacesList');
       tab.updateWidth();
       if( this.picker ) {
          this.picker.query('.customselectfield').forEach(function(el){
                                    el.reset();});
          this.sortButton.value = null;
          //this.picker.down('segmentedbutton').setPressed(0);
       }
    },
    refilter: function(data) {
        var tab = this.down('#PlacesList');
        function isAllClear(ob){
            for (var i in ob)
            {
                if (ob[i] >= 0)
                    return false;
            }
            return true;
        };
        function checkRecord(data, record){
            var result = true;
            for (var item in data)
            {
                result = result && ((data[item] < 0) || (record.data[item] && record.get(item).indexOf(data[item].toString()) >= 0))
            }
            return result;
        };
        tab.store.hideGroups = true;
        if( isAllClear(data)) {
            tab.store.clearFilter();
            tab.updateWidth();
            return;
        }
        
        tab.store.filterBy(function(record, id){
            return checkRecord(data,record)/*(data.kitchen < 0 || (record.data.kitchen && record.get('kitchen').indexOf(data.kitchen) >= 0))
                && (data.type < 0 || (record.data.type && record.get('genre').indexOf(data.type) >= 0))
                && (data.district < 0 || (record.data.district && record.get('district').indexOf(data.district) >= 0))*/
        });
        tab.resetScroll();
        tab.store.sort();
        tab.updateWidth();
    },
    initComponent: function() {
        
        this.sortButton = new Afisha.SortButton();
        
        this.topToolbar = new Ext.Toolbar({
            //title: 'Заглушка',
            setTitle: function(title){//переопределяем стандартную ф-цию
                if (this.rendered)
                {
                    //debugger;
                    //this.down('#myTitle').doLayout();
                    this.down('#myTitle').update(title);
                    //this.doComponentLayout();
                    //console.log('settitle')
                }
                this.title = title;
            },
            afterRender : function() {
                Ext.Toolbar.superclass.afterRender.call(this);
                if (this.title) {
                    //this.down('#myTitle').doLayout();
                    this.down('#myTitle').update(this.title);
                    //this.doComponentLayout();
                    //console.log('AR')
                }
            },
            checkFilterBtn:function(store){//switch buttons
                var sbtn = this.down('#sortbtn');
                switch(store.curFilter)
                {
                    case 'noFilter':
                    {
                        if (!sbtn.isHidden())
                            sbtn.hide();
                        break;
                    }
                    default:
                    {
                        if (sbtn.isHidden())
                        {
                            sbtn.show();
                            this.doLayout()
                        }
                        //sbtn.bindOptions(store.filterOptions);
                        //sbtn.setValue(store.curFilter);
                        /*Ext.dispatch({      
                          controller: 'main',
                          action: 'validateFilterType',
                          filterName:store.curFilter
                        });*/
                        break;
                    }
                }
                this.doComponentLayout()
                
                //this.down('customselectfield').setValue(type);
            },
            items: [
                Afisha.showButtons?{xtype:'backbtn'}:{xtype:'panel', style:'display:none;'},
                {xtype: 'panel', id:'myTitle', layout:'fit', cls:'myToolbar', flex:1},
                this.sortButton
            ],
            height:'2.2em',
            ui:g_ui
        });
           
        this.tabs = new Ext.TabPanel({
                            
            ui:g_ui,
            tabBar : {
               layout : { 
                  pack : 'center' 
               },
               cls:'eventsTabBar',
               height:'2.2em'
            },
            items:[
                    {xtype: 'EventsList'},
                    {xtype: 'FilmsList'},                    
                    {xtype: 'PlacesList'}
           ]
            //,cls: 'non-flicker-tabs'
        });

        this.dockedItems = [this.topToolbar];
        this.items = [this.tabs];
        Afisha.views.EventsViewport.superclass.initComponent.apply(this, arguments);
    },
    
    //закрыть picker при нажатии аппаратной кн. Назад
    backTap:function(){
        var sf = this.sortButton;
        if (sf.listPanel && !sf.listPanel.isHidden())
        {
            sf.listPanel.hide();
            return true;
        }
        if (this.picker && !this.picker.isHidden())
        {
            if (!this.picker.backTap || !this.picker.backTap())
                this.picker.hide();
            return true;
        }
        return false;
    }    
});

Ext.reg('EventsViewport', Afisha.views.EventsViewport);
Ext.reg('EventsList', Afisha.views.eventsList);
Ext.reg('PlacesList', Afisha.views.placesList);
Ext.reg('FilmsList', Afisha.views.filmsList);