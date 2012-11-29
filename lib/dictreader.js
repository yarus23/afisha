Ext.ns('ux');

Ext.ux.DictReader = Ext.extend(Ext.data.ArrayReader, {

    extractData: function(root, returnRecords) {
        var data = [];
        
        for(var key in root) {
            data.push([key, root[key]]);
        }
        
        // do not call original JsonReader, call Reader's extractData
        return Ext.data.JsonReader.superclass.extractData.call(this, data, returnRecords);
    }
});

Ext.data.ReaderMgr.registerType('dict', Ext.ux.DictReader);
