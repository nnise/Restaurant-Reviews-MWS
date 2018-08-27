# Restaurant Reviews
---
With this project I became a certified [Mobile Web Specialist](https://confirm.udacity.com/S34CCRNZ) thanks to the Udacity-Google EMEA Scholarship 2018.

![All restaurants screen with map hidden](https://github.com/nnise/Restaurant-Reviews-MWS/blob/master/prjctImgs/desktopHome.png)

![Restauran details sample page](https://github.com/nnise/Restaurant-Reviews-MWS/blob/master/prjctImgs/restaurantDetails.png)

This is a functional mobile-ready web application that includes standard accessibility features, is responsive on different sized displays and is accessible for screen reader users. The application uses Service Worker technology and Background Sync to create a seamless offline experience for users. Users are allowed to create their own reviews for each restaurant and mark their favourites.

![Mobile Home screen with hidden and shown map](https://github.com/nnise/Restaurant-Reviews-MWS/blob/master/prjctImgs/mobileViews.jpg)

The scores of this project in the Lighthouse audit are:

![Lighthouse Audit results](https://github.com/nnise/Restaurant-Reviews-MWS/blob/master/prjctImgs/auditResults.png)

### How to run this application?

You have to run two shell windows on your machine, one acting as the server and the other as the client.

1. [Local Development API Server](#local-development-api-server)
2. [Web app](#run-the-webApp)


## Local Development API Server

First clone or download this [repo](https://github.com/udacity/mws-restaurant-stage-3)

Location of server = /server Server depends on [node.js LTS Version: v6.11.2](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm), and [sails.js](https://sailsjs.com/) Please make sure you have these installed before proceeding forward.

Now you are ready to proceed forward!

Let's start with running commands in your terminal

Install project dependancies
### npm i
Install Sails.js globally
### npm i sails -g
Start the server
### node server
You should now have access to your API server environment
debug: Environment : development debug: Port : 1337


## Run the WebAPP

For running the website, be sure that 

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000/dist`

### Leaflet.js and Mapbox
This repository uses leafletjs with Mapbox. You need to replace <your MAPBOX API KEY HERE> with a token from Mapbox. Mapbox is free to use, and does not require any payment information.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code.

