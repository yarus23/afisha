Ext.define("Afisha.controller.AfishaC.PlaceView",{extend:"Ext.app.Controller",config:{currentType:"",currentRecord:null,refs:{viewport:"aviewport",selectfield:"aviewport placeview toolbar selectfield",title:"aviewport placeview panel#pv_header panel#pv_title",rateCount:"aviewport placeview panel#pv_header panel#pv_rate_count",rateImg:"aviewport placeview panel#pv_header img#rateImg",buttons:"aviewport placeview panel#pv_buttons",mapBtn:"aviewport placeview mapbutton button",mapEl:"aviewport placeview mapbutton",photogallery:"aviewport placeview photogallery",schList:"aviewport placeview schedulelist",footer:"aviewport placeview panel#pv_footer",favBtn:" aviewport placeview favbutton",comBtn:"aviewport placeview #pv_commentsBtn"},control:{selectfield:{change:"onSelectChange"},favBtn:{tap:"onFavBtnTap"},placeview:{show:"onPVShowTimeOut"},mapBtn:{tap:"onMapButtonTap"},comBtn:{tap:"onComButtonTap"}}},onSelectChange:function(d,c,a){var b;switch(c){case 0:b=new Date();break;case 1:b=new Date();b.nextDay();break;case"full":b=null;break;default:b=c;break}this.getSchList().bindScheduleData(this.getCurrentRecord().get("id"),b,false);this.onPVShow()},onPVShowTimeOut:function(){var a=this;setTimeout(function(){a.onPVShow()},200)},onPVShow:function(){var e=this.getSchList();var b=e.element.query(".scheduleItem");var a=0;if(b.length==0||e.onlyHeader){var f=e.element.down(".x-list-header");if(f){e.setHeight(f.getHeight())}}else{for(var d=0;d<b.length;d++){var c=b[d].style["-webkit-transform"];if((b[d].textContent.trim()!="")&&(!c||(c&&c.indexOf("-10000px")==-1))){a+=b[d].offsetHeight}}e.setHeight(a)}e.removeCls("getsize")},initView:function(b){var f=Ext.getStore("Places").getCurrentType();this.setCurrentType(f);this.setCurrentRecord(b);var c;var e;var d=Ext.getStore("Categories");var a=d.getById(f);if(!a){d.findBy(function(j){var i=j.get("subcategories");if(!i){return false}var h=Ext.getStore(i).getById(f);if(h){c=h.get("options");e=h.get("filter")}else{return false}})}else{c=a.get("options");e=a.get("filter")}this.setSelectConfig(b,c);this.setupHeader(b);this.checkButtonsFields(b);this.collectImages(b);b.set("type",f);this.getFooter().setRecord(b);var g=Ext.getStore("Favorites");this.getFavBtn().setState(g.isRecordInFav(f,b.get("id")))},onFavBtnTap:function(){var a=this.getCurrentRecord();var d={};var c=Ext.getStore("Favorites");d.type=this.getCurrentType();d.rid=a.get("id");d.title=a.get("name");d.descr=a.get("address");var b=c.setFav(d);this.getFavBtn().setState(b);if(b){Afisha.gf.alert("Место добавлено в избранное!")}},setSelectConfig:function(b,c){var a=this.getSelectfield();var e=this.getSchList();if(!c||c.schType=="none"){a.hide();e.hide();return}else{e.show()}var d=0;if(c.schType=="service"){this.getSchList().bindScheduleData(b.get("id"),null,false);d=1}else{if(c.schSelectDefType==null){d=this.getSchList().bindScheduleData(b.get("id"),null,false);a.setValue("full")}else{if(c.schSelectDefType=="week"){d=this.getSchList().bindScheduleData(b.get("id"),"week",false);a.setValue("week")}else{d=this.getSchList().bindScheduleData(b.get("id"),new Date(),false);a.setValue(0)}}}if(d<2){a.hide()}else{a.show()}},setupHeader:function(a){var b=a.get("name");this.getTitle().setHtml(b?b:a.get("aka"));var c=parseFloat(a.get("vote"));if(isNaN(c)){c=0}c=Math.floor(c+0.499);this.getRateImg().setSrc("resources/star-"+c+".png");this.getRateCount().setHtml(a.get("num_votes"))},onMapButtonTap:function(){Afisha.app.fireEvent("showItem","mapview",this.getMapBtn().getData())},onComButtonTap:function(){var a={};a.type="place",a.elem_type=this.getCurrentType();a.elem_id=this.getCurrentRecord().get("id");this.getApplication().fireEvent("showItem","commentsview",a)},checkButtonsFields:function(c){var g=this.getButtons();g.removeAll();var f=c.get("lat");var h=c.get("lng");var k=c.get("address");if(f&&h){this.getMapBtn().setData({value:k,latitude:h,longitude:f});this.getMapEl().show()}else{this.getMapEl().hide()}var d=[];var e=c.get("phone");if(e){e=e.split(",");for(var b=0;b<e.length;b++){d.push({xtype:"hrefbutton",data:{type:"phone",value:e[b]}})}}var a=c.get("url");if(a){d.push({xtype:"urlbutton",data:{value:a}})}d.push({id:"pv_commentsBtn",xtype:"clickbutton",style:"border-top:0;",data:{value:"Добавить/Читать отзывы ("+c.get("com_count")+")"}});for(var j=0;j<d.length;j++){g.add(d[j]);if(j!=d.length-1){g.add({xtype:"img",height:"0.21em",src:"resources/wave.png",cls:"img-border"})}}},collectImages:function(b){var g=[];var e=Global.img_url;var d=b.get("image");if(d&&(d.image instanceof Array)&&d.length){for(var a=0;a<d.length;a++){if(d[a].json){g.push(e+d[a].json[0])}else{g.push(e+d[a][0])}}}else{for(var c=0;c<d.length;c++){g.push(e+d[c][0])}}var f=this.getPhotogallery();f.loadPictureList(g)},goBack:function(){return false}});