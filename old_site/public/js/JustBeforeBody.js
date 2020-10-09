// Script for all add note form and all
function openAddNoteModal() {

    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // empty the textboxes
    var formNoteTitle = document.getElementById('add-title');
    var formNoteDescr = document.getElementById('add-description');
    formNoteDescr.innerHTML = '';
    formNoteTitle.value = '';
    formNoteDescr.value = '';

    // Now for the submit button
    var submitAddNote = document.getElementById('add-note-submit-button');
    submitAddNote.innerHTML = 'Add Note';

    submitAddNote.onclick = function () {

        var addNoteTitle = document.getElementById('add-title').value;
        var addNoteDescription = document.getElementById('add-description').value;
        //console.log(addNoteTitle);
        //console.log(addNoteDescription);
        if (addNoteTitle) {
            // Note title not empty
            // Now do the thing which you want to do call addNotefunction
            addNotefunction(addNoteTitle, addNoteDescription);

            formNoteTitle.value = '';
            formNoteDescr.innerHTML = '';

            modal.style.display = "none";

        } else {
            //Empty
            console.log("Empty Note Title");
            modal.style.display = "none";
        }
    }
}

function openDeleteNoteModal(noteRowId) {
    // Get the modal
    var modal = document.getElementById("deleteModal");
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = modal.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    var cancel = modal.getElementsByClassName("cancel")[0];
    cancel.onclick = function () {
        modal.style.display = "none";
    }

    confirmDelete = modal.getElementsByClassName("confirm-delete")[0];
    confirmDelete.onclick = function () {
        deleteNotefunction(noteRowId);
        modal.style.display = "none";
    }
}

function expandCollapseFun(divId) {
    try {
        var clickedDiv = document.getElementById(divId);
        var descMd = clickedDiv.getElementsByClassName('note-descripiton-md')[0];
        // console.log(descMd);

        var expBtnStyle = clickedDiv.getElementsByTagName('i')[0];
        if (descMd.style.display === 'none') {
            // This is collapsed
            // Expand this
            descMd.style.display = "block";
            expBtnStyle.innerHTML = "&#xf106;";
        } else {
            expBtnStyle.innerHTML = "&#xf107;"
            descMd.style.display = "none";
        }
    } catch (e) {
        console.log(e);
        console.log("Ignore this message, this comes when remove is done")
    }
}
