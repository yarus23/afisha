Ext.define('Afisha.controller.AfishaC.FilterView', {
    extend: 'Ext.app.Controller',
    config: {
        
        views:['AfishaViews.FilterView', 'AfishaViews.Events'],
        refs: {
			view:'filterview',
            eventView:'events',
            fieldset: 'filterview fieldset',
            filterButton: 'filterview > button',
            sortButton: 'filterview > segmentedbutton'
        },

        control: {
            sortButton: {
                toggle: 'onSortPressed'
            },
            view:{
                construct:'onConstruct'
            },
            filterButton: {
                tap: 'onOK'
            }
        }
    },
    onSortPressed: function(container, button, pressed) {
        Ext.Viewport.remove(this.getView());
        this.getEventView().fireEvent('sortBy', button.getId());
    },
    onOK:function(){
        var v = this.getView().getValues();
        this.getEventView().fireEvent('setFilter', v);
        Ext.Viewport.remove(this.getView());
    },
    onConstruct:function(categoryId) {
        var catStore = Ext.getStore('Categories');
        var res = catStore.find('id', categoryId);
        if( res < 0 )
            alert('Нет такой категории');
         else {
            var filter = catStore.getAt(res).get('filter').items;
            var dictStore = Ext.getStore('Dictionary');
            for(var i in filter) {
                var k = dictStore.find('id', filter[i].id);
                if( k < 0 ) continue; // не нашли фильтр
                var dictItem = dictStore.getAt(k);
                var itemData = dictItem.get('data');
                var options = [];
                for(var d in itemData) {
                    options.push( { text: itemData[d], value: d });
                }
                var widget = Ext.create('widget.selectfield', {
                    name:filter[i].id,
                    label:filter[i].name,
                    options:options,
                    autoSelect:false,
                    //usePicker: true,
                    defaultPhonePickerConfig: {
                        doneButton: 'Выбрать',
                        cancelButton: 'Отмена',
                        id:'bottomPopup'
                    },
                    value:0 });
                this.getFieldset().add(widget);
            }
         }
    }
}
);
