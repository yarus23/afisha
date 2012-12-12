Ext.define('Afisha.model.AfishaModels.ScheduleList', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            {name:'date',type:'string'},
            {name:'ep',type:'auto'},
            {name:'schedule',type:'auto'},
            {name:'isSchedule',type:'bool'}
            ]
	}
});	