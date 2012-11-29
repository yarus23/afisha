Afisha.models.Films = Ext.regModel('Films',{
    fields: [
        {name:'id',type:'int'},
        {name:'name', type:'string'},
        {name:'poster',type:'auto'},//array of url
        {name:'trailer',type:'auto'},//array of trailers???
        {name:'screenshot',type:'auto'},//array of url???
        {name:'description',type:'string'},
        {name:'genre',type:'string'},
        {name:'original',type:'string'},
        {name:'aka',type:'string'},
        {name:'runtime',type:'string'},
        {name:'country',type:'string'},
        {name:'year',type:'string'},
        {name:'director',type:'string'},
        {name:'cast',type:'string'},
        {name:'vote',type:'float'},
        {name:'num_votes',type:'int'},
        {name:'com_count',type:'int'},
        {name:'sort',type:'int',defaultValue: '0'},
        {name:'start_date',type:'string'},
        {name:'finish_date',type:'string'},
        {name:'place_name',type:'string'}
        //place_name
    ],
    hasMany: { model: 'Schedule', name: 'film_id'}
});