Ext.define('Afisha.model.AfishaModels.Categories', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'hiddenToolbar', type: 'bool', defaultValue:false },
            { name: 'filter', type: 'auto', defaultValue:null }, // показывать ли диалог фильтра
            { name: 'left', type: 'auto', defaultValue:null },
            { name: 'right', type: 'auto', defaultValue:null },
            { name: 'subcategories', type: 'string', defaultValue:null },
            { name: 'options', type: 'auto', defaultValue:null },
        ]
    }
});
