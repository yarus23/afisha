Ext.define('Afisha.view.components.TopToolbar', {
	extend: 'Ext.TitleBar',
	xtype: 'toptoolbar',
	config: {
		items: [{
                    height:'2em',
                    text: 'Назад',
                    xtype:'button',
                    ui: 'default',
                    iconCls: 'arrow_left',
                    iconMask: true,
                    iconAlign: 'center',
                    cls: 'maintoolbar-back-btn',
                    align:'left'
		}],
            title:Global.app_name
	}
});
