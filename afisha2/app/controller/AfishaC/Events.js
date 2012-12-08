Ext.define('Afisha.controller.AfishaC.Events', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            toolbar: 'events titlebar',
            backButton: 'events titlebar button'
        },

        control: {
            backButton:{
                tap:'onBackButtonTap'
            }
        }
    },
    launch: function(){
        this.getApplication().on({
            setCatName: this.setToolbarTitle,
            scope: this});
            
    },
    setToolbarTitle: function(name) {
        this.getToolbar().setTitle(name);
    },
    onBackButtonTap: function() {
        this.getViewport().animateActiveItem(0, {type: 'slide', direction: 'right'})        
    }
})
