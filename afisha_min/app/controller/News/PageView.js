Ext.define("Afisha.controller.News.PageView",{extend:"Ext.app.Controller",config:{refs:{viewport:"aviewport",bodyContainer:"pageview #bodyContainer",body:"pageview #body",title:"pageview panel#nv_title",favBtn:"pageview favbutton"},control:{favBtn:{tap:"onFavBtnTap"}}},onFavBtnTap:function(){var d={};var b=Ext.getStore("PageView");var c=Ext.getStore("Favorites");d.type="news";var a=this.getBody().getRecord();d.rid=a.get("id");d.title=a.get("title");d.descr=a.get("description");this.getFavBtn().setState(c.setFav(d))},initView:function(c){var b=Ext.getStore("PageView");var a=this.getBody();var f=this.getBodyContainer();f.setMasked({xtype:"loadmask",message:"Загрузка",cls:"pv_mask",style:"background-color:gray;"});b.getProxy().setExtraParam("id",c.rec_id);var e=Ext.getStore("Favorites");this.getFavBtn().setState(e.isRecordInFav(c.type,c.rec_id));if(!b.isLoaded){var d=this;setTimeout(function(){b.load(d.bindData,d)},500)}else{b.load(this.bindData,this)}},checkFavorites:function(a,b){return false;if(!b){b=this.getFavoritesList().getStore()}return b.find("rid",a)},setEnabledFavoritesIcon:function(a){var b=this.getFavButton().element.down("span.x-button-icon.x-icon-mask");if(!b){return}if(a){b.addCls("gold")}else{b.removeCls("gold")}},onStoreLoadFail:function(a){if(!a){a="Не могу загрузить данные"}News.gf.alert(a)},launch:function(){},bindData:function(e){var h,m,f,c,j,b,l,k,g,d,a;var i=this.getBodyContainer();if(!e.length){Afisha.gf.alert("Невозможно загрузить статью.");return}d=function(p){var q,n,o;if(p.href.indexOf("/news/")!=-1){o="news"}else{if(p.href.indexOf("/gazeta/")!=-1){o="articles"}}if(!o){return false}n=p.href.split("/");while(!q||isNaN(+q)){if(!n.length){return false}q=n.pop()}p.setAttribute("type",o);p.setAttribute("rid",q);p.setAttribute("class","internalLink");p.removeAttribute("href");return true};m=this.getTitle();h=this.getBody();h.setRecord(e[0]);m.setRecord(e[0]);l=h.element.query("script");f=h.element.query("[width]");c=h.element.query("[href]");b=h.element.query("[src]");j=h.element.query("[align]");k=this.getViewport().element.getWidth()-1.5*this.em;l.forEach(function(p,n){var o=p.parentElement.parentElement;if(o){o.removeChild(p.parentElement)}});j.forEach(function(o,n){if(o.align=="justify"){o.align="left"}});c.forEach(function(o,n){if(!d(o)&&o.href.search("file://")!=-1){o.setAttribute("href",o.href.replace("file://","http://tula.rodgor.ru"))}else{if(!d(o)&&o.href.search("localhost")!=-1){o.setAttribute("href",o.href.replace("localhost","tula.rodgor.ru"))}}});b.forEach(function(o,n){if(o.src.search("file://")!=-1){o.setAttribute("src",o.src.replace("file://",Global.img_url))}else{if(o.src.search("localhost")!=-1){o.setAttribute("src",o.src.replace("localhost",Global.img_url))}}});f.forEach(function(r,o){var q=r.width;var n=r.height;if(!q){return}if(q>k){if(n){var p=n/q;r.style.setProperty("width",k+"px");r.width=k;r.style.setProperty("height",(k*p)+"px");r.height=k*p}else{r.style.setProperty("width",k+"px");r.width=k}}if(r.tagName=="IMG"){r.style.setProperty("display","block")}});g=i.getScrollable().getScroller();g.scrollToTop();i.setMasked(null)}});