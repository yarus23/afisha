
// popup combobox у списка а не picker

Ext.plugins.ClassicComboPlugin = Ext.extend(Ext.util.Observable, {
    init: function(field) {
        this.field = field;

        var f = field.showComponent;
        field.showComponent = function() {
           if( Ext.is.Phone ) {
               Ext.is.Phone = undefined;
               f.apply(field);
               Ext.is.Phone = true;
           } else
               f.apply(field);
        }
    }
});

Ext.preg('classiccombo', Ext.plugins.ClassicComboPlugin);

