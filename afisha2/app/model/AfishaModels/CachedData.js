//todo: default values
Ext.define('Afisha.model.AfishaModels.CachedData', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            //{name:'id',type:'int'},
            {name:'id',type:'string'},
            {name:'data',type:'string'}, // string совместимо с localstorage
            {name:'hash',type:'string'}
		]
	}
});	
