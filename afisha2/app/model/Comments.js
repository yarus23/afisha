Ext.define('Afisha.model.Comments', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'int' },
            { name: 'user_id', type: 'int' },
            { name: 'text', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'type_id', type: 'int' },
            { name: 'datetime', type: 'string' },
            { name: 'vote', type: 'string' },
            { name: 'user', type: 'auto' }
        ]
    }
});
