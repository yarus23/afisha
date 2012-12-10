Ext.define('Afisha.view.components.BackButton', {
	extend: 'Ext.Button',
	xtype: 'backbutton',
	config: {
            height:'2.2em',
            text: 'Назад',
            ui: 'default',
            iconCls: 'arrow_left',
            iconMask: true,
            iconAlign: 'center',
            cls: 'maintoolbar-back-btn',
            align:'left'
	}
});
Ext.define('Afisha.view.components.HrefBtn', {
	extend: 'Ext.Button',
	xtype: 'hrefbutton',
	config: {
		iconMask: true,
		iconAlign: 'left',
                style:'border-top:0;',
                cls:'listBtn',
		tpl: new Ext.XTemplate('<a class="x-button-label custom-label" style="color:black; text-decoration: none; padding: .3em .6em;" href="',
                '<tpl switch="type">',
                        '<tpl case="email">mailto:',
                        '<tpl case="phone">tel:',
                '</tpl>',
                '{value}">',
                '{value}',
                '</a>')
	}
});

Ext.define('Afisha.view.components.UrlBtn', {
	extend: 'Ext.Button',
	xtype: 'urlbutton',
	config: {
		iconMask: true,
		iconAlign: 'left',
                style:'border-top:0;',
                cls:'listBtn',
		tpl: new Ext.XTemplate('<span class="x-button-label custom-label" style="color:black; text-decoration: none; padding: .3em .6em;" {value}>',
                '<a href={value} style="display:none;" />',
                '</span>'),
                handler:function(me){
                    var el = me.element.query('a');
                    if (el && el.length)
                        Afisha.gf.openUrl(el[0], undefined, Ext.os.is.iOS); 
                }
	}
});

Ext.define('Afisha.view.components.ClickBtn', {
	extend: 'Ext.Button',
	xtype: 'clickbutton',
	config: {
		iconMask: true,
		iconAlign: 'left',
                style:'border-top:0;',
                cls:'listBtn',
		tpl: new Ext.XTemplate('<span class="x-button-label custom-label" style="color:black; text-decoration: none; padding: .3em .6em;" {value}>',
                '</span>')
	}
});