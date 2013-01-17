Ext.define('Afisha.store.Favorites', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Afisha.model.Favorites',
        autoLoad: true,
        //autoSync: true,
        /*proxy: {
            type: 'localstorage',
            id  : 'Favorites-proxy'
        }*/
    },
    isRecordInFav: function(type, rid){
        return this.findBy(function(rec,idx){
            if (rec.get('type') == type && rec.get('rid') == rid)
                return true;
            return false;
        })
    },
    ///return true - added, false - removed
    setFav:function(opts){
        var idx = this.isRecordInFav(opts.type, opts.rid);
        if (idx == -1){
            var model = this.getModel();
            var rec = new model(opts);
            this.add(rec);
            this.sync();
            return true;
        } else {
            this.removeAt(idx);
            this.sync();
            return false;
        }
    }
});
