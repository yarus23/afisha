Afisha.views.Adv = Ext.extend(Ext.Panel, {
    tpl:'<img id="adv" src="{AdImage}" onload="var el = Ext.ComponentMgr.get(\'adv_bottom\'); el.show();  el.doComponentLayout();Ext.ComponentMgr.get(\'Viewport\').doComponentLayout();" style="width: 100%; max-height:4em; border-top:1px solid silver; height: 100%;"/><a class="social-href" href="{AdClickURL}"></a>',
    height: window.innerWidth * 90 / 640,
    hidden: true,
    style: 'max-height: 4em;',
    id: 'adv_bottom',
    listeners:{
        /*beforerender: function(){
		this.data = {};
            this.data.img_link = "http://ads.adfox.ru/57916/getCode?p1=bduwa&p2=bpct&pe=b&pfc=a&pfb=a&pr=ehaufhd";
            this.data.goto_link = "http://ads.adfox.ru/57916/goLink?p1=bduwa&p2=bpct&pj=b&pe=b&pr=ehaufhd";                   
        },*/
	tap: {
		element:'body',
            fn:function(){
                var me,
                    link;

                me = Ext.ComponentMgr.get('adv_bottom');
                if (me.hasButtons())
                    me.actionSheet.show();
                else{
                    link = this.query('a')[0];
                    if (link)
                        Afisha.openUrl(link, undefined, true); 
                }
            }
        }
    },
    advLoad: function(param){
        if (!param)
            param = '';
        if (this.param == param)
        {
            //this.show();
            return;
        }
        else
            this.param = param;
        //if (this.loaded)
        //    return;
        var req = Ext.Ajax.request({
            // myslo - 'http://ads.adfox.ru/57916/getCode?p1=bijhx&p2=eopn&pfc=a&pfb=a&plp=a&pli=a&pop=a&puid1=',
            url: G.adv + '&puid1=' + param,//'http://ads.adfox.ru/200121/getCode?p1=biiym&p2=eooh&pfc=a&pfb=a&plp=a&pli=a&pop=a&puid1=' + param,
                //'http://ads.adfox.ru/200121/getCode?p1=biimh&p2=eomt&pfc=a&pfb=a&plp=a&pli=a&pop=a',
            method: 'POST',
            scope: this,
            success: function(response, opts){
                //console.log('sc')
                var xml,
                    data;
                xml = response.responseXML;
                //console.log(xml)
                if (!xml)
                    return;
                data = xml2obj(xml);
                //console.log(data)
                if (!data && !this.isHidden()){
                    //нет баннера - не показываем ничего
                    this.hide();
                    var viewport = Ext.getCmp('Viewport');
                    //viewport.doLayout();
                    viewport.doComponentLayout();
                    return;
                }
                this.bindData(data);
                this.loaded = true;
            },
            failure: function(response, opts){
                //console.log('fl')
                //console.log(response.responseText)
                this.loaded = false;
            }
        });
        
    },
    backTap:function(){
        if (this.actionSheet && !this.actionSheet.isHidden()){
            this.actionSheet.hide();
            return true;
        } else
            return false;
    },
    hasButtons: function(){
        if (this.actionSheet.items.length > 2)
            return true;
        else
            return false;
    },
    adClickMap:{
        cancel: function(){
            this.ownerCt.hide();
        },
        call: function(phone){
            //not use
            //var el = document.createElement('a');
            //el.setAttribute('href', 'tel:' + phone);
            //Afisha.openUrl(el, undefined, false); 
            this.ownerCt.hide();
            return false;
        },
        email: function(params){
            //not use
            var href = 'mailto:'
            if (params.to)
                href += params.to;
            if (params.subject)
                href += '?subject=' + params.subject;
            if (params.body)
                href += '&body=' + params.body;
            var el = document.createElement('a');
            el.setAttribute('href', href);
            
            Afisha.openUrl(el, undefined, false); 
            this.ownerCt.hide();
        },
        site: function(href){
        	GoogleAnalytics.advEvent(Afisha.adHeader, 'site');
            var el = document.createElement('a');
            el.setAttribute('href', href)
            Afisha.openUrl(el, undefined, true); 
            this.ownerCt.hide();
        },
        map: function (coords){
        	GoogleAnalytics.advEvent(Afisha.adHeader, 'map');
            /*
            latitude: 54.1996
            longitude: 37.6365
             **/
            var conf = {};
            if(!(coords instanceof Object))
                coords = Ext.decode(coords);
            if (!coords)
                return;
            conf.latitude = coords.latitude ? coords.latitude : coords.lat;
            conf.longitude = coords.longitude ? coords.longitude : coords.lng;
            if (!conf.latitude || !conf.longitude)
                return;
            this.ownerCt.hide();
            Ext.dispatch({      
               controller: 'main',
               action: 'showMap',
               coords: conf
            });
        }
        
    },
    onADButtonClick: function(me,e){
        if (me.action && this.adClickMap[me.action])
            this.adClickMap[me.action].call(me,me.params);
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
            config.html = '<a class="x-button-label" onclick="GoogleAnalytics.advEvent(Afisha.adHeader, \'phone\');" style="color:black; text-decoration: none; padding: .3em .6em;" href="tel:' + button.params + '">' + button.text + '</a>';
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
            config.html = '<a onclick="GoogleAnalytics.advEvent(Afisha.adHeader, \'email\'); Ext.ComponentMgr.get(\'adv_bottom\').actionSheet.hide();" class="x-button-label" style="color:black; text-decoration: none; padding: .3em .6em;" href="' + href + '">' + button.text + '</a>';
        }
        this.actionSheet.add(config);
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
                return !!button.params && !!button.params.latitude && !!button.params.longitude;
            }
            default:
                return false;
        }
    },
    bindData:function(data){
        this.data = data;
		this.data.adTypeSlim ? this.setHeight(window.innerWidth * 40 / 640) : this.setHeight(window.innerWidth * 90 / 640);
        this.update(this.data);
        this.actionSheet.removeAll();
        Afisha.adHeader = data.adHeader;
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
        if (this.isHidden()){
            this.show();
            //var viewport = Ext.getCmp('Viewport');
            //viewport.doLayout();
            //viewport.doComponentLayout()
        }
        //debugger;
    },
    initComponent: function() {
        this.actionSheet = new Ext.ActionSheet({});
        Afisha.views.Adv.superclass.initComponent.apply(this, arguments);
        this.advLoad();
    }     
    
});
        
 Ext.reg('Adv', Afisha.views.Adv);