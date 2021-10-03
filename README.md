![Pnotes Banner](https://i.imgur.com/o8ETSv3.png)  

# pnotesapp
The Web app to store notes and have them sync with the Pnotes Android App.
Check out the Android app at https://github.com/Signior-X/Pnotes-android

## Want to contribute
Contributing has never been made more easy than before now.
The project is simple to setup. Just open the public folder and run using
```
python3 -m http.server
```

The app will get started.

Below steps are not needed if you ran with the above method.

## A more tedious and older way (Removed now - Not recommended)
You can also run the project with nodeJS using Firebase.

- First you need access to my firebase project, for that contact me to have access to the project. 
- Then install the firebase tools and cli needed to run this. For that visit https://firebase.google.com/docs/cli
- Login with your id which has access to the project.
- Then Install dependencies using npm
Open the folder and move into function folder using 
```
cd functions
```
In functions folder run
```
npm install
```
This will install all node packages.

- To run the server
Open the root directory and then for running the local server
```
firebase serve
```
Server will be opened at the localhost port 5000, visit it in your browser

## What's new
This project now works without Node.js
A major breaking change while removing google sign in feature also.
