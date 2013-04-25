Ext.define('Afisha.controller.Navigation', {
    extend: 'Ext.app.Controller',

    config: {
        useAnimation:true,
        refs: {
            viewport: 'aviewport',
            backButton: 'aviewport backbutton',
            imgFullView: 'aviewport imgfullview'
        },

        control: {
            //imgFullView: {
            //    tap:'onBackButtonTap'
            //},
            backButton:{
                tap:'onBackButtonTap'
            }
        }
    },
    launch: function(){
        document.addEventListener("backbutton", function(){
           Afisha.app.getApplication().fireEvent('goBack');
            //Afisha.app.dispatch({action:'goBack',controller:'Navigation'},false)
        }, false);
        this.getApplication().on({
            showItem: this.showItem,
            goBack: this.onBackButtonTap,
            scope: this});
        //
        this.pushToHistory(this.getViewport().getActiveItem().xtype,null);
    },
    _history:[],
    pushToHistory:function(xtype, options){
        var ln = this._history.length;
        if (ln && this._history[ln-1].xtype == xtype)
            return;
        this._history.push({xtype:xtype, options:options})
    },
    backFromHistory:function(){
        //debugger;
        if (this._history.length < 2){
            navigator.app.exitApp();
            return;//
        }
        this._history.pop();
        var currentEl = this._history[this._history.length - 1];
        //debugger;
        if (currentEl.options){
            var item = this.getItem(currentEl.xtype);
            var controller = this.getConntroller(item.getControllerName());
            if (controller && controller.initView)
                controller.initView(currentEl.options);
        }
        this.switchPanels(currentEl.xtype, 'right');
    },
    getItem:function(_xtype){
        var items = this.getViewport().getItems();
        return items.findBy(function(a,b){if (a.xtype == _xtype) return true; return false; });
    },
    getConntroller:function(name){
        return Afisha.app.getController(name);
    },
    //reInit - вызывать ли инит элемента при переходен Назад на него (нужно для зацикленных переходов типа кино-фильм-кино)
    showItem:function(xtype, options, reInit ){
        //<DEBUG>
		if (xtype === 'events' && options && !options.userdata) {
		    var OAuthController = Afisha.app.getController('AfishaC.OAuth'),
                callback = function (userdata) {
                    options = options || {};
                    options.userdata = userdata;
                    Afisha.app.fireEvent('showItem', 'events', options);
                };
            OAuthController.getUserData(callback);
            return;
        }
        //</DEBUG>
        if (reInit !== true){
            this.pushToHistory(xtype, null);
        }
        else{
            this.pushToHistory(xtype, options);
        }
        var item = this.getItem(xtype);
        var controller = this.getConntroller(item.getControllerName());
        if (controller && controller.initView)
            controller.initView(options);
        this.switchPanels(xtype, 'left');
        
    },
    switchPanels:function(xtype, animDirection){
        if (this.getUseAnimation() && animDirection)
            this.getViewport().animateActiveItem(xtype, {type: 'slide', direction: animDirection})
        else
            this.getViewport().setActiveItem(xtype);
    },
    onBackButtonTap:function(){
        var item = this.getViewport().getActiveItem();
        var controllerName = item.getControllerName();
        var controller = this.getConntroller(controllerName);
        //console.log(controller)
        if (controller && controller.goBack && controller.goBack()){
            //console.log('yes')
            return;
        }
        this.backFromHistory();
        //console.log('no')
    }
});
