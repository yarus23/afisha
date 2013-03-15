Ext.define('Afisha.view.components.TopToolbar', {
	extend: 'Ext.TitleBar',
	xtype: 'toptoolbar',
        style:'background-color: white;',
        requires:['Afisha.view.components.BackButton'],
	config: {
		items: [{
                    xtype:'backbutton'
                }],
            title:Global.app_name
	}
});
