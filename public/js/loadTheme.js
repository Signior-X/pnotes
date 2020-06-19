function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

// Load the dark mode if present
var themeData = getCookie('themeData');

console.log("themeData" , themeData);
if(themeData === 'dark') {
  $('body').addClass('dark');
  $('#logo-header').html('<img src="pnotes-logo-dark.png"></img>');
  $('#dark-switcher').html('Switch to Light Mode');
}
