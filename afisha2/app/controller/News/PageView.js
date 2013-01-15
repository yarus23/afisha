Ext.define('Afisha.controller.News.PageView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
//            mainView: 'mainview',
//            viewport: 'newsviewport',
            viewport: 'aviewport',
//            weatherPanel: 'newscontent toolbar panel#weatherPanel',
//            erPanel: 'newscontent toolbar panel#erPanel',
//            articlesList:'articlescontent newslist',
//            articlesDatePanel:'articlescontent panel#articleDate',
//            favoritesList:'favcontent newslist',
//            pageView: 'pageview',
            body:'pageview #body',
            favBtn:'pageview favbutton'
//            recordsCounter:'pageview toolbar panel#recordsCounter',
//            swipeControlPanel:'pageview toolbar panel#swipeControlPanel',

//            favButton:'pageview toolbar #addFav',
//            minusFontButton:'pageview toolbar #minusFont',
//            plusFontButton:'pageview toolbar #plusFont',
//            shareButton:'pageview toolbar #share'
        },

        control: {
            favBtn:{
                tap:'onFavBtnTap'
            }
        }
    },
    onFavBtnTap:function(){
        var params = {};
        var store = Ext.getStore('PageView');
        var favStore = Ext.getStore('Favorites');
        params.type = store.getProxy().getExtraParams().type;
        var record = this.getBody().getRecord();
        params.rid = record.get('rid');
        params.title = record.get('title');
        params.descr = record.get('descr');
        favStore.setFav(params);
    },
    initView:function(opt){
        var store = Ext.getStore('PageView');
        var body = this.getBody();
        store.getProxy().setExtraParam('type',opt.type);
        store.getProxy().setExtraParam('id',opt.rec_id);
        //body.setBodyOptions(opt);
        //body.parent.setActiveItem(1);
        body.setMasked({});
        if (!store.isLoaded){//first-time load. 
            var me = this;
            setTimeout(function(){
                store.load(me.bindData, me);
            },500);
        } else
            store.load(this.bindData, this);
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
        return false;
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

        
        
        //wtf
//        this.setBodyFontSize(News.app.Settings.getFontSize());

    },

    changeCategory:function(me, button, isPressed, e){
        Afisha.gf.isOnline(true);
        var store = this.getNewsList().getStore();
        store.getProxy().setExtraParam('rub_id',button.config.rub_id);
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
        rec_id = record.get('rid');
        type = record.get('type');
        store = Ext.getStore('PageView');
        body = this.getBody();
        store.getProxy().setExtraParam('type',type);
        store.getProxy().setExtraParam('id',rec_id);
        body.setBodyOptions({
            list:   list,
            store:  list ? list.getStore() : null,
            index:  index,
            record: record,
            reInit: list ? false : true //если перешли по ссылке, до данных для избранного о статье нету, и надо их заполнить из загруженной статьи
        });
        body.parent.setActiveItem(1);
        this.getViewport().setActiveItem(1);
        if (!store.isLoaded){//first-time load. 
            var me = this;
            setTimeout(function(){
                store.load(me.bindData, me);
            },500);
        } else
            store.load(this.bindData, this);
    },
    bindData:function(records){
        var body,
            wElem,
            href,
            align,
            src,
            script,
            bodyWidth,
            scroller,
            checkUrl,
            opts;
            
        if (!records.length){
            Afisha.gf.alert('Невозможно загрузить статью.');
            return;
        }
        checkUrl = function(el){
            var id,
                arr,
                type;
                //http://www.tula.rodgor.ru/gazeta/906/live/10306/
            if (el.href.indexOf('/news/') != -1)
                type = 'news';
            else if (el.href.indexOf('/gazeta/') != -1)
                type = 'articles';
            if (!type)
                return false;
            arr = el.href.split('/');
            while (!id || isNaN(+id)){
                if (!arr.length)
                    return false;
                id = arr.pop();
            }
            el.setAttribute('type',type);
            el.setAttribute('rid',id);
            el.setAttribute('class','internalLink');
            el.removeAttribute('href');
            return true;
        };
        body = this.getBody();
        body.setRecord(records[0]);
        //приводим к нужному виду, чтобы статья открытая через ссылку нормально добавлялась в избранное
//        opts = body.getBodyOptions();
//        if (opts.reInit){
//            var model,
//                data;
//            model = Ext.getStore('Favorites').getModel();
//            data = {};
//            model.getFields().eachKey(function(field){
//                data[field] = records[0].get(field)
//            },this)
//            data.type = opts.record.get('type');
//            delete data.id;
//            delete opts.reInit;
//            opts.record = new model(data);
//            body.setBodyOptions(opts);
//        }        
        script = body.element.query('script');
        wElem = body.element.query('[width]');
        href = body.element.query('[href]');
        src = body.element.query('[src]');
        align = body.element.query('[align]');
        bodyWidth = this.getViewport().element.getWidth() - 1.5 * this.em;
//        if (this.checkFavorites(records[0].get('rid')) != -1)
//            this.setEnabledFavoritesIcon(true);
//        else
//            this.setEnabledFavoritesIcon(false);
        //remove yandex maps
        script.forEach(function(el,idx){
            var container = el.parentElement.parentElement;
            if (container)
                container.removeChild(el.parentElement);
        });
        align.forEach(function(el,idx){
            if (el.align == 'justify')
                el.align = 'left';
            //костыль для картинок
            //if (el.tagName == "P" && el.align == 'center')
            //    el.style.setProperty('width', bodyWidth + 'px');
        });
        href.forEach(function(el,idx){
            if(!checkUrl(el) && el.href.search('file://') != -1)
                el.setAttribute('href',el.href.replace('file://','http://tula.rodgor.ru'));
            else if(!checkUrl(el) && el.href.search('localhost') != -1)
                el.setAttribute('href',el.href.replace('localhost','tula.rodgor.ru'));
        });
        src.forEach(function(el,idx){
            if(el.src.search('file://') != -1)
                el.setAttribute('src',el.src.replace('file://','http://tula.rodgor.ru'));
            else if(el.src.search('localhost') != -1)
                el.setAttribute('src',el.src.replace('localhost','tula.rodgor.ru'));
        });
        
        wElem.forEach(function(el,idx){
            var width = el.width;
            var height = el.height;
            if (!width)
                return;
            if (width > bodyWidth){
                if (height){
                    var k = height/width;
                    el.style.setProperty('width',bodyWidth + 'px');
                    el.width = bodyWidth;
                    el.style.setProperty('height',(bodyWidth*k) + 'px');
                    el.height = bodyWidth*k;
                }
                else{
                    el.style.setProperty('width',bodyWidth + 'px');
                    el.width = bodyWidth;
                }                
            }
            if (el.tagName == 'IMG')
                el.style.setProperty('display','block');
        });
        scroller = body.getScrollable().getScroller();
        scroller.scrollToTop();
//        if (!opts.list){
//            this.getSwipeControlPanel().hide()
//        } else{
//            this.getSwipeControlPanel().show()
//            this.getRecordsCounter().setData({index:opts.index + 1,count:opts.list.getStore().getCount()});
//        }
        //console.log(records[0]);
//        body.parent.setActiveItem(0);
        body.setMasked(null);
//        debugger;
    }
});
