// IMPORTANT! 'map'  and 'markers' hav been set as global variables

function initMap() {
    // map style credit https://snazzymaps.com/style/55/subtle-greyscale-map 
    // OR
    // https://snazzymaps.com/style/151/ultra-light-with-labels
  var customMapType = new google.maps.StyledMapType([{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}], {
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
                $("#loading").removeClass('hidden');
            },
            complete: function(){
                console.log("complete");
                $("#loading").addClass('hidden');
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
                    var source = data[i].location_source;


                    // CONTENT STRING FOR INFO WINDOWS
                    var contentString = '<div id="content" class="infowindow">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h1 id="firstHeading" class="firstHeading">'+headline+'</h1>'+
                    '<p><i>'+place+' '+postdate+'</i></p>'+
                    '<p><i> Source: '+source+'</i><p>'+
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

getMarkers();

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

var filterMarkers = function() {
    $(".mapoption").on('click', function(){
        var option = this.id.toString();
        console.log(option);
        var url = '/missed_connections/'+option+'.json';
        markerCluster.setMap(null);
        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }
        $(function(){
        $.ajax({
            url: url,
            datatype: 'json',
            beforeSend: function(){
                console.log("data loading");
                $("#loading").removeClass('hidden');
            },
            complete: function(){
                console.log("complete");
                $("#loading").addClass('hidden');
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
                    var source = data[i].location_source;


                    // CONTENT STRING FOR INFO WINDOWS
                    var contentString = '<div id="content" class="infowindow">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h1 id="firstHeading" class="firstHeading">'+headline+'</h1>'+
                    '<p><i>'+place+' '+postdate+'</i></p>'+
                    '<p><i> Source: '+source+'</i><p>'+
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
    });
}

window.onload = function(){
    showMarkers();
    hideMarkers();
    filterMarkers();
}


// DETAIL PAGE MAP
function initDetailMap() {
  var customMapType = new google.maps.StyledMapType([{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}], {
          name: 'Custom Style'
      });
      var customMapTypeId = 'custom_style';

// IMPORTANT! 'detailMap' has been set as a global variable
      detailMap = new google.maps.Map(document.getElementById('detail_page_map'), {
        zoom: 10,
        scrollwheel: false,
        center: {lat: 40.758765, lng: -73.985206},  // Times Square
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
        }
      });

      detailMap.mapTypes.set(customMapTypeId, customMapType);
      detailMap.setMapTypeId(customMapTypeId);
      getDetailMarker();
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

                // detailMap.setCenter(marker.getPosition());
                detailMap.panTo(marker.getPosition());
            }
        })
    })
}

getDetailMarker();
