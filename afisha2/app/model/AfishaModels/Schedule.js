//todo: default values
Ext.define('Afisha.model.AfishaModels.Schedule', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            {name:'id',type:'int'},
            {name:'film_id',type:'int'},
            {name:'place_id',type:'int'},
            {name:'start_time', type:'string'},
            {name:'start_date', type:'string'},
            {name:'price', type:'string'},

            {name:'clubevent_id',type:'int'},
            {name:'club_id',type:'int'},
            {name:'finish_time', type:'string'},
            {name:'finish_date', type:'string'}
		]
	}
});	