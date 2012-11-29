Afisha.models.Places = Ext.regModel('Places',{
    fields: [
        {name:'id',type:'int'},
        {name:'name', type:'string'},
        {name:'aka',type:'string'},
        {name:'city',type:'string'},
        {name:'address',type:'string'},
        {name:'phone',type:'string'},
        {name:'price',type:'string'},//???string or float
        {name:'time',type:'string'},
        {name:'image',type:'auto'},
        {name:'url',type:'string'},
        {name:'text',type:'string'},
        {name:'vote',type:'float'},
        {name:'num_votes',type:'int'},
        {name:'com_count',type:'int'},
        {name:'sort',type:'int',defaultValue: '0'},
        {name:'lat',type:'float',defaultValue: '0.0'},
        {name:'lng',type:'float',defaultValue: '0.0'},
        
        {name:'bathtype', type:'auto'}, //array
        {name:'bathserv', type:'auto'}, //array
        {name:'sporttype', type:'auto'}, //array
        
        {name:'services', type:'auto'}, //array
        
        {name:'kitchen', type:'auto'}, //array
        {name:'genre', type:'auto'}, //array
        {name:'district', type:'auto'}, //array
        
        {name:'category', type:'string'} // для favorites
    ],
    idProperty: 'id',
    hasMany: { model: 'Schedule', foreignKey: 'place_id', name: 'schedule', storeConfig: 
        { autoLoad:false  }}
});