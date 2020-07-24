
document.addEventListener('DOMContentLoaded', function () {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    window.signInEmail = "";
    window.notesData = {};
    var md = new Remarkable();
    // console.log(md.render('# Remarkable rulezz!'));

    signInfunction = () => {
        // Start the sign in Activity!
        console.log("Sign In NOw!");

        // Google sign in
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // console.log(result);
            console.log("success, check now!");
        }).catch(function (err) {
            console.log(err);
            console.log("Failed to do");
        });


        //     firebase.auth().signInWithRedirect(provider);

        //     firebase.auth().getRedirectResult()
        //         .then(function(result) {

        //             if (result.credential) {
        //                 // This gives you a Google Access Token. You can use it to access the Google API.
        //                 var token = result.credential.accessToken;
        //                 // ...
        //             }
        //             // The signed-in user info.
        //             var user = result.user;
        //             console.log("Sign In success!");
        //             console.log(user);

        //         })
        //         .catch(function(error) {
        //             // Handle Errors here.
        //             console.log("Sign In Failed!");
        //             var errorCode = error.code;
        //             var errorMessage = error.message;
        //             // The email of the user's account used.
        //             var email = error.email;
        //             // The firebase.auth.AuthCredential type that was used.
        //             var credential = error.credential;
        //             // ...
        //         });

    }

    // This get the note list and also updates it
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("User is signed in!");
            var len = user.email.length;
            //console.log(len);
            window.signInEmail = user.email.toString().substr(0, len - 10); // Removing the @gmail.com
            var signInUserEmail = user.email.toString().substr(0, len - 10); // Removing the @gmail.com
            // console.log(window.signInEmail);
            document.getElementById('guser').innerHTML = "Welcome " + signInUserEmail;
            document.getElementById('signInButton').style.display = "none";
            document.getElementById('signOutButton').style.display = "block";
            document.getElementById('addNoteButton').style.display = "block";

            // Now call the data extract for only once so as to get the list of datas
            firebase.database().ref(signInUserEmail).orderByChild('timestamp').on('value', function (snapshot) {

                // Get the id of the list
                var noteListId = document.getElementById('note-family');

                //Clear the list
                noteListId.innerHTML = '';

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

                descNoteList.forEach(function (childSnapshot) {
                    var childKey = childSnapshot.childKey;
                    var childData = childSnapshot.childData;

                    // Only storing notes description in it
                    window.notesData[childKey] = childData.description;

                    // Setting the values
                    noteListId.innerHTML += '<div class="noterow" id="' + childKey + '" >'
                        + '<p class="notekey" >' + childKey + '</p>'
                        + '<!-- Expand Button -->'
                        //+ '<button class="btn btn-primary" id="expand-button" style="display: block;" >'

                        + '<div class="row" style="margin-left:0; margin-right:0" onclick=expandCollapseFun("' + childKey + '")> '
                        + '<i '
                        + ' style="font-size:24px;" class="expand-toggler-icon fa btn">&#xf107;</i>'
                        + '<Button class="update-note-button btn btn-secondary" onclick=openUpdateNoteModal(\'' + childKey + '\') >' + 'Update' + '</Button>'
                        + '<Button class="remove-note-button btn btn-danger" onclick=openDeleteNoteModal(\'' + childKey + '\') >' + 'Remove' + '</Button>'
                        + '<h6 class="note-date">' + childData.date + '</h6>'
                        + '<h4 class="note-title">' + childData.title + '</h4>'
                        + '</div>'
                        + '<div class="note-descripiton-md" style="display: none;">' + md.render(childData.description) + '</div>'
                        + '</div>';
                });
            });

            //list(family);

            // Here the firebase is correctly defined purely!
            //console.log(firebase.database.ServerValue.TIMESTAMP);

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

        } else {
            console.log("NO user signed in!");
            window.signInEmail = "";
            document.getElementById('guser').innerHTML = "Welcome to Pnotes!";
            document.getElementById('signInButton').style.display = "block";
            document.getElementById('signOutButton').style.display = "none";
            document.getElementById('addNoteButton').style.display = "none";
            document.getElementById('note-family').innerHTML = '';
            // No user is signed in.
        }
    });
});

// Sign out Function
signOutfunction = () => {
    //Start the user delete or sign out activity
    console.log("Sign Out User!");

    var user = firebase.auth().signOut();
}

// Script to open update note modal

function openUpdateNoteModal(noteRowId) {
    // console.log(noteRowId);
    var noteRowSelected = document.getElementById(noteRowId);
    // console.log(noteRowSelected);

    // Now update after taking values from this
    var noteDescr = window.notesData[noteRowId];
    var noteTitle = noteRowSelected.getElementsByClassName('note-title')[0].innerHTML;
    // console.log(noteDescr);
    // console.log(noteTitle);

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    var formNoteTitle = document.getElementById('add-title');
    var formNoteDescr = document.getElementById('add-description');
    formNoteTitle.value = noteTitle;
    formNoteDescr.innerHTML = noteDescr;

    // When the user clicks the button, open the modal 
    modal.style.display = "block";
    // Certainly some times an unexpected problem arise if value is not updated
    formNoteDescr.value = noteDescr;

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Now for the submit button
    var submitUpdateNote = document.getElementById('add-note-submit-button');
    submitUpdateNote.innerHTML = 'Update Note';

    submitUpdateNote.onclick = function () {

        var addNoteTitle = document.getElementById('add-title').value;
        var addNoteDescription = document.getElementById('add-description').value;
        //console.log(addNoteTitle);
        //console.log(addNoteDescription);
        if (addNoteTitle) {
            // Note title not empty
            // Now do the thing which you want to do call addNotefunction
            updateNotefunction(noteRowId, addNoteTitle, addNoteDescription);
            modal.style.display = "none";

        } else {
            //Empty
            console.log("Empty Note Title");
            modal.style.display = "none";
        }
    }
}
