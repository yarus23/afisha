Ext.define("Afisha.controller.Navigation",{extend:"Ext.app.Controller",config:{useAnimation:true,refs:{viewport:"aviewport",backButton:"aviewport backbutton",imgFullView:"aviewport imgfullview"},control:{backButton:{tap:"onBackButtonTap"}}},launch:function(){document.addEventListener("backbutton",function(){Afisha.app.getApplication().fireEvent("goBack")},false);this.getApplication().on({showItem:this.showItem,goBack:this.onBackButtonTap,scope:this});this.pushToHistory(this.getViewport().getActiveItem().xtype,null)},_history:[],pushToHistory:function(c,a){var b=this._history.length;if(b&&this._history[b-1].xtype==c){return}this._history.push({xtype:c,options:a})},backFromHistory:function(){if(this._history.length<2){navigator.app.exitApp();return}this._history.pop();var c=this._history[this._history.length-1];if(c.options){var b=this.getItem(c.xtype);var a=this.getConntroller(b.getControllerName());if(a&&a.initView){a.initView(c.options)}}this.switchPanels(c.xtype,"right")},getItem:function(b){var a=this.getViewport().getItems();return a.findBy(function(d,c){if(d.xtype==b){return true}return false})},getConntroller:function(a){return Afisha.app.getController(a)},showItem:function(e,b,c){if(c!==true){this.pushToHistory(e,null)}else{this.pushToHistory(e,b)}var d=this.getItem(e);var a=this.getConntroller(d.getControllerName());if(a&&a.initView){a.initView(b)}this.switchPanels(e,"left")},switchPanels:function(b,a){if(this.getUseAnimation()&&a){this.getViewport().animateActiveItem(b,{type:"slide",direction:a})}else{this.getViewport().setActiveItem(b)}},onBackButtonTap:function(){var b=this.getViewport().getActiveItem();var c=b.getControllerName();var a=this.getConntroller(c);if(a&&a.goBack&&a.goBack()){return}this.backFromHistory()}});