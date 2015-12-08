// IMPORTANT! 'map' has been set as a global variable

function initMap() {
  var customMapType = new google.maps.StyledMapType([
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#2c2e33"
            },
            {
                "saturation": 7
            },
            {
                "lightness": 19
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": 31
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": 31
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": -2
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": -90
            },
            {
                "lightness": -8
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": 10
            },
            {
                "lightness": 69
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": -78
            },
            {
                "lightness": 67
            },
            {
                "visibility": "simplified"
            }
        ]
    }
], {
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

	  console.log('initmap from googlemaps.js');


}



// DRAWING MARKERS AND DATA ON THE MAP

var getMarkers = function(){
	$(function(){
		$.ajax({
			url: '/missed_connections.json',
			datatype: 'json',
			success: function(data){
				for ( var i = 0; i < data.length; i++ ) {
					// plotMarker( data[i].coordinate )
                    // console.log(data[i].headline);

                    // parse data for markers and info windows
                    var headline = data[i].headline
                    var preference = data[i].preference
                    var latitude = +data[i].latitude
                    var longitude = +data[i].longitude
                    var markerLatLng = {lat: latitude, lng: longitude};

                    // Content string for info windows
                    var contentString = '<div id="content">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h1 id="firstHeading" class="firstHeading">'+headline+'</h1>'+
                    '<div id=bodyContent>'+
                    '<p>'+headline+'<p>'+
                    '</div>'+
                    '</div>'

                    // CREATE INFO WINDOWS FOR MARKERS
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    // PLACE MARKERS
                    var marker = new google.maps.Marker({
                        // position: markerLatLng,
                        position: markerLatLng,
                        map: map,
                        title: headline,
                        label: preference,
                        animation: google.maps.Animation.DROP
                    });

                    // EVENT LISTENER FOR INFO WINDOWS
                      marker.addListener('click', function() {
                        infowindow.open(map, marker);
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