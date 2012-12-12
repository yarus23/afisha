Ext.define('Afisha.controller.ImgFullView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            imgFullView: 'aviewport imgfullview',
            imgFullViewC: 'aviewport imgfullview carousel',
            imgPreviewC :'aviewport photogallery carousel',
            imgPreview: 'aviewport photogallery carousel img',
            imgView: 'aviewport imgfullview carousel img'
        },

        control: {
            imgPreviewC: {
                activeitemchange:   'nextSlide'
            },
            imgFullViewC:{
                activeitemchange:   'nextSlide'
            },
            imgView:{
                load:   'onImgLoad',
                tap:    'onImgTap'
            },
            imgPreview:{
                load:   'onImgLoad',
                tap:    'onImgTap'
            }
        }
    },
    onImgLoad:function(me){
        me.setHtml('');
    },
    onImgTap:function(me){
        if (this.getViewport().getActiveItem().xtype == 'imgfullview'){
            this.getApplication().fireEvent('goBack');
            return;
        }
        var data = me.up('photogallery').getData();
        var idx = me.getParent().getActiveIndex();
        this.getApplication().fireEvent('showItem', 'imgfullview',{
            data: data,
            idx: idx
        });
    },
    nextSlide:function(me, val, oldval){
        if(val.getSrc())
            return;
        val.setSrc(val.config.img);
    },
    goBack:function(){
        return false;
    },
    initView:function(opt){
        this.getImgFullView().loadPictureList(opt.data,opt.idx);
    },
});
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


