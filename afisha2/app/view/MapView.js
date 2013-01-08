Ext.define('Afisha.view.MapView',{
    extend:'Ext.Panel',
    xtype:'mapview',
    config:{
        controllerName:'MapView',
        layout:'fit',
        items:[{
            xtype:'titlebar',
            docked:'top',
            title:'Карта',
            items: [{
                xtype:'backbutton',
            }]
        },{
            xtype:'map',
            mapOptions: {
                  zoom: 16,
                  disableDefaultUI: true,
                  panControl: false,
                  zoomControl: true,
                  mapTypeControl: false,
                  scaleControl: false,
                  streetViewControl: false,
                  overviewMapControl: false,
                  sensor: true,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                },
            useCurrentLocation: false
        }],
    }
});
