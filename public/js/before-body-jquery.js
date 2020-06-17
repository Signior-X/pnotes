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

    $('#dark-switcher').click(function() {
        if($('body').hasClass('dark')) {
            console.log('Already in Dark mode, switching to light');
            $('#logo-header').html('<img src="pnotes-logo3.png"></img>');
            $('body').removeClass('dark');
        } else{
            $('#logo-header').html('<img src="pnotes-logo-dark.png"></img>');
            $('body').addClass('dark');
        }
    });

    $('#note-description-editor').bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                // This means save the note now
                event.preventDefault();
                saveNote();
                break;
            }
        }
    });
});
