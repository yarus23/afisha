Ext.define('Afisha.store.Settings', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.Settings',
        autoLoad: true,
        fontSize:1.0,
        userName:'',
        fontStep:0.1,
        fontMinSize:0.5,
        fontMaxSize:2.0,
        useGps:true
    },
    listeners:{
        load:function(me, records, success){
            console.log(123)
            debugger;
        }
    },
    saves:function(){
        var model = this.getModel();
        var record = new model({});
        this.add(record);
        this.sync();
        console.log(654)
    }
});
