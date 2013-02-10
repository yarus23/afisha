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
                favPressed:'onFavPressed',
                settingsPressed:'onSettingsPressed',
                discountsPressed:'onDiscountsPressed'
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
    onSettingsPressed: function(){
        this.getApplication().fireEvent('showItem', 'mainsettings');
    },
    onDiscountsPressed: function(){
        this.getApplication().fireEvent('showItem', 'discview');
    },
    // здесь я дергаю view который дергает controller который вызывает то что 
    // написано в handler в описании айтемов, напрямую пробиться к методам controller'a не смог
    launch: function() {
        var def = [{
                items: [ 
                    { title: 'Афиша', icon:'6w', bg: '#00bce2', flex: 2, handler: 'afishaPressed', text: 'Все актуальные события в городе. Кинопремьеры, анонсы концертов', id: 'afisha' },
                    { title: 'Настройки', icon:'2w', bg: '#1ba456', color: 'white', id: 'settings', handler:'settingsPressed'}]
            }, {
                items: [ 
                    { title: 'Клубы', icon:'4w', bg:'#202020', id: 'clubs', handler: 'clubsPressed'}, 
                    { title: 'Новости', icon:'5w', bg:'#cf274b', id: 'news', handler:'newsPressed' }, 
                    { title: 'Кино', icon:'9', bg:'#c0df05', color:'black', id: 'cinema', handler: 'cinemaPressed' }]
            }, {
                items: [
                    { title: 'Скидки', icon:'3', bg:'#e8e8e8', color:'black', id: 'discounts', handler: 'discountsPressed' }, 
                    { title: 'Бары', icon:'10w', bg:'#74331d', descrColor: 'white', flex: 2, handler: 'restaurantPressed', text: 'Заказать столик в любом из баров Улан-Удэ. Узнать отзывы посетителей', id: 'pubs'}]
            }, {
                items: [
                    { title: 'Услуги', icon:'8w', bg:'#202020', id: 'help'}, 
                    { title: 'Концерты', icon:'7w', bg:'#00bce2', id: 'concert', handler: 'concertPressed'}, 
                    { title: 'Избранное', icon:'1w', bg:'#e66021', id: 'favorites', handler:'favPressed' }]
            }];
        for( var v in def ) {
            var row = Ext.create('Ext.Container', 
                { 
                    cls: 'tilerow',
                    layout: { type: 'hbox', align: 'stretch' },
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
                    layout: 'fit',
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
                            items:[{ html: rowDef[i].text, flex: rowDef[i].text ? 3 : 1, cls: 'tileDescr', style: rowDef[i].descrColor ? 'color: ' + rowDef[i].descrColor : ''}, 
                            {flex: 1, style: rowDef[i].icon ? 'height:3.2em; background-position:10% bottom; background-repeat: no-repeat; background-image: url("resources/icons/' + rowDef[i].icon + '.png")' : ''}]
                        }]
                });
                tile.add(tileInner);
                                
                row.add(tile);
            }
            this.getView().add(row);
        }
        
    }
});


