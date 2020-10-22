// console.log("What??????????")
// Take care to load shortcuts.js file first

// Here add using the const variable
window.signInEmail = cuserEmail;
const signInUserEmail = cuserEmail;
window.currentNote = '';
window.editor = { id: '', title: '', description: '' };

window.splitView = false;
var simplemde = ''; // Initialised with emoty string
var saveTimer = null;


// console.log("Email using:", signInUserEmail);

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

  var noteFamily = byId('note-family');
  noteFamily.innerHTML = '';
  let noteFamilyString = '';

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

    if (window.splitView) {
      makePreviewTabActive();
    }

    try {
      byId(window.currentNote).classList.add('is--active');
      byId(window.currentNote).classList.remove('hoverable');
    } catch (e) {
      // console.log("Ignore this error, comes at time of delete", e.toString)
    }
  }
});

const addNotefunction = (title, description) => {
  //Start the add note function
  // console.log("Add Note");

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

  // console.log(newPostKey);
  // Now this is going to be the current value which we are editing
  window.currentNote = newPostKey;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates[newPostKey] = newNote;

  return firebase.database().ref(signInUserEmail).update(updates);
}

const updateNotefunction = (noteId, title, description) => {

  //Start the update note function
  // console.log("Update Note");

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

const deleteNotefunction = (noteId) => {
  return firebase.database().ref(signInUserEmail).child(noteId).remove();
}


// <!-- Script to add the data of the currentNote to description on button click -->
function doOnNoteClick(noteRow) {

  // console.log(md.render('# Remarkable rulezz!'));

  // To be removed after autosave, as no longer needed plus, it gives more error and problems than needed
  // saveForUnSavedChanges();

  // First deselect the current selected Note
  // console.log("Current Note", window.currentNote);

  if (window.currentNote) {
    try {
      byId(window.currentNote).classList.remove('is--active');
      byId(window.currentNote).classList.add('hoverable');
    } catch (e) {
      // console.log("Error currentNote invalid!", e.toString());
    }
  }
  // console.log(noteRow);
  // console.log(noteRow.id);

  // Select the note
  window.currentNote = noteRow.id;
  noteRow.classList.add("is--active");
  noteRow.classList.remove("hoverable");

  // // Show the remove and edit title buttons
  // byId('remove-note-button').classList.remove('hidden');
  byId('edit-title-button').classList.remove('hidden');

  // Show the tab-nav
  byId('tab-nav').classList.remove('hidden');
  byId("search-input").value = "";
  ForSearchingNote();
  // Store the values in editor
  window.editor['id'] = noteRow.id;
  window.editor['title'] = window.notesData[noteRow.id].title;
  window.editor['description'] = window.notesData[noteRow.id].description;
  // console.log("Editor changed success!");
  // console.log(window.editor);
  // Making the preview tab active
  makePreviewTabActive();

  if (window.splitView) {
    makeEditTabActive();
  }

  if (screen.width <= 720) {
    byId('sidebar-toggler').click();
  }

}


// <!-- Tab navigations - To make edit tab active -->

// Remember click actions are taken care by jquery

function makeEditTabActive() {

  // console.log(window.editor);

  byId('editing-button').classList.add('tab-active');
  byId('preview-button').classList.remove('tab-active');

  byId('note-description-content').classList.add('hidden');
  byId('note-description-preview').classList.remove('hidden');

  // Now add the description
  var editorWindowTextArea = byId('note-description-editor');
  editorWindowTextArea.innerHTML = window.editor.description;
  editorWindowTextArea.value = window.editor.description;

  // Adding for simple mde editor
  simplemde.value(window.editor.description);

  // REMOVED focus
  // byId('note-description-editor').focus();
}


// <!-- To make the preview tab active -->

function makePreviewTabActive() {

  // console.log(window.editor);

  // Now update the preview with the editor values

  // Now add the description
  var descriptionWindow = byId('note-description-content');
  descriptionWindow.innerHTML = md.render(window.editor.description);

  // now change all a tags to have target="_none" in note-description-content
  var anchors = descriptionWindow.getElementsByTagName('a');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].setAttribute('target', '_blank');
    anchors[i].setAttribute('rel', "noopener");
  }

  // Change from document to desccription window
  descriptionWindow.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });

  byId('preview-button').classList.add('tab-active');
  byId('editing-button').classList.remove('tab-active');

  byId('note-description-preview').classList.add('hidden');
  byId('note-description-content').classList.remove('hidden');
}


// <!-- Script to change the editor values on textarea change -->
// function changeWindowEditorDescription(textArea) {
//   // console.log("Text Area changed!");

//   // Choose which is better value comes as the real time parameter
//   // console.log(textArea.innerHTML);
//   // console.log(textArea.value);

//   // Change the editor values
//   window.editor.description = textArea.value;
// }


// <!-- Sccript to open add a note create -->
function newNoteWindow() {

  // Save the current note and editor values if changed!
  saveForUnSavedChanges();

  // This creates a new note and also set the currentNote as the new key which is found
  // The current Note is automatically selected and tasks are done in the ref method!!
  addNotefunction('New Note Title', '# New Note')

  // noteFamily.innerHTML = dataToAppend + presentData;
  // console.log("Check Now if new note is created!");
  // console.log("Now open the new note editor");

  // Move the values of current note to editor
  window.editor = { id: window.currentNote, title: window.notesData[currentNote].title, description: window.notesData[currentNote].description };
  // console.log(window.editor);

  byId('tab-nav').classList.remove('hidden');
  makeEditTabActive();  // This sets focus to description editor

  // First show the buttons of top nav
  // Show the remove and edit title buttons
  // byId('remove-note-button').classList.remove('hidden');
  byId('edit-title-button').classList.remove('hidden');

  // Now open new edit title dialog
  makeEditTitleBoxVisible();  //This sets focus to note title editor
}


// <!-- Script to cancel saving a note or restore the state -->
function restoreState() {
  // Makes the description to open with the current Note values 
  // console.log(window.editor);
  window.editor.description = window.notesData[window.currentNote].description;
  makePreviewTabActive();
}

// <!-- Script to update or say save a note and remain at that note -->
function saveNote() {
  // console.log(window.editor);
  updateNotefunction(window.editor.id, window.editor.title, window.editor.description);
  // console.log(promisedResult);

  // restoreState(); // This will be done after the update
  window.editor.description = window.notesData[window.currentNote].description;
}


// <!-- Show delete note modal -->
function openDeleteNoteModal() {
  var deleteModal = byId("delete-modal");
  deleteModal.classList.remove('hidden');

  deleteModal.getElementsByClassName("close")[0].onclick = function () {
    deleteModal.classList.add('hidden');
  }

  deleteModal.getElementsByClassName("cancel")[0].onclick = function () {
    deleteModal.classList.add('hidden');
  }

  let confirmDelete = deleteModal.getElementsByClassName("confirm-delete")[0];
  confirmDelete.onclick = function () {
    deleteCurrentNote();
    deleteModal.classList.add('hidden');
  }
  byId('modal-message-p').innerHTML = 'Are you sure you want to delete ' + window.editor.title + '?'

  confirmDelete.focus();
}

// This function deletes the current active note
function deleteCurrentNote() {

  // console.log(window.currentNote);

  // Make a confirm message for delete of a note
  deleteNotefunction(window.currentNote);
  byId('note-description-content').innerHTML = '';
  byId('note-description-editor').innerHTML = '';
  byId('note-description-editor').value = '';

  // Empty simple mde
  simplemde.value("");

  byId('remove-note-button').classList.add('hidden');
  byId('edit-note-title-box').classList.add('hidden');
  byId('edit-title-button').classList.add('hidden');
  byId('tab-nav').classList.add('hidden');

  window.currentNote = ''; // Now no note is in progress to be edited!
}

// <!-- Sript to have the values updated -->
window.onbeforeunload = function (event) {
  // do stuff here
  try {
    if (window.notesData[window.currentNote].description !== window.editor.description) {
      // console.log('Unsaved Changes Found!');
      return "you have unsaved changes. Are you sure you want to navigate away?";
    } else {
      // console.log("No unsaved changes found");
    }
  } catch (error) {
    // console.log("No unsaved changes as no note selected");
  }
};

// <!-- Script to show edit title box -->
function makeEditTitleBoxVisible() {

  // console.log("Update title");
  let editNoteTitleBox = byId('edit-note-title-box');
  editNoteTitleBox.classList.remove('hidden');
  editNoteTitleBox.getElementsByTagName('input')[0].value = window.editor.title;

  editNoteTitleBox.getElementsByClassName('cancel')[0].onclick = function () {
    editNoteTitleBox.classList.add('hidden');
  }

  function NotePageVisible() { //Due to repetion of code i created this function
    var editNoteTitleIinputValue = byId('edit-note-title-input').value;
    if (editNoteTitleIinputValue.toString().trim() === '') {
      alert('Note Title Cannot be empty!');
    } else {
      updateNotefunction(window.currentNote, editNoteTitleIinputValue, window.notesData[window.currentNote].description);
      window.editor['title'] = editNoteTitleIinputValue; // As editor needs also be updated
      editNoteTitleBox.classList.add('hidden');
    }
  }
  editNoteTitleBox.getElementsByClassName('save')[0].addEventListener("click", NotePageVisible);
  editNoteTitleBox.addEventListener("keypress", (event) => {
    // console.log(event.keyCode)
    if (event.keyCode === 13) {
      NotePageVisible();
    }
  });

  // Make focus to the input!
  // TOCHECK
  byId('edit-note-title-input').focus();
}

function saveForUnSavedChanges() {

  // console.log('Trying to save unsaved changes if present');
  if (window.currentNote && window.currentNote !== '') {
    // Current note is not empty
    // console.log('Current Note is not empty');
    if (window.notesData[currentNote].description !== window.editor.description) {
      // console.log('Unsaved changes found!');

      // Right now the state is not restored, so no problem
      // The firebase reference makes the current Note available

      // Now save the note
      // console.log(window.editor);
      updateNotefunction(window.editor.id, window.editor.title, window.editor.description);

      // No need for restore changes as that will be done by the function who called this function
    }
  }
}

// const serachValue = byId("search-input");
// serachValue.addEventListener("input",() => {
//    console.log(serachValue.value)
// })
const noteFamilyNodes = byId("note-family").childNodes;

const ForSearchingNote = () => {
  const searchValue = byId("search-input");
  for (let i = 0; i < noteFamilyNodes.length; i++) {
    if (noteFamilyNodes[i].childNodes[0].textContent.toLowerCase().includes(searchValue.value.toLowerCase())) {
      if (noteFamilyNodes[i].classList.value.includes("hidden")) {
        noteFamilyNodes[i].classList.remove("hidden");
      }
    } else {
      noteFamilyNodes[i].classList.add("hidden");
    }
  }
};

/////// This file has been already added to the main ejs file of laptop 
// This is stored here just for reference


// Sign out Function
const signOutFromGoogle = () => {
  //Start the user delete or sign out activity

  // Save any unsaved changes present
  saveForUnSavedChanges();

  // console.log("Sign Out User!");

  firebase.auth().signOut();

  var xhttp = new XMLHttpRequest();

  xhttp.addEventListener("error", function (evt) {
    // console.log("Failed");
    // console.log(evt.toString());
  });

  xhttp.addEventListener("load", function (evt) {
    // console.log("Sign Out Success!");
    // location.reload();
  });

  // Defining parameters 
  xhttp.open("POST", "/clear", true);
  //Send the proper header information along with the request
  xhttp.setRequestHeader("Content-Type", "application/json"); // Necessary for POST
  xhttp.send();
}


// Sign in function
const signInToGoogle = () => {
  // Start the sign in Activity!
  // console.log("Sign In to Google!");

  // Google sign in
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // console.log(result.user.email);
    // console.log("success, check now!");

    // console.log(result.user.displayName);
    // console.log(result);
    // console.log(result.user);
    // console.log(result.user_id_token);

    // console.log(result.user);

    // Add the cookie so that this can be also cleared whether to check wheather user is sign in or not
    var xhttp = new XMLHttpRequest();

    xhttp.addEventListener("error", function (evt) {
      // console.log("Failed");
      // console.log(evt.toString());
    });

    xhttp.addEventListener("load", function (evt) {

      // console.log(evt);
      // console.log(evt.srcElement);
      // console.log(evt.srcElement.response);
      // if (JSON.parse(evt.srcElement.response)['success'] == 1) {
      //   // console.log("Sign In Success!");
      // } else {
      //   // console.log("Failed to sign In");
      // }
      location.reload();
    });

    // Defining parameters 
    xhttp.open("POST", "/set", true);
    //Send the proper header information along with the request
    xhttp.setRequestHeader("Content-Type", "application/json"); // Necessary for POST
    xhttp.send(JSON.stringify({ userEmail: result.user.email, userDisplayName: result.user.displayName }));

  }).catch(function (err) {
    // console.log(err);
    // console.log("Failed to do");
  });
}

byId('sidebar-toggler').onclick = function () {
  // console.log("Side Toggler");
  var sidbar = byId('sidebar');

  if (screen.width <= 720) {
    sidbar.style.width = "100vw";
  }
  sidbar.classList.add('sidebar-animate');
  sidbar.classList.toggle('hide-sidebar');
  setTimeout(function () {
    sidbar.classList.remove('sidebar-animate');
  }, 500);


  let curImg = byId('side-img').src.split('/');

  if (curImg[curImg.length - 1] === "top.svg") {
    byId('side-img').src = "/images/object.svg";
    byId('search-notes-box').classList.remove('hidden');
    byId('side-img').title = "Hide Sidebar";
  } else {
    byId('side-img').src = "/images/top.svg";
    byId('search-notes-box').classList.add('hidden');
    byId('side-img').title = "Show Sidebar";
  }
}


byId('preview-button').onclick = function () {
  // Make edit button as deactivated
  makePreviewTabActive();
}

byId('editing-button').onclick = function () {
  // Make edit button as deactivated
  makeEditTabActive();
};

window.onkeydown = function (event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault();
        // console.log("Trigger key press saved");
        // This means save the note now
        if (window.currentNote) {
          // console.log('Saving Note');
          saveNote();
          makePreviewTabActive();
        }
        break;
    }
  }
}

document.onkeyup = function (e) {
  if (e.shiftKey && e.which == 46) {
    openDeleteNoteModal()
  }

  else if (e.ctrlKey && e.shiftKey && e.which == 37 ) {
    byId('side-img').click();
  } else if (e.ctrlKey && e.shiftKey && e.which == 39) {
    byId('side-img').click();
  }
};

/** Mobile Toggler */
// console.log("y")
byId('top-nav-toggler').onclick = function () {
  // console.log("Togller")
  byId('top-nav-items').classList.toggle('top-nav-hide');
}

byId('share-img').onclick = function () {
  let url = "/share?id=" + window.currentNote + "&user=" + cuserEmail
  window.open(url);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

byId('download-img').onclick = function () {
  let file = md.render(window.editor.description);
  console.log(file);
  download(window.editor.title + ".html", file)
}

byId('split-btn').onclick = function () {
  if (window.splitView) {
    window.splitView = false;
    byId('split-view-holder').classList.remove('pflex-view');
  }
  else {
    window.splitView = true;
    byId('split-view-holder').classList.add('pflex-view');
    saveForUnSavedChanges();
    makeEditTabActive();
    }
    // Save the current note and editor values if changed!
  }
}

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM LOADED");
  simplemde = new SimpleMDE({
    element: document.getElementById("note-description-editor")
  });

  simplemde.codemirror.on("keydown", function () {
    console.log(simplemde.value());

    // Start a timer for 3000 ms
    window.editor.description = simplemde.value();

    clearTimeout(saveTimer);
    byId('saved-img-c').classList.add('hidden');
    byId('typing-img-c').classList.remove('hidden');

    saveTimer = setTimeout(function () {
      console.log("Hello work");
      byId('saved-img-c').classList.remove('hidden');
      byId('typing-img-c').classList.add('hidden');
      saveNote();
    }, 800);

  });
});
