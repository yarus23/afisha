Ext.define('Afisha.view.components.TopToolbar', {
	extend: 'Ext.TitleBar',
	xtype: 'toptoolbar',
        requires:['Afisha.view.components.BackButton'],
	config: {
		items: [{
                    xtype:'backbutton'
                }],
            title:Global.app_name
	}
});
