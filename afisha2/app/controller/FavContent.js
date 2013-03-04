Ext.define('Afisha.controller.FavContent', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            list: 'favcontent dataview'
        },

        control: {
            list:{
                itemtap:'onFavItemTap'
            }
        }
    },
    initView:function(opt){
        
    },
    onFavItemTap:function(me,idx,el,record,e){
        if (record.get('type') == 'news'){
            this.getApplication().fireEvent('showItem', 'pageview',{
                type:record.get('type'),
                rec_id:record.get('rid')
            });
        } else if (record.get('type') == 'discount'){
            this.getApplication().fireEvent('showItem', 'discview',{
                rec_id:record.get('rid')
            });
        } else{
            this.getApplication().fireEvent('switchToPlaceView',{
                type:record.get('type'),
                rid:record.get('rid')
            });
        }
    }
/*
        if (!Afisha.gf.isOnline(true))
            return;
        rec_id = record.get('rid');
        type = record.get('type');
//        store = Ext.getStore('PageView');
        //body = this.getBody();
        this.getApplication().fireEvent('showItem', 'pageview',{
            type:type,
            rec_id:rec_id
        });
 **/
});
