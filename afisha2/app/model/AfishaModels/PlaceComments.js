Ext.define('Afisha.model.AfishaModels.PlaceComments', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'num_votes', type: 'int', defaultValue:0 },
            { name: 'vote', type: 'int', defaultValue:0 },
            { name: 'com_count', type: 'int', defaultValue:0 }
        ]
    }
});
