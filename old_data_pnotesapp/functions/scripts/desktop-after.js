var md=new Remarkable({html:!0,xhtmlOut:!0});

document.addEventListener('DOMContentLoaded', function () {

    // Here add using the const variable
    window.signInEmail = '<%= userEmail %>';
    const signInUserEmail = '<%= userEmail %>';
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
          try{
            document.getElementById(window.currentNote).classList.add('is--active');
            document.getElementById(window.currentNote).classList.remove('hoverable');
          } catch(e) {
            console.log("Ignore this error, comes at time of delete",e.toString)
          }
        }
    });

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
