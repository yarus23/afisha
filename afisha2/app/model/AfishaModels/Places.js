//todo: default values
Ext.define('Afisha.model.AfishaModels.Places', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            {name:'id',type:'int'},
            {name:'name', type:'string'},
            {name:'aka',type:'string'},
            {name:'city',type:'string',defaultValue: ''},
            {name:'address',type:'string',defaultValue: ''},
            {name:'phone',type:'string',defaultValue: ''},
            {name:'price',type:'string',defaultValue: ''},//???string or float
            {name:'time',type:'string',defaultValue: ''},
            {name:'time_start',type:'string',defaultValue: ''},
            {name:'time_end',type:'string',defaultValue: ''},
            {name:'image',type:'auto'},
            {name:'url',type:'string',defaultValue: ''},
            {name:'text',type:'string',defaultValue: ''},
            {name:'description',type:'string',defaultValue: ''},
            {name:'vote',type:'float',defaultValue: 0},
            {name:'num_votes',type:'int',defaultValue: 0},
            {name:'com_count',type:'int', defaultValue: 0},
            {name:'sort',type:'int',defaultValue: '0'},
            {name:'lat',type:'float',defaultValue: '0.0'},
            {name:'lng',type:'float',defaultValue: '0.0'},

            {name:'bathtype', type:'auto'}, //array
            {name:'bathserv', type:'auto'}, //array
            {name:'sporttype', type:'auto'}, //array
            {name:'shoptype', type:'auto'}, //array

            {name:'services', type:'auto'}, //array

            {name:'kitchen', type:'auto'}, //array
            {name:'genre', type:'auto'}, //array
            {name:'district', type:'auto'}, //array

            //{name:'category', type:'string'} // для favorites
	]
    }
});	