 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyCJDvXDv53T93wlHQ-FbTB0JNKIapD-sWM",
  authDomain: "train-schedule-62158.firebaseapp.com",
  databaseURL: "https://train-schedule-62158.firebaseio.com",
  projectId: "train-schedule-62158",
  storageBucket: "train-schedule-62158.appspot.com",
  messagingSenderId: "454140441990"
};

firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var TrainName= "";
var Destination = "";
var FristTrain = 0;
var Freq = "";

//=================================================



//====================================================

// Capture Button Click
$("#add-train").on("click", function(event) {
  event.preventDefault();

  // YOUR TASK!!!
  // Code in the logic for storing and retrieving the most recent user.
  // Don't forget to provide initial data to your Firebase database.
  TrainName = $("#train-name-input").val().trim();
  Destination = $("#destination-input").val().trim();
  FirstTrain = $("#first-train-input").val().trim();
  Freq = $("#freq-input").val().trim();

  // Code for the push
  database.ref().push({

    TrainName: TrainName,
    Destination: Destination,
    FirstTrain: FirstTrain,
    Freq: Freq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(childSnapshot) {

  // full list of items to print to the full-train-list(DOM)
  $("#full-train-list").append("<table class='table'><tr><td class='display-train-name'> " +
    childSnapshot.val().TrainName +
    " </td><td class='display-destination'> " + childSnapshot.val().Destination +
    " </td><td class='display-freq'> " + childSnapshot.val().Freq +
    " </td><td class='dispaly-firstTrain'> " + childSnapshot.val().FirstTrain +
    " </td><td class='dispaly-timeAway'> " + "minutes away" +
    " </td></table>");

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});



$("#currentTime").append(moment(currentTime).format("HH:mm"));

FirstTrain = $("#first-train-input").val().trim();
Freq = $("#freq-input").val().trim();

var firstTraiTime = moment(FirstTrain).formate("HH:mm")
var freqTime = moment(Freq).formate("HH:mm")

//First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTraiTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

//Current time
var currentTime = moment();
console.log(moment(currentTime).format("HH:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
