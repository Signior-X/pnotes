// <!-- Script to add the data of the currentNote to description on button click -->
function doOnNoteClick(noteRow) {

    // console.log(md.render('# Remarkable rulezz!'));

    // First deselect the current selected Note
    console.log(window.currentNote);

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

// <!-- Sript to have the values updated -->
// window.onbeforeunload = function(event) {
//     // do stuff here
//     return "you have unsaved changes. Are you sure you want to navigate away?";
// };
