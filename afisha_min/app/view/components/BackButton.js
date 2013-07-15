Ext.define('Afisha.view.components.BackButton', {
	extend: 'Ext.Button',
	xtype: 'backbutton',
	config: {
            // нам нужны функции кнопки но не нужен css
            baseCls: Ext.baseCSSPrefix + 'backbutton',
            width:'1.8em',
            height:'1.8em'
            /*height:'2.2em',
            text: 'Назад',
            ui: 'default',
            iconCls: 'arrow_left',
            iconMask: true,
            iconAlign: 'center',
            cls: 'maintoolbar-back-btn',
            align:'left'*/
	}
});

Ext.define('Afisha.view.components.ToolButton', {
	extend: 'Ext.Button',
	xtype: 'toolbutton',
	config: {
            // нам нужны функции кнопки но не нужен css
            baseCls: Ext.baseCSSPrefix + 'toolbutton',
            width:'1.8em',
            height:'1.8em'
	}
});

Ext.define('Afisha.view.components.FavButton', {
	extend: 'Ext.Img',
	xtype: 'favbutton',
	config: {
            style:'margin-left: 0.5em;',
            src:'resources/fav-1.png',
            height:'1.7em',
            width:'1em',
            docked:'left'
            //text: 'Назад',
//            ui: 'default',
//            iconCls: 'favorites',
            //iconMask: true,
//            iconAlign: 'center',
//            cls:'favBtn',
//            cls: 'maintoolbar-back-btn',
//            align:'right'
	},
        setState:function(state){
            if (state ==-1 || state === false){
               this.removeCls('gold');
            } else {
                this.addCls('gold');                
            }
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
                '<tpl switch="type">',
                    '<tpl case="phone">Тел. ',
                '</tpl>',
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
		tpl: new Ext.XTemplate('<span class="x-button-label custom-label" style="color:black; text-decoration: none; padding: .3em .6em;" >{value}',
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
                //style:'border-top:0;',
                cls:'listBtn',
		tpl: new Ext.XTemplate('<span class="x-button-label custom-label" style="color:black; text-decoration: none; padding: .3em .6em;">{value}',
                '</span>')
	}
});
Ext.define('Afisha.view.components.MapBtn', {
	extend: 'Ext.Panel',
	xtype: 'mapbutton',
	config: {
            style:'margin-top:0.5em;',
            items:[{
                xtype:'img',
                height:'0.35em',
                src:'resources/catl_i.png',
                cls:'img-border',
            },{
                xtype:'button',
		//iconMask: true,
		//iconAlign: 'left',
                cls:'mapBtn',
		tpl: new Ext.XTemplate('<span class="x-button-label custom-label" style="color:black; text-decoration: none; padding: .3em .6em;">{value}',
                '</span>')
            }]
	}
});
