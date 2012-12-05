Ext.define('Afisha.controller.Navigation', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            backButton: 'aviewport toptoolbar button'
        },

        control: {
            backButton:{
                tap:'onBackButtonTap'
            }
        }
    },
    onBackButtonTap:function(){
        var item = this.getViewport().getActiveItem();
        var controllerName = item.getControllerName();
        var controller = Afisha.app.getController(controllerName);
        console.log(controller)
        if (controller && controller.goBack()){
            console.log('yes')
            return;
        }
        console.log('no')
    }
});
