Afisha.models.optionsModel = Ext.regModel('userNameModel', {
        fields: [
            {name: 'id', type: 'int'},
            {name: 'uname', type:'string', defaultValue: ''},
            {name: 'useGPS', type: 'boolean', defaultValue: true}
        ]    
});
Afisha.stores.optionsStore = new Ext.data.Store({
    model: Afisha.models.optionsModel,
    //storeId: '_optionsStore',
    autoLoad:true,
    listeners: {
      load: function() {
          Afisha.options = new Options(this);
          Afisha.useGPS = Afisha.options.get('useGPS');
      } 
    },
    proxy: {
         type: Ext.uf.noLocalStorage ? 'memory' : 'localstorage',
         id: 'optionsStore1'
    }   
});