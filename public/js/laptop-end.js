// Take care to load shortcuts.js file first

// Here add using the const variable
window.signInEmail = cuserEmail;
const signInUserEmail = cuserEmail;
window.currentNote = '';
window.editor = { id: '', title: '', description: '' };

window.splitView = false;
var simplemde = ''; // Initialised with emoty string
var saveTimer = null;


// Making the t3ext ediot to simple mde
simplemde = new SimpleMDE({
  element: document.getElementById("note-description-editor")
});

simplemde.codemirror.on("keyup", function () {
  // Start a timer for 3000 ms
  window.editor.description = simplemde.value();

  clearTimeout(saveTimer);
  byId('saved-img-c').classList.add('hidden');
  byId('typing-img-c').classList.remove('hidden');

  saveTimer = setTimeout(function () {
    byId('saved-img-c').classList.remove('hidden');
    byId('typing-img-c').classList.add('hidden');
    saveNote();
  }, 800);

});

// "Email using:" signInUserEmail

// Now call the data extract for only once so as to get the list of datas
firebase.database().ref(signInUserEmail).orderByChild('timestamp').on('value', function (snapshot) {

  var descNoteList = [];

  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();

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
      console.log("Ignore this error, comes at time of delete", e.toString)
    }
  }
});

const addNotefunction = (title, description) => {
  //Start the add note function

  var options = { month: 'short', day: 'numeric' };
  var today = new Date();

  var newNote = {
    title: title,
    description: description,
    date: today.toLocaleDateString("en-US", options),
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref(signInUserEmail).push().key;

  // Now this is going to be the current value which we are editing
  window.currentNote = newPostKey;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates[newPostKey] = newNote;

  return firebase.database().ref(signInUserEmail).update(updates);
}

const updateNotefunction = (noteId, title, description) => {
  //Start the update note function

  var options = { month: 'short', day: 'numeric' };
  var today = new Date();

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

  // To be removed after autosave, as no longer needed plus,
  // it gives more error and problems than needed
  // saveForUnSavedChanges();

  // First deselect the current selected Note
  if (window.currentNote) {
    try {
      byId(window.currentNote).classList.remove('is--active');
      byId(window.currentNote).classList.add('hoverable');
    } catch (e) {
      console.log("Error currentNote invalid!", e.toString());
    }
  }

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
  // Editor changed success!
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
  // Takes values from window.editor

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
  // TODO Add focus properly to be seen
}


// <!-- To make the preview tab active -->

function makePreviewTabActive() {
  // Takes values from window.editor
  // Do any markdown changes here if you wan to

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
// Removed after shifting to markdown editor
// function changeWindowEditorDescription(textArea) {
//   // Change the editor values
//   window.editor.description = textArea.value;
// }


// <!-- Sccript to open add a note create -->
function newNoteWindow() {
  // This funciton create a new note and call this when you want
  // to create a new note
  // TODO Add a shortcut for calling and creating a new note

  // Save the current note and editor values if changed!
  saveForUnSavedChanges();

  // This creates a new note and also set the currentNote as the new key which is found
  // The current Note is automatically selected and tasks are done in the ref method!!
  addNotefunction('New Note Title', '# New Note')

  // noteFamily.innerHTML = dataToAppend + presentData;
  // Check Now if new note is created!
  // Now open the new note editor

  // Move the values of current note to editor
  window.editor = { id: window.currentNote, title: window.notesData[currentNote].title, description: window.notesData[currentNote].description };
  // Check window.editor have the proper values needed

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
// This function is of not much use after autosave feature implemented
function restoreState() {
  // Makes the description to open with the current Note values 
  // See window.editor here for more info
  window.editor.description = window.notesData[window.currentNote].description;
  makePreviewTabActive();
}

// <!-- Script to update or say save a note and remain at that note -->
function saveNote() {
  updateNotefunction(window.editor.id, window.editor.title, window.editor.description);
  // window.editor has the values and this saves giving a promise

  // Line commented as not needed after autosave
  // restoreState(); // This will be done after the update
  window.editor.description = window.notesData[window.currentNote].description;
}


// <!-- Show delete note modal -->
function openDeleteNoteModal() {
  // This function opens the delete note modal and
  // sets the listeners to the modal buttons

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

  // Making the focus to the confirm delete button
  confirmDelete.focus();
}

// This function deletes the current active note
function deleteCurrentNote() {
  // It deletes the currently selected modal window.currentNote
  // does nothing if no modal is selected

  // Make a confirm message for delete of a note
  deleteNotefunction(window.currentNote);
  byId('note-description-content').innerHTML = '';
  byId('note-description-editor').innerHTML = '';
  byId('note-description-editor').value = '';

  // Empty simple mde the note description editor
  simplemde.value("");

  // Removing current note options
  byId('edit-note-title-box').classList.add('hidden');
  byId('edit-title-button').classList.add('hidden');
  byId('tab-nav').classList.add('hidden');

  // Now no note is in progress to be edited!
  window.currentNote = '';
}

// <!-- Sript to have the values updated -->
window.onbeforeunload = function (event) {
  // If user tried to leave with some values changed, this alerts the user
  try {
    if (window.notesData[window.currentNote].description !== window.editor.description) {
      // Unsaved Changes Found!
      return "you have unsaved changes. Are you sure you want to navigate away?";
    }
  } catch (error) {
    // No unsaved changes as no note selected
  }
};

// <!-- Script to show edit title box -->
function makeEditTitleBoxVisible() {
  // It opens the note title editor for updating it

  let editNoteTitleBox = byId('edit-note-title-box');
  editNoteTitleBox.classList.remove('hidden');
  editNoteTitleBox.getElementsByTagName('input')[0].value = window.editor.title;

  editNoteTitleBox.getElementsByClassName('cancel')[0].onclick = function () {
    editNoteTitleBox.classList.add('hidden');
  }

  // TODO refractor this unciton name and make more clear
  // This updates the title of the note
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
    if (event.keyCode === 13) {
      // Enter key press
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

  firebase.auth().signOut();

  var xhttp = new XMLHttpRequest();

  xhttp.addEventListener("error", function (evt) {
    console.log("Failed");
    // console.log(evt.toString());
  });

  xhttp.addEventListener("load", function (evt) {
    // console.log("Sign Out Success!");
    location.reload();
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
      console.log("Failed");
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

      // Finally reload the page and the user will be logged in
      location.reload();
    });

    // Defining parameters 
    xhttp.open("POST", "/set", true);
    //Send the proper header information along with the request
    xhttp.setRequestHeader("Content-Type", "application/json"); // Necessary for POST
    xhttp.send(JSON.stringify({ userEmail: result.user.email, userDisplayName: result.user.displayName }));

  }).catch(function (err) {
    // console.log(err);
    console.log("Sign in Failed!");
  });
}


/// Below are some features and functionalities that are added overtime
// ADD Any code for additional functionality here

byId('sidebar-toggler').onclick = function () {
  // The sidebar toggler button listener that expands/collapse
  // the lefft sidebar

  var sidbar = byId('sidebar');

  if (screen.width <= 720) {
    sidbar.style.width = "100vw";
  }
  sidbar.classList.add('sidebar-animate');
  sidbar.classList.toggle('hide-sidebar');
  setTimeout(function () {
    sidbar.classList.remove('sidebar-animate');
  }, 500);


  // Updating the icon of the toggler
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

// gloabl keyboard shortcuts
window.onkeydown = function (event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault();
        // console.log("Trigger key press saved");
        // This means save the note now
        if (window.currentNote) {
          saveNote();
          makePreviewTabActive();
        }

        break;
    }
  }
}

// global keyboard shortcuts
document.onkeyup = function (e) {
  if (e.shiftKey && e.which == 46) {
    openDeleteNoteModal()
  }

  else if (e.ctrlKey && e.shiftKey && e.which == 37) {
    byId('side-img').click();
  } else if (e.ctrlKey && e.shiftKey && e.which == 39) {
    byId('side-img').click();
  }
};

/** Mobile Toggler */
byId('top-nav-toggler').onclick = function () {
  byId('top-nav-items').classList.toggle('top-nav-hide');
}

// Share a note
byId('share-img').onclick = function () {
  let url = "/share?id=" + window.currentNote + "&user=" + cuserEmail
  window.open(url);
}

// Download html source function
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

// Toggle split view
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
