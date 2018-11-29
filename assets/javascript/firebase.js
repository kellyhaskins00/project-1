  // Initialize Firebase
  var fireBase = {
    apiKey: "AIzaSyACRhqx-G7ZIT2KBkx8Wbj21JlGMt3fdP8",
    authDomain: "project-1-b8771.firebaseapp.com",
    databaseURL: "https://project-1-b8771.firebaseio.com",
    projectId: "project-1-b8771",
    storageBucket: "project-1-b8771.appspot.com",
    messagingSenderId: "139016421598"
  };
  firebase.initializeApp(fireBase);

   // Create a variable to reference the database
   var database = firebase.database();

   var name = "";
   var email = "";
   var age = "";
   var comment = "";

   // Capture Button Click
   $("#add-user").on("click", function(event) {
     // Don't refresh the page!
     event.preventDefault();

     // YOUR TASK!!!
     name = $("#name-input").val().trim();
     email = $("#email-input").val().trim();
     age = $("#age-input").val().trim();
     comment = $("#comment-input").val().trim();
     
     // Code in the logic for storing and retrieving the most recent user.
     database.ref().set({
       name: name,
       email: email,
       age: age,
       comment: comment,
       
     });
     // Don't forget to provide initial data to your Firebase database.

   });


   // Firebase watcher + initial loader HINT: .on("value")
   database.ref().on("value", function(snapshot) {

   // Print the initial data to the console.
   console.log(snapshot.val());

   // Log the value of the various properties
   console.log(snapshot.val().name);
   console.log(snapshot.val().email);
   console.log(snapshot.val().age);
   console.log(snapshot.val().comment);
   

   // Change the HTML
   $("#name-display").text(snapshot.val().name);
   $("#email-display").text(snapshot.val().email);
   $("#age-display").text(snapshot.val().age);
   $("#comment-display").text(snapshot.val().comment);
   

   // If any errors are experienced, log them to console.
   }, function(errorObject) {
   console.log("The read failed: " + errorObject.code);
   });