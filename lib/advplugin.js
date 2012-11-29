
// показывает рекламу в первом элементе списка
// для удобства добавить:
// div.x-list.with-header div.x-list-item:first-child {
//   padding:0;
// }

Ext.plugins.ListAdvPlugin = Ext.extend(Ext.util.Observable, {
    init: function(list) {
        this.list = list;

        // вставляем пустышку первым элементом
        list.collectData =  function(records, startIndex) {
           var rs = Ext.List.superclass.collectData.call(this, records, startIndex);        
           rs.unshift({});
           return rs;
        };

        list.on('refresh', this.onRefresh, this);
    },
    
    onItemtap: function() { },
    
    // вставляем в пустышку наш html код
    onRefresh: function() {
        // добавляем класс
        this.list.addCls('with-header');
        // удаляем disclosure если есть
        var disclosure = this.list.getEl().down('.x-list-disclosure');
        if( disclosure )
           disclosure.remove();
        var img = Ext.DomHelper.overwrite(this.list.getEl().down(".x-list-item-body"), '\n\
<img style=\"width:100%;height:2.7em;display:block;\" src=\"http://www.watch-store.ru/img/banner_small.jpg\"/>');
        // ???
        this.list.getEl().down('img').on('tap', this.onItemtap, this, {stopEvent:true});
    }
})

Ext.preg('listadv', Ext.plugins.ListAdvPlugin);

