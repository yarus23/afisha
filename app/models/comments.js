Afisha.models.ComentsModel = Ext.regModel('ComentsModel',{
    fields: [
        {name:'status',type:'string'},
        {name:'comments', type:'string'},
        {name:'com_count',type:'string'}
    ]
});

Ext.ux.withoutRootReader = Ext.extend(Ext.data.JsonReader, {
    getResponseData: function(response) {
        response.responseText = '{"' + this.root + '":[' + response.responseText + ']}';
        try {
            var data = Ext.decode(response.responseText);
        }
        catch (ex) {
            throw 'Ext.data.JsonReader.getResponseData: Unable to parse JSON returned by Server.';
        }

        if (!data) {
            throw 'Ext.data.JsonReader.getResponseData: JSON object not found';
        }

        return data;
    }
});
Ext.data.ReaderMgr.registerType('withoutRootJson', Ext.ux.withoutRootReader);

Afisha.stores.CommentsStore = new Ext.data.Store({
    model:'ComentsModel',
    getComments:function(el_type,id,cb,elScope){
        this.setProxy({
        	method: 'GET',
            type: 'ajax',
            url : server_script_comments_url,
            extraParams: {
                region_id: 1,
                elem_type:el_type,
                elem_id:id
            },
            reader: {
              type:'withoutRootJson',  
              root:'root'        
            }
        });
        this.load({
            scope   : elScope,
            callback: cb
        });
    }
});
/*Afisha.models.userNameModel = Ext.regModel('userNameModel', {
        fields: [
            {name: 'uname', type:'string'}
        ]    
});
Afisha.stores.userNameStore = new Ext.data.Store({
    model: Afisha.models.userNameModel,
    storeId: '_userNameStore',
    autoLoad:true,
    proxy: {
         type: Ext.uf.noLocalStorage ? 'memory' : 'localstorage',
        id: 'userNameStore1'
    }   
});*/