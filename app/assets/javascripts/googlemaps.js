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

    var transitLayer = new google.maps.TransitLayer();    
    transitLayer.setMap(map);

      map.mapTypes.set(customMapTypeId, customMapType);
      map.setMapTypeId(customMapTypeId);
      getMarkers();
      loadOMS();

      // sets handlers when map initializes
      revealGender();
      hideGender();
      revealOptions();
      hideOptions();
      filterDates();
      addToFilter();
      datePicker();
}

// Date method for filtering by YYYYMMDD
// Date.prototype.yyyymmdd = function() {
//   var mm = this.getMonth() + 1; // getMonth() is zero-based
//   var dd = this.getDate();

//   return [this.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join(''); // padding
// };



// DRAWING MARKERS AND DATA ON THE MAP


var getMarkers = function(){
    // get date range
    var todayUTC = new Date();
    var todayString = todayUTC.toISOString().slice(0,10).replace(/-/g,"");
     today = parseInt(todayString);
     todayMinusSeven = today - 30;

    $(function(){
        $.ajax({
            url: '/missed_connections.json',
            datatype: 'json',
            beforeSend: function(){
                $("#loading").removeClass('hidden');
            },
            complete: function(){
                $("#loading").addClass('hidden');
            },
            success: function(data){
                // OPTIONS AND MARKERS A ARRAY FOR MARKER CLUSTERS
                var mcOptions = {gridSize: 50,
                    maxZoom: 15
                    // styles: [{
                    //     height: 100,
                    //     url: "http://static1.squarespace.com/static/519a3a63e4b0129583bae2c1/t/52449b45e4b05d3ff4b52758/1380227909609/HEART.png",
                    //     width: 100
                    //     },
                    //     {
                    //     height: 56,
                    //     url: "http://www.kidsafeseafood.org/wp-content/uploads/2011/07/icon_heart.png",
                    //     width: 56
                    //     },
                    //     {
                    //     height: 66,
                    //     url: "http://www.kidsafeseafood.org/wp-content/uploads/2011/07/icon_heart.png",
                    //     width: 66
                    //     },
                    //     {
                    //     height: 78,
                    //     url: "http://www.kidsafeseafood.org/wp-content/uploads/2011/07/icon_heart.png",
                    //     width: 78
                    //     },
                    //     {
                    //     height: 90,
                    //     url: "http://www.kidsafeseafood.org/wp-content/uploads/2011/07/icon_heart.png",
                    //     width: 90
                    //     }]
                    };
                markers = [];

                oms = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true});

                // oms.addListener('click', function(marker, event) {
                //     iw.setContent(marker.desc);
                //     iw.open(map, marker);
                //     });
                oms.addListener('spiderfy', function(markers) {
                    iw.close();
                    });

                for(var i = 0; i < data.length; i++) {
                    var postdate =  data[i].post_date;
                    var id = data[i].id.toString();
                    var headline = data[i].headline;
                    var bodytext = data[i].body_text.substring(0,120);
                    var preference = data[i].preference;
                    var place = data[i].place;
                    var latitude = +data[i].latitude;
                    var longitude = +data[i].longitude;
                    var latLng = new google.maps.LatLng(latitude, longitude);
                    var source = data[i].location_source;

                    // converted date for filtering
                    var parseDate = postdate.substring(0,10).split('-');
                    var mm = parseInt(parseDate[1]).toString();
                    var dd = parseInt(parseDate[2]).toString();
                    var yyyy = parseInt(parseDate[0]).toString();
                    var displayDate = mm+'/'+dd+'/'+yyyy;

                    // converted date for filtering
                    var userFilterDate = postdate.substring(0,10).split('-');
                    var filterDate = parseInt(userFilterDate[0]+userFilterDate[1]+userFilterDate[2]);

                    // CONTENT STRING FOR INFO WINDOWS
                    var contentString = '<div id="iw-container" class="infowindow">'+
                            // '<div id="siteNotice">'+
                            // '</div>'+
                                '<div class="iw-title">'+headline+'</div>'+
                                '<div class="iw-content">'+
                                    '<p class="iw-subTitle"><i>'+displayDate+'</i></p>'+
                                    '<p>'+bodytext+'...'+'<a href="/missed_connections/'+id+'"><strong>click to see more</strong></a>'+'<p>'+
                                '</div>'+
                                    '<div class="iw-bottom-gradient"></div>' +
                            '</div>';
                    
                    var icon_url = '';

                    if (preference == 'm4m') {
                        var icon_url = 'http://i.imgur.com/tzFX01D.png';
                    } else if (preference == 'm4t') {
                        var icon_url = 'http://i.imgur.com/6HsvjKD.png';
                    } else if (preference == 'm4w') {
                        var icon_url = 'http://i.imgur.com/t3jmiYL.png';
                    } else if (preference == 't4m') {
                        var icon_url = 'http://i.imgur.com/UGFQjwQ.png';
                    } else if (preference == 't4t') {
                        var icon_url = 'http://i.imgur.com/BdybBva.png';
                    } else if (preference == 't4w') {
                        var icon_url = 'http://i.imgur.com/SLPjTxb.png';
                    } else if (preference == 'w4m') {
                        var icon_url = 'http://i.imgur.com/ixTZpEj.png';
                    } else if (preference == 'w4t') {
                        var icon_url = 'http://i.imgur.com/Nxq4YFl.png';
                    } else if (preference == 'w4w') {
                        var icon_url = 'http://i.imgur.com/XqiTYNu.png';
                    } else {
                        var icon_url = 'http://i.imgur.com/JqL9xVx.png';
                    };

                    if (filterDate >= todayMinusSeven && filterDate <= today){
                    // if ( 2 > 1){
                   

                        var marker = new google.maps.Marker({
                            // ADDED BY ME
                                // icon: "http://www.kidsafeseafood.org/wp-content/uploads/2011/07/icon_heart.png",
                                icon: icon_url,
                                body: bodytext,
                                headline: headline,
                                content: contentString,
                            // REQUIRED
                                position: latLng,
                                map: map,
                                title: headline
                                // label: preference
                            });
                            
                        markers.push(marker);
                        oms.addMarker(marker);
                        
                        
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


                        // *
  // START INFOWINDOW CUSTOMIZE.
  // The google.maps.event.addListener() event expects
  // the creation of the infowindow HTML structure 'domready'
  // and before the opening of the infowindow, defined styles are applied.
  // *
                          google.maps.event.addListener(infowindow, 'domready', function() {

                            // Reference to the DIV that wraps the bottom of infowindow
                            var iwOuter = $('.gm-style-iw');

                            /* Since this div is in a position prior to .gm-div style-iw.
                             * We use jQuery and create a iwBackground variable,
                             * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                            */
                            var iwBackground = iwOuter.prev();

                            // Removes background shadow DIV
                            iwBackground.children(':nth-child(2)').css({'display' : 'none'});

                            // Removes white background DIV
                            iwBackground.children(':nth-child(4)').css({'display' : 'none'});

                            // Moves the infowindow 115px to the right.
                            // iwOuter.parent().parent().css({left: '115px'});

                            // Moves the shadow of the arrow 76px to the left margin.
                            // iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

                            // Moves the arrow 76px to the left margin.
                            iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

                            // Changes the desired tail shadow color.
                            iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'RGBA(1, 16, 25, .6) 0px 1px 6px', 'z-index' : '1'});

                            // Reference to the div that groups the close button elements.
                            var iwCloseBtn = iwOuter.next();

                            // Apply the desired effect to the close button
                            iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #011019', 'border-radius': '13px', 'box-shadow': '0 0 5px RGBA(1, 16, 25, 1)'});

                            // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
                            if($('.iw-content').height() < 140){
                              $('.iw-bottom-gradient').css({display: 'none'});
                            }

                            // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
                            iwCloseBtn.mouseout(function(){
                              $(this).css({opacity: '1'});
                            });
                          });
                        // End INFO WINDOW CLOSURE
                    };
                    // End IF Statement

                }
                // CREATES MARKER CLUSTERS
                markerCluster = new MarkerClusterer(map, markers, mcOptions);
            }
        })
    })
}

var showMarkers = function() {
    $("#addmarkers").on('click', function(){

        getMarkers();
    });
}

var hideMarkers = function() {
    $("#removemarkers").on('click', function() {
        filterArray = [];
        $('.filter').removeClass('selected');

        markerCluster.setMap(null);


        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }
    });    
};

var revealGender = function(){
    $('#expand-options').hover(function(){
        $('#controls').addClass('active');
        $('#addmarkers').addClass('active');
        $('.gender-group').addClass('active');
    }, function(){

    });
};

var hideGender = function(){
    $('#mapcontrols').hover(function(){

    }, function(){
        $('#controls').removeClass('active');
        $('#addmarkers').removeClass('active');
        $('.gender-group').removeClass('active');
    });
};

var revealOptions = function(){
    $('.gender-group').hover(function(){
        // $('.preference-option').addClass('active');
        $(this).children('.preference-option').addClass('active');
        // $(this).children('.preference-option').css( "color", "green" );
    }, function(){
        // $('.preference-option').removeClass('active');
    });
};

var hideOptions = function(){
    $('.gender-group').hover(function(){

    }, function(){
        $('.preference-option').removeClass('active');
    });
    var filterArray = [];
};

var filterMarkers = function() {
    $(".filter").on('click', function(){
        var option = this.id.toString();
        console.log("filterMarkers");
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
                $("#loading").removeClass('hidden');
            },
            complete: function(){
                $("#loading").addClass('hidden');
            },
            success: function(data){
                // OPTIONS AND MARKERS A ARRAY FOR MARKER CLUSTERS
                var mcOptions = {gridSize: 50,
                 maxZoom: 15,
                };
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
                    var contentString = '<div id="iw-container" class="infowindow">'+
                            // '<div id="siteNotice">'+
                            // '</div>'+
                                '<div class="iw-title">'+headline+'</div>'+
                                '<div class="iw-content">'+
                                    '<p class="iw-subTitle"><i>'+place+' '+postdate+' '+source+'</i></p>'+
                                    '<p>'+bodytext+'<p>'+
                                    '<a href="/missed_connections/'+id+'">more</a>'+
                                '</div>'+
                                    '<div class="iw-bottom-gradient"></div>' +
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

var filterArray = [];

var addToFilter = function(){
    $('.filter').on('click', function(){
        var a = this.id.toString();
        console.log(a);
        var b = $.inArray(a, filterArray);
        var index = filterArray.indexOf(a);
        if(b <= -1){
            filterArray.push(a);
        } else if(b >= 0){
            filterArray.splice(index,1);
        };
    $(this).toggleClass('selected');
    console.log(filterArray);
    });
};

var filterDates = function(){
    // REMINDER:  change this to to use datepicker from JqueryUI
    $('#dateform').on('submit', function(event){
        console.log("filterDates");
        event.preventDefault();

        markerCluster.setMap(null);
        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }

        var urlStem = '/missed_connections';

        for( var i = 0; i <filterArray.length; i ++){
            var option = filterArray[i];
            var url = '/missed_connections/'+option+'.json'

            $(function(){
            $.ajax({
                url: url,
                datatype: 'json',
                beforeSend: function(){
                    $("#loading").removeClass('hidden');
                },
                complete: function(){
                    $("#loading").addClass('hidden');
                },
                success: function(data){
                    // OPTIONS AND MARKERS ARRAY FOR MARKER CLUSTERS
                    var mcOptions = {gridSize: 50, maxZoom: 15,};

                    markers = [];

                    oms = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true});

                // oms.addListener('click', function(marker, event) {
                //     iw.setContent(marker.desc);
                //     iw.open(map, marker);
                //     });
                    oms.addListener('spiderfy', function(markers) {
                        iw.close();
                        });

                    var form_data = $('#dateform').serializeArray();
                    var userStartDate = form_data[0].value.split('/');
                    var userEndDate = form_data[1].value.split('/');
                    var startDate = parseInt(userStartDate[2]+userStartDate[0]+userStartDate[1]);
                    var endDate = parseInt(userEndDate[2]+userEndDate[0]+userEndDate[1]);

                    markerCounter = 0;
                    for(var i = 0; i < data.length; i++) {
                        var id = data[i].id.toString();
                        var postdate =  data[i].post_date;
                        var headline = data[i].headline;
                        var bodytext = data[i].body_text.substring(0,120);
                        var preference = data[i].preference;
                        var place = data[i].place;
                        var latitude = +data[i].latitude;
                        var longitude = +data[i].longitude;
                        var latLng = new google.maps.LatLng(latitude, longitude);
                        var source = data[i].location_source;

                        // converted date for filtering
                        var userFilterDate = postdate.substring(0,10).split('-');
                        var filterDate = filterDate = parseInt(userFilterDate[0]+userFilterDate[1]+userFilterDate[2]);

                        // converted date for inforwindow display
                        var parseDate = postdate.substring(0,10).split('-');
                        var mm = parseInt(parseDate[1]).toString();
                        var dd = parseInt(parseDate[2]).toString();
                        var yyyy = parseInt(parseDate[0]).toString();
                        var displayDate = mm+'/'+dd+'/'+yyyy;

                        // CONTENT STRING FOR INFO WINDOWS
                        var contentString = '<div id="iw-container" class="infowindow">'+
                                // '<div id="siteNotice">'+
                                // '</div>'+
                                    '<div class="iw-title">'+headline+'</div>'+
                                    '<div class="iw-content">'+
                                        '<p class="iw-subTitle"><i>'+displayDate+'</i></p>'+
                                        '<p>'+bodytext+'...'+'<a href="/missed_connections/'+id+'"><strong>click to see more</strong></a>'+'<p>'+
                                    '</div>'+
                                        '<div class="iw-bottom-gradient"></div>' +
                                '</div>';
                        

                        var icon_url = '';

                        if (preference == 'm4m') {
                            var icon_url = 'http://i.imgur.com/tzFX01D.png';
                        } else if (preference == 'm4t') {
                            var icon_url = 'http://i.imgur.com/6HsvjKD.png';
                        } else if (preference == 'm4w') {
                            var icon_url = 'http://i.imgur.com/t3jmiYL.png';
                        } else if (preference == 't4m') {
                            var icon_url = 'http://i.imgur.com/UGFQjwQ.png';
                        } else if (preference == 't4t') {
                            var icon_url = 'http://i.imgur.com/BdybBva.png';
                        } else if (preference == 't4w') {
                            var icon_url = 'http://i.imgur.com/SLPjTxb.png';
                        } else if (preference == 'w4m') {
                            var icon_url = 'http://i.imgur.com/ixTZpEj.png';
                        } else if (preference == 'w4t') {
                            var icon_url = 'http://i.imgur.com/Nxq4YFl.png';
                        } else if (preference == 'w4w') {
                            var icon_url = 'http://i.imgur.com/XqiTYNu.png';
                        } else {
                            var icon_url = 'http://i.imgur.com/JqL9xVx.png';
                        };

                        if ( filterDate >= startDate && filterDate <= endDate ) {
                            markerCounter += 1;

                            var marker = new google.maps.Marker({
                                // ADDED BY ME
                                    icon: icon_url,
                                    body: bodytext,
                                    headline: headline,
                                    content: contentString,
                                // REQUIRED
                                    position: latLng,
                                    title: headline
                                    // label: preference
                                });
                            
                                markers.push(marker);
                                oms.addMarker(marker);
                        
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

                                                                  // *
                                  // START INFOWINDOW CUSTOMIZE.
                                  // The google.maps.event.addListener() event expects
                                  // the creation of the infowindow HTML structure 'domready'
                                  // and before the opening of the infowindow, defined styles are applied.
                                  // *
                                  google.maps.event.addListener(infowindow, 'domready', function() {

                                    // Reference to the DIV that wraps the bottom of infowindow
                                    var iwOuter = $('.gm-style-iw');

                                    /* Since this div is in a position prior to .gm-div style-iw.
                                     * We use jQuery and create a iwBackground variable,
                                     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                                    */
                                    var iwBackground = iwOuter.prev();

                                    // Removes background shadow DIV
                                    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

                                    // Removes white background DIV
                                    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

                                    // Moves the infowindow 115px to the right.
                                    // iwOuter.parent().parent().css({left: '115px'});

                                    // Moves the shadow of the arrow 76px to the left margin.
                                    // iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

                                    // Moves the arrow 76px to the left margin.
                                    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

                                    // Changes the desired tail shadow color.
                                    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'RGBA(1, 16, 25, .6) 0px 1px 6px', 'z-index' : '1'});

                                    // Reference to the div that groups the close button elements.
                                    var iwCloseBtn = iwOuter.next();

                                    // Apply the desired effect to the close button
                                    iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #011019', 'border-radius': '13px', 'box-shadow': '0 0 5px RGBA(1, 16, 25, 1)'});

                                    // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
                                    if($('.iw-content').height() < 140){
                                      $('.iw-bottom-gradient').css({display: 'none'});
                                    }

                                    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
                                    iwCloseBtn.mouseout(function(){
                                      $(this).css({opacity: '1'});
                                    });
                                  });
                        };
                    }
                    // CREATES MARKER CLUSTERS
                    markerCluster = new MarkerClusterer(map, markers, mcOptions);
                }
            })
        })

        }


    });
}

// DATE PICKER

var datePicker = function(){
     $('.datepicker').datepicker();
};

  // $(function() {
  //   $( "#datepicker1" ).datepicker();
  //   $( "#datepicker2" ).datepicker();
  // });



// EVENT HANDLERS

// window.onload = function(){
//     showMarkers();
//     hideMarkers();

//     // filterMarkers();

//     revealGender();
//     hideGender();
//     revealOptions();
//     hideOptions();

//     filterDates();
//     addToFilter();
//     datePicker();
// };

// $(document).ready(function(){
//     showMarkers();
//     hideMarkers();

//     // filterMarkers();

//     revealGender();
//     hideGender();
//     revealOptions();
//     hideOptions();

//     filterDates();
//     addToFilter();
//     datePicker();
// });

// save this for default date formula

// Date.prototype.yyyymmdd = function() {
//    var yyyy = this.getFullYear().toString();
//    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
//    var dd  = this.getDate().toString();
//    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
//   };

// d = new Date();
// d.yyyymmdd();