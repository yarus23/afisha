var Options = function(store){
    this.store = store;
    if (!this.store.getCount())
    {
        this.store.add({});//set default values
        this.store.sync();
    }
    this.record = this.store.first();
}
Options.prototype.get = function(fieldname){
    return this.record.get(fieldname);
}
Options.prototype.set = function(fieldname,value){
    this.record.set(fieldname,value);
    this.record.setDirty();
    this.store.sync();
}
