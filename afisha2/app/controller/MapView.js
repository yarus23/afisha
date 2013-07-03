Ext.define('Afisha.controller.MapView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            viewport: 'aviewport',
            mapView: 'aviewport mapview',
            mapEl: 'aviewport mapview map'
        },

        control: {
            mapEl:{
                maprender:'onMapRender',
                updatedata:'onUpdateData'
            }
        }
    },
    goBack:function(){
        return false;
    },
    onMapRender:function(extMapComponent, googleMapComp){
        googleMapComp = extMapComponent.getMap();
        var theView = Ext.ComponentQuery.query('map')[0];
        var data = theView.getData();
        var lat = data.latitude;
        var lng = data.longitude;
        extMapComponent.setMapCenter({latitude: lat, longitude: lng});
        theView.marker = new google.maps.Marker({
            position: position = new google.maps.LatLng (lat,lng),
            map: googleMapComp,
        });
    },
    onUpdateData:function(extMapComponent){
        var googleMapComp = extMapComponent.getMap();
        var theView = Ext.ComponentQuery.query('map')[0];
        var data = theView.getData();
        var lat = data.latitude;
        var lng = data.longitude;
        extMapComponent.setMapCenter({latitude: lat, longitude: lng});
        if (theView.marker){
            theView.marker.setMap(null);
        }
        theView.marker = new google.maps.Marker({
            position: position = new google.maps.LatLng (lat,lng),
            map: googleMapComp,
        });
        theView.marker.setMap(googleMapComp);
        setTimeout(function() {
            extMapComponent.setMapCenter({latitude: lat, longitude: lng});
        }, 100);
    },
    initView:function(opt){
//        console.log(opt);
        if ((typeof google == "undefined" ) || !google.maps){
            Afisha.gf.alert("Карта не может быть загружена.");
            return;
        }     
        this.getMapEl().setData(opt);
//        this.getMapEl().setMapCenter(opt);
//        if (this.marker)
//            this.marker.setMap(null);
//        this.marker = new google.maps.Marker({position: new google.maps.LatLng(opt.latitude, opt.longitude),map: this.getMapEl().getMap()});
//	this.marker.setMap(this.getMapEl().getMap());
        
    },
});
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


