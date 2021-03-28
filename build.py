import requests
import os
import threading
import sys
import shutil


def createJSFile(inputFile='public/', outputFile='templates/game-scripts-min.html'):

    script_file = open(inputFile)

    script = script_file.read()

    url = 'https://javascript-minifier.com/raw'
    myobj = {'input': script}

    x = requests.post(url, data=myobj)

    print(x.status_code)
    # print(x.text)

    minified_file = open(outputFile, 'w')
    minified_file.write(str(x.text))
    print(outputFile + " file made successful")
    script_file.close()
    minified_file.close()


def createCSSMain(inputFile='static/css/main.css', outputFile='static/css/min/main.css'):
    css_file = open(inputFile)

    css = css_file.read()
    # print(css)

    url = 'https://cssminifier.com/raw'
    data = {'input': css}
    x = requests.post(url, data=data)

    print(x.status_code)
    # print(x.text)

    minified_file = open(outputFile, 'w')
    minified_file.write(x.text)
    print(outputFile + " file made successful")
    css_file.close()
    minified_file.close()


if __name__ == '__main__':
    try:
        shutil.rmtree(os.getcwd() + "/build")
    except:
        print("Build not found, automatically will be created.")
    shutil.copytree(os.getcwd() + "/public", os.getcwd() + "/build")
    for subdir, dirs, files in os.walk(os.getcwd() + "/build/css"):
        for file in files:
            filepath = subdir + os.sep + file
            if filepath.split(".")[-1] == "css":
                createCSSMain(inputFile=filepath, outputFile=filepath)
    for subdir, dirs, files in os.walk(os.getcwd() + "/build/js"):
        for file in files:
            filepath = subdir + os.sep + file
            if filepath.split(".")[-1] == "js":
                createJSFile(inputFile=filepath, outputFile=filepath)


    firebase_file = os.getcwd() + "/firebase.json"
    json_data = open(firebase_file).read()
    json_data = json_data.replace('"public": "public"', '"public": "build"')
    open(firebase_file, 'w').write(json_data)
    print("Destination changed to build")

    print("Running firebase deploy!")
    os.system("firebase deploy --only=hosting")

    json_data = open(firebase_file).read()
    json_data = json_data.replace('"public": "build"', '"public": "public"')
    open(firebase_file, 'w').write(json_data)
    print("Destination changed back to public")
