Ext.define('Afisha.controller.Discount.DiscList', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
//            mainView: 'mainview',
//            viewport: 'newsviewport',
            viewport: 'aviewport',
            discList: 'disclist #disclist',
//            weatherPanel: 'newscontent toolbar panel#weatherPanel',
//            erPanel: 'newscontent toolbar panel#erPanel',
//            articlesList:'articlescontent newslist',
//            articlesDatePanel:'articlescontent panel#articleDate',
//            favoritesList:'favcontent newslist',
//            pageView: 'pageview',
//            body:'pageview body',
//            recordsCounter:'pageview toolbar panel#recordsCounter',
//            swipeControlPanel:'pageview toolbar panel#swipeControlPanel',
            sb:'disclist segmentedbutton#disc_catlist',
//            favButton:'pageview toolbar #addFav',
//            minusFontButton:'pageview toolbar #minusFont',
//            plusFontButton:'pageview toolbar #plusFont',
//            shareButton:'pageview toolbar #share'
        },

        control: {
            discList: {
                itemtap: 'onListItemTap'
            },
            sb:{
                toggle:'changeCategory'
            }
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
        var store = this.getDiscList().getStore();
        if(!store.isLoaded() && !store.isLoading()){
            this.getDiscList().setMasked({message:"wqe"});
            this.getDiscList().setLoadingText(' ');
            store.currentPage = 1;
            store.load(this.changeCategoryComplete,this);
        }
        var q = Ext.getStore('DiscRubric');
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
    onStoreLoadFail:function(msg){
        if (!msg)
            msg = "Не могу загрузить данные";
        Afisha.gf.alert(msg);
    },

    launch: function() {
        
//        this.getArticlesList().getStore().on('load', this.setArticleDate, this);
//        var newsListStore = this.getDiscList().getStore();
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
        var store = this.getDiscList().getStore();
        store.getProxy().setExtraParam('rubric_id',button.config.rub_id);
        //this.getNewsList().setMasked(true);
        this.getDiscList().setLoadingText(' ');
        store.currentPage = 1;
        store.load(this.changeCategoryComplete,this);
    },
    changeCategoryComplete:function(){
        this.getDiscList().setLoadingText(null)
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
        this.getApplication().fireEvent('showItem', 'discview',{
            //type:type,
            rec_id:rec_id
        });
    }
});
