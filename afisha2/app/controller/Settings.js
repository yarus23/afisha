Ext.define('Afisha.controller.Settings', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            useGPSField: 'aviewport checkboxfield#useGPSField',
            fontSizeSettings: 'aviewport sliderfield#fontSizeSettings'
        },

        control: {
            fontSizeSettings:{
                change:'onFontChange'
            },
            useGPSField:{
                change:'onGpsCheck'
            }
        }
    },
    launch:function(){
        this.getApplication().on({
            setFont: this.setFont,
            scope: this});
        this.applyFontToElem(Afisha.app.Settings.getFontSize());
    },
    goBack:function(){
        return false;
    },
    initView:function(opt){
        var fontSize = Afisha.app.Settings.getFontSize();
        var useGPS = Afisha.app.Settings.getUseGPS();
        useGPS ? this.getUseGPSField().check() : this.getUseGPSField().uncheck();
        this.getFontSizeSettings().setValue(fontSize);
    },
    onFontChange:function(field, slider, thumb , newVal, oldVal ){
        this.setFont(newVal);
    },
    onGpsCheck:function(me, newVal, oldVal){
        Afisha.app.Settings.saveUseGPS(newVal);
    },
    setFont:function(fontSize){
        fontSize = Afisha.app.Settings.saveFontSize(fontSize);
        this.applyFontToElem(fontSize);
    },
    applyFontToElem:function(fontSize){
        var elems = this.getViewport().element.query('.fontSized');
        for (var i = 0; i< elems.length; i++){
            elems[i].style.setProperty('font-size',fontSize + 'em');
        }
    }
});
