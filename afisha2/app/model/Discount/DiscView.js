//"id":17,
//"title":"titlr",
//"discounts_rubric_id":"2",
//"start_datetime":"2013-02-05T02:15:53",
//"end_datetime":"2013-02-19T02:15:53",
//"description":"\u200bshort descr",
//"body":"\u200btext",
//"url":"http:\/\/url",
//"image":"",
//"price":"price",
//"discount":"discount",
//"save":"p-d",
//"phone":"phone",
//"address":"addr",
//"coordinates":"coords",
//"cond":"\u200bconditions",
//"images":[]
Ext.define('Afisha.model.Discount.DiscView', {
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id', type: 'int' },
            { name: 'rid', type: 'int' },
            { name: 'discounts_rubric_id', type: 'int' },
            { name: 'start_datetime', type: Ext.data.Types.CUSTOMDATE },
            { name: 'end_datetime', type: Ext.data.Types.CUSTOMDATE },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'body', type: 'string' },
            { name: 'url', type: 'string' },
            { name: 'price', type: 'string' },
            { name: 'image', type: 'string' },
            { name: 'discount', type: 'string' },
            { name: 'save', type: 'string' },
            { name: 'phone', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'coordinates', type: 'string' },
            { name: 'cond', type: 'string' },
            { name: 'images', type: 'auto' }
        ]
    }
});
