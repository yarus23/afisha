Ext.define('Afisha.controller.AfishaC.PlaceView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            header:'aviewport placeview panel#pv_header',
            buttons:'aviewport placeview panel#pv_buttons'
        },
    },
    initView:function(record){
        console.log(record)
        console.log(this.getHeader())
        this.getHeader().setRecord(record);
        this.checkButtonsFields(record);
        
    },
    checkButtonsFields:function(record){
        var buttonsPanel = this.getButtons();
        buttonsPanel.removeAll();
        var lat = record.get('lat')
        var lng = record.get('lng');
        if (lat && lng){
            //add map button
        }
        var phone = record.get('phone');
        if (phone){
            buttonsPanel.add({
                xtype:'hrefbutton',
                data:{
                    type:'phone',
                    value:phone
                }
            })
        }
    },
    goBack: function() {
        return false;
    }
})
