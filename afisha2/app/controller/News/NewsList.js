Ext.define('Afisha.controller.News.NewsList', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
//            mainView: 'mainview',
//            viewport: 'newsviewport',
            viewport: 'aviewport',
            newsList: '#newslist',
//            weatherPanel: 'newscontent toolbar panel#weatherPanel',
//            erPanel: 'newscontent toolbar panel#erPanel',
//            articlesList:'articlescontent newslist',
//            articlesDatePanel:'articlescontent panel#articleDate',
//            favoritesList:'favcontent newslist',
//            pageView: 'pageview',
//            body:'pageview body',
//            recordsCounter:'pageview toolbar panel#recordsCounter',
//            swipeControlPanel:'pageview toolbar panel#swipeControlPanel',
            sb:'segmentedbutton#catlist',
//            favButton:'pageview toolbar #addFav',
//            minusFontButton:'pageview toolbar #minusFont',
//            plusFontButton:'pageview toolbar #plusFont',
//            shareButton:'pageview toolbar #share'
        },

        control: {
//            mainView:{
//                activeitemchange:'onMainViewAIChange',
//            },
            newsList: {
                itemtap: 'onListItemTap'
            },
//            articlesList: {
//                itemtap: 'onListItemTap'
//            },
//            favoritesList: {
//                itemtap: 'onListItemTap'
//            },
            sb:{
                toggle:'changeCategory'
            },
//            favButton:{
//                tap:'addToFavorites'
//            },
//            minusFontButton:{
//                tap:'lowerFont'
//            },
//            plusFontButton:{
//                tap:'upperFont'
//            },
//            shareButton:{
//                tap:'share'
//            }
        }
    },
    addCategories:function(record){
        var sb = this.getSb();
        sb.add({
            rub_id:record.get('id'),
            text:record.get('name')
        });
        sb.show();
    },
    initView:function(opt){
        var store = this.getNewsList().getStore();
        if(!store.isLoaded() && !store.isLoading()){
            this.getNewsList().setMasked({xtype:'loadmask', message:"Загрузка"});
            this.getNewsList().setLoadingText(' ');
            store.currentPage = 1;
            store.load(this.changeCategoryComplete,this);
        }
        var q = Ext.getStore('NewsRubric');
        
        q.load({
            callback: function(records, operation, success) {
                if (!success)
                    return;
                for(var i = 0; i< records.length; i++){
                    this.addCategories(records[i]);
                }
                // the operation object contains all of the details of the load operation
            },
            scope: this
        })
        //debugger;
//        console.log(123)
    },

//    upperFont:function(){
//        var size = News.app.Settings.upperFont();
//        this.setBodyFontSize(size);
//    },
//    lowerFont:function(){
//        var size = News.app.Settings.lowerFont();
//        this.setBodyFontSize(size);
//    },
//    //private
//    setBodyFontSize:function(size){
//        this.getBody().element.setStyle('font-size',size + 'em');
//    },
    addToFavorites:function(){
        //todo: проверка по type
        var opts,
            favStore,
            model,
            rec,
            index,
            ico;
        opts = this.getBody().getBodyOptions();
        if (!opts || opts.reInit)
            return;
        favStore = this.getFavoritesList().getStore();
        model = favStore.getModel();

        index = this.checkFavorites(opts.record.get('rid'), favStore);
        if (index != -1) {
            //remove record from favorites
            favStore.removeAt(index);
            favStore.sync();
            this.setEnabledFavoritesIcon(false);
            return;
        }

        delete opts.record.data.id
        rec = new model(opts.record.data);

        favStore.add(rec);
        favStore.sync();
        
        this.setEnabledFavoritesIcon(true);
        News.gf.alert('Статья добавлена в избранное! Чтобы удалить ее из избранного нажмите на звездочку еще раз.');
    },
    //private
    checkFavorites:function(rid, favStore){
        if (!favStore)
            favStore = this.getFavoritesList().getStore();
        return favStore.find('rid', rid);        
    },
    //private
    setEnabledFavoritesIcon:function(enabled){
        var ico = this.getFavButton().element.down('span.x-button-icon.x-icon-mask');
        if (!ico)
            return;
        if (enabled)
            ico.addCls('gold');
        else
            ico.removeCls('gold');
    },
    //private
    onStoreLoadFail:function(msg){
        if (!msg)
            msg = "Не могу загрузить данные";
        News.gf.alert(msg);
    },

//    onBodyTap:function(){
//        if (this.getViewport().getActiveItem().xtype != 'pageview')
//            return;
//        this.getPageView().query('toolbar').forEach(function(el){
//            if (el.isHidden())
//                el.show()
//            else
//                el.hide();
//        });
//    },

    launch: function() {
        
//        this.getArticlesList().getStore().on('load', this.setArticleDate, this);
        var newsListStore = this.getNewsList().getStore();
        //em to pixels for XTemplates
        var em,
            container,
            bodyImageWidth;
        container = this.getViewport().element;
        em = new Ext.Element(document.createElement('div'));
        em.setStyle('height','0em');
        em.setStyle('width','1em');
        container.appendChild(em);
        this.em = em.getWidth();
        bodyImageWidth = Math.ceil(container.getWidth() - this.em*1.5);
        Ext.XTemplate.addMember('em',this.em);
        Ext.XTemplate.addMember('listImgSize',Math.ceil(this.em*4.3));
        Ext.XTemplate.addMember('bodyWidth',bodyImageWidth <= 1000 ? bodyImageWidth : 1000);
        container.removeChild(em);
        
        
        //wtf
//        this.setBodyFontSize(News.app.Settings.getFontSize());

    },

    changeCategory:function(me, button, isPressed, e){
        Afisha.gf.isOnline(true);
        var store = this.getNewsList().getStore();
        store.getProxy().setExtraParam('rubric_id',button.config.rub_id);
        //this.getNewsList().setMasked(true);
        this.getNewsList().setLoadingText(' ');
        store.currentPage = 1;
        store.load(this.changeCategoryComplete,this);
    },
    changeCategoryComplete:function(){
        this.getNewsList().setLoadingText(null)
    },
    onListItemTap: function(list, index, target, record){
        var rec_id,
            type,
            store,
            body;
        if (!Afisha.gf.isOnline(true))
            return;
        rec_id = record.get('id');
        //type = record.get('type');
//        store = Ext.getStore('PageView');
        //body = this.getBody();
        this.getApplication().fireEvent('showItem', 'pageview',{
            //type:type,
            rec_id:rec_id
        });
    }
});
