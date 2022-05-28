# Blogger101-MobileApp

This is the mobile app for Blogger101!

Blogger101's Website: https://blogger-101.herokuapp.com  
Blogger101's Website's Github: https://github.com/kethan1/blogger101-website  
Link to Expo Snack: https://snack.expo.io/@ketzoomer/blogger101-mobile-app-snack

Built using: [React Native](https://reactnative.dev/), [Expo](https://expo.dev/), and other community made packages.

## Startup Guide

### Setup

Make sure you have nodejs and npm installed. Then, download this repo.

Install the Dependencies:

```
npm install
npm install -g expo-cli
```

Then, run `npm start` in the project folder. The app is up and running!

### Changes to Code

If you want to run this with a local copy of the Blogger101 website (for the API, instead of the actual API), download this repo: https://github.com/kethan1/blogger101-website. Follow the instructions in the README and get a local instance of the website up and running. Then, replace `SERVER_URL` in `src/assets/Globals.js` with `http://localhost:5000`. Then, enter the adb command `adb reverse tcp:5000 tcp:5000`. After that, run `npm start` in this repo's folder.
