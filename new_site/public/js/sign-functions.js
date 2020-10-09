/////// This file has been already added to the main ejs file of laptop 
// This is stored here just for reference


// Sign out Function
signOutFromGoogle = () => {
  //Start the user delete or sign out activity

  // Save any unsaved changes present
  saveForUnSavedChanges();

  console.log("Sign Out User!");

  var user = firebase.auth().signOut();

  var xhttp = new XMLHttpRequest();

  xhttp.addEventListener("error", function (evt) {
    console.log("Failed");
    console.log(evt.toString());
  });

  xhttp.addEventListener("load", function (evt) {
    console.log("Sign Out Success!");
    location.reload();
  });

  // Defining parameters 
  xhttp.open("POST", "/clear", true);
  //Send the proper header information along with the request
  xhttp.setRequestHeader("Content-Type", "application/json"); // Necessary for POST
  xhttp.send();
}





// Sign in function
signInToGoogle = () => {
  // Start the sign in Activity!
  console.log("Sign In to Google!");

  // Google sign in
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // console.log(result.user.email);
    console.log("success, check now!");

    // console.log(result.user.displayName);
    // console.log(result);
    // console.log(result.user);
    // console.log(result.user_id_token);

    console.log(result.user);

    // Add the cookie so that this can be also cleared whether to check wheather user is sign in or not
    var xhttp = new XMLHttpRequest();

    xhttp.addEventListener("error", function (evt) {
      console.log("Failed");
      console.log(evt.toString());
    });

    xhttp.addEventListener("load", function (evt) {

      // console.log(evt);
      // console.log(evt.srcElement);
      // console.log(evt.srcElement.response);
      if (JSON.parse(evt.srcElement.response)['success'] == 1) {
        console.log("Sign In Success!");
      } else {
        console.log("Failed to sign In");
      }
      location.reload();
    });

    // Defining parameters 
    xhttp.open("POST", "/set", true);
    //Send the proper header information along with the request
    xhttp.setRequestHeader("Content-Type", "application/json"); // Necessary for POST
    xhttp.send(JSON.stringify({ userEmail: result.user.email, userDisplayName: result.user.displayName }));

  }).catch(function (err) {
    console.log(err);
    console.log("Failed to do");
  });
}
