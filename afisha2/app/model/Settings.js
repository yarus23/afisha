Ext.define('Afisha.model.Settings', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'int' },
            { name: 'font-size', type: 'auto', defaultValue: 1.0 },
            { name: 'userName', type: 'string', defaultValue: '' },
            { name: 'useGps', type: 'string', defaultValue: true }
        ],
        proxy: {
            type: 'localstorage',
            id  : 'set-proxy'
        }
    }
});
