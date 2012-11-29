var phonesList = new Ext.ActionSheet({
    id: 'phonesList',
    stretchX: true,
    hideOnMaskTap: true,
    tpl: '<tpl for="."><a href="tel:{title}" style="height: {height}px" class=" x-button social-site-button x-button-normal"><span class="x-button-label">{title}</span></a></tpl>',    
    /*    defaults: {
        tpl: new Ext.XTemplate('<a style="height: {height}px" class=" x-button social-site-button x-button-normal"><span class="x-button-label">{title}</span></a>'),
        listeners: function(b,e) {
                alert(100)
                me.hide();        
        }
    },*/
    bindData: function(phones_list) {
        var me = this;
        me.removeAll();
        var button_height = window.innerHeight * 2 / 3 / phones_list.length - 10;
        var height = button_height;    
        var data = [];
        for (var i = 0; i < phones_list.length; i++) {
            var ex_title = phones_list[i];
            data.push({
                title: ex_title,
                height: height
            });
        }
        me.update(data);
    }
});