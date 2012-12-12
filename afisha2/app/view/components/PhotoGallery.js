Ext.define('Afisha.view.components.PhotoGallery',{
    extend:'Ext.Panel',
    xtype:'photogallery',
    config:{
        data:[],
        layout:'hbox',
        cls:'photogallery',
        style:'margin-top:1em;',
        items:[{
            xtype:'img',
            src:'resources/arr_left.png',
            width:'1em',
            height:'10em',
            style:'background-size:auto;'
        },{
            flex:1,
            height:'10em',
            xtype:'carousel',
            ui:'light',
            cls:'imgPreview',
            items:[]
        },{
            xtype:'img',
            src:'resources/arr_right.png',
            width:'1em',
            height:'10em',
            style:'background-size:auto;'
        }]
    },
    //data - array of img's'
    loadPictureList:function(data){
        this.setData(data);
        var carousel = this.down('carousel'),
            data_ln = data.length;
        if (!data_ln){
            this.hide();
            return;
        }
        carousel.removeAll();
        for (var i = 0; i < data_ln; i++){
            carousel.add([{
                xtype:'img',
                html:'<div style="margin-top:5em; text-align:center;"> Загрузка<br/>изображения...</div>',
                style:'background-size:contain;',
                src:null,
                preview: true,
                img:data[i]
            }]);
        }
        carousel.setActiveItem(0);
        this.show();
    }
});