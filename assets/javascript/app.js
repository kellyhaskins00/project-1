"use strict";

const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const config = {
	KEY: "94b6544f7290465897a6148d2e1f048f"
}
const ApiKey = config.KEY;
const SECTIONS = "home, arts, automobiles, books, business, fashion, food, health, insider, magazine, movies, national, nyregion, obituaries, opinion, politics, realestate, science, sports, sundayreview, technology, theater, tmagazine, travel, upshot, world"; // From NYTimes

function buildUrl (url) {
    return NYTBaseUrl + url + ".json?api-key=" + ApiKey;
}

Vue.component('news-list', {
  props: ['results'],
  template: `
    <section>
      <div class="row" v-for="posts in processedPosts">
        <div class="columns large-3 medium-6" v-for="post in posts">
          <div class="card">
          <div class="card-divider">
          {{ post.title }}
          </div>
          <a :href="post.url" target="_blank"><img :src="post.image_url"></a>
          <div class="card-section">
            <p>{{ post.abstract }}</p>
          </div>
        </div>
        </div>
      </div>
  </section>
  `,
  computed: {
    processedPosts() {
      let posts = this.results;

      // Add image_url attribute
      posts.map(post => {
        let imgObj = post.multimedia.find(media => media.format === "superJumbo");
        post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A";
      });

      // Put Array into Chunks
      let i, j, chunkedArray = [], chunk = 4;
      for (i=0, j=0; i < posts.length; i += chunk, j++) {
        chunkedArray[j] = posts.slice(i,i+chunk);
      }
      return chunkedArray;
    }
  }
});

const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    sections: SECTIONS.split(', '), // create an array of the sections
    section: 'home', // set default section to 'home'
    loading: true,
    title: ''
  },
  mounted () {
    this.getPosts('home');
  },
  methods: {
    getPosts(section) {
      let url = buildUrl(section);
      axios.get(url).then((response) => {
        this.loading = false;
        this.results = response.data.results;
        let title = this.section !== 'home' ? "Top stories in '"+ this.section + "' today" : "Top stories today";
        this.title = title + "(" + response.data.num_results+ ")";
      }).catch((error) => { console.log(error); });
    }
  }
});
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
    var service;
    var center = { lat: 47.6062, lng: -122.3321 }

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13
      });

      var request = {
        location: center,
        radius: 5000,
        type: ['park']
        
      };

      infoWindow = new google.maps.InfoWindow();
      console.log(infoWindow);

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

      console.log(request, callback);
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

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
      
      }
      
      
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
          }
        }
      }
      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
      
        google.maps.event.addListener(marker, 'click', function() {
          console.log(infoWindow);
          infoWindow.setContent(place.name);
          infoWindow.open(map, marker);
        });
      }
      

/*      var input = document.getElementById('pac-input');
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
      
    }*/
    
$("#button-find-2").on('click',initMap);
    $( "#button-find" ).on("click", initMap,);
    $(document).ready(function(){
      $(this).scrollTop(0);
  });



