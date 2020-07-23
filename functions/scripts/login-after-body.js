var md=new Remarkable({html:!0,xhtmlOut:!0});

document.addEventListener('DOMContentLoaded', function () {

  // Taken from desktop part
  window.signInEmail = 'anonymousNotSigned';
  const signInUserEmail = 'anonymousNotSigned';
  window.currentNote = '';
  window.editor = { id: '', title: '', description: '' };

  console.log("Email using:", signInUserEmail);

  // Now call the data extract for only once so as to get the list of datas
  firebase.database().ref(signInUserEmail).orderByChild('timestamp').on('value', function (snapshot) {

    //console.log(snapshot);
    var descNoteList = [];

    snapshot.forEach(function (childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      //console.log("childkey", childKey);
      //console.log("childData", childData);
      // ...
      descNoteList.push({ childKey: childKey, childData: childData });

    });

    // Reverse the array
    descNoteList.reverse();

    // Empty the notes data
    window.notesData = {};

    var noteFamily = document.getElementById('note-family');
    noteFamily.innerHTML = '';
    noteFamilyString = '';

    descNoteList.forEach(function (childSnapshot) {
      var childKey = childSnapshot.childKey;
      var childData = childSnapshot.childData;

      noteFamilyString += '<div id="' + childKey + '" class="note-row hoverable" onclick=doOnNoteClick(this) >'
        + '<div class="note-title">' + childData.title + '</div>'
        + '<div class="note-date">' + childData.date + '</div>'
        + '</div>';

      // Only storing notes description in it
      window.notesData[childKey] = { description: childData.description, title: childData.title };
    });

    noteFamily.innerHTML = noteFamilyString;

    // make the current note active if present
    if (window.currentNote) {
      try {
        document.getElementById(window.currentNote).classList.add('is--active');
        document.getElementById(window.currentNote).classList.remove('hoverable');
      } catch (e) {
        console.log("Ignore this error, comes at time of delete", e.toString)
      }
    }


    // they are inside the firebase instance thing
    addNotefunction = (title, description) => {
      //Start the add note function
      console.log("Add Note");

      var options = { month: 'short', day: 'numeric' };
      var today = new Date();
      // console.log(today.toLocaleDateString("en-US", options));

      var newNote = {
        title: title,
        description: description,
        date: today.toLocaleDateString("en-US", options),
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }

      // Get a key for a new Post.
      var newPostKey = firebase.database().ref(signInUserEmail).push().key;

      console.log(newPostKey);
      // Now this is going to be the current value which we are editing
      window.currentNote = newPostKey;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates[newPostKey] = newNote;

      return firebase.database().ref(signInUserEmail).update(updates);
    }

    updateNotefunction = (noteId, title, description) => {

      //Start the update note function
      console.log("Update Note");

      var options = { month: 'short', day: 'numeric' };
      var today = new Date();
      // console.log(today.toLocaleDateString("en-US", options));

      var newNote = {
        title: title,
        description: description,
        date: today.toLocaleDateString("en-US", options),
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates[noteId] = newNote;

      return firebase.database().ref(signInUserEmail).update(updates);
    }

    deleteNotefunction = (noteId) => {
      return firebase.database().ref(signInUserEmail).child(noteId).remove();
    }

  });

  //list(family);

  // Here the firebase is correctly defined purely!
  //console.log(firebase.database.ServerValue.TIMESTAMP);

  // Removed the ones not needed here

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

});

function viewMobileSite() {
  window.location.href = "/mobile";
}

// Add this sccript before the body to make this work
