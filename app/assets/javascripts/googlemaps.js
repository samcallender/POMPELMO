// IMPORTANT! 'map'  and 'markers' hav been set as global variables

function initMap() {
    // map style credit https://snazzymaps.com/style/55/subtle-greyscale-map
  var customMapType = new google.maps.StyledMapType([{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":0},{"lightness":-100},{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#dddddd"},{"saturation":-100},{"lightness":-3},{"visibility":"on"}]}], {
	      name: 'Custom Style'
	  });
	  var customMapTypeId = 'custom_style';

// IMPORTANT! 'map' has been set as a global variable
	  map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 11,
        scrollwheel: false,
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
            beforeSend: function(){
                console.log("data loading");
            },
            complete: function(){
                console.log("complete");
            },
			success: function(data){
                // OPTIONS AND MARKERS A ARRAY FOR MARKER CLUSTERS
                var mcOptions = {gridSize: 50, maxZoom: 15};
                markers = [];

				for(var i = 0; i < data.length; i++) {
                    var id = data[i].id.toString();
                    var postdate =  data[i].post_date;
                    var headline = data[i].headline;
                    var bodytext = data[i].body_text;
                    var preference = data[i].preference;
                    var place = data[i].place;
                    var latitude = +data[i].latitude;
                    var longitude = +data[i].longitude;
                    var latLng = new google.maps.LatLng(latitude, longitude);


                    // CONTENT STRING FOR INFO WINDOWS
                    var contentString = '<div id="content" class="infowindow">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h1 id="firstHeading" class="firstHeading">'+headline+'</h1>'+
                    '<p><i>'+place+' '+postdate+'</i></p>'+
                    '<div id=bodyContent>'+
                    '<p>'+bodytext+'<p>'+
                    '<a href="/missed_connections/'+id+'">more</a>'+
                    '</div>'+
                    '</div>';
                        
                    var marker = new google.maps.Marker({
                        // ADDED BY ME
                            body: bodytext,
                            headline: headline,
                            content: contentString,
                        // REQUIRED
                            position: latLng,
                            title: headline
                            // label: preference
                        });
                        
                    markers.push(marker);
                    
                    // CREATE INFO WINDOWS FOR MARKERS
                    infowindow = new google.maps.InfoWindow({
                        content: ''
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
                // CREATES MARKER CLUSTERS
                markerCluster = new MarkerClusterer(map, markers, mcOptions);
                // var oms = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true});

                // oms.addListener('click', function(marker, event) {
                //     iw.setContent(marker.desc);
                //     iw.open(map, marker);
                //     });
            }
        })
    })
}

// getMarkers();


var showMarkers = function() {
    $("#addmarkers").on('click', function(){
        console.log("addmarkers clicked");

        getMarkers();
    });
}

var hideMarkers = function() {
    $("#removemarkers").on('click', function() {
        console.log("remove markers clicked");

        markerCluster.setMap(null);

        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }
    });    
};

window.onload = function(){
    showMarkers();
    hideMarkers();
}


// DETAIL PAGE MAP
function initDetailMap() {
  var customMapType = new google.maps.StyledMapType([{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}], {
          name: 'Custom Style'
      });
      var customMapTypeId = 'custom_style';

// IMPORTANT! 'detailMap' has been set as a global variable
      detailMap = new google.maps.Map(document.getElementById('detail_page_map'), {
        zoom: 12,
        center: {lat: 40.758765, lng: -73.985206},  // Times Square
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
        }
      });

      detailMap.mapTypes.set(customMapTypeId, customMapType);
      detailMap.setMapTypeId(customMapTypeId);
}

var getDetailMarker = function(){
    $(function(){
        var pathName = window.location.pathname+'.json'
        $.ajax({
            url: window.location.pathname+'.json',
            datatype: 'json',
            success: function(data){
                var headline = data.headline
                var latitude = +data.latitude
                var longitude = +data.longitude
                var markerLatLng = {lat: latitude, lng: longitude};

                var marker = new google.maps.Marker({
                    position: markerLatLng,
                    map: detailMap,
                    title: headline,
                    animation: google.maps.Animation.DROP
                });
            }
        })
    })
}

getDetailMarker();
