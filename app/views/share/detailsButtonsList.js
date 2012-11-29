var tpl = '<img class="x-icon-mask" <tpl if="icon_title">style="margin-right: 10px;" src="config/resources/icons/{icon_title}"</tpl> /><div class="x-list-item-body"><div style="" class="list-item-title"><b>{title}</b></div></div><div class="x-list-disclosure"></div>';

Afisha.views.detailsButtonsList = Ext.extend(Ext.Panel, {
    baseCls: 'x-list',
    cls: 'detailsButtonsList',
    defaults: {
        xtype: 'button',
        baseCls: 'x-list-item',
        pressedCls: 'x-item-pressed',
        tpl: new Ext.XTemplate(tpl)
    },
    initComponent: function() {
        Afisha.views.Share.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('detailsButtonsList', Afisha.views.detailsButtonsList);

Afisha.views.detailsButtonsListForShareMain = Ext.extend(Afisha.views.detailsButtonsList, {
    defaults: {
        xtype: 'button',
        baseCls: 'x-list-item',
        pressedCls: 'x-item-pressed',
        toView: '',
        tpl: new Ext.XTemplate(tpl),
        handler:function(){
            if( !this.toView )
                return;
           Ext.dispatch({      
                controller: 'main',
                action: 'showSharePage',
                toView: this.toView
            });
        }        
    },
    initComponent: function() {
        Afisha.views.detailsButtonsListForShareMain.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('detailsButtonsListForShareMain', Afisha.views.detailsButtonsListForShareMain);

Afisha.views.detailsButtonsListForShareFriends = Ext.extend(Afisha.views.detailsButtonsList, {
    defaults: {
        xtype: 'button',
        baseCls: 'x-list-item',
        pressedCls: 'x-item-pressed',
        toView: '',
        tpl: new Ext.XTemplate(tpl),
        handler:function(b, e){
			var me = b.ownerCt.ownerCt;
			if(b.index === undefined) {
				var link = me.getComponent(b.ownerCt.hrefs_box).el.query('a')[b.link_index];
				Afisha.openUrl(link, b.not_external);
			} else {
				Afisha.Auth.post(b.provider_index, share_links.message, share_links.link, me, me.onResult);	
			}
        }        
    },
    initComponent: function() {
        Afisha.views.detailsButtonsListForShareFriends.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('detailsButtonsListForShareFriends', Afisha.views.detailsButtonsListForShareFriends);