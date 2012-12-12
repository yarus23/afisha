Ext.define('Afisha.store.AfishaStores.ScheduleList', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.AfishaModels.ScheduleList',
        groupField:'date',
        getGroupString : function(record) {
            var date = record.get('date');
            var startDayOfWeek = '';
                //finishDayOfWeek = '';//dayOfWeek
            if (!date) 
            {
                var o_type = record.get('ob_type');
                if (o_type == 'place')
                    return 'Услуги не заданы'
                if (o_type == 'event')
                    return 'Места не заданы'
                return 'Событий нет';
            }

            if (date == 'place')
                return 'Услуги'
            if (date == 'event')
                return 'Места'
            var fdate = record.get('finish_date');
            startDayOfWeek = getDayOfWeek(date);
            //finishDayOfWeek = getDayOfWeek(fdate);
            date = date.split('-');
            if (fdate)
                fdate = fdate.split('-')
            if (date.length != 3)
                return '';
            if (!record.data.schedule.length)
                return (date[2][0]=='0'?date[2][1]:date[2]) + getMonthName(date[1]) + ' событий нет';
            else
                return fdate?
                    'Расписание на ' + (date[2][0]=='0'?date[2][1]:date[2]) + getMonthName(date[1]) + ' - ' + (fdate[2][0]=='0'?fdate[2][1]:fdate[2]) + getMonthName(fdate[1]):
                    'Расписание на ' + (date[2][0]=='0'?date[2][1]:date[2]) + getMonthName(date[1]) + startDayOfWeek;
        }
    }
});
