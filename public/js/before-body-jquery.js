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
            $('body').removeClass('dark');
        } else{
            $('body').addClass('dark');
        }
    });

});
