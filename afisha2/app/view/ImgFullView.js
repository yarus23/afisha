Ext.define('Afisha.view.ImgFullView',{
    extend:'Ext.Panel',
    xtype:'imgfullview',
    config:{
        controllerName:'ImgFullView',
        layout:'fit',
//        style:'padding:0;',
//        centered:true,
//        top:0,
//        left:0,
        width:'100%',
        height:'100%',
        items:[{
            xtype:'carousel',
            style:'background-color:black;',
            ui:'light',
            id:'imgFullview',
            items:[]
        }],
    },
    loadPictureList:function(data, ai){
        var carousel = this.down('carousel'),
            data_ln = data.length;
        carousel.removeAll();
        for (var i = 0; i < data_ln; i++){
            carousel.add([{
                xtype:'img',
                html:'<div style="margin-top:5em; text-align:center;"> Загрузка<br/>изображения...</div>',
                style:'background-size:contain;',
                src:null,
                img:data[i]
            }]);
        }
        carousel.setActiveItem(ai);
    }
});