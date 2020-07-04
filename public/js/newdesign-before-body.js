// <!-- Script to add the data of the currentNote to description on button click -->
function doOnNoteClick(noteRow) {

    // console.log(md.render('# Remarkable rulezz!'));

    saveForUnSavedChanges();

    // First deselect the current selected Note
    console.log("Current Note", window.currentNote);

    if (window.currentNote) {
        try {
            document.getElementById(window.currentNote).classList.remove('is--active');
            document.getElementById(window.currentNote).classList.add('hoverable');
        } catch (e) {
            console.log("Error currentNote invalid!", e.toString());
        }
    }
    // console.log(noteRow);
    console.log(noteRow.id);

    // Select the note
    window.currentNote = noteRow.id;
    noteRow.classList.add("is--active");
    noteRow.classList.remove("hoverable");

    // Show the remove and edit title buttons
    document.getElementById('remove-note-button').classList.remove('hidden');
    document.getElementById('edit-title-button').classList.remove('hidden');

    // Show the tab-nav
    document.getElementById('tab-nav').classList.remove('hidden');

    // Store the values in editor
    window.editor['id'] = noteRow.id;
    window.editor['title'] = window.notesData[noteRow.id].title;
    window.editor['description'] = window.notesData[noteRow.id].description;
    console.log("Editor changed success!");
    console.log(window.editor);
    // Making the preview tab active
    makePreviewTabActive();
}


// <!-- Tab navigations - To make edit tab active -->

// Remember click actions are taken care by jquery

function makeEditTabActive() {

    // console.log(window.editor);

    // Now add the description
    var editorWindowTextArea = document.getElementById('note-description-editor');
    editorWindowTextArea.innerHTML = window.editor.description;
    editorWindowTextArea.value = window.editor.description;

    document.getElementById('editing-button').classList.add('tab-active');
    document.getElementById('preview-button').classList.remove('tab-active');

    document.getElementById('note-description-content').classList.add('hidden');
    document.getElementById('note-description-preview').classList.remove('hidden');

    $('#note-description-editor').focus();
}


// <!-- To make the preview tab active -->

function makePreviewTabActive() {

    // console.log(window.editor);

    // Now update the preview with the editor values

    // Now add the description
    var descriptionWindow = document.getElementById('note-description-content');
    descriptionWindow.innerHTML = md.render(window.editor.description);

    // now change all a tags to have target="_none" in note-description-content
    var anchors = descriptionWindow.getElementsByTagName('a');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].setAttribute('target', '_blank');
    }

    // Change from document to desccription window
    descriptionWindow.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

    document.getElementById('preview-button').classList.add('tab-active');
    document.getElementById('editing-button').classList.remove('tab-active');

    document.getElementById('note-description-preview').classList.add('hidden');
    document.getElementById('note-description-content').classList.remove('hidden');
}


// <!-- Script to change the editor values on textarea change -->
function changeWindowEditorDescription(textArea) {
    console.log("Text Area changed!");

    // Choose which is better value comes as the real time parameter
    // console.log(textArea.innerHTML);
    // console.log(textArea.value);

    // Change the editor values
    window.editor.description = textArea.value;
}


// <!-- Sccript to open add a note create -->
function newNoteWindow() {

    // Save the current note and editor values if changed!
    saveForUnSavedChanges();

    // This creates a new note and also set the currentNote as the new key which is found
    // The current Note is automatically selected and tasks are done in the ref method!!
    var returened = addNotefunction('New Note Title', '# New Note')
    console.log(returened);

    // noteFamily.innerHTML = dataToAppend + presentData;
    console.log("Check Now if new note is created!");
    console.log("Now open the new note editor");

    // Move the values of current note to editor
    window.editor = { id: window.currentNote, title: window.notesData[currentNote].title, description: window.notesData[currentNote].description };
    console.log(window.editor);

    document.getElementById('tab-nav').classList.remove('hidden');
    makeEditTabActive();  // This sets focus to description editor

    // First show the buttons of top nav
    // Show the remove and edit title buttons
    document.getElementById('remove-note-button').classList.remove('hidden');
    document.getElementById('edit-title-button').classList.remove('hidden');

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
    console.log(window.editor);
    var promisedResult = updateNotefunction(window.editor.id, window.editor.title, window.editor.description);
    console.log(promisedResult);

    restoreState(); // This will be done after the update

}


// <!-- Show delete note modal -->
function openDeleteNoteModal() {
    var deleteModal = document.getElementById("delete-modal");
    deleteModal.classList.remove('hidden');

    deleteModal.getElementsByClassName("close")[0].onclick = function () {
        deleteModal.classList.add('hidden');
    }

    deleteModal.getElementsByClassName("cancel")[0].onclick = function () {
        deleteModal.classList.add('hidden');
    }

    confirmDelete = deleteModal.getElementsByClassName("confirm-delete")[0];
    confirmDelete.onclick = function () {
        deleteCurrentNote();
        deleteModal.classList.add('hidden');
    }
    document.getElementById('modal-message-p').innerHTML = 'Are you sure you want to delete ' + window.editor.title + '?'

}

// This function deletes the current active note
function deleteCurrentNote() {

    console.log(window.currentNote);

    // Make a confirm message for delete of a note
    var onDeletePromise = deleteNotefunction(window.currentNote);
    document.getElementById('note-description-content').innerHTML = '';
    document.getElementById('note-description-editor').innerHTML = '';
    document.getElementById('note-description-editor').value = '';
    document.getElementById('remove-note-button').classList.add('hidden');
    document.getElementById('edit-note-title-box').classList.add('hidden');
    document.getElementById('edit-title-button').classList.add('hidden');
    document.getElementById('tab-nav').classList.add('hidden');

    window.currentNote = ''; // Now no note is in progress to be edited!
}

// <!-- Sript to have the values updated -->
window.onbeforeunload = function(event) {
    // do stuff here
    if(window.notesData[window.currentNote].description !== window.editor.description) {
        console.log('Unsaved Changes Found!');
        return "you have unsaved changes. Are you sure you want to navigate away?";
    } else {
        console.log("No unsaved changes found");
    }
};

// <!-- Script to show edit title box -->
function makeEditTitleBoxVisible() {

    console.log("Update title");
    editNoteTitleBox = document.getElementById('edit-note-title-box');
    editNoteTitleBox.classList.remove('hidden');
    editNoteTitleBox.getElementsByTagName('input')[0].value = window.editor.title;

    editNoteTitleBox.getElementsByClassName('cancel')[0].onclick = function () {
        editNoteTitleBox.classList.add('hidden');
    }

    function NotePageVisible () { //Due to repetion of code i created this function
        var editNoteTitleIinputValue = document.getElementById('edit-note-title-input').value;
        if(editNoteTitleIinputValue.toString().trim() === '') {
            alert('Note Title Cannot be empty!');
        } else {
            updateNotefunction(window.currentNote, editNoteTitleIinputValue, window.notesData[window.currentNote].description);
            window.editor['title'] = editNoteTitleIinputValue; // As editor needs also be updated
            editNoteTitleBox.classList.add('hidden');
        }
    }
    editNoteTitleBox.getElementsByClassName('save')[0].addEventListener("click", NotePageVisible); 
    editNoteTitleBox.addEventListener("keypress",(event) => {
        console.log(event.keyCode)
        if (event.keyCode === 13){
            NotePageVisible();    
        }    
    });

    // Make focus to the input!
    $('#edit-note-title-input').focus();
}

function saveForUnSavedChanges() {

    console.log('Trying to save unsaved changes if present');
    if(window.currentNote && window.currentNote !== '') {
        // Current note is not empty
        console.log('Current Note is not empty');
        if(window.notesData[currentNote].description !== window.editor.description){
            console.log('Unsaved changes found!');

            // Right now the state is not restored, so no problem
            // The firebase reference makes the current Note available

            // Now save the note
            // console.log(window.editor);
            var promisedResult = updateNotefunction(window.editor.id, window.editor.title, window.editor.description);
            console.log(promisedResult);

            // No need for restore changes as that will be done by the function who called this function
        }
    }
}

// The work for tabs done by Prashant
HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
    return this.selectionStart;
};

HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
    this.selectionStart = position;
    this.selectionEnd = position;
    this.focus();
};

var textarea = document.getElementById('note-description-editor');
// console.log(textarea)
textarea.onkeydown = function (event) {

    // support tab on textarea
    if (event.keyCode == 9) { // tab was pressed
        var newCaretPosition;
        newCaretPosition = textarea.getCaretPosition() + "    ".length;
        textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + "    " + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
        textarea.setCaretPosition(newCaretPosition);
        return false;
    }
};
// End of Tabs work

 // const serachValue = document.getElementById("search-input");
 // serachValue.addEventListener("input",() => {
 //    console.log(serachValue.value)
 // })
const noteFamily = document.getElementById("note-family").childNodes;


const  ForSearchingNote = () => {
    const searchValue = document.getElementById("search-input");
    for (let i = 0; i < noteFamily.length; i++) { 
        if(noteFamily[i].childNodes[0].textContent.toLowerCase().includes(searchValue.value.toLowerCase())){
            if(noteFamily[i].classList.value.includes("hidden")){
                noteFamily[i].classList.remove("hidden");
            }
        }else{
            noteFamily[i].classList.add("hidden");
        }
    }

   
   
};