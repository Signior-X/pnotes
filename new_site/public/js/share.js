/* This file is for share page */
var getParams = function (url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

// MA1SNDqZrQipZyEG66W
document.addEventListener('DOMContentLoaded', function () {

  const params = getParams(window.location.href);
  console.log("Dom loaded", params);

  var descriptionWindow = document.getElementById('note-description-content');

  if ("id" in params) {
    let user = 'anonymousNotSigned';
    if ("user" in params) {
      user = params['user'];

    } else {
      // firebase.database().ref('/').once('value', function (snapshot) {
      //   console.log(snapshot);

      //   let found = false;

      //   snapshot.forEach(element => {
      //     // Here we have to find the required note
      //     console.log(element);
      //     console.log(element.id);
      //     console.log(element.key);
      //     element.forEach(doc => {
      //       console.log(doc.key);
      //     });
      //   });
      // });
      //
      // Currently we will give the error that user is needed
      console.log("user parameter not provided, using default");
    }

    // We take the case that user exists in params
    const id = params['id'];

    firebase.database().ref(user).child(id).on('value', function (snapshot) {
      // Check if it exists or not
      if (snapshot.exists()) {
        console.log("snaphost exists");
        console.log(snapshot.key);
        console.log(snapshot.val());

        // Now add the description
        descriptionWindow.innerHTML = md.render(snapshot.val()['description']);
        document.getElementById('user-email-heading').innerHTML = snapshot.val()['title'];

        // now change all a tags to have target="_none" in note-description-content
        var anchors = descriptionWindow.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
          anchors[i].setAttribute('target', '_blank');
          anchors[i].setAttribute('rel', "noopener");
        }

        // Change from document to desccription window
        descriptionWindow.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightBlock(block);
        });


      } else {
        console.log("Does not exists!");
        descriptionWindow.innerHTML = 'Does Not Exist';
      }

    });

  } else {
    // This means empty params
    console.log("Id Parameter not provided!");
    descriptionWindow.innerHTML = 'Id Parameter Not Provided!';
  }
});
