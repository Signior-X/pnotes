/* Not only for theme, can be used where needed many pages scripts */

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
  document.getElementById('logo-header').innerHTML = '<img src="pnotes-logo-dark.png"></img>';
  document.getElementsByTagName('body')[0].classList.add('dark');
  document.getElementById('dark-switcher').innerHTML = 'Light Mode';
}

function changeToLight() {
  document.getElementById('logo-header').innerHTML = '<img src="pnotes-logo3.png"></img>';
  document.getElementsByTagName('body')[0].classList.remove('dark');
  document.getElementById('dark-switcher').innerHTML = 'Dark Mode';
}

document.getElementById('dark-switcher').onclick = function () {
  if (document.getElementsByTagName('body')[0].classList.contains('dark')) {
    console.log('Already in Dark mode, switching to light');
    changeToLight();
  } else {
    changeToDark();
  }
};

var themeData = getCookie('themeData');
console.log("themeData", themeData);
if ((!themeData) || (themeData === 'dark')) {
  changeToDark();
} else {
  changeToLight();
}

/** Mobile Toggler */
console.log("y")
document.getElementById('top-nav-toggler').onclick = function() {
  console.log("Togller")
  document.getElementById('top-nav-items').classList.toggle('top-nav-hide');
}
