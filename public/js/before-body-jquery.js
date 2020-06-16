$(function() {
    $( "#sidebar" ).resizable();

    $('#preview-button').click(function() {
        // Make edit button as deactivated
        makePreviewTabActive();
    });

    $('#editing-button').click(function() {
        // Make edit button as deactivated
        makeEditTabActive();
    });

});
