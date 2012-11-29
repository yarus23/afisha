var js_files = [
	// sencha
	{ js: "lib/sencha-touch.js", },
		// sencha-app
	{ js: "lib/adv.js", },
	{ js: "app/app.js", pause: true, },
	{ js: "lib/TitledPicker.js", },
	{ js: "lib/Carousel.js", },
	{ js: "lib/backBtn.js", },
	{ js: "lib/customSelectField.js", },
	{ js: "lib/globalfunctions.js", },
	{ js: "lib/geolib.js", },
	{ js: "lib/UxBufList.js", },
	{ js: "lib/dictreader.js", },
	{ js: "lib/classiccombo.js", },
	{ js: "lib/social.js", },
		// sencha-models
	{ js: "app/models/kitchen.js", },
	{ js: "app/models/schedulelist.js", },
	{ js: "app/models/films.js", },
	{ js: "app/models/places.js", },
	{ js: "app/models/schedule.js", },
	{ js: "app/models/cinemaroot.js", },
	{ js: "app/models/categories.js", },
	{ js: "app/models/comments.js", },
		// sencha-controllers
	{ js: "app/controllers/categories.js", },
		// sencha-views
	{ js: "app/views/detailsButtonsList.js", },
	{ js: "app/views/detailsScheduleList.js", },
	{ js: "app/views/detailsFooter.js", },
	{ js: "app/views/detailsHeader.js", },
	{ js: "app/views/galleryView.js", },
	{ js: "app/views/detailsView.js", },
	{ js: "app/views/socialPanel.js", },
	{ js: "app/views/fullScheduleView.js", },
	{ js: "app/views/mapView.js", },
	{ js: "app/views/commentsView.js", },
	{ js: "app/views/sendnews.js", }, 
	{ js: "app/views/share/sharePanelWithBackButton.js", },
	{ js: "app/views/share/detailsButtonsList.js", },
	{ js: "app/views/share/main.js", },
	{ js: "app/views/share/license.js", },
	{ js: "app/views/share/friends.js", }, 
	{ js: "app/views/share/about.js", }, 
	{ js: "app/views/share/regard.js", }, 
	{ js: "app/views/share/share.js", }, 
	{ js: "app/views/adv.js", }, 
	{ js: "app/views/viewport.js", },
	{ js: "app/views/categories.js", },     
	{ js: "app/views/events.js", },     
	{ js: "app/views/favorites.js", onload: "Afisha.mainLaunch();"},  
];            

function loadNextScriptFile() {
	if( js_files.length == 0 ){
		return false;
	}
	var script_obj = js_files.shift();	
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = script_obj.js;
	if( script_obj.pause != true && script_obj.onload == undefined )
		script.setAttribute( 'onload', 'loadNextScriptFile();' );
	else if( script_obj.pause != true && script_obj.onload != undefined )
		script.setAttribute( 'onload', script_obj.onload + 'loadNextScriptFile();');
	else if( script_obj.pause != true )
	 	script.setAttribute( 'onload', script_obj.onload );
	document.getElementsByTagName('head')[0].appendChild( script );
	return true;
}

loadNextScriptFile();