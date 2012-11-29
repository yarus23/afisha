Ext.regController("main", {


    history:[],//{fn_name:'string', params: options}
    pushToHistory:function(fname, cfg){
        var ln = this.history.length;
        if (!ln || (this.history[ln-1].fn_name != fname))
        {
            this.history.push({
                fn_name:fname, 
                params:cfg
            });
        //console.log('added - ' + fname);
        }
    },
    
    historyBack:function(options){
        /*проброс нажатия кнопки*/
        var adv,
            vp,
            ai,
            mainViewActiveItem,
            offset,
            ln;            
            
        if (this.cancelLoad())
            return;
        if (!this.imageViewer.isHidden())
        {
            this.imageViewer.hide();
            return;
        }
        adv = Ext.getCmp('adv_bottom');
        if (adv && adv.backTap())
            return;
        if (this.afishaMain.backTap && this.afishaMain.backTap())
        {
            return;
        }
        vp = Ext.getCmp('Viewport');
        ai = vp.getActiveItem();
        if (ai.backTap && ai.backTap())//возможно надо закрыть всплывающие панели\диалоги.
        {   
            return;            
        }
        if (ai.id != 'MainView')//переключение на вкладку MainView
        {
            vp.setActiveItem(0);
            return;
        }
        mainViewActiveItem = ai.getActiveItem();
        if (mainViewActiveItem.backTap && mainViewActiveItem.backTap())//возможно надо закрыть всплывающие панели\диалоги .
        {   
            return;            
        }
        /*манипуляции с навигацией*/
        offset = (options && options.incSteps)?options.incSteps:0;
        ln = this.history.length;
        if (ln >= 2 + offset)
        {
            for (var i = 0; i < offset + 1; i++)
                this.history.pop();
            var cPage = this.history[ln-2-offset]
            this[cPage.fn_name].call(this,cPage.params,true,options);
            if (this.history.length == 1)
                adv.advLoad();
        }
        else
            Afisha.exit();
    //console.log(cPage.fn_name + ' - ' + this.history.length);  
    },
    
    cancelLoad:function(){
        if (!Afisha.lastRequest)
            return false;
        if (Afisha.lastRequest.ajax && Ext.Ajax.isLoading(Afisha.lastRequest.ajax))//abort request
        {
            Ext.Ajax.abort(Afisha.lastRequest.ajax);
            delete Afisha.lastRequest.ajax;
            Afisha.lastRequest.callback.apply();
            Afisha.lastRequest = null;
            return true;
        }
        if (Afisha.lastRequest.fileTransfer)//can't abort uploading
        {
            Afisha.lastRequest.callback.apply();
            Afisha.lastRequest = null;
            return true;
        }
        return false;
    },
    
    showFavoriteImpl: function(options)
    {
        var store = Afisha.stores[options.category + 'PlacesStore'];
        var foundId = store.findBy(function(record, id){
            return options.id === record.data.id
        });
       
        if( foundId < 0 ) {
            Ext.Msg.alert(G.app_name, 'Данный объект был удален из каталога.');
            favStore.removeAt(options.index);
            favStore.sync();
            return;
        }

        var rec = Afisha.stores.CategoriesStore.findRecord('type', options.category, 0, false, true, true);
    
        // обновить информацию объекта
        var fr = favStore.getAt(options.index);
        Ext.apply(fr.data, store.getAt(foundId).data);
        fr.set('category', options.category);
        fr.setDirty();
 
        favStore.sync();
       
        Ext.getCmp('Viewport').setLoading(false);
   
        // перейдем на 'главную'
        var vp = Ext.getCmp('Viewport');
        vp.setActiveItem(0);
       
        this.showPlaceDetails({
            data: store.getAt(foundId),
            record: store.getAt(foundId).data,
            model: store.getProxy().getModel(),
            store: store,
            type: rec ? rec.data.right.id : undefined,
            category: options.category
        }) 
    },
    
    showFavorite: function(options) {
        // подгружаем категорию
        var me = this;
        Afisha.loadStore(options.category, function(){
            me.showFavoriteImpl(options)
        });
      
    },
    
    //нажатие на аппаратную кнопку меню
    menuTap:function(){
        if (!this.imageViewer.isHidden())
            return;
        if(this.afishaMain.tabBar.isHidden())
        {
            this.afishaMain.tabBar.show();
            this.afishaMain.componentLayout.childrenChanged = true;//sencha-bugs?
            this.afishaMain.doComponentLayout();
        }
        else
        {
            this.afishaMain.tabBar.hide();
            this.afishaMain.componentLayout.childrenChanged = true;//sencha-bugs?
            this.afishaMain.doComponentLayout();
        }
    },
    
    // изначальный рендеринг
    list: function(options,isBack) {
        if (!isBack) this.pushToHistory('home', options);
        // включаем watch
        Afisha.geo = new Geo();
        Afisha.geo.startFastWatch(function(position){
            Afisha.position = position;
        // если активна сортировка по расстоянию то сортируем
        // todo:
        }, function(err){
            //debugger;
            //alert('geo err')
            });

        this.imageViewer = this.render({
            xtype:'panel',
            id:'imageViwer',
            hidden:true,
            floating:true,
            monitorOrientation:true,
            modal:true,
            fullscreen:true,
            scope:this,
            items:{
                xtype    : 'myCarousel',
                itemId:'bigCarousel',
                fullscreen:true,
                direction: 'horizontal',
                preview: false
            }

        }, Ext.getBody());
        this.authView = this.render({
            id: 'authView',
            cls: 'auth_view',
            //html: '<h1>asdsadsad</h1>',
            //xtype: 'panel',
            fullscreen: false,
            xtype: 'ShareAuth',
            hideOnMaskTap: false,
            showAnimation: {
                type: 'pop',
                duration: 250
            },
            /*            showAnimation: {
                type: 'slide',
                direction: 'down'
            },
            hideAnimation: {
                type: 'slide',
                direction: 'down'
            },*/
            modal:true,
            width: '90%',
            centered: true,
            floating:true,
            close: function () {
                Ext.dispatch({      
                    controller: 'main',
                    action: 'historyBack'
                });                 
            },
            style: 'padding: 0; background-color: white;',
            plugins: [new Ext.ux.PanelAction({
                actionMethod: 'close',
                iconClass: 'x-panel-action-icon-close',
                position: 'tr'
            })]
        }, Ext.getBody());

        this.afishaMain = this.render({
            xtype: 'AfishaMain'
        }, Ext.getBody());
        this.authView.initialize();
    },
    
    showPicture:function(options){
        var view = Ext.getCmp('imageViwer');
        if (!options.isPreview)
        {
            view.hide();
            return;
        }
        view.show();
        view.down('#bigCarousel').bindData(options.data, options.idx);
    },
    
    setPage: function(id, direction,callback) { 
        var view = Ext.getCmp('Viewport');
        var tab = view.items.items[0];
        tab.setActiveItem(tab.down(id), {
            type: 'slide', 
            direction:direction
        }); 
    },
    
    showSubCategory: function(options, isBack) {       
        //if (!isBack) 
        //    this.pushToHistory('showSubCategory',options);       
        
        var panel = Ext.getCmp('Home');

        // покажем кнопку Back
        var button = panel.down('button');
        if (Afisha.showButtons)
        {
            button.setVisible(true);
            button.setText('Назад');
        }
       
        panel.backTap = function(){
            //var panel = Ext.getCmp('Home');
            //var button = panel.down('button');
            button.setText('Выход');
            button.setHandler(panel.categoiesFn);
            options.list.bindStore(Afisha.stores.CategoriesStore);
            options.list.scroller.scrollTo({
                x: 0, 
                y: 0
            });
           
            if( !Ext.is.Nokia ) button.setVisible(false);
            panel.backTap = false;
            panel.dockedItems.items[0].setTitle(panel.categoriesTitle);
            return true;
        }
        // todo: привязать к back button
        button.setHandler(function(){
            panel.backTap();
        }, this);
       
        options.list.bindStore(options.record.subcategories);
        options.list.scroller.scrollTo({
            x: 0, 
            y: 0
        });
       
        // сохраним старый тайтл
        panel.categoriesTitle = panel.dockedItems.items[0].title;
        panel.categoiesFn = panel.dockedItems.items[0].handler;
       
        // установим новый
        panel.dockedItems.items[0].setTitle(options.record.name);
        panel.doComponentLayout();

    },
    
    // нажали на категорию, показываем список событий/мест
    showItems: function(options,isBack) {
        var me = this;
        GoogleAnalytics.page('Category', options.record.name);
        var adv = Ext.getCmp('adv_bottom');
        if (adv)
            adv.advLoad(options.record.type);
        Afisha.loadStore(options.record.type, function(){
            me.showItemsLoaded(options, isBack)
        });
    },
    
    showItemsLoaded: function(options, isBack) {
        if (!isBack) 
            this.pushToHistory('showItems',options);       
        else 
            options.direction = 'right';

        this.lastRequest = null;
        var eventList = Ext.getCmp('EventsViewport');
        eventList.comeFrom = options.record.id;

        eventList.sortButton.checkIcon(eventList.comeFrom)
        eventList.topToolbar.setTitle(options.record.name);        

        if( Ext.is.Android )
            Ext.getCmp('EventsViewport').el.addCls('nobackface');

        // показываем/прячем тулбар выбора мест/событий
        var relayout;
       
        var tabToolbar = eventList.tabs.getTabBar();
       
        if( options.record.hiddenToolbar && !tabToolbar.isHidden() )
        {
            tabToolbar.hide();
            relayout = true;
        }
        else
        if( !options.record.hiddenToolbar && tabToolbar.isHidden() )
        {
            tabToolbar.show();
            relayout = true;
        }     
      
        // корректируем названия кнопок таббара
        tabToolbar.items.items[0].setText(options.record.left.name);
        tabToolbar.items.items[1].setText(options.record.left.name);
        tabToolbar.items.items[2].setText(options.record.right.name ? options.record.right.name : options.record.name);


        var tabName = options.record.type === 'cinema' ? 'FilmsList' : 'EventsList';
       
        // установим новые store
        Ext.apply(eventList.down(tabName), {
            applyStore: options.record.left.store,
            type: options.record.left.id,
            storeName: options.record.type // для favorites
        });
       
        eventList.down('PlacesList').sortType = null;
        eventList.down('EventsList').sortType = null;
        eventList.down('FilmsList').sortType = null;
       
        if (!isBack && options.record.right.store.hideGroups)
            delete options.record.right.store.hideGroups;
        Ext.apply(eventList.down('PlacesList'), {
            applyStore: options.record.right.store,
            type: options.record.right.id,
            storeName: options.record.type
        });

        if( relayout ) {
        // eventList.tabs.doComponentLayout();
        // eventList.doComponentLayout();
        }
        eventList.hiddenLeft = !options.record.left;
       
        if( !isBack )
            eventList.fromCategories = true;
              
        this.setPage('EventsViewport', options.direction?options.direction:'left');
    },
    
    home: function(options,isBack) {
        while(this.history.length != 1)
        {
            this.history.pop();
        }
        if (!isBack) 
            this.pushToHistory('home',options);
        this.setPage('Home', 'right');
    },
    
    backToList: function(){
        this.setPage('EventsViewport', 'right');
    },
    showEventDetails: function(options, isBack) {
        GoogleAnalytics.page('Event', options.record.name);
        if (!isBack) 
            this.pushToHistory('showEventDetails',options);
        else
            options.direction = 'right';            
        var dv = Ext.getCmp('detailsEvents');
        dv.bindData(options,this.setPage,this);
    },
    
    showPlaceDetails: function(options, isBack) {
        GoogleAnalytics.page('Place', options.record.name);
        if (!isBack) 
            this.pushToHistory('showPlaceDetails', options);
        else
            options.direction = 'right';
        var dv = Ext.getCmp('detailsPlaces');
        dv.bindData(options,this.setPage,this);
    },
    
    showFullSchedule: function(options, isBack) {
        if (!isBack) 
            this.pushToHistory('showFullSchedule', options);
        else
            options.direction = 'right';
        var fsv = Ext.getCmp('fullScheduleView');
        fsv.bindData(options,this.setPage,this);
    },
    
    goHref:function (options){
        if (options.hrefEl)
            options.hrefEl.mouseClick();
    },
    
    showMap:function(options, isBack){
        if (!isBack)  
            this.pushToHistory('showMap', options);
        else
            options.direction = 'right';
        this.setPage('mapView', options.direction?options.direction:'left');
        var dv = Ext.getCmp('mapView');
        dv.showMap(options.coords);
    },
    
    showComments:function(options, isBack,flags){
        if (!isBack) 
            this.pushToHistory('showComments', options);
        else
            options.direction = 'right';
        var fsv = Ext.getCmp('commentsView');
        if (flags && flags.reload)
        {
            fsv.reload = true;
            fsv.scrollBottom = true;
        }
        fsv.bindData(options,this.setPage,this);
    },
    
    sendComment:function(options, isBack){
        if (!isBack) 
            this.pushToHistory('sendComment', options);
        else
            options.direction = 'right';
        var p = Ext.getCmp('SendComment');
        p.commentId = {
            id: options.el_id, 
            type:options.el_type, 
            el_name:options.el_name
        };
        this.setPage('#SendComment', options.direction?options.direction:'left');
    //console.log(options.el_id);  //параметры для идентификации объекта, 
    //console.log(options.el_type);//к которому шлем отзыв
    },
    validateFilterType:function(options){
        //console.log(options.filterName)
        //console.log(this[options.filterName])
        return;
        if (this[options.filterName])
            this[options.filterName].call();
    },
    sortByDate: function() {
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.sort([datesSort, quotesSort]); 
    },
    
    sortByAsc: function() {
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.hideGroups = true;
        if( activeItem.getId() == 'FilmsList' )
            activeItem.store.sort([groupSort, quotesSort]);
        else
            activeItem.store.sort([quotesSort]);

        activeItem.resetScroll();
        activeItem.updateWidth();
    },
    
    sortByRating: function() {
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.hideGroups = true;
        if( activeItem.getId() == 'FilmsList' )
            activeItem.store.sort([groupSort, {
                property: 'vote', 
                direction: 'DESC'
            }]);
        else
            activeItem.store.sort('vote', 'DESC');

        activeItem.resetScroll();
        activeItem.updateWidth();
    },
    
    sortByDistance: function(){
        var activeItem = Ext.getCmp('EventsViewport').tabs.getActiveItem();
        if( activeItem.getId() == 'EventsList' ) return; // nonsense
        
        //if( !Afisha.position ) {
        if(!Afisha.useGPS){
            Ext.Msg.alert(G.app_name, 'Включите использование GPS в настройках приложения!');
            return;
        } else 
{
            activeItem.store.hideGroups = true;
            activeItem.store.sort([{
                sorterFn: function(l1, l2) {
                    var d1 = Geo.dist(l1.data.lat, l1.data.lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
                    var d2 = Geo.dist(l2.data.lat, l2.data.lng, Afisha.position.coords.latitude, Afisha.position.coords.longitude);
                    return d1 > d2 ? 1 : (d1 < d2 ? -1 : 0);
                }
            }]);
        }
             
        activeItem.resetScroll();        
        activeItem.updateWidth();
    },
    filterCurrentDay:function(){
        var cDate = new Date();
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.filterBy(function(record, id){
            return this.scheduleStore.ckeckByDate(record.data.id, this.date, false)
        },{
            scheduleStore:Afisha.stores[activeItem.store.schedule],
            date:cDate.format('Y-m-d')
        });
        activeItem.resetScroll();
        activeItem.updateWidth();
    },
    filterNextDay:function(){
        var cDate = new Date();
        cDate.nextDay();
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.filterBy(function(record, id){
            return this.scheduleStore.ckeckByDate(record.data.id, this.date, false)
        },{
            scheduleStore:Afisha.stores[activeItem.store.schedule],
            date:cDate.format('Y-m-d')
        });
        activeItem.resetScroll();
        activeItem.updateWidth();
    },
    filterCurrentWeek:function(){
        var cDate = new Date();
        var startDate = cDate.format('Y-m-d');
        for (var i = cDate.format('w'); i<7; i++)
        {
            cDate.nextDay();
        }
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.filterBy(function(record, id){
            return this.scheduleStore.ckeckByDate(record.data.id, this.start_date, this.end_date)
        },{
            scheduleStore:Afisha.stores[activeItem.store.schedule],
            start_date:startDate,
            end_date:cDate.format('Y-m-d')
        });
        activeItem.resetScroll();
        activeItem.updateWidth();
    },
    filterNextWeek:function(){
        var cDate = new Date();
        var startDate;
        for (var i = cDate.format('w'); i<14; i++)//monday
        {
            if ((i - 1) == 7)
            {
                startDate = cDate.format('Y-m-d');
            }
            cDate.nextDay();
        }
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.filterBy(function(record, id){
            return this.scheduleStore.ckeckByDate(record.data.id, this.start_date, this.end_date)
        },{
            scheduleStore:Afisha.stores[activeItem.store.schedule],
            start_date:startDate,
            end_date:cDate.format('Y-m-d')
        });
        activeItem.resetScroll();
        activeItem.updateWidth();
    },
    filterAllDays:function(){
        var viewport = Ext.getCmp('EventsViewport');
        var activeItem = viewport.tabs.getActiveItem();
        activeItem.store.clearFilter();
        activeItem.resetScroll();
        activeItem.updateWidth();
    },
    sendNews:function(options){
        var win =  function(response, opts) {
            Afisha.lastRequest = null;
            if (options.mask)
                options.mask.hide();
            Ext.Msg.alert(G.app_name, options.msg, function(){
		if( options.vote )
                    Afisha.Rating.set(options.elem_type + options.elem_id, options.vote);
                Ext.dispatch({
                    controller: 'main',
                    action: 'historyBack',
                    //incSteps: (options.elem_id && options.elem_type)?1:0
                    reload:(options.elem_id && options.elem_type)?true:false
                });
            });
        };
        var fail = function(response, opts) {
            Afisha.lastRequest = null;
            if (options.mask)
                options.mask.hide();
            Ext.Msg.alert(G.app_name, options.failMsg);
        }
        if (options.elem_type) { // отправка комментария
            /*Afisha.Auth.userdata.name = {
                first_name: Afisha.Auth.userdata.first_name,
                last_name: Afisha.Auth.userdata.last_name,
                full_name: Afisha.Auth.userdata.full_name
            };*/
            var params = {
                elem_type: options.elem_type,
                elem_id: options.elem_id,
                pid: 0,
                body: options.newsText,
                region_id: 1,
                vote: options.vote,
                user_data: JSON.stringify(Afisha.Auth.userdata),
                sign: hex_md5(JSON.stringify(Afisha.Auth.userdata) + Afisha.secret_key)
            };
            Afisha.lastRequest = {
                callback:function(){
                    options.mask.hide();
                }
            };

            Afisha.lastRequest.ajax = Ext.Ajax.request({
                url: server_script_comments_url,
                method: 'POST',
                params: params,
                success: win,
                failure: fail
            });
            return;
        }
        // отправка новости
        if (options.uploadImage !== null)
        {
            var foptions = new FileUploadOptions();
            foptions.fileKey="file";
            foptions.fileName=options.uploadImage.substr(options.uploadImage.lastIndexOf('/')+1);
            foptions.mimeType="image/jpeg";

            var params = new Object();
            params.text = options.newsText;
            params.userName = Afisha.Auth.userdata.identity;
            
            foptions.params = params;
            
            var ft = new FileTransfer();
            Afisha.lastRequest = {
                fileTransfer:true,
                callback:function(){
                    options.mask.hide();
                }
            };
            ft.upload(options.uploadImage, "http://tula.rodgor.ru/nafisha/news_post.php", win, fail, foptions);
        }
        else
        {
            var cfg = {};
            cfg.text = options.newsText;
            cfg.userName = Afisha.Auth.userdata.identity;
            if (options.elem_id && options.elem_type)
            {
                cfg.elem_id = options.elem_id;
                cfg.elem_type = options.elem_type;
                cfg.name = options.name;
            }
            Afisha.lastRequest = {
                callback:function(){
                    options.mask.hide();
                }
            };
            Afisha.lastRequest.ajax = Ext.Ajax.request({
                url: 'http://tula.rodgor.ru/nafisha/news_post.php',
                method:'POST',
                params:cfg,
                success: win,
                failure:fail
            });
        }
    },
    /* Share */
    setSharePage: function(id, direction, from) { 
        var view = Ext.getCmp('Viewport');
        var tab = view.items.items[3]; // TODO: заменить это на нормальный код
        if( !tab )
            tab = view.items.items[2];
        tab.setActiveItem(tab.down(id), from == 'viewport' ? null : {
            type: 'slide', 
            direction: direction
        }); 
    },
    showSharePage: function(options, is_back) {
        //var view = Ext.getCmp('Viewport');        
        var sp = Ext.getCmp(options.toView);
        if(sp.id == 'ShareMain' && options.from != 'viewport') {
            this.setSharePage(sp.id, 'right', options.from);
        } else {
            this.setSharePage(sp.id, 'left', options.from);
        }
    },
    
    // auth
    showAuthView: function () {
        var authView = Ext.getCmp('authView');
        authView.show();
    },
    hideAuthView: function () {
        var authView = Ext.getCmp('authView');
        authView.hide();
    }
});
