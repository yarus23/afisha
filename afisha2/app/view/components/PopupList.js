// todo: calculate width

// todo: чекбоксы и состояние
// todo: собственно сама сортировка
// todo: все через опции как в сенче

Ext.define('Afisha.view.components.PopupList', {
	extend: 'Ext.Panel',
	xtype: 'popuplist',
    config: {
        layout:{
            type:'vbox',
            align: 'strech'
        },
        modal:true,
        width:'auto',
        hideOnMaskTap: true,
        height:'1px',
        items:[
            { text: 'Use setTitle'},
            {
                xtype: 'list',
                scrollable: {
                    disabled: true
                },
                width:'auto',
                style:'white-space:nowrap',
                itemTpl : '<tpl if="selectable==false">\
                               <div style="color:gray;width:auto">{name}</div>\
                           <tpl else>\
                               {name}\
                           </tpl>',
                store:{
                    fields:[
                    { name:'name', type:'string' },
                    { name:'value', type:'string' },
                    { name: 'selectable', type: 'bool' }
                ],
                data:[
                    { name:'data', value:'1' },
                    { name:'is not', value:'1' },
                    { name:'defined', value:'1' }

                ]
            }
        }],
        listeners:{
            initialize: function(panel) {
                // prevent some items from being selectable
                var list = panel.getItems().getAt(1);
                list.addBeforeListener('itemtap', function(list, index, target, record, options) {
                    if (record.data.selectable === false) {
                        list.up('popuplist').hide();
                        return false;
                    }
                });
                list.on('itemtap', function(list, index, target, rec, event) {
                    this.hide();
                }, this);          
            },
            show: function(panel) {
                var me = this;
                var f = function() {
                   if( me.shrink(panel) ) {
                      clearInterval(me.timerId);
                      me.setVisibility(true);
                   }
                }
                this.timerId = setInterval(f, 70);
            }
        }        
    },
    showBy: function(component, alignment) {
        // we do not know width/height of list yet
        this.callParent(arguments);
        this.setVisibility(false);
    },
    shrink: function(panel) {
        var list = panel.getItems().getAt(1);
        var itemCount = list.getStore().getCount();
        if( !itemCount) return;
        var item_el = list.element.down('.x-list-item');
        if( !item_el ) return false;
        
        var itemHeight = item_el.getHeight();
        var calculatedHeight = itemHeight*itemCount;
        var titleHeight = panel.getAt(0).element.getHeight();
        list.setHeight(calculatedHeight);
        panel.setHeight(calculatedHeight + 4 + titleHeight);
        
        return true;
    },
    setData: function(data) {
        this.getItems().getAt(1).getStore().setData(data);
    },
    getData: function(data) {
        this.getItems().getAt(1).getStore().getData(data);
    },
    setFn: function(fn) {
        if( fn.Fn === this.fn ) return;
        this.getItems().getAt(1).on('select', function(list, record) {
                var value = record.get('value');
                fn.Fn.call(fn.scope, value);
            }, this); 
        this.fn = fn.Fn;
    },
    setTitle: function(text) {
        this.getItems().first().setHtml(text);
    },
    select: function(value, keepExisting, supressEvent) {
        console.log('select ' + value);
        var store = this.getItems().getAt(1).getStore();
        var idx = store.findExact('value', value);
        if( idx > -1 ) this.getItems().getAt(1).select(idx, keepExisting,  supressEvent);
    }
});
