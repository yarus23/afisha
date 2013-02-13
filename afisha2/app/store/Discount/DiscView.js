Ext.define('Afisha.store.Discount.DiscView', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.Discount.DiscView',
        //autoLoad: true,
//        data:[{
//"id":17,
//"title":"Просто блеск! Отбеливание зубов со скидкой 70%!",
//"discounts_rubric_id":"2",
//"start_datetime":"2013-02-05T02:15:53",
//"end_datetime":"2013-02-19T02:15:53",
//"description":"\u200bblah-blah-blah-blahblah blah-blah-blah-v",
//"body":"\u200bwqeqwewqe wqe qwe qwe qw qwe qwe qwe qwe  qweqwe qwe qwe qwe qwe qweqw qweqwe qwe qwe qwe qwe qwe qweqwe qwe qwe qwe qweqweqwe qwe qweqwe qwe qwe qwe we qwe qwe qw",
//"url":"http:\/\/google.com",
//"image":"",
//"price":"ot 1500 rub.",
//"discount":"do 70%",
//"save":"5000 rub.",
//"phone":"+7 (4872) 25-55-55, +7-953-623-23-23",
//"address":"some city some street",
//"coordinates":"37.53,58.54",
//"cond":"\u200bconditions",
//"images":[]
//        }]
        proxy: {
            type: 'scripttag',
            url : 'http://afisha.mikhelev.ru/app/ulanude/data/discounts/getone/',
            //callbackKey: 'callback',
            reader: {
                type: 'json'
                //rootProperty: 'root'
            }
        }
    },
});
