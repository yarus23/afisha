//todo: default values
Ext.define('Afisha.model.AfishaModels.CachedData', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            //{name:'id',type:'int'},
            {name:'type',type:'string'},
            {name:'data',type:'auto'}
		]
	}
});	