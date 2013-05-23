
Ext.define('Afisha.view.AfishaViews.FilterView',{
    xtype: 'filterview',
    extend:'Ext.form.Panel',
    config:{
        fullscreen: true,
        layout: {
            type:'vbox',
            align:'left'
        },
        items:[ {
            xtype:'titlebar',
            style:'background-color: white;',
            docked:'top',
            items: [{
                xtype:'backbutton',
                listeners:{
                    
                    tap: function() { Ext.Viewport.remove(this.up('filterview'));}
                }
            }]
            }, { html:'Сортировать', margin: '0.5em .5em', baseCls: '.x-title', style: 'font-weight:bold; color: #333'},
            { 
                xtype: 'segmentedbutton',
                items:[
                    { text: 'По алфавиту', id: 'alphabet' },
                    { text: 'По рейтингу', id: 'rating' },
                    { text: 'По расстоянию', id: 'distance' }
                ],
                style:'font-size:small'
            },
            {
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
