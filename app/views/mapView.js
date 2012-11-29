Afisha.views.mapView = Ext.extend(Ext.Panel, {
    id:'mapView',
    layout:'fit',
    items:[{
            xtype:'panel', 
            layout:'fit', 
            itemId:'mask-panel'
    }],
    map:{
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
              sensor: true
            },
        useCurrentLocation: false
    },
    loadScript:function(coords){
        this.myMask = new Ext.LoadMask(this.down('#mask-panel').el, {msg:" "});
        this.myMask.show();
        this.latlng = coords;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.googleapis.com/maps/api/js?_dc=1&sensor=true&callback=initMapView";
        document.body.appendChild(script);
    },
    addMap:function(){
        this.myMask.hide();
        this.down('#mask-panel').hide();
        if(this.items.length == 1)
        {
            this.map.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
            this.add(this.map);
            this.doLayout();
        }
        this.showMap(this.latlng);
    },
    showMap:function(coords){
        //this.marker = null;
        if(!(window.google || {}).maps)
        {
            this.loadScript(coords);
            return;
        }
        var coords2 = {
            latitude: coords.longitude,
            longitude: coords.latitude
        };
        var gMap = this.down('map');
        //alert(coords.latitude + ' - ' + coords.longitude)
        gMap.update(coords2);
        if (this.marker)
            this.marker.setMap(null);
        this.marker = new google.maps.Marker({position: new google.maps.LatLng(coords2.latitude, coords2.longitude),map: gMap.map});
	this.marker.setMap(gMap.map);
    },
    initComponent: function() {
        this.dockedItems = [new Ext.Toolbar({
                dock:'top',
                height:'2.2em',
                ui:'light',
                title:Afisha.showButtons?'':'Карта',
                //Afisha.showButtons?this.backButton:{xtype:'spacer'},
                items:[Afisha.showButtons?{xtype:'backbtn'}:{xtype:'spacer'}]
        })];
        Afisha.views.mapView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('mapView', Afisha.views.mapView);
