Ext.define('Afisha.controller.Adv', {
    extend: 'Ext.app.Controller',

   config: {
        refs: {
                advPanel:   'adv',
                advImg:     'adv img',
                as:         'actionsheet#advAS'//'adv actionsheet',
                
        },
        control: {
            advImg:{
                load:   'onImgLoad',
                tap:    'onImgTap'
            }
        }
    },
    launch: function(){
        this.loadAdv();
    },
    onImgLoad: function(){
        this.getAdvPanel().show();
    },
    onImgTap: function(me){
        var as = this.getAs();
        if (as.items.items.length > 2)
            as.show();
        else{
            var el = me.element.query('a');
            if (el && el.length)
            MT.gf.openUrl(el[0], undefined, Ext.os.is.iOS); 
        }
    },
    loadAdv: function(){
        var req = Ext.Ajax.request({
            url: 'http://localhost/tst/index.php',//Global.adv,//'http://ads.adfox.ru/202618/getCode?p1=biury&p2=epmz&pfc=a&pfb=a&plp=a&pli=a&pop=a',//'http://localhost/tst/index.php',
            method: 'POST',
            scope: this,
            success: function(response, opts){
                var xml,
                    data;
                this.loaded = true;
                xml = response.responseXML;

                if (!xml)
                    return;
                data = xml2obj(xml);
                if (!data && !this.getAdvPanel().isHidden()){
                    //нет баннера - не показываем ничего
                    this.getAdvPanel().hide();
                    return;
                }
                this.bindData(data);
                //this.loaded = true;
            },
            failure: function(response, opts){
                this.loaded = false;
            }
        });
    },
    bindData:function(data){
        var as          = this.getAs(),
            advPanel    = this.getAdvPanel(),
            advImg      = this.getAdvImg();
        if(!data)
            return;
        //debugger;
        this.data = data;
	this.data.adTypeSlim ? advPanel.setHeight(window.innerWidth * 40 / 640) : advPanel.setHeight(window.innerWidth * 90 / 640);
        advImg.setSrc(data.AdImage);
        advImg.setData({AdClickURL: data.AdClickURL});

        as.removeAll();
        if (data.Button && data.Button instanceof Array){
            if (data.adHeader)
                this.addASButton({xtype:'panel',html:data.adHeader,styleHtmlCls:'actionSheetHeaderHtml', cls:'actionSheetHeader'});
            else
                this.addASButton({xtype:'panel',html:'',style:'display:none;'});
            for (var i = 0; i < data.Button.length; i++){
                if (this.isParams(data.Button[i]))
                    this.addASButton(data.Button[i]);
            }
            this.addASButton({text:'Отмена', action:'cancel', params:null,ui:'decline'});
        }
    },
    isParams: function(button){
        if (!button.action)
            return false;
        switch(button.action){
            case 'call':{
                return !!button.params;
            }
            case 'email':{
                return !!button.params && !!button.params.to;
            }
            case 'site':{
                return !!button.params;
            }
            case 'map':{
                //return false;
                return !!button.params && !!button.params.latitude && !!button.params.longitude;
            }
            default:
                return false;
        }
    },
    addASButton: function(button){
        var config = {};
        for (var el in button){
            config[el] = button[el];
        }
        config.handler = this.onADButtonClick;
        config.scope = this;
        if (button.action == 'call'){
            delete config.text;
            config.style = 'padding: 0em;';
            config.handler = null;
            config.html = '<a class="x-button-label" style="color:black; text-decoration: none; padding: .3em .6em;" href="tel:' + button.params + '">' + button.text + '</a>';
        } else if(button.action == 'email' && button.params){
            delete config.text;
            config.style = 'padding: 0em;';
            config.handler = null;
            var href = 'mailto:'
            if (button.params.to)
                href += button.params.to;
            if (button.params.subject)
                href += '?subject=' + button.params.subject;
            if (button.params.body)
                href += '&body=' + button.params.body;
            config.html = '<a class="x-button-label" style="color:black; text-decoration: none; padding: .3em .6em;" href="' + href + '">' + button.text + '</a>';
        }
        this.getAs().add(config);
    },
    adClickMap:{
        cancel: function(){
            this.getAs().hide();
        },
        site: function(href){
            var el = document.createElement('a');
            el.setAttribute('href', href)
            Afisha.gf.openUrl(el, undefined, Ext.os.is.iOS); 
            this.getAs().hide();
        },
        map:function(params){
            this.getAs().hide();
            Afisha.app.fireEvent('showItem', 'mapview',params);
        }
        
    },
    onADButtonClick: function(me,e){
        if (me.config.action && this.adClickMap[me.config.action])
            this.adClickMap[me.config.action].call(this,me.config.params);
    },
    goBack: function(){
        var as = this.getAs();
        if (!as.isHidden()){
            as.hide();
            return true;
        }
        return false;
    }
});
var xml2obj = function(xml) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            return null;
         return o;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   return X.toObj(X.removeWhite(xml));
};