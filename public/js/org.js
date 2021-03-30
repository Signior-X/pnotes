// Don't forget to include shortcuts.js

let cuserEmail = "";

const renderTheEditor = (cUser) => {
  console.log("render the editor");

  cuserEmail = cUser;

  var script = document.createElement('script');

  script.onload = function () {
    //do stuff with the script
    console.log("script loaded");
    showEls([byId("main-content"), byId("create-note-button")]);
    hideEl(byId("org-container"));
  };

  script.src = "/js/laptop-end.js";

  document.head.appendChild(script);
}

successLogin = (name_org, password) => {
  // Show the data
  byId("user-email-heading").innerHTML = name_org;

  // Final render of the editor
  renderTheEditor(name_org + "__porg__" + password);

  byId("msg").innerHTML = "password set, org has been created!"
  byId("nameOfOrg").style.display = "none"
  byId("checknameBtn").style.display = "none"
  byId("passwordEnter").style.display = "none"
  byId("addPwdBtn").style.display = "none"
}

checkName = () => {
  var name_org = byId("nameOfOrg").value;
  console.log(name_org);
  firebase.firestore().collection("names").doc(name_org).get().then((doc) => {
    // Do all this after the listener checks for the orgs

    // Update the view
    hideEls([byId("nameOfOrg"), byId("checknameBtn")]);
    showEls([byId("passwordEnter"), byId("addPwdBtn")]);

    if (doc.exists) {
      console.log("org exists");
      var password = doc.data()["password"];
      byId("msg").innerHTML = "Org Already Exists; Enter secret code";

      passwordBtn = (doc) => {
        var passwordEntered = byId("passwordEnter").value;

        if (passwordEntered === password) {
          successLogin(name_org, password);
        } else {
          byId("msg").innerHTML = "Incorrect Secret <br> Retry login";
        }
      }

    } else {
      console.log("org created")

      byId("msg").innerHTML = "No such org found, create one <br> Set your secret code"

      passwordBtn = () => {
        var password = byId("passwordEnter").value
        firebase.firestore().collection("names").doc(name_org).set({
          "password": password
        }).then((val) => {
          successLogin(name_org, password);
        }).catch((err) => {
          console.log(err);
        })
      }
    }

    byId("nameOfOrg").value = "";
  })
}


byId("org-name-form").onsubmit = function (e) {
  e.preventDefault();
  checkName();
}

byId("pass-name-form").onsubmit = function (e) {
  e.preventDefault();
  passwordBtn();
}
