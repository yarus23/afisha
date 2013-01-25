/* 
 * Settings
 */
Ext.define('Afisha.util.Settings', {
    config: {
        fontSize:1.0,
        userName:'',
        settingsStore:null,
        settingsRecord:null,
        fontStep:0.1,
        fontMinSize:0.5,
        fontMaxSize:2.0,
        useGPS:true
    },

    //add store для отлова более ранней загрузки контроллера, чем store
    //какая-то херня. надо переделать
    constructor: function(config) {
        var store;
        this.initConfig(config);
        store = Ext.getStore('Settings');
        if (!store)
            return;
        this.setSettingsStore(store);
        store.load(this.setParams,this);
    },
    //public
    upperFont:function(){
        return this.saveFontSize(this.getFontSize() + this.getFontStep());
    },
    lowerFont:function(){
        return this.saveFontSize(this.getFontSize() - this.getFontStep());
    },
    saveUseName:function(userName){
        var record = this.getSettingsRecord();
        if (!userName || !record)
            return false;
        this.setUserName(userName);
        record.set('userName',userName);
        record.save();
        return true;
    },
    saveUseGPS:function(useGPS){
        var record = this.getSettingsRecord();
        if (!record)
            return false;
        this.setUseGPS(useGPS);
        record.set('useGps',useGPS);
        record.save();
        return true;
    },
    //private
    saveFontSize:function(size){
        var record;
        
        if (size > this.getFontMaxSize() + 0.1)
            return this.getFontMaxSize();
        if (size < this.getFontMinSize())
            return this.getFontMinSize();
        record = this.getSettingsRecord();
        if (!record)
            return size;
        this.setFontSize(size);
        record.set('font-size',size);
        record.save();
        return size;
    },
    setParams:function(records, operation, success){
        var store,
            record,
            model;
        store = this.getSettingsStore();
        if (!store)
            return;
        if (records.length){
            //console.log(records[0].get('font-size'))
            this.setSettingsRecord(records[0]);
            this.setFontSize(records[0].get('font-size'));
            this.setUserName(records[0].get('userName'));
        } else {
            model = store.getModel();
            record = new model({})//redord with default values
            store.add(record);
            store.sync();
            this.setSettingsRecord(record);
            this.setFontSize(record.get('font-size'));
            this.setUserName(record.get('userName'));
            //first start!
            //show helper
        }
    }

});

