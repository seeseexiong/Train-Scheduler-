// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCJDvXDv53T93wlHQ-FbTB0JNKIapD-sWM",
    authDomain: "train-schedule-62158.firebaseapp.com",
    databaseURL: "https://train-schedule-62158.firebaseio.com",
    projectId: "train-schedule-62158",
    storageBucket: "train-schedule-62158.appspot.com",
    messagingSenderId: "454140441990",
    appId: "1:454140441990:web:797577c4ccee5b1a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
// Initial Values
var TrainName   = "";
var Destination = "";
var FirstTrain  = "";
var Freq        = 0;
var currentTime = moment().format("LT")
//=================================================
  
//Display current time on top of the application   
$("#currentTime").text(currentTime);

//====================================================

// The click event handler tiggers saving the data on to Firebase database
$("#add-train").on("click", function(event) {
    event.preventDefault();

    //grab user's inputs
    TrainName = $("#train-name-input").val().trim();
    Destination = $("#destination-input").val().trim();
    FirstTrain = parseInt($("#first-train-input").val().trim());
    Freq = $("#freq-input").val().trim();

    // Save the values/data into the root folder of Firebase
    // We will use the push method to avoid replacing old data
    database.ref().push({
        TrainName: TrainName,
        Destination: Destination,
        FirstTrain: FirstTrain,
        Freq: Freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clear input feilds
    $("#train-name-input").val("")
    $("#destination-input").val("")
    $("#first-train-input").val("")
    $("#freq-input").val("")

});

//====================================================

// Firebase listens for new data and then display them in the table's body
database.ref().on("child_added", function(childSnapshot) {

    // First Time (pushed back 1 year to make sure it comes before current time) .. because 
    FirstTrain = parseInt(childSnapshot.val().FirstTrain)
    var firstTimeConverted = moment(FirstTrain, "HH:mm A").subtract(1, "years");
    console.log('First Train: ' + firstTimeConverted.format('LT'));

    // Difference between the times
    var diffTime = moment().diff(firstTimeConverted.format('LT'))
    console.log('Differences: ' + diffTime)

    // Time apart (remainder)
    var tRemainder = diffTime % Freq;
    console.log(tRemainder);

    // Minuites until train
    var tMinutesTillTrain = Freq - tRemainder;
    console.log('Mins left: ' + tMinutesTillTrain)

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log('Next Train: ' + moment(nextTrain).format('LT'))

    //====================================================

    // create a new row and print to the table's body with id called "full-train-list"
    var newRow = $("<tr>").append(
        $('<td>').text(childSnapshot.val().TrainName),
        $('<td>').text(childSnapshot.val().Destination),
        $('<td>').text(childSnapshot.val().Freq),
        $('<td>').text(moment(nextTrain).format('LT')),
        $('<td>').text(tMinutesTillTrain),
    );

    $("#full-train-list").append(newRow);
    


    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


   