Ext.define("Afisha.controller.Discount.DiscView",{extend:"Ext.app.Controller",config:{currentType:"",currentRecord:null,refs:{viewport:"aviewport",disvView:"aviewport discview",photogallery:"aviewport discview photogallery",header:"aviewport discview panel#disc_title",descr:"aviewport discview panel#disc_descr",price:"aviewport discview panel#disc_price panel#disc_price_val ",discount:"aviewport discview panel#disc_disc panel#disc_disc_val",save:"aviewport discview panel#disc_save panel#disc_save_val",text:"aviewport discview panel#disc_text",conditions:"aviewport discview panel#disc_conditions",timeOut:"aviewport discview img#disc_timeout",buttons:"aviewport discview panel#disc_buttons_cont",favBtn:"aviewport discview favbutton",as:"aviewport discview actionsheet"},control:{favBtn:{tap:"onFavBtnTap"}}},onPVShow:function(){},onMapBtnClick:function(){var a=this.getData();if(!a||a.latitude==0||a.longitude==0){return}Afisha.app.fireEvent("showItem","mapview",a)},checkButtons:function(b){var d=this.getButtons();d.removeAll();var g=b.get("address");var f=b.get("coordinates");var e={value:g,latitude:0,longitude:0};if(f&&f.split(",").length==2){e.latitude=f.split(",")[0];e.longitude=f.split(",")[1]}var a=b.get("phone");if(g&&g.length){var c={xtype:"button",cls:"discount_button",iconCls:"map-mask",style:"border-right:1px solid #949494",iconAlign:"left",flex:1,text:g,data:e,handler:this.onMapBtnClick};d.add(c)}if(a&&a.length){var c={xtype:"button",cls:"discount_button",iconCls:"phone-mask",style:"border-left:1px solid #949494",iconAlign:"left",flex:1,text:a,handler:this.showPhoneList,scope:this};d.add(c)}},showPhoneList:function(){var b=this.getCurrentRecord().get("phone");var e=b.split(",");var d=[];for(var c=0;c<e.length;c++){d.push({style:"padding: 0em; margin:1em; height:3em;",handler:null,html:'<a class="x-button-label" style="color:black; text-decoration: none; padding: .8em .6em;" href="tel:'+e[c]+'">'+e[c]+"</a>"})}d.push({text:"Отмена",action:"cancel",params:null,ui:"decline",handler:this.closeAS,scope:this,style:"margin:1em;"});var a=this.getAs();a.removeAll();a.add(d);if(d.length){a.show()}},closeAS:function(){this.getAs().hide()},getTimeOutObj:function(){var e=this.getCurrentRecord().get("end_datetime");var b=new Date();var c={days:0,hours:0,minutes:0};if(e<=b){return c}var d=e-b;var a=d/(1000*60*60*24);c.days=Math.floor(a);a-=c.days;a*=24;c.hours=Math.floor(a);a-=c.hours;a*=60;c.minutes=Math.floor(a);return c},initView:function(b){var a=Ext.getStore("DiscView");this.getDisvView().setMasked({xtype:"loadmask",message:"Загрузка",style:"background-color:gray;"});a.getProxy().setExtraParam("id",b.rec_id);var d=Ext.getStore("Favorites");this.getFavBtn().setState(d.isRecordInFav("discount",b.rec_id));if(!a.isLoaded){var c=this;setTimeout(function(){a.load(c.bindData,c)},500)}else{a.load(this.bindData,this)}},onFavBtnTap:function(){var d={};var b=Ext.getStore("DiscView");var c=Ext.getStore("Favorites");d.type="discount";var a=this.getCurrentRecord();d.rid=a.get("id");d.title=a.get("title");d.descr=a.get("description");this.getFavBtn().setState(c.setFav(d))},bindData:function(b){if(!b.length){Afisha.gf.alert("Невозможно загрузить статью.");return}var a=b[0];this.setCurrentRecord(a);this.getHeader().setData(a.data);this.getDescr().setData(a.data);this.updateGallery(a);this.getPrice().setData(a.data);this.getDiscount().setData(a.data);this.getSave().setData(a.data);this.checkButtons(a);this.getTimeOut().setData(this.getTimeOutObj());this.getText().setData(a.data);this.getConditions().setData(a.data);this.getDisvView().setMasked(null)},updateGallery:function(a){var f=[];var d=Global.img_url;var c=a.get("image");if(c&&c.length){f.push(d+c)}c=a.get("images");for(var b=0;b<c.length;b++){f.push(d+c[b][0])}var e=this.getPhotogallery();e.loadPictureList(f)},goBack:function(){return false}});