var Geo = function()
{
	this.watchID = null;
}
//static methods

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}
  
// http://www.movable-type.co.uk/scripts/latlong.html
Geo.dist = function(lon1,lat1,lat2,lon2) //calculating distance between two points by their coordinates
{        
    var R = 6371; // km
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lon1 = lon1.toRad();
    lon2 = lon2.toRad();
    
    var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
    var y = (lat2-lat1);
    var d = Math.sqrt(x*x + y*y) * R;
    return d;
}

Geo.fastPos = function(callback, errCallback)//callBack(obj) 
{
	navigator.geolocation.getCurrentPosition(callback, errCallback,{ enableHighAccuracy: false, timeout: 10000, maximumAge: 3000000 });
}

Geo.getCurrentPos = function(callback, errCallback)//callBack(obj) 
{
	navigator.geolocation.getCurrentPosition(callback, errCallback,{ enableHighAccuracy: true, timeout: 30000, maximumAge: 300000 });
}
//class methods
Geo.prototype.startWatch = function(callback, errorCallback)
{
	this.watchID = navigator.geolocation.watchPosition(callback, errorCallback,{ frequency: 60000,enableHighAccuracy: true });
}

Geo.prototype.startFastWatch = function(callback, errorCallback)
{
	this.watchID = navigator.geolocation.watchPosition(callback, errorCallback,{ frequency: 10000,enableHighAccuracy: false });
}

Geo.prototype.stopWatch = function()
{
    if (this.watchID != null) 
    {
        navigator.geolocation.clearWatch(this.watchID);
        this.watchID = null;
    }
}