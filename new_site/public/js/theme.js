/* Not only for theme, can be used where needed many pages scripts */
// Take care to load shortcuts.js file first

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

function changeToDark() {
  byId('logo-header').innerHTML = '<img src="pnotes-logo-dark.png"></img>';
  document.getElementsByTagName('body')[0].classList.add('dark');
  byId('dark-switcher').innerHTML = 'Light Mode';
}

function changeToLight() {
  byId('logo-header').innerHTML = '<img src="pnotes-logo3.png"></img>';
  document.getElementsByTagName('body')[0].classList.remove('dark');
  byId('dark-switcher').innerHTML = 'Dark Mode';
}

byId('dark-switcher').onclick = function () {
  if (document.getElementsByTagName('body')[0].classList.contains('dark')) {
    // console.log('Already in Dark mode, switching to light');
    changeToLight();
  } else {
    changeToDark();
  }
};

var themeData = getCookie('themeData');
// console.log("themeData", themeData);
if ((!themeData) || (themeData === 'dark')) {
  changeToDark();
} else {
  changeToLight();
}
