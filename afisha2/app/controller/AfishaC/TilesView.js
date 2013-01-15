Ext.define('Afisha.controller.AfishaC.TilesView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            view: 'tiles'
        },

        control: {
            view: {
                afishaPressed: 'onAfishaPressed',
                newsPressed:'onNewsPressed',
                cinemaPressed: 'onCinemaPressed',
                clubsPressed: 'onClubsPressed',
                concertPressed: 'onConcertPressed',
                restaurantPressed:'onRestaurantPressed',
                favPressed:'onFavPressed'
            }
        }
    },
    
    onAfishaPressed: function(){
        this.getApplication().fireEvent('showItem', 'categories');
    },
    onNewsPressed:function(){
        this.getApplication().fireEvent('showItem', 'newslist');
    },
    onCinemaPressed: function() {
        this.getApplication().fireEvent('switchTo', 'cinema');
    },
    onClubsPressed: function() {
        this.getApplication().fireEvent('switchTo', 'club');
    },
    onConcertPressed: function() {
        this.getApplication().fireEvent('switchTo', 'concert');
    },
    onRestaurantPressed: function() {
        this.getApplication().fireEvent('switchTo', 'restaurant');
    },
    onFavPressed: function(){
        this.getApplication().fireEvent('showItem', 'favcontent');
    },
    // здесь я дергаю view который дергает controller который вызывает то что 
    // написано в handler в описании айтемов, напрямую пробиться к методам controller'a не смог
    launch: function() {
        var def = [{
                items: [ 
                    { title: 'Афиша', bg: 'blue', flex: 2, handler: 'afishaPressed', text: 'Все актуальные события в городе. Кинопремьеры, анонсы концертов', id: 'afisha' },
                    { title: 'Настройки', iconCls: 'home', bg: 'green', color: 'black', id: 'settings'}]
            }, {
                items: [ 
                    { title: 'Клубы', id: 'clubs', handler: 'clubsPressed'}, 
                    { title: 'Новости', id: 'news', handler:'newsPressed' }, 
                    { title: 'Кино', id: 'cinema', handler: 'cinemaPressed' }]
            }, {
                items: [
                    { title: 'Скидки', id: 'discounts' }, 
                    { title: 'Бары', flex: 2, handler: 'restaurantPressed', text: 'Заказать столик в любом из баров Улан-Удэ. Узнать отзывы посетителей', id: 'pubs'}]
            }, {
                items: [
                    { title: 'Услуги', id: 'help'}, 
                    { title: 'Концерты', id: 'concert', handler: 'concertPressed'}, 
                    { title: 'Избранное', id: 'favorites', handler:'favPressed' }]
            }];
        for( var v in def ) {
            var row = Ext.create('Ext.Container', 
                { 
                    cls: 'tilerow',
                    layout: { type: 'hbox', align: 'stretch'},
                    flex: 1,
                    defaults: { flex: 1}
                });
            var rowDef = def[v].items;
            for(var i in rowDef ) {
                var style = '';
                if( rowDef[i].bg ) style += 'background-color: ' + rowDef[i].bg + ';'
                
                var handler = rowDef[i].handler;
                var controller = this;
                
                var tile = (function(handler) {
                 return Ext.create('Ext.Panel', Ext.apply(rowDef[i], {
                    cls: 'tilebutton',
                    layout: { type: 'hbox', align: 'stretch'},
                    style: style,
                    listeners: {
                        element: 'element',
                        tap: function() { if( handler ) this.getView().fireEvent(handler)},
                        scope: controller
                    }
                }))})(handler);
                
                
                var titleDef = { cls: 'tileTitle', html: rowDef[i].title };
                if( rowDef[i].color  ) titleDef.style = 'color: ' + rowDef[i].color;
                var title = Ext.create('Ext.Container', titleDef);
                
                var tileInner = Ext.create('Ext.Container', {
                    items: [title, {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items:[{ html: rowDef[i].text, flex: 2, cls: 'tileDescr'}, {flex: 1}]
                        }]
                });
                tile.add(tileInner);
                                
                row.add(tile);
            }
            this.getView().add(row);
        }
        
    }
});


