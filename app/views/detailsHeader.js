Afisha.views.detailsHeader = Ext.extend(Ext.Panel, {
    id:'detailsHeader',
    layout:'fit',
    cls:'detailsHeader',
    tpl:new Ext.XTemplate(
        '<div class="title" >',
            '<tpl if="lat || address || phone">{[this.getRate(values.vote)]}</tpl>',
            '<tpl if="lat || address || phone"><div class="fav_click"></div><img class="x-icon-mask favouriteBtn" src="{[this.checkFav(values)]}"></img></tpl>',
            '<tpl if="name.length">{name}</tpl><tpl if="!name.length">{aka}</tpl>',
        '</div>',
        '<tpl if="poster"><div class="infoblock">',
            '<tpl>{[this.getRate(values.vote)]}</tpl>',
            '<tpl><span class="num-votes">{[values.num_votes]}</span></tpl>',
            '<tpl if="genre.length"><span class="genre small-gray-text">{genre}</span></tpl>',
            '<tpl if="runtime.length && runtime &gt; &quot;0&quot; "><span class="runtime small-gray-text">&nbsp;({runtime}&nbsp;мин.)</span></tpl>',
        '</div></tpl>',
        {
            getRate:Afisha.getRatingHtml,
            checkFav:function(data){
                var cat = data.category?data.category:data.type;
                var q = favStore.findBy(function(record,id){
                    return (record.data.id == data.id) && (record.data.category == cat);
                })
                if (q == -1)
                    return 'config/resources/icons/1_sm.png';
                else 
                    return 'config/resources/icons/1_sm_full.png';
            }
        }
    ),
    setGenreWidth:function(){
        var infoblock = this.el.down('div.infoblock');
        if (!infoblock || !infoblock.down('span.genre'))
            return;
        var node = infoblock.down('div.superstars,div.superstar');
        var rateWidth = node ? node.getWidth() : infoblock.down('div.stars-set').getWidth();
        var width = infoblock.getWidth() - 
            rateWidth - 
            infoblock.down('span.num-votes').getWidth();
        if (infoblock.down('span.runtime'))
            width -= infoblock.down('span.runtime').getWidth();
        infoblock.down('span.genre').setWidth(width-5);
        //alert(width);
    },
    bindData:function(data, category){
        var udata = data;
        /*if (data.poster && data.poster.length)
        {
            udata.poster_img = data.poster[0];
        }
        else */if (data.image)
            udata.poster_img = data.image;
        udata.category = category?category:data.type;
        this.update(udata);
        this.setGenreWidth();
        
        // todo: как уничтожать?
        Ext.select('div.fav_click').on('click', function() {
           if( Afisha.addToFavorites(data, category) )
           {
               this.nextElementSibling.setAttribute('src','config/resources/icons/1_sm_full.png')
               Ext.Msg.alert(G.app_name, 'Объект добавлен в избранное.');
           }
           else
           {
               this.nextElementSibling.setAttribute('src','config/resources/icons/1_sm.png')
               Ext.Msg.alert(G.app_name, 'Объект удален из избранного.');
           }
        })                    
    },
    initComponent: function() {
        Afisha.views.detailsHeader.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('detailsHeader', Afisha.views.detailsHeader);