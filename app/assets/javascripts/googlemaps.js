// IMPORTANT! 'map' has been set as a global variable

function initMap() {
  var customMapType = new google.maps.StyledMapType([{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}], {
	      name: 'Custom Style'
	  });
	  var customMapTypeId = 'custom_style';

// IMPORTANT! 'map' has been set as a global variable
	  map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 12,
	    center: {lat: 40.758765, lng: -73.985206},  // Times Square
	    mapTypeControlOptions: {
	      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
	    }
	  });

	  map.mapTypes.set(customMapTypeId, customMapType);
	  map.setMapTypeId(customMapTypeId);

}


// DRAWING MARKERS AND DATA ON THE MAP

var getMarkers = function(){
	$(function(){
		$.ajax({
			url: '/missed_connections.json',
			datatype: 'json',
			success: function(data){

                console.log('ajax success')
				for ( var i = 0; i < data.length; i++ ) {
                    // parse data for markers and info windows
                    // debugger;
                    var id = data[i].id.toString();
                    var postdate =  data[i].post_date
                    var headline = data[i].headline
                    var bodytext = data[i].body_text
                    var preference = data[i].preference
                    var place = data[i].place
                    var latitude = +data[i].latitude
                    var longitude = +data[i].longitude
                    var markerLatLng = {lat: latitude, lng: longitude};

                    // Content string for info windows
                    var contentString = '<div id="content" class="infowindow">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h1 id="firstHeading" class="firstHeading">'+headline+'</h1>'+
                    '<p><i>'+place+' '+postdate+'</i></p>'+
                    '<div id=bodyContent>'+
                    '<p>'+bodytext+'<p>'+
                    '<a href="/missed_connections/'+id+'">more</a>'+
                    '</div>'+
                    '</div>'
                    
                    // CREATE INFO WINDOWS FOR MARKERS
                    infowindow = new google.maps.InfoWindow({
                        content: ''
                    });

                    // PLACE MARKERS
                    var marker = new google.maps.Marker({
                        // added by me
                        body: bodytext,
                        headline: headline,
                        content: contentString,

                        // required
                        position: markerLatLng,
                        map: map,
                        title: headline,
                        label: preference,
                        animation: google.maps.Animation.DROP
                    });

                    // EVENT LISTENER FOR INFO WINDOWS
                      marker.addListener('click', function() {
                        infowindow.content = this.content
                        infowindow.open(map, this);
                        infowindow = new google.maps.InfoWindow({
                        content: ''
                        });
                    });

                      marker.addListener('click', function(){
                        infowindow.close();
                        infowindow = new google.maps.InfoWindow({
                        content: ''
                        });
                      });
				}
			}
		})
	})
}



getMarkers();

// stuff i was working on with jessie

// var plotMarker = function ( coordinate ) {
// 	var x = coordinate.x;
// 	var y = coordinate.x
// }

// coordinate = { x: xval, y: yval }