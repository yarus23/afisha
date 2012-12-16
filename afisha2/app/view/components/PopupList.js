

Ext.define('Afisha.view.components.PopupList', {
	extend: 'Ext.Panel',
	xtype: 'popuplist',
    config: {
        modal:true,
        hideOnMaskTap: true,
        height:'30%',
        width:'30%',
        items:[{
            xtype: 'list',
            height:'100%',
            scrollable: {
               disabled: true
            },
            itemTpl: '{name}',
            store:{
                fields:[
                    { name:'name', type:'string' },
                    { name:'value', type:'string' }
                ],
                data:[
                    { name:'store', value:'1' },
                    { name:'is not', value:'1' },
                    { name:'blabla', value:'1' }

                ]
            }
        }],
        listeners:{
            show: function(panel) { var me = this; setTimeout(function(){me.shrink(panel)}, 1); }
        }
    },
    shrink: function(panel) {
       var contents = panel.getItems().first();
       var g = contents.getHtml();
       //debugger;
       var menuWrapper = panel;
       var itemCount = contents.getStore().getCount();
       if( !itemCount) return;
       var itemHeight = contents.element.down('.x-list-item').getHeight();
       var calculatedHeight = itemHeight*itemCount+12;
       var containerHeight = menuWrapper.element.getHeight()-20;
       menuWrapper.setHeight((calculatedHeight < containerHeight) ? calculatedHeight : containerHeight);        
    }
});
