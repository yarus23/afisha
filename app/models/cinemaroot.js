// todo: chain инициализации stores



Afisha.models.hashModel = Ext.regModel('HashModel', {
        fields: [
            {name: 'id', type:'string'},
            {name: 'hash', type:'string'},
            {name: 'timeLoaded', type:'int'},
            {name: 'dataStr', type: 'string'}
        ]    
});

Ext.override(Ext.data.WebStorageProxy, {
    getIds: function() {
        var ids    = (this.getStorageObject().getItem(this.id) || "").split(","),
            length = ids.length,
            i;

        if (length == 1 && ids[0] == "") {
            ids = [];
        } else {
            for (i = 0; i < length; i++) {
                var v = parseInt(ids[i], 10);
                ids[i] = isNaN(v) ? ids[i] : v;
            }
        }

        return ids;
    },
    setIds: function(ids) {
        var obj = this.getStorageObject(),
            str = ids.join(",");
        
        obj.removeItem(this.id);
        
        if (!Ext.isEmpty(str)) {
            obj.setItem(this.id, str);
        }
    },
    destroy: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            ids     = this.getIds(),

            //newIds is a copy of ids, from which we remove the destroyed records
            newIds  = [].concat(ids),
            i;

        operation.setStarted();
        
        for (i = 0; i < length; i++) {
            newIds.remove(records[i].getId());
            this.removeRecord(records[i], false);
        }

        this.setIds(newIds);

        operation.setCompleted();
        operation.setSuccessful();
        
        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    removeRecord: function(id, updateIds) {
        if (id instanceof Ext.data.Model) {
            id = id.getId();
        }
        
        
        if (updateIds !== undefined) {
            var ids = this.getIds();
            ids.remove(id);
            if( ids.length )
              this.setIds(ids);
            else {
              // deleted last object, remove all
              var obj = this.getStorageObject();
              obj.removeItem(this.getRecordCounterKey());
              obj.removeItem(this.id);
              obj.setItem(this.id, '');
            }
            
        }

        this.getStorageObject().removeItem(this.getRecordKey(id));
    }
});

Ext.override(Ext.data.WebStorageProxy,{ // Patching for bugs with localStorage stores
    create: function(operation, callback, scope) {
        var records = operation.records,
        length = records.length,
        ids = this.getIds(),
            id, record, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];

            if (record.phantom) {
                record.phantom = false;
                id = this.getNextId();
            } else {
                id = record.getId();
            }

            this.setRecord(record, id);
            if (ids.indexOf(id) == -1) {
                ids.push(id);
            }
        }

        this.setIds(ids);

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    }
});

Afisha.stores.HashStore = new Ext.data.Store({
    model: Afisha.models.hashModel,
    storeId: 'HashStore',
    proxy: {
        type: Ext.uf.noLocalStorage ? 'memory' : 'localstorage',
        id: 'hashStore100'
    }   
});

function setLoading() {
  Ext.getCmp('Viewport').setLoading({msg:" "});    
}

Afisha.loadStore = function(type, callback) {
   // уже загрузили?
   var hashStore = Afisha.stores.HashStore;

   hashStore.load();
   var found = hashStore.findBy(function(record, id){
      return type === record.get('id');
   });

   var today = new Date();
   var delta = 1000 * 60 * 60 * 3; // через 3 часа дернем хеш
   
   
   function reloadHash(type, item, loadCallback, passCallback) {
       //console.log('checking hash');
       setLoading();
       // возьмем хеш
       if( server )
       {
           Afisha.lastRequest = {
               callback:function(){
                   Ext.getCmp('Viewport').setLoading(false);
               }
           }
          Afisha.lastRequest.ajax = Ext.Ajax.request({
               url : server_script_url,
               params: {type: type, mode: 'hash'},
               method:'GET',
               timeout:20 * 1000,
               failure: function(response, opts) {
				Afisha.lastRequest = null;
                 // не можем взять хеш берем таки из кеша но предупреждаем
                 Ext.getCmp('Viewport').setLoading(false);

                 if( item !== null ) {
                    Ext.Msg.alert(G.app_name, 'Не могу подключиться к серверу. Данные могут быть не актуальными.');
                    passCallback.apply();
                 } else
                    Ext.Msg.alert(G.app_name, 'Не могу подключиться к серверу.');
               },
               success: function(response, opts) {
                   Afisha.lastRequest = null;
                   var hash = response.responseText;
                   
                   if( item !== null ) {
                       var rec = hashStore.getAt(item);
                       
                       if( rec.get('hash') === hash )
                           passCallback.apply();
                       else
                           loadCallback.call(this, hash, passCallback);
                   } else {
                       loadCallback.call(this, hash, passCallback);
                   }
               }
          })
       }
       else
          Ext.util.JSONP.request({
               url : 'http://query.yahooapis.com/v1/public/yql',
               params: {format:'json', q: 'select * from html where url="' +
                                          server_script_url + '?mode=hash&type=' + type + '"'},
               callbackKey: 'callback',
               callback: function(response) {
                   var hash = response.query.results.body.p;
                   if( item !== null ) {
                       var rec = hashStore.getAt(item);
                       if( rec.get('hash') === hash ) {
                           alert('result from localstore')                           
                           passCallback.apply();
                       }
                       else {
                           alert('result from net')
                           loadCallback.call(this, hash, passCallback);
                       }
                   } else {
                       loadCallback.call(this, hash, passCallback);
                   }
               }    
          });
          

   }
   
   var load = false;

   function fillStores(data) {
       if( data.root ) data = data.root;
       var root = Afisha.storesCollection[type];
       if (data instanceof Array)
       {
           //wtf?
       }
       else
           data = [data];

       if( Afisha.lowMemory ) {
           for( var t in Afisha.storesCollection) {
               if( t !== type ) {
                   Afisha.storesCollection[t].forEach(function(sub) {
                       if( sub.getCount() )
                         //console.log('removing nonempty store');
                       sub.removeAll();
                   })
               }
           }
       }

       root.forEach(function(store){
          // find data position in json
          data.forEach( function(item){ 
             if (!item)
                return;
             if( item[store.name_id] ) {
               if( store.proxy.type == 'memory' )
               {
                 store.proxy.data = item[store.name_id];
                 store.load();
               } else
                 store.loadData(item[store.name_id],false);
               //console.log('store ' + store.name_id + ' loaded, contains ' + store.data.length + ' records')                      
             }
         })
    })

   }

   function doLoad(newHash, passCallback) {
       setLoading();
       if (server) {
			Afisha.lastRequest = {
               callback:function(){
                   Ext.getCmp('Viewport').setLoading(false);
               }
           }
          Afisha.lastRequest.ajax = Ext.Ajax.request({
               url : server_script_url,
               params: {type: type},
               method:'GET',
               failure: function(response, opts) {
                 Afisha.lastRequest = null;
                 Ext.getCmp('Viewport').setLoading(false);
                 Ext.Msg.alert(G.app_name, 'Не могу подключиться к серверу.');
               },
               success: function(response, opts) {
                   Afisha.lastRequest = null;
                   var data = Ext.decode(response.responseText).root;
                   
                   var rec;
                   if( found > -1 ) {
                       rec = hashStore.getAt(found);
                       rec.setDirty();
                       rec.set('hash', newHash);
                       rec.set('timeLoaded', (new Date()).getTime());
                   }    
                   else
                       rec = hashStore.add({ id: type, hash: newHash, timeLoaded: (new Date()).getTime() })[0];
                   
                   rec.set('dataStr', response.responseText);
                   hashStore.sync();
                   fillStores(data);
                   passCallback.apply();
               }
          }) 
       }
       else
          Ext.util.JSONP.request({
               url : 'http://query.yahooapis.com/v1/public/yql',
               params: {format:'json', q: 'select * from json where url="' +
                                          server_script_url + '?type=' + type + '"'},
               callbackKey: 'callback',
               callback: function(response) {
                   var data = response.query.results.root;
                   var rec;
                   if( found > -1 ) {
                       rec = hashStore.getAt(found);
                       rec.set('hash', newHash);
                       rec.set('timeLoaded', (new Date()).getTime());
                       rec.setDirty();
                   }
                   else
                       rec = hashStore.add({ id: type, hash: newHash, timeLoaded: (new Date()).getTime() })[0];

                   rec.set('dataStr', Ext.encode(data));
                   hashStore.sync();
                   fillStores(data);
                   passCallback.apply();
                   //console.log('result from network');
               }
          });
   }
   if( found === -1 ) {
       if( isOnline() )
         reloadHash(type, null, doLoad, callback);
       else
         Ext.Msg.alert(G.app_name, 'Отсутствует подключение к интернету.');
   } else {
      function checkStores() {
        var root = Afisha.storesCollection[type];
        var isLoaded = false;
        for( var i = 0; i < root.length; i++) {
             isLoaded = isLoaded || root[i].getCount();
        }

        if( isLoaded ) {
            //console.log('stores already loaded');
        } else {
            //console.log('refill store');
            fillStores(Ext.decode(hashStore.getAt(found).get('dataStr')))
        }
        callback.apply();
      }
      if( isOnline() && (today.getTime() - hashStore.getAt(found).data.timeLoaded) > delta ) {
        // истекло время валидности результатов, проверяем
        reloadHash(type, found, doLoad, checkStores);
      } else {
        if( !isOnline())
          Ext.Msg.alert(G.app_name, 'Отсутствует подключение к интернету. Данные могут быть не актуальными.');

        checkStores();
    }
   }
   
};

var datesSort = new Ext.util.Sorter({
    direction: 'ASC',
    sorterFn: function( o1, o2 ){
       function getFirstDate(obj) {
          //debugger;
       }
       
       d1 = getFirstDate(o1);
       d2 = getFirstDate(o2);
       if( d1 === d2 ) return 0;
        
       return d1 < d2 ? -1 : 1;       
    }
});

var quotesSort = new Ext.util.Sorter({
    direction:'ASC',
    sorterFn: function( o1, o2){
        function getPureString(s){
            if( s.length && (s[0] === '\"' || s[0] === '\'' || s.charCodeAt(0) === 171)) {
               return s.replace(/['"\u00BB\u00AB]/g,'');
            } else return s;
        };
        if (!o1.data || !o2.data)
            return 0;
        s1 = getPureString(o1.data.name);
        s2 = getPureString(o2.data.name);
        
        if( s1 === s2 ) return 0;
        
        return s1 < s2 ? -1 : 1;
    }
})

var paySort = new Ext.util.Sorter({
    direction:'ASC',
    sorterFn: function( o1, o2){
        if (!o1.data || !o2.data)
            return 0;
        if( o1.data.sort === o2.data.sort ) return 0;
        return o1.data.sort > o2.data.sort ? -1 : 1;
    }
})

Afisha.storesCollection = {};

function storeFactory(type, stores){
  var root = Afisha.storesCollection[type] = [];
  stores.forEach(function(store_info){
     var storeName = type + store_info.model + 'Store';
     store_info.resetSort = Afisha.resetSort;
     store_info.defSorters = store_info.sorters;
     var store = Afisha.stores[storeName] = new Ext.data.Store(Ext.apply({
         //ep:storeName
         /*
          *ep - название противоположного store. т.е. для кинотеатров - фильмы.
          **/
     }, store_info));
     root.push(store);
  });
  
  
 };

var groupSort = new Ext.util.Sorter({
    sorterFn: function( o1, o2){
        var r1 = isComingSoon(o1.data.id, o1.data.name);
        var r2 = isComingSoon(o2.data.id, o2.data.name);
        //return r1 === r2 ? 0 : (r1 && !r2);
        if( r1 == r2 ) return 0;
        
        return r1 < r2 ? -1 : 1;

    }
});