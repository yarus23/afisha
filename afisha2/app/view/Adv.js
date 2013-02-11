Ext.define('Afisha.view.Adv', {
    extend: 'Ext.Panel',
    xtype:'adv',
    config: {
        layout:'fit',
        cls:'advpanel',
        hidden:true,
        docked:'bottom',
        
        height: window.innerWidth * 90 / 640,
        style: 'max-height: 4em;',
        items:[{
                xtype:'img',
                src: null,
                cls:'advimg',
                style:'background-size:100% 100%;',
                tpl: new Ext.XTemplate('<a style="display:none;" href="{AdClickURL}" />')
        }/*,{
            xtype:'actionsheet',
            hidden: true
        }*/]
    }
});