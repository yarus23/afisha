//todo: default values
Ext.define('Afisha.model.AfishaModels.CachedData', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            //{name:'id',type:'int'},
            {name:'name',type:'string'},
            {name:'data',type:'string'}, // strintg совместимо с localstorage
            {name:'hash',type:'string'},
            {name:'timestamp', type:'int'}
		]
	}
});	
