
Ext.define('Afisha.view.AfishaViews.FilterView',{
    xtype: 'filterview',
    extend:'Ext.form.Panel',
    config:{
        fullscreen: true,
        layout: {
            type:'vbox',
            align:'center'
        },
        items:[ {
            xtype:'titlebar',
            docked:'top',
            items: [{
                xtype:'backbutton',
                listeners:{
                    tap: function() { this.up('filterview').setHidden(true)}
                }
            }]
            },{
            xtype: 'fieldset',
            title: 'Фильтр',
            instructions: 'Выберите объект по параметрам' 
            },{
                xtype:'button',
                text: 'Выбрать',
                width:'60%'
            }
         ]
    }
});
