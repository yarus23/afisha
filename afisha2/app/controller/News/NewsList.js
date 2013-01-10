Ext.define('Afisha.controller.News.NewsList', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
//            mainView: 'mainview',
//            viewport: 'newsviewport',
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
    initView:function(opt){
        var store = this.getNewsList().getStore();
        if(!store.isLoaded() && !store.isLoading()){
            this.getNewsList().setMasked({message:"wqe"});
            this.getNewsList().setLoadingText(' ');
            store.currentPage = 1;
            store.load(this.changeCategoryComplete,this);
        }
        console.log(123)
    },
    share:function(){
        var record;
        record = this.getBody().getRecord();
		if (!window.plugins || !window.plugins.share && !window.plugins.shareKit)
			return;

		//try EXTRA_TITLE
		if (window.plugins.share) { //Android
			window.plugins.share.show({
					subject: 'Слобода: ' + record.get('title'),
					text:    record.get('title')+ '\n' + record.get('descr') + '\n' + record.get('url')
				},
				Ext.emptyFn, // Success function
				Ext.emptyFn // Failure function
			);
		} else if (window.plugins.shareKit) { //iOS
			window.plugins.shareKit.share(record.get('title')+ '\n' + record.get('descr') + '\n' + record.get('url'), record.get('url'));
		}		
    },
    upperFont:function(){
        var size = News.app.Settings.upperFont();
        this.setBodyFontSize(size);
    },
    lowerFont:function(){
        var size = News.app.Settings.lowerFont();
        this.setBodyFontSize(size);
    },
    //private
    setBodyFontSize:function(size){
        this.getBody().element.setStyle('font-size',size + 'em');
    },
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
    onMainViewAIChange:function(me,val,oldval,eOpts){
        if (val.xtype == 'articlescontent'){
            if (!News.gf.isOnline(true))
                return;
            this.getArticlesList().getStore().load({
                callback: function(records, operation, success) {
                    if (!success)
                        this.onStoreLoadFail();
                },
                scope: this
            });
        }
    },
    //private
    checkSwipeInterval:function(direction, index, store){
        //todo: autoload pages
        switch(direction){
            case 'left':{
                if (index == store.getCount() - 1){
                    News.gf.alert(store.getNoRightMsg());
                    return -1;
                }
                else
                    return index + 1;
                break;
            }
            case 'right':{
                if (index == 0){
                    News.gf.alert(store.getNoLeftMsg());
                    return -1;
                }
                else
                    return index - 1;
                break;
            }
            default:{
                return -1;
            }
        }
    },
    onBodySwipe:function(direction){
        var opts,
            idx,
            record;
        opts = this.getBody().getBodyOptions();
        if (!opts || !opts.store)
            return;
        idx = this.checkSwipeInterval(direction, opts.index, opts.store);
        if (idx == -1)
            return;
        record = opts.store.getAt(idx);
        this.onListItemTap(opts.list, idx, null, record);
    },
    //private
    historyPush:function(){
        var body,
            record,
            options;
        body = this.getBody();
        record = body.getRecord();
        options = body.getBodyOptions();
        if(record || options)
            this.internalHistory.push({
                record: record,
                opts:   options
            });
        
    },
    //private
    historyBack:function(){
        var data,
            body;
        if (!this.internalHistory.length)
            return false;
        body = this.getBody();
        data = this.internalHistory.pop();
        body.parent.setActiveItem(1);
        body.setBodyOptions(data.opts);
        this.bindData([data.record]);
        return true;
    },
    onInternalHrefTap:function(type, rid){
        var model = this.getFavoritesList().getStore().getModel();
        var record = new model({rid:rid,type:type});
        this.historyPush();
        this.onListItemTap(null, null, null, record);
    },
    onBodyTap:function(){
        if (this.getViewport().getActiveItem().xtype != 'pageview')
            return;
        this.getPageView().query('toolbar').forEach(function(el){
            if (el.isHidden())
                el.show()
            else
                el.hide();
        });
    },
    setArticleDate:function(store, records, successful, operation, eOpts){
        if (!successful || !records.length)
            return;
        this.getArticlesDatePanel().setData({date:records[0].get('date')})
    },
    checkWeatherStoreLoaded:function(){
        var store = Ext.getStore('Weather');
        if (!store.isLoaded() && !store.isLoading()){
            store.load({
                callback: this.weatherStoreLoaded,
                scope: this
            });
        }
    },
    launch: function() {
//        document.addEventListener("backbutton", function(){
//            News.app.dispatch({action:'onBackTap',controller:'Main'},false)
//        }, false);
//        document.addEventListener("menubutton", function(){
//            News.app.dispatch({action:'onBodyTap',controller:'Main'},false)
//        }, false);
//        
//        this.getArticlesList().getStore().on('load', this.setArticleDate, this);
//        var newsListStore = this.getNewsList().getStore();
//        newsListStore.on({
//            load:       this.checkWeatherStoreLoaded,
//            refresh:    this.checkWeatherStoreLoaded,
//            scope:      this 
//        });
//        newsListStore.on('load', function(){
//            var store = Ext.getStore('Weather');
//            if (!store.isLoaded() && !store.isLoading()){
//                store.load({
//                    callback: this.weatherStoreLoaded,
//                    scope: this
//                });
//            }
//        }, this);
//        //
//        //em to pixels for XTemplates
//        var em,
//            container,
//            bodyImageWidth;
//        container = this.getViewport().element;
//        em = new Ext.Element(document.createElement('div'));
//        em.setStyle('height','0em');
//        em.setStyle('width','1em');
//        container.appendChild(em);
//        this.em = em.getWidth();
//        bodyImageWidth = Math.ceil(container.getWidth() - this.em*1.5);
//        Ext.XTemplate.addMember('em',this.em);
//        Ext.XTemplate.addMember('listImgSize',Math.ceil(this.em*4.3));
//        Ext.XTemplate.addMember('bodyWidth',bodyImageWidth <= 1000 ? bodyImageWidth : 1000);
//        container.removeChild(em);
//        
//        this.internalHistory = [];
//        
//        //wtf
//        this.setBodyFontSize(News.app.Settings.getFontSize());
//        var me = this;
//        if (News.gf.isOnline(true))
//            /* загрузка ленты новостей */
//            setTimeout(function(){
//                newsListStore.load({
//                callback: function(records, operation, success) {
//                    if (!success)
//                        me.onStoreLoadFail();
//                },
//                scope: me
//            });
//            },500)
            /*newsListStore.load({
                callback: function(records, operation, success) {
                    if (!success)
                        this.onStoreLoadFail();
                },
                scope: this
            });*/
    },
    weatherStoreLoaded:function(records, operation, success){
        if (success && records.length){
            this.getWeatherPanel().setRecord(records[0]);
            this.getErPanel().setRecord(records[0]);
        }
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
        if (!News.gf.isOnline(true))
            return;
        rec_id = record.get('rid');
        type = record.get('type');
        store = Ext.getStore('NewsView');
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
            News.gf.alert('Невозможно загрузить статью.');
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
        opts = body.getBodyOptions();
        if (opts.reInit){
            var model,
                data;
            model = Ext.getStore('Favorites').getModel();
            data = {};
            model.getFields().eachKey(function(field){
                data[field] = records[0].get(field)
            },this)
            data.type = opts.record.get('type');
            delete data.id;
            delete opts.reInit;
            opts.record = new model(data);
            body.setBodyOptions(opts);
        }        
        script = body.element.query('script');
        wElem = body.element.query('[width]');
        href = body.element.query('[href]');
        src = body.element.query('[src]');
        align = body.element.query('[align]');
        bodyWidth = this.getPageView().element.getWidth() - 1.5 * this.em;
        if (this.checkFavorites(records[0].get('rid')) != -1)
            this.setEnabledFavoritesIcon(true);
        else
            this.setEnabledFavoritesIcon(false);
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
        if (!opts.list){
            this.getSwipeControlPanel().hide()
        } else{
            this.getSwipeControlPanel().show()
            this.getRecordsCounter().setData({index:opts.index + 1,count:opts.list.getStore().getCount()});
        }
        //console.log(records[0]);
        body.parent.setActiveItem(0);
    },
    onBackTap:function(){
        if (this.historyBack())
            return;
        if (this.getViewport().getActiveItem().xtype == 'pageview'){
            this.getViewport().setActiveItem(0);
        }else
            navigator.app.exitApp();
        /*this.getViewport().getLayout().setAnimation({
            type: 'slide',
            direction: 'right'
        });*/
        
    }
});
