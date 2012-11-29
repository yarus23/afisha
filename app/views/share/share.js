Afisha.views.Share = Ext.extend(Ext.form.FormPanel, {
    id: 'Share',
    cls: 'sharePanel',
    layout: 'card',     
    cardAnimation : 'slide',
    fullscreen: true,
    items: [
        {  xtype: 'ShareMain' },
        {  xtype: 'ShareFriends' },
        {  xtype: 'ShareAbout' },
        {  xtype: 'ShareRegard' },
        {  xtype: 'ShareLicense' },
        {  xtype: 'optionsView' }/*,
        {  xtype: 'ShareAuth' }*/
    ],
    initComponent: function() {
        Afisha.views.Share.superclass.initComponent.apply(this, arguments);
    },
    backTap:function(){
        if(this.getActiveItem().xtype == 'ShareMain')
            return false;
        Ext.dispatch({      
            controller: 'main',
            action: 'showSharePage',
            toView:'ShareMain'
        });
        return true;
    }
});

Ext.reg('Share', Afisha.views.Share);
