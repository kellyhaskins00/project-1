// //fly motion

// var ieRotate = new function () {
//   var me = this,
//       $fly,
//       initialPosition,
//       radius = 150;
  
//   /* 
//    * Initialize the animation here.
//    */
//   me.init = function () {
      
//       // Caches the jQuery object for performance reasons.
//       $fly = $('#fly');
      
//       // Stores the initial position of Saturn.  Used later when calculating
//       // the orbit animation.
//       initialPosition = {
//           x: parseInt($fly.css('left')),
//           y: parseInt($fly.css('top'))
//       };
      
//       // starts the aniamtion.
//       rotateOnce();
//   }
  
//   function rotateOnce() {
      
//       /*
//        * jQuery.animate() was designed to animate DOM objects by tweening
//        * numeric CSS property values.  This is fine when moving these DOM
//        * objects in straight lines, but not so good when trying to move an 
//        * object in a circular path.  This will show you how you can work 
//        * around this limitation.
//        */
      
//       // Step 1: Set a dummy property to the angle of the initial position
//       //         of Saturn.  We use text-indent, since it doesn't do anything
//       //         on an image.
//       $fly.css('text-indent', 0);
      
//       // Step 2: We set up jQuery.animate() to do the animation by ....
//       $fly.animate(
//           // ... first setting the final value of text-indent to be 2*π 
//           // radians, which is the same as 360 degrees ... 
//           {
//               'text-indent': 2*Math.PI
//           }, {
              
//               /*
//                * ... next we set up a step function that will generate the 
//                * frame when the angle stored in the text-indent property
//                * at this particular part of the animation.  The formulas used
//                * for the x and y coordinates are derived using the 
//                * polar equation of a circle.  For those that are unfamiliar
//                * with polar equations, take a look at 
//                * http://sites.csn.edu/istewart/mathweb/math127/polar_equ/polar_equ.htm
//                */
//               step: function (now) {
//                   $fly.css('left', initialPosition.x + radius * Math.cos(now))
//                          .css('top', initialPosition.y + radius * Math.sin(now))
//               },
              
//               // This makes the animation last 4000milliseconds (= 4 seconds)
//               duration: 4000,
              
//               // The easing property is analogeous to the CSS3 
//               // animation-timing-funciton
//               easing: 'linear',
              
//               // Once the animation finishes, we call rotateOnce() again so
//               // that the animation is repeated.
//               complete: rotateOnce
//           }
//       );
//   }
// }

// $(document).ready(ieRotate.init);

//scrolling animation

// $(document).ready(function(){
//   $( "fly.scrollLink" ).click(function( event ) {
//       event.preventDefault();
//       $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top }, 500);
//   });
// });  


    
    var map;
    var infoWindow;





    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 13
      });
      infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open(map);
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });
      
      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
      
    }

    $( "#button-addon2" ).on("click", initMap,)

