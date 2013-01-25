Ext.define('Afisha.view.Settings', {
    extend: 'Ext.Panel',
    xtype: 'mainsettings',
    config: {
                controllerName:'Settings',
		layout: 'vbox',
		items: [{
                    xtype:'titlebar',
                    docked:'top',
                    title:'Настройки',
                    items: [{
                        xtype:'backbutton',
                    }]
                }, {
			flex: 1,
			xtype: 'formpanel',
			items: [{
				xtype: 'fieldset',
				items: [{
					id: 'useGPSField',
					xtype: 'checkboxfield',
					name: 'useGPS',
					label: 'Использовать GPS',
                                        labelWidth:'70%'
                                        
				}]
			}, {
				xtype: 'fieldset',
				items: [{	
					xtype: 'sliderfield',
					name: 'fontSizeSettings',
					id: 'fontSizeSettings',
					label: 'Размер шрифта',
                                        labelAlign:'top',
                                        value: 1,
                                        minValue: 0.5,
                                        maxValue: 2,
                                        increment:0.1
					}]
			},{
                    xtype:'panel',
                    html:'Пример текста',
                    cls:'fontSized'
                }]
		}]
    }
});
