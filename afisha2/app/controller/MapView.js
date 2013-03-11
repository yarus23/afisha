Ext.define('Afisha.controller.MapView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            mapView: 'aviewport mapview',
            mapEl: 'aviewport mapview map'
        },

        control: {

        }
    },
    goBack:function(){
        return false;
    },
    initView:function(opt){
//        console.log(opt);
        if ((typeof google == "undefined" ) || !google.maps){
            Afisha.gf.alert("Карта не может быть загружена.");
            return;
        }            
        this.getMapEl().setMapCenter(opt);
        if (this.marker)
            this.marker.setMap(null);
        this.marker = new google.maps.Marker({position: new google.maps.LatLng(opt.latitude, opt.longitude),map: this.getMapEl().getMap()});
	this.marker.setMap(this.getMapEl().getMap());
        
    },
});
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


