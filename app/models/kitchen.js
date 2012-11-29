Afisha.models.Shoptype = Ext.regModel('Shoptype',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});
Afisha.models.Sporttype = Ext.regModel('Sporttype',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});
Afisha.models.Kitchen = Ext.regModel('Kitchen',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});

Afisha.models.Genre = Ext.regModel('Genre',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});

Afisha.models.Bathtype = Ext.regModel('Bathtype',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});

Afisha.models.Bathserv = Ext.regModel('Bathserv',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});

Afisha.models.District = Ext.regModel('District',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});

//life.rodgor.ru services
Afisha.models.LifeServices = Ext.regModel('LifeServices',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});

Afisha.models.LifeDistrict = Ext.regModel('LifeDistrict',{
    fields: [
        {name:'value',type:'int'},
        {name:'text', type:'string'}
    ],
    proxy: {
        type:'memory',
        reader:{ type:'dict'}
    }
});