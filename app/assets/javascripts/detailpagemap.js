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